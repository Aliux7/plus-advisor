"use client";

import MarketUpdateForm from "../../components/MarketUpdateForm";
import {
  createMarketEntry,
  type MarketUpdateDraft,
} from "../../lib/market-updates";

export default function NewMarketUpdatePage() {
  const handleSubmit = async (draft: MarketUpdateDraft) => {
    await createMarketEntry(draft);
  };

  return <MarketUpdateForm mode="create" onSubmit={handleSubmit} />;
}
