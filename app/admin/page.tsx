"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [expiredClaims, setExpiredClaims] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userData.user.id)
        .single();

      if (!profile?.is_admin) {
        router.push("/dashboard");
        return;
      }

      setIsAdmin(true);
      loadProducts();
      loadClaims();
      loadExpiredClaims();
      setLoading(false);
    }

    checkAdmin();
  }, []);

  async function loadProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  }

  async function loadClaimsGeneric(statuses: string[], setter: (v: any[]) => void) {
    const { data: claimsData } = await supabase
      .from("claims")
      .select("id, status, profit, revenue, claimed_at, user_id, product_id")
      .in("status", statuses)
      .order("claimed_at", { ascending: false });

    if (!claimsData) {
      setter([]);
      return;
    }

    const userIds = [...new Set(claimsData.map((c) => c.user_id))];
    const productIds = [...new Set(claimsData.map((c) => c.product_id))];

    const { data: profilesData } = await supabase.from("profiles").select("id, email, username").in("id", userIds);
    const { data: productsData } = await supabase.from("products").select("id, name, buy_price").in("id", productIds);

    const combined = claimsData.map((claim) => ({
      ...claim,
      profiles: profilesData?.find((p) => p.id === claim.user_id),
      products: productsData?.find((p) => p.id === claim.product_id),
    }));

    setter(combined);
  }

  async function loadClaims() {
    await loadClaimsGeneric(["verkocht", "uitbetaald"], setClaims);
  }

  async function loadExpiredClaims() {
    await loadClaimsGeneric(["verlopen"], setExpiredClaims);
  }

  async function handleMarkPaid(claimId: string) {
    await supabase.from("claims").update({ status: "uitbetaald" }).eq("id", claimId);
    loadClaims();
  }

  async function handleRestock(claim: any) {
    if (!claim.products) return;

    const { data: currentProduct } = await supabase.from("products").select("stock").eq("id", claim.product_id).single();

    if (currentProduct) {
      await supabase.from("products").update({ stock: currentProduct.stock + 1 }).eq("id", claim.product_id);
    }

    await supabase.from("claims").update({ status: "verlopen_verwerkt" }).eq("id", claim.id);

    loadExpiredClaims();
    loadProducts();
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.from("products").insert({
      name,
      description,
      buy_price: parseFloat(buyPrice),
      sell_price: parseFloat(sellPrice),
      stock: parseInt(stock),
      image_url: imageUrl,
    });

    if (error) {
      setMessage("Fout: " + error.message);
    } else {
      setMessage("Product toegevoegd!");
      setName("");
      setDescription("");
      setBuyPrice("");
      setSellPrice("");
      setStock("");
      setImageUrl("");
      loadProducts();
    }
  }

  if (loading || !isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-8">Adminpaneel</h1>

        <form onSubmit={handleAddProduct} className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-10 space-y-4">
          <h2 className="font-semibold mb-2">Nieuw product toevoegen</h2>

          <input placeholder="Productnaam" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <textarea placeholder="Beschrijving" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <input type="number" placeholder="Inkoop" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} required className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 min-w-0" />
            <input type="number" placeholder="Verkoop" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} required className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 min-w-0" />
            <input type="number" placeholder="Voorraad" value={stock} onChange={(e) => setStock(e.target.value)} required className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 min-w-0" />
          </div>
          <input placeholder="Foto-URL (bijv. https://...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />

          {message && <p className="text-sm text-gray-600">{message}</p>}

          <button type="submit" className="w-full sm:w-auto bg-black text-white rounded-lg px-6 py-2 font-semibold hover:bg-gray-800 transition">
            Product toevoegen
          </button>
        </form>

        <h2 className="font-semibold mb-4">Bestaande producten ({products.length})</h2>
        <div className="space-y-3 mb-12">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Inkoop: €{product.buy_price} · Verkoop: €{product.sell_price} · Voorraad: {product.stock}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-semibold mb-4">Openstaande verkopen ({claims.length})</h2>
        {claims.length === 0 ? (
          <p className="text-gray-400 text-sm mb-12">Er zijn nog geen gemelde verkopen.</p>
        ) : (
          <div className="space-y-3 mb-12">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{claim.products?.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Verkoper: {claim.profiles?.username || claim.profiles?.email} · Inkoop te ontvangen: €{claim.products?.buy_price} · Winst uit te betalen: €{claim.profit}
                  </p>
                </div>
                {claim.status === "verkocht" ? (
                  <button onClick={() => handleMarkPaid(claim.id)} className="bg-black text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition flex-shrink-0 self-start sm:self-auto">
                    Markeer als afgerond
                  </button>
                ) : (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800 flex-shrink-0 self-start sm:self-auto">
                    Afgerond
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <h2 className="font-semibold mb-4">Verlopen claims ({expiredClaims.length})</h2>
        {expiredClaims.length === 0 ? (
          <p className="text-gray-400 text-sm">Er zijn geen verlopen claims die nog verwerkt moeten worden.</p>
        ) : (
          <div className="space-y-3">
            {expiredClaims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-xl p-4 shadow-sm border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{claim.products?.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Geclaimd door: {claim.profiles?.username || claim.profiles?.email} — niet op tijd verkocht
                  </p>
                </div>
                <button onClick={() => handleRestock(claim)} className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-700 transition flex-shrink-0 self-start sm:self-auto">
                  Zet voorraad terug (+1)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}