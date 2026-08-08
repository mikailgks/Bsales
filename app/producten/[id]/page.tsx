"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string | null;
  buy_price: number;
  sell_price: number;
  stock: number;
  image_url: string | null;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  async function loadProduct() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, description, buy_price, sell_price, stock, image_url")
      .eq("id", params.id)
      .single();

    setProduct(data);
    setLoading(false);
  }

  async function handleClaim() {
    if (!product) return;
    setError("");
    setClaiming(true);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { data: freshProduct } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product.id)
      .single();

    if (!freshProduct || freshProduct.stock <= 0) {
      setError("Dit product is helaas net uitverkocht.");
      setClaiming(false);
      loadProduct();
      return;
    }

    const profit = product.sell_price - product.buy_price;

    const { error: claimError } = await supabase.from("claims").insert({
      user_id: userData.user.id,
      product_id: product.id,
      profit: profit,
      revenue: product.sell_price,
      status: "geclaimd",
    });

    if (claimError) {
      setError("Er ging iets mis: " + claimError.message);
      setClaiming(false);
      return;
    }

    await supabase
      .from("products")
      .update({ stock: freshProduct.stock - 1 })
      .eq("id", product.id);

    setClaiming(false);
    setClaimed(true);
    loadProduct();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Dit product bestaat niet (meer).</p>
        <Link href="/producten" className="text-black font-medium hover:underline">
          Terug naar producten
        </Link>
      </main>
    );
  }

  const profit = product.sell_price - product.buy_price;
  const isSoldOut = product.stock <= 0;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/producten" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">
          ← Terug naar producten
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-72 bg-gray-100 flex items-center justify-center text-gray-400 relative">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              "Geen foto beschikbaar"
            )}
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Uitverkocht</span>
              </div>
            )}
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-6">
              {product.description || "Geen beschrijving beschikbaar."}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Inkoopprijs</p>
                <p className="text-xl font-bold">€{product.buy_price}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Verkoopprijs</p>
                <p className="text-xl font-bold">€{product.sell_price}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Jouw winst</p>
                <p className="text-xl font-bold text-green-600">€{profit}</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Voorraad: {product.stock} stuks beschikbaar
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {claimed ? (
              <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">
                  Product geclaimd! Volgende stap:
                </h3>
                <p className="text-sm text-blue-800">
                  Je hebt nu 7 dagen om dit product aan een klant te verkopen.
                  Verkoop je het? Int dan het volledige bedrag (€{product.sell_price})
                  rechtstreeks van je klant, en meld de verkoop daarna bij{" "}
                  <Link href="/mijn-producten" className="underline font-medium">
                    Mijn producten
                  </Link>{" "}
                  — daar zie je precies wat de volgende stap is.
                </p>
              </div>
            ) : isSoldOut ? (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 rounded-lg py-3 font-semibold cursor-not-allowed"
              >
                Uitverkocht
              </button>
            ) : (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {claiming ? "Bezig..." : "Dit product claimen om te verkopen"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}