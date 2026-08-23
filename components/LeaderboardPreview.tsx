"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface LeaderboardUser {
  id: string;
  email: string;
  username: string | null;
  total_sales: number;
  total_revenue: number;
}

export default function LeaderboardPreview() {
  const [topSellers, setTopSellers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopSellers() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, username, total_sales, total_revenue")
        .order("total_revenue", { ascending: false })
        .limit(5);

      if (!error && data) setTopSellers(data);
      setLoading(false);
    }

    fetchTopSellers();
  }, []);

  function getDisplayName(seller: LeaderboardUser) {
    return seller.username || "Anonieme verkoper";
  }

  return (
    <section id="ranglijst" className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ranglijst</h2>
        <p className="text-gray-400 mb-10 sm:mb-12 max-w-xl mx-auto">
          De beste verkopers van dit moment. Klim jij ook mee naar de top?
        </p>

        <div className="bg-gray-800 rounded-xl overflow-hidden text-left shadow-lg">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Laden...</div>
          ) : topSellers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Nog geen verkopers op de ranglijst.</div>
          ) : (
            topSellers.map((seller, index) => {
              const rank = index + 1;
              return (
                <div key={seller.id} className="flex items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b border-gray-700 last:border-none">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className={`w-8 flex-shrink-0 text-center font-bold ${rank === 1 ? "text-yellow-400 text-xl" : "text-gray-400"}`}>
                      {rank === 1 ? "👑" : `#${rank}`}
                    </span>
                    <span className="font-medium truncate">{getDisplayName(seller)}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 flex flex-col sm:flex-row sm:gap-6 items-end sm:items-center flex-shrink-0">
                    <span>{seller.total_sales || 0} verkopen</span>
                    <span className="text-green-400 font-semibold">
                      €{(seller.total_revenue || 0).toLocaleString("nl-NL")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Link href="/producten" className="inline-block mt-8 sm:mt-10 px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
          Bekijk producten
        </Link>
      </div>
    </section>
  );
}  