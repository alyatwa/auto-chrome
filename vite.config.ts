import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import hotReloadExtension from "hot-reload-extension-vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    hotReloadExtension({
      log: true,
      backgroundPath: "background/index.js", // relative path to background script file
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
