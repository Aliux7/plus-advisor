"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  subscribeToJournals,
  type JournalPost,
} from "./lib/journals";
import {
  CATEGORY_LABELS,
  isPeriodCategory,
  subscribeToMarketEntries,
  type MarketUpdateEntry,
} from "./lib/market-updates";

const QUICK_LINKS = [
  { href: "/admin/journal/new", label: "New Journal Entry" },
  { href: "/admin/market-update", label: "Add Market Update" },
  { href: "/admin/whitelist", label: "Manage Whitelist" },
] as const;

function formatDate(ts: JournalPost["publishedAt"]): string {
  if (!ts) return "—";
  const d = ts.toDate();
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(ts: JournalPost["updatedAt"]): string {
  if (!ts) return "—";
  const diffMs = Date.now() - ts.toDate().getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function AdminHome() {
  const [journals, setJournals] = useState<JournalPost[] | null>(null);
  const [marketEntries, setMarketEntries] = useState<MarketUpdateEntry[] | null>(
    null,
  );

  useEffect(() => {
    const unsub = subscribeToJournals(
      (rows) => setJournals(rows),
      () => setJournals([]),
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeToMarketEntries(
      (rows) => setMarketEntries(rows),
      () => setMarketEntries([]),
    );
    return unsub;
  }, []);

  const stats = useMemo(() => {
    const j = journals ?? [];
    const m = marketEntries ?? [];
    return {
      journalsTotal: j.length,
      journalsPublished: j.filter((p) => p.status === "published").length,
      journalsDrafts: j.filter((p) => p.status === "draft").length,
      journalsFeatured: j.filter((p) => p.featured).length,
      totalViews: j.reduce((sum, p) => sum + (p.views ?? 0), 0),
      marketTotal: m.length,
      marketPeriod: m.filter((e) => isPeriodCategory(e.categoryKey)).length,
      marketInsight: m.filter((e) => !isPeriodCategory(e.categoryKey)).length,
    };
  }, [journals, marketEntries]);

  const recentJournals = useMemo(() => {
    if (!journals) return [];
    return [...journals]
      .sort((a, b) => {
        const at = a.updatedAt?.toMillis() ?? 0;
        const bt = b.updatedAt?.toMillis() ?? 0;
        return bt - at;
      })
      .slice(0, 5);
  }, [journals]);

  const topJournals = useMemo(() => {
    if (!journals) return [];
    return [...journals]
      .filter((p) => p.status === "published")
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 5);
  }, [journals]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-navy/60">
          Overview of your content and quick actions.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Journals"
          value={stats.journalsTotal}
          hint={`${stats.journalsPublished} published · ${stats.journalsDrafts} drafts`}
          loading={journals === null}
        />
        <StatCard
          label="Total Views"
          value={stats.totalViews}
          hint="Across all published journals"
          loading={journals === null}
        />
        <StatCard
          label="Featured Journals"
          value={stats.journalsFeatured}
          hint="Shown on the Latest & Featured hero"
          loading={journals === null}
        />
        <StatCard
          label="Market Updates"
          value={stats.marketTotal}
          hint={`${stats.marketPeriod} period · ${stats.marketInsight} insight`}
          loading={marketEntries === null}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Recent Journal Activity"
          action={
            <Link
              href="/admin/journal"
              className="text-xs text-gold underline hover:opacity-80"
            >
              View all
            </Link>
          }
        >
          {journals === null ? (
            <PanelLoading />
          ) : recentJournals.length === 0 ? (
            <PanelEmpty>No journals yet.</PanelEmpty>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {recentJournals.map((p) => (
                <li key={p.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/journal/${p.id}`}
                        className="block truncate text-sm font-medium text-navy hover:text-gold"
                      >
                        {p.title || "(untitled)"}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-navy/60">
                        <StatusPill status={p.status} />
                        <span>·</span>
                        <span>{p.author || "—"}</span>
                        <span>·</span>
                        <span>{formatDate(p.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-xs text-navy/60">
                      <div>{timeAgo(p.updatedAt)}</div>
                      <div className="mt-0.5 text-gold">
                        {p.views ?? 0} views
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Top Journals by Views">
          {journals === null ? (
            <PanelLoading />
          ) : topJournals.length === 0 ? (
            <PanelEmpty>No published journals yet.</PanelEmpty>
          ) : (
            <ol className="space-y-2">
              {topJournals.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-5 shrink-0 text-right font-catalog text-xs font-medium text-gold">
                      {i + 1}
                    </span>
                    <Link
                      href={`/admin/journal/${p.id}`}
                      className="truncate text-sm text-navy hover:text-gold"
                    >
                      {p.title || "(untitled)"}
                    </Link>
                  </div>
                  <span className="shrink-0 text-xs text-navy/60">
                    {p.views ?? 0} views
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <Panel title="Market Updates by Category">
        {marketEntries === null ? (
          <PanelLoading />
        ) : marketEntries.length === 0 ? (
          <PanelEmpty>
            No market updates yet.{" "}
            <Link
              href="/admin/market-update"
              className="text-gold underline hover:opacity-80"
            >
              Add one
            </Link>
            .
          </PanelEmpty>
        ) : (
          <MarketBreakdown entries={marketEntries} />
        )}
      </Panel>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUICK_LINKS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-center justify-between rounded-lg border border-navy/10 bg-white p-4 text-sm font-medium text-navy transition-colors hover:border-gold hover:bg-gold/5"
            >
              <span>{c.label}</span>
              <span className="text-gold transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  loading,
}: {
  label: string;
  value: number;
  hint: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-gold">
        {label}
      </div>
      <div className="mt-2 font-catalog text-3xl font-semibold tracking-tight text-navy">
        {loading ? (
          <span className="inline-block h-8 w-16 animate-pulse rounded bg-neutral-100" />
        ) : (
          value.toLocaleString()
        )}
      </div>
      <div className="mt-1 text-xs text-navy/60">{hint}</div>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-navy/10 bg-white">
      <header className="flex items-center justify-between border-b border-navy/10 px-5 py-3">
        <h2 className="text-sm font-semibold text-navy">{title}</h2>
        {action}
      </header>
      <div className="px-5 py-3">{children}</div>
    </section>
  );
}

function PanelLoading() {
  return (
    <div className="space-y-2 py-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-8 animate-pulse rounded bg-neutral-100"
        />
      ))}
    </div>
  );
}

function PanelEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-6 text-center text-sm text-neutral-500">{children}</div>
  );
}

function StatusPill({ status }: { status: JournalPost["status"] }) {
  const styles: Record<JournalPost["status"], string> = {
    published: "bg-green-100 text-green-800",
    draft: "bg-neutral-100 text-neutral-700",
    archived: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function MarketBreakdown({ entries }: { entries: MarketUpdateEntry[] }) {
  const grouped = new Map<string, MarketUpdateEntry[]>();
  for (const e of entries) {
    const arr = grouped.get(e.categoryKey) ?? [];
    arr.push(e);
    grouped.set(e.categoryKey, arr);
  }
  const rows = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);
  const max = rows[0]?.[1].length ?? 1;

  return (
    <div className="space-y-2">
      {rows.map(([key, list]) => {
        const label =
          CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] ?? key;
        const pct = (list.length / max) * 100;
        return (
          <div key={key} className="flex items-center gap-3 text-sm">
            <div className="w-40 shrink-0 truncate text-navy">{label}</div>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-navy/5">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gold"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="w-10 shrink-0 text-right text-xs tabular-nums text-navy/60">
              {list.length}
            </div>
          </div>
        );
      })}
    </div>
  );
}
