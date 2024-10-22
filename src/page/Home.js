import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Testimonials from "../components/Testimonials";
import Navbar from "../components/Navbar"



const Services = () => {
  return (
    <div className="flex flex-col cursor-pointer items-center mb-8 font-extralight">
      <h2 className="text-2xl mb-4 text-gray-100 font-semibold">
        Nossos Serviços
      </h2>
      <div className="flex space-x-8">
        <div className="flex flex-col items-center transition-transform transform hover:scale-105">
          <i className="fa-stethoscope text-4xl transition-colors duration-300"></i>
          <p className="mt-2 text-gray-100 transition-colors duration-300">
            Consulta Médica
          </p>
        </div>
        <div className="flex flex-col items-center transition-transform transform hover:scale-105">
          <i className="fas fa-heart text-4xl transition-colors duration-300"></i>
          <p className="mt-2 text-gray-100 transition-colors duration-300">
            Check-up Cardiovascular
          </p>
        </div>
        <div className="flex flex-col items-center transition-transform transform hover:scale-105">
          <i className="fas fa-pills text-4xl transition-colors duration-300"></i>
          <p className="mt-2 text-gray-100 transition-colors duration-300">
            Tratamento e Medicamentos
          </p>
        </div>
      </div>
    </div>
  );
};




const Footer = () => {
  return (
    <footer className="shadow-md bg-green-700 py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <Services />
        <div className="flex space-x-4 mt-4">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/instagram.png" alt="Instagram" className="w-8 h-8" />
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=96991756873"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
          </a>
        </div>
        <p className="text-center text-gray-100 mt-4">
          © 2024 Clínica Caótica. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};


const FloatingPharmacyIcons = () => {
  const icons = Array.from({ length: 5 }); // Criar um array de 5 elementos

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map((_, index) => (
        <motion.img
          key={index}
          src="/farmacia.png" // Caminho para o ícone na pasta public
          alt="Ícone de Farmácia"
          className="w-24 h-24" // Ajuste o tamanho conforme necessário
          animate={{
            y: [0, -20, 0], // Mover para cima e depois para baixo
            rotate: [0, 15, -15, 0], // Leve rotação
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: Math.random() * 3, // Aleatorizar a duração entre as animações
          }}
          style={{
            top: `${Math.random() * 100}%`, // Posicionamento vertical aleatório
            left: `${Math.random() * 100}%`, // Posicionamento horizontal aleatório
          }}
        />
      ))}
    </div>
  );
};


const Home = () => {
  const navigate = useNavigate();
 
  
  const handleAgendar = () => {
    navigate("/agendar");
  };

  const handleMeusAgendamentos = () => {
    navigate("/meus-agendamentos");
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-white relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center relative">
        <h1
          className="bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent text-5xl font-bold mb-8 shadow-lg"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Bem-vindo à Clínica Caótica
        </h1>
        <motion.p className="text-lg text-white mb-6 text-center">
          Cuidamos da sua saúde com excelência e carinho. Agende sua consulta e
          venha nos conhecer!
        </motion.p>
        <div className="flex flex-col space-y-4">
          <motion.button
            onClick={handleAgendar}
            className="w-64 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-200"
            whileHover={{ scale: 1.05 }}
          >
            Agendar Consulta
          </motion.button>
          <motion.button
            onClick={handleMeusAgendamentos}
            className="w-64 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-200"
            whileHover={{ scale: 1.05 }}
          >
            Meus Agendamentos
          </motion.button>
        </div>
        <Testimonials />
    
      </div>
      <Footer />
      <FloatingPharmacyIcons /> {/* Adicionando ícones flutuantes aqui */}
    </motion.div>
  );
};

export default Home;
