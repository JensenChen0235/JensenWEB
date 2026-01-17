import { motion } from "framer-motion";

const directionMap = {
  right: 0,
  down: 90,
  left: 180,
  up: -90,
  "up-right": -45,
  "down-right": 45,
  "down-left": 135,
  "up-left": -135,
};

export default function Arrow({
  direction = "right",
  size = 20,
  strokeWidth = 2,
  color = "currentColor",
  animate = true,
  className = "",
}) {
  const rotation = directionMap[direction] ?? 0;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={{ rotate: rotation }}
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.path
        d="M5 12h14M13 6l6 6-6 6"
        variants={
          animate
            ? {
                rest: { x: 0, opacity: 1 },
                hover: { x: 4, opacity: 1 },
              }
            : {}
        }
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.svg>
  );
}