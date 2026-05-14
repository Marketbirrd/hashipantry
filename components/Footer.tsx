import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-lg font-semibold">
              Join our email list
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Get exclusive deals and early access to new products.
            </p>
          </div>
          <form
            action="/api/newsletter"
            method="POST"
            className="flex gap-2 w-full md:w-auto"
          >
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-sage-light focus:ring-1 focus:ring-sage-light"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-green text-white rounded-lg text-sm font-medium hover:bg-green-light transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-10 justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-sage-light" />
              </div>
              <span className="font-serif font-bold text-lg">
                The Hashi Pantry
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted resource for strictly vetted, thyroid-friendly
              products, recipes, and wellness guidance.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-white/80 mb-3">Shop</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/shop?source=AMAZON" className="hover:text-white transition-colors">Amazon Picks</Link></li>
                <li><Link href="/shop?source=THRIVE" className="hover:text-white transition-colors">Thrive Market</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Downloads</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white/80 mb-3">Learn</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/recipes" className="hover:text-white transition-colors">Recipes</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/diet-preferences" className="hover:text-white transition-colors">Diet Guide</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white/80 mb-3">About</h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/contact" className="hover:text-white transition-colors">About Me</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/contact#partnerships" className="hover:text-white transition-colors">Partnerships</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} The Hashi Pantry. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/medical-disclaimer" className="hover:text-white/70 transition-colors">Medical Disclaimer</Link>
            <Link href="/commission-disclosure" className="hover:text-white/70 transition-colors">Commission Disclosure</Link>
            <Link href="/shipping" className="hover:text-white/70 transition-colors">Shipping Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
