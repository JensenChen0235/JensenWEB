import { useState, useRef, useEffect } from "react";
import { useLenis } from "../hooks/useLenis";
import Loader from "../components/Loader";
import Header from "../components/Header/Header";
import Hero from "../components/Hero";
import FeaturedWork from "../components/FeaturedWork";
import Canvas3D from "../components/Canvas3D";
import Hero3D from "../components/Hero3D";
import AboutSection from "../components/AboutSection";
import VideoSection from "../components/VideoSection";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef(null);
  const [activeColor, setActiveColor] = useState("#0047ff");
  const hoverSoundRef = useRef(null);
  const lastHoverRef = useRef(0);
  const lastTargetRef = useRef(null);

  // ✅ 你在用 Lenis：闪动核心嫌疑之一
  useLenis();

  useEffect(() => {
    hoverSoundRef.current = new Audio("/bubble.mp3");
    hoverSoundRef.current.volume = 0.1;
    hoverSoundRef.current.preload = "auto";

    const handleOver = (event) => {
      if (!window.soundEnabled) return;
      const target = event.target.closest("button, a, [role=\"button\"]");
      if (!target) return;
      if (lastTargetRef.current === target) return;

      const now = performance.now();
      if (now - lastHoverRef.current < 220) return;

      lastHoverRef.current = now;
      lastTargetRef.current = target;
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    };

    const handleOut = (event) => {
      const target = event.target.closest("button, a, [role=\"button\"]");
      if (!target) return;
      const related = event.relatedTarget;
      if (related && target.contains(related)) return;
      if (lastTargetRef.current === target) lastTargetRef.current = null;
    };

    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
    };
  }, []);

  useEffect(() => {
    const handleColor = (event) => {
      if (event?.detail) setActiveColor(event.detail);
    };
    window.addEventListener("hero3d-color", handleColor);
    return () => window.removeEventListener("hero3d-color", handleColor);
  }, []);

  return (
    <div className="home-root">
      <Canvas3D />
      <Header />

      <main ref={mainRef} className="home-content">
        <section className="home-hero-shell">
          <div className="home-hero-stars" aria-hidden="true" />

          {/* Hero 文本区域 */}
          <div className="hero-text-container">
            <div className="header-tagline">
              We help brands create digital experiences that connect with their
              audience
            </div>
          </div>

          <Hero3D />
        </section>

        <AboutSection activeColor={activeColor} />
        <FeaturedWork />
        <VideoSection />
        <Footer activeColor={activeColor} />
      </main>
    </div>
  );
}

export default Home;
