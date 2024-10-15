import { createContext, useEffect, useState } from "react";
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
      console.log('API response:', res);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Credenciais incorretas');
        } else if (res.status === 500) {
          throw new Error('Erro no servidor, tente novamente mais tarde');
        } else {
          throw new Error('Erro ao fazer login');
        }
      }
      return res.json();
    })
    .then((json) => {
      console.log('API JSON:', json);
      localStorage.setItem('user', JSON.stringify(json));
      setUser(json);
    })
    .catch((error) => {
      console.error(error.message);  
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

  const fetchApiAuth = (url, method, body = undefined) => {
    const token = user ? user.token : undefined;
    return fetchApi(url, method, body, token).then((res) => {
      if (res.status === 401) {
        signout(); // Faz logout se o token expirar ou for inválido
      }
      return res;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signup, signout, fetchApiAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};