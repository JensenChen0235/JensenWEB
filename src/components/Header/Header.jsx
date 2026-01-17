import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Menu from './Menu';
import SoundButton from './SoundButton';
import TalkButton from './TalkButton';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeColor, setActiveColor] = useState("#0047ff");
  const [logoColor, setLogoColor] = useState("#000000");
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const { pathname } = useLocation();
  const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

  useEffect(() => {
    if (window.hero3dColor) setActiveColor(window.hero3dColor);
    const handleColor = (event) => {
      if (event?.detail) {
        window.hero3dColor = event.detail;
        setActiveColor(event.detail);
      }
    };
    window.addEventListener("hero3d-color", handleColor);
    return () => window.removeEventListener("hero3d-color", handleColor);
  }, []);

  useEffect(() => {
    const computeLogoColor = () => {
      const match = getComputedStyle(document.body).backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return;
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      setLogoColor(luminance > 0.6 ? "#000000" : "#ffffff");
    };

    computeLogoColor();
    const timer = setTimeout(computeLogoColor, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

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
    if (isMenuOpen) setIsHeaderHidden(false);
  }, [isMenuOpen]);

  return (
    <>
      <header className={`header ${isHeaderHidden ? "is-hidden" : ""}`}>
        {/* 只保留左侧 Logo */}
        <div className="header-logo" style={{ "--header-logo-color": logoColor }}>
          <a href="/" className="header-logo-link" aria-label="JENSEN">
            <span className="header-brand-mark" aria-hidden="true" />
            <span className="header-brand-word">JENSEN</span>
          </a>
        </div>

        {/* --- 这里原本的 header-center 删掉了 --- */}

        {/* 只保留右侧按钮组 */}
        <div className="header-right">
          <SoundButton isMenuOpen={isMenuOpen} activeColor={activeColor} />
          <TalkButton activeColor={activeColor} />
          
          <motion.button 
            className="header-btn menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial="rest"
            whileHover="hover"
            animate={isMenuOpen ? "open" : "rest"}
          >
            <motion.div 
              className="menu-btn-bg"
              variants={{
                rest: { backgroundColor: "#E4E6EF" },
                hover: { backgroundColor: "#ffffff" },
                open: { backgroundColor: "#ffffff" }
              }}
              transition={transition}
            />
            <div className="menu-text-mask">
              <motion.div 
                className="menu-text-slider"
                animate={{ y: isMenuOpen ? "-100%" : "0%" }}
                transition={transition}
              >
                <span className="text-line">MENU</span>
                <span className="text-line">CLOSE</span>
              </motion.div>
            </div>
            <motion.span 
              className="btn-dots"
              variants={{ rest: { rotate: 0 }, hover: { rotate: 90 }, open: { rotate: 90 } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              ••
            </motion.span>
          </motion.button>
        </div>
      </header>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
