import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ["legacy-js-api", "mixed-decls"],
      },
    },
  },
  build: {
    minify: "terser",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          components: ["./src/components/index.js"],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    allowedHosts: ["tiktop.io.vn", "www.tiktop.io.vn"],
    port: 4173,
  },
});
