import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Building2, TrendingUp, AlertCircle } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalWaitlist: 0,
    totalLeads: 0,
    weeklySignups: 0,
    weeklyLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get stats
      const waitlistSnap = await getDocs(collection(db, "waitlist_signups"));
      const leadsSnap = await getDocs(collection(db, "partner_requests"));

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const weeklyWaitlist = await getDocs(
        query(
          collection(db, "waitlist_signups"),
          where("signed_up_at", ">=", sevenDaysAgo)
        )
      );

      const weeklyLeadsSnap = await getDocs(
        query(
          collection(db, "partner_requests"),
          where("submitted_at", ">=", sevenDaysAgo)
        )
      );

      setStats({
        totalWaitlist: waitlistSnap.size,
        totalLeads: leadsSnap.size,
        weeklySignups: weeklyWaitlist.size,
        weeklyLeads: weeklyLeadsSnap.size,
      });

      // Get recent activity
      const recentWaitlist = await getDocs(
        query(collection(db, "waitlist_signups"), orderBy("signed_up_at", "desc"))
      );
      const recentLeads = await getDocs(
        query(collection(db, "partner_requests"), orderBy("submitted_at", "desc"))
      );

      const activity = [
        ...recentWaitlist.docs.slice(0, 3).map((doc) => ({
          type: "waitlist",
          name: doc.data().email,
          action: "joined waitlist",
          time: doc.data().signed_up_at?.toDate(),
        })),
        ...recentLeads.docs.slice(0, 3).map((doc) => ({
          type: "lead",
          name: doc.data().restaurant_name,
          action: "submitted partnership inquiry",
          time: doc.data().submitted_at?.toDate(),
        })),
      ];

      setRecentActivity(activity.sort((a, b) => b.time - a.time).slice(0, 5));

      // Build daily chart data
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dailyMap: Record<string, { day: string; signups: number; leads: number }> = {};
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toLocaleDateString();
        dailyMap[dateKey] = {
          day: days[d.getDay()],
          signups: 0,
          leads: 0
        };
      }

      weeklyWaitlist.forEach(doc => {
        const d = doc.data().signed_up_at?.toDate();
        if (d) {
          const dateKey = d.toLocaleDateString();
          if (dailyMap[dateKey]) dailyMap[dateKey].signups++;
        }
      });

      weeklyLeadsSnap.forEach(doc => {
        const d = doc.data().submitted_at?.toDate();
        if (d) {
          const dateKey = d.toLocaleDateString();
          if (dailyMap[dateKey]) dailyMap[dateKey].leads++;
        }
      });

      setChartData(Object.values(dailyMap));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Waitlist</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.totalWaitlist}</p>
              <p className="text-xs text-green-600 mt-2">+{stats.weeklySignups} this week</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Restaurant Leads</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.totalLeads}</p>
              <p className="text-xs text-green-600 mt-2">+{stats.weeklyLeads} this week</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {stats.totalWaitlist > 0
                  ? ((stats.totalLeads / stats.totalWaitlist) * 100).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-500 mt-2">Leads vs Waitlist</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Weekly Growth</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {((stats.weeklySignups + stats.weeklyLeads) / Math.max(stats.totalWaitlist + stats.totalLeads, 1)) * 100 || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-2">New signups rate</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#000000"
                dot={{ fill: "#000000", r: 4 }}
                strokeWidth={2}
                name="Signups"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leads Trend */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Partnership Leads Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leads" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-gray-600 text-sm">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ${
                      activity.type === "waitlist" ? "bg-blue-500" : "bg-purple-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{activity.name}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {activity.time ? new Date(activity.time).toLocaleDateString() : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">Pre-Launch Status</h3>
        <p className="text-gray-300 text-sm mb-4">
          Your Reservi pre-launch is live and collecting interest. Monitor your dashboard to track growth and manage
          leads. All data updates in real-time from your Firestore database.
        </p>
        <div className="flex gap-3 text-xs">
          <span className="px-3 py-1 bg-white/20 rounded-full">🚀 Launch: May 18, 2026</span>
          <span className="px-3 py-1 bg-white/20 rounded-full">📊 Real-time Analytics</span>
          <span className="px-3 py-1 bg-white/20 rounded-full">🔐 Secure Admin Access</span>
        </div>
      </div>
    </div>
  );
}
