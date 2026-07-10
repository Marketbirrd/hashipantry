"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Heart, TrendingUp, LogOut, ShoppingBag,
  RotateCcw, Package, Users, Camera, Lock, CheckCircle,
  AlertCircle, ChefHat, Edit3, Home, Settings, ChevronRight, Menu, X
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import SymptomChart from "@/components/SymptomChart";

const DIET_TAGS = [
  "Gluten Free", "Dairy Free", "Soy Free", "Egg Free", "Nut Free",
  "AIP", "Paleo", "Vegan", "Grain Free", "No Seed Oils", "Low Histamine",
];

type Tab = "overview" | "orders" | "favorites" | "diet" | "symptoms" | "profile";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview",  label: "Dashboard",        icon: Home },
  { id: "orders",    label: "Order History",     icon: Package },
  { id: "favorites", label: "Favorites",         icon: Heart },
  { id: "diet",      label: "Diet Preferences",  icon: Settings },
  { id: "symptoms",  label: "Symptom Tracker",   icon: TrendingUp },
  { id: "profile",   label: "Edit Profile",      icon: Edit3 },
];

type SymptomEntry = { id: string; date: string; energy: number; mood: number; brainFog: number; joint: number; notes?: string };
type PurchaseItem  = { id: string; name: string; imageUrl: string; affiliateUrl: string; quantity: number };
type Purchase      = { id: string; createdAt: string; items: PurchaseItem[] };
type ProductFav    = { id: string; productId: string; productName: string; affiliateUrl: string; imageUrl?: string };
type RecipeFav     = { id: string; recipeSlug: string; recipeTitle: string; imageUrl?: string };

