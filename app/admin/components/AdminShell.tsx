"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/market-update", label: "Market Update" },
  { href: "/admin/contact", label: "Contact Us" },
  { href: "/admin/whitelist", label: "Whitelist" },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white">
        <div className="flex h-14 items-center border-b border-neutral-200 px-5 font-catalog font-semibold tracking-widest text-navy">
          Plus Advisor
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-navy text-white"
                    : "text-navy/80 hover:bg-gold/10 hover:text-navy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
          <div className="text-sm text-gold">Admin</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-navy">
              {user.displayName ?? user.email}
            </span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-md border border-neutral-200 px-3 py-1.5 text-navy hover:bg-gold/10"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
