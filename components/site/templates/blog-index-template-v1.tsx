import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

export function BlogIndexTemplateV1({ content, posts }: { content: Record<string, unknown>; posts: BlogPost[] }) {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{String(content.title ?? "Blog")}</h1>
        <p className="text-muted-foreground">{String(content.subtitle ?? "Latest updates and insights.")}</p>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold">
              <Link className="hover:underline" href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-sm text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}</p>
            {post.excerpt && <p className="mt-2 text-sm">{post.excerpt}</p>}
          </article>
        ))}
      </div>
    </main>
  );
}
