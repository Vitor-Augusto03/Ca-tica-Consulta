import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Carregamento from '../page/Carregamento';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controle de envio
  const navegar = useNavigate();
  const { signin } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignin = async (e) => {
    e.preventDefault();

    // Validações simples
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Expressão regular para validar o email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setError(''); // Limpa mensagens de erro anteriores
    setIsSubmitting(true); // Indica que o envio começou

    try {
      await signin(email, senha);
      navegar('/home');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Exibe mensagem de erro do servidor
      } else {
        setError('Erro ao realizar login. Verifique suas credenciais.');
      }
    } finally {
      setIsSubmitting(false); // Indica que o envio terminou
    }
  };

  if (isLoading) {
    return <Carregamento />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96">
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
          type="submit"
          onClick={handleSignin}
          className={`bg-blue-500 text-white p-3 rounded w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} // Feedback visual para o botão
          disabled={isSubmitting} // Desativa o botão durante o envio
        >
          {isSubmitting ? 'Aguarde...' : 'Entrar'} {/* Texto dinâmico */}
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
