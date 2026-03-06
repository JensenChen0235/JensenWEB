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

  const handleDownloads = () => {
    const files = [
      { href: "/Sungrow%20for%20tiktok.mp4", name: "Sungrow for tiktok.mp4" },
      { href: "/Self-Initiated%20Task.pdf", name: "Self-Initiated Task.pdf" },
    ];
    files.forEach((file) => {
      const link = document.createElement("a");
      link.href = file.href;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <section ref={sectionRef} className="video-section">
      <h2 className="video-title">Private Concept for Sungrow</h2>
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
      <button className="video-caption" type="button" onClick={handleDownloads}>
        Download Video &amp; Description (The correct version)
      </button>
    </section>
  );
};

export default VideoSection;
