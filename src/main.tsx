import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css"; // Your global styles

// Import all your context providers
import { ThemeProvider } from "./store/theme.tsx";
import { AuthProvider } from "./store/auth.tsx";
import { BlogProvider } from "./store/blog.tsx";
import { CategoryProvider } from "./store/category.tsx";
import { SocialProvider } from "./store/social.tsx";
import { TooltipProvider } from "./components/common/wrappers/Tooltip.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <ThemeProvider storageKey="bloggr-theme" defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <BlogProvider>
              <CategoryProvider>
                <SocialProvider>
                  <App />
                </SocialProvider>
              </CategoryProvider>
            </BlogProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
);
