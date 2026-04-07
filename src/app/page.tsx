import type { Metadata } from "next";
import { HomePageClient } from "@/features/home/components/home-page-client";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `Fundas para instrumentos | ${SITE_NAME}`,
  description: DEFAULT_SEO_DESCRIPTION,
  keywords: DEFAULT_SEO_KEYWORDS,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `Fundas para instrumentos | ${SITE_NAME}`,
    description: DEFAULT_SEO_DESCRIPTION,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "es_AR",
    type: "website",
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE), width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Fundas para instrumentos | ${SITE_NAME}`,
    description: DEFAULT_SEO_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/apple-touch-icon.png"),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          areaServed: "AR",
          availableLanguage: ["es"],
        },
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: absoluteUrl("/"),
        inLanguage: "es-AR",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePageClient />
    </>
  );
}
