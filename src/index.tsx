import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import WalletProvider from './contexts/wallet';

ReactDOM.render(
  <WalletProvider>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </WalletProvider>,
  document.getElementById('root')
);