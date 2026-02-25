import { useEffect, useRef } from "react";

const isInteractive = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.closest("button, a, [role='button'], [data-cursor='hover'], input, textarea, select") !==
    null
  );
};

export const PremiumCursor = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId: number | null = null;

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const animate = () => {
      const lerpFactor = 0.16;
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      rafId = window.requestAnimationFrame(animate);
    };

    const handleEnter = (event: MouseEvent) => {
      if (!isInteractive(event.target)) return;
      ring.classList.add("cursor-ring-hover");
      dot.classList.add("cursor-dot-hover");
    };

    const handleLeave = (event: MouseEvent) => {
      if (!isInteractive(event.target)) return;
      ring.classList.remove("cursor-ring-hover");
      dot.classList.remove("cursor-dot-hover");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleEnter);
    window.addEventListener("mouseout", handleLeave);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleEnter);
      window.removeEventListener("mouseout", handleLeave);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
};

export default PremiumCursor;

