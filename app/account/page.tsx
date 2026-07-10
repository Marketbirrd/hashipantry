"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Heart, TrendingUp, LogOut, ShoppingBag, RotateCcw,
  Package, Users, Camera, Lock, CheckCircle, AlertCircle,
  ChefHat, Menu, X, ChevronRight
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import SymptomChart from "@/components/SymptomChart";

const DIET_TAGS = [
  "Gluten Free","Dairy Free","Soy Free","Egg Free","Nut Free",
  "AIP","Paleo","Vegan","Grain Free","No Seed Oils","Low Histamine",
];

type Section = "dashboard" | "orders" | "favorites" | "diet" | "symptoms" | "profile";

const NAV: { id: Section; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "orders",    label: "Purchase History" },
  { id: "favorites", label: "Favorites" },
  { id: "profile",   label: "Profile Info" },
  { id: "diet",      label: "Diet Preferences" },
  { id: "symptoms",  label: "Symptom Tracker" },
];

type SymptomEntry = { id: string; date: string; energy: number; mood: number; brainFog: number; joint: number; notes?: string };
type PurchaseItem  = { id: string; name: string; imageUrl: string; affiliateUrl: string; quantity: number };
type Purchase      = { id: string; createdAt: string; items: PurchaseItem[] };
type ProductFav    = { id: string; productId: string; productName: string; affiliateUrl: string; imageUrl?: string };
type RecipeFav     = { id: string; recipeSlug: string; recipeTitle: string; imageUrl?: string };

