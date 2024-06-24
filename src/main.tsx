import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

window.walletType = 'keplr';
if (!window.keplr) {
  window.keplr = window.parent.keplr;
  window.Keplr = window.keplr;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
