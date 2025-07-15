// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      // This is the polyfill for the 'buffer' module
      buffer: 'buffer/',
    },
  },
});
