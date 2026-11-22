import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description: "Connect with others living with Hashimoto's — share stories, tips, and support.",
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
