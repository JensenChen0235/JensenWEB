import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Arrow from './ui/Arrow'; 
import './AboutSection.css';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = ({ colorIndex, activeColor = "#0047ff" }) => {
  const sectionRef = useRef(null);
  const line1Ref = useRef(null);
  const beyondRef = useRef(null);
  const visionRef = useRef(null);
  const line2Ref = useRef(null);

  const lusionEase = [0.25, 1, 0.5, 1];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. 标题动效：上推 -> 右移 -> 下推 (严格保持你调优好的逻辑)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-hero-title",
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });

      tl.fromTo(line1Ref.current, { yPercent: 105 }, { yPercent: 0, duration: 1, ease: "power4.out" })
        .to([beyondRef.current, visionRef.current], {
          x: "8vw", 
          duration: 1.2,
          ease: "power2.inOut",
          stagger: 0.1
        }, "-=0.6")
        .fromTo(line2Ref.current, { yPercent: -105 }, { yPercent: 0, duration: 1, ease: "power4.out" }, "-=1.2");

      // 2. 内容区渐显动画（不包含视频，仅文字和按钮）
      gsap.fromTo(".footer-text-side", 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-footer-grid",
            start: "top 85%",
          }
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-container">
        {/* 标题部分 */}
        <div className="about-hero-title">
          <div className="title-mask line-1">
            <div ref={line1Ref} className="line-inner">
              <span ref={beyondRef} className="text-unit">BEYOND</span>
              <span ref={visionRef} className="text-unit">VISION</span>
            </div>
          </div>
          <div className="title-mask line-2">
            <div ref={line2Ref} className="line-inner">
              <span className="text-unit">WITHIN</span>
              <span className="text-unit">REACH</span>
            </div>
          </div>
        </div>

        {/* 内容网格：大屏左右布局，小屏垂直重排 */}
        <div className="about-footer-grid">
          <div className="about-photo-stack">
            <img
              src="/Jensen01.png"
              alt="Jensen portrait"
              className="about-portrait-image"
            />
          </div>

          <div className="footer-text-side">
            <p className="description">
              Hi, I'm a designer focused on interaction and visual storytelling. < br/>< br/>
              I translate complex ideas into clear, tactile experiences where every detail feels intentional.
              This space reflects my process, pace, and obsession with craft.< br/>< br/>
              I care about systems that scale, interfaces that feel quiet yet precise, and motion that supports meaning.
              When a product is simple to use, the design has done its job.
            </p>

            <motion.button
              className="about-us-btn"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
                  <motion.div
                    className="about-us-btn-bg"
                    variants={{ rest: { backgroundColor: "#ffffff" }, hover: { backgroundColor: activeColor } }}
                    transition={{ duration: 0.4, ease: lusionEase }}
                  />
              <div className="about-us-btn-content">
                <motion.span className="about-us-btn-arrow" variants={{ rest: { x: -25, opacity: 0 }, hover: { x: 0, opacity: 1 } }} transition={{ duration: 0.4, ease: lusionEase }}>
                  <Arrow direction="right" />
                </motion.span>
                <motion.span className="about-us-btn-text" variants={{ rest: { x: -8, color: "#000000" }, hover: { x: 5, color: "#ffffff" } }} transition={{ duration: 0.4, ease: lusionEase }}>
                  VIEW PROFILE
                </motion.span>
                <motion.span className="about-us-btn-dot" variants={{ rest: { x: 0, opacity: 1, scale: 1, backgroundColor: "#000000" }, hover: { x: 20, opacity: 0, scale: 0 } }} transition={{ duration: 0.4, ease: lusionEase }} />
              </div>
            </motion.button>

            <div className="skills-strip" aria-label="Skills">
              {[
                { label: "Figma", src: "/icons/figma.svg" },
                { label: "Photoshop", src: "/icons/photoshop.svg" },
                { label: "Illustrator", src: "/icons/illustrator.svg" },
                { label: "After Effects", src: "/icons/aftereffects.svg" },
                { label: "Blender", src: "/icons/blender.svg" },
              ].map((item) => (
                <div key={item.label} className="skill-tile">
                  <img src={item.src} alt={item.label} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
