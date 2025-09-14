// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- THIS IS THE FIX ---
  // Add this 'test' configuration block.
  test: {
    // This tells Vitest to use a browser-like environment for your tests.
    // 'jsdom' is a library that simulates a web browser's DOM and other APIs.
    environment: 'jsdom',
    
    // Optional but recommended: run setup files before each test file.
    // setupFiles: './src/tests/setup.js',
    
    // Optional but recommended: enable glob patterns for finding test files.
    globals: true
  },
});