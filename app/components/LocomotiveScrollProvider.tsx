"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function LocomotiveScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let instance: { destroy: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const { default: LocomotiveScroll } = await import("locomotive-scroll");
      if (cancelled) return;
      instance = new LocomotiveScroll({
        lenisOptions: {
          wrapper: window,
          content: document.documentElement,
          lerp: 0.1,
          duration: 1.2,
          smoothWheel: true,
        },
      }) as unknown as { destroy: () => void };
    })();

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, [pathname]);

  return (
    <div ref={containerRef} data-scroll-container>
      {children}
    </div>
  );
}
