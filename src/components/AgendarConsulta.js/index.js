// src/components/AgendarConsulta.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AgendarConsulta = () => {
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMedicos = async () => {
      const response = await axios.get('http://localhost:3001/api/medicos');
      setMedicos(response.data);
    };

    fetchMedicos();
  }, []);

  const handleAgendar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:3001/api/agendar',
        { data, horario, medicoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Consulta agendada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao agendar consulta.');
    }
  };

  // Filtrando médicos com base no termo de pesquisa
  const filteredMedicos = medicos.filter(medico =>
    medico.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <h2 className="text-2xl font-bold">Agendar Consulta</h2>
      <input
        type="text"
        className="border p-2 w-1/3 mb-4"
        placeholder="Pesquisar médico"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <form onSubmit={handleAgendar} className="w-1/3 mt-10">
        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <input
          type="time"
          className="border p-2 w-full mb-4"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
        />
        <select
          className="border p-2 w-full mb-4"
          value={medicoId}
          onChange={(e) => setMedicoId(e.target.value)}
        >
          <option value="">Selecione um médico</option>
          {filteredMedicos.map((medico) => (
            <option key={medico.id} value={medico.id}>
              {medico.nome}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Agendar
        </button>
      </form>
    </motion.div>
  );
};

export default AgendarConsulta;
