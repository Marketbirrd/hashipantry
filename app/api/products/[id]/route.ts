import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { Product } from "@/lib/products-data";

let cachedProducts: Product[] | null = null;

async function getProducts(): Promise<Product[]> {
  if (cachedProducts) return cachedProducts;
  const filePath = path.join(process.cwd(), "public", "products.json");
  const raw = await readFile(filePath, "utf-8");
  cachedProducts = JSON.parse(raw) as Product[];
  return cachedProducts;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await getProducts();
  const product = all.find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}
