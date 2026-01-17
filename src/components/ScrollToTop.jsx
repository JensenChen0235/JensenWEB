// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollToHash = () => {
      if (!hash) return false;
      const id = hash.replace("#", "");
      const target = document.getElementById(id);
      if (!target) {
        setTimeout(() => {
          const retryTarget = document.getElementById(id);
          if (!retryTarget) return;
          try {
            if (window.lenis) {
              window.lenis.scrollTo(retryTarget, { duration: 0.8 });
              return;
            }
          } catch (e) {}
          retryTarget.scrollIntoView({ block: "start", behavior: "smooth" });
        }, 0);
        return true;
      }

      try {
        if (window.lenis) {
          window.lenis.scrollTo(target, { duration: 0.8 });
          return true;
        }
      } catch (e) {}

      target.scrollIntoView({ block: "start", behavior: "smooth" });
      return true;
    };

    // ✅ Lenis 模式：只负责“归零”，不在这里 stop/start（避免抖）
    try {
      if (window.lenis) {
        if (!scrollToHash()) {
          window.lenis.scrollTo(0, { immediate: true });
        }
        return;
      }
    } catch (e) {}

    if (!scrollToHash()) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
