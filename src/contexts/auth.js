import { createContext, useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode'; // Alterado para jwtDecode
import { fetchApi } from '../lib/utils'; // Importando fetchApi

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Definindo o estado inicial como null

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signin = (email, senha) => {
    return fetchApi('auth/signin', 'POST', { email, senha })
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res)); // res já é JSON
        setUser(res);  // Atualiza o usuário logado
      })
      .catch((error) => {
        console.error('Erro ao fazer login:', error.message);  // Mensagem mais descritiva
      });
  };

  const signup = (nome, email, senha, cpf) => {
    return fetchApi('auth/signup', 'POST', { nome, email, senha, cpf })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao fazer cadastro');
        }
        return res.json();
      })
      .then((json) => {
        localStorage.setItem('user', JSON.stringify(json));
        setUser(json);
      })
      .catch((error) => {
        console.error(error);
        // Adicione aqui uma lógica para lidar com o erro (exibir mensagem, etc.)
      });
  };

  const signout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const fetchApiAuth = async (url, method, body = undefined) => {
    const token = user ? user.token : undefined;

    // Verifica se o token está prestes a expirar e renova se necessário
    if (token && isTokenExpiring(token)) {
      const newToken = await renewToken();
      if (newToken) {
        user.token = newToken; // Atualiza o token do usuário
        localStorage.setItem('user', JSON.stringify(user)); // Armazena o novo token no localStorage
      }
    }

    return fetchApi(url, method, body, token).then((res) => {
      if (res.status === 401) {
        signout(); // Faz logout se o token expirar ou for inválido
      }
      return res;
    });
  };

  // Função para verificar se o token está prestes a expirar
  const isTokenExpiring = (token) => {
    const decoded = jwtDecode(token); // Alterado para jwtDecode
    const currentTime = Date.now() / 1000; // Tempo atual em segundos
    return decoded.exp - currentTime < 300; // Retorna true se o token expirar em menos de 5 minutos
  };

  // Função para renovar o token
  const renewToken = async () => {
    // Aqui você deve implementar a lógica para renovar o token.
    // Exemplo de uma chamada para a rota de renovação:
    const response = await fetchApi('auth/renew', 'POST', { token: user.token });
    if (response.ok) {
      const newToken = await response.json();
      return newToken.token; // Supondo que o token renovado esteja na propriedade 'token'
    }
    return null; // Retorna null se a renovação falhar
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signup, signout, fetchApiAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
