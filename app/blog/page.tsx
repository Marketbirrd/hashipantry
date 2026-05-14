export const dynamic = "force-dynamic";

import Link from "next/link";
import { sanityClient, urlFor } from "@/lib/sanity";
import { Calendar, Tag } from "lucide-react";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  coverImage?: object;
};

async function getPosts(): Promise<Post[]> {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, category, publishedAt, coverImage
    }`
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "Hashimoto's Tips": "bg-emerald-100 text-emerald-800",
  "Nutrition": "bg-amber-100 text-amber-800",
  "Product Reviews": "bg-blue-100 text-blue-800",
  "Recipes": "bg-green-100 text-green-800",
  "Lifestyle": "bg-purple-100 text-purple-800",
  "Research": "bg-orange-100 text-orange-800",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-forest mb-2">The Knowledge Hub</h1>
        <p className="text-forest/60 text-sm max-w-xl">
          Evidence-based insights, lifestyle tips, and empowering resources to help you thrive with Hashimoto&apos;s.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-forest/40 text-lg mb-2">No posts yet.</p>
          <p className="text-forest/30 text-sm">Check back soon — new posts are coming weekly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="bg-white rounded-2xl overflow-hidden border border-sage-pale hover:shadow-lg transition-shadow group flex flex-col"
            >
              <div className="aspect-[16/9] bg-sage-pale overflow-hidden">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(post.coverImage).width(600).height(338).url()}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-sage-pale to-cream flex items-center justify-center">
                    <span className="text-forest/20 font-serif text-2xl">HP</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                {post.category && (
                  <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 ${CATEGORY_COLORS[post.category] ?? "bg-sage-pale text-forest/70"}`}>
                    {post.category}
                  </span>
                )}
                <h2 className="font-serif font-bold text-forest text-lg leading-snug mb-2 group-hover:text-green transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-forest/60 leading-relaxed line-clamp-3 flex-1 mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-forest/40 mt-auto">
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                  {post.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {post.category}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
