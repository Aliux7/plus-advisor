"use client";

import JournalForm from "../../components/JournalForm";
import { createJournal, type JournalDraft } from "../../lib/journals";

export default function NewJournalPage() {
  const handleSubmit = async (draft: JournalDraft) => {
    await createJournal(draft);
  };

  return <JournalForm mode="create" onSubmit={handleSubmit} />;
}
