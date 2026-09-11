import BlogDetailsClient from "./BlogDetailsClient";

export async function generateStaticParams() {
  try {
    const { catalogService } = await import("@/services/catalogService");
    const blogs = await catalogService.getBlogs();
    return (Array.isArray(blogs) ? blogs : []).map((b) => ({ id: String(b.id) }));
  } catch {
    return [];
  }
}

export default async function BlogDetailsPage({ params }) {
  const resolvedParams = await params;
  return <BlogDetailsClient id={resolvedParams?.id} />;
}
