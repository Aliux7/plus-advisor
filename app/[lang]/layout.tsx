import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import "locomotive-scroll/dist/locomotive-scroll.css";
import {
  DEFAULT_LOCALE,
  LOCALES,
  getDictionary,
  hasLocale,
} from "./dictionaries";
import LocomotiveScrollProvider from "../components/LocomotiveScrollProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import { getSearchIndex } from "../lib/posts";
import {
  absoluteUrl,
  buildLocaleAlternates,
  buildOpenGraph,
  buildOrganizationLd,
  buildTwitter,
  buildWebsiteLd,
  getSiteUrl,
} from "../lib/seo";

// Font variables are intentionally opaque (single letters) so devtools /
// WhatFont-style inspectors don't leak the underlying typeface identities.
// Tailwind aliases (font-catalog, font-raleway, …) map to these in globals.css.
// All faces are self-hosted from /app/fonts to avoid exposing family names via
// next/font/google's generated CSS.
const fontA = localFont({
  variable: "--font-a",
  display: "swap",
  src: [{ path: "../fonts/a-400.woff2", weight: "400", style: "normal" }],
});

const fontB = localFont({
  variable: "--font-b",
  display: "swap",
  src: [{ path: "../fonts/b-400.woff2", weight: "400", style: "normal" }],
});

const fontC = localFont({
  variable: "--font-c",
  display: "swap",
  src: [
    { path: "../fonts/c-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/c-400.woff2", weight: "500", style: "normal" },
    { path: "../fonts/c-400.woff2", weight: "600", style: "normal" },
    { path: "../fonts/c-400.woff2", weight: "700", style: "normal" },
    { path: "../fonts/c-400i.woff2", weight: "400", style: "italic" },
    { path: "../fonts/c-400i.woff2", weight: "500", style: "italic" },
    { path: "../fonts/c-400i.woff2", weight: "600", style: "italic" },
    { path: "../fonts/c-400i.woff2", weight: "700", style: "italic" },
  ],
});

const fontD = localFont({
  variable: "--font-d",
  display: "swap",
  src: [
    { path: "../fonts/d-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/d-300.woff2", weight: "400", style: "normal" },
    { path: "../fonts/d-300.woff2", weight: "500", style: "normal" },
    { path: "../fonts/d-300.woff2", weight: "600", style: "normal" },
    { path: "../fonts/d-300.woff2", weight: "700", style: "normal" },
  ],
});

const fontE = localFont({
  variable: "--font-e",
  display: "swap",
  src: [
    { path: "../fonts/e-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/e-300.woff2", weight: "400", style: "normal" },
    { path: "../fonts/e-300.woff2", weight: "500", style: "normal" },
    { path: "../fonts/e-300.woff2", weight: "600", style: "normal" },
    { path: "../fonts/e-300.woff2", weight: "700", style: "normal" },
  ],
});

const fontF = localFont({
  variable: "--font-f",
  display: "swap",
  src: [
    { path: "../fonts/f-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/f-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/f-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/f-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/f-700.woff2", weight: "700", style: "normal" },
  ],
});

const fontG = localFont({
  variable: "--font-g",
  display: "swap",
  src: [
    { path: "../fonts/g-400.otf", weight: "400", style: "normal" },
    { path: "../fonts/g-400i.otf", weight: "400", style: "italic" },
    { path: "../fonts/g-700.otf", weight: "700", style: "normal" },
    { path: "../fonts/g-900.otf", weight: "900", style: "normal" },
  ],
});

const fontH = localFont({
  variable: "--font-h",
  display: "swap",
  src: [{ path: "../fonts/h-400.otf", weight: "400", style: "normal" }],
});

const fontI = localFont({
  variable: "--font-i",
  display: "swap",
  src: [{ path: "../fonts/i-400.otf", weight: "400", style: "normal" }],
});

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// Re-render every request so CMS edits go live instantly.
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = await getDictionary(locale);
  const title = dict.meta.title;
  const description = dict.meta.description;
  const ogImage = dict.meta.ogImage || "/shared/blue-mountain-sand.webp";
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s — ${title}`,
    },
    description,
    keywords: dict.meta.keywords,
    applicationName: "PLUS Advisor",
    generator: "Next.js",
    authors: [{ name: "PLUS Advisor" }],
    creator: "PLUS Advisor",
    publisher: "PLUS Advisor",
    formatDetection: { email: false, address: false, telephone: false },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/icon.svg" }],
      shortcut: ["/icon.svg"],
    },
    alternates: buildLocaleAlternates("", locale),
    openGraph: buildOpenGraph({
      title,
      description,
      image: ogImage,
      path: "",
      locale,
      type: "website",
    }),
    twitter: buildTwitter({ title, description, image: ogImage }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "og:image:secure_url": absoluteUrl(ogImage),
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const searchIndex = await getSearchIndex(lang);

  return (
    <html
      lang={lang}
      className={`${fontA.variable} ${fontB.variable} ${fontC.variable} ${fontD.variable} ${fontE.variable} ${fontF.variable} ${fontG.variable} ${fontH.variable} ${fontI.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildOrganizationLd()} />
        <JsonLd data={buildWebsiteLd()} />
        <LocomotiveScrollProvider>
          <div id="top" className="flex flex-1 flex-col overflow-x-clip">
            <Header
              dict={dict.header}
              lang={lang}
              searchIndex={searchIndex}
              marketVisible={dict.market.visible}
            />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer dict={dict.footer} lang={lang} />
          </div>
        </LocomotiveScrollProvider>
      </body>
    </html>
  );
}
