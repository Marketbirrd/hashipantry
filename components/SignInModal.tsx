"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X, Eye, EyeOff } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SignInModal({ open, onClose }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setEmail(""); setPassword(""); setError(""); setShowPw(false);
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
    } else {
      onClose();
      router.push("/account");
      router.refresh();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto z-10 overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-forest/30 hover:text-forest/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center pt-8 pb-4 border-b border-sage-pale">
          <Image src="/hashilogo.png" alt="HashiPantry" width={180} height={56} className="h-14 w-auto object-contain" />
        </div>

        <div className="px-8 py-7">
          <h2 className="text-xl font-bold text-forest text-center mb-6">Sign In to HashiPantry</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <input
                ref={emailRef}
                id="modal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
                className="peer w-full border border-gray-300 rounded px-3 pt-5 pb-2 text-sm text-forest focus:outline-none focus:border-forest transition-colors"
              />
              <label
                htmlFor="modal-email"
                className="absolute left-3 top-1 text-[10px] font-semibold text-forest/50 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-forest/40 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-forest/60 transition-all"
              >
                Email address *
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="modal-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
                className="peer w-full border border-gray-300 rounded px-3 pt-5 pb-2 pr-10 text-sm text-forest focus:outline-none focus:border-forest transition-colors"
              />
              <label
                htmlFor="modal-password"
                className="absolute left-3 top-1 text-[10px] font-semibold text-forest/50 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-forest/40 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-forest/60 transition-all"
              >
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/30 hover:text-forest/60 transition-colors"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Link
              href="/forgot-password"
              onClick={onClose}
              className="text-xs text-green hover:underline inline-block"
            >
              Reset password
            </Link>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-white font-bold text-sm py-3 rounded hover:bg-forest-light transition-colors disabled:opacity-50 tracking-wide uppercase mt-1"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sage-pale" /></div>
          </div>

          <p className="text-center text-sm text-forest/60">
            Don&apos;t have an account?{" "}
            <Link href="/signup" onClick={onClose} className="text-green font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
