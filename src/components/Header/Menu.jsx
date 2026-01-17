import { motion, AnimatePresence } from "framer-motion";
import "./Menu.css";
import Arrow from "../ui/Arrow";

// 菜单项组件 - 保持原样
const MenuItem = ({ name, isActive }) => {
  return (
    <motion.div
      className={`menu-item ${isActive ? "active" : ""}`}
      whileHover={isActive ? "" : "hover"}
      initial="rest"
    >
      {!isActive && (
        <motion.div
          className="item-hover-bg"
          variants={{
            rest: { opacity: 0, scale: 0.95 },
            hover: { opacity: 1, scale: 1.1 },
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="item-content">
        <div className="item-text-mask">
          <motion.span
            className="item-text-main"
            variants={{ rest: { y: 0 }, hover: { y: "-100%" } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {name}
          </motion.span>
          {!isActive && (
            <motion.span
              className="item-text-sub"
              variants={{ rest: { y: "100%" }, hover: { y: 0 } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {name}
            </motion.span>
          )}
        </div>

        <div className="item-status">
          {isActive ? (
            <span className="dot-active">●</span>
          ) : (
            <motion.span
              className="arrow-hover"
              variants={{
                rest: { x: -10, opacity: 0, scale: 0.5 },
                hover: { x: 0, opacity: 1, scale: 1 },
              }}
              style={{ color: "#000" }}
            >
              <Arrow direction="right" />
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Menu = ({ isOpen, onClose }) => {
  const menuItems = ["HOME", "ABOUT US", "PROJECTS", "CONTACT"];

  const cardVariants = {
    hidden: { y: 150, opacity: 0, rotate: -10, transformOrigin: "bottom right" },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    exit: { y: 100, opacity: 0, rotate: -10, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* 1. 在遮罩层绑定 onClick={onClose} */
        <div className="menu-overlay" onClick={onClose}>
          
          {/* 2. 在卡片容器绑定 e.stopPropagation() 防止点击卡片时也关闭菜单 */}
          <div className="menu-inner" onClick={(e) => e.stopPropagation()}>
            
            <motion.div
              className="menu-card nav-card"
              custom={0}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
            >
              {menuItems.map((item) => (
                <MenuItem key={item} name={item} isActive={item === "HOME"} />
              ))}
            </motion.div>

            <motion.div
              className="menu-card newsletter-card"
              custom={1}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
            >
              <h3>Subscribe to our newsletter</h3>
              <div className="email-bar">
                <input type="email" placeholder="Your email" />
                <div className="email-btn"> <Arrow direction="right" /></div>
              </div>
            </motion.div>

            <motion.div
              className="menu-card labs-card"
              custom={2}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div initial="rest" animate="rest" whileHover="hover">
                <div className="labs-wrapper">
                  <span className="labs-icon">ö</span>
                  <div className="labs-text-mask">
                    <motion.span
                      variants={{ rest: { y: 0 }, hover: { y: "-100%" } }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      LABS
                    </motion.span>
                    <motion.span
                      className="abs-top"
                      variants={{ rest: { y: "100%" }, hover: { y: 0 } }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      LABS
                    </motion.span>
                  </div>

                  <motion.span
                    className="labs-arrow"
                    variants={{ rest: { x: 0, y: 0 }, hover: { x: 4, y: -4 } }}
                  >
                    <Arrow direction="up-right" />
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Menu;