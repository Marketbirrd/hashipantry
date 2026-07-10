"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Heart, TrendingUp, Settings, LogOut, ShoppingBag, Home, RotateCcw, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const DIET_TAGS = [
  "Gluten Free", "Dairy Free", "Soy Free", "Egg Free", "Nut Free",
  "AIP", "Paleo", "Vegan", "Grain Free", "No Seed Oils", "Low Histamine",
];

const TABS = ["Overview", "Order History", "Diet Preferences", "Symptom Tracker", "Favorites"];

type SymptomEntry = {
  id: string;
  date: string;
  energy: number;
  mood: number;
  brainFog: number;
  joint: number;
  notes?: string;
};

type PurchaseItem = {
  id: string;
  name: string;
  imageUrl: string;
  affiliateUrl: string;
  quantity: number;
};

type Purchase = {
  id: string;
  createdAt: string;
  items: PurchaseItem[];
};

function PurchaseItemCard({ item }: { item: PurchaseItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleReorder = () => {
    for (let i = 0; i < item.quantity; i++) {
      addItem({ id: item.id, name: item.name, imageUrl: item.imageUrl, affiliateUrl: item.affiliateUrl, source: "AMAZON" });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-sage-pale/50 last:border-0">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-sage-pale shrink-0">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-forest/20" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-forest font-medium line-clamp-1">{item.name}</p>
        <p className="text-xs text-forest/40">Qty: {item.quantity}</p>
      </div>
      <button
        onClick={handleReorder}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          added ? "bg-green-100 text-green-700" : "bg-forest text-white hover:bg-forest-light"
        }`}
      >
        <RotateCcw className="w-3 h-3" />
        {added ? "Added!" : "Reorder"}
      </button>
    </div>
  );
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [dietPrefs, setDietPrefs] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [newSymptom, setNewSymptom] = useState({ energy: 5, mood: 5, brainFog: 5, joint: 5, notes: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/account/prefs").then((r) => r.json()).then((d) => setDietPrefs(d.dietPrefs ?? []));
      fetch("/api/account/symptoms").then((r) => r.json()).then((d) => setSymptoms(d.symptoms ?? []));
      fetch("/api/account/purchases").then((r) => r.json()).then((d) => setPurchases(d.purchases ?? []));
    }
  }, [session]);

  const saveDietPrefs = async () => {
    setSaving(true);
    await fetch("/api/account/prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dietPrefs }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const logSymptom = async () => {
    const res = await fetch("/api/account/symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSymptom),
    });
    const data = await res.json();
    setSymptoms((prev) => [data, ...prev]);
    setNewSymptom({ energy: 5, mood: 5, brainFog: 5, joint: 5, notes: "" });
  };

  // Total unique products ordered across all purchases
  const totalOrders = purchases.length;

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!session) return null;

  const initials = session.user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-cream">
      {/* Header banner */}
      <div className="bg-forest text-white px-4 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl font-serif">
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold">Welcome back, {session.user?.name?.split(" ")[0] ?? "there"}!</h1>
            <p className="text-white/60 text-sm">{session.user?.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {dietPrefs.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-medium">{tag}</span>
              ))}
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Link href="/" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-sage-pale sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? "border-forest text-forest" : "border-transparent text-forest/50 hover:text-forest"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* OVERVIEW */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button onClick={() => setActiveTab("Order History")} className="bg-white rounded-2xl p-5 border border-sage-pale text-left hover:border-forest/20 transition-colors">
                <Package className="w-6 h-6 text-forest/30 mb-2" />
                <p className="text-2xl font-bold text-forest">{totalOrders}</p>
                <p className="text-sm text-forest/50">Amazon Orders</p>
              </button>
              <div className="bg-white rounded-2xl p-5 border border-sage-pale">
                <Heart className="w-6 h-6 text-red-300 mb-2" />
                <p className="text-2xl font-bold text-forest">0</p>
                <p className="text-sm text-forest/50">Saved Favorites</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-sage-pale">
                <TrendingUp className="w-6 h-6 text-green/60 mb-2" />
                <p className="text-2xl font-bold text-forest">{symptoms.length}</p>
                <p className="text-sm text-forest/50">Symptom Logs</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-sage-pale">
                <h3 className="font-semibold text-forest mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/shop" className="flex items-center gap-2 text-sm text-forest/70 hover:text-forest py-2 border-b border-sage-pale/50">
                    <ShoppingBag className="w-4 h-4" /> Browse the Shop
                  </Link>
                  <button onClick={() => setActiveTab("Order History")} className="flex items-center gap-2 text-sm text-forest/70 hover:text-forest py-2 border-b border-sage-pale/50 w-full text-left">
                    <RotateCcw className="w-4 h-4" /> Reorder Recent Items
                  </button>
                  <button onClick={() => setActiveTab("Diet Preferences")} className="flex items-center gap-2 text-sm text-forest/70 hover:text-forest py-2 border-b border-sage-pale/50 w-full text-left">
                    <Settings className="w-4 h-4" /> Update Diet Preferences
                  </button>
                  <button onClick={() => setActiveTab("Symptom Tracker")} className="flex items-center gap-2 text-sm text-forest/70 hover:text-forest py-2 w-full text-left">
                    <TrendingUp className="w-4 h-4" /> Log Today&apos;s Symptoms
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-sage-pale">
                <h3 className="font-semibold text-forest mb-3">Your Diet Profile</h3>
                {dietPrefs.length === 0 ? (
                  <p className="text-sm text-forest/40">No preferences set yet. <button onClick={() => setActiveTab("Diet Preferences")} className="text-green hover:underline">Set them now →</button></p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {dietPrefs.map((tag) => (
                      <span key={tag} className="text-xs bg-sage-pale text-forest/70 px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent orders preview */}
            {purchases.length > 0 && (
              <div className="bg-white rounded-2xl border border-sage-pale p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-forest">Recent Orders</h3>
                  <button onClick={() => setActiveTab("Order History")} className="text-xs text-green hover:underline">View all →</button>
                </div>
                <div className="space-y-0">
                  {purchases[0].items.slice(0, 3).map((item) => (
                    <PurchaseItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDER HISTORY */}
        {activeTab === "Order History" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-forest">Order History</h2>
              <Link href="/shop" className="text-sm text-green hover:underline">Browse shop →</Link>
            </div>

            {purchases.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sage-pale p-10 text-center">
                <Package className="w-12 h-12 text-forest/20 mx-auto mb-3" />
                <p className="text-forest/50 text-base font-medium mb-1">No orders yet</p>
                <p className="text-forest/40 text-sm mb-4">When you check out on Amazon through HashiPantry, your orders will appear here for easy reordering.</p>
                <Link href="/shop" className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors">
                  <ShoppingBag className="w-4 h-4" /> Start Shopping
                </Link>
              </div>
            ) : (
              purchases.map((purchase, i) => (
                <div key={purchase.id} className="bg-white rounded-2xl border border-sage-pale overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-sage-pale/40 border-b border-sage-pale">
                    <div>
                      <p className="text-xs font-semibold text-forest/50 uppercase tracking-wide">Order #{purchases.length - i}</p>
                      <p className="text-sm font-medium text-forest">
                        {new Date(purchase.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className="text-xs bg-green/10 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                      {purchase.items.reduce((s, i) => s + i.quantity, 0)} item{purchase.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="px-5 py-1">
                    {purchase.items.map((item) => (
                      <PurchaseItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* DIET PREFERENCES */}
        {activeTab === "Diet Preferences" && (
          <div className="bg-white rounded-2xl border border-sage-pale p-6 max-w-lg">
            <h2 className="font-serif text-xl font-bold text-forest mb-2">Diet Preferences</h2>
            <p className="text-sm text-forest/60 mb-5">Select everything that applies to your diet. The shop will auto-filter to match.</p>
            <div className="space-y-3">
              {DIET_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={dietPrefs.includes(tag)}
                    onChange={() => setDietPrefs((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])}
                    className="w-4 h-4 accent-forest rounded"
                  />
                  <span className="text-sm text-forest/80 group-hover:text-forest">{tag}</span>
                </label>
              ))}
            </div>
            <button
              onClick={saveDietPrefs}
              disabled={saving}
              className="mt-6 w-full bg-forest text-white font-semibold py-3 rounded-xl hover:bg-forest-light transition-colors disabled:opacity-50"
            >
              {saved ? "Saved!" : saving ? "Saving…" : "Save Preferences"}
            </button>
          </div>
        )}

        {/* SYMPTOM TRACKER */}
        {activeTab === "Symptom Tracker" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-sage-pale p-6 max-w-lg">
              <h2 className="font-serif text-xl font-bold text-forest mb-1">Log Today&apos;s Symptoms</h2>
              <p className="text-sm text-forest/50 mb-5">Rate each area from 1 (bad) to 10 (great)</p>
              <div className="space-y-4">
                {(["energy", "mood", "brainFog", "joint"] as const).map((field) => (
                  <div key={field}>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-forest capitalize">
                        {field === "brainFog" ? "Brain Fog" : field === "joint" ? "Joint Pain" : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <span className="text-sm font-bold text-forest">{newSymptom[field]}/10</span>
                    </div>
                    <input
                      type="range" min={1} max={10}
                      value={newSymptom[field]}
                      onChange={(e) => setNewSymptom((prev) => ({ ...prev, [field]: parseInt(e.target.value) }))}
                      className="w-full accent-forest"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-forest block mb-1">Notes (optional)</label>
                  <textarea
                    value={newSymptom.notes}
                    onChange={(e) => setNewSymptom((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full border border-sage-pale rounded-xl px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30"
                    placeholder="How are you feeling today?"
                  />
                </div>
              </div>
              <button onClick={logSymptom} className="mt-4 w-full bg-forest text-white font-semibold py-3 rounded-xl hover:bg-forest-light transition-colors">
                Log Entry
              </button>
            </div>

            {symptoms.length > 0 && (
              <div className="bg-white rounded-2xl border border-sage-pale p-6">
                <h3 className="font-semibold text-forest mb-4">Recent Entries</h3>
                <div className="space-y-3">
                  {symptoms.slice(0, 7).map((s) => (
                    <div key={s.id} className="flex items-center gap-4 text-sm py-3 border-b border-sage-pale/50 last:border-0">
                      <span className="text-forest/40 text-xs shrink-0">{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <div className="flex gap-3 flex-wrap">
                        <span className="text-forest/70">Energy <strong className="text-forest">{s.energy}</strong></span>
                        <span className="text-forest/70">Mood <strong className="text-forest">{s.mood}</strong></span>
                        <span className="text-forest/70">Brain Fog <strong className="text-forest">{s.brainFog}</strong></span>
                        <span className="text-forest/70">Joints <strong className="text-forest">{s.joint}</strong></span>
                      </div>
                      {s.notes && <span className="text-forest/40 text-xs italic ml-auto">{s.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAVORITES */}
        {activeTab === "Favorites" && (
          <div className="bg-white rounded-2xl border border-sage-pale p-8 text-center max-w-md mx-auto">
            <Heart className="w-12 h-12 text-red-200 mx-auto mb-3" />
            <h2 className="font-serif text-xl font-bold text-forest mb-2">No favorites yet</h2>
            <p className="text-sm text-forest/50 mb-4">Browse the shop and tap the heart icon on products you love.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors">
              <ShoppingBag className="w-4 h-4" /> Browse Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