function ReorderBtn({ item }: { item: PurchaseItem }) {
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
      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${added ? "bg-green-50 text-green-700 border-green-200" : "border-forest/20 text-forest hover:bg-forest hover:text-white"}`}
    >
      <RotateCcw className="w-3 h-3" />{added ? "Added!" : "Reorder"}
    </button>
  );
}

export default function AccountPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [section, setSection] = useState<Section>("dashboard");
  const [favTab, setFavTab] = useState<"products"|"recipes">("products");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [dietPrefs,   setDietPrefs]   = useState<string[]>([]);
  const [symptoms,    setSymptoms]    = useState<SymptomEntry[]>([]);
  const [purchases,   setPurchases]   = useState<Purchase[]>([]);
  const [productFavs, setProductFavs] = useState<ProductFav[]>([]);
  const [recipeFavs,  setRecipeFavs]  = useState<RecipeFav[]>([]);

  const [profileName,     setProfileName]     = useState("");
  const [profileImage,    setProfileImage]    = useState("");
  const [profileSaving,   setProfileSaving]   = useState(false);
  const [profileMsg,      setProfileMsg]      = useState<{type:"ok"|"err";text:string}|null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew,     setPwNew]     = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwMsg,     setPwMsg]     = useState<{type:"ok"|"err";text:string}|null>(null);

  const [newSymptom, setNewSymptom] = useState({ energy:5, mood:5, brainFog:5, joint:5, notes:"" });
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
      fetch("/api/account/prefs").then(r=>r.json()),
      fetch("/api/account/symptoms").then(r=>r.json()),
      fetch("/api/account/purchases").then(r=>r.json()),
      fetch("/api/account/favorites/products").then(r=>r.json()),
      fetch("/api/account/favorites/recipes").then(r=>r.json()),
    ]).then(([prefs,sym,purch,pfavs,rfavs]) => {
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
        method:"PATCH", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:profileName, image:profileImage }),
      });
      if (!res.ok) throw new Error();
      await updateSession({ name:profileName, image:profileImage });
      setProfileMsg({ type:"ok", text:"Profile updated!" });
    } catch { setProfileMsg({ type:"err", text:"Failed to save." }); }
    finally  { setProfileSaving(false); }
  };

  const changePassword = async () => {
    if (pwNew !== pwConfirm) { setPwMsg({type:"err",text:"Passwords don't match."}); return; }
    setPwSaving(true); setPwMsg(null);
    try {
      const res = await fetch("/api/account/password", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ currentPassword:pwCurrent, newPassword:pwNew }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwMsg({type:"ok",text:"Password changed!"});
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch(e) { setPwMsg({type:"err",text:(e as Error).message||"Failed."}); }
    finally { setPwSaving(false); }
  };

  const saveDietPrefs = async () => {
    setDietSaving(true);
    await fetch("/api/account/prefs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dietPrefs})});
    setDietSaving(false); setDietSaved(true);
    setTimeout(()=>setDietSaved(false),2000);
  };

  const logSymptom = async () => {
    const res = await fetch("/api/account/symptoms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(newSymptom)});
    const data = await res.json();
    setSymptoms(prev=>[data,...prev]);
    setNewSymptom({energy:5,mood:5,brainFog:5,joint:5,notes:""});
  };

  const removeProductFav = async (productId:string) => {
    setProductFavs(prev=>prev.filter(f=>f.productId!==productId));
    await fetch(`/api/account/favorites/products?productId=${productId}`,{method:"DELETE"});
  };
  const removeRecipeFav = async (recipeSlug:string) => {
    setRecipeFavs(prev=>prev.filter(f=>f.recipeSlug!==recipeSlug));
    await fetch(`/api/account/favorites/recipes?recipeSlug=${recipeSlug}`,{method:"DELETE"});
  };

  const go = (s:Section) => { setSection(s); setDrawerOpen(false); window.scrollTo(0,0); };

  if (status==="loading") return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin"/></div>;
  if (!session) return null;

  const firstName  = session.user?.name?.split(" ")[0] ?? "there";
  const initials   = session.user?.name?.split(" ").map(n=>n[0]).join("").toUpperCase() ?? "U";
  const avatarSrc  = profileImage || session.user?.image;
  const memberSince = new Date().toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"2-digit"});

  /* ── Sidebar ── */
  const Sidebar = () => (
    <div className="w-52 shrink-0">
      <p className="text-2xl font-bold text-forest mb-5">Hi, {firstName}</p>
      <nav>
        {NAV.map(({id,label}) => (
          <button key={id} onClick={()=>go(id)}
            className={`w-full text-left flex items-center justify-between px-3 py-2.5 text-sm rounded transition-colors mb-0.5 ${section===id ? "bg-gray-100 font-bold text-forest" : "text-forest/60 hover:text-forest hover:bg-gray-50 font-medium"}`}
          >
            {label}
            {section===id && <ChevronRight className="w-3.5 h-3.5 text-forest/40"/>}
          </button>
        ))}
        <div className="my-3 border-t border-gray-200"/>
        <Link href="/community" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-forest/60 hover:text-forest hover:bg-gray-50 rounded transition-colors mb-0.5">
          <Users className="w-4 h-4"/> Community
        </Link>
        <button onClick={()=>signOut({callbackUrl:"/"})} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-forest/60 hover:text-forest hover:bg-gray-50 rounded transition-colors text-left">
          <LogOut className="w-4 h-4"/> Sign Out
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile drawer backdrop */}
      {drawerOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={()=>setDrawerOpen(false)}/>}

      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl p-6 transform transition-transform duration-200 md:hidden ${drawerOpen?"translate-x-0":"-translate-x-full"}`}>
        <button onClick={()=>setDrawerOpen(false)} className="absolute top-4 right-4 text-forest/30 hover:text-forest"><X className="w-5 h-5"/></button>
        <Sidebar/>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <p className="text-xs text-forest/40 mb-6 hidden md:block">
          <Link href="/" className="hover:underline">Home</Link> &gt; Account
        </p>

        {/* Mobile top bar */}
        <div className="flex items-center gap-3 mb-6 md:hidden">
          <button onClick={()=>setDrawerOpen(true)} className="p-2 border border-gray-200 rounded text-forest"><Menu className="w-4 h-4"/></button>
          <span className="font-bold text-forest text-sm">{NAV.find(n=>n.id===section)?.label}</span>
        </div>

        <div className="flex gap-10 items-start">
          {/* Desktop sidebar */}
          <div className="hidden md:block sticky top-6"><Sidebar/></div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* ══ DASHBOARD ══ */}
            {section==="dashboard" && (
              <div>
                <h1 className="text-3xl font-bold text-forest mb-6">Account Dashboard</h1>

                {/* Member card */}
                <div className="border border-gray-200 rounded mb-6 p-6 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-sage-pale flex items-center justify-center font-bold text-2xl text-forest/50 shrink-0">
                    {avatarSrc ? <img src={avatarSrc} alt={firstName} className="w-full h-full object-cover"/> : initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-forest text-lg">HashiPantry Member</p>
                    <p className="text-xs text-forest/40 mt-0.5">Member since {memberSince}</p>
                    <div className="flex gap-6 mt-3">
                      <div>
                        <p className="text-xl font-bold text-forest">{purchases.length}</p>
                        <p className="text-[10px] text-forest/50 uppercase tracking-wide">Orders</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-forest">{productFavs.length+recipeFavs.length}</p>
                        <p className="text-[10px] text-forest/50 uppercase tracking-wide">Saved</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-forest">{symptoms.length}</p>
                        <p className="text-[10px] text-forest/50 uppercase tracking-wide">Logs</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={()=>go("orders")} className="shrink-0 bg-forest text-white text-xs font-bold px-5 py-2.5 rounded hover:bg-forest-light transition-colors tracking-wide uppercase">
                    View Orders
                  </button>
                </div>

                {/* Purchase history section */}
                <div className="border border-gray-200 rounded mb-6">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <p className="text-xs font-bold text-forest uppercase tracking-widest">Purchase History</p>
                    <button onClick={()=>go("orders")} className="text-xs font-bold text-forest uppercase tracking-wide flex items-center gap-1 hover:underline">
                      Purchase History <ChevronRight className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                  <div className="p-5">
                    {purchases.length===0 ? (
                      <div>
                        <p className="font-semibold text-forest/70 mb-1">No recent orders.</p>
                        <p className="text-sm text-forest/40">When you confirm checkout through HashiPantry, your orders appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {purchases[0].items.slice(0,3).map(item=>(
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-50 overflow-hidden shrink-0">
                              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/> : <ShoppingBag className="w-4 h-4 text-forest/20 m-auto mt-3"/>}
                            </div>
                            <p className="text-sm text-forest flex-1 line-clamp-1">{item.name}</p>
                            <ReorderBtn item={item}/>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info cards grid — 2x2, no payments */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {/* Profile card */}
                  <div className="border border-gray-200 rounded p-5 flex flex-col">
                    <p className="text-xs font-bold text-forest uppercase tracking-widest mb-3">Profile</p>
                    <p className="text-xs text-forest/40 mb-1">Your Info</p>
                    <p className="text-sm font-medium text-forest">{session.user?.name}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-forest/40">Login</p>
                      <p className="text-sm text-forest">{session.user?.email}</p>
                      <p className="text-sm text-forest tracking-widest">••••••••••••</p>
                      <button onClick={()=>go("profile")} className="text-xs text-forest/50 hover:text-forest underline">Edit Password</button>
                    </div>
                    <button onClick={()=>go("profile")} className="mt-auto pt-5 text-xs font-bold text-forest uppercase tracking-widest hover:underline text-left">
                      Edit Profile
                    </button>
                  </div>

                  {/* Diet preferences card */}
                  <div className="border border-gray-200 rounded p-5 flex flex-col">
                    <p className="text-xs font-bold text-forest uppercase tracking-widest mb-3">Diet Preferences</p>
                    {dietPrefs.length===0 ? (
                      <p className="text-sm text-forest font-semibold">Set your diet preferences for a personalized shop experience.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {dietPrefs.map(t=><span key={t} className="text-xs bg-sage-pale text-forest/70 px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    )}
                    <button onClick={()=>go("diet")} className="mt-auto pt-5 text-xs font-bold text-forest uppercase tracking-widest hover:underline text-left">
                      {dietPrefs.length===0 ? "Set Preferences" : "Edit Preferences"}
                    </button>
                  </div>

                  {/* Favorites card */}
                  <div className="border border-gray-200 rounded p-5 flex flex-col">
                    <p className="text-xs font-bold text-forest uppercase tracking-widest mb-3">Favorites</p>
                    {productFavs.length+recipeFavs.length===0 ? (
                      <p className="text-sm text-forest/50">No favorites saved yet.</p>
                    ) : (
                      <p className="text-sm text-forest/70">
                        {productFavs.length} product{productFavs.length!==1?"s":""} · {recipeFavs.length} recipe{recipeFavs.length!==1?"s":""}
                      </p>
                    )}
                    <button onClick={()=>go("favorites")} className="mt-auto pt-5 text-xs font-bold text-forest uppercase tracking-widest hover:underline text-left">
                      View All
                    </button>
                  </div>

                  {/* Symptom tracker card */}
                  <div className="border border-gray-200 rounded p-5 flex flex-col">
                    <p className="text-xs font-bold text-forest uppercase tracking-widest mb-3">Symptom Tracker</p>
                    {symptoms.length===0 ? (
                      <p className="text-sm text-forest/50">You haven&apos;t logged any symptoms yet.</p>
                    ) : (
                      <p className="text-sm text-forest/70">{symptoms.length} entr{symptoms.length===1?"y":"ies"} logged</p>
                    )}
                    <button onClick={()=>go("symptoms")} className="mt-auto pt-5 text-xs font-bold text-forest uppercase tracking-widest hover:underline text-left">
                      {symptoms.length===0 ? "Log Symptoms" : "View Tracker"}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ══ PURCHASE HISTORY ══ */}
            {section==="orders" && (
              <div>
                <h1 className="text-3xl font-bold text-forest mb-6">Purchase History</h1>
                {purchases.length===0 ? (
                  <div className="border border-gray-200 rounded p-10 text-center">
                    <Package className="w-10 h-10 text-forest/10 mx-auto mb-3"/>
                    <p className="font-semibold text-forest/60 mb-1">No recent orders.</p>
                    <p className="text-sm text-forest/40 mb-5">When you confirm checkout through HashiPantry, your orders appear here for easy reordering.</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 bg-forest text-white text-sm font-bold px-5 py-2.5 rounded hover:bg-forest-light transition-colors uppercase tracking-wide">
                      <ShoppingBag className="w-4 h-4"/> Browse Shop
                    </Link>
                  </div>
                ) : purchases.map((p,i)=>(
                  <div key={p.id} className="border border-gray-200 rounded mb-4 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                      <div>
                        <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">Order #{purchases.length-i}</p>
                        <p className="text-sm font-semibold text-forest mt-0.5">
                          {new Date(p.createdAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
                        </p>
                      </div>
                      <span className="text-xs bg-forest/10 text-forest px-2.5 py-1 rounded font-semibold">
                        {p.items.reduce((s,x)=>s+x.quantity,0)} item{p.items.reduce((s,x)=>s+x.quantity,0)!==1?"s":""}
                      </span>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      {p.items.map(item=>(
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-50 overflow-hidden shrink-0">
                            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/> : <ShoppingBag className="w-4 h-4 text-forest/20 m-auto mt-3"/>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-forest font-medium line-clamp-1">{item.name}</p>
                            <p className="text-xs text-forest/40">Qty: {item.quantity}</p>
                          </div>
                          <ReorderBtn item={item}/>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ══ FAVORITES ══ */}
            {section==="favorites" && (
              <div>
                <h1 className="text-3xl font-bold text-forest mb-6">Favorites</h1>
                <div className="flex gap-1 mb-6 border-b border-gray-200">
                  {(["products","recipes"] as const).map(t=>(
                    <button key={t} onClick={()=>setFavTab(t)}
                      className={`px-5 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${favTab===t?"border-forest text-forest":"border-transparent text-forest/40 hover:text-forest"}`}>
                      {t}
                    </button>
                  ))}
                </div>

                {favTab==="products" && (productFavs.length===0 ? (
                  <div className="border border-gray-200 rounded p-10 text-center">
                    <Heart className="w-8 h-8 text-gray-200 mx-auto mb-3"/>
                    <p className="font-semibold text-forest/50 mb-1">No saved products</p>
                    <p className="text-sm text-forest/40 mb-4">Tap ♡ on any product to save it.</p>
                    <Link href="/shop" className="inline-flex gap-2 items-center bg-forest text-white text-sm font-bold px-5 py-2.5 rounded uppercase tracking-wide hover:bg-forest-light transition-colors">Browse Shop</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productFavs.map(fav=>(
                      <div key={fav.id} className="border border-gray-200 rounded overflow-hidden group">
                        <div className="relative aspect-square bg-gray-50">
                          {fav.imageUrl ? <img src={fav.imageUrl} alt={fav.productName} className="w-full h-full object-cover"/> : <ShoppingBag className="w-6 h-6 text-forest/10 absolute inset-0 m-auto"/>}
                          <button onClick={()=>removeProductFav(fav.productId)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-3 h-3 fill-red-400"/>
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-semibold text-forest line-clamp-2 mb-2">{fav.productName}</p>
                          <a href={fav.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block text-center border border-forest text-forest text-xs font-bold py-1.5 rounded hover:bg-forest hover:text-white transition-colors uppercase tracking-wide">
                            View on Amazon
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {favTab==="recipes" && (recipeFavs.length===0 ? (
                  <div className="border border-gray-200 rounded p-10 text-center">
                    <ChefHat className="w-8 h-8 text-gray-200 mx-auto mb-3"/>
                    <p className="font-semibold text-forest/50 mb-1">No saved recipes</p>
                    <p className="text-sm text-forest/40 mb-4">Tap ♡ on any recipe card to save it.</p>
                    <Link href="/recipes" className="inline-flex gap-2 items-center bg-forest text-white text-sm font-bold px-5 py-2.5 rounded uppercase tracking-wide hover:bg-forest-light transition-colors">Browse Recipes</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recipeFavs.map(fav=>(
                      <Link key={fav.id} href={`/recipes/${fav.recipeSlug}`} className="border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="relative aspect-[4/3] bg-gray-50">
                          {fav.imageUrl ? <img src={fav.imageUrl} alt={fav.recipeTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/> : <ChefHat className="w-6 h-6 text-forest/10 absolute inset-0 m-auto"/>}
                          <button onClick={(e)=>{e.preventDefault();removeRecipeFav(fav.recipeSlug);}} className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-3 h-3 fill-red-400"/>
                          </button>
                        </div>
                        <div className="p-3"><p className="text-xs font-semibold text-forest line-clamp-2">{fav.recipeTitle}</p></div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* ══ PROFILE INFO ══ */}
            {section==="profile" && (
              <div>
                <h1 className="text-3xl font-bold text-forest mb-6">Profile Info</h1>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="border border-gray-200 rounded p-6 space-y-5">
                    <p className="text-xs font-bold text-forest uppercase tracking-widest">Your Info</p>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={()=>fileRef.current?.click()} className="relative w-16 h-16 rounded-full overflow-hidden bg-sage-pale flex items-center justify-center font-bold text-xl text-forest/40 shrink-0 group">
                        {profileImage ? <img src={profileImage} alt="preview" className="w-full h-full object-cover"/> : imageProcessing ? <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin"/> : initials}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-4 h-4 text-white"/></div>
                      </button>
                      <div>
                        <button type="button" onClick={()=>fileRef.current?.click()} className="text-xs font-bold text-forest uppercase tracking-wide hover:underline">{profileImage?"Change Photo":"Upload Photo"}</button>
                        {profileImage && <button type="button" onClick={()=>setProfileImage("")} className="block text-xs text-red-400 hover:text-red-600 mt-0.5">Remove</button>}
                      </div>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>

                    <div>
                      <label className="text-xs text-forest/50 block mb-1">Display Name</label>
                      <input type="text" value={profileName} onChange={e=>setProfileName(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"/>
                    </div>
                    <div>
                      <label className="text-xs text-forest/40 block mb-1">Email (cannot change)</label>
                      <input type="email" value={session.user?.email??""} disabled className="w-full border border-gray-100 rounded px-3 py-2 text-sm text-forest/40 bg-gray-50 cursor-not-allowed"/>
                    </div>
                    {profileMsg && (
                      <div className={`flex items-center gap-2 text-xs p-2.5 rounded ${profileMsg.type==="ok"?"bg-green-50 text-green-700":"bg-red-50 text-red-600"}`}>
                        {profileMsg.type==="ok"?<CheckCircle className="w-3.5 h-3.5 shrink-0"/>:<AlertCircle className="w-3.5 h-3.5 shrink-0"/>}
                        {profileMsg.text}
                      </div>
                    )}
                    <button onClick={saveProfile} disabled={profileSaving} className="bg-forest text-white text-xs font-bold px-5 py-2.5 rounded hover:bg-forest-light transition-colors disabled:opacity-50 uppercase tracking-wide">
                      {profileSaving?"Saving…":"Save Changes"}
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded p-6 space-y-4">
                    <p className="text-xs font-bold text-forest uppercase tracking-widest">Change Password</p>
                    {[
                      {label:"Current Password",val:pwCurrent,set:setPwCurrent,ph:"••••••••"},
                      {label:"New Password",val:pwNew,set:setPwNew,ph:"Min. 8 characters"},
                      {label:"Confirm New Password",val:pwConfirm,set:setPwConfirm,ph:"••••••••"},
                    ].map(({label,val,set,ph})=>(
                      <div key={label}>
                        <label className="text-xs text-forest/50 block mb-1">{label}</label>
                        <input type="password" value={val} onChange={e=>set(e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"/>
                      </div>
                    ))}
                    {pwMsg && (
                      <div className={`flex items-center gap-2 text-xs p-2.5 rounded ${pwMsg.type==="ok"?"bg-green-50 text-green-700":"bg-red-50 text-red-600"}`}>
                        {pwMsg.type==="ok"?<CheckCircle className="w-3.5 h-3.5 shrink-0"/>:<AlertCircle className="w-3.5 h-3.5 shrink-0"/>}
                        {pwMsg.text}
                      </div>
                    )}
                    <button onClick={changePassword} disabled={pwSaving||!pwNew} className="flex items-center gap-2 bg-forest text-white text-xs font-bold px-5 py-2.5 rounded hover:bg-forest-light transition-colors disabled:opacity-50 uppercase tracking-wide">
                      <Lock className="w-3.5 h-3.5"/>{pwSaving?"Changing…":"Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ DIET PREFERENCES ══ */}
            {section==="diet" && (
              <div>
                <h1 className="text-3xl font-bold text-forest mb-6">Diet Preferences</h1>
                <div className="border border-gray-200 rounded p-6">
                  <p className="text-sm text-forest/60 mb-5">The shop auto-filters to show only products that match your diet.</p>
                  <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3 mb-6">
                    {DIET_TAGS.map(tag=>(
                      <label key={tag} className="flex items-center gap-3 cursor-pointer group py-1">
                        <input type="checkbox" checked={dietPrefs.includes(tag)} onChange={()=>setDietPrefs(prev=>prev.includes(tag)?prev.filter(t=>t!==tag):[...prev,tag])} className="w-4 h-4 accent-forest"/>
                        <span className="text-sm text-forest/70 group-hover:text-forest">{tag}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={saveDietPrefs} disabled={dietSaving} className="bg-forest text-white text-xs font-bold px-6 py-2.5 rounded hover:bg-forest-light transition-colors disabled:opacity-50 uppercase tracking-wide">
                    {dietSaved?"Saved!":dietSaving?"Saving…":"Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* ══ SYMPTOM TRACKER ══ */}
            {section==="symptoms" && (
              <div>
                <h1 className="text-3xl font-bold text-forest mb-6">Symptom Tracker</h1>
                <div className="border border-gray-200 rounded p-6 mb-5">
                  <p className="text-xs font-bold text-forest uppercase tracking-widest mb-4">Log Today</p>
                  <p className="text-xs text-forest/50 mb-4">Rate 1 (bad) to 10 (great)</p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    {(["energy","mood","brainFog","joint"] as const).map(field=>(
                      <div key={field}>
                        <div className="flex justify-between mb-1">
                          <label className="text-xs font-medium text-forest/70">{field==="brainFog"?"Brain Fog":field==="joint"?"Joint Pain":field.charAt(0).toUpperCase()+field.slice(1)}</label>
                          <span className="text-xs font-bold text-forest">{newSymptom[field]}/10</span>
                        </div>
                        <input type="range" min={1} max={10} value={newSymptom[field]} onChange={e=>setNewSymptom(prev=>({...prev,[field]:parseInt(e.target.value)}))} className="w-full accent-forest"/>
                      </div>
                    ))}
                  </div>
                  <textarea value={newSymptom.notes} onChange={e=>setNewSymptom(prev=>({...prev,notes:e.target.value}))} rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 mb-3" placeholder="Notes (optional)"/>
                  <button onClick={logSymptom} className="bg-forest text-white text-xs font-bold px-6 py-2.5 rounded hover:bg-forest-light transition-colors uppercase tracking-wide">Log Entry</button>
                </div>
                {symptoms.length>=2 && (
                  <div className="border border-gray-200 rounded p-6 mb-5">
                    <p className="text-xs font-bold text-forest uppercase tracking-widest mb-4">Your Trends ({symptoms.length} entries)</p>
                    <SymptomChart entries={[...symptoms].slice(0,30).reverse()}/>
                  </div>
                )}
                {symptoms.length>0 && (
                  <div className="border border-gray-200 rounded overflow-hidden">
                    <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-bold text-forest uppercase tracking-widest">Recent Entries</p>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {symptoms.slice(0,10).map(s=>(
                        <div key={s.id} className="flex items-center gap-6 px-5 py-3 text-xs">
                          <span className="text-forest/40 shrink-0 w-14">{new Date(s.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                          <div className="flex gap-4 flex-wrap">
                            {[["Energy",s.energy],["Mood",s.mood],["Brain Fog",s.brainFog],["Joints",s.joint]].map(([l,v])=>(
                              <span key={l as string} className="text-forest/50">{l} <strong className="text-forest">{v}</strong></span>
                            ))}
                          </div>
                          {s.notes && <span className="text-forest/30 italic ml-auto hidden sm:block">{s.notes}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
