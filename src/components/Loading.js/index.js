// src/page/Loading.js
import React from 'react';
import { motion } from 'framer-motion';

// Animações diferentes que podem ser aplicadas
const loadingVariants = {
  fadeIn: {
    opacity: 1,
    transition: { duration: 0.5 }
  },
  fadeOut: {
    opacity: 0,
    transition: { duration: 0.5 }
  },
  scalePulse: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.8, repeat: Infinity }
  },
  slideIn: {
    x: '0%',
    opacity: 1,
    transition: { duration: 0.5 }
  },
  slideOut: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.5 }
  },
  rotate: {
    rotate: [0, 360],
    transition: { duration: 1, repeat: Infinity }
  }
};

const Loading = ({ animationType }) => {
  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-white"
      initial={animationType === 'fadeIn' ? { opacity: 0 } : { x: '100%', opacity: 0 }} // Condicional para animação inicial
      animate={animationType === 'fadeIn' ? 'fadeIn' : animationType === 'slideIn' ? 'slideIn' : animationType === 'rotate' ? 'rotate' : 'scalePulse'} // Seleciona a animação baseada no tipo
      exit={animationType === 'fadeOut' ? 'fadeOut' : 'slideOut'} // Condicional para animação de saída
    >
      <motion.img
        src={`${process.env.PUBLIC_URL}/LogoCaotica.png`} // Certifique-se de que este caminho esteja correto
        alt="Loading..."
        className="w-32 h-32"
        animate={animationType === 'scalePulse' ? 'scalePulse' : {}}
      />
    </motion.div>
  );
};

export default Loading;
