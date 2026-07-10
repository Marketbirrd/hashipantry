"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Heart, TrendingUp, Settings, LogOut, ShoppingBag, Home,
  RotateCcw, Package, Users, Camera, Lock, CheckCircle,
  AlertCircle, ChefHat, Edit3
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import SymptomChart from "@/components/SymptomChart";

const DIET_TAGS = [
  "Gluten Free", "Dairy Free", "Soy Free", "Egg Free", "Nut Free",
  "AIP", "Paleo", "Vegan", "Grain Free", "No Seed Oils", "Low Histamine",
];

const TABS = ["Overview", "Edit Profile", "Order History", "Favorites", "Diet Preferences", "Symptom Tracker"];

type SymptomEntry = { id: string; date: string; energy: number; mood: number; brainFog: number; joint: number; notes?: string };
type PurchaseItem = { id: string; name: string; imageUrl: string; affiliateUrl: string; quantity: number };
type Purchase = { id: string; createdAt: string; items: PurchaseItem[] };
type ProductFav = { id: string; productId: string; productName: string; affiliateUrl: string; imageUrl?: string };
type RecipeFav = { id: string; recipeSlug: string; recipeTitle: string; imageUrl?: string };

function PurchaseItemCard({ item }: { item: PurchaseItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const handleReorder = () => {
    for (let i = 0; i < item.quantity; i++) addItem({ id: item.id, name: item.name, imageUrl: item.imageUrl, affiliateUrl: item.affiliateUrl, source: "AMAZON" });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-sage-pale/50 last:border-0">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-sage-pale shrink-0">
        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-forest/20" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-forest font-medium line-clamp-1">{item.name}</p>
        <p className="text-xs text-forest/40">Qty: {item.quantity}</p>
      </div>
      <button onClick={handleReorder} className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${added ? "bg-green-100 text-green-700" : "bg-forest text-white hover:bg-forest-light"}`}>
        <RotateCcw className="w-3 h-3" />{added ? "Added!" : "Reorder"}
      </button>
    </div>
  );
}

export default function AccountPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [favTab, setFavTab] = useState<"products" | "recipes">("products");

  // Data
  const [dietPrefs, setDietPrefs] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [productFavs, setProductFavs] = useState<ProductFav[]>([]);
  const [recipeFavs, setRecipeFavs] = useState<RecipeFav[]>([]);

  // Edit profile state
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password state
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Symptom form
  const [newSymptom, setNewSymptom] = useState({ energy: 5, mood: 5, brainFog: 5, joint: 5, notes: "" });

  // Diet prefs
  const [dietSaving, setDietSaving] = useState(false);
  const [dietSaved, setDietSaved] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

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
    setProfileSaving(true);
    setProfileMsg(null);
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
    } finally {
      setProfileSaving(false);
    }
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
      setPwMsg({ type: "ok", text: "Password changed successfully!" });
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (e) {
      setPwMsg({ type: "err", text: (e as Error).message || "Failed to change password." });
    } finally {
      setPwSaving(false);
    }
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

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return null;

  const initials = session.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() ?? "U";
  const avatarSrc = profileImage || session.user?.image;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-forest text-white px-4 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center font-bold text-xl font-serif shrink-0">
            {avatarSrc ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" /> : initials}
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-bold">Welcome back, {session.user?.name?.split(" ")[0] ?? "there"}!</h1>
            <p className="text-white/60 text-sm truncate">{session.user?.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {dietPrefs.slice(0, 4).map(tag => <span key={tag} className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-medium">{tag}</span>)}
            </div>
          </div>
          <div className="ml-auto flex gap-2 shrink-0">
            <button onClick={() => setActiveTab("Edit Profile")} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><Edit3 className="w-4 h-4" /></button>
            <Link href="/" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><Home className="w-4 h-4" /></Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-sage-pale sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-forest text-forest" : "border-transparent text-forest/50 hover:text-forest"}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button onClick={() => setActiveTab("Order History")} className="bg-white rounded-2xl p-5 border border-sage-pale text-left hover:border-forest/20 transition-colors">
                <Package className="w-6 h-6 text-forest/30 mb-2" />
                <p className="text-2xl font-bold text-forest">{purchases.length}</p>
                <p className="text-sm text-forest/50">Orders</p>
              </button>
              <button onClick={() => setActiveTab("Favorites")} className="bg-white rounded-2xl p-5 border border-sage-pale text-left hover:border-forest/20 transition-colors">
                <Heart className="w-6 h-6 text-red-300 mb-2" />
                <p className="text-2xl font-bold text-forest">{productFavs.length + recipeFavs.length}</p>
                <p className="text-sm text-forest/50">Favorites</p>
              </button>
              <button onClick={() => setActiveTab("Symptom Tracker")} className="bg-white rounded-2xl p-5 border border-sage-pale text-left hover:border-forest/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-green/60 mb-2" />
                <p className="text-2xl font-bold text-forest">{symptoms.length}</p>
                <p className="text-sm text-forest/50">Symptom Logs</p>
              </button>
              <Link href="/community" className="bg-white rounded-2xl p-5 border border-sage-pale hover:border-forest/20 transition-colors">
                <Users className="w-6 h-6 text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-forest">→</p>
                <p className="text-sm text-forest/50">Community</p>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-sage-pale">
                <h3 className="font-semibold text-forest mb-3">Quick Actions</h3>
                <div className="space-y-0">
                  {[
                    { icon: Edit3, label: "Edit Profile", action: () => setActiveTab("Edit Profile") },
                    { icon: ShoppingBag, label: "Browse the Shop", href: "/shop" },
                    { icon: RotateCcw, label: "Reorder Recent Items", action: () => setActiveTab("Order History") },
                    { icon: Settings, label: "Update Diet Preferences", action: () => setActiveTab("Diet Preferences") },
                    { icon: TrendingUp, label: "Log Today's Symptoms", action: () => setActiveTab("Symptom Tracker") },
                    { icon: Users, label: "Go to Community", href: "/community" },
                  ].map(({ icon: Icon, label, action, href }) =>
                    href ? (
                      <Link key={label} href={href} className="flex items-center gap-2 text-sm text-forest/70 hover:text-forest py-2.5 border-b border-sage-pale/50 last:border-0">
                        <Icon className="w-4 h-4 shrink-0" />{label}
                      </Link>
                    ) : (
                      <button key={label} onClick={action} className="flex items-center gap-2 text-sm text-forest/70 hover:text-forest py-2.5 border-b border-sage-pale/50 last:border-0 w-full text-left">
                        <Icon className="w-4 h-4 shrink-0" />{label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-sage-pale">
                  <h3 className="font-semibold text-forest mb-3">Your Diet Profile</h3>
                  {dietPrefs.length === 0 ? (
                    <p className="text-sm text-forest/40">No preferences set yet. <button onClick={() => setActiveTab("Diet Preferences")} className="text-green hover:underline">Set them now →</button></p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {dietPrefs.map(tag => <span key={tag} className="text-xs bg-sage-pale text-forest/70 px-2.5 py-1 rounded-full">{tag}</span>)}
                    </div>
                  )}
                </div>
                {purchases.length > 0 && (
                  <div className="bg-white rounded-2xl p-5 border border-sage-pale">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-forest">Last Order</h3>
                      <button onClick={() => setActiveTab("Order History")} className="text-xs text-green hover:underline">View all →</button>
                    </div>
                    {purchases[0].items.slice(0, 2).map(item => <PurchaseItemCard key={item.id} item={item} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT PROFILE ── */}
        {activeTab === "Edit Profile" && (
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            {/* Profile Info */}
            <div className="bg-white rounded-2xl border border-sage-pale p-6 space-y-5">
              <h2 className="font-serif text-xl font-bold text-forest">Profile Info</h2>

              {/* Avatar preview */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-sage-pale flex items-center justify-center font-bold text-xl text-forest/40 shrink-0">
                  {profileImage ? <img src={profileImage} alt="preview" className="w-full h-full object-cover" /> : initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-forest mb-1">Photo URL</p>
                  <input
                    type="url"
                    value={profileImage}
                    onChange={e => setProfileImage(e.target.value)}
                    placeholder="https://…"
                    className="w-full border border-sage-pale rounded-lg px-3 py-2 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-green/30"
                  />
                  <p className="text-[10px] text-forest/40 mt-1">Paste a link to your photo</p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" />

              <div>
                <label className="text-xs font-medium text-forest block mb-1">Display Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-sage-pale rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-forest/50 block mb-1">Email (cannot change)</label>
                <input type="email" value={session.user?.email ?? ""} disabled className="w-full border border-sage-pale rounded-lg px-3 py-2 text-sm text-forest/40 bg-sage-pale/40 cursor-not-allowed" />
              </div>

              {profileMsg && (
                <div className={`flex items-center gap-2 text-xs p-2.5 rounded-lg ${profileMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {profileMsg.type === "ok" ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {profileMsg.text}
                </div>
              )}

              <button onClick={saveProfile} disabled={profileSaving} className="w-full bg-forest text-white font-semibold py-3 rounded-xl hover:bg-forest-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" />
                {profileSaving ? "Saving…" : "Save Profile"}
              </button>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl border border-sage-pale p-6 space-y-4">
              <h2 className="font-serif text-xl font-bold text-forest">Change Password</h2>
              <div>
                <label className="text-xs font-medium text-forest block mb-1">Current Password</label>
                <input type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} className="w-full border border-sage-pale rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-xs font-medium text-forest block mb-1">New Password</label>
                <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)} className="w-full border border-sage-pale rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30" placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="text-xs font-medium text-forest block mb-1">Confirm New Password</label>
                <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} className="w-full border border-sage-pale rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30" placeholder="••••••••" />
              </div>
              {pwMsg && (
                <div className={`flex items-center gap-2 text-xs p-2.5 rounded-lg ${pwMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {pwMsg.type === "ok" ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {pwMsg.text}
                </div>
              )}
              <button onClick={changePassword} disabled={pwSaving || !pwNew} className="w-full bg-forest text-white font-semibold py-3 rounded-xl hover:bg-forest-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                {pwSaving ? "Changing…" : "Change Password"}
              </button>
            </div>
          </div>
        )}

        {/* ── ORDER HISTORY ── */}
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
                <p className="text-forest/40 text-sm mb-4">When you check out on Amazon through HashiPantry, your orders appear here for easy reordering.</p>
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
                      <p className="text-sm font-medium text-forest">{new Date(purchase.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <span className="text-xs bg-green/10 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                      {purchase.items.reduce((s, i) => s + i.quantity, 0)} item{purchase.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="px-5 py-1">
                    {purchase.items.map(item => <PurchaseItemCard key={item.id} item={item} />)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── FAVORITES ── */}
        {activeTab === "Favorites" && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl font-bold text-forest">Favorites</h2>
            <div className="flex gap-2">
              <button onClick={() => setFavTab("products")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${favTab === "products" ? "bg-forest text-white" : "bg-white border border-sage-pale text-forest/60 hover:text-forest"}`}>
                Products {productFavs.length > 0 && `(${productFavs.length})`}
              </button>
              <button onClick={() => setFavTab("recipes")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${favTab === "recipes" ? "bg-forest text-white" : "bg-white border border-sage-pale text-forest/60 hover:text-forest"}`}>
                Recipes {recipeFavs.length > 0 && `(${recipeFavs.length})`}
              </button>
            </div>

            {favTab === "products" && (
              productFavs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-sage-pale p-10 text-center">
                  <Heart className="w-12 h-12 text-red-100 mx-auto mb-3" />
                  <p className="text-forest/50 font-medium mb-1">No favorite products yet</p>
                  <p className="text-forest/40 text-sm mb-4">Tap the ♡ on any product card to save it here.</p>
                  <Link href="/shop" className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors">
                    <ShoppingBag className="w-4 h-4" /> Browse Shop
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {productFavs.map(fav => (
                    <div key={fav.id} className="bg-white rounded-2xl border border-sage-pale overflow-hidden group">
                      <div className="relative aspect-square bg-sage-pale overflow-hidden">
                        {fav.imageUrl ? <img src={fav.imageUrl} alt={fav.productName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-forest/20" /></div>}
                        <button onClick={() => removeProductFav(fav.productId)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-red-400 hover:bg-red-50 transition-colors">
                          <Heart className="w-3.5 h-3.5 fill-red-400" />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-forest line-clamp-2 mb-2">{fav.productName}</p>
                        <a href={fav.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-forest text-white text-xs font-semibold py-2 rounded-lg hover:bg-forest-light transition-colors">
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
                <div className="bg-white rounded-2xl border border-sage-pale p-10 text-center">
                  <ChefHat className="w-12 h-12 text-forest/10 mx-auto mb-3" />
                  <p className="text-forest/50 font-medium mb-1">No favorite recipes yet</p>
                  <p className="text-forest/40 text-sm mb-4">Tap the ♡ on any recipe card to save it here.</p>
                  <Link href="/recipes" className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors">
                    <ChefHat className="w-4 h-4" /> Browse Recipes
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recipeFavs.map(fav => (
                    <Link key={fav.id} href={`/recipes/${fav.recipeSlug}`} className="bg-white rounded-2xl border border-sage-pale overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative aspect-[4/3] bg-sage-pale overflow-hidden">
                        {fav.imageUrl ? <img src={fav.imageUrl} alt={fav.recipeTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><ChefHat className="w-8 h-8 text-forest/20" /></div>}
                        <button onClick={(e) => { e.preventDefault(); removeRecipeFav(fav.recipeSlug); }} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-red-400 hover:bg-red-50 transition-colors">
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
        {activeTab === "Diet Preferences" && (
          <div className="bg-white rounded-2xl border border-sage-pale p-6 max-w-lg">
            <h2 className="font-serif text-xl font-bold text-forest mb-2">Diet Preferences</h2>
            <p className="text-sm text-forest/60 mb-5">Select everything that applies. The shop will auto-filter to match.</p>
            <div className="space-y-3">
              {DIET_TAGS.map(tag => (
                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={dietPrefs.includes(tag)} onChange={() => setDietPrefs(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])} className="w-4 h-4 accent-forest rounded" />
                  <span className="text-sm text-forest/80 group-hover:text-forest">{tag}</span>
                </label>
              ))}
            </div>
            <button onClick={saveDietPrefs} disabled={dietSaving} className="mt-6 w-full bg-forest text-white font-semibold py-3 rounded-xl hover:bg-forest-light transition-colors disabled:opacity-50">
              {dietSaved ? "Saved!" : dietSaving ? "Saving…" : "Save Preferences"}
            </button>
          </div>
        )}

        {/* ── SYMPTOM TRACKER ── */}
        {activeTab === "Symptom Tracker" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-sage-pale p-6 max-w-lg">
              <h2 className="font-serif text-xl font-bold text-forest mb-1">Log Today&apos;s Symptoms</h2>
              <p className="text-sm text-forest/50 mb-5">Rate each area from 1 (bad) to 10 (great)</p>
              <div className="space-y-4">
                {(["energy", "mood", "brainFog", "joint"] as const).map(field => (
                  <div key={field}>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-forest">{field === "brainFog" ? "Brain Fog" : field === "joint" ? "Joint Pain" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <span className="text-sm font-bold text-forest">{newSymptom[field]}/10</span>
                    </div>
                    <input type="range" min={1} max={10} value={newSymptom[field]} onChange={e => setNewSymptom(prev => ({ ...prev, [field]: parseInt(e.target.value) }))} className="w-full accent-forest" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-forest block mb-1">Notes (optional)</label>
                  <textarea value={newSymptom.notes} onChange={e => setNewSymptom(prev => ({ ...prev, notes: e.target.value }))} rows={3} className="w-full border border-sage-pale rounded-xl px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-green/30" placeholder="How are you feeling today?" />
                </div>
              </div>
              <button onClick={logSymptom} className="mt-4 w-full bg-forest text-white font-semibold py-3 rounded-xl hover:bg-forest-light transition-colors">Log Entry</button>
            </div>

            {/* Chart */}
            {symptoms.length >= 2 && (
              <div className="bg-white rounded-2xl border border-sage-pale p-6">
                <h3 className="font-semibold text-forest mb-4">Your Trends ({symptoms.length} entries)</h3>
                <SymptomChart entries={[...symptoms].slice(0, 30).reverse()} />
              </div>
            )}

            {/* Recent entries table */}
            {symptoms.length > 0 && (
              <div className="bg-white rounded-2xl border border-sage-pale p-6">
                <h3 className="font-semibold text-forest mb-4">Recent Entries</h3>
                <div className="space-y-3">
                  {symptoms.slice(0, 10).map(s => (
                    <div key={s.id} className="flex items-center gap-4 text-sm py-3 border-b border-sage-pale/50 last:border-0">
                      <span className="text-forest/40 text-xs shrink-0">{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <div className="flex gap-3 flex-wrap">
                        <span className="text-forest/70">Energy <strong className="text-forest">{s.energy}</strong></span>
                        <span className="text-forest/70">Mood <strong className="text-forest">{s.mood}</strong></span>
                        <span className="text-forest/70">Brain Fog <strong className="text-forest">{s.brainFog}</strong></span>
                        <span className="text-forest/70">Joints <strong className="text-forest">{s.joint}</strong></span>
                      </div>
                      {s.notes && <span className="text-forest/40 text-xs italic ml-auto hidden sm:block">{s.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
