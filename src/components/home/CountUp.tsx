"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Counts up once when scrolled into view. Server-renders the final value (no layout shift, works without JS). */
export function CountUp({ value, locale, duration = 1400 }: { value: number; locale: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || reduce || started.current) return;
    started.current = true;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  // Deterministic grouping (server and browser ICU data can differ, e.g. for sq-AL)
  const sep = locale.startsWith("sq") ? " " : ",";
  const formatted = String(display).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
    </span>
  );
}
