import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/",
	server: {
		port: 3011,
	},
	preview: {
		port: 3011,
		allowedHosts: ["digi-craft.de"],
	},
});
