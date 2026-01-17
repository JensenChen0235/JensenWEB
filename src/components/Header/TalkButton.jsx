import React from 'react';
import { motion } from 'framer-motion';
import Arrow from '../ui/Arrow';
import './TalkButton.css';

const TalkButton = ({ activeColor = "#0047ff" }) => {
  const lusionEase = [0.25, 1, 0.5, 1]; 

  // 将 variants 定义在渲染函数内部，确保它始终能抓取到最新的 activeColor
  const bgVariants = {
    rest: { 
      background: "#1c1c1e",
      transition: { duration: 0.4, ease: lusionEase }
    },
    hover: { 
      background: activeColor, // 这里的颜色现在是实时的
      transition: { duration: 0.4, ease: lusionEase }
    }
  };

  return (
    <div className="talk-button-wrapper">
      <motion.button
        className="talk-btn"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {/* 背景层 */}
        <motion.div
          className="talk-btn-bg"
          variants={bgVariants}
        />

        <div className="talk-btn-content">
          <motion.span
            className="btn-arrow"
            variants={{ 
              rest: { x: -25, opacity: 0 }, 
              hover: { x: 0, opacity: 1 } 
            }}
            transition={{ duration: 0.4, ease: lusionEase }}
          >
            <Arrow direction="right" />
          </motion.span>
          
          <motion.span
            className="btn-text"
            variants={{ 
              rest: { x: -8 }, 
              hover: { x: 5 } 
            }}
            transition={{ duration: 0.4, ease: lusionEase }}
          >
            LET'S TALK
          </motion.span>

          <motion.span
            className="btn-dot"
            variants={{ 
              rest: { x: 0, opacity: 1, scale: 1 }, 
              hover: { x: 0, opacity: 0, scale: 0 } 
            }}
            transition={{ duration: 0.4, ease: lusionEase }}
          />
        </div>
      </motion.button>
    </div>
  );
};

export default TalkButton;
