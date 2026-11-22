import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Hashimoto's-friendly recipes — gluten-free, dairy-free, AIP, and more. Delicious meals that support your thyroid.",
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
