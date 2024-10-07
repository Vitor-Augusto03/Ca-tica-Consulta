// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Certifique-se de que o App.js existe
import './index.css'; // Estilos globais, se houver

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
