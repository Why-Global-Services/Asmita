import ProductDetailsClient from "./ProductDetailsClient";

export async function generateStaticParams() {
  try {
    const { catalogService } = await import("@/services/catalogService");
    const result = await catalogService.getProducts();
    return (result.items || []).map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  return <ProductDetailsClient id={resolvedParams?.id} />;
}
