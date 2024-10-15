import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Importa o hook useAuth

const Signup = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailConf, setEmailConf] = useState(""); // Para confirmação de e-mail
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar se está cadastrando

  const navegar = useNavigate();
  const { signup } = useAuth();

  const validateCPF = (cpf) => {
    return /^\d{11}$/.test(cpf);
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    if (!nome || !email || !emailConf || !senha || !cpf) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    if (email !== emailConf) {
      setError("Os e-mails não são iguais");
      return;
    }

    if (!validateCPF(cpf)) {
      setError("CPF deve conter 11 dígitos.");
      return;
    }

    setIsSubmitting(true); // Ativa o estado de envio (cadastrando)

    try {
      await signup(nome, email, senha, cpf);
      alert("Usuário cadastrado com sucesso!");
      navegar("/");
    } catch (err) {
      setError(<p className="msg-error">Erro ao cadastrar usuário</p>);
    } finally {
      setIsSubmitting(false); // Desativa o estado de envio
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }} // Começa fora da tela à esquerda
      animate={{ opacity: 1, x: 0 }} // Anima para o centro da tela
      exit={{ opacity: 0, x: 50 }} // Sai para a direita
      transition={{ duration: 0.5 }} // Duração da transição
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Confirmação de Email"
            value={emailConf}
            onChange={(e) => setEmailConf(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="CPF (apenas números)"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white p-3 rounded w-full transition duration-200`}
          disabled={isSubmitting} 
        >
          {isSubmitting ? (
            <span className="animate-pulse opacity-75 ">Cadastrando...</span>
          ) : (
            "Cadastrar"
          )}
        </button>

        <label className="mt-5">
          Já tem uma conta?
          <strong>
            <Link className="hover:text-sky-400" to="/">
              &nbsp;Entre
            </Link>
          </strong>
        </label>
      </form>
    </motion.div>
  );
};

export default Signup;
