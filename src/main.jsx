// Suppress internal dependency warnings (like THREE.Clock) before any imports run
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args.some(arg => typeof arg === 'string' && (arg.includes('THREE.Clock') || arg.includes('THREE.Timer')))) return;
  originalWarn(...args);
};

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ui/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
