import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './SoundButton.css';

const WAVE_PATH = "M-24 12 C-18 6, -12 6, -12 12 C-12 18, -6 18, 0 12 C6 6, 12 6, 12 12 C12 18, 18 18, 24 12 C30 6, 36 6, 36 12 C36 18, 42 18, 48 12";
const FLAT_PATH = "M-24 12 C-18 12, -12 12, -12 12 C-12 12, -6 12, 0 12 C6 12, 12 12, 12 12 C12 12, 18 12, 24 12 C30 12, 36 12, 36 12 C36 12, 42 12, 48 12";

// 接收 activeColor 参数，默认为 Lusion 蓝
const SoundButton = ({ isMenuOpen, activeColor = "#0047ff" }) => {
  const [isPlaying, setIsPlaying] = useState(() => window.soundEnabled === true);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);
  const bgControls = useAnimation();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!window.bgmAudio) {
      window.bgmAudio = new Audio('/bgm.mp3');
      window.bgmAudio.loop = true;
      window.bgmAudio.volume = 0.8;
    }
    audioRef.current = window.bgmAudio;
    if (typeof window.soundEnabled !== "boolean") {
      window.soundEnabled = false;
    }
    if (window.soundEnabled) {
      setIsPlaying(true);
    }

    return () => {
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleExternalEnable = () => {
      setIsPlaying(true);
    };
    window.addEventListener("sound-enable", handleExternalEnable);
    return () => window.removeEventListener("sound-enable", handleExternalEnable);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    window.soundEnabled = isPlaying;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 定义 6 个方位的起始/结束坐标
  const getPositions = (offset = "120%") => [
    { x: offset, y: "0%" },    // 0: 右
    { x: "60%", y: offset },   // 1: 右下
    { x: "-60%", y: offset },  // 2: 左下
    { x: `-${offset}`, y: "0%" },   // 3: 左
    { x: "-60%", y: `-${offset}` }, // 4: 左上
    { x: "60%", y: `-${offset}` }   // 5: 右上
  ];

  const getSixDirection = (e) => {
    if (!buttonRef.current) return 0;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = angle < 0 ? angle + 360 : angle;
    return Math.round(angle / 60) % 6;
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    const dir = getSixDirection(e);
    const startPos = getPositions("120%")[dir];

    bgControls.set({ ...startPos, opacity: 1, scale: 1.2 });
    bgControls.start({
      x: "0%",
      y: "0%",
      opacity: 1,
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
    });
  };

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    const dir = getSixDirection(e);
    const endPos = getPositions("120%")[dir];

    bgControls.start({
      ...endPos,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    });
  };

  return (
    <div className="lusion-sound-wrapper">
      <button
        ref={buttonRef}
        className="lusion-btn-main"
        onClick={() => setIsPlaying(!isPlaying)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="bg-static-gray"
          animate={{
            backgroundColor: isMenuOpen ? "#ffffff" : "#E4E6EF"
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* 关键修改：背景色使用传入的 activeColor */}
        <motion.div 
          className="bg-dynamic-blue"
          animate={bgControls}
          initial={{ opacity: 0, x: "120%", y: "0%" }}
          style={{ background: activeColor }}
        />

        <div className="icon-viewport">
          <svg viewBox="0 0 24 24">
            <motion.path
              initial={{ d: FLAT_PATH }}
              animate={{
                d: isPlaying ? WAVE_PATH : FLAT_PATH,
                x: isPlaying ? [0, -24] : 0,
                stroke: isHovered ? "#FFFFFF" : "#000000"
              }}
              transition={{
                d: { duration: 1, ease: [0.6, 0.01, -0.05, 0.95] },
                x: { duration: 1, repeat: Infinity, ease: "linear" },
                stroke: { duration: 0.2 }
              }}
              strokeWidth="3"
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default SoundButton;
