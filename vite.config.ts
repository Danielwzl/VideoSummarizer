import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

function copyManifestPlugin() {
  return {
    name: "copy-manifest",
    closeBundle() {
      const distDir = resolve(__dirname, "dist");
      const iconsDir = resolve(distDir, "icons");
      mkdirSync(iconsDir, { recursive: true });

      copyFileSync(
        resolve(__dirname, "public/manifest.json"),
        resolve(distDir, "manifest.json")
      );

      for (const size of [16, 48, 128]) {
        const src = resolve(__dirname, `public/icons/icon${size}.png`);
        if (existsSync(src)) {
          copyFileSync(src, resolve(iconsDir, `icon${size}.png`));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyManifestPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup/index.html"),
      },
    },
  },
});
