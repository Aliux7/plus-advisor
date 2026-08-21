import type { Metadata } from "next";
import type { Locale } from "../[lang]/dictionaries";
import { LOCALES } from "../[lang]/dictionaries";

const DEFAULT_SITE_URL = "https://www.plusadvisor.co.id";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = getSiteUrl();
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

// OpenGraph locale codes are `xx_YY`, not `xx`. Keep this map here so
// callers don't have to remember the transform.
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
  zh: "zh_CN",
};

/** Build hreflang/canonical alternates for a page path. */
export function buildLocaleAlternates(
  path: string,
  currentLocale: Locale,
): Metadata["alternates"] {
  const cleanPath = path.replace(/^\/+/, "");
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `/${loc}${cleanPath ? `/${cleanPath}` : ""}`;
  }
  languages["x-default"] = `/en${cleanPath ? `/${cleanPath}` : ""}`;
  return {
    canonical: `/${currentLocale}${cleanPath ? `/${cleanPath}` : ""}`,
    languages,
  };
}

type OpenGraphInput = {
  title: string;
  description: string;
  image: string;
  path: string;
  locale: Locale;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export function buildOpenGraph(input: OpenGraphInput): Metadata["openGraph"] {
  const cleanPath = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const url = absoluteUrl(`/${input.locale}${cleanPath}`.replace(/\/+$/, ""));
  const shared = {
    title: input.title,
    description: input.description,
    url,
    siteName: "PLUS Advisor",
    locale: OG_LOCALE[input.locale],
    alternateLocale: LOCALES.filter((l) => l !== input.locale).map(
      (l) => OG_LOCALE[l],
    ),
    images: [
      {
        url: absoluteUrl(input.image),
        width: 1200,
        height: 630,
        alt: input.title,
      },
    ],
  };
  if (input.type === "article") {
    return {
      ...shared,
      type: "article",
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
      authors: input.authors,
    };
  }
  return { ...shared, type: "website" };
}

export function buildTwitter(input: {
  title: string;
  description: string;
  image: string;
}): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: input.title,
    description: input.description,
    images: [absoluteUrl(input.image)],
  };
}

// ── JSON-LD builders ─────────────────────────────────────────────────

const SOCIAL_URLS = [
  "https://www.instagram.com/plusadvisor/",
  "https://www.linkedin.com/company/plusadvisor/",
  "https://www.youtube.com/@plusadvisor",
];

export function buildOrganizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "PLUS Advisor",
    alternateName: "Plus Advisor",
    url: getSiteUrl(),
    logo: absoluteUrl("/logo.svg"),
    description:
      "PLUS Advisor is a family office in Indonesia, dedicated to guiding families in planning, structuring, protecting, and sustaining their legacy.",
    areaServed: "ID",
    sameAs: SOCIAL_URLS,
  } as const;
}

export function buildWebsiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PLUS Advisor",
    url: getSiteUrl(),
  } as const;
}

type ArticleLdInput = {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: string;
  keywords?: string[];
  locale: Locale;
};

export function buildArticleLd(input: ArticleLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    image: [absoluteUrl(input.image)],
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: input.locale,
    author: {
      "@type": "Organization",
      name: input.author || "PLUS Advisor",
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: "PLUS Advisor",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(input.url),
    },
    ...(input.keywords && input.keywords.length > 0
      ? { keywords: input.keywords.join(", ") }
      : {}),
  } as const;
}

type BreadcrumbCrumb = { name: string; url: string };

export function buildBreadcrumbLd(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.url),
    })),
  } as const;
}

/** Serialize a JSON-LD object safely for injection into a <script> tag. */
export function jsonLdString(data: unknown): string {
  // Escape closing script tags to defend against content that could break out.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// ── High-level per-page helper ──────────────────────────────────────

type PageMetaInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string;
  ogImage: string;
};

/** One-call metadata builder for standard content pages. */
export function buildPageMetadata(input: PageMetaInput): Metadata {
  return {
    // Page titles already include the brand, so bypass the parent template.
    title: { absolute: input.title },
    description: input.description,
    keywords: input.keywords,
    alternates: buildLocaleAlternates(input.path, input.locale),
    openGraph: buildOpenGraph({
      title: input.title,
      description: input.description,
      image: input.ogImage,
      path: input.path,
      locale: input.locale,
    }),
    twitter: buildTwitter({
      title: input.title,
      description: input.description,
      image: input.ogImage,
    }),
  };
}
