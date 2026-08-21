"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ContentEditor from "../../components/ContentEditor";

const SECTION_LABELS: Record<string, string> = {
  meta: "Meta & SEO",
  header: "Header",
  whistleBlower: "Whistle Blowing Button",
  footer: "Footer",
  home: "Home page",
  ourServicePillars: "Our Service Pillars",
  about: "About page",
  stories: "Our Stories page",
  office: "Family Office page",
  journals: "Journals page",
  market: "Market Update page",
  contact: "Contact Us page",
  news: "News detail page",
};

const KNOWN = new Set(Object.keys(SECTION_LABELS));

export default function ContentSectionPage() {
  const params = useParams<{ section: string }>();
  const section = params?.section;

  if (!section || !KNOWN.has(section)) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Unknown content section.{" "}
        <Link href="/admin/content" className="underline">
          Back to content
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-navy/60">
            <Link href="/admin/content" className="hover:text-gold">
              Site Content
            </Link>
            <span className="mx-2">/</span>
            <span>{SECTION_LABELS[section]}</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy">
            {SECTION_LABELS[section]}
          </h1>
          <p className="mt-1 text-sm text-navy/60">
            Edit each field in every language. Save when done.
          </p>
        </div>
      </div>

      <ContentEditor section={section} />
    </div>
  );
}
