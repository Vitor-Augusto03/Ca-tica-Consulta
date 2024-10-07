import React from 'react';
import Lottie from 'lottie-react';


const RoboAnimation = () => {
  const roboAnimation = `${process.env.PUBLIC_URL}/roboanimation.json`; // Caminho correto

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Bem-vindo!</h2>
      <Lottie animationData={roboAnimation} loop={false} /> {/* Corrigido para usar o caminho correto */}
      <p className="mt-4">Você está logado com sucesso!</p>
      <a href="/home" className="bg-blue-500 text-white p-2 rounded mt-4">Ir para Home</a>
    </div>
  );
};

export default RoboAnimation;
