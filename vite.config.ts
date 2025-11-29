import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import ssrPlugin from "vite-ssr-components/plugin";
// import { adapter } from "vite-bundle-analyzer";
// import { analyzer } from "vite-bundle-analyzer";

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin()],
  build: {
    minify: true,
  },
});
