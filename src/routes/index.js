import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from '../page/Signup.js';
import useAuth from '../hooks/useAuth.js';
import Signin from '../page/Signin.js';
import Home from '../page/Home.js';
import AgendarConsulta from '../components/AgendarConsulta.js'; 
import MeusAgendamentos from '../components/MeusAgendamentos'; 
import '../../src/styles.css'; 

const PrivateRoute = ({ element }) => {
  const { signed, user } = useAuth();

  if (user === null && signed === false) {
    return <div>Loading...</div>; 
  }

  return signed ? element : <Navigate to="/" />;
};

const RoutesApp = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/agendar" element={<PrivateRoute element={<AgendarConsulta />} />} /> 
          <Route path="/meus-agendamentos" element={<PrivateRoute element={<MeusAgendamentos />} />} /> 
          <Route path="" element={<Navigate to="/" />} /> 
        </Routes>
    </Router>
  );
};

export default RoutesApp;