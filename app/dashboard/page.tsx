"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Profile = {
  email: string;
  username: string | null;
  total_profit: number;
  total_revenue: number;
  total_sales: number;
  xp: number;
  level: number;
};

type RecentClaim = {
  id: string;
  status: string;
  claimed_at: string;
  profit: number;
  products: { name: string };
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentClaims, setRecentClaims] = useState<RecentClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("email, username, total_profit, total_revenue, total_sales, xp, level")
        .eq("id", userData.user.id)
        .single();

      setProfile(profileData);

      const { data: claimsData } = await supabase
        .from("claims")
        .select("id, status, claimed_at, profit, products(name)")
        .eq("user_id", userData.user.id)
        .order("claimed_at", { ascending: false })
        .limit(5);

      setRecentClaims((claimsData as any) || []);
      setLoading(false);
    }

    loadData();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function statusText(status: string) {
    if (status === "geclaimd") return "Geclaimd — nog te verkopen";
    if (status === "verkocht") return "Verkocht — wacht op betaling";
    if (status === "uitbetaald") return "Verkocht en uitbetaald";
    if (status === "verlopen") return "Deadline verstreken";
    if (status === "verlopen_verwerkt") return "Deadline verstreken";
    return status;
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </main>
    );
  }

  const displayName = profile?.username || profile?.email;
  const currentLevel = profile?.level ?? 1;
  const currentXp = profile?.xp ?? 0;
  const xpIntoLevel = currentXp % 100;

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 sm:mb-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold break-words">
              Welkom terug, {displayName}!
            </h1>
            {!profile?.username && (
              <p className="text-sm text-gray-500 mt-1">
                Je hebt nog geen gebruikersnaam.{" "}
                <Link href="/account" className="underline font-medium">
                  Stel er nu een in
                </Link>
                .
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition self-start sm:self-auto"
          >
            Uitloggen
          </button>
        </div>

        <div className="flex gap-3 mb-8 sm:mb-10 flex-wrap">
          <Link href="/producten" className="bg-black text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition">
            Producten bekijken
          </Link>
          <Link href="/mijn-producten" className="bg-white border border-gray-300 rounded-lg px-5 py-2 text-sm font-semibold hover:bg-gray-100 transition">
            Mijn producten
          </Link>
          <Link href="/account" className="bg-white border border-gray-300 rounded-lg px-5 py-2 text-sm font-semibold hover:bg-gray-100 transition">
            Account instellingen
          </Link>
        </div>

        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Level {currentLevel}</span>
            <span className="text-sm text-gray-500">{xpIntoLevel} / 100 XP</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-black h-3 rounded-full transition-all" style={{ width: `${xpIntoLevel}%` }} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Totale winst</p>
            <p className="text-2xl sm:text-3xl font-bold">€{profile?.total_profit ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Totale omzet</p>
            <p className="text-2xl sm:text-3xl font-bold">€{profile?.total_revenue ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Aantal verkopen</p>
            <p className="text-2xl sm:text-3xl font-bold">{profile?.total_sales ?? 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-3">Recente activiteiten</h2>
          {recentClaims.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Je hebt nog geen producten geclaimd. Zodra je begint, zie je hier je activiteit.
            </p>
          ) : (
            <div className="space-y-3">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="flex justify-between items-center gap-3 text-sm border-b border-gray-100 last:border-none pb-3 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{claim.products?.name}</p>
                    <p className="text-gray-500">{statusText(claim.status)}</p>
                  </div>
                  <span className="text-green-600 font-semibold flex-shrink-0">€{claim.profit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}