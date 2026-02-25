import { PropsWithChildren, useEffect, useRef } from "react";

type ScrollRevealProps = PropsWithChildren<{
  delay?: number;
}>;

export const ScrollReveal = ({ children, delay = 0 }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("section-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    node.classList.add("section-reveal");
    (node.style as CSSStyleDeclaration).transitionDelay = `${delay}s`;

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return <div ref={ref}>{children}</div>;
};

export default ScrollReveal;

