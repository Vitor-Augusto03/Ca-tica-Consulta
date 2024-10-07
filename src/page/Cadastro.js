// src/page/Cadastro.js
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { auth, provider } from '../firebase'; // Certifique-se de que a configuração do Firebase está correta
import { signInWithPopup } from 'firebase/auth'; // Importa a função de login do Firebase

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/cadastro', { nome, email, senha, cpf });
      alert('Cadastro realizado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar cadastro.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Chama o login com Google
      const user = result.user;
      
   
      const { displayName, email, uid } = user;
      const response = await axios.post('http://localhost:3001/api/cadastro', {
        nome: displayName, 
        email,
        senha: uid, 
        cpf: '', 
      });
      
      alert('Cadastro realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar com Google:', error);
      setError('Erro ao realizar cadastro com Google. Tente novamente.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }} 
      animate={{ opacity: 1, x: 0 }}     
      exit={{ opacity: 0, x: 100 }}      
      transition={{ duration: 0.5 }}     
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-4">Cadastro</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleCadastro} className="w-1/3 mt-10">
        <input
          type="text"
          className="border p-2 w-full mb-4"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 w-full mb-4"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Cadastrar
        </button>
      </form>
      <button onClick={handleGoogleLogin} className="bg-red-500 text-white p-2 w-full mt-4">
        Cadastrar com Google
      </button>
    </motion.div>
  );
};

export default Cadastro;
