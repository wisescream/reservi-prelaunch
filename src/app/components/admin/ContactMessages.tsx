import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { ContactMessage } from "../../../types/admin";
import { Mail, CheckCircle, Clock } from "lucide-react";

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "contact_messages"), orderBy("submitted_at", "desc"));
      const querySnapshot = await getDocs(q);
      const messagesData: ContactMessage[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "N/A",
        email: doc.data().email || "N/A",
        subject: doc.data().subject || "N/A",
        message: doc.data().message || "",
        submittedAt: doc.data().submitted_at?.toDate() || new Date(),
        status: doc.data().status || "new",
      }));
      setMessages(messagesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
      setError("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, newStatus: ContactMessage["status"]) => {
    try {
      await updateDoc(doc(db, "contact_messages", id), { status: newStatus });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
    } catch (err) {
      console.error("Error updating message status:", err);
      alert("Failed to update status");
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

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg m-6">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Contact Messages</h2>
        <p className="text-gray-500">Manage inquiries from the contact form</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold w-1/3">Message</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{msg.name}</div>
                      <div className="text-gray-500">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{msg.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 line-clamp-2">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {msg.submittedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          msg.status === "new"
                            ? "bg-blue-50 text-blue-700"
                            : msg.status === "replied"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {msg.status === "new" && <Mail className="w-3.5 h-3.5" />}
                        {msg.status === "read" && <Clock className="w-3.5 h-3.5" />}
                        {msg.status === "replied" && <CheckCircle className="w-3.5 h-3.5" />}
                        <span className="capitalize">{msg.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={msg.status}
                        onChange={(e) =>
                          updateMessageStatus(msg.id, e.target.value as ContactMessage["status"])
                        }
                        className="text-sm border-gray-300 rounded-md focus:ring-black focus:border-black"
                      >
                        <option value="new">Mark as New</option>
                        <option value="read">Mark as Read</option>
                        <option value="replied">Mark as Replied</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
