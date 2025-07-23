import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		// setupFiles: ["./src/test-setup.ts"],
		browser: {
			enabled: false,
			provider: "playwright",
			instances: [{ browser: "chromium" }],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
