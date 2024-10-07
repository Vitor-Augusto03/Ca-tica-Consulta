// src/components/LoadingScreen.js
import React from 'react';
import '../../../src/LoadingScreen.css'; 

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="overlay" /> 
      <img src="/LogoCaotica.png" alt="Logo Caotica" className="pulse" />
    </div>
  );
};

export default LoadingScreen;
