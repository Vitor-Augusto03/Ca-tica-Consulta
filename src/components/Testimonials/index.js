import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const testimonials = [
    "A equipe é muito atenciosa e os cuidados são excelentes! - Maria S.",
    "Estou muito satisfeito com meu tratamento. - João P.",
    "Atendimento excepcional, muito profissional! - Ana T.",
    "Fui tratado com carinho e atenção, recomendo! - Carlos R.",
    "Excelente serviço, sempre prontos para ajudar! - Fernanda L.",
    "A clínica é limpa e organizada, me senti em casa! - José M.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000); // Troca a cada 3 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [testimonials.length]);

  return (
    <div className="bg-gray-300 p-7 rounded-xl shadow-md mt-20 mb-7">
      <h2 className="text-2xl font-semibold text-center mb-4">O que nossos pacientes dizem</h2>
      <p className="text-gray-600 text-center">{testimonials[currentIndex]}</p>
    </div>
  );
};

export default Testimonials;
