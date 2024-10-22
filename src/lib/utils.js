export const BACKEND_URL = 'http://localhost:3001/';

export async function fetchApi(
  url,          // string: o endpoint da API
  method,       // string: 'GET' | 'POST' | 'DELETE', etc.
  body = null   // objeto (se houver): dados que serão enviados
) {
  const fullUrl = BACKEND_URL + url;

  // Validar método HTTP
  const validMethods = ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'];
  if (!validMethods.includes(method)) {
    throw new Error('Método HTTP inválido');
  }

  // Definindo os headers
  const headers = {
    'Content-Type': body ? 'application/json' : undefined, // Adiciona Content-Type apenas se houver body
  };

  try {
    // Configuração da requisição
    const fetchOptions = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }), // Adiciona body apenas se houver
    };

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      const errorMessage = await response.text(); // Lê a mensagem de erro do corpo da resposta
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json(); // Retorna a resposta JSON
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    throw error; // Repassar o erro para ser tratado em outros lugares
  }
}
