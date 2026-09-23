import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Arm scroll reveals before first paint so revealed content never flashes in.
if (
  'IntersectionObserver' in window &&
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
) {
  document.documentElement.classList.add('reveal-ready');
}
import { Provider } from 'react-redux';
import { store } from './state/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
