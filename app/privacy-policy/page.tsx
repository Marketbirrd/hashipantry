import Link from "next/link";

export const metadata = { title: "Privacy Policy | HashiPantry" };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-4xl font-bold text-forest mb-2">Privacy Policy</h1>
      <p className="text-forest/50 text-sm mb-10">Last updated: November 2026</p>

      <div className="space-y-6 text-forest/80 leading-relaxed text-sm">
        <p>
          HashiPantry (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates hashipantry.com. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.
        </p>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Information We Collect</h2>
          <h3 className="font-semibold text-forest mb-1">Account Information</h3>
          <p>
            When you create an account, we collect your name and email address. This information is used to authenticate your account, save your diet preferences, and display your order history.
          </p>
          <h3 className="font-semibold text-forest mt-4 mb-1">Newsletter Subscriptions</h3>
          <p>
            If you subscribe to our newsletter, we collect your email address solely to send you product updates and health tips. You can unsubscribe at any time using the link in any email we send.
          </p>
          <h3 className="font-semibold text-forest mt-4 mb-1">Usage Data</h3>
          <p>
            We may collect anonymous usage data such as pages visited and browser type to improve the site. We do not use advertising trackers or sell this data.
          </p>
          <h3 className="font-semibold text-forest mt-4 mb-1">Diet Preferences</h3>
          <p>
            If you save diet preferences (e.g., Gluten Free, Dairy Free), this data is stored in your browser&apos;s local storage and, if you are signed in, in your account profile. We use this solely to filter product recommendations for you.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate and maintain your account</li>
            <li>To personalize your product and recipe recommendations</li>
            <li>To send newsletters you have opted into</li>
            <li>To improve the site experience</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or trade your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Amazon & Affiliate Links</h2>
          <p>
            HashiPantry participates in the Amazon Associates Program. When you click an Amazon link and visit Amazon.com, Amazon may set cookies or collect data according to their own <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" target="_blank" rel="noopener noreferrer" className="underline text-green">Privacy Notice</a>. We do not receive or store any of your Amazon account or payment data.
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
            You may request to access, correct, or delete your account data at any time by contacting us. If you are in the European Economic Area, you have additional rights under GDPR.
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
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-forest mb-2">Contact</h2>
          <p>
            For privacy-related questions, please <Link href="/contact" className="underline text-green">contact us</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
