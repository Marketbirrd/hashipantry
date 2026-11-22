import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const ASSOCIATE_TAG = "hashipantry07-20";

let cachedProducts: { id: string; name: string; asin?: string; affiliateUrl: string }[] | null = null;

async function getProducts() {
  if (cachedProducts) return cachedProducts;
  const filePath = path.join(process.cwd(), "public", "products.json");
  const raw = await readFile(filePath, "utf-8");
  cachedProducts = JSON.parse(raw);
  return cachedProducts!;
}

function extractAsin(product: { asin?: string; affiliateUrl: string }): string | null {
  if (product.asin) return product.asin.toUpperCase();
  const match = product.affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/i);
  return match ? match[1].toUpperCase() : null;
}

export async function POST(req: NextRequest) {
  const { items } = await req.json() as { items: { id: string; quantity: number }[] };

  const products = await getProducts();

  const cartParams = new URLSearchParams();
  cartParams.set("AssociateTag", ASSOCIATE_TAG);

  let asinIndex = 1;
  const skipped: { id: string; name: string; affiliateUrl: string }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.id);
    if (!product) continue;

    const asin = extractAsin(product);
    if (asin) {
      cartParams.set(`ASIN.${asinIndex}`, asin);
      cartParams.set(`Quantity.${asinIndex}`, String(item.quantity));
      asinIndex++;
    } else {
      skipped.push({ id: product.id, name: product.name, affiliateUrl: product.affiliateUrl });
    }
  }

  const cartUrl = asinIndex > 1
    ? `https://www.amazon.com/gp/aws/cart/add.html?${cartParams.toString()}`
    : null;

  return NextResponse.json({ cartUrl, skipped });
}
