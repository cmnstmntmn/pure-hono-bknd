import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devFsVitePlugin } from "bknd/adapter/cloudflare";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import ssrPlugin from "vite-ssr-components/plugin";

export default defineConfig(({ mode }) => ({
	clearScreen: false,
	plugins: [
		devFsVitePlugin({ configFile: "config.ts" }),
		cloudflare(),
		tailwindcss(),
		ssrPlugin(),
		analyzer({ enabled: mode === "analyze" }),
	],
	build: {
		minify: false,
	},
}));
