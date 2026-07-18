"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type AllHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export type ScrollRevealVariant =
  | "fade-in"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "slide-right"
  | "slide-left";

type Props = {
  children: ReactNode;
  as?: ElementType;
  variant?: ScrollRevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  easing?: string;
  className?: string;
  style?: CSSProperties;
} & Omit<AllHTMLAttributes<HTMLElement>, "style" | "className" | "children" | "as">;

const initialTransformFor = (
  variant: ScrollRevealVariant,
  distance: number
): string => {
  switch (variant) {
    case "fade-up":
      return `translate3d(0, ${distance}px, 0)`;
    case "fade-down":
      return `translate3d(0, -${distance}px, 0)`;
    case "fade-left":
      return `translate3d(${distance}px, 0, 0)`;
    case "fade-right":
      return `translate3d(-${distance}px, 0, 0)`;
    case "zoom-in":
      return "scale(0.94)";
    case "zoom-out":
      return "scale(1.06)";
    case "slide-right":
    case "slide-left":
      return "scaleX(0)";
    case "fade-in":
    default:
      return "none";
  }
};

const transformOriginFor = (variant: ScrollRevealVariant): string | undefined => {
  switch (variant) {
    case "slide-right":
      return "left center";
    case "slide-left":
      return "right center";
    default:
      return undefined;
  }
};

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getReducedMotionServerSnapshot = () => false;

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

export default function ScrollReveal({
  children,
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  duration = 800,
  distance = 40,
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  className,
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  const effectiveDuration = reducedMotion ? 0 : duration;
  const effectiveDelay = reducedMotion ? 0 : delay;

  const mergedStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : initialTransformFor(variant, distance),
    transformOrigin: transformOriginFor(variant),
    transition: `opacity ${effectiveDuration}ms ${easing} ${effectiveDelay}ms, transform ${effectiveDuration}ms ${easing} ${effectiveDelay}ms`,
    willChange: visible ? undefined : "opacity, transform",
    ...style,
  };

  return (
    <Tag ref={ref} className={className} style={mergedStyle} {...rest}>
      {children}
    </Tag>
  );
}
