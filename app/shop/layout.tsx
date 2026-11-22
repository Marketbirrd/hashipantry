import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Hashimoto's-friendly pantry staples, snacks, supplements, and more — every product screened for thyroid-safe ingredients.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
