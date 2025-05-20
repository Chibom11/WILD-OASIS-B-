import { motion } from "framer-motion";

const FlipText = ({ text, className = "", color1 = "text-black", color2 = "text-white" }) => {
  const DURATION = 0.25;
  const STAGGER = 0.025;

  return (
    <motion.div
      initial="initial"
      whileHover="hovered"
      className={`relative inline-block overflow-hidden ${className}`}
      style={{ lineHeight: 0.75 }}
    >
      {/* Front Text */}
      <div className={color1}>
        {text.split("").map((l, i) => (
          <motion.span
           
            className="inline-block"
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
          >
            {l}
          </motion.span>
        ))}
      </div>

      {/* Back (hover) Text */}
      <div className={`absolute inset-0 top-0 ${color2}`}>
        {text.split("").map((l, i) => (
          <motion.span
            
            className="inline-block"
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default FlipText;
