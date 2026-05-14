import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import SessionWrapper from "@/components/SessionWrapper";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HashiPantry — A Pantry You Can Trust",
  description:
    "Thyroid-friendly, Hashimoto's-approved pantry staples, recipes, and resources. Every product is vetted so you don't have to.",
  openGraph: {
    title: "HashiPantry — A Pantry You Can Trust",
    description:
      "Thyroid-friendly, Hashimoto's-approved pantry staples, recipes, and resources.",
    siteName: "HashiPantry",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <SessionWrapper>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
