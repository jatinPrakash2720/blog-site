import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * A reusable component that wraps page content to provide a consistent
 * fade-and-slide animation during route changes.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  const variants = {
    hidden: { opacity: 0, x: -40 }, // Starts invisible and slightly to the left
    enter: { opacity: 1, x: 0 }, // Fades in and slides to center
    exit: { opacity: 0, x: 40 }, // Fades out and slides to the right
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ ease: "easeInOut", duration: 0.4 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
