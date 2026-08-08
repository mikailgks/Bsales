"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

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
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white mb-6 inline-block">
          ← Terug naar Home
        </Link>
        <h1 className="text-3xl font-bold mb-6">Volledige Ranglijst</h1>

        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Laden...</div>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border-b border-gray-800 last:border-none"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-400">#{index + 1}</span>
                  <span>{user.full_name || user.email?.split("@")[0] || "Anoniem"}</span>
                </div>
                <div className="flex gap-6 text-sm">
                  <span className="text-gray-400">{user.total_sales || 0} verkopen</span>
                  <span className="text-green-400 font-bold">€{user.total_revenue || 0}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400">Geen verkopers gevonden.</div>
          )}
        </div>
      </div>
    </main>
  );
}