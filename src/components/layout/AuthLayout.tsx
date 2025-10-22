import type React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/common/wrappers/ThemeToggle";
import type { AuthMode } from "@/pages/AuthPage";

interface AuthLayoutProps {
  children: React.ReactNode;
  authMode: AuthMode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, authMode }) => {
  const navigate = useNavigate();

  // This function will close the modal by navigating back to the root URL
  const handleClose = () => {
    navigate("/");
  };

  return (
    // The AnimatePresence component enables smooth fade-in/fade-out animations
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 1. Backdrop with Blur Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          onClick={handleClose} // Close the modal when clicking the background
        />

        {/* 2. Modal Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {children}
        </motion.div>

        {/* 3. Close and Theme Toggle Buttons */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-white bg-black/20 hover:bg-black/40 transition-colors"
            aria-label="Close authentication"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AuthLayout;
