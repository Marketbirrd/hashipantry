import { Heart, Mail, Gift, Building2 } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-forest">Contact &amp; Connect</h1>
        <p className="mt-3 text-forest/60 max-w-xl mx-auto text-sm leading-relaxed">
          Let&apos;s build a supportive community together. Whether you have questions, want to
          share resources, or explore partnerships, I&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* About Me */}
        <div className="bg-white border border-sage-pale rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-rose-400" /> About Me
          </h2>
          <p className="text-sm text-forest/70 leading-relaxed mb-4">
            Hi! I&apos;m passionate about helping people with Hashimoto&apos;s thyroiditis navigate
            their wellness journey through better nutrition and lifestyle choices. Having walked
            this path myself, I understand the challenges of finding the right foods and products
            that support our unique needs.
          </p>
          <p className="text-sm text-forest/70 leading-relaxed mb-4">
            HashiPantry was born from my personal experience managing Hashimoto&apos;s and the
            frustration of endless label-reading and research. My goal is to make healthy living
            more accessible and less overwhelming for our community.
          </p>
          <blockquote className="border-l-4 border-green pl-4 text-sm text-forest/60 italic">
            &quot;Every small step towards better health is a victory worth celebrating.
            You&apos;re not alone in this journey.&quot;
          </blockquote>
        </div>

        {/* How to Contact Me */}
        <div className="bg-white border border-sage-pale rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-blue-400" /> How to Contact Me
          </h2>
          <div className="mb-4">
            <p className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-1">Email</p>
            <a href="mailto:hello@hashipantry.com" className="text-green font-medium hover:underline">
              hello@hashipantry.com
            </a>
            <p className="text-xs text-forest/40 mt-0.5">Best for detailed questions and feedback</p>
          </div>
          <div className="mb-5">
            <p className="text-xs font-semibold text-forest/50 uppercase tracking-wide mb-1">Community</p>
            <a href="/community" className="text-green font-medium hover:underline">
              Join our supportive community
            </a>
            <br />
            <a href="/community" className="text-xs text-forest/50 hover:underline">Visit Community Page →</a>
          </div>
          <div className="bg-forest text-white rounded-xl p-4 text-sm">
            <p className="font-medium mb-1">Response Time</p>
            <p className="text-white/70 text-xs leading-relaxed">
              I typically respond within 24–48 hours. For urgent health concerns, please consult
              your healthcare provider.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Refer a Product */}
        <div className="bg-white border border-sage-pale rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-amber-500" /> Refer a Product
          </h2>
          <p className="text-sm text-forest/60 mb-4">
            Found a product that&apos;s been amazing for your Hashimoto&apos;s journey? Share it with the community!
          </p>
          <form className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-forest/70 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="e.g., Brand Name Coconut Flour"
                className="w-full px-3 py-2.5 border border-sage-pale rounded-lg text-sm text-forest placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-green/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest/70 mb-1">Product URL (optional)</label>
              <input
                type="url"
                placeholder="https://example.com/product"
                className="w-full px-3 py-2.5 border border-sage-pale rounded-lg text-sm text-forest placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-green/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest/70 mb-1">Why do you recommend it?</label>
              <textarea
                placeholder="Tell us how this product has helped..."
                rows={3}
                className="w-full px-3 py-2.5 border border-sage-pale rounded-lg text-sm text-forest placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-green/30 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-forest text-white py-3 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors"
            >
              Submit Product Referral
            </button>
          </form>
        </div>

        {/* Business Partnerships */}
        <div id="partnerships" className="bg-white border border-sage-pale rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-indigo-400" /> Business Partnerships
          </h2>
          <p className="text-sm text-forest/60 mb-4">
            Are you a business creating products that could benefit the Hashimoto&apos;s community?
          </p>
          <form className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-forest/70 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Your Company"
                  className="w-full px-3 py-2.5 border border-sage-pale rounded-lg text-sm text-forest placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-green/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-forest/70 mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-2.5 border border-sage-pale rounded-lg text-sm text-forest placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-green/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-forest/70 mb-1">Email</label>
              <input
                type="email"
                placeholder="contact@yourcompany.com"
                className="w-full px-3 py-2.5 border border-sage-pale rounded-lg text-sm text-forest placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-green/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest/70 mb-1">Product Category</label>
              <input
                type="text"
                placeholder="e.g., Supplements, Food Products"
                className="w-full px-3 py-2.5 border border-sage-pale rounded-lg text-sm text-forest placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-green/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest/70 mb-1">Tell us about your products</label>
              <textarea
                placeholder="Describe your products..."
                rows={3}
                className="w-full px-3 py-2.5 border border-sage-pale rounded-lg text-sm text-forest placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-green/30 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-forest text-white py-3 rounded-xl text-sm font-semibold hover:bg-forest-light transition-colors"
            >
              Submit Partnership Inquiry
            </button>
          </form>
        </div>
      </div>

      {/* Partnership Guidelines */}
      <div className="bg-forest text-white rounded-2xl p-7">
        <h2 className="font-serif text-2xl font-bold mb-5">Partnership Guidelines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-white/90 mb-3">What I Look For:</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {[
                "Products specifically beneficial for autoimmune conditions",
                "Transparent ingredient lists and sourcing",
                "Alignment with common Hashimoto's dietary needs",
                "Quality certifications and testing",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-sage-light mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white/90 mb-3">My Commitment:</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {[
                "Honest, unbiased reviews and recommendations",
                "Clear disclosure of any partnerships",
                "Focus on community benefit over profit",
                "Personal testing when possible",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-sage-light mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
