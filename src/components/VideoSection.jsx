import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VideoSection.css';

gsap.registerPlugin(ScrollTrigger);

const VideoSection = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      videoRef.current,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );
  }, []);

  const handlePlayClick = () => {
    setIsPlaying(true);
    // 这里可以添加实际的视频播放逻辑
  };

  return (
    <section ref={sectionRef} className="video-section">
      <div className="video-container" ref={videoRef}>
        <div className="video-placeholder">
          {!isPlaying && (
            <button className="play-button" onClick={handlePlayClick}>
              <span className="play-icon">▶</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;