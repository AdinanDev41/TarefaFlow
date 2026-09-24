/**
 * Tipos que espelham os schemas Pydantic do backend (ver backend/app/schemas.py).
 * Mante-los em sincronia manualmente e o preco de nao ter geracao automatica
 * de tipos a partir do OpenAPI — aceitavel para um projeto deste tamanho,
 * mas o primeiro lugar a olhar se o frontend e o backend "desalinharem".
 */

export type StatusTarefa = 'a_fazer' | 'em_andamento' | 'concluido';

export interface Tarefa {
  readonly id: number;
  readonly titulo: string;
  readonly descricao: string | null;
  readonly status: StatusTarefa;
  readonly criadoEm: string; // ISO 8601, como o Pydantic serializa datetime
  readonly atualizadoEm: string;
}

/** Corpo enviado em POST /api/tarefas — espelha TarefaCriar no backend. */
export interface NovaTarefaInput {
  titulo: string;
  descricao?: string;
}

/** Corpo enviado em PATCH /api/tarefas/{id} — espelha TarefaAtualizar. Tudo opcional. */
export interface AtualizarTarefaInput {
  titulo?: string;
  descricao?: string | null;
  status?: StatusTarefa;
}

/** As 3 colunas do quadro, na ordem em que aparecem na tela. */
export const COLUNAS: { status: StatusTarefa; titulo: string }[] = [
  { status: 'a_fazer', titulo: 'A Fazer' },
  { status: 'em_andamento', titulo: 'Em Andamento' },
  { status: 'concluido', titulo: 'Concluido' },
];
