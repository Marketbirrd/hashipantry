"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/diet-preferences", label: "Diet Preferences" },
  { href: "/shop", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/community", label: "Community" },
];

export default function Header() {
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-sage-light/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/hashilogo.png"
                alt="HashiPantry"
                width={320}
                height={100}
                className="h-24 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-forest/80 hover:text-forest hover:bg-sage-pale rounded-md transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <Link
                href="/shop?search=true"
                className="p-2 text-forest/70 hover:text-forest hover:bg-sage-pale rounded-md transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-forest/70 hover:text-forest hover:bg-sage-pale rounded-md transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-forest/70 hover:text-forest rounded-md transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden py-3 border-t border-sage-light/30">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm text-forest/80 hover:text-forest hover:bg-sage-pale rounded-md transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
