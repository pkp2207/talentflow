import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App.jsx';
import { queryClient } from './utils/queryClient.js';
import { startMSW } from './mocks/browser.js';
import { reseedDatabase } from './utils/seedData.js';
import { resetDatabase } from './db/index.js';

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Initialize the app
async function initializeApp() {
  try {
    console.log('🚀 Initializing TalentFlow...');
    
    // Start MSW first
    console.log('🔧 Starting Mock Service Worker...');
    await startMSW();
    
    // Wait for MSW to be fully ready
    console.log('⏳ Waiting for MSW to be ready...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reseed the database with fresh data
    console.log('🌱 Seeding database...');
    await reseedDatabase();
    
    console.log('✅ App initialization complete');
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    
    // If there's a database error, try to reset and reseed
    if (error.message?.includes('InvalidAccessError') || error.message?.includes('createIndex')) {
      console.log('🔄 Database schema error detected, resetting database...');
      await resetDatabase();
      await reseedDatabase();
    } else {
      // For other errors, still try to render the app
      console.warn('⚠️ Continuing with app render despite initialization error');
    }
  }
  
  // Render the app
  console.log('🎨 Rendering app...');
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
}

initializeApp().catch(console.error);
