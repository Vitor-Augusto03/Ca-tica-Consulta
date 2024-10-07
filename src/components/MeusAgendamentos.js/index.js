// src/components/MeusAgendamentos.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const MeusAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrando agendamentos com base no termo de pesquisa
  const filteredAgendamentos = agendamentos.filter(agendamento =>
    agendamento.medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agendamento.data.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <h2 className="text-2xl font-bold">Meus Agendamentos</h2>
      <input
        type="text"
        className="border p-2 w-1/3 mb-4"
        placeholder="Pesquisar agendamento (Médico ou Data)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="w-1/3 mt-10">
        {filteredAgendamentos.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          filteredAgendamentos.map((agendamento) => (
            <div key={agendamento.id} className="border p-4 mb-4">
              <p><strong>Médico:</strong> {agendamento.medico.nome}</p>
              <p><strong>Data:</strong> {agendamento.data}</p>
              <p><strong>Horário:</strong> {agendamento.horario}</p>
              <p><strong>Status:</strong> {agendamento.status}</p>
              <button className="bg-red-500 text-white p-2 mt-2" onClick={() => handleCancelar(agendamento.id)}>
                Cancelar
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default MeusAgendamentos;
