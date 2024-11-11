import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import { ClipLoader, BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom"; // Importando useNavigate
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AgendarConsulta = () => {
  const [medicos, setMedicos] = useState([]);
  const [medico, setMedico] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [cpfPaciente, setCpfPaciente] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");
  const [horarioConsulta, setHorarioConsulta] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [loadingMedicos, setLoadingMedicos] = useState(true);
  const [loadingAgendamento, setLoadingAgendamento] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPagina, setLoadingPagina] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const navigate = useNavigate(); // Inicializando useNavigate

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingPagina(false);
    }, 3000);

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
    return `${String(data.getDate()).padStart(2, "0")}/${String(
      data.getMonth() + 1
    ).padStart(2, "0")}/${data.getFullYear()}`;
  };

  const handleAgendarConsulta = async () => {
    setError(null);

    if (
      !nomePaciente ||
      !cpfPaciente ||
      !dataConsulta ||
      !horarioConsulta ||
      !medico
    ) {
      toast.error("Por favor, preencha todos os campos.", {
        position: "top-right",
      });
      return;
    }

    if (!validarCPF(cpfPaciente)) {
      toast.error("CPF inválido. Por favor, insira um CPF com 11 dígitos.", {
        position: "top-right",
      });
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
          },
          body: JSON.stringify({
            nome: nomePaciente,
            cpf: cpfPaciente,
            medicoId: medico,
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

      toast.success("Consulta agendada com sucesso!", {
        position: "top-right",
      });
      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      toast.error(
        error.message || "Erro ao agendar consulta. Tente novamente.",
        {
          position: "top-right",
        }
      );
    } finally {
      setLoadingAgendamento(false);
    }
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    if (value.length <= 11) { // Limita o CPF para 11 dígitos
      // Formatar o CPF para o formato xxx.xxx.xxx-xx
      if (value.length <= 3) {
        value = value.replace(/(\d{3})(\d{0,})/, "$1.$2");
      } else if (value.length <= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{0,})/, "$1.$2.$3");
      } else if (value.length <= 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,})/, "$1.$2.$3-$4");
      } else {
        // Quando o CPF tiver 11 dígitos, aplique o formato completo
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      }
      setCpfPaciente(value);
    }
  };
  
  
  

  const fecharModal = () => {
    setModalAberto(false);
  };

  const irParaMeusAgendamentos = () => {
    navigate("/meus-agendamentos"); // Redireciona para a página de Meus Agendamentos
  };

  const marcarOutraConsulta = () => {
    fecharModal();
    setNomePaciente("");
    setCpfPaciente("");
    setDataConsulta("");
    setHorarioConsulta("");
    setMedico("");
  };

  return (
    <motion.div
      className="flex flex-col   items-center justify-center min-h-screen bg-green-800 p-8 relative"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <h1 className="text-4xl font-extrabold text-white mb-8">
        Agendar Consulta
      </h1>
      <div className="flex flex-col border-b-2 border-green-400 shadow-2xl placeholder:font-light  bg-green-700 rounded-lg  p-8  text-gray-100 font-light space-y-4 w-full max-w-md">
        <label>
          SEU NOME:
          <input
            type="text"
            value={nomePaciente}
            onChange={(e) => {
              const valor = e.target.value
                .toLowerCase()
                .split(" ")
                .map(
                  (palavra) =>
                    palavra.charAt(0).toUpperCase() + palavra.slice(1)
                )
                .join(" ");
              setNomePaciente(valor);
            }}
            className="w-full text-black p-2 mt-1  rounded-lg  focus:outline-none "
          />
        </label>

        <label>
          SEU CPF:
          <input
            type="text"
            value={cpfPaciente}
            onChange={handleCpfChange}
           className="w-full p-2 mt-1 text-black border rounded-lg border-gray-300 focus:outline-none "
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
            onChange={(e) => setMedico(e.target.value)}
            value={medico}
            className="w-full p-2 mt-1 text-black border rounded-lg border-gray-300 focus:outline-none "
          >
            <option value="">Selecione um médico</option>
            {medicos.map((medico) => (
              <option key={medico.id} value={medico.id}>
                {medico.nome} - {medico.especialidade.nome} {/* Acessa o nome da especialidade */}
              </option>
            ))}
          </select>
          )}
        </label>

        <label>
          DATA:
          <select
            onChange={(e) => setDataConsulta(e.target.value)}
            value={dataConsulta}
            className="w-full p-2 text-black mt-1 border rounded-lg border-gray-300 focus:outline-none "
          >
            <option value="">Selecione uma data</option>
            {sugestoes.map((sugestao, index) => (
              <option key={index} value={sugestao.data}>
                {formatarData(sugestao.data)}
              </option>
            ))}
          </select>
        </label>

        <label>
          HORÁRIO:
          <select
            onChange={(e) => setHorarioConsulta(e.target.value)}
            value={horarioConsulta}
            className="w-full p-2 mt-1 text-black border rounded-lg border-gray-300  "
          >
            <option value="">Selecione um horário</option>
            {sugestoes
              .filter((sugestao) => sugestao.data === dataConsulta)
              .map((sugestao, index) => (
                <option key={index} value={sugestao.horario}>
                  {sugestao.horario}
                </option>
              ))}
          </select>
        </label>
      </div>
      <div className="mt-6 flex justify-between w-full max-w-md">
        <button
          onClick={handleAgendarConsulta}
          className="w-full p-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold transition-colors"
          disabled={loadingAgendamento}
        >
          {loadingAgendamento ? (
            <BeatLoader size={8} color="#fff" />
          ) : (
            "Agendar"
          )}
        </button>
      </div>
      <ToastContainer /> 
      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-lg text-black font-bold">
              Consulta Agendada com Sucesso!
            </h2>
            <p className="mt-2 text-black">O que você gostaria de fazer agora?</p>
            <div className="flex justify-around mt-3 ">
              <button
                onClick={irParaMeusAgendamentos}
                className="bg-green-500 mr-3 text-white font-semibold py-2  px-4 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Meus Agendamentos
              </button>
              <button
                onClick={marcarOutraConsulta}
                className="bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Marcar Outra Consulta
              </button>
            </div>
            <button
              onClick={fecharModal}
              className="mt-4 text-white bg-red-600 rounded-md p-1 font-bold hover:bg-red-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
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
