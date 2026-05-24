import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        chunkSizeWarningLimit: 200,
        rollupOptions: {
            output: {
                manualChunks(id: string | null) {
                    if (id?.includes('@mui/material')) {
                        return 'mui';
                    }
                    if (id?.includes('@mui/icons-material')) {
                        return 'muiIcons';
                    }
                    if (id?.includes('framer-motion')) {
                        return 'framerMotion';
                    }
                },
            },
        },
    },
});
