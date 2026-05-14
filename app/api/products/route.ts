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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "All";
  const source = searchParams.get("source") ?? "All";
  const diet = searchParams.getAll("diet");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(48, parseInt(searchParams.get("limit") ?? "48", 10));

  const all = await getProducts();

  const filtered = all.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search) && !p.description.toLowerCase().includes(search)) return false;
    if (category !== "All" && p.category !== category) return false;
    if (source === "Amazon" && p.source !== "AMAZON") return false;
    if (source === "Thrive Market" && p.source !== "THRIVE") return false;
    if (diet.length > 0 && !diet.every((tag) => p.dietTags.includes(tag))) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return NextResponse.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
}
