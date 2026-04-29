import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Analytics } from "../../types/admin";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Building2, Zap } from "lucide-react";

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalWaitlistUsers: 0,
    totalRestaurantLeads: 0,
    signupsLast7Days: 0,
    restaurantLeadsLast7Days: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyData, setDailyData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get total waitlist users
      const waitlistSnap = await getDocs(collection(db, "waitlist_signups"));
      const totalWaitlist = waitlistSnap.size;

      // Get total restaurant leads
      const leadsSnap = await getDocs(collection(db, "partner_requests"));
      const totalLeads = leadsSnap.size;

      // Get signups last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const waitlistLast7 = await getDocs(
        query(
          collection(db, "waitlist_signups"),
          where("signed_up_at", ">=", sevenDaysAgo),
          orderBy("signed_up_at", "desc")
        )
      );
      const signupsLast7 = waitlistLast7.size;

      const leadsLast7 = await getDocs(
        query(
          collection(db, "partner_requests"),
          where("submitted_at", ">=", sevenDaysAgo),
          orderBy("submitted_at", "desc")
        )
      );
      const leadsLast7Count = leadsLast7.size;

      // Calculate conversion rate (restaurant leads / total waitlist * 100)
      const conversionRate = totalWaitlist > 0 ? (totalLeads / totalWaitlist) * 100 : 0;

      setAnalytics({
        totalWaitlistUsers: totalWaitlist,
        totalRestaurantLeads: totalLeads,
        signupsLast7Days: signupsLast7,
        restaurantLeadsLast7Days: leadsLast7Count,
        conversionRate: Math.round(conversionRate * 100) / 100,
      });

      // Generate daily data for chart
      const dailyMap: Record<string, { date: string; signups: number; leads: number }> = {};
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toLocaleDateString();
        dailyMap[dateKey] = {
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          signups: 0,
          leads: 0
        };
      }

      waitlistLast7.forEach(doc => {
        const d = doc.data().signed_up_at?.toDate();
        if (d) {
          const dateKey = d.toLocaleDateString();
          if (dailyMap[dateKey]) dailyMap[dateKey].signups++;
        }
      });

      leadsLast7.forEach(doc => {
        const d = doc.data().submitted_at?.toDate();
        if (d) {
          const dateKey = d.toLocaleDateString();
          if (dailyMap[dateKey]) dailyMap[dateKey].leads++;
        }
      });

      setDailyData(Object.values(dailyMap));
      setError(null);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };



  const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
    color,
  }: {
    icon: any;
    label: string;
    value: number | string;
    trend?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend} this week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

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
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Waitlist Users"
          value={analytics.totalWaitlistUsers}
          trend={`+${analytics.signupsLast7Days}`}
          color="bg-blue-500"
        />
        <StatCard
          icon={Building2}
          label="Restaurant Leads"
          value={analytics.totalRestaurantLeads}
          trend={`+${analytics.restaurantLeadsLast7Days}`}
          color="bg-purple-500"
        />
        <StatCard
          icon={Zap}
          label="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          color="bg-orange-500"
        />
        <StatCard
          icon={TrendingUp}
          label="7-Day Signups"
          value={analytics.signupsLast7Days}
          color="bg-green-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Signups Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Signups</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#000000"
                dot={{ fill: "#000000", r: 4 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Restaurant Leads Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Leads Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leads" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Pre-Launch Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-300 text-sm">Active Waitlist</p>
            <p className="text-2xl font-bold mt-2">
              {analytics.totalWaitlistUsers.toLocaleString()} people
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Partner Interest</p>
            <p className="text-2xl font-bold mt-2">
              {analytics.totalRestaurantLeads.toLocaleString()} leads
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Market Response</p>
            <p className="text-2xl font-bold mt-2">{analytics.conversionRate}% conversion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
