import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";

const BASE_URL = "https://www.hashipantry.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/recipes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/resources`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/diet-preferences`, lastModified: new Date(), priority: 0.4 },
    { url: `${BASE_URL}/medical-disclaimer`, lastModified: new Date(), priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), priority: 0.3 },
    { url: `${BASE_URL}/commission-disclosure`, lastModified: new Date(), priority: 0.3 },
  ];

  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts: { slug: string; publishedAt?: string }[] = await sanityClient.fetch(
      `*[_type == "post"] { "slug": slug.current, publishedAt }`
    );
    blogPosts = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sanity unavailable at build time — skip blog posts
  }

  return [...staticPages, ...blogPosts];
}
