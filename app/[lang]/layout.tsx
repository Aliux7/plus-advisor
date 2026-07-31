import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Raleway,
  Saira,
  IBM_Plex_Sans_Condensed,
} from "next/font/google";
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
import { getSearchIndex } from "../lib/posts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Check unused remode TODO
const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-ibm-plex-sans-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const catalog = localFont({
  variable: "--font-catalog",
  display: "swap",
  src: [
    { path: "../fonts/Catalog-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Catalog-Italic.otf", weight: "400", style: "italic" },
    { path: "../fonts/Catalog-Bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/Catalog-Black.otf", weight: "900", style: "normal" },
  ],
});

const gothamCondensed = localFont({
  variable: "--font-gotham-condensed",
  display: "swap",
  src: [
    {
      path: "../fonts/Gotham-Condensed-Book-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
});

const gotham = localFont({
  variable: "--font-gotham",
  display: "swap",
  src: [
    { path: "../fonts/Gotham-Regular.otf", weight: "400", style: "normal" },
  ],
});

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const searchIndex = getSearchIndex();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${raleway.variable} ${saira.variable} ${ibmPlexSansCondensed.variable} ${catalog.variable} ${gothamCondensed.variable} ${gotham.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocomotiveScrollProvider>
          <div id="top" className="flex flex-1 flex-col overflow-x-clip">
            <Header dict={dict.header} lang={lang} searchIndex={searchIndex} />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer dict={dict.footer} lang={lang} />
          </div>
        </LocomotiveScrollProvider>
      </body>
    </html>
  );
}
