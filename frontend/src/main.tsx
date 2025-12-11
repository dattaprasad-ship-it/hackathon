import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

async function enableMocking() {
  // TEMPORARILY DISABLED - Using real backend
  console.log('[MSW] Temporarily disabled - using real backend');
  return;

  // Disable MSW if VITE_DISABLE_MSW is set to 'true'
  if (import.meta.env.VITE_DISABLE_MSW === 'true') {
    console.log('[MSW] Disabled via VITE_DISABLE_MSW environment variable');
    return;
  }

  if (import.meta.env.MODE !== 'development') {
    return;
  }

  try {
    const { worker } = await import('./mocks/browser');
    
    // Start the MSW worker (non-blocking)
    await worker.start({
      onUnhandledRequest: 'bypass', // Let requests through to real backend if not handled
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    }).then(() => {
      console.log('[MSW] Mock Service Worker started successfully');
    }).catch((error) => {
      console.warn('MSW worker start failed, continuing without mocks:', error);
    });
  } catch (error) {
    console.warn('MSW initialization failed, continuing without mocks:', error);
  }
}

// Render app immediately, MSW will start in background
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Start MSW in background (non-blocking)
enableMocking().catch((error) => {
  console.warn('MSW failed to start:', error);
});

// Render app immediately with error boundary
try {
  console.log('Starting app render...');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1 style="color: #dc2626;">Failed to Load Application</h1>
      <p>An error occurred while loading the application.</p>
      <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; overflow: auto;">
        ${error instanceof Error ? error.message : String(error)}
        ${error instanceof Error && error.stack ? '\n\nStack:\n' + error.stack : ''}
      </pre>
      <p>Please check the browser console (F12) for more details.</p>
      <button onclick="window.location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
}
