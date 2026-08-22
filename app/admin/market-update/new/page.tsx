"use client";

import MarketUpdateForm from "../../components/MarketUpdateForm";
import {
  createMarketEntry,
  type MarketUpdateDraft,
} from "../../lib/market-updates";
import { revalidateMarketUpdates } from "../../../lib/revalidate";

export default function NewMarketUpdatePage() {
  const handleSubmit = async (draft: MarketUpdateDraft) => {
    await createMarketEntry(draft);
    await revalidateMarketUpdates();
  };

  return <MarketUpdateForm mode="create" onSubmit={handleSubmit} />;
}
