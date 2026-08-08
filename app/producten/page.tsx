"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  buy_price: number;
  sell_price: number;
  image_url: string | null;
};

export default function ProductsOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id, name, buy_price, sell_price, image_url")
        .order("created_at", { ascending: false });

      setProducts(data || []);
      setLoading(false);
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Alle producten</h1>
          <p className="text-gray-600">
            Bekijk het volledige aanbod en kies wat je wilt verkopen.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Laden...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">
            Er zijn nog geen producten beschikbaar.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => {
              const profit = product.sell_price - product.buy_price;
              return (
                <Link
                  key={product.id}
                  href={`/producten/${product.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-md transition block"
                >
                  <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center text-gray-400 text-sm">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "Geen foto"
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Inkoopprijs: €{product.buy_price}</p>
                    <p>Adviesprijs: €{product.sell_price}</p>
                    <p className="text-green-600 font-semibold">
                      Winst: €{profit}
                    </p>
                  </div>
                  <div className="mt-4 text-center bg-black text-white rounded-lg py-2 text-sm font-semibold">
                    Bekijk product
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}