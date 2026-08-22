"use client";

import JournalForm from "../../components/JournalForm";
import { createJournal, type JournalDraft } from "../../lib/journals";
import { revalidateJournals } from "../../../lib/revalidate";

export default function NewJournalPage() {
  const handleSubmit = async (draft: JournalDraft) => {
    await createJournal(draft);
    await revalidateJournals();
  };

  return <JournalForm mode="create" onSubmit={handleSubmit} />;
}
