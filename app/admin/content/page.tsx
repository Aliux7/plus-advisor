import Link from "next/link";

const SECTIONS: { key: string; label: string; blurb: string }[] = [
  {
    key: "meta",
    label: "Meta & SEO",
    blurb: "Site title and description shown in browser tabs and search results.",
  },
  {
    key: "header",
    label: "Header",
    blurb: "Top navigation labels, search placeholders, and language toggle text.",
  },
  {
    key: "whistleBlower",
    label: "Whistle Blowing Button",
    blurb: "Show/hide the floating whistle button and set the URL it opens.",
  },
  {
    key: "footer",
    label: "Footer",
    blurb: "Company description, contact, whistleblower notice, and disclaimer.",
  },
  {
    key: "home",
    label: "Home page",
    blurb: "Hero, Family Legacy, Beyond Financial Advice, Quote, Featured Journals.",
  },
  {
    key: "ourServicePillars",
    label: "Our Service Pillars",
    blurb: "Shared slider used on both Home and Family Office pages — slide copy, images, and Family Office intro.",
  },
  {
    key: "about",
    label: "About page",
    blurb: "About Plus Advisor, Leadership, About Her, Mindset & Planning, Star Value, Integrity.",
  },
  {
    key: "stories",
    label: "Our Stories page",
    blurb: "Hero, Our Story, Vision & Mission, Our Values.",
  },
  {
    key: "office",
    label: "Family Office page",
    blurb: "Hero, Family Office overview, Ascent, Holistic Approach, Quiet Mind.",
  },
  {
    key: "journals",
    label: "Journals page",
    blurb: "Hero, Latest & Featured strip, and journals grid labels.",
  },
  {
    key: "market",
    label: "Market Update page",
    blurb: "Section labels and category names on the market update page.",
  },
  {
    key: "news",
    label: "News detail page",
    blurb: "Labels used on individual journal / news article pages.",
  },
];

export default function ContentHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">
          Site Content
        </h1>
        <p className="mt-1 text-sm text-navy/60">
          Every word on the public site — edit each field in English, Bahasa
          Indonesia, and Chinese. Changes go live on the next page load.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={`/admin/content/${s.key}`}
            className="group flex flex-col gap-2 rounded-lg border border-navy/10 bg-white p-5 transition-colors hover:border-gold hover:bg-gold/5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-catalog text-base font-semibold text-navy">
                {s.label}
              </h2>
              <span className="text-gold transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
            <p className="text-xs text-navy/60">{s.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
