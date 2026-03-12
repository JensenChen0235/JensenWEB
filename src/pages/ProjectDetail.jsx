import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Lottie from "lottie-react";
import { useLenis } from "../hooks/useLenis";
import { projectsData, projectsList } from "../data/project";
import Menu from "../components/Header/Menu";
import SoundButton from "../components/Header/SoundButton";
import TalkButton from "../components/Header/TalkButton";
import Arrow from "../components/ui/Arrow";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  useLenis();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false); // 控制页面显示
  const [insightSelected, setInsightSelected] = useState(0);
  const [accordionSelected, setAccordionSelected] = useState(0);
  const [showcaseSelected, setShowcaseSelected] = useState(0);
  const [colorSelected, setColorSelected] = useState(null);
  const [uiOverlay, setUiOverlay] = useState(null);
  const [posterOverlay, setPosterOverlay] = useState(null);
  const [posterIndex, setPosterIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState({});
  const [audienceIndex, setAudienceIndex] = useState(0);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const nextSectionRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const videoRefs = useRef({});

  const currentIndex = projectsList.findIndex((p) => p.id === id);
  const project = projectsData[id] || projectsList[0];
  const nextProject = projectsList[(currentIndex + 1) % projectsList.length];
  const getContrastColor = (color) => {
    if (!color) return "#000000";
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      const full = hex.length === 3
        ? hex.split("").map((c) => c + c).join("")
        : hex;
      const r = parseInt(full.slice(0, 2), 16);
      const g = parseInt(full.slice(2, 4), 16);
      const b = parseInt(full.slice(4, 6), 16);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance > 0.6 ? "#000000" : "#E5E6EF";
    }
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return "#000000";
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.6 ? "#000000" : "#E5E6EF";
  };
  const logoColor = getContrastColor(project.color);

  const galleryImages = project.gallery || [
    `https://picsum.photos/seed/${id}1/1600/1000`,
    `https://picsum.photos/seed/${id}2/1600/1000`,
    `https://picsum.photos/seed/${id}3/1600/1000`,
  ];
  const galleryCopy = [
    {
      title: "A Clear System, Built for Focus",
      description: "A calm visual hierarchy that keeps attention on what matters most. Every layer is intentional, every interaction is quiet by design.",
    },
    {
      title: "Precision You Can Feel",
      description: "Micro-motion and tactile cues create a sense of weight and control. The interface responds like a physical object, not a webpage.",
    },
    {
      title: "Designed to Stay Out of the Way",
      description: "Content leads, interface supports. The layout breathes, the typography holds the tone, and the experience stays effortless.",
    },
  ];
  const getGalleryCopy = (index) =>
    galleryCopy[index] || {
      title: `Module ${index + 1}`,
      description: "A purposeful module designed to showcase interaction, clarity, and restraint. Placeholder copy for future content.",
    };

  const sections = Array.isArray(project.sections)
    ? project.sections
    : galleryImages.map((img, idx) => ({
        type: "web",
        image: img,
        ...getGalleryCopy(idx),
      }));
  const isDribbbleLayout = project.layout === "dribbble";
  const isTeraboxLayout = project.layout === "terabox";
  const setVideoState = (key, isPlaying) => {
    setVideoPlaying((prev) => ({ ...prev, [key]: isPlaying }));
  };
  const toggleVideo = (key) => {
    const video = videoRefs.current[key];
    if (!video) return;
    if (video.paused) {
      video.play();
      setVideoState(key, true);
    } else {
      video.pause();
      setVideoState(key, false);
    }
  };

  const handleFlowHover = (key, shouldPlay) => {
    const video = videoRefs.current[key];
    if (!video) return;
    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  const renderParagraphs = (text, className) => {
    if (!text) return null;
    return String(text)
      .split("\n\n")
      .filter(Boolean)
      .map((paragraph, index) => (
        <p key={index} className={className}>
          {paragraph.replace(/\n/g, " ")}
        </p>
      ));
  };

  // --- 1. 物理层重置：在所有渲染前执行 ---
  useLayoutEffect(() => {
    setIsReady(false);
    setInsightSelected(0);
    setAccordionSelected(0);
    setShowcaseSelected(0);
    setColorSelected(null);
    setUiOverlay(null);
    // 强行关闭浏览器的自动滚动恢复
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 立即重置滚动位置
    window.scrollTo(0, 0);

    if (window.lenis) {
      window.lenis.stop(); // 立即停止之前的动量
      window.lenis.scrollTo(0, { immediate: true });
    }

    // 给浏览器 100ms 时间处理滚动条复位，再显示内容
    const timer = setTimeout(() => {
      setIsReady(true);
      if (window.lenis) window.lenis.start();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = uiOverlay ? "hidden" : "";
    if (window.lenis) {
      if (uiOverlay) {
        window.lenis.stop();
      } else {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    };
  }, [uiOverlay]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const threshold = 4;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 8) {
        setIsHeaderHidden(false);
      } else if (delta > threshold) {
        setIsHeaderHidden(true);
      } else if (delta < -threshold) {
        setIsHeaderHidden(false);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setPosterIndex(0);
  }, [id]);


  const goNextProject = () => {
    if (window.lenis) window.lenis.stop();
    navigate(`/projects/${nextProject.id}`);
  };

  const lusionEase = [0.16, 1, 0.3, 1];
  const appleEase = [0.19, 1, 0.22, 1];
  const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
  const backContentColorVariants = { rest: { color: "#000" }, hover: { color: "#fff" } };
  const backSlidingVariants = { rest: { x: -4 }, hover: { x: -24 } };
  const hoverFill = project.hoverGradient || project.hoverColor || "#0047ff";

  const BellGsap = () => {
    const bellRef = useRef(null);
    const clapperRef = useRef(null);
    const dotRef = useRef(null);
    const mouthUpRef = useRef(null);
    const mouthDownRef = useRef(null);

    useLayoutEffect(() => {
      if (!bellRef.current || !clapperRef.current || !dotRef.current || !mouthUpRef.current || !mouthDownRef.current) return undefined;
      const ctx = gsap.context(() => {
        gsap.set([bellRef.current, clapperRef.current], {
          transformOrigin: "50% 10%",
        });
        const mouthFlat = "M-120,108 Q0,108 120,108";
        const mouthUp = "M-120,108 Q0,76 120,108";
        const mouthDown = "M-120,108 Q0,140 120,108";
        gsap.set([mouthUpRef.current, mouthDownRef.current], { attr: { d: mouthFlat } });
        gsap.set(dotRef.current, { transformOrigin: "50% 50%", scale: 0, opacity: 0 });
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
        tl.to(bellRef.current, {
          rotation: -12,
          duration: 0.12,
          ease: "power2.inOut",
        })
          .to(bellRef.current, {
            rotation: 12,
            duration: 0.24,
            ease: "power2.inOut",
          })
          .to(bellRef.current, {
            rotation: -8,
            duration: 0.18,
            ease: "power2.inOut",
          })
          .to(bellRef.current, {
            rotation: 8,
            duration: 0.18,
            ease: "power2.inOut",
          })
          .to(bellRef.current, {
            rotation: 0,
            duration: 0.2,
            ease: "power2.out",
          });

        tl.to(
          mouthUpRef.current,
          { attr: { d: mouthUp }, duration: 0.12, ease: "power2.inOut" },
          0.18
        )
          .to(
            mouthDownRef.current,
            { attr: { d: mouthDown }, duration: 0.12, ease: "power2.inOut" },
            0.18
          )
          .to(
            mouthUpRef.current,
            { attr: { d: mouthFlat }, duration: 0.16, ease: "power2.out" },
            0.38
          )
          .to(
            mouthDownRef.current,
            { attr: { d: mouthFlat }, duration: 0.16, ease: "power2.out" },
            0.38
          );

        tl.to(
          dotRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: "back.out(2)",
          },
          0.28
        );

        gsap.to(clapperRef.current, {
          rotation: 18,
          duration: 0.18,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      return () => ctx.revert();
    }, []);

    return (
      <div className="ui-demo ui-demo-bell">
        <svg viewBox="0 0 1500 1500" aria-hidden="true">
          <g transform="matrix(1.7999999523,0,0,1.7999999523,72.3004,348.6004)">
            <g ref={clapperRef} transform="matrix(1,0,0,1,378.7771,329.981)">
              <path
                fill="#ffffff"
                d="M65.078,0C65.078,-35.942 35.941,-65.078 0,-65.078C-35.942,-65.078 -65.078,-35.942 -65.078,0C-65.078,35.942 -35.942,65.078 0,65.078C35.941,65.078 65.078,35.942 65.078,0Z"
              />
              <path
                fill="none"
                stroke="#352006"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M65.078,0C65.078,-35.942 35.941,-65.078 0,-65.078C-35.942,-65.078 -65.078,-35.942 -65.078,0C-65.078,35.942 -35.942,65.078 0,65.078C35.941,65.078 65.078,35.942 65.078,0Z"
              />
            </g>
            <g ref={bellRef} transform="matrix(1,0,0,1,376.847,190.155)">
              <path
                fill="#ffffff"
                d="M132.1849,9.618C132.4279,5.785 132.5072,1.9088 132.4689,-2.003C131.7582,-77.4429 71.3109,-140.4362 0.5459,-140.7383C-72.8731,-141.0502 -132.8324,-78.1531 -132.482,0.156C-132.4699,3.1347 -132.395,6.092 -132.221,9.024C-130.656,35.373 -134.8887,60.6927 -143.9276,85.3047L-148.3087,97.2318C-155.7097,117.3848 -142.1678,138.3041 -121.211,139.3135C-113.4673,142.5172 118.8995,140.4878 121.1846,139.2608C141.9238,138.0675 155.4491,117.3559 148.3886,97.4445L143.4639,84.1766C134.6519,60.1826 130.5569,35.299 132.1849,9.618Z"
              />
              <path
                fill="none"
                stroke="#352006"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M132.1849,9.618C132.4279,5.785 132.5072,1.9088 132.4689,-2.003C131.7582,-77.4429 71.3109,-140.4362 0.5459,-140.7383C-72.8731,-141.0502 -132.8324,-78.1531 -132.482,0.156C-132.4699,3.1347 -132.395,6.092 -132.221,9.024C-130.656,35.373 -134.8887,60.6927 -143.9276,85.3047L-148.3087,97.2318C-155.7097,117.3848 -142.1678,138.3041 -121.211,139.3135C-113.4673,142.5172 118.8995,140.4878 121.1846,139.2608C141.9238,138.0675 155.4491,117.3559 148.3886,97.4445L143.4639,84.1766C134.6519,60.1826 130.5569,35.299 132.1849,9.618Z"
              />
              <path
                ref={mouthUpRef}
                d="M-120,108 Q0,108 120,108"
                fill="none"
                stroke="#352006"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                ref={mouthDownRef}
                d="M-120,108 Q0,108 120,108"
                fill="none"
                stroke="#352006"
                strokeWidth="18"
                strokeLinecap="round"
              />
            </g>
            <g transform="matrix(1.0994308,0,0,1.0994308,478.154,77.895)">
              <path
                ref={dotRef}
                fill="#FFA733"
                d="M73.647,0C73.647,-40.674 40.674,-73.647 0,-73.647C-40.674,-73.647 -73.647,-40.674 -73.647,0C-73.647,40.674 -40.674,73.647 0,73.647C40.674,73.647 73.647,40.674 73.647,0Z"
              />
            </g>
          </g>
        </svg>
      </div>
    );
  };

  const renderUiMotion = (variant = "pulse", lottieData = null, emoji = null) => {
    switch (variant) {
      case "gsap-bell":
        return <BellGsap />;
      case "emoji":
        return (
          <div className="ui-demo ui-demo-emoji" aria-hidden="true">
            <span>{emoji || "🙂"}</span>
          </div>
        );
      case "three-d":
        return (
          <div className="ui-demo ui-demo-3d" aria-hidden="true">
            <div className="demo-3d-scene">
              <div className="demo-3d-card is-back">
                <span className="card-value">7</span>
                <span className="card-suit">♣</span>
              </div>
              <div className="demo-3d-card is-mid">
                <span className="card-value">J</span>
                <span className="card-suit">♠</span>
              </div>
              <div className="demo-3d-card is-front">
                <span className="card-value">10</span>
                <span className="card-suit">♥</span>
              </div>
            </div>
          </div>
        );
      case "lottie":
        return (
          <div className="ui-demo ui-demo-lottie">
            <Lottie
              animationData={lottieData}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          </div>
        );
      case "orbit":
        return (
          <div className="ui-demo ui-demo-orbit">
            <div className="orbit-track">
              <span className="orbit-dot is-1" />
              <span className="orbit-dot is-2" />
              <span className="orbit-dot is-3" />
            </div>
            <span className="orbit-core" />
          </div>
        );
      case "wave":
        return (
          <div className="ui-demo ui-demo-wave">
            {Array.from({ length: 7 }).map((_, index) => (
              <span key={index} className="wave-bar" />
            ))}
          </div>
        );
      case "stack":
        return (
          <div className="ui-demo ui-demo-stack">
            <span className="stack-card is-1" />
            <span className="stack-card is-2" />
            <span className="stack-card is-3" />
          </div>
        );
      case "scan":
        return (
          <div className="ui-demo ui-demo-scan">
            <div className="scan-list">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="scan-row" />
              ))}
            </div>
            <span className="scan-line" />
          </div>
        );
      case "ticker":
        return (
          <div className="ui-demo ui-demo-ticker">
            <div className="ticker-track">
              {["Tokens", "Swap", "Bid", "Vault", "Mint"].map((label, index) => (
                <span key={index} className="ticker-pill">{label}</span>
              ))}
            </div>
          </div>
        );
      case "grid":
        return (
          <div className="ui-demo ui-demo-grid">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} className="grid-cell" />
            ))}
            <span className="grid-highlight" />
          </div>
        );
      case "progress":
        return (
          <div className="ui-demo ui-demo-progress">
            <div className="progress-ring">
              <span className="progress-ring-core" />
            </div>
            <div className="progress-value">78%</div>
            <div className="progress-bar">
              <span className="progress-fill" />
            </div>
          </div>
        );
      case "pulse":
      default:
        return (
          <div className="ui-demo ui-demo-pulse">
            <span className="pulse-core" />
            <span className="pulse-ring is-1" />
            <span className="pulse-ring is-2" />
          </div>
        );
    }
  };

  const defaultLongText =
    "Motion Lab is a compact system for testing interaction physics and visual rhythm. Each study is intentionally minimal, so the motion carries the story: what it highlights, how it guides attention, and how it sets pace. Loops are short and calm to help designers judge clarity and fatigue over time.\n\nThe library is organized by intent, not style. Each card answers a specific behavior (signal, invite, guide) and can drop into different themes using local variables for tempo and emphasis. We keep transitions soft, spacing steady, and motion subtle so content stays readable.\n\nUse this lab to remix and iterate. Keep motion on transforms and opacity, respect reduced-motion settings, and replace demo loops with real triggers when shipping.";

  const handleCopy = async (text, id) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch (error) {
      setCopiedId(null);
    }
  };

  return (
    <div className="project-detail-outer" style={{ backgroundColor: project.color }}>
      {/* 苹果风格入场：在 Ready 前显示一个背景色底，Ready 后内容浮现 */}
      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            className="detail-page-loader"
            style={{ backgroundColor: project.color }}
          />
        ) : (
            <motion.div
            key="content"
            className={`project-detail-page ${project.id === "sound-design" ? "is-sungrow" : ""}`}
            style={{
              "--project-theme": project.color,
              "--project-text": project.textColor || "#ffffff",
              "--project-text-muted": project.textMuted || "rgba(255, 255, 255, 0.72)",
              "--project-text-subtle": project.textSubtle || "rgba(255, 255, 255, 0.4)",
              "--project-panel": project.panelColor || "rgba(255, 255, 255, 0.08)",
              "--project-panel-border": project.panelBorder || "rgba(255, 255, 255, 0.18)",
              "--project-surface": project.surfaceColor || "rgba(255, 255, 255, 0.95)",
              "--project-button-bg": project.buttonBg || "#ffffff",
              "--project-button-text": project.buttonText || "#000000",
              "--project-accent": project.accentColor || project.hoverColor || "#2F6DFF",
              "--project-accent-alt": project.accentAlt || "#4B63FF",
              "--project-hover": project.hoverColor || "#1D2C5C",
              "--project-shadow-button": project.noShadow ? "none" : "0 8px 24px rgba(0,0,0,0.12)",
              "--project-shadow-hero": project.noShadow ? "none" : "0 60px 120px rgba(0, 0, 0, 0.25)",
              "--project-shadow-surface": project.noShadow ? "none" : "0 40px 120px rgba(0, 0, 0, 0.25)",
              "--project-shadow-card": project.noShadow ? "none" : "0 25px 60px rgba(15, 20, 37, 0.12)",
              "--project-shadow-frame": project.noShadow ? "none" : "0 40px 100px rgba(0, 0, 0, 0.24)",
              "--project-shadow-footer": project.noShadow ? "none" : "0 24px 70px rgba(0, 0, 0, 0.08)",
              "--project-shadow-footer-hover": project.noShadow ? "none" : "0 40px 100px rgba(0, 0, 0, 0.14)",
              "--project-shadow-progress": project.noShadow ? "none" : "0 0 12px rgba(0, 0, 0, 0.3)",
              "--project-next-bg": project.nextBg || "#ffffff",
              "--project-next-text": project.nextText || "#111111",
              "--project-next-subtle": project.nextSubtle || "#999999"
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: lusionEase }}
          >
            <div className="detail-fixed-leaf" />

            <header className={`detail-header ${isHeaderHidden ? "is-hidden" : ""}`}>
              <div className="detail-logo-container">
                <a
                  href="/"
                  className="detail-brand-logo"
                  aria-label="JENSEN"
                  style={{ "--detail-logo-color": logoColor }}
                >
                  <span className="detail-brand-mark" aria-hidden="true" />
                  <span className="detail-brand-word">JENSEN</span>
                </a>
              </div>

              <div className="detail-header-back-slot">
                <motion.button className="back-action-pill" onClick={() => navigate({ pathname: "/", hash: "#featured-work" })} initial="rest" whileHover="hover" animate="rest">
                  <motion.div className="back-btn-bg-layer" variants={{ rest: { background: "#e4e6ef" }, hover: { background: hoverFill } }} transition={transition} />
                  <div className="back-btn-mask">
                    <motion.div className="back-btn-sliding-content" variants={backSlidingVariants} transition={transition}>
                      <motion.span className="back-arrow-item" variants={backContentColorVariants} transition={transition}><Arrow direction="left" strokeWidth={3.5} /></motion.span>
                      <motion.span className="back-text-item" variants={backContentColorVariants} transition={transition}>BACK</motion.span>
                      <motion.span className="back-arrow-item" variants={backContentColorVariants} transition={transition}><Arrow direction="left" strokeWidth={3.5} /></motion.span>
                    </motion.div>
                  </div>
                </motion.button>
              </div>

              <div className="detail-header-right-actions">
                <SoundButton activeColor={hoverFill} isMenuOpen={isMenuOpen} />
                <TalkButton activeColor={hoverFill} />
                <motion.button className="detail-menu-trigger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} initial="rest" whileHover="hover" animate={isMenuOpen ? "open" : "rest"}>
                  <motion.div className="detail-menu-trigger-bg" variants={{ rest: { backgroundColor: "#e4e6ef" }, hover: { backgroundColor: "rgba(255,255,255,1)" }, open: { backgroundColor: "rgba(255,255,255,1)" } }} transition={transition} />
                  <div className="detail-menu-trigger-text-mask">
                    <motion.div className="detail-menu-trigger-slider" animate={{ y: isMenuOpen ? "-100%" : "0%" }} transition={transition}>
                      <motion.span className="detail-menu-label" style={{ color: "#000" }}>MENU</motion.span>
                      <motion.span className="detail-menu-label" style={{ color: "#000" }}>CLOSE</motion.span>
                    </motion.div>
                  </div>
                  <motion.span className="detail-menu-dots-icon" style={{ color: "#000" }} variants={{ rest: { rotate: 0 }, hover: { rotate: 90 }, open: { rotate: 90 } }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>••</motion.span>
                </motion.button>
              </div>
            </header>

            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <section className={`detail-hero-fold ${project.id === "sound-design" ? "is-sungrow" : ""}`}>
              {project.id === "sound-design" ? (
                <div className="sungrow-hero">
                  <div className="sungrow-hero-top">
                    <div className="sungrow-hero-block">
                      <span className="sungrow-hero-label">Design:</span>
                      <span className="sungrow-hero-value">Jingcheng (Jensen) Chen</span>
                    </div>
                    <div className="sungrow-hero-block">
                      <span className="sungrow-hero-label">Project:</span>
                      <span className="sungrow-hero-value">Sungrow Marketing Visual Design</span>
                    </div>
                  </div>

                  <div className="sungrow-hero-line" aria-hidden="true">
                    <img src="/Sungrow/sungrowline.svg" alt="" />
                  </div>

                  <div className="sungrow-hero-bottom">
                    <img className="sungrow-hero-logo" src="/Sungrow/Sungrowlogo.svg" alt="Sungrow logo" />
                    <div className="sungrow-hero-meta">
                      <div className="sungrow-hero-block">
                        <span className="sungrow-hero-label">Deliverables:</span>
                        <span className="sungrow-hero-value">Poster, Brochure, Video.</span>
                      </div>
                      <div className="sungrow-hero-block">
                        <span className="sungrow-hero-label">Date:</span>
                        <span className="sungrow-hero-value">March 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="detail-hero-layout">
                  <div className="detail-hero-info">
                    {project.inProgressNotice && (
                      <motion.div
                        className="detail-hero-notice"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.9, ease: lusionEase, delay: 0.1 }}
                      >
                        {project.inProgressNotice}
                      </motion.div>
                    )}
                    <motion.h1 className="detail-hero-big-title" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: lusionEase, delay: 0.2 }}>{project.title}</motion.h1>
                    <div className="detail-hero-meta-row">
                      <div className="detail-hero-desc-col">
                        <p className="detail-hero-paragraph">{project.description}</p>
                      </div>
                      <div className="detail-hero-services-col">
                        <span className="services-title-label">CATEGORY</span>
                        <ul className="services-data-list">{project.services.map((s, i) => <li key={i}>{s}</li>)}</ul>
                      </div>
                    </div>
                  </div>
                  <div className="detail-hero-visual">
                    <motion.div className="detail-hero-media-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: lusionEase, delay: 0.4 }}>
                      <img src={project.image} alt={project.title} className="detail-hero-cover-img" />
                      <div className="detail-hero-play-button"><div className="play-triangle-svg">▶</div></div>
                    </motion.div>
                  </div>
                </div>
              )}
            </section>

            {sections.length > 0 && (() => {
              const hasFullBleed = sections.every((section) => section.type === "full-bleed");
              return (
                <section className={`detail-gallery-vertical ${isDribbbleLayout ? "is-dribbble" : ""} ${isTeraboxLayout ? "is-terabox" : ""} ${hasFullBleed ? "has-full-bleed" : ""}`}>
              {sections.map((section, idx) => {
                const isTbSection = section.type?.startsWith("tb-");
                const disableSectionMotion = project?.disableSectionMotion;
                return (
                  <React.Fragment key={idx}>
                    <motion.div
                      className={`detail-feature-row ${isTbSection ? "is-terabox" : ""} ${section.type === "prototype" ? "is-prototype" : ""} ${section.type === "dribbble" ? "is-dribbble" : ""} ${section.type === "accordion" ? "is-accordion" : ""} ${section.type === "showcase" ? "is-showcase" : ""} ${section.type === "ui-waterfall" ? "is-ui-waterfall" : ""} ${section.type === "poster-wall" ? "is-poster-wall" : ""} ${section.type === "full-bleed" ? "is-full-bleed" : ""} ${section.type === "sungrow-overview" ? "is-sungrow-overview" : ""} ${section.type === "sungrow-poster" ? "is-sungrow-poster" : ""} ${section.type === "sungrow-compositing" ? "is-sungrow-compositing" : ""} ${section.type === "sungrow-hero-image" ? "is-sungrow-hero-image" : ""} ${section.type === "sungrow-brochure" ? "is-sungrow-brochure" : ""} ${section.type === "sungrow-duo" ? "is-sungrow-duo" : ""} ${section.type === "sungrow-posters" ? "is-sungrow-posters" : ""} ${section.type === "sungrow-full" ? "is-sungrow-full" : ""} ${section.type === "sungrow-video" ? "is-sungrow-video" : ""} ${section.type === "dribbble" && idx % 2 === 1 ? "is-dribbble-alt" : ""}`}
                      initial={isTbSection || disableSectionMotion ? false : { y: 50, opacity: 0 }}
                      whileInView={isTbSection || disableSectionMotion ? undefined : { y: 0, opacity: 1 }}
                      viewport={isTbSection || disableSectionMotion ? undefined : { once: true, margin: "-100px" }}
                      transition={isTbSection || disableSectionMotion ? undefined : { duration: 1, ease: lusionEase }}
                    >
                    {section.type === "sungrow-overview" ? (
                      <div className="sungrow-overview">
                        <h2 className="sungrow-overview-title">{section.title}</h2>
                        <div className="sungrow-overview-divider" aria-hidden="true" />

                        <div className="sungrow-overview-grid">
                          <div className="sungrow-overview-kicker">{section.kicker}</div>
                          <div className="sungrow-overview-body">
                            <h3 className="sungrow-overview-heading">{section.heading}</h3>
                            <div className="sungrow-overview-text">
                              {(section.body || []).map((paragraph, pIndex) => (
                                <p key={pIndex}>{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="sungrow-overview-divider" aria-hidden="true" />

                        <div className="sungrow-overview-grid">
                          <div className="sungrow-overview-kicker">Font: {section.fontFamily}</div>
                          <div className="sungrow-overview-fonts">
                            {(section.fontWeights || []).map((weight) => (
                              <span key={weight} className={`sungrow-overview-font ${weight.toLowerCase()}`}>{weight}</span>
                            ))}
                          </div>
                        </div>

                        <div className="sungrow-overview-color">
                          <div className="sungrow-overview-kicker">Color System</div>
                          <div className="sungrow-overview-swatches">
                            {(section.colorSystem || []).map((color, cIndex) => (
                              <div key={cIndex} className="sungrow-overview-swatch">
                                <span className="sungrow-overview-swatch-block" style={{ backgroundColor: color.value }} />
                                <span className="sungrow-overview-swatch-label">{color.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : section.type === "sungrow-poster" ? (
                      <div className="sungrow-poster">
                        <div className="sungrow-poster-media">
                          <img src={section.image} alt={section.title || "Sungrow poster"} />
                        </div>
                        <div className="sungrow-poster-overlay">
                          <h3 className="sungrow-poster-title">{section.title}</h3>
                          <span className="sungrow-poster-location">{section.location}</span>
                        </div>
                        <div className="sungrow-poster-footer">
                          <span>{section.footerLeft}</span>
                          <span>{section.footerCenter}</span>
                          <span>{section.footerRight}</span>
                        </div>
                      </div>
                    ) : section.type === "sungrow-compositing" ? (
                      <div className="sungrow-compositing">
                        <h2 className="sungrow-compositing-title">{section.title}</h2>
                        <div className="sungrow-compositing-divider" aria-hidden="true" />
                        <div className="sungrow-compositing-grid">
                          {(section.items || []).map((item, itemIndex) => (
                            <div key={itemIndex} className="sungrow-compositing-item">
                              <div className="sungrow-compositing-media">
                                <img src={item.image} alt={item.label || `composite-${itemIndex + 1}`} />
                              </div>
                              <div className="sungrow-compositing-label">{item.label}</div>
                              <div className="sungrow-compositing-arrow" aria-hidden="true">▾</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : section.type === "sungrow-hero-image" ? (
                      <div className="sungrow-hero-image">
                        <img src={section.image} alt={section.title || "Sungrow visual"} />
                        <div className="sungrow-hero-image-top">
                          <span>{section.topLeft}</span>
                          <span>{section.topCenter}</span>
                          <span>{section.topRight}</span>
                        </div>
                        <div className="sungrow-hero-image-bottom">
                          <h3>{section.title}</h3>
                          <p>{section.description}</p>
                        </div>
                      </div>
                    ) : section.type === "sungrow-brochure" ? (
                      <div className="sungrow-brochure">
                        <h2 className="sungrow-brochure-title">{section.title}</h2>
                        <div className="sungrow-brochure-divider" aria-hidden="true" />
                        <div className="sungrow-brochure-grid">
                          {(section.items || []).map((item, itemIndex) => (
                            <div key={itemIndex} className="sungrow-brochure-item">
                              <img src={item.image} alt={item.label || `brochure-${itemIndex + 1}`} />
                            </div>
                          ))}
                        </div>
                        <div className="sungrow-brochure-caption">{section.caption}</div>
                        <div className="sungrow-brochure-arrow" aria-hidden="true">▾</div>
                      </div>
                    ) : section.type === "sungrow-duo" ? (
                      <div className="sungrow-duo">
                        {(section.images || []).map((src, idx) => (
                          <div key={src} className={`sungrow-duo-item ${idx === 0 ? "is-left" : "is-right"}`}>
                            <img src={src} alt={`Sungrow spread ${idx + 1}`} />
                          </div>
                        ))}
                      </div>
                    ) : section.type === "sungrow-posters" ? (
                      <div className="sungrow-posters">
                        <div className="sungrow-posters-head">
                          <h2 className="sungrow-posters-title">{section.title}</h2>
                          <div className="sungrow-posters-divider" aria-hidden="true" />
                        </div>
                        <div className="sungrow-posters-media">
                          <img src={section.image} alt={section.title || "Sungrow posters"} />
                        </div>
                      </div>
                    ) : section.type === "sungrow-full" ? (
                      <div className="sungrow-full">
                        {(section.images || []).map((src, idx) => (
                          <div key={src} className="sungrow-full-item">
                            <img src={src} alt={`Sungrow full ${idx + 1}`} />
                          </div>
                        ))}
                      </div>
                    ) : section.type === "sungrow-video" ? (
                      <div className="sungrow-video">
                        <div className="sungrow-video-head">
                          <h2 className="sungrow-video-title">{section.title}</h2>
                          <div className="sungrow-video-divider" aria-hidden="true" />
                        </div>
                        <div className="sungrow-video-media">
                          <video src={section.src} controls playsInline />
                        </div>
                      </div>
                    ) : section.type === "tb-media" ? (
                      <div
                        className={`tb-section tb-${section.tone || "light"} ${section.splitBackground ? "tb-split" : ""}`}
                        style={section.splitPoint ? { "--tb-split": section.splitPoint } : undefined}
                      >
                        <div className="tb-container" style={section.mediaSpacing ? { gap: `${section.mediaSpacing}px` } : undefined}>
                          <div className="tb-header">
                            <div
                              className={`tb-title-group ${section.centerText ? "is-centered" : ""}`}
                              style={section.textWidth ? { maxWidth: section.textWidth } : undefined}
                            >
                              <h3 className="tb-title" style={section.titleNoWrap ? { whiteSpace: "nowrap" } : undefined}>{section.title}</h3>
                              <p className="tb-subtitle">{section.description}</p>
                              {section.showLaunch && project.launchUrl ? (
                                <div className="talk-button-wrapper tb-launch-wrapper">
                                  <motion.button
                                    className="talk-btn tb-launch-btn"
                                    onClick={() => window.open(project.launchUrl, "_blank", "noopener,noreferrer")}
                                    initial="rest"
                                    whileHover="hover"
                                    animate="rest"
                                  >
                                    <motion.div
                                      className="talk-btn-bg"
                                      variants={{
                                        rest: { background: "#1c1c1e", transition: { duration: 0.4, ease: lusionEase } },
                                        hover: { background: hoverFill, transition: { duration: 0.4, ease: lusionEase } },
                                      }}
                                    />
                                    <div className="talk-btn-content">
                                      <motion.span
                                        className="btn-arrow"
                                        variants={{ rest: { x: -25, opacity: 0 }, hover: { x: 0, opacity: 1 } }}
                                        transition={{ duration: 0.4, ease: lusionEase }}
                                      >
                                        <Arrow direction="right" />
                                      </motion.span>
                                      <motion.span
                                        className="btn-text"
                                        variants={{ rest: { x: -8 }, hover: { x: 5 } }}
                                        transition={{ duration: 0.4, ease: lusionEase }}
                                      >
                                        LIVE SITE
                                      </motion.span>
                                      <motion.span
                                        className="btn-dot"
                                        variants={{ rest: { x: 0, opacity: 1, scale: 1 }, hover: { x: 0, opacity: 0, scale: 0 } }}
                                        transition={{ duration: 0.4, ease: lusionEase }}
                                      />
                                    </div>
                                  </motion.button>
                                  <p className="tb-launch-note">Feel free to Sign in, the Webmaster Center will be available after login.</p>
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div
                            className={`tb-media-block ${section.video?.src ? "tb-media-video-only" : ""}`}
                            style={section.video
                              ? {
                                  ...(section.video.offset && typeof section.video.offset === "object"
                                    ? {
                                        "--tb-video-top": `${section.video.offset.top}%`,
                                        "--tb-video-left": `${section.video.offset.left}%`,
                                      }
                                    : null),
                                  ...(section.video.size && typeof section.video.size === "object"
                                    ? {
                                        "--tb-video-width": `${section.video.size.width}%`,
                                        "--tb-video-height": `${section.video.size.height}%`,
                                      }
                                    : null),
                                  ...(section.video.inset && typeof section.video.inset === "object"
                                    ? {
                                        "--tb-video-top": `${section.video.inset.top}%`,
                                        "--tb-video-right": `${section.video.inset.right}%`,
                                        "--tb-video-bottom": `${section.video.inset.bottom}%`,
                                        "--tb-video-left": `${section.video.inset.left}%`,
                                      }
                                    : null),
                                  ...(section.video.inset && typeof section.video.inset !== "object"
                                    ? {
                                        "--tb-video-top": `${section.video.inset}%`,
                                        "--tb-video-right": `${section.video.inset}%`,
                                        "--tb-video-bottom": `${section.video.inset}%`,
                                        "--tb-video-left": `${section.video.inset}%`,
                                      }
                                    : null),
                                }
                              : undefined}
                          >
                            {!section.video?.src && <img src={section.image} alt={section.title} />}
                            {section.video?.src && (
                              <>
                                <video
                                  ref={(node) => {
                                    if (node) videoRefs.current[`tb-media-${idx}`] = node;
                                  }}
                                  className="tb-media-video"
                                  src={section.video.src}
                                  poster={section.video.poster || section.image}
                                  preload="metadata"
                                  playsInline
                                  autoPlay
                                  muted
                                  onPlay={() => setVideoState(`tb-media-${idx}`, true)}
                                  onPause={() => setVideoState(`tb-media-${idx}`, false)}
                                  onEnded={() => setVideoState(`tb-media-${idx}`, false)}
                                />
                                <button
                                  type="button"
                                  className="tb-media-control"
                                  onClick={() => toggleVideo(`tb-media-${idx}`)}
                                  aria-label={videoPlaying[`tb-media-${idx}`] ? "Pause video" : "Play video"}
                                >
                                  {videoPlaying[`tb-media-${idx}`] ? (
                                    <svg className="tb-media-icon" viewBox="0 0 24 24" aria-hidden="true">
                                      <rect x="6" y="5" width="4" height="14" rx="1.2" />
                                      <rect x="14" y="5" width="4" height="14" rx="1.2" />
                                    </svg>
                                  ) : (
                                    <svg className="tb-media-icon" viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M7 5.5L19 12L7 18.5V5.5Z" />
                                    </svg>
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : section.type?.startsWith("tb-layout") ? (
                      <div className={`tb-section tb-${section.tone || "dark"} tb-layout-section`}>
                        <div className="tb-container">
                          <div className="tb-layout-header">
                            <h3 className="tb-title">{section.title}</h3>
                            <div className="tb-layout-rule" aria-hidden="true" />
                          </div>
                          <div className="tb-layout-block">
                            {section.type !== "tb-layout-needs" &&
                              section.type !== "tb-layout-iterate" &&
                              (section.first?.subtitle || section.first?.description) && (
                                <>
                                  {section.first?.subtitle && (
                                    <h4 className="tb-layout-subtitle">{section.first.subtitle}</h4>
                                  )}
                                  {renderParagraphs(section.first?.description, "tb-layout-desc")}
                                </>
                              )}
                            {section.type === "tb-layout-iterate" ? (
                              <div className="tb-iterate">
                                {(section.steps || []).map((step, stepIndex) => (
                                  <div key={stepIndex} className="tb-iterate-row">
                                    <div className="tb-iterate-left">
                                      <h4 className="tb-iterate-title">{step.title}</h4>
                                      {renderParagraphs(step.description, "tb-iterate-desc")}
                                      <div className="tb-iterate-media">
                                        {step.mediaType === "phones" ? (
                                          <div className="tb-iterate-phones">
                                            {[0, 1, 2].map((idx) => (
                                              <img
                                                key={idx}
                                                src={section.placeholders?.phone || section.placeholders?.square}
                                                alt="phone placeholder"
                                              />
                                            ))}
                                          </div>
                                        ) : step.mediaType === "web-mobile" ? (
                                          <div className="tb-iterate-stack">
                                            <div className="tb-iterate-web">
                                              <img src={section.placeholders?.wide || section.placeholders?.square} alt="web placeholder" />
                                            </div>
                                            <div className="tb-iterate-mobile">
                                              {[0, 1, 2].map((idx) => (
                                                <img
                                                  key={idx}
                                                  src={section.placeholders?.phone || section.placeholders?.square}
                                                  alt="mobile placeholder"
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        ) : (
                                          <img src={section.placeholders?.wide || section.placeholders?.square} alt="placeholder" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {section.quote && (
                                  <div className="tb-iterate-quote">
                                    <div className="tb-iterate-quote-mark">“</div>
                                    <p>{section.quote}</p>
                                    <span className="tb-iterate-quote-note">Internal feedback</span>
                                  </div>
                                )}
                              </div>
                            ) : section.type === "tb-layout-needs" ? (
                              <div className="tb-layout-needs-grid">
                                <div className="tb-layout-needs-left">
                                  {(section.first?.subtitle || section.first?.description) && (
                                    <>
                                      {section.first?.subtitle && (
                                        <h4 className="tb-layout-subtitle">{section.first.subtitle}</h4>
                                      )}
                                      {renderParagraphs(section.first?.description, "tb-layout-desc")}
                                    </>
                                  )}
                                  {section.second && (
                                    <div className="tb-layout-block tb-layout-block--spaced">
                                      <h4 className="tb-layout-subtitle">{section.second?.subtitle}</h4>
                                      {renderParagraphs(section.second?.description, "tb-layout-desc")}
                                    </div>
                                  )}
                                  {section.third && (
                                    <div className="tb-layout-block tb-layout-block--spaced">
                                      <h4 className="tb-layout-subtitle">{section.third?.subtitle}</h4>
                                      {renderParagraphs(section.third?.description, "tb-layout-desc")}
                                    </div>
                                  )}
                                </div>
                                <div className="tb-layout-needs-right">
                                  <div className="tb-layout-priority">
                                  <div className="tb-layout-priority-title">Priority Ranking</div>
                                  <div className="tb-layout-priority-rows">
                                    {Array.from({ length: 6 }).map((_, rowIndex) => (
                                      <div key={rowIndex} className="tb-layout-priority-row">
                                        Task {String(rowIndex + 1).padStart(2, "0")}
                                      </div>
                                    ))}
                                  </div>
                                  </div>
                                </div>
                              </div>
                            ) : section.type === "tb-layout-started" ? (
                              <div className="tb-layout-flow">
                                {(section.first?.cards || []).map((card, cardIndex) => (
                                  <div key={`flow-item-${cardIndex}`} className="tb-layout-flow-item">
                                    <div
                                      className={`tb-layout-flow-box ${card.video ? "tb-layout-flow-box--media" : ""}`}
                                      onMouseEnter={() => card.video && handleFlowHover(`tb-flow-${cardIndex}`, true)}
                                      onMouseLeave={() => card.video && handleFlowHover(`tb-flow-${cardIndex}`, false)}
                                    >
                                      {card.video ? (
                                        <video
                                          ref={(node) => {
                                            if (node) videoRefs.current[`tb-flow-${cardIndex}`] = node;
                                          }}
                                          className="tb-layout-flow-video"
                                          src={card.video}
                                          muted
                                          loop
                                          playsInline
                                          preload="metadata"
                                        />
                                      ) : null}
                                      {!card.video && card.image ? (
                                        <img src={card.image} alt={card.title} />
                                      ) : null}
                                    </div>
                                  <div className="tb-layout-flow-title">{card.title}</div>
                                    {(() => {
                                      const bulletLines = (card.description || "")
                                        .split("•")
                                        .map((line) => line.trim())
                                        .filter(Boolean);
                                      if (bulletLines.length > 1) {
                                        return (
                                          <ul className="tb-layout-flow-desc tb-layout-flow-desc-list">
                                            {bulletLines.map((line, lineIndex) => (
                                              <li key={lineIndex}>{line}</li>
                                            ))}
                                          </ul>
                                        );
                                      }
                                      return <div className="tb-layout-flow-desc">{card.description}</div>;
                                    })()}
                                  </div>
                                ))}
                              </div>
                            ) : section.type === "tb-layout-audience" ? (
                              <div className="tb-layout-audience">
                                <div className="tb-audience-panel">
                                  <div className="tb-audience-nav">
                                    <button
                                      type="button"
                                      className="tb-audience-next"
                                      onClick={() => {
                                        const cards = section.first?.cards || [];
                                        if (cards.length) {
                                          setAudienceIndex((prev) => (prev + 1) % cards.length);
                                        }
                                      }}
                                      aria-label="Next persona"
                                    >
                                      →
                                    </button>
                                  </div>
                                  {(() => {
                                    const cards = section.first?.cards || [];
                                    const activeCard = cards.length ? cards[audienceIndex % cards.length] : section.first;
                                    return (
                                      <AnimatePresence mode="wait">
                                        <motion.div
                                          key={`audience-${audienceIndex}`}
                                          className="tb-audience-motion"
                                          initial={{ opacity: 0, y: 18 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -12 }}
                                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                  <div className="tb-audience-left">
                                    <div className="tb-audience-kicker-row">
                                      {activeCard?.cardLabel && (
                                        <div className="tb-audience-kicker">{activeCard.cardLabel}</div>
                                      )}
                                    </div>
                                    <div className="tb-audience-title">{activeCard?.infoHeading}</div>
                                    <div className="tb-audience-rule" aria-hidden="true" />
                                    {activeCard?.contextText && (
                                      <p className="tb-audience-body">{activeCard.contextText}</p>
                                    )}
                                    {activeCard?.implicationText && (
                                      <p className="tb-audience-body">{activeCard.implicationText}</p>
                                    )}
                                    {activeCard?.needsHeading && (
                                      <div className="tb-audience-block">
                                        <span className="tb-audience-subtitle">{activeCard.needsHeading}</span>
                                        <div className="tb-audience-needs-grid">
                                          {(activeCard.needs || []).map((item, idx) => (
                                            <div key={idx} className="tb-audience-need">
                                              {item}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="tb-audience-right">
                                    <div className="tb-audience-portrait">
                                      {activeCard?.portrait && (
                                        <img src={activeCard.portrait} alt="Persona portrait" />
                                      )}
                                    </div>
                                  </div>
                                        </motion.div>
                                      </AnimatePresence>
                                    );
                                  })()}
                                </div>
                              </div>
                            ) : section.first?.cards?.length ? (
                              <div className="tb-layout-grid">
                                {(section.first?.cards || []).map((card, cardIndex) => (
                                  <div key={cardIndex} className="tb-layout-card">
                                    <div className="tb-layout-image">
                                      <img src={card.image} alt={card.label || `layout-${cardIndex + 1}`} />
                                    </div>
                                    <div className="tb-layout-caption">
                                      <span
                                        className={`tb-layout-icon ${card.status === "check" ? "is-check" : "is-x"}`}
                                        aria-hidden="true"
                                      >
                                        {card.status === "check" ? "✓" : "×"}
                                      </span>
                                      <span className="tb-layout-label">{card.label}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          {section.type !== "tb-layout-needs" && section.type !== "tb-layout-iterate" && section.second && (
                            <div className="tb-layout-block tb-layout-block--spaced">
                              <h4 className="tb-layout-subtitle">{section.second?.subtitle}</h4>
                              {renderParagraphs(section.second?.description, "tb-layout-desc")}
                              {section.second?.image && (
                                <div className={`tb-layout-large ${section.second?.image?.includes("Workflow Overview.png") ? "tb-layout-large--no-border" : ""}`}>
                                  {section.second?.image?.includes("OLayout4.svg") ? (
                                    <div className="tb-layout-wireframe" role="img" aria-label="Layout wireframe">
                                      <div className="tb-layout-wireframe-header">
                                        <span className="tb-layout-wireframe-text is-default">Header</span>
                                        <span className="tb-layout-wireframe-text is-hover">This is Header</span>
                                      </div>
                                      <div className="tb-layout-wireframe-body">
                                        <div className="tb-layout-wireframe-tab">
                                          <span className="tb-layout-wireframe-text is-default">Function Tab</span>
                                          <span className="tb-layout-wireframe-text is-hover">This is Function Tab</span>
                                        </div>
                                        <div className="tb-layout-wireframe-program">
                                          <span className="tb-layout-wireframe-text is-default">Program Overview</span>
                                          <span className="tb-layout-wireframe-text is-hover">This is Program Overview</span>
                                        </div>
                                        <div className="tb-layout-wireframe-right">
                                          <div className="tb-layout-wireframe-cta">
                                            <span className="tb-layout-wireframe-text is-default">Call to Action</span>
                                            <span className="tb-layout-wireframe-text is-hover">This is Call to Action</span>
                                          </div>
                                          <div className="tb-layout-wireframe-table">
                                            <span className="tb-layout-wireframe-text is-default">Scrollable Table</span>
                                            <span className="tb-layout-wireframe-text is-hover">This is Scrollable Table</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <img src={section.second?.image} alt={section.second?.subtitle || "layout"} />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {section.type !== "tb-layout-needs" && section.type !== "tb-layout-iterate" && section.third && (
                            <div className="tb-layout-block tb-layout-block--spaced">
                              <h4 className="tb-layout-subtitle">{section.third?.subtitle}</h4>
                              {renderParagraphs(section.third?.description, "tb-layout-desc")}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : section.type === "poster-wall" ? (
                      <div className="poster-wall">
                        <div className="poster-grid">
                          {(section.items || []).map((item, itemIndex) => (
                            <div key={itemIndex} className="poster-card">
                              <button
                                type="button"
                                className="poster-card-button"
                                onClick={() => setPosterOverlay(item)}
                                aria-label={`Open poster ${item.title || itemIndex + 1}`}
                              >
                                <img src={item.image} alt={item.title || `Poster ${itemIndex + 1}`} />
                              </button>
                              <a
                                className="poster-download-btn"
                                href={item.image}
                                download
                                target="_blank"
                                rel="noreferrer"
                              >
                                Download
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : section.type === "ui-waterfall" ? (
                      <div className="ui-waterfall">
                        <div className="ui-waterfall-header">
                          <h3 className="detail-feature-title">{section.title}</h3>
                          <p className="detail-feature-desc">{section.description}</p>
                        </div>
                        <div className="ui-waterfall-grid">
                          {(section.items || []).map((item, itemIndex) => (
                            <button
                              key={item.id || itemIndex}
                              type="button"
                              className={`ui-waterfall-card ${uiOverlay?.id === item.id ? "is-active" : ""}`}
                              onClick={() => setUiOverlay(item)}
                              style={{
                                "--ui-accent": item.accent || "#4F6AFF",
                                "--ui-accent-soft": item.accentSoft || "rgba(79, 106, 255, 0.2)",
                                "--ui-demo-height": item.demoHeight,
                              }}
                            >
                              <span className="ui-waterfall-index">
                                {String(itemIndex + 1).padStart(2, "0")}
                              </span>
                              <div className="ui-waterfall-card-head">
                                <span className="ui-waterfall-card-label">{item.label}</span>
                                <h4 className="ui-waterfall-card-title">{item.title}</h4>
                                <p className="ui-waterfall-card-desc">{item.description}</p>
                              </div>
                              {renderUiMotion(item.variant, item.lottieData, item.emoji)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : section.type === "showcase" ? (
                      <div className="detail-showcase">
                        <div className="detail-showcase-title-row">
                          <h3 className="detail-showcase-title">{section.title}</h3>
                        </div>
                        <div className="detail-showcase-surface">
                          <div className="detail-showcase-left">
                            <motion.div
                              className="detail-showcase-controls"
                              role="tablist"
                              initial="hidden"
                              animate="show"
                              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                            >
                              {(section.items || []).map((item, itemIndex) => (
                                <motion.button
                                  key={itemIndex}
                                  type="button"
                                  role="tab"
                                  aria-selected={itemIndex === showcaseSelected}
                                  className={`detail-showcase-pill ${itemIndex === showcaseSelected ? "is-active" : ""}`}
                                  onClick={() => setShowcaseSelected(itemIndex)}
                                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: appleEase } } }}
                                >
                                  <span className="detail-showcase-pill-row">
                                    <span className={`detail-showcase-pill-icon ${itemIndex === showcaseSelected ? "is-active" : ""}`}>+</span>
                                    <span className="detail-showcase-pill-text">{item.title}</span>
                                  </span>
                                  <span className="detail-showcase-pill-desc">{item.description}</span>
                                </motion.button>
                              ))}
                            </motion.div>
                          </div>
                          <div className="detail-showcase-media">
                            <div className="detail-showcase-media-frame">
                              <AnimatePresence mode="wait">
                                {section.items?.[showcaseSelected] && (
                                  <motion.div
                                    key={`${showcaseSelected}-${section.items?.[showcaseSelected]?.title}`}
                                    className="detail-showcase-media-item is-active"
                                    initial={{ opacity: 0, y: 14, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                    transition={{ duration: 0.6, ease: appleEase }}
                                  >
                                    {section.items?.[showcaseSelected]?.mediaType === "video" &&
                                    section.items?.[showcaseSelected]?.mediaSrc?.match(/\.(mp4|webm)$/i) ? (
                                      <video src={section.items?.[showcaseSelected]?.mediaSrc} autoPlay muted loop playsInline />
                                    ) : (
                                      <img src={section.items?.[showcaseSelected]?.mediaSrc} alt={section.items?.[showcaseSelected]?.title} />
                                    )}
                                    <span className="detail-showcase-media-badge">
                                      {section.items?.[showcaseSelected]?.mediaType?.toUpperCase()}
                                    </span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : section.type === "accordion" ? (
                      <div className="detail-accordion">
                        <div className="detail-accordion-surface">
                          <div className="detail-accordion-header">
                            <h3 className="detail-accordion-title">{section.title}</h3>
                            <a className="detail-accordion-link" href={section.linkUrl || "#"}>
                              {section.linkText || "Learn how our devices work better together"}
                              <span className="detail-accordion-link-arrow">›</span>
                            </a>
                          </div>
                          <div className="detail-accordion-body">
                            <div className="detail-accordion-list" role="tablist">
                              {(section.items || []).map((item, itemIndex) => (
                                <button
                                  key={itemIndex}
                                  type="button"
                                  role="tab"
                                  aria-selected={itemIndex === accordionSelected}
                                  className={`detail-accordion-item ${itemIndex === accordionSelected ? "is-active" : ""}`}
                                  onClick={() => setAccordionSelected(itemIndex)}
                                >
                                  <div className="detail-accordion-item-row">
                                    <span className="detail-accordion-item-title">{item.title}</span>
                                    <span className="detail-accordion-item-icon" aria-hidden="true" />
                                  </div>
                                  <p className="detail-accordion-item-desc">{item.description}</p>
                                </button>
                              ))}
                            </div>
                            <div className="detail-accordion-media">
                              <div className="detail-accordion-media-frame">
                                <img
                                  src={section.items?.[accordionSelected]?.image || section.image}
                                  alt={section.items?.[accordionSelected]?.title || section.title}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : section.type === "insight" ? (
                      <div className="detail-insight">
                        <div className="detail-insight-surface">
                          <div className="detail-insight-header">
                            <h3 className="detail-insight-title">{section.title}</h3>
                            <p className="detail-insight-subtitle">{section.description}</p>
                          </div>
                          {section.heroImage && (
                            <div className="detail-insight-hero">
                              <img src={section.heroImage} alt={section.title} />
                            </div>
                          )}
                          <div className="detail-insight-stats">
                            {(section.stats || []).map((stat, statIndex) => (
                              <button
                                key={statIndex}
                                type="button"
                                className={`detail-insight-card ${statIndex === insightSelected ? "is-selected" : ""}`}
                                aria-pressed={statIndex === insightSelected}
                                onClick={() => setInsightSelected(statIndex)}
                              >
                                <div className="detail-insight-icon" aria-hidden="true">
                                  {stat.icon === "bot" && (
                                    <svg viewBox="0 0 24 24">
                                      <rect x="5" y="6" width="14" height="10" rx="4" />
                                      <circle cx="9" cy="11" r="1.5" />
                                      <circle cx="15" cy="11" r="1.5" />
                                      <path d="M8 18h8" />
                                    </svg>
                                  )}
                                  {stat.icon === "coin" && (
                                    <svg viewBox="0 0 24 24">
                                      <circle cx="12" cy="12" r="8" />
                                      <path d="M12 7v10M9.5 9.5h5M9.5 14.5h5" />
                                    </svg>
                                  )}
                                  {stat.icon === "crown" && (
                                    <svg viewBox="0 0 24 24">
                                      <path d="M4 16l2-7 6 4 6-4 2 7" />
                                      <path d="M6 16h12" />
                                    </svg>
                                  )}
                                </div>
                                <p className="detail-insight-text">{stat.text}</p>
                              </button>
                            ))}
                          </div>

                        </div>
                      </div>
                    ) : section.type === "full-bleed" ? (
                      <div className="detail-full-bleed">
                        <img src={section.image} alt="Project scene" />
                      </div>
                    ) : section.type === "dribbble" ? (
                      <div className="detail-dribbble-grid">
                        <div className="detail-dribbble-header">
                          {!section.hideIndex && (
                            <span className="detail-feature-index">
                              {String(idx + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                            </span>
                          )}
                          <h3 className="detail-feature-title">{section.title}</h3>
                          <p className="detail-feature-desc">{section.description}</p>
                        </div>

                        <div className="detail-dribbble-board" style={section.spacingTop ? { marginTop: `${section.spacingTop}px` } : undefined}>
                          

                      <div className="detail-dribbble-media">
                            <div
                              className={`detail-feature-frame ${section.type === "app" ? "is-app" : "is-web"} ${section.fullBleed ? "is-full-bleed" : ""} ${section.mediaStyle ? `is-${section.mediaStyle}` : ""}`}
                              style={
                                section.mediaScale || section.mediaOffsetY || section.mediaWide
                                  ? {
                                      width: section.mediaWide ? "min(1400px, calc(100vw - 200px))" : undefined,
                                      maxWidth: section.mediaWide ? "none" : undefined,
                                      transform: `translateY(${section.mediaOffsetY || 0}px) scale(${section.mediaScale || 1})`,
                                      transformOrigin: section.fullBleed ? "top center" : "center",
                                    }
                                  : undefined
                              }
                            >
                              {section.colorControls ? (
                                <>
                                  <div className="detail-color-panel">
                                    <img
                                      src={
                                        colorSelected === null
                                          ? section.colorDefaultImage || section.image
                                          : section.colorOptions?.[colorSelected]?.image || section.image
                                      }
                                      alt={
                                        colorSelected === null
                                          ? "Default"
                                          : section.colorOptions?.[colorSelected]?.label || "Color"
                                      }
                                    />
                                    <motion.button
                                      type="button"
                                      className="detail-color-close"
                                      aria-label="Reset selection"
                                      onClick={() => setColorSelected(null)}
                                      initial={false}
                                      animate={
                                        colorSelected === null
                                          ? { opacity: 0, y: 100,scale: 0, pointerEvents: "none" }
                                          : { opacity: 1, y: 0, scale: 1,pointerEvents: "auto" }
                                      }
                                      transition={{
                                        duration: 0.05,
                                        ease: [0.77, 0, 0.175, 1],
                                        opacity: {
                                          duration: 0.02,
                                          delay: colorSelected === null ? 0.12 : 0,
                                          ease: [0.77, 0, 0.175, 1],
                                        },
                                      }}
                                    >
                                      ×
                                    </motion.button>
                                  </div>
                                  {/* --- 替换原本的 detail-color-controls 部分 --- */}
{/* 找到 section.colorControls 部分替换如下 */}
{/* --- 修正后的 Apple 交互组件 --- */}
<div className="detail-color-controls">
  {/* 父容器必须标记 layout，以便平滑处理兄弟元素的位移 */}
  <motion.div layout className="apple-stack-container">
    {(section.colorOptions || []).map((option, optionIndex) => {
      const isActive = optionIndex === colorSelected;
      
      return (
        <motion.div
          layout
          key={option.label}
          // 使用 Apple 官方风格的弹簧参数
          transition={{
            layout: { type: "spring", stiffness: 220, damping: 38, mass: 1 },
            opacity: { duration: 0.2 }
          }}
          // 移除所有会导致冲突的 inline style 动画，统一交给 className
          className={`apple-pill-card ${isActive ? "is-expanded" : "is-collapsed"}`}
        >
          <button
            type="button"
            className="apple-pill-trigger"
            onClick={() => setColorSelected(isActive ? null : optionIndex)}
          >
            <motion.div 
              layout
              className="apple-plus-circle"
              animate={{ rotate: isActive ? 45 : 0 }}
            >
              <span className="apple-plus-icon">+</span>
            </motion.div>
            <motion.span layout className="apple-pill-label">
              {option.label}
            </motion.span>
          </button>

          {/* 
              注意：为了防止“先弹出一部分”的错觉，我们不再使用 AnimatePresence 挂载，
              而是直接渲染并根据 isActive 控制高度，这样 layout 引擎能完美预判尺寸。
          */}
          <motion.div
            layout
            initial={false}
            animate={{ 
              height: isActive ? "auto" : 0,
              opacity: isActive ? 1 : 0 
            }}
            transition={{
              height: { type: "spring", stiffness: 220, damping: 28 },
              opacity: { duration: 0.25, delay: isActive ? 0.1 : 0 }
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="apple-expanded-content">
              <div className="apple-content-inner">
                <p className="apple-color-desc">
                  <strong>{option.title}</strong> {option.description}
                </p>
                {option.label === "Colors" && (
                  <div className="apple-swatch-row">
                    <div className="swatch-dot" style={{ backgroundColor: "#1c1c1e" }} />
                    <div className="swatch-dot" style={{ backgroundColor: "#e3e4e5" }} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    })}
  </motion.div>
</div>
                                </>
                              ) : (
                                <>
                                  <img src={section.image} alt={`${section.type}-${idx}`} />
                                  <div className="detail-feature-overlay">INTERACTIVE PLACEHOLDER</div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : section.type === "prototype" ? (
                      <div className="detail-prototype-grid">
                        <div className="detail-prototype-note detail-prototype-note--left">
                          <span className="detail-feature-index">
                            {String(idx + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                          </span>
                          <h3 className="detail-feature-title">{section.title}</h3>
                          <p className="detail-feature-desc">{section.description}</p>
                        </div>

                        <div className="detail-prototype-media">
                          <div className={`detail-feature-frame ${section.type === "app" ? "is-app" : "is-web"}`}>
                            <img src={section.image} alt={`${section.type}-${idx}`} />
                            <div className="detail-feature-overlay">INTERACTIVE PLACEHOLDER</div>
                          </div>
                          <div className="detail-prototype-arrow detail-prototype-arrow--left" />
                          <div className="detail-prototype-arrow detail-prototype-arrow--right" />
                        </div>

                        <div className="detail-prototype-note detail-prototype-note--right">
                          <span className="detail-feature-tag">{section.type === "app" ? "APP DESIGN" : "WEB DESIGN"}</span>
                          <p className="detail-feature-desc">{section.noteRight || "Interaction notes and UI behavior live here, describing intent and user flow in concise terms."}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="detail-feature-copy">
                          <span className="detail-feature-index">
                            {String(idx + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
                          </span>
                          <h3 className="detail-feature-title">{section.title}</h3>
                          <p className="detail-feature-desc">{section.description}</p>
                          <span className="detail-feature-tag">{section.type === "app" ? "APP DESIGN" : "WEB DESIGN"}</span>
                        </div>
                        <div className="detail-feature-media">
                          <div className={`detail-feature-frame ${section.type === "app" ? "is-app" : "is-web"}`}>
                            <img src={section.image} alt={`${section.type}-${idx}`} />
                            <div className="detail-feature-overlay">INTERACTIVE PLACEHOLDER</div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                  </React.Fragment>
                );
              })}
                </section>
              );
            })()}

            <AnimatePresence>
              {uiOverlay && (
                <motion.div
                  className="ui-overlay-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setUiOverlay(null)}
                >
                  <motion.div
                    className="ui-overlay-sheet"
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: appleEase }}
                    onClick={(event) => event.stopPropagation()}
                    style={{
                      "--ui-accent": uiOverlay.accent || "#4F6AFF",
                      "--ui-accent-soft": uiOverlay.accentSoft || "rgba(79, 106, 255, 0.2)",
                    }}
                  >
                    <button type="button" className="ui-overlay-close" onClick={() => setUiOverlay(null)}>
                      ×
                    </button>
                    <div
                      className="ui-overlay-scroll"
                      onWheel={(event) => event.stopPropagation()}
                      onTouchMove={(event) => event.stopPropagation()}
                    >
                      <div className="ui-overlay-media-shell">
                        <div className="ui-overlay-media">
                          {renderUiMotion(uiOverlay.variant, uiOverlay.lottieData, uiOverlay.emoji)}
                        </div>
                      </div>
                      <div className="ui-overlay-body">
                        <span className="ui-overlay-label">{uiOverlay.label || "MOTION"}</span>
                        <h3 className="ui-overlay-title">{uiOverlay.title}</h3>
                        <p className="ui-overlay-desc">{uiOverlay.longDescription || uiOverlay.description}</p>
                        <div className="ui-overlay-meta">
                          <div className="ui-overlay-meta-item">
                            <span className="ui-overlay-meta-label">Type</span>
                            <span className="ui-overlay-meta-value">{uiOverlay.meta?.type || "Interaction"}</span>
                          </div>
                          <div className="ui-overlay-meta-item">
                            <span className="ui-overlay-meta-label">System</span>
                            <span className="ui-overlay-meta-value">{uiOverlay.meta?.system || "Motion Lab"}</span>
                          </div>
                          <div className="ui-overlay-meta-item">
                            <span className="ui-overlay-meta-label">Spec</span>
                            <span className="ui-overlay-meta-value">{uiOverlay.meta?.spec || "1200ms loop"}</span>
                          </div>
                        </div>
                      </div>
                      {(() => {
                        const codeSample =
                          uiOverlay.code ||
                          `// Motion Lab: ${uiOverlay.title}\nconst container = document.querySelector(".ui-demo");\nconst dots = Array.from({ length: 3 }).map(() => {\n  const dot = document.createElement("span");\n  dot.className = "orbit-dot";\n  container.appendChild(dot);\n  return dot;\n});\n\nrequestAnimationFrame(() => {\n  dots.forEach((dot, index) => {\n    dot.style.animationDelay = \`\${index * 0.12}s\`;\n  });\n});`;
                        return (
                          <div className="ui-overlay-code">
                        <div className="ui-overlay-code-head">
                          <span className="ui-overlay-code-label">Code</span>
                        </div>
                        <div className="ui-overlay-code-block">
                          <button
                            type="button"
                            className="ui-overlay-copy"
                            onClick={() => handleCopy(codeSample, uiOverlay.id)}
                          >
                            {copiedId === uiOverlay.id ? "Copied" : "Copy"}
                          </button>
                          <pre>
                            <code>{codeSample}</code>
                          </pre>
                        </div>
                      </div>
                        );
                      })()}
                      <div className="ui-overlay-longtext">
                        {(uiOverlay.longText || defaultLongText).split("\n\n").map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {posterOverlay && (
                <motion.div
                  className="poster-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPosterOverlay(null)}
                >
                  <motion.div
                    className="poster-modal"
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: appleEase }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button type="button" className="poster-close" onClick={() => setPosterOverlay(null)}>
                      ×
                    </button>
                    <img className="poster-modal-image" src={posterOverlay.image} alt={posterOverlay.title || "Poster"} />
                    <a className="poster-modal-download" href={posterOverlay.image} download target="_blank" rel="noreferrer">
                      Download
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <section ref={nextSectionRef} className="next-project-footer" onClick={goNextProject} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && goNextProject()}>
              <div className="next-footer-container">
                <span className="next-hint">NEXT PROJECT</span>
                <div className="next-main-row">
                  <h2 className="next-title-display">{nextProject.title}</h2>
                  <div className="next-progress-group">
                    <span className="next-tag">NEXT PAGE</span>
                    <div className="next-bar-base"><div className="next-bar-fill" /></div>
                    <div className="next-arrow">→</div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