function ReorderButton({ item }: { item: PurchaseItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        for (let i = 0; i < item.quantity; i++)
          addItem({ id: item.id, name: item.name, imageUrl: item.imageUrl, affiliateUrl: item.affiliateUrl, source: "AMAZON" });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${added ? "bg-green-100 text-green-700" : "bg-forest text-white hover:bg-forest-light"}`}
    >
      <RotateCcw className="w-3 h-3" />{added ? "Added!" : "Reorder"}
    </button>
  );
}

export default function AccountPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [favTab, setFavTab] = useState<"products" | "recipes">("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dietPrefs,   setDietPrefs]   = useState<string[]>([]);
  const [symptoms,    setSymptoms]    = useState<SymptomEntry[]>([]);
  const [purchases,   setPurchases]   = useState<Purchase[]>([]);
  const [productFavs, setProductFavs] = useState<ProductFav[]>([]);
  const [recipeFavs,  setRecipeFavs]  = useState<RecipeFav[]>([]);

  // Profile edit
  const [profileName,  setProfileName]  = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg,   setProfileMsg]   = useState<{ type: "ok"|"err"; text: string }|null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);

  // Password
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew,     setPwNew]     = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwMsg,     setPwMsg]     = useState<{ type: "ok"|"err"; text: string }|null>(null);

  // Symptom form
  const [newSymptom, setNewSymptom] = useState({ energy: 5, mood: 5, brainFog: 5, joint: 5, notes: "" });

  // Diet
  const [dietSaving, setDietSaving] = useState(false);
  const [dietSaved,  setDietSaved]  = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageProcessing(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 300;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        setProfileImage(canvas.toDataURL("image/jpeg", 0.75));
        setImageProcessing(false);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  useEffect(() => {
    if (!session) return;
    setProfileName(session.user?.name ?? "");
    setProfileImage(session.user?.image ?? "");
    Promise.all([
      fetch("/api/account/prefs").then(r => r.json()),
      fetch("/api/account/symptoms").then(r => r.json()),
      fetch("/api/account/purchases").then(r => r.json()),
      fetch("/api/account/favorites/products").then(r => r.json()),
      fetch("/api/account/favorites/recipes").then(r => r.json()),
    ]).then(([prefs, sym, purch, pfavs, rfavs]) => {
      setDietPrefs(prefs.dietPrefs ?? []);
      setSymptoms(sym.symptoms ?? []);
      setPurchases(purch.purchases ?? []);
      setProductFavs(pfavs.favorites ?? []);
      setRecipeFavs(rfavs.favorites ?? []);
    });
  }, [session]);

  const saveProfile = async () => {
    setProfileSaving(true); setProfileMsg(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, image: profileImage }),
      });
      if (!res.ok) throw new Error();
      await updateSession({ name: profileName, image: profileImage });
      setProfileMsg({ type: "ok", text: "Profile updated!" });
    } catch {
      setProfileMsg({ type: "err", text: "Failed to save. Please try again." });
    } finally { setProfileSaving(false); }
  };

  const changePassword = async () => {
    if (pwNew !== pwConfirm) { setPwMsg({ type: "err", text: "New passwords don't match." }); return; }
    setPwSaving(true); setPwMsg(null);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwMsg({ type: "ok", text: "Password changed!" });
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (e) {
      setPwMsg({ type: "err", text: (e as Error).message || "Failed to change password." });
    } finally { setPwSaving(false); }
  };

  const saveDietPrefs = async () => {
    setDietSaving(true);
    await fetch("/api/account/prefs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dietPrefs }) });
    setDietSaving(false); setDietSaved(true);
    setTimeout(() => setDietSaved(false), 2000);
  };

  const logSymptom = async () => {
    const res = await fetch("/api/account/symptoms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newSymptom) });
    const data = await res.json();
    setSymptoms(prev => [data, ...prev]);
    setNewSymptom({ energy: 5, mood: 5, brainFog: 5, joint: 5, notes: "" });
  };

  const removeProductFav = async (productId: string) => {
    setProductFavs(prev => prev.filter(f => f.productId !== productId));
    await fetch(`/api/account/favorites/products?productId=${productId}`, { method: "DELETE" });
  };
  const removeRecipeFav = async (recipeSlug: string) => {
    setRecipeFavs(prev => prev.filter(f => f.recipeSlug !== recipeSlug));
    await fetch(`/api/account/favorites/recipes?recipeSlug=${recipeSlug}`, { method: "DELETE" });
  };

  const navigate = (t: Tab) => { setTab(t); setSidebarOpen(false); };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return null;

  const initials   = session.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() ?? "U";
  const avatarSrc  = profileImage || session.user?.image;
  const firstName  = session.user?.name?.split(" ")[0] ?? "there";
  const activeLabel = NAV_ITEMS.find(n => n.id === tab)?.label ?? "";

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile header bar */}
        <div className="flex items-center gap-3 mb-6 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white border border-gray-200 text-forest">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-forest">{activeLabel}</span>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── SIDEBAR ── */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-200
            md:relative md:inset-auto md:z-auto md:w-64 md:shadow-none md:transform-none md:shrink-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}>
            {/* Mobile close */}
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-forest/40 hover:text-forest md:hidden">
              <X className="w-5 h-5" />
            </button>

            {/* User card */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-sage-pale flex items-center justify-center font-bold text-lg text-forest/50 shrink-0">
                  {avatarSrc
                    ? <img src={avatarSrc} alt={firstName} className="w-full h-full object-cover" />
                    : initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-forest text-sm leading-tight truncate">
                    {session.user?.name ?? "My Account"}
                  </p>
                  <p className="text-xs text-forest/50 truncate">{session.user?.email}</p>
                </div>
              </div>
              {dietPrefs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dietPrefs.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] bg-sage-pale text-forest/60 px-1.5 py-0.5 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Nav links */}
            <nav className="py-2">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors group ${
                    tab === id
                      ? "bg-forest/5 text-forest border-r-2 border-forest"
                      : "text-forest/60 hover:text-forest hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${tab === id ? "text-forest" : "text-forest/40 group-hover:text-forest/60"}`} />
                    {label}
                  </span>
                  {tab === id && <ChevronRight className="w-4 h-4 text-forest/30" />}
                </button>
              ))}

              <div className="mx-6 my-2 border-t border-gray-100" />

              <Link
                href="/community"
                className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-forest/60 hover:text-forest hover:bg-gray-50 transition-colors"
              >
                <Users className="w-4 h-4 text-forest/40" />
                Community
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* ── DASHBOARD ── */}
            {tab === "overview" && (
              <>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h1 className="font-serif text-2xl font-bold text-forest mb-0.5">
                    Welcome back, {firstName}!
                  </h1>
                  <p className="text-sm text-forest/50">Here&apos;s a summary of your HashiPantry account.</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <button onClick={() => setTab("orders")} className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-forest/30 hover:shadow-sm transition-all group">
                    <Package className="w-5 h-5 text-forest/30 mb-3 group-hover:text-forest/50 transition-colors" />
                    <p className="text-2xl font-bold text-forest">{purchases.length}</p>
                    <p className="text-xs text-forest/50 mt-0.5">Orders</p>
                  </button>
                  <button onClick={() => setTab("favorites")} className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-forest/30 hover:shadow-sm transition-all group">
                    <Heart className="w-5 h-5 text-red-300 mb-3 group-hover:text-red-400 transition-colors" />
                    <p className="text-2xl font-bold text-forest">{productFavs.length + recipeFavs.length}</p>
                    <p className="text-xs text-forest/50 mt-0.5">Saved Items</p>
                  </button>
                  <button onClick={() => setTab("symptoms")} className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-forest/30 hover:shadow-sm transition-all group col-span-2 sm:col-span-1">
                    <TrendingUp className="w-5 h-5 text-green/60 mb-3 group-hover:text-green transition-colors" />
                    <p className="text-2xl font-bold text-forest">{symptoms.length}</p>
                    <p className="text-xs text-forest/50 mt-0.5">Symptom Logs</p>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Recent order */}
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-sm text-forest">Recent Order</h2>
                      <button onClick={() => setTab("orders")} className="text-xs text-forest/40 hover:text-forest transition-colors">View all</button>
                    </div>
                    {purchases.length === 0 ? (
                      <div className="px-5 py-8 text-center">
                        <ShoppingBag className="w-8 h-8 text-forest/10 mx-auto mb-2" />
                        <p className="text-xs text-forest/40">No orders yet</p>
                        <Link href="/shop" className="text-xs text-forest/60 hover:text-forest underline mt-1 inline-block">Start shopping →</Link>
                      </div>
                    ) : (
                      <div className="px-5 py-3 space-y-3">
                        <p className="text-[10px] text-forest/40 font-medium uppercase tracking-wide">
                          {new Date(purchases[0].createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                        {purchases[0].items.slice(0, 2).map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-sage-pale overflow-hidden shrink-0">
                              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-4 h-4 text-forest/20 m-auto mt-2.5" />}
                            </div>
                            <p className="text-xs text-forest line-clamp-1 flex-1">{item.name}</p>
                            <ReorderButton item={item} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Diet profile */}
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-sm text-forest">Diet Profile</h2>
                      <button onClick={() => setTab("diet")} className="text-xs text-forest/40 hover:text-forest transition-colors">Edit</button>
                    </div>
                    <div className="px-5 py-4">
                      {dietPrefs.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-xs text-forest/40 mb-2">No preferences set yet.</p>
                          <button onClick={() => setTab("diet")} className="text-xs text-forest font-medium underline">Set diet preferences →</button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {dietPrefs.map(tag => (
                            <span key={tag} className="text-xs bg-sage-pale text-forest/70 px-2.5 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick links */}
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                  {[
                    { label: "Browse the Shop",        href: "/shop",    icon: ShoppingBag },
                    { label: "Explore Recipes",         href: "/recipes", icon: ChefHat },
                    { label: "Join the Community",      href: "/community", icon: Users },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link key={label} href={href} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                      <span className="flex items-center gap-3 text-sm text-forest/70 group-hover:text-forest">
                        <Icon className="w-4 h-4 text-forest/30" />
                        {label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-forest/20 group-hover:text-forest/40" />
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* ── ORDER HISTORY ── */}
            {tab === "orders" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
                  <h1 className="font-serif text-xl font-bold text-forest">Order History</h1>
                  <p className="text-sm text-forest/50 mt-0.5">Items you&apos;ve sent to Amazon through HashiPantry.</p>
                </div>
                {purchases.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Package className="w-12 h-12 text-forest/10 mx-auto mb-3" />
                    <p className="font-medium text-forest/50 mb-1">No orders yet</p>
                    <p className="text-sm text-forest/40 mb-5 max-w-xs mx-auto">When you confirm checkout through HashiPantry, your orders appear here for easy reordering.</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-forest-light transition-colors">
                      <ShoppingBag className="w-4 h-4" /> Browse Shop
                    </Link>
                  </div>
                ) : (
                  purchases.map((purchase, i) => (
                    <div key={purchase.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                        <div>
                          <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">Order #{purchases.length - i}</p>
                          <p className="text-sm font-semibold text-forest mt-0.5">
                            {new Date(purchase.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <span className="text-xs bg-forest/10 text-forest px-2.5 py-1 rounded-full font-semibold">
                          {purchase.items.reduce((s, x) => s + x.quantity, 0)} item{purchase.items.reduce((s, x) => s + x.quantity, 0) !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="px-5 py-3 space-y-3">
                        {purchase.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3 py-1">
                            <div className="w-10 h-10 rounded-lg bg-sage-pale overflow-hidden shrink-0">
                              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-4 h-4 text-forest/20" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-forest font-medium line-clamp-1">{item.name}</p>
                              <p className="text-xs text-forest/40">Qty: {item.quantity}</p>
                            </div>
                            <ReorderButton item={item} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── FAVORITES ── */}
            {tab === "favorites" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
                  <h1 className="font-serif text-xl font-bold text-forest">Favorites</h1>
                  <p className="text-sm text-forest/50 mt-0.5">Products and recipes you&apos;ve saved.</p>
                </div>

                <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1">
                  {(["products", "recipes"] as const).map(t => (
                    <button key={t} onClick={() => setFavTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${favTab === t ? "bg-forest text-white shadow-sm" : "text-forest/50 hover:text-forest"}`}>
                      {t} {t === "products" ? productFavs.length > 0 && `(${productFavs.length})` : recipeFavs.length > 0 && `(${recipeFavs.length})`}
                    </button>
                  ))}
                </div>

                {favTab === "products" && (
                  productFavs.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                      <Heart className="w-10 h-10 text-red-100 mx-auto mb-3" />
                      <p className="font-medium text-forest/50 mb-1">No saved products</p>
                      <p className="text-sm text-forest/40 mb-4">Tap ♡ on any product card to save it.</p>
                      <Link href="/shop" className="inline-flex gap-2 items-center bg-forest text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-forest-light transition-colors">
                        <ShoppingBag className="w-4 h-4" /> Browse Shop
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {productFavs.map(fav => (
                        <div key={fav.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                          <div className="relative aspect-square bg-gray-50">
                            {fav.imageUrl ? <img src={fav.imageUrl} alt={fav.productName} className="w-full h-full object-cover" /> : <ShoppingBag className="w-8 h-8 text-forest/10 absolute inset-0 m-auto" />}
                            <button onClick={() => removeProductFav(fav.productId)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                              <Heart className="w-3.5 h-3.5 fill-red-400" />
                            </button>
                          </div>
                          <div className="p-3">
                            <p className="text-xs font-semibold text-forest line-clamp-2 mb-2">{fav.productName}</p>
                            <a href={fav.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block text-center bg-forest text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-forest-light transition-colors">
                              View on Amazon
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {favTab === "recipes" && (
                  recipeFavs.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                      <ChefHat className="w-10 h-10 text-forest/10 mx-auto mb-3" />
                      <p className="font-medium text-forest/50 mb-1">No saved recipes</p>
                      <p className="text-sm text-forest/40 mb-4">Tap ♡ on any recipe card to save it.</p>
                      <Link href="/recipes" className="inline-flex gap-2 items-center bg-forest text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-forest-light transition-colors">
                        <ChefHat className="w-4 h-4" /> Browse Recipes
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {recipeFavs.map(fav => (
                        <Link key={fav.id} href={`/recipes/${fav.recipeSlug}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                          <div className="relative aspect-[4/3] bg-gray-50">
                            {fav.imageUrl ? <img src={fav.imageUrl} alt={fav.recipeTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <ChefHat className="w-8 h-8 text-forest/10 absolute inset-0 m-auto" />}
                            <button onClick={(e) => { e.preventDefault(); removeRecipeFav(fav.recipeSlug); }} className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                              <Heart className="w-3.5 h-3.5 fill-red-400" />
                            </button>
                          </div>
                          <div className="p-3">
                            <p className="text-xs font-semibold text-forest line-clamp-2">{fav.recipeTitle}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}

            {/* ── DIET PREFERENCES ── */}
            {tab === "diet" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
                  <h1 className="font-serif text-xl font-bold text-forest">Diet Preferences</h1>
                  <p className="text-sm text-forest/50 mt-0.5">The shop will auto-filter to show only what fits your diet.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
                    {DIET_TAGS.map(tag => (
                      <label key={tag} className="flex items-center gap-3 cursor-pointer group py-1">
                        <input type="checkbox" checked={dietPrefs.includes(tag)} onChange={() => setDietPrefs(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])} className="w-4 h-4 accent-forest rounded" />
                        <span className="text-sm text-forest/70 group-hover:text-forest">{tag}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={saveDietPrefs} disabled={dietSaving} className="mt-6 bg-forest text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-forest-light transition-colors disabled:opacity-50 text-sm">
                    {dietSaved ? "Saved!" : dietSaving ? "Saving…" : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SYMPTOM TRACKER ── */}
            {tab === "symptoms" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
                  <h1 className="font-serif text-xl font-bold text-forest">Symptom Tracker</h1>
                  <p className="text-sm text-forest/50 mt-0.5">Rate 1 (bad) to 10 (great) — track your trends over time.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-semibold text-forest mb-4 text-sm">Log Today</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    {(["energy", "mood", "brainFog", "joint"] as const).map(field => (
                      <div key={field}>
                        <div className="flex justify-between mb-1">
                          <label className="text-xs font-medium text-forest/70">{field === "brainFog" ? "Brain Fog" : field === "joint" ? "Joint Pain" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                          <span className="text-xs font-bold text-forest">{newSymptom[field]}/10</span>
                        </div>
                        <input type="range" min={1} max={10} value={newSymptom[field]} onChange={e => setNewSymptom(prev => ({ ...prev, [field]: parseInt(e.target.value) }))} className="w-full accent-forest" />
                      </div>
                    ))}
                  </div>
                  <textarea value={newSymptom.notes} onChange={e => setNewSymptom(prev => ({ ...prev, notes: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30 mb-3" placeholder="Notes (optional)" />
                  <button onClick={logSymptom} className="bg-forest text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-forest-light transition-colors text-sm">Log Entry</button>
                </div>

                {symptoms.length >= 2 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-forest mb-4 text-sm">Your Trends ({symptoms.length} entries)</h2>
                    <SymptomChart entries={[...symptoms].slice(0, 30).reverse()} />
                  </div>
                )}

                {symptoms.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-forest mb-4 text-sm">Recent Entries</h2>
                    <div className="space-y-0">
                      {symptoms.slice(0, 10).map(s => (
                        <div key={s.id} className="flex items-center gap-6 py-3 border-b border-gray-50 last:border-0 text-xs">
                          <span className="text-forest/40 shrink-0 w-16">{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          <div className="flex gap-4 flex-wrap">
                            <span className="text-forest/60">Energy <strong className="text-forest">{s.energy}</strong></span>
                            <span className="text-forest/60">Mood <strong className="text-forest">{s.mood}</strong></span>
                            <span className="text-forest/60">Brain Fog <strong className="text-forest">{s.brainFog}</strong></span>
                            <span className="text-forest/60">Joints <strong className="text-forest">{s.joint}</strong></span>
                          </div>
                          {s.notes && <span className="text-forest/30 italic hidden sm:block ml-auto">{s.notes}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── EDIT PROFILE ── */}
            {tab === "profile" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
                  <h1 className="font-serif text-xl font-bold text-forest">Edit Profile</h1>
                  <p className="text-sm text-forest/50 mt-0.5">Update your name, photo, and password.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Profile info card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                    <h2 className="font-semibold text-sm text-forest">Profile Info</h2>

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => fileRef.current?.click()} className="relative w-16 h-16 rounded-full overflow-hidden bg-sage-pale flex items-center justify-center font-bold text-xl text-forest/40 shrink-0 group">
                        {profileImage
                          ? <img src={profileImage} alt="preview" className="w-full h-full object-cover" />
                          : imageProcessing
                            ? <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                            : initials}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </button>
                      <div>
                        <button type="button" onClick={() => fileRef.current?.click()} className="text-sm font-medium text-forest/70 hover:text-forest underline">
                          {profileImage ? "Change photo" : "Upload photo"}
                        </button>
                        {profileImage && (
                          <button type="button" onClick={() => setProfileImage("")} className="block text-xs text-red-400 hover:text-red-600 mt-0.5">Remove</button>
                        )}
                      </div>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                    <div>
                      <label className="text-xs font-medium text-forest/60 block mb-1">Display Name</label>
                      <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30" />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-forest/40 block mb-1">Email (cannot change)</label>
                      <input type="email" value={session.user?.email ?? ""} disabled className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm text-forest/40 bg-gray-50 cursor-not-allowed" />
                    </div>

                    {profileMsg && (
                      <div className={`flex items-center gap-2 text-xs p-2.5 rounded-lg ${profileMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {profileMsg.type === "ok" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                        {profileMsg.text}
                      </div>
                    )}

                    <button onClick={saveProfile} disabled={profileSaving} className="bg-forest text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-forest-light transition-colors disabled:opacity-50 text-sm">
                      {profileSaving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>

                  {/* Password card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h2 className="font-semibold text-sm text-forest">Change Password</h2>
                    <div>
                      <label className="text-xs font-medium text-forest/60 block mb-1">Current Password</label>
                      <input type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-forest/60 block mb-1">New Password</label>
                      <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30" placeholder="Min. 8 characters" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-forest/60 block mb-1">Confirm New Password</label>
                      <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30" placeholder="••••••••" />
                    </div>
                    {pwMsg && (
                      <div className={`flex items-center gap-2 text-xs p-2.5 rounded-lg ${pwMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {pwMsg.type === "ok" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                        {pwMsg.text}
                      </div>
                    )}
                    <button onClick={changePassword} disabled={pwSaving || !pwNew} className="flex items-center gap-2 bg-forest text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-forest-light transition-colors disabled:opacity-50 text-sm">
                      <Lock className="w-3.5 h-3.5" />
                      {pwSaving ? "Changing…" : "Change Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
