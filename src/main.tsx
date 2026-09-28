import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('[IRLOS CLOUD] Booting Subscriber Dashboard...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[IRLOS CLOUD] Root element #root was not found.');
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err: any) {
    console.error('[IRLOS CLOUD] Fatal mount error:', err);
    rootElement.innerHTML = `
      <div style="background:#08080a;color:#ef4444;padding:24px;margin:20px;border:2px solid #ef4444;font-family:monospace;">
        <h2 style="color:#ef4444;margin:0 0 10px;">[FATAL RENDER ERROR]</h2>
        <pre style="color:#e8e4da;font-size:12px;overflow:auto;">${err?.stack || err?.message || err}</pre>
      </div>
    `;
  }
}
