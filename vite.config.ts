import { fileURLToPath, URL } from "node:url";

import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const PWAConfig = {
  includedAssets: ["**/*"],
  workbox: { globPatterns: ["**/*"] },
  manifest: {
    name: "Age calculator app",
    short_name: "Age calculater",
    description: "App for calculating age based on date of birth.",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA(PWAConfig)],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
