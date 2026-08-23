"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LeaderboardUser {
  id: string;
  email: string;
  full_name?: string;
  total_sales: number;
  total_revenue: number;
}

export default function RanglijstPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, total_sales, total_revenue")
        .order("total_revenue", { ascending: false });

      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h1 className="font-display text-3xl font-bold mb-2 text-[var(--ink)]">Volledige Ranglijst</h1>
        <p className="text-gray-600 mb-8">De verkopers met de hoogste omzet, bovenaan.</p>

        <div className="bg-white rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Laden...</div>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border-b border-[var(--border)] last:border-none"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display font-bold text-gray-400 w-6">#{index + 1}</span>
                  <span className="text-[var(--ink)]">{user.full_name || user.email?.split("@")[0] || "Anoniem"}</span>
                </div>
                <div className="flex gap-6 text-sm items-center">
                  <span className="text-gray-500">{user.total_sales || 0} verkopen</span>
                  <span className="text-[var(--accent-dark)] font-bold">€{user.total_revenue || 0}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">Geen verkopers gevonden.</div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}