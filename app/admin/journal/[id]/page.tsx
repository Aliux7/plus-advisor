"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JournalForm from "../../components/JournalForm";
import {
  getJournal,
  updateJournal,
  type JournalDraft,
  type JournalPost,
} from "../../lib/journals";
import { revalidateJournals } from "../../../lib/revalidate";

export default function EditJournalPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [post, setPost] = useState<JournalPost | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getJournal(id)
      .then((p) => {
        if (!cancelled) setPost(p);
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (post === undefined) {
    return <div className="text-sm text-neutral-500">Loading…</div>;
  }
  if (post === null) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Post not found.
      </div>
    );
  }

  const handleSubmit = async (draft: JournalDraft) => {
    await updateJournal(post.id, draft);
    await revalidateJournals();
  };

  return <JournalForm mode="edit" initial={post} onSubmit={handleSubmit} />;
}
