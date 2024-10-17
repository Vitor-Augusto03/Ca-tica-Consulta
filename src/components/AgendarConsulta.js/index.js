import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import { ClipLoader, BeatLoader } from 'react-spinners';

const AgendarConsulta = () => {
  const [medicos, setMedicos] = useState([]);
  const [especialidade, setEspecialidade] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [cpfPaciente, setCpfPaciente] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [horarioConsulta, setHorarioConsulta] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [loadingMedicos, setLoadingMedicos] = useState(true);
  const [loadingAgendamento, setLoadingAgendamento] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPagina, setLoadingPagina] = useState(true); // Estado de carregamento geral

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Timeout de 3 segundos para o efeito de carregamento geral
    const timeout = setTimeout(() => {
      setLoadingPagina(false);
    }, 3000); // Defina o tempo que deseja para o efeito de carregamento

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchMedicos = async () => {
      setLoadingMedicos(true);
      try {
        const response = await fetch("http://localhost:3001/api/medicos");
        const data = await response.json();
        setMedicos(data);
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
      } finally {
        setLoadingMedicos(false);
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
            data: novaData.toISOString().split("T")[0],
            horario: `${h.toString().padStart(2, "0")}:00`,
          });
        }
      }

      setSugestoes(novasSugestoes);
    };

    gerarSugestoes();
  }, []);

  const validarCPF = (cpf) => {
    const regex = /^\d{11}$/;
    return regex.test(cpf);
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
  };

  const handleAgendarConsulta = async () => {
    setError(null);

    if (
      !nomePaciente ||
      !cpfPaciente ||
      !dataConsulta ||
      !horarioConsulta ||
      !especialidade
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!validarCPF(cpfPaciente)) {
      alert("CPF inválido. Por favor, insira um CPF com 11 dígitos.");
      return;
    }

    setLoadingAgendamento(true);
    try {
      const responseAgendamento = await fetch(
        "http://localhost:3001/api/agendamentos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cpf: cpfPaciente,
            medicoId: especialidade,
            data: dataConsulta,
            horario: horarioConsulta,
            status: "Confirmado",
          }),
        }
      );

      if (!responseAgendamento.ok) {
        const responseError = await responseAgendamento.json();
        throw new Error(responseError.message || "Erro ao agendar consulta");
      }

      alert("Consulta agendada com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      alert(error.message || "Erro ao agendar consulta. Tente novamente.");
    } finally {
      setLoadingAgendamento(false);
    }
  };

  const handleCpfChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Permite apenas números
    if (value.length <= 11) {
      setCpfPaciente(value);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-300 to-gray-300 p-8 relative"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navbar permanece acima */}
      <Navbar />
      <h1
        className="text-4xl font-bold text-white mb-8"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Agendar Consulta
      </h1>

      <div className="flex flex-col text-black font-bold space-y-4 w-full max-w-md">
        <label>
          SEU NOME:
          <input
            type="text"
            value={nomePaciente}
            onChange={(e) => setNomePaciente(e.target.value)}
            className="w-full p-2 mt-1 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </label>

        <label>
          SEU CPF:
          <input
            type="text"
            value={cpfPaciente}
            onChange={handleCpfChange} // Usando a nova função de mudança
            maxLength={11} // Limita a 11 dígitos
            className="w-full p-2 mt-1 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </label>

        <label>
          MÉDICO:
          {loadingMedicos ? (
            <div className="flex justify-center items-center">
              <ClipLoader size={20} color="#039b17" />
            </div>
          ) : (
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
          )}
        </label>

        <label>
          DATA E HORÁRIO:
          <select
            onChange={(e) => {
              const [data, horario] = e.target.value.split(" - ");
              setDataConsulta(data);
              setHorarioConsulta(horario);
            }}
            value={dataConsulta ? `${dataConsulta} - ${horarioConsulta}` : ""}
            className="w-full p-2 mt-1 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <option value="">Selecione uma data</option>
            {sugestoes.map((sugestao) => (
              <option
                key={`${sugestao.data}-${sugestao.horario}`}
                value={`${sugestao.data} - ${sugestao.horario}`}
              >
                {formatarData(sugestao.data)} - {sugestao.horario}
              </option>
            ))}
          </select>
        </label>

        <motion.button
          onClick={handleAgendarConsulta}
          className={`w-full py-3 ${loadingAgendamento ? "bg-gray-400" : "bg-white"} text-cyan-500 font-semibold rounded-lg shadow-md hover:bg-cyan-500 hover:text-white transition duration-200`}
          whileHover={{ scale: 1.05 }}
          disabled={loadingAgendamento}
        >
          {loadingAgendamento ? <BeatLoader size={10} color="#039b17" /> : "AGENDAR CONSULTA"}
        </motion.button>
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

export default AgendarConsulta;
