import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Arrow from './ui/Arrow';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = ({ activeColor = "#0047ff" }) => {
  const progressBarRef = useRef(null);
  const progressTweenRef = useRef(null);
  const blackSectionRef = useRef(null);
  const whiteSectionRef = useRef(null);
  const hasTriggeredRef = useRef(false);
  const navigate = useNavigate();

  const lusionEase = [0.25, 1, 0.5, 1];
  
  const socialLinkVariants = {
    rest: { x: -30 },
    hover: { x: 0 }
  };

  const socialArrowVariants = {
    rest: { x: -45, y: 4, opacity: 0 },
    hover: { x: 0, y: 3, opacity: 1 }
  };

  const underlineVariants = {
    rest: { scaleX: 0, originX: 0 },
    hover: { scaleX: 1, originX: 0 }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. 文字逐行推出动画
      gsap.fromTo(".reveal-content", 
        { yPercent: 110, opacity: 0 }, 
        { 
          yPercent: 0, 
          opacity: 1,
          duration: 1, 
          stagger: 0.04, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: whiteSectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // 2. Email 输入框拉伸动效
      gsap.fromTo(".newsletter-pill", 
        { 
          clipPath: "inset(0% 90% 0% 0%)",
          opacity: 0.5 
        },
        { 
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".newsletter-col",
            start: "top 90%",
          }
        }
      );

      // 3. 内部元素滑入
      gsap.fromTo([".newsletter-input", ".newsletter-arrow-btn"],
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".newsletter-col",
            start: "top 90%",
          }
        }
      );

      const startTimer = () => {
        if (hasTriggeredRef.current || !progressBarRef.current) return;
        if (progressTweenRef.current) {
          progressTweenRef.current.resume();
          return;
        }
        gsap.set(progressBarRef.current, { scaleX: 0 });
        progressTweenRef.current = gsap.to(progressBarRef.current, {
          scaleX: 1,
          duration: 8,
          ease: "none",
          onComplete: () => {
            if (hasTriggeredRef.current) return;
            hasTriggeredRef.current = true;
            if (window.lenis) window.lenis.stop();
            navigate("/about");
          }
        });
      };

      const pauseTimer = () => {
        if (progressTweenRef.current) progressTweenRef.current.pause();
      };

      const resetTimer = () => {
        if (hasTriggeredRef.current) return;
        if (progressTweenRef.current) {
          progressTweenRef.current.kill();
          progressTweenRef.current = null;
        }
        if (progressBarRef.current) gsap.set(progressBarRef.current, { scaleX: 0 });
      };

      const handleVisibility = () => {
        if (!blackSectionRef.current) return;
        const rect = blackSectionRef.current.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!isVisible) {
          resetTimer();
          return;
        }
        const atBottom = rect.bottom <= window.innerHeight + 1;
        if (atBottom) {
          startTimer();
        } else {
          pauseTimer();
        }
      };

      // 4. 黑色区域：到达底部开始计时，上滑暂停，离开视窗重置
      ScrollTrigger.create({
        trigger: blackSectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: handleVisibility,
        onEnterBack: handleVisibility,
        onUpdate: handleVisibility,
        onLeave: resetTimer,
        onLeaveBack: resetTimer
      });

    }, whiteSectionRef);
    return () => {
      if (progressTweenRef.current) {
        progressTweenRef.current.kill();
        progressTweenRef.current = null;
      }
      ctx.revert();
    };
  }, [navigate]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextClick = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
      progressTweenRef.current = null;
    }
    if (window.lenis) window.lenis.stop();
    navigate("/about");
  };

  const Mask = ({ children, className = "", isFullWidth = false }) => (
    <div className={`footer-safe-mask ${isFullWidth ? 'full-w' : ''} ${className}`}>
      <div className="reveal-content">{children}</div>
    </div>
  );

  return (
    <footer className="lusion-footer">
      <div ref={whiteSectionRef} className="footer-white-zone">
        <div className="footer-grid">
          <div className="footer-col address-col">
            <Mask><p>Suite 2</p></Mask>
            <Mask><p>9 Marsh Street</p></Mask>
            <Mask><p>Bristol, BS1 4AA</p></Mask>
            <Mask><p>United Kingdom</p></Mask>
          </div>

          <div className="footer-col mid-links-col">
            <div className="link-group">
              <ul className="footer-link-list">
                {['Twitter / X', 'Instagram', 'Linkedin'].map((item) => (
                  <Mask key={item} className="social-mask">
                    <motion.li initial="rest" whileHover="hover" animate="rest">
                      <a href={`#${item}`} className="social-interactive-link">
                        <motion.span className="link-arrow-icon" variants={socialArrowVariants} transition={{ duration: 0.4, ease: lusionEase }}>
                          <Arrow direction='up-right' />
                        </motion.span>
                        <motion.span className="link-text" variants={socialLinkVariants} transition={{ duration: 0.4, ease: lusionEase }}>
                          {item}
                        </motion.span>
                      </a>
                    </motion.li>
                  </Mask>
                ))}
              </ul>
            </div>
            
            <div className="link-group contact-items">
              {[
                { label: 'General enquires', email: 'hello@lusion.co' },
                { label: 'New business', email: 'business@lusion.co' }
              ].map((item) => (
                <div className="contact-item" key={item.label}>
                  <Mask><span className="col-label">{item.label}</span></Mask>
                  <Mask>
                    <motion.a href={`mailto:${item.email}`} className="email-interactive-link" initial="rest" whileHover="hover" animate="rest">
                      {item.email}
                      <motion.div className="email-underline" variants={underlineVariants} transition={{ duration: 0.5, ease: lusionEase }} />
                    </motion.a>
                  </Mask>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-col newsletter-col">
            <Mask isFullWidth><h2 className="newsletter-heading">Subscribe to our newsletter</h2></Mask>
            <div className="newsletter-pill">
              <input type="email" placeholder="Your email" className="newsletter-input" />
              <button className="newsletter-arrow-btn">
                <Arrow direction="right" />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-legal-bar">
          <Mask><span>©2025 JENSEN Creative Studio</span></Mask>
          <Mask><span>R&D: labs.lusion.co</span></Mask>
          <Mask><span>Built by Lusion with ❤️</span></Mask>
          <div className="back-to-top-wrap">
            <button className="back-to-top-circle" onClick={handleBackToTop}>
              <div className="bt-icon">↑</div>
            </button>
          </div>
        </div>
      </div>

      {/* --- 核心修改：黑色背景区域布局还原 --- */}
      <section
        ref={blackSectionRef}
        className="next-project-footer home-next-footer"
        role="button"
        tabIndex={0}
        onClick={handleNextClick}
        onKeyDown={(e) => e.key === "Enter" && handleNextClick()}
        style={{
          "--project-hover": activeColor,
          "--project-next-bg": "#0b0b0b",
          "--project-next-text": "#ffffff",
          "--project-next-subtle": "rgba(255, 255, 255, 0.45)"
        }}
      >
        <div className="next-footer-container">
          <span className="next-hint">NEXT</span>
          <div className="next-main-row">
            <h2 className="next-title-display">PROFILE</h2>
            <div className="next-progress-group">
              <span className="next-tag">NEXT PAGE</span>
              <div className="next-bar-base">
                <div ref={progressBarRef} className="next-bar-fill" />
              </div>
              <div className="next-arrow">→</div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
