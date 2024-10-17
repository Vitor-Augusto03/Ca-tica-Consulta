import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchApi } from '../../lib/utils';
import Navbar from "../Navbar"

const MeusAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [loading, setLoading] = useState(false); // Estado para controle do loader
  const [loadingPagina, setLoadingPagina] = useState(true);
  
  useEffect(() => {
    // Timeout de 3 segundos para o efeito de carregamento geral
    const timeout = setTimeout(() => {
      setLoadingPagina(false);
    }, 3000); // Defina o tempo que deseja para o efeito de carregamento

    return () => clearTimeout(timeout);
  }, []);

  // Função para buscar agendamentos
  const fetchAgendamentos = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetchApi('api/agendamentos', 'GET', null, token);
      setAgendamentos(response);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  useEffect(() => {
    fetchAgendamentos(); // Chamada para buscar agendamentos quando o componente é montado
  }, []);

  const handleCancelar = async (id) => {
    // Confirmar cancelamento com o usuário
    const confirmCancel = window.confirm('Você realmente deseja cancelar este agendamento?');
    if (!confirmCancel) return;

    const token = localStorage.getItem('token');
    setLoading(true); // Ativar o loader

    try {
      await fetchApi(`cancelarAgendamento/${id}`, 'DELETE', null, token);
      // Re-fetch agendamentos após cancelar
      await fetchAgendamentos();
      alert('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento.');
    } finally {
      setLoading(false); // Desativar o loader
    }
  };

  // Filtrando agendamentos com base no termo de pesquisa e no status
  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const matchesSearch = agendamento.medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.data.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || agendamento.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <Navbar/>
      
      <h2 className="text-2xl font-bold">Meus Agendamentos</h2>
      
      <input
        type="text"
        className="border p-2 w-1/3 mb-4"
        placeholder="Pesquisar agendamento (Médico ou Data)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filtro de Status */}
      <select
        className="border p-2 mb-4"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="Todos">Todos</option>
        <option value="Confirmado">Confirmado</option>
        <option value="Cancelado">Cancelado</option>
        {/* Adicione mais opções de status conforme necessário */}
      </select>

      <div className="w-1/3 mt-10">
        {loading ? ( // Exibindo loader enquanto a requisição está em andamento
          <p>Carregando...</p>
        ) : filteredAgendamentos.length === 0 ? (
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
      {loadingPagina && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-900 animate-pulse font-roboto">
            Consulta Caótica
          </h1>
        </div>
      )}

    </motion.div>
  );
};

export default MeusAgendamentos;
