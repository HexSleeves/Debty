import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "dist",
		sourcemap: true,
		minify: "esbuild",
		target: "es2020",
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					convex: ["convex/react", "convex/react-clerk"],
					ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
					clerk: ["@clerk/clerk-react"],
					router: ["@tanstack/react-router"],
				},
			},
		},
	},
	server: {
		port: 5173,
		open: false, // Don't auto-open since we use bun run dev
		host: true,
		cors: true,
	},
	preview: {
		port: 4173,
		host: true,
	},
	define: {
		__DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
	},
	envPrefix: ["VITE_", "PUBLIC_"],
});
