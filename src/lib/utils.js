export const BACKEND_URL = 'http://localhost:3001/';

export async function fetchApi(
  url,          // string: o endpoint da API
  method,       // string: 'GET' | 'POST' | 'DELETE', etc.
  body = null,  // objeto (se houver): dados que serão enviados
  authToken = null  // string: token de autenticação (opcional)
) {
  const fullUrl = BACKEND_URL + url;

  // Definindo os headers
  const headers = {
    'Accept': 'application/json',
  };

  // Se houver um corpo, adicionar o cabeçalho 'Content-Type'
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  // Se o token estiver presente, adicionar o cabeçalho de autorização
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    // Verificar se a resposta é OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    // Tentar converter a resposta em JSON
    return await response.json();
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    throw error;  // Repassar o erro para ser tratado em outros lugares
  }
}
