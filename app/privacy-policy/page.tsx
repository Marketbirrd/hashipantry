import Link from "next/link";

export const metadata = { title: "Privacy Policy | HashiPantry" };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-4xl font-bold text-forest mb-2">Privacy Policy</h1>
      <p className="text-forest/50 text-sm mb-10">Effective date: November 22, 2026 · HashiPantry is operated by Wendy Cadwall, Nevada, USA · Privacy questions: <a href="mailto:privacy@hashipantry.com" className="underline text-green">privacy@hashipantry.com</a></p>

      <div className="space-y-6 text-forest/80 leading-relaxed text-sm">
        <p>
          HashiPantry (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates hashipantry.com. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.
        </p>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Information We Collect</h2>

          <h3 className="font-semibold text-forest mb-1">Account Information</h3>
          <p>
            When you create an account, we collect your name and email address. This information is used to authenticate your account, save your preferences, and display your shopping history.
          </p>

          <h3 className="font-semibold text-forest mt-4 mb-1">Health &amp; Symptom Data</h3>
          <p>
            If you use the Symptom Tracker, we store the values you log — energy, mood, brain fog, joint pain, weight, and any notes — linked to your account. This data is used only to show you your own trends. We do not share it with third parties, insurers, or employers. You can request deletion at any time.
          </p>

          <h3 className="font-semibold text-forest mt-4 mb-1">Weight</h3>
          <p>
            You may optionally enter your weight on your Profile and in each Symptom Tracker entry. This is stored in your account and used only to display your own weight trend. It is never shared or sold.
          </p>

          <h3 className="font-semibold text-forest mt-4 mb-1">Community Posts</h3>
          <p>
            If you post in the Community feed, your post is <strong>publicly visible</strong> to all visitors — no account is required to read it. Posts display your first name (or the name you provide). Do not post personal medical details you would not want visible to the public. You can delete your own posts at any time from the community page.
          </p>

          <h3 className="font-semibold text-forest mt-4 mb-1">Diet Preferences &amp; Favorites</h3>
          <p>
            Diet preferences and saved favorites are stored in your account and used solely to personalize your experience.
          </p>

          <h3 className="font-semibold text-forest mt-4 mb-1">Newsletter Subscriptions</h3>
          <p>
            If you subscribe to our newsletter, we collect your email address to send product updates and health tips. You can unsubscribe at any time using the link in any email.
          </p>

          <h3 className="font-semibold text-forest mt-4 mb-1">Usage Data</h3>
          <p>
            We may collect anonymous usage data (pages visited, browser type) to improve the site. We do not use advertising trackers or sell this data.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate and maintain your account</li>
            <li>To display your symptom trends and shopping history</li>
            <li>To personalize your product and recipe recommendations</li>
            <li>To send newsletters you have opted into</li>
            <li>To improve the site experience</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or trade your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Amazon &amp; Affiliate Links</h2>
          <p>
            HashiPantry is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. <strong>As an Amazon Associate I earn from qualifying purchases.</strong> When you click an Amazon link, Amazon may set cookies or collect data according to their own <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" target="_blank" rel="noopener noreferrer" className="underline text-green">Privacy Notice</a>. We do not receive or store any of your Amazon account or payment data.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Cookies</h2>
          <p>
            We use essential cookies to keep you logged in and to store session preferences. We do not use third-party advertising cookies or tracking pixels.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Data Security</h2>
          <p>
            We use industry-standard security measures to protect your information. Passwords are hashed and never stored in plain text. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Your Rights</h2>
          <p>
            You may request to access, correct, or delete your account data at any time by emailing <a href="mailto:privacy@hashipantry.com" className="underline text-green">privacy@hashipantry.com</a>. Nevada residents have rights under the Nevada Privacy of Information Collected on the Internet from Consumers Act (NPICICA), including the right to opt out of the sale of personal information. We do not sell personal information. If you are in the European Economic Area, you have additional rights under GDPR.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Children&apos;s Privacy</h2>
          <p>
            HashiPantry is not directed at children under 13. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Contact</h2>
          <p>
            For privacy-related questions, email <a href="mailto:privacy@hashipantry.com" className="underline text-green">privacy@hashipantry.com</a> or <Link href="/contact" className="underline text-green">use our contact form</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
