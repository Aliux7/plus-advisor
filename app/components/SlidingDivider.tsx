"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  barClassName?: string;
  delay?: number;
  duration?: number;
};

export default function SlidingDivider({
  className,
  barClassName = "bg-gold",
  delay = 300,
  duration = 1400,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={`overflow-hidden h-px ${className ?? ""}`}>
      <div
        style={{
          transform: visible ? "translateX(0)" : "translateX(-100%)",
          transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          willChange: "transform",
        }}
        className={`h-full w-full ${barClassName}`}
      />
    </div>
  );
}
