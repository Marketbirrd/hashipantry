"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CheckCircle, AlertCircle, Trash2, MessageCircle, Loader2 } from "lucide-react";

type Post = {
  id: string;
  topic: string;
  body: string;
  createdAt: string;
  author: { name: string; image: string | null };
  mine: boolean;
};

const TOPICS = [
  { id: "story",    label: "My Story" },
  { id: "question", label: "Question" },
  { id: "win",      label: "Win" },
  { id: "recipe",   label: "Recipe Idea" },
  { id: "product",  label: "Product Find" },
] as const;

const topicLabel = (id: string) => TOPICS.find((t) => t.id === id)?.label ?? "My Story";
const MAX = 2000;

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CommunityFeed() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState<string>("story");
  const [posting, setPosting] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(() => {
    fetch(`/api/community${filter !== "all" ? `?topic=${filter}` : ""}`)
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load, session?.user?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || posting) return;
    setPosting(true); setMsg(null);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, topic }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      if (filter === "all" || filter === d.post.topic) setPosts((prev) => [d.post, ...prev]);
      setBody("");
      setMsg({ type: "ok", text: "Posted ✓ Thanks for sharing!" });
      setTimeout(() => setMsg(null), 4000);
    } catch (err) {
      setMsg({ type: "err", text: (err as Error).message || "Couldn't post. Please try again." });
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/community?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  };

  return (
    <section id="share" className="mb-12 scroll-mt-24">
      {/* Composer */}
      <div className="bg-white border border-sage-pale rounded-2xl p-6 mb-6">
        <h2 className="font-serif text-2xl font-bold text-forest mb-1">Share your story</h2>
        <p className="text-sm text-forest/55 mb-4">A win, a question, a recipe that helped, a product you love. Others on this road want to hear it.</p>

        {status === "authenticated" ? (
          <form onSubmit={submit}>
            <div className="flex flex-wrap gap-2 mb-3" role="radiogroup" aria-label="Post type">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={topic === t.id}
                  onClick={() => setTopic(t.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${topic === t.id ? "bg-forest text-white border-forest" : "border-sage-pale text-forest/60 hover:border-forest/40"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <label htmlFor="community-body" className="sr-only">Your post</label>
            <textarea
              id="community-body"
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, MAX))}
              rows={4}
              placeholder={`What's on your mind, ${session?.user?.name?.split(" ")[0] ?? "friend"}?`}
              className="w-full border border-sage-pale rounded-xl px-4 py-3 text-sm text-forest placeholder-forest/40 focus:outline-none focus:ring-2 focus:ring-green/30"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <p className="text-[11px] text-forest/40">
                {body.length}/{MAX} · Posts show your first name. Please don&apos;t share medical advice as fact. See our{" "}
                <Link href="/medical-disclaimer" className="underline">medical disclaimer</Link>.
              </p>
              <div className="flex items-center gap-3">
                <div aria-live="polite">
                  {msg && (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${msg.type === "ok" ? "text-green-700" : "text-red-600"}`}>
                      {msg.type === "ok" ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {msg.text}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!body.trim() || posting}
                  className="inline-flex items-center gap-2 bg-forest text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-forest-light transition-colors disabled:opacity-40"
                >
                  {posting && <Loader2 className="w-4 h-4 animate-spin" />} Post
                </button>
              </div>
            </div>
          </form>
        ) : status === "loading" ? (
          <div className="h-24 rounded-xl bg-sage-pale/40 animate-pulse" />
        ) : (
          <div className="flex flex-wrap items-center gap-3 bg-cream rounded-xl p-4">
            <p className="text-sm text-forest/70 flex-1">Sign in to post. Anyone can read the feed.</p>
            <Link href="/login" className="bg-forest text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-forest-light transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm font-semibold text-forest hover:underline">Create account</Link>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-forest/40 uppercase tracking-wide mr-1">Show</span>
        {[{ id: "all", label: "All" }, ...TOPICS].map((t) => (
          <button
            key={t.id}
            onClick={() => { if (t.id !== filter) { setLoading(true); setFilter(t.id); } }}
            aria-pressed={filter === t.id}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${filter === t.id ? "bg-sage-pale text-forest" : "text-forest/50 hover:text-forest"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl bg-sage-pale/40 animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center border border-dashed border-sage-pale rounded-2xl p-10">
          <MessageCircle className="w-8 h-8 text-forest/15 mx-auto mb-2" />
          <p className="text-sm text-forest/50">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="bg-white border border-sage-pale rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-sage-pale flex items-center justify-center text-sm font-bold text-forest/50 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.author.image ? <img src={p.author.image} alt="" className="w-full h-full object-cover" /> : p.author.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-forest">{p.author.name}</p>
                  <p className="text-[11px] text-forest/40">
                    <time dateTime={p.createdAt}>{timeAgo(p.createdAt)}</time>
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide bg-sage-pale text-forest/60 px-2 py-0.5 rounded-full">{topicLabel(p.topic)}</span>
                {p.mine && (
                  <button onClick={() => remove(p.id)} aria-label="Delete your post" className="p-1 text-forest/30 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-forest/80 leading-relaxed whitespace-pre-wrap break-words">{p.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
