import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Loader.css';

const Loader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef(null);
  const progressBarRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    // 模拟加载进度
    const duration = 3; // 3秒加载时间
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // 加载完成，执行退出动画
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            onLoadComplete();
          },
        });
      }
    };

    requestAnimationFrame(updateProgress);

    // 进度条动画
    gsap.to(progressBarRef.current, {
      scaleX: 1,
      duration: duration,
      ease: 'power2.inOut',
    });
  }, [onLoadComplete]);

  return (
    <div ref={loaderRef} className="loader">
      <div className="loader-progress">
        <div className="progress-bar-container">
          <div ref={progressBarRef} className="progress-bar"></div>
        </div>
      </div>
      <div ref={counterRef} className="loader-counter">
        {Math.floor(progress).toString().padStart(3, '0')}
      </div>
    </div>
  );
};

export default Loader;