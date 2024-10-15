import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; 
import Navbar from '../Navbar';
const AgendarConsulta = () => {
  const [medicos, setMedicos] = useState([]);
  const [especialidade, setEspecialidade] = useState('');
  const [nomePaciente, setNomePaciente] = useState('');
  const [cpfPaciente, setCpfPaciente] = useState('');
  const [dataConsulta, setDataConsulta] = useState('');
  const [horarioConsulta, setHorarioConsulta] = useState('');
  const [sugestoes, setSugestoes] = useState([]);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/medicos');
        const data = await response.json();
        setMedicos(data);
      } catch (error) {
        console.error('Erro ao buscar médicos:', error);
      }
    };

    fetchMedicos();
  }, []);

  useEffect(() => {
    const gerarSugestoes = () => {
      const agora = new Date();
      const novasSugestoes = [];

      for (let i = 0; i < 2; i++) {
        const novaData = new Date(agora);
        novaData.setDate(agora.getDate() + i);

        for (let h = 8; h <= 17; h++) {
          novasSugestoes.push({
            data: novaData.toISOString().split('T')[0],
            horario: `${h.toString().padStart(2, '0')}:00`,
          });
        }
      }

      setSugestoes(novasSugestoes);
    };

    gerarSugestoes();
  }, []);
const token = localStorage.getItem('token')
  const handleAgendarConsulta = async () => {
    if (!nomePaciente || !cpfPaciente || !dataConsulta || !horarioConsulta || !especialidade) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const responseAgendamento = await fetch('http://localhost:3001/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cpf: cpfPaciente,
          medicoId: especialidade, // Passa o ID do médico selecionado
          data: dataConsulta,
          horario: horarioConsulta,
          status: 'Confirmado', // Adicione o status conforme necessário
        }),
      });

      if (!responseAgendamento.ok) {
        throw new Error('Erro ao agendar consulta');
      }

      alert('Consulta agendada com sucesso!');
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      alert('Erro ao agendar consulta. Tente novamente.');
    }
  };

  return (
    
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-300 to-gray-300 p-8" 
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      >
      <Navbar/>
      <h1 
        className="text-4xl font-bold text-white mb-8"
        initial={{ y: -50 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        
        Agendar Consulta
      </h1>

      <div className="flex flex-col text-black font-bold space-y-4 w-full max-w-md">
        <label className="">
          SEU NOME:
          <input
            type="text"
            value={nomePaciente}
            onChange={(e) => setNomePaciente(e.target.value)}
            className="w-full p-2 mt-1 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </label>

        <label className="">
          SEU CPF:
          <input
            type="text"
            value={cpfPaciente}
            onChange={(e) => setCpfPaciente(e.target.value)}
            className="w-full p-2 mt-1 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </label>

        <label className="">
          MÉDICO:
          <select 
            onChange={(e) => setEspecialidade(e.target.value)} 
            value={especialidade}
            className="w-full p-2 mt-1 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <option value="">Selecione um médico</option>
            {medicos.map((medico) => (
              <option key={medico.id} value={medico.id}>
                {medico.nome} - {medico.especialidade}
              </option>
            ))}
          </select>
        </label>

        <label className="">
          DATA E HORÁRIO:
          <select 
            onChange={(e) => {
              const [data, horario] = e.target.value.split(' - ');
              setDataConsulta(data);
              setHorarioConsulta(horario);
            }} 
            value={dataConsulta ? `${dataConsulta} - ${horarioConsulta}` : ''}
            className="w-full p-2 mt-1 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <option value="">Selecione uma data</option>
            {sugestoes.map((sugestao) => (
              <option key={`${sugestao.data}-${sugestao.horario}`} value={`${sugestao.data} - ${sugestao.horario}`}>
                {sugestao.data} - {sugestao.horario}
              </option>
            ))}
          </select>
        </label>

        <motion.button
          onClick={handleAgendarConsulta}
          className="w-full py-3 bg-white text-cyan-500 font-semibold rounded-lg shadow-md hover:bg-cyan-500 hover:text-white transition duration-200"
          whileHover={{ scale: 1.05 }} // Animação de hover
        >
          Agendar
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AgendarConsulta;
