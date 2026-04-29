import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { WaitlistUser } from "../../types/admin";
import { Download, Search, Filter } from "lucide-react";

export function WaitlistManagement() {
  const [waitlist, setWaitlist] = useState<WaitlistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "restaurant_owner">("all");

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "waitlist_signups"), orderBy("signed_up_at", "desc"));
      const querySnapshot = await getDocs(q);
      const users: WaitlistUser[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().email || "N/A",
        email: doc.data().email || "N/A",
        role: doc.data().source_page?.includes("restaurant") ? "restaurant_owner" : "user",
        joinedDate: doc.data().signed_up_at?.toDate() || new Date(),
        preferences: doc.data().status,
      }));
      setWaitlist(users);
      setError(null);
    } catch (err) {
      console.error("Error fetching waitlist:", err);
      setError("Failed to load waitlist");
    } finally {
      setLoading(false);
    }
  };

  const filteredWaitlist = waitlist.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const exportCSV = () => {
    const headers = ["Name", "Email", "Role", "Joined Date"];
    const data = filteredWaitlist.map((user) => [
      user.name,
      user.email,
      user.role,
      user.joinedDate.toLocaleDateString(),
    ]);

    const csv = [
      headers.join(","),
      ...data.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{waitlist.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm">Restaurant Owners</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {waitlist.filter((u) => u.role === "restaurant_owner").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm">Regular Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {waitlist.filter((u) => u.role === "user").length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1 relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="restaurant_owner">Restaurant Owner</option>
              </select>
            </div>

            <button
              onClick={exportCSV}
              disabled={filteredWaitlist.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin">
            <div className="h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
          </div>
        </div>
      ) : filteredWaitlist.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No waitlist users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaitlist.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-3 text-gray-700">{user.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "restaurant_owner"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role === "restaurant_owner" ? "Restaurant Owner" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {user.joinedDate.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
