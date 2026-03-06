import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VideoSection.css';

gsap.registerPlugin(ScrollTrigger);

const VideoSection = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const videoSource = "/Sungrow%20for%20tiktok.mp4";

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

  return (
    <section ref={sectionRef} className="video-section">
      <h2 className="video-title">View Only for Sungrow</h2>
      <div className="video-container" ref={videoRef}>
        <video
          className="video-element"
          src={videoSource}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <a
        className="video-caption"
        href="/Self-Initiated%20Task.pdf"
        download
        target="_blank"
        rel="noreferrer"
      >
        Download Video Description (The correct version)
      </a>
    </section>
  );
};

export default VideoSection;
