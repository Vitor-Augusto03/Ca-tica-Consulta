import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Carregamento from '../page/Carregamento';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Estado de controle de carregamento
  const navegar = useNavigate();
  const { signin } = useAuth();

  // Simula um tempo de carregamento antes de exibir o login
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Tempo de carregamento de 2 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signin(email, senha); // Chama o método de autenticação
      navegar('/home'); // Redireciona para a página inicial
    } catch (err) {
      setError('Erro ao realizar login. Verifique suas credenciais.'); // Define a mensagem de erro
    }
  };

  if (isLoading) {
    return <Carregamento />; // Exibe o carregamento se isLoading for verdadeiro
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSignin}>
        <h2 className="text-2xl font-bold mb-4">Entrar</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

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
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit" // Muda o tipo do botão para "submit"
          className="bg-blue-500 text-white p-3 rounded w-full"
        >
          Entrar
        </button>
        <div className="flex justify-between items-center">
          <label>
            Não tem uma conta?
            <strong>
              <Link className="hover:text-sky-400" to="/signup">
                &nbsp; Registre-se
              </Link>
            </strong>
          </label>
        </div>
      </form>
    </div>
  );
};

export default Signin;
