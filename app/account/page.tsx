"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function AccountPage() {
  const [username, setUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userData.user.id)
        .single();

      if (profile?.username) {
        setUsername(profile.username);
        setCurrentUsername(profile.username);
      }

      setLoading(false);
    }

    load();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    const cleanUsername = username.trim();

    if (cleanUsername.length < 3) {
      setMessageType("error");
      setMessage("Je gebruikersnaam moet minstens 3 tekens lang zijn.");
      setSaving(false);
      return;
    }

    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(cleanUsername)) {
      setMessageType("error");
      setMessage("Alleen letters, cijfers en underscores (_) zijn toegestaan.");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ username: cleanUsername })
      .eq("id", userData.user.id);

    setSaving(false);

    if (error) {
      if (error.message.includes("duplicate") || error.message.includes("unique")) {
        setMessageType("error");
        setMessage("Deze gebruikersnaam is al in gebruik. Kies een andere.");
      } else {
        setMessageType("error");
        setMessage("Er ging iets mis: " + error.message);
      }
    } else {
      setMessageType("success");
      setMessage("Je gebruikersnaam is opgeslagen!");
      setCurrentUsername(cleanUsername);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-md mx-auto">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-black mb-6 inline-block"
        >
          ← Terug naar dashboard
        </Link>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold mb-2">Account instellingen</h1>
          <p className="text-sm text-gray-500 mb-6">
            Je gebruikersnaam is zichtbaar op de ranglijst, in plaats van je
            e-mailadres.
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Gebruikersnaam
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="bijv. jan_verkoopt"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-400 mt-1">
                Minstens 3 tekens. Alleen letters, cijfers en underscores.
              </p>
            </div>

            {message && (
              <p
                className={`text-sm ${
                  messageType === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || username.trim() === currentUsername}
              className="w-full bg-black text-white rounded-lg py-2 font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {saving ? "Bezig..." : "Opslaan"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}