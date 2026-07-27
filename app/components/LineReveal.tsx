"use client";

import {
  Children,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type LineRevealDirection = "up" | "down" | "left" | "right";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  easing?: string;
  style?: CSSProperties;
  /**
   * Reveal direction of the sweep. Default `"left"` — content is exposed from
   * right to left, i.e. the right edge appears first and the mask retreats
   * leftward.
   */
  direction?: LineRevealDirection;
  /** Rendered inline at the start of the first line (rides its reveal). */
  prefix?: ReactNode;
  /** Rendered inline at the end of the last line (rides its reveal). */
  suffix?: ReactNode;
};

/**
 * Splits `children` into the plain-text portion (used for line measurement /
 * animation) and any React elements that should be rendered as-is alongside
 * the animated lines. Elements like <span className="absolute">…</span> are
 * treated as decorative overlays — they don't participate in line splitting.
 */
function partitionChildren(children: ReactNode): {
  text: string;
  overlays: ReactNode[];
} {
  let text = "";
  const overlays: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (child == null || typeof child === "boolean") return;
    if (typeof child === "string" || typeof child === "number") {
      text += String(child);
    } else {
      overlays.push(child);
    }
  });
  return { text, overlays };
}

/**
 * Returns the initial (hidden) and final (revealed) clip-path values for the
 * chosen direction. Uses `inset()` so the shape function matches on both ends,
 * enabling a smooth transition.
 */
function clipsFor(direction: LineRevealDirection): {
  hidden: string;
  shown: string;
} {
  switch (direction) {
    case "up":
      // Curtain lifts from bottom → top: initially clipped from bottom.
      return { hidden: "inset(100% 0 0 0)", shown: "inset(0 0 0 0)" };
    case "down":
      // Curtain lowers from top → bottom: initially clipped from top.
      return { hidden: "inset(0 0 100% 0)", shown: "inset(0 0 0 0)" };
    case "right":
      // Reveal from left → right: right side clipped initially.
      return { hidden: "inset(0 100% 0 0)", shown: "inset(0 0 0 0)" };
    case "left":
    default:
      // Reveal from right → left: left side clipped initially.
      return { hidden: "inset(0 0 0 100%)", shown: "inset(0 0 0 0)" };
  }
}

export default function LineReveal({
  children,
  className,
  delay = 0,
  duration = 900,
  stagger = 100,
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  style,
  direction = "left",
  prefix,
  suffix,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([]);

  const { text, overlays } = useMemo(
    () => partitionChildren(children),
    [children],
  );

  const clips = useMemo(() => clipsFor(direction), [direction]);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const words = text.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        setLines([]);
        return;
      }
      el.innerHTML = "";
      const nodes: HTMLSpanElement[] = words.map((w) => {
        const s = document.createElement("span");
        s.textContent = w;
        s.style.display = "inline-block";
        return s;
      });
      nodes.forEach((n, i) => {
        el.appendChild(n);
        if (i < nodes.length - 1) el.appendChild(document.createTextNode(" "));
      });

      let currentTop = Number.NEGATIVE_INFINITY;
      const grouped: string[][] = [];
      nodes.forEach((n, i) => {
        const top = n.offsetTop;
        if (top !== currentTop) {
          grouped.push([]);
          currentTop = top;
        }
        grouped[grouped.length - 1].push(words[i]);
      });
      setLines(grouped.map((l) => l.join(" ")));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, [text]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin]);

  useEffect(() => {
    if (!visible || !lines) return;
    setRevealed(new Array(lines.length).fill(false));
    const timers = lines.map((_, i) =>
      window.setTimeout(
        () =>
          setRevealed((prev) => {
            const next = prev.slice();
            next[i] = true;
            return next;
          }),
        delay + i * stagger + duration,
      ),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [visible, lines, delay, stagger, duration]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ position: "relative", ...style }}
    >
      <div
        ref={measureRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />
      {overlays.map((node, i) => (
        <span key={`overlay-${i}`} style={{ display: "contents" }}>
          {node}
        </span>
      ))}
      {lines ? (
        lines.map((line, i) => {
          const isFirst = i === 0;
          const isLast = i === lines.length - 1;
          const done = revealed[i] === true;
          return (
            <span
              key={i}
              style={{
                display: "block",
                clipPath: done
                  ? "none"
                  : visible
                    ? clips.shown
                    : clips.hidden,
                transition: `clip-path ${duration}ms ${easing} ${
                  delay + i * stagger
                }ms`,
                willChange: done ? undefined : "clip-path",
              }}
            >
              {isFirst && prefix}
              {line}
              {isLast && suffix}
            </span>
          );
        })
      ) : (
        <span style={{ visibility: "hidden" }}>
          {prefix}
          {text}
          {suffix}
        </span>
      )}
    </div>
  );
}
