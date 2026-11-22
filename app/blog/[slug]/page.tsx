import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, ShoppingBag, ExternalLink } from "lucide-react";
import { sanityClient, urlFor } from "@/lib/sanity";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { readFile } from "fs/promises";
import path from "path";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  coverImage?: object;
  body?: object[];
  shopCta?: { label?: string; url?: string } | null;
  shopSearchTerms?: string[] | null;
};

type Product = { id: string; name: string; imageUrl: string; affiliateUrl: string; category: string };

async function getPost(slug: string): Promise<Post | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, category, publishedAt, coverImage, body,
      shopCta, shopSearchTerms
    }`,
    { slug }
  );
}

let _productCache: Product[] | null = null;
async function getProducts(): Promise<Product[]> {
  if (_productCache) return _productCache;
  const raw = await readFile(path.join(process.cwd(), "public", "products.json"), "utf-8");
  _productCache = JSON.parse(raw);
  return _productCache!;
}

function findRelatedProducts(terms: string[], products: Product[], limit = 4): Product[] {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  const results: Product[] = [];
  for (const term of terms) {
    const t = clean(term);
    for (const p of products) {
      if (results.length >= limit) break;
      if (results.some(r => r.id === p.id)) continue;
      if (clean(p.name).includes(t)) results.push(p);
    }
    if (results.length >= limit) break;
  }
  return results;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlFor(value).width(800).url()}
          alt={value.alt ?? ""}
          className="w-full rounded-2xl object-cover"
        />
        {value.caption && (
          <figcaption className="text-center text-xs text-forest/40 mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? "_blank" : undefined}
        rel={value.blank ? "noopener noreferrer" : undefined}
        className="text-green underline underline-offset-2 hover:text-green/80 font-medium"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold text-forest">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-forest/80">{children}</p>,
    h2: ({ children }) => <h2 className="font-serif text-2xl font-bold text-forest mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="font-serif text-xl font-bold text-forest mt-8 mb-3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-green pl-5 my-6 italic text-forest/60">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-forest/80">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-forest/80">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allProducts] = await Promise.all([getPost(slug), getProducts()]);
  if (!post) notFound();

  const relatedProducts = post.shopSearchTerms?.length
    ? findRelatedProducts(post.shopSearchTerms, allProducts, 4)
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {/* Cover image */}
      {post.coverImage && (
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(post.coverImage).width(800).height(450).url()}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Meta */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-forest/50">
          {post.category && (
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" /> {post.category}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formatDate(post.publishedAt)}
            </span>
          )}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight mb-4">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-forest/60 text-lg leading-relaxed border-l-4 border-sage-pale pl-4">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Body */}
      {post.body && (
        <article className="prose-sm max-w-none mt-8">
          <PortableText value={post.body} components={portableTextComponents} />
        </article>
      )}

      {/* Shop swaps section */}
      <div className="mt-14 pt-8 border-t border-sage-pale">
        {(post.shopCta?.url || relatedProducts.length > 0) ? (
          <div className="bg-cream rounded-2xl p-6 mb-8">
            <p className="text-xs font-bold text-forest/40 uppercase tracking-widest mb-1">
              <ShoppingBag className="w-3.5 h-3.5 inline mr-1 -mt-0.5"/>HashiPantry Shop
            </p>
            <h2 className="font-serif text-xl font-bold text-forest mb-2">
              {post.shopCta?.label ?? "Shop these swaps"}
            </h2>
            {relatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {relatedProducts.map(p => (
                    <Link key={p.id} href={`/shop/${p.id}`} className="bg-white rounded-xl border border-sage-pale overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        {p.imageUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                          : <ShoppingBag className="w-6 h-6 text-forest/10 m-auto mt-6"/>
                        }
                      </div>
                      <p className="text-xs font-medium text-forest p-2 line-clamp-2">{p.name}</p>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  {post.shopCta?.url && (
                    <a href={post.shopCta.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors">
                      <ExternalLink className="w-4 h-4"/> {post.shopCta.label ?? "Shop these swaps"}
                    </a>
                  )}
                  <Link href="/shop" className="inline-flex items-center gap-2 border border-forest/20 text-forest px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-forest/5 transition-colors">
                    Browse all swaps
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-3 mt-3">
                {post.shopCta?.url && (
                  <a href={post.shopCta.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors">
                    <ExternalLink className="w-4 h-4"/> {post.shopCta.label ?? "Shop these swaps"}
                  </a>
                )}
                <Link href="/shop" className="inline-flex items-center gap-2 border border-forest/20 text-forest px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-forest/5 transition-colors">
                  Browse all swaps
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-cream rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-serif text-lg font-bold text-forest mb-1">Find Hashimoto&apos;s-friendly swaps</p>
              <p className="text-sm text-forest/60">Browse our curated shop of AIP, gluten-free, and clean-living products.</p>
            </div>
            <Link href="/shop" className="shrink-0 inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors">
              <ShoppingBag className="w-4 h-4"/> Browse Shop
            </Link>
          </div>
        )}

        <div className="text-center">
          <p className="text-forest/50 text-sm mb-3">Want more Hashimoto&apos;s tips and resources?</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors">
            Browse All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
