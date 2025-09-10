import { defineConfig, splitVendorChunkPlugin } from "vite";
import dotenv from "dotenv";
import path from "node:path";
import preact from "@preact/preset-vite";
import tailwindcss from '@tailwindcss/vite'

dotenv.config({ path: ".env" });

export default defineConfig({
    plugins: [splitVendorChunkPlugin(), preact(),tailwindcss()],
    root: "src",
    resolve: {
        // RESOURCES ALIAS
        alias: {
            "@": path.resolve(__dirname, "src", "services"),
            "~": path.resolve(__dirname, "src"),
        },
    },
    base: process.env.NODE_ENV === "production" ? "/dist/" : "/",
    build: {
        outDir: path.resolve(__dirname, "public", "dist"),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: path.resolve(__dirname, "src", "pages", "main.jsx"),
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                },
            },
        },
    },
    server: {
        strictPort: true,
        port: Number(process.env.VITE_PORT),
        host: true,
        watch: {
            usePolling: true, // docker
        },
    },
});
