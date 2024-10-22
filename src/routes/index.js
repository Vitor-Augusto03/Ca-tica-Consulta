import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../page/Home.js';
import AgendarConsulta from '../components/AgendarConsulta.js'; 
import MeusAgendamentos from '../components/MeusAgendamentos'; 
import '../../src/styles.css'; 

const RoutesApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/agendar" element={<AgendarConsulta />} /> 
        <Route path="/meus-agendamentos" element={<MeusAgendamentos />} /> 
        <Route path="*" element={<Navigate to="/home" />} /> {/* Redirecionar para /home se a rota não existir */}
      </Routes>
    </Router>
  );
};

export default RoutesApp;
