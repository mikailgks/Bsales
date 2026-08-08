"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BANK_INFO } from "@/lib/config";

type Claim = {
  id: string;
  status: string;
  claimed_at: string;
  deadline: string;
  profit: number;
  revenue: number;
  products: {
    name: string;
    buy_price: number;
    image_url: string | null;
  };
};

export default function MyProductsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    await checkExpiredClaims();
    await loadClaims();
  }

  async function checkExpiredClaims() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const nowIso = new Date().toISOString();

    await supabase
      .from("claims")
      .update({ status: "verlopen" })
      .eq("user_id", userData.user.id)
      .eq("status", "geclaimd")
      .lt("deadline", nowIso);
  }

  async function loadClaims() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("claims")
      .select(
        "id, status, claimed_at, deadline, profit, revenue, products(name, buy_price, image_url)"
      )
      .eq("user_id", userData.user.id)
      .order("claimed_at", { ascending: false });

    setClaims((data as any) || []);
    setLoading(false);
  }

  async function handleMarkSold(claimId: string) {
    setMarkingId(claimId);
    const supabase = createClient();

    await supabase
      .from("claims")
      .update({ status: "verkocht" })
      .eq("id", claimId);

    setMarkingId(null);
    loadClaims();
  }

  function getTimeLeft(deadline: string) {
    const diffMs = new Date(deadline).getTime() - new Date().getTime();
    if (diffMs <= 0) return null;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days} dag${days === 1 ? "" : "en"} en ${hours} uur`;
    return `${hours} uur`;
  }

  function statusLabel(status: string) {
    switch (status) {
      case "geclaimd":
        return { text: "Nog te verkopen", color: "bg-yellow-100 text-yellow-800" };
      case "verkocht":
        return { text: "Verkocht — wacht op betaling", color: "bg-blue-100 text-blue-800" };
      case "uitbetaald":
        return { text: "Afgerond", color: "bg-green-100 text-green-800" };
      case "verlopen":
      case "verlopen_verwerkt":
        return { text: "Deadline verstreken", color: "bg-red-100 text-red-800" };
      default:
        return { text: status, color: "bg-gray-100 text-gray-800" };
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
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-black mb-6 inline-block"
        >
          ← Terug naar dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-8">Mijn producten</h1>

        {claims.length === 0 ? (
          <p className="text-gray-400">
            Je hebt nog geen producten geclaimd.{" "}
            <Link href="/producten" className="underline">
              Bekijk het aanbod
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => {
              const timeLeft = getTimeLeft(claim.deadline);
              const label = statusLabel(claim.status);
              const isUrgent =
                claim.status === "geclaimd" &&
                new Date(claim.deadline).getTime() - new Date().getTime() 
                  1000 * 60 * 60 * 24;

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      {claim.products.image_url && (
                        <img
                          src={claim.products.image_url}
                          alt={claim.products.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{claim.products.name}</p>
                        <p className="text-sm text-gray-500">
                          Winst bij verkoop: €{claim.profit}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${label.color}`}
                    >
                      {label.text}
                    </span>
                  </div>

                  {claim.status === "geclaimd" && (
                    <>
                      <p
                        className={`text-sm mb-4 ${
                          isUrgent ? "text-red-600 font-semibold" : "text-gray-500"
                        }`}
                      >
                        {timeLeft
                          ? `Nog ${timeLeft} om te verkopen.`
                          : "De deadline is net verstreken — ververs de pagina."}
                      </p>
                      <button
                        onClick={() => handleMarkSold(claim.id)}
                        disabled={markingId === claim.id}
                        className="bg-black text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        {markingId === claim.id ? "Bezig..." : "Ik heb dit verkocht"}
                      </button>
                    </>
                  )}

                  {claim.status === "verkocht" && (
                    <div className="bg-blue-50 rounded-lg p-4 text-sm">
                      <p className="font-medium text-blue-900 mb-2">
                        Maak de inkoopprijs over om je winst uitbetaald te krijgen:
                      </p>
                      <p>
                        <span className="text-gray-500">Rekeninghouder:</span>{" "}
                        {BANK_INFO.accountName}
                      </p>
                      <p>
                        <span className="text-gray-500">IBAN:</span> {BANK_INFO.iban}
                      </p>
                      <p>
                        <span className="text-gray-500">Bedrag:</span> €
                        {claim.products.buy_price}
                      </p>
                      <p>
                        <span className="text-gray-500">Mededeling:</span>{" "}
                        {claim.products.name}
                      </p>
                    </div>
                  )}

                  {claim.status === "uitbetaald" && (
                    <p className="text-sm text-green-700">
                      Je winst van €{claim.profit} is uitbetaald. 🎉
                    </p>
                  )}

                  {(claim.status === "verlopen" ||
                    claim.status === "verlopen_verwerkt") && (
                    <p className="text-sm text-red-600">
                      Je hebt dit product niet op tijd verkocht. Het is
                      teruggegeven aan de voorraad — je kan het gerust opnieuw
                      claimen.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}