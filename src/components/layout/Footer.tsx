import React from "react";
import { Link } from "react-router-dom";

// 1. Define the props interface
interface FooterProps {
  variant?: "full" | "compact";
}

// 2. Define the component using React.FC<FooterProps>
// This explicitly tells TypeScript what props to expect.
const Footer: React.FC<FooterProps> = ({ variant = "full" }) => {
  // Compact version for the sidebar
  if (variant === "compact") {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
        <p className="mt-4">&copy; {new Date().getFullYear()} Bloggr Inc.</p>
      </div>
    );
  }

  // Full version for the bottom of the page
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-900 dark:border-gray-800 mt-12">
      <div className="container mx-auto py-8 px-4 text-center text-gray-500 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Bloggr Inc. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
