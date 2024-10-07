import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const API_URL = 'http://localhost:3001/api'; 


export const login = async (email, senha) => {
  const response = await axios.post(`${API_URL}/login`, { email, senha });
  return response.data;
};


export const cadastro = async (nome, email, senha, cpf) => {
  const response = await axios.post(`${API_URL}/cadastro`, { nome, email, senha, cpf });
  return response.data;
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Usuário logado:', user);
    return user;
  } catch (error) {
    console.error('Erro ao fazer login com o Google:', error);
    throw error;
  }
};