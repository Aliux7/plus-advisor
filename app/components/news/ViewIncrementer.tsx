"use client";

import { useEffect, useRef } from "react";
import { incrementJournalView } from "../../lib/actions";

type Props = { id: string };

export default function ViewIncrementer({ id }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !id) return;
    fired.current = true;

    const key = `journal-view:${id}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    incrementJournalView(id).catch(() => {
      sessionStorage.removeItem(key);
    });
  }, [id]);

  return null;
}
