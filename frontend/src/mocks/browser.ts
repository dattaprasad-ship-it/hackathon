import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Log when MSW is ready
worker.events.on('request:start', ({ request }) => {
  if (request.url.includes('/auth/login')) {
    console.log('[MSW] Intercepting login request:', request.method, request.url);
  }
});

worker.events.on('request:match', ({ request }) => {
  if (request.url.includes('/auth/login')) {
    console.log('[MSW] Matched login request:', request.url);
  }
});

