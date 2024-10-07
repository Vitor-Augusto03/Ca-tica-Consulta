// src/page/Login.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { auth, provider } from '../firebase'; // Certifique-se de que a configuração do Firebase está correta
import { signInWithPopup } from 'firebase/auth'; // Importa a função de login do Firebase

const Login = ({ setLoading }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui você deve adicionar sua lógica de autenticação via API
      // Exemplo:
      // await login(email, senha); // Chame sua função de login
      navigate('/home');
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider); // Chama o login com Google
      const user = result.user;
      console.log('Usuário logado:', user);
      navigate('/home'); // Redireciona para a página inicial após o login
    } catch (error) {
      console.error('Erro ao logar com Google:', error);
      setError('Erro ao fazer login com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }} // Ajuste a duração se necessário
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="w-1/3">
        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Entrar
        </button>
      </form>
      <button onClick={handleGoogleLogin} className="bg-red-500 text-white p-2 w-full mt-4">
        Login com Google
      </button>
      <Link to="/cadastro" className="mt-4 text-blue-500">
        Não tem uma conta? Cadastre-se
      </Link>
    </motion.div>
  );
};

export default Login;
