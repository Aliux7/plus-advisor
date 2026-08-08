"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MarketUpdateForm from "../../components/MarketUpdateForm";
import {
  getMarketEntry,
  updateMarketEntry,
  type MarketUpdateDraft,
  type MarketUpdateEntry,
} from "../../lib/market-updates";

export default function EditMarketUpdatePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [entry, setEntry] = useState<MarketUpdateEntry | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getMarketEntry(id)
      .then((e) => {
        if (!cancelled) setEntry(e);
      })
      .catch(() => {
        if (!cancelled) setEntry(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (entry === undefined) {
    return <div className="text-sm text-neutral-500">Loading…</div>;
  }
  if (entry === null) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Entry not found.
      </div>
    );
  }

  const handleSubmit = async (draft: MarketUpdateDraft) => {
    await updateMarketEntry(entry.id, draft);
  };

  return <MarketUpdateForm mode="edit" initial={entry} onSubmit={handleSubmit} />;
}
