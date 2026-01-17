import React from 'react';
import { motion } from 'framer-motion';
import Arrow from './ui/Arrow'; 
import './ProjectCard.css';

const ProjectCard = ({ title, tags, image }) => {
  // 定义 Lusion 特色的弹性缓动
  const elasticTransition = {
    type: "spring",
    stiffness: 260,
    damping: 20
  };

  return (
    <motion.div 
      className="project-card"
      initial="initial"
      whileHover="hover"
      animate="initial"
    >
      {/* 1. 图片容器 */}
      <div className="project-image-container">
        <motion.img 
          src={image} 
          alt={title}
          className="project-image"
          variants={{
            initial: { scale: 1, filter: "blur(0px)" },
            // 关键逻辑：数组形式实现“模糊一下立即变清晰”
            hover: { 
              scale: 1.05, 
              filter: ["blur(0px)", "blur(8px)", "blur(0px)"] 
            }
          }}
          transition={{
            scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 0.4, times: [0, 0.2, 1] } // 0.4秒内快速完成模糊闭环
          }}
        />
        <div className="project-image-overlay" />
      </div>

      {/* 2. 信息区域 */}
      <div className="project-info">
        <div className="project-tags">
          {tags.map((tag, i) => (
            <span key={i} className="project-tag">
              {tag}{i < tags.length - 1 && " • "}
            </span>
          ))}
        </div>
        
        <div className="project-title-wrapper">
          {/* 3. 箭头：从左侧推入 */}
          <motion.div
            className="project-arrow-box"
            variants={{
              initial: { x: -50, opacity: 0 },
              hover: { x: -10, opacity: 1 }
            }}
            transition={elasticTransition}
          >
             <div className="project-card-arrow-icon">
              <Arrow direction="right" />
            </div>
          </motion.div>

          {/* 4. 文字：带弹性的右移 */}
          <motion.h3 
            className="project-title"
            variants={{
              initial: { x: -40 },
              hover: { x: 10 } // 只有微小的位移，配合箭头产生的挤压感
            }}
            transition={elasticTransition}
          >
            {title}
          </motion.h3>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;