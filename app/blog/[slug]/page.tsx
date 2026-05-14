import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { sanityClient, urlFor } from "@/lib/sanity";
import { PortableText, type PortableTextComponents } from "next-sanity";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  coverImage?: object;
  body?: object[];
};

async function getPost(slug: string): Promise<Post | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, category, publishedAt, coverImage, body
    }`,
    { slug }
  );
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
  const post = await getPost(slug);
  if (!post) notFound();

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

      <div className="mt-14 pt-8 border-t border-sage-pale text-center">
        <p className="text-forest/50 text-sm mb-3">Want more Hashimoto&apos;s tips and resources?</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-forest-light transition-colors"
        >
          Browse All Posts
        </Link>
      </div>
    </div>
  );
}
