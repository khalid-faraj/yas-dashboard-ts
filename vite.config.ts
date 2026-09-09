import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/static/store_v2/dashboard/',
  server: {
    port: 5173,
  },
});
