import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "34.69.58.115/api",
    // port: 3000,
    proxy: {
      "/api": {
        target: "http://34.69.58.115/api",
        changeOrigin: true,
        secure: false,
      },
    },
    strictPort: true,
  },
})
