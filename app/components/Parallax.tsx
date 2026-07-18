"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** Positive = element moves opposite to scroll (slower/lags). Negative = leads scroll. */
  speed?: number;
  /** "vertical" translates on Y, "horizontal" on X. */
  axis?: "vertical" | "horizontal";
  className?: string;
  style?: CSSProperties;
} & Omit<HTMLAttributes<HTMLElement>, "style" | "className" | "children">;

export default function Parallax({
  children,
  as: Tag = "div",
  speed = 0.3,
  axis = "vertical",
  className,
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    let rafId = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportSize =
        axis === "vertical" ? window.innerHeight : window.innerWidth;
      const elCenter =
        axis === "vertical"
          ? rect.top + rect.height / 2
          : rect.left + rect.width / 2;
      const distanceFromCenter = elCenter - viewportSize / 2;
      const offset = -distanceFromCenter * speed;
      el.style.transform =
        axis === "vertical"
          ? `translate3d(0, ${offset}px, 0)`
          : `translate3d(${offset}px, 0, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
  }, [speed, axis]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ willChange: "transform", ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
