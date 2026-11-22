import Link from "next/link";

export const metadata = { title: "Terms of Use | HashiPantry" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-4xl font-bold text-forest mb-2">Terms of Use</h1>
      <p className="text-forest/50 text-sm mb-10">Effective date: November 22, 2026 · HashiPantry is operated by Wendy Cadwall, Nevada, USA</p>

      <div className="space-y-6 text-forest/80 leading-relaxed text-sm">
        <p>
          By accessing or using hashipantry.com (&quot;the Site&quot;), you agree to these Terms of Use. If you do not agree, please do not use the Site.
        </p>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">1. Not Medical Advice</h2>
          <p>
            The content on HashiPantry — including blog posts, recipes, product recommendations, and the Symptom Tracker — is for informational and educational purposes only. It is <strong>not a substitute for professional medical advice, diagnosis, or treatment.</strong> Always consult a qualified healthcare provider before making changes to your diet, supplements, or treatment plan. See our full <Link href="/medical-disclaimer" className="underline text-green">Medical Disclaimer</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">2. Affiliate Links &amp; Amazon Associates</h2>
          <p>
            HashiPantry participates in the Amazon Services LLC Associates Program. Product links marked with Amazon may earn us a commission at no extra cost to you. <strong>As an Amazon Associate I earn from qualifying purchases.</strong> Commissions do not influence our recommendations. See our <Link href="/commission-disclosure" className="underline text-green">Commission Disclosure</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">3. Your Account</h2>
          <p>
            You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. Notify us immediately at <a href="mailto:privacy@hashipantry.com" className="underline text-green">privacy@hashipantry.com</a> if you suspect unauthorized use. We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">4. Community Posts</h2>
          <p>
            Posts in the Community feed are publicly visible. By posting, you grant HashiPantry a non-exclusive, royalty-free license to display your post on the Site. You must not post:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Content that is false, defamatory, harassing, or abusive</li>
            <li>Personal medical advice presented as professional guidance</li>
            <li>Spam, promotional content, or links to competing sites</li>
            <li>Content that infringes any third-party rights</li>
          </ul>
          <p className="mt-2">We reserve the right to remove posts that violate these rules without notice.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">5. Intellectual Property</h2>
          <p>
            All content on the Site — including text, images, recipes, and code — is owned by HashiPantry or its content providers and is protected by copyright. You may not reproduce, distribute, or create derivative works without prior written permission.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">6. Third-Party Links</h2>
          <p>
            The Site contains links to Amazon and other third-party websites. We are not responsible for the content, privacy practices, or availability of those sites. Visiting them is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">7. Disclaimer of Warranties</h2>
          <p>
            The Site is provided &quot;as is&quot; without warranties of any kind. We do not warrant that the Site will be uninterrupted, error-free, or that product information is complete or current. Product availability, prices, and ingredients on Amazon can change without notice — always verify on the product page before purchasing.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, HashiPantry and Wendy Cadwall shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or any products purchased through affiliate links.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Nevada, USA, without regard to conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">10. Changes to These Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">11. Contact</h2>
          <p>
            Questions about these Terms? Email <a href="mailto:privacy@hashipantry.com" className="underline text-green">privacy@hashipantry.com</a> or <Link href="/contact" className="underline text-green">use our contact form</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
