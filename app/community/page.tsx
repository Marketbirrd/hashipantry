import Link from "next/link";
import { Users, MessageCircle, Heart, BookOpen } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-forest">Our Community</h1>
        <p className="mt-3 text-forest/60 max-w-xl mx-auto text-sm leading-relaxed">
          You&apos;re not alone on this journey. Connect with thousands of others managing
          Hashimoto&apos;s, share wins, ask questions, and find support.
        </p>
      </div>

      {/* Community cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        <div className="bg-forest text-white rounded-2xl p-7">
          <Users className="w-8 h-8 text-sage-light mb-4" />
          <h2 className="font-serif text-xl font-bold mb-2">Join the Conversation</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            Connect with our growing community of Hashimoto&apos;s warriors. Share recipes,
            product finds, and lifestyle tips that are making a difference.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-forest text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-cream transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Join Community
          </a>
        </div>

        <div className="bg-white border border-sage-pale rounded-2xl p-7">
          <Heart className="w-8 h-8 text-rose-400 mb-4" />
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Share Your Story</h2>
          <p className="text-forest/60 text-sm leading-relaxed mb-5">
            Have a Hashimoto&apos;s success story, a product you love, or a recipe that changed
            things for you? We&apos;d love to feature it in the community.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-forest text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-forest-light transition-colors"
          >
            Share your story →
          </Link>
        </div>
      </div>

      {/* Resources grid */}
      <h2 className="font-serif text-2xl font-bold text-forest mb-5">Community Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: BookOpen, title: "Beginner's Guide", desc: "New to Hashimoto's? Start here. Everything you need to know in one place.", href: "/blog/hashimotos-beginners-guide" },
          { icon: MessageCircle, title: "FAQ", desc: "Answers to the most common questions about diet, products, and managing symptoms.", href: "/blog#faq" },
          { icon: Users, title: "Refer a Product", desc: "Found something that works for you? Share it with the community via our referral form.", href: "/contact" },
        ].map(({ icon: Icon, title, desc, href }) => (
          <Link
            key={title}
            href={href}
            className="bg-cream border border-sage-pale rounded-xl p-5 hover:shadow-md transition-shadow group"
          >
            <Icon className="w-6 h-6 text-green mb-3" />
            <h3 className="font-semibold text-forest text-sm mb-1">{title}</h3>
            <p className="text-xs text-forest/50 leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-sage-pale rounded-2xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-forest mb-2">Stay Connected</h2>
        <p className="text-forest/60 text-sm mb-5 max-w-md mx-auto">
          Get weekly tips, new product finds, and community highlights delivered to your inbox.
        </p>
        <form className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 rounded-xl border border-sage text-sm text-forest placeholder-forest/40 bg-white focus:outline-none focus:ring-2 focus:ring-green/30"
          />
          <button
            type="submit"
            className="bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
