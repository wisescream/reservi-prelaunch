import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { RestaurantLead } from "../../types/admin";
import { Search, Mail, Phone, MapPin } from "lucide-react";

export function RestaurantLeads() {
  const [leads, setLeads] = useState<RestaurantLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "interested" | "partner">("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "partner_requests"), orderBy("submitted_at", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsData: RestaurantLead[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        restaurantName: doc.data().restaurant_name || "N/A",
        contactEmail: doc.data().contact_email || "N/A",
        phone: doc.data().phone || "N/A",
        city: doc.data().city || "N/A",
        message: doc.data().about || doc.data().message || "",
        submittedDate: doc.data().submitted_at?.toDate() || new Date(),
        status: doc.data().status || "new",
      }));
      setLeads(leadsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to load restaurant leads");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: RestaurantLead["status"]) => {
    try {
      await updateDoc(doc(db, "partner_requests", id), { status: newStatus });
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
      );
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      interested: "bg-purple-100 text-purple-800",
      partner: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm">Total Leads</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{leads.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm">New</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {leads.filter((l) => l.status === "new").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm">Interested</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {leads.filter((l) => l.status === "interested").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm">Partners</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {leads.filter((l) => l.status === "partner").length}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by restaurant, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="partner">Partner</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin">
            <div className="h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No restaurant leads found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{lead.restaurantName}</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${lead.contactEmail}`} className="hover:text-black">
                        {lead.contactEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${lead.phone}`} className="hover:text-black">
                        {lead.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      {lead.city}
                    </div>
                  </div>
                  {lead.message && (
                    <p className="mt-3 text-sm text-gray-700 italic">"{lead.message}"</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Submitted: {lead.submittedDate.toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="partner">Partner</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
