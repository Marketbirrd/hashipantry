"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-forest/10 mb-4">
            <Leaf className="w-7 h-7 text-forest" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest">My Pantry</h1>
          <p className="text-forest/60 text-sm mt-1">Sign in to your HashiPantry account</p>
        </div>

        <div className="bg-white rounded-2xl border border-sage-pale p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-forest block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-sage-pale rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-forest block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-sage-pale rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-white font-semibold py-3 rounded-xl hover:bg-forest-light transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-forest/60 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-green font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
