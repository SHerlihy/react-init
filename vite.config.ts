/// <reference types="vitest/config" />
import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

const buildExcludeFiles = ["src/stories", "src/tests", "**/*.test.ts", "**/*.test.tsx"]

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@features': path.resolve(__dirname, './src/features'),
        },
    },
    plugins: [
        react(),
        tailwindcss(),
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/tests/setup.js'
    },
    build: {
        outDir: "./deployment/createLambda/dist",
        emptyOutDir: true,
        rollupOptions: {
            external: buildExcludeFiles
        }
    },
} as UserConfig)
