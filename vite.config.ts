import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import hotReloadExtension from "hot-reload-extension-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

const viteManifestHackIssue846: {
  renderCrxManifest: (manifest: any, bundle: any) => void;
  description: string;
  name: string;
  filename: string;
  length: number;
  item: any;
  namedItem: any;
} = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: "manifestHackIssue846",
  renderCrxManifest(_manifest, bundle) {
    bundle["manifest.json"] = bundle[".vite/manifest.json"];
    bundle["manifest.json"].fileName = "manifest.json";
    delete bundle[".vite/manifest.json"];
  },
  description: "",
  filename: "",
  length: 0,
  item: undefined,
  namedItem: undefined,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteManifestHackIssue846,
    crx({ manifest }),
    tsconfigPaths(), // relative path to tsconfig file
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
