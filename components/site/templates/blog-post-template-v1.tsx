import Link from "next/link";

type BlogPost = {
  title: string;
  content: string;
  author_name: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

export function BlogPostTemplateV1({ content, post }: { content: Record<string, unknown>; post: BlogPost }) {
  const showAuthor = Boolean(content.show_author ?? true);
  const showCover = Boolean(content.show_cover ?? true);

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Link href="/blog" className="text-sm underline">← Back to blog</Link>
      <article className="space-y-3">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}
          {showAuthor && post.author_name ? ` · ${post.author_name}` : ""}
        </p>
        {showCover && post.cover_image_url ? <img src={post.cover_image_url} alt={post.title} className="w-full rounded-lg border" /> : null}
        <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
      </article>
    </main>
  );
}
