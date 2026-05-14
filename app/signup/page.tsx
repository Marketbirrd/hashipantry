"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/account");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-forest/10 mb-4">
            <Leaf className="w-7 h-7 text-forest" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest">Join HashiPantry</h1>
          <p className="text-forest/60 text-sm mt-1">Create your free account to get started</p>
        </div>

        <div className="bg-white rounded-2xl border border-sage-pale p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-forest block mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-sage-pale rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                placeholder="Sarah Johnson"
              />
            </div>
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
                minLength={8}
                className="w-full px-4 py-3 border border-sage-pale rounded-xl text-forest text-sm focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                placeholder="At least 8 characters"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-white font-semibold py-3 rounded-xl hover:bg-forest-light transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-forest/60 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-green font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
