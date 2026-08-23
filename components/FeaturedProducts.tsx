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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id, name, buy_price, sell_price, image_url")
        .order("created_at", { ascending: false })
        .limit(3);

      setProducts(data || []);
      setLoading(false);
    }

    loadProducts();
  }, []);

  return (
    <section id="producten" className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-[var(--ink)]">Producten in de kijker</h2>
        <p className="text-gray-600 mb-12 sm:mb-16 max-w-xl mx-auto">
          Een greep uit de producten die je vandaag al kan verkopen.
        </p>

        {loading ? (
          <p className="text-gray-400">Laden...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400">Er zijn nog geen producten beschikbaar.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => {
              const profit = product.sell_price - product.buy_price;
              return (
                <Link
                  key={product.id}
                  href={`/producten/${product.id}`}
                  className="rounded-xl border border-[var(--border)] p-6 text-left hover:shadow-md hover:border-[var(--accent)] transition block"
                >
                  <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center text-gray-400 text-sm">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      "Geen foto"
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 text-[var(--ink)]">{product.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Inkoopprijs: €{product.buy_price}</p>
                    <p>Adviesprijs: €{product.sell_price}</p>
                    <p className="text-[var(--accent-dark)] font-semibold">Winst: €{profit}</p>
                  </div>
                  <div className="mt-4 text-center bg-[var(--ink)] text-white rounded-lg py-2 text-sm font-semibold group-hover:bg-[var(--accent)] transition">
                    Bekijk product
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}