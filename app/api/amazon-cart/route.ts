import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { asins } = await req.json();

  if (!asins || !Array.isArray(asins) || asins.length === 0) {
    return NextResponse.json({ error: "No ASINs provided" }, { status: 400 });
  }

  const tag = process.env.AMAZON_ASSOCIATE_TAG;

  if (!tag) {
    return NextResponse.json({ error: "Amazon configuration missing" }, { status: 500 });
  }

  // Build Amazon cart URL using Add-to-Cart links
  // Each item: ASIN.N.A=1&SubscriptionIds.member.1=...
  const params = new URLSearchParams();
  asins.forEach((asin: string, i: number) => {
    params.append(`ASIN.${i + 1}`, asin);
    params.append(`Quantity.${i + 1}`, "1");
  });
  params.append("tag", tag);
  params.append("linkCode", "ogi");

  const cartUrl = `https://www.amazon.com/gp/aws/cart/add.html?${params.toString()}`;

  return NextResponse.json({ url: cartUrl });
}
