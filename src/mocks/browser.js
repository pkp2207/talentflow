import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

// Setup the worker with our handlers
export const worker = setupWorker(...handlers);

// Start the worker
export const startMSW = async () => {
  if (import.meta.env.DEV) {
    try {
      console.log('🔧 Setting up MSW worker...');
      
      const registration = await worker.start({
        onUnhandledRequest: 'warn',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
        waitUntilReady: true,
      });
      
      console.log('🔶 MSW enabled', registration);
      
      // Wait longer for the service worker to be fully ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test if MSW is working with retries
      let testSuccess = false;
      for (let i = 0; i < 3; i++) {
        try {
          console.log(`🧪 Testing MSW (attempt ${i + 1}/3)...`);
          const testResponse = await fetch('/api/test', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (testResponse.ok) {
            const data = await testResponse.json();
            console.log('✅ MSW is intercepting requests:', data);
            testSuccess = true;
            break;
          } else {
            console.warn(`⚠️ MSW test endpoint returned status ${testResponse.status} (attempt ${i + 1})`);
          }
        } catch (testError) {
          console.warn(`⚠️ MSW test failed (attempt ${i + 1}):`, testError.message);
          if (i < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (!testSuccess) {
        throw new Error('MSW failed to intercept requests after 3 attempts');
      }
      
    } catch (error) {
      console.error('❌ Failed to start MSW:', error);
      throw error;
    }
  } else {
    console.log('🔕 MSW disabled in production');
  }
};
