import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; // Importe o framer-motion

const Home = ({ onLogout }) => {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/meus-agendamentos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgendamentos(response.data);
    };

    fetchAgendamentos();
  }, []);

  const handleCancelar = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/api/cancelar-agendamento/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgendamentos(agendamentos.filter(agendamento => agendamento.id !== id));
      alert('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao cancelar agendamento.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }} // Animação inicial
      animate={{ opacity: 1, y: 0 }}   // Animação ao entrar
      exit={{ opacity: 0, y: 50 }}      // Animação ao sair
      transition={{ duration: 0.5 }}     // Duração da animação
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-5">Bem-vindo à sua agenda médica!</h1>
      <div className="flex flex-col space-y-4">
        <Link to="/agendar" className="bg-blue-500 text-white p-3 rounded">Agendar Consulta</Link>
        <Link to="/meus-agendamentos" className="bg-green-500 text-white p-3 rounded">Meus Agendamentos</Link>
        <Link to="/calendario" className="bg-purple-500 text-white p-3 rounded">Ver Calendário</Link>
        <button onClick={onLogout} className="bg-red-500 text-white p-3 rounded">Logout</button>
      </div>
      <div className="mt-10 w-1/3">
        <h2 className="text-2xl font-bold">Agendamentos Atuais</h2>
        {agendamentos.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          agendamentos.map((agendamento) => (
            <div key={agendamento.id} className="border p-4 mb-4">
              <p><strong>Médico:</strong> {agendamento.medico.nome}</p>
              <p><strong>Data:</strong> {agendamento.data}</p>
              <p><strong>Horário:</strong> {agendamento.horario}</p>
              <button
                onClick={() => handleCancelar(agendamento.id)}
                className="bg-red-500 text-white p-2 mt-2 rounded"
              >
                Cancelar
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Home;
