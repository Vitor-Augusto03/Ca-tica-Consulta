import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchApi } from "../../lib/utils";
import Navbar from "../Navbar";
import { format } from "date-fns"; // Importa a função de formatação de data
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MeusAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
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
    try {
      const response = await fetchApi("api/agendamentos", "GET");
      setAgendamentos(response);
      console.log("Agendamentos após fetch:", response); // Verificar os agendamentos recebidos
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  useEffect(() => {
    fetchAgendamentos(); // Chamada para buscar agendamentos quando o componente é montado
  }, []);

  const handleCancelar = async (id) => {
    // Confirmar cancelamento com o usuário
    const confirmCancel = window.confirm(
      "Você realmente deseja cancelar este agendamento?"
    );
    if (!confirmCancel) return;

    setLoading(true); // Ativar o loader

    try {
      // Fazer requisição para atualizar o status para "Cancelado"
      await fetchApi(`api/agendamentos/${id}`, "PATCH", {
        status: "Cancelado",
      });

      // Re-fetch agendamentos após o cancelamento
      await fetchAgendamentos();
      console.log("Agendamentos após cancelamento:", agendamentos);

      // Exibir notificação de sucesso
      toast.success("Agendamento cancelado com sucesso!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      toast.error("Erro ao cancelar agendamento.", {
        position: "top-right",
      });
    } finally {
      setLoading(false); // Desativar o loader
    }
  };

  // Filtrando agendamentos com base no termo de pesquisa e no status
  const filteredAgendamentos = agendamentos.filter((agendamento) => {
    console.log("Agendamento atual:", agendamento); // Verificar cada agendamento
    const matchesSearch =
      agendamento.medico?.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      agendamento.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.paciente?.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Todos" || agendamento.status.trim() === statusFilter;

    console.log(
      "Matches Search:",
      matchesSearch,
      "Matches Status:",
      matchesStatus
    ); // Verificar resultados de comparação
    return matchesSearch && matchesStatus;
  });

  console.log("Agendamentos filtrados:", filteredAgendamentos);
  console.log("Status do filtro:", statusFilter);
  console.log("Termo de pesquisa:", searchTerm);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-800"
    >
      <Navbar />

      <h2 className="text-3xl font-extrabold text-white mb-4">
        MEUS AGENDAMENTOS
      </h2>
      <input
        type="text"
        className="placeholder:text-center border-none p-2 w-1/3  mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Pesquisar agendamento (Médico ou Paciente)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="border-none p-2 mb-4 rounded-lg  focus:outline-none "
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="Todos" className="">
          Todos
        </option>
        <option value="Confirmado" className="">
          Confirmado
        </option>
        <option value="Cancelado" className="">
          Cancelado
        </option>
        {/* Adicione mais opções de status conforme necessário */}
      </select>

      <div className="w-full bg-white p-10  md:w-1/3 mt-10  overflow-y-auto max-h-96 border-none rounded-lg ">
        {loading ? (
          <p className="flex justify-center items-center min-h-screen">
            <ClipLoader size={20} color="#039b17" />
          </p>
        ) : filteredAgendamentos.length === 0 ? (
          <p className="text-gray-600 text-center  ">
            Nenhum agendamento encontrado.
          </p>
        ) : (
          filteredAgendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="border hover:bg-gray-100 border-green-300 p-4 mr-2 mb-4  bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {agendamento.medico && agendamento.medico.nome ? (
                <div>
                  <p className="text-gray-600">
                    <strong>Médico:</strong> {agendamento.medico.nome}
                  </p>
                  <p className="text-gray-600">
                    <strong>Especialidade:</strong>{" "}
                    {agendamento.medico.especialidade.nome ||
                      "Não especificada"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">
                  <strong>Médico:</strong> Informação não disponível
                </p>
              )}

              {agendamento.paciente && agendamento.paciente.nome ? (
                <p className="text-gray-600">
                  <strong>Paciente:</strong> {agendamento.paciente.nome}
                </p>

              ) : (
                <p className="text-gray-600">
                  <strong>Paciente:</strong> Informação não disponível
                </p>
              )}

              <p className="text-gray-600">
                <strong>Data:</strong>{" "}
                {format(new Date(agendamento.data), "dd/MM/yyyy")}
              </p>
              <p className="text-gray-600">
                <strong>Horário:</strong> {agendamento.horario}
              </p>
              <p
                className={`${
                  agendamento.status === "Cancelado"
                    ? "text-red-600 font-bold"
                    : "text-green-700 font-bold"
                }`}
              >
                <strong className="text-gray-600 font-bold">Status:</strong>{" "}
                {agendamento.status}
              </p>
              {agendamento.status !== "Cancelado" && (
                <button
                  className="bg-red-500 text-white p-2 mt-2 rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => handleCancelar(agendamento.id)}
                >
                  Cancelar
                </button>
              )}
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
