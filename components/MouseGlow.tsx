"use client";

import { useEffect, useRef } from "react";

export function MouseGlow() {
  const blob = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      blob.current?.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 3000, fill: "forwards" }
      );
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="mouse-glow" aria-hidden="true">
      <div ref={blob} className="mouse-glow__blob" />
    </div>
  );
}
