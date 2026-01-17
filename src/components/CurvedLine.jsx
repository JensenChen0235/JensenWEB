import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CurvedLine = () => {
  const pathRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 0.85,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".about-hero-title",
        start: "top 70%",
        end: "+=300",
        scrub: 1,
      },
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      className="about-curved-line-svg"
      viewBox="0 0 600 120"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d="M20,70 C140,40 260,40 380,62 C460,78 520,78 580,58"
        fill="none"
        stroke="#5E7BFF"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ opacity: 0 }}
      />
    </svg>
  );
};

export default CurvedLine;
