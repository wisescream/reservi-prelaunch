import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { PlatformSettings } from "../../types/admin";
import { Save, AlertCircle } from "lucide-react";

export function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    launchDate: "2026-05-18T18:19:19",
    heroHeadline: "The modern way to book restaurants",
    enableWaitlist: true,
    enablePartnerSignup: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settingsDoc = await getDoc(doc(db, "settings", "global"));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as PlatformSettings);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, "settings", "global"), settings);
      setMessage({ type: "success", text: "Settings saved successfully" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
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
      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Launch Configuration */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Launch Configuration</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="launchDate" className="block text-sm font-medium text-gray-700 mb-2">
                Launch Date & Time
              </label>
              <input
                id="launchDate"
                type="datetime-local"
                value={settings.launchDate}
                onChange={(e) =>
                  setSettings({ ...settings, launchDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for countdown timer on homepage
              </p>
            </div>

            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-2">
                Hero Headline
              </label>
              <input
                id="headline"
                type="text"
                value={settings.heroHeadline}
                onChange={(e) =>
                  setSettings({ ...settings, heroHeadline: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Main headline displayed on homepage
              </p>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Toggles</h3>
          <div className="space-y-4">
            {/* Waitlist */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable Waitlist Form</p>
                <p className="text-xs text-gray-600 mt-1">
                  Allow users to join the waitlist
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, enableWaitlist: !settings.enableWaitlist })
                }
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition ${
                  settings.enableWaitlist ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.enableWaitlist ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Partner Signup */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable Partner Signup</p>
                <p className="text-xs text-gray-600 mt-1">
                  Allow restaurants to submit partnership inquiries
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    enablePartnerSignup: !settings.enablePartnerSignup,
                  })
                }
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition ${
                  settings.enablePartnerSignup ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.enablePartnerSignup ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>


          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Configuration Notes</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            • <strong>Launch Date:</strong> The countdown timer on the homepage will count down to this date and time
          </li>
          <li>
            • <strong>Feature Toggles:</strong> Turn off forms to temporarily disable user signups
          </li>

          <li>
            • All changes are saved to Firestore and will take effect immediately
          </li>
        </ul>
      </div>
    </div>
  );
}
