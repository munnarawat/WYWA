import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    target: "esnext",
    cssCodeSplit: true,
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // React
            if (
              id.includes("react") ||
              id.includes("react-dom")
            ) {
              return "react-vendor";
            }

            // React Router
            if (id.includes("react-router-dom")) {
              return "router-vendor";
            }

            // Redux
            if (
              id.includes("@reduxjs") ||
              id.includes("react-redux")
            ) {
              return "redux-vendor";
            }

            // Motion
            if (
              id.includes("motion") ||
              id.includes("framer-motion")
            ) {
              return "motion-vendor";
            }

            // GSAP
            if (id.includes("gsap")) {
              return "gsap-vendor";
            }

            // Socket.IO
            if (
              id.includes("socket.io") ||
              id.includes("engine.io")
            ) {
              return "socket-vendor";
            }

            // Axios
            if (id.includes("axios")) {
              return "axios-vendor";
            }

            // Default vendor chunk
            return "vendor";
          }
        },
      },
    },
  },
});