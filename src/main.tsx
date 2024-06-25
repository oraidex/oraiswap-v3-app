import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

window.walletType = 'keplr';
window.Keplr = window?.keplr;
if (!window.Keplr && 'parent' in window) {
  window.keplr = window.Keplr = window.parent.keplr;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
