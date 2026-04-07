import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPageClient } from "@/features/catalog/components/product-detail-page-client";
import { catalogService } from "@/lib/data/services/catalog-service";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams() {
  const products = await catalogService.listProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const products = await catalogService.listProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return {
      title: `Producto no encontrado | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} | ${SITE_NAME}`;
  const description = product.shortDescription || product.description.slice(0, 150);
  const canonical = absoluteUrl(`/producto/${product.slug}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      locale: "es_AR",
      images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE), width: 512, height: 512, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const products = await catalogService.listProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    image: [absoluteUrl(DEFAULT_OG_IMAGE)],
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/producto/${product.slug}`),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailPageClient slug={slug} />
    </>
  );
}
