import type { AtualizarTarefaInput, NovaTarefaInput, Tarefa } from '../types/tarefa';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8001';

/**
 * Erro lancado quando o `fetch` em si falha (backend fora do ar, DNS, CORS
 * bloqueado, etc.) — diferente de um erro de validacao (422) ou "nao
 * encontrado" (404), que sao respostas HTTP validas, so que com status de
 * erro. Separar os dois tipos permite que a UI mostre mensagens diferentes:
 * "nao consegui falar com o servidor" vs. "o servidor recusou o pedido".
 */
export class ErroDeConexao extends Error {
  constructor() {
    super('Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.');
    this.name = 'ErroDeConexao';
  }
}

/** Erro para respostas HTTP de erro (4xx/5xx) que o servidor de fato respondeu. */
export class ErroDaApi extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ErroDaApi';
  }
}

async function requisitar<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch {
    // fetch rejeita a Promise (em vez de retornar uma resposta com status de
    // erro) quando a requisicao nem chega a sair — e exatamente o sinal de
    // "servidor fora do ar" que queremos capturar aqui.
    throw new ErroDeConexao();
  }

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    const mensagem = corpo?.detail ?? `Erro ${resposta.status} ao falar com a API.`;
    throw new ErroDaApi(resposta.status, mensagem);
  }

  // DELETE responde 204 sem corpo — nao ha JSON para ler.
  if (resposta.status === 204) {
    return undefined as T;
  }

  return resposta.json() as Promise<T>;
}

export const tarefasService = {
  listar: (): Promise<Tarefa[]> => requisitar<Tarefa[]>('/api/tarefas'),

  criar: (dados: NovaTarefaInput): Promise<Tarefa> =>
    requisitar<Tarefa>('/api/tarefas', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id: number, dados: AtualizarTarefaInput): Promise<Tarefa> =>
    requisitar<Tarefa>(`/api/tarefas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dados),
    }),

  excluir: (id: number): Promise<void> =>
    requisitar<void>(`/api/tarefas/${id}`, { method: 'DELETE' }),
};
