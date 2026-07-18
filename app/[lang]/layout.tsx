import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Raleway,
  Saira,
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

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${raleway.variable} ${saira.variable} ${catalog.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocomotiveScrollProvider>{children}</LocomotiveScrollProvider>
      </body>
    </html>
  );
}
