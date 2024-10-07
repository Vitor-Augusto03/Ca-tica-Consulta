import React, { useState, Suspense,  useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loading from './components/Loading.js';
import Cadastro from './page/Cadastro';
import Login from './page/Login.js';
import Home from './page/Home';
import AgendarConsulta from './components/AgendarConsulta.js/index.js';
import CalendarioAgendamentos from './components/CalendarioAgendamentos.js/index.js';
import MeusAgendamentos from './components/MeusAgendamentos.js';
import RoboAnimation from './animations/RoboAnimation';
import LoadingScreen from './components/LoadingScreen.js/index.js';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Simula um carregamento, pode ser substituído pela lógica de autenticação ou chamada de API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Duração do carregamento em milissegundos (3 segundos)

    return () => clearTimeout(timer); // Limpa o timer ao desmontar
  }, []);

  const handleLogin = (email) => {
    setLoading(true); // Inicia o loading
    setIsLoggedIn(true);
    setLoading(false); // Desativa o loading após login
  };

  const handleLogout = () => {
    setLoading(true); // Inicia o loading
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // Remove o token do armazenamento local
    setLoading(false); // Desativa o loading após logout
  };

  return (
    <Router>
      {loading ? (
        <LoadingScreen /> // Exibe a tela de carregamento
      ) : (
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} setLoading={setLoading} />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/home" element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/agendar" element={isLoggedIn ? <AgendarConsulta /> : <Navigate to="/" />} />
            <Route path="/meus-agendamentos" element={isLoggedIn ? <MeusAgendamentos /> : <Navigate to="/" />} />
            <Route path="/calendario" element={isLoggedIn ? <CalendarioAgendamentos /> : <Navigate to="/" />} />
            <Route path="/welcome" element={isLoggedIn ? <RoboAnimation /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redireciona qualquer rota não encontrada para a página inicial */}
          </Routes>
        </Suspense>
      )}
    </Router>
  );
};

export default App;
