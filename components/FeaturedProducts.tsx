"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  buy_price: number;
  sell_price: number;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellingId, setSellingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, buy_price, sell_price")
      .order("created_at", { ascending: false })
      .limit(3);

    setProducts(data || []);
    setLoading(false);
  }

  async function handleSell(product: Product) {
    setMessage("");
    const supabase = createClient();

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      return;
    }

    setSellingId(product.id);

    const profit = product.sell_price - product.buy_price;

    const { error } = await supabase.from("sales").insert({
      user_id: userData.user.id,
      product_id: product.id,
      profit: profit,
      revenue: product.sell_price,
    });

    setSellingId(null);

    if (error) {
      setMessage("Er ging iets mis: " + error.message);
    } else {
      setMessage(`Verkoop geregistreerd! Je verdiende €${profit}.`);
    }
  }

  return (
    <section id="producten" className="px-6 py-24 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Producten in de kijker</h2>
        <p className="text-gray-600 mb-4 max-w-xl mx-auto">
          Een greep uit de producten die je vandaag al kan verkopen.
        </p>

        {message && (
          <p className="text-green-600 text-sm mb-8 font-medium">{message}</p>
        )}

        {loading ? (
          <p className="text-gray-400">Laden...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400">Er zijn nog geen producten beschikbaar.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => {
              const profit = product.sell_price - product.buy_price;
              return (
                <div
                  key={product.id}
                  className="rounded-xl border border-gray-200 p-6 text-left hover:shadow-md transition"
                >
                  <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">
                    Productfoto
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>Inkoopprijs: €{product.buy_price}</p>
                    <p>Adviesprijs: €{product.sell_price}</p>
                    <p className="text-green-600 font-semibold">
                      Winst: €{profit}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSell(product)}
                    disabled={sellingId === product.id}
                    className="w-full bg-black text-white rounded-lg py-2 text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {sellingId === product.id ? "Bezig..." : "Verkopen"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}