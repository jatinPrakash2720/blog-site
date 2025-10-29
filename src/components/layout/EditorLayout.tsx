import type React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ThemeToggle from "../common/wrappers/ThemeToggle";
import { Toaster } from "../ui/sonner";

interface EditorLayoutProps {
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  // This function closes the drawer by navigating to the previous page in history.
  const handleClose = () => {
    navigate("/home");
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with Blur Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
          // onClick={handleClose} // Clicking the background will close the editor/drawer
        />
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

        {/* This is where the drawer or editor will be rendered */}
        {children}
        <Toaster />
      </div>
    </AnimatePresence>
  );
};

export default EditorLayout;
