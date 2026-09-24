import { useQuery } from '@tanstack/react-query';

import { tarefasService } from '../api/tarefas.service';

/**
 * Chave de query central: toda invalidacao apos criar/atualizar/excluir uma
 * tarefa usa esta mesma chave (veja useMutarTarefa.ts) para que o React
 * Query saiba que precisa buscar a lista de novo.
 */
export const CHAVE_TAREFAS = ['tarefas'] as const;

export function useTarefas() {
  return useQuery({
    queryKey: CHAVE_TAREFAS,
    queryFn: tarefasService.listar,
  });
}
