import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tarefasService } from '../api/tarefas.service';
import type { AtualizarTarefaInput, NovaTarefaInput, Tarefa } from '../types/tarefa';
import { CHAVE_TAREFAS } from './useTarefas';

/**
 * Este arquivo e o coracao pedagogico do app: como usar `useMutation` do
 * TanStack Query para ESCREVER dados (POST/PATCH/DELETE), em contraste com
 * `useQuery`, que so LE dados.
 *
 * O padrao central e sempre o mesmo nos 3 hooks abaixo:
 *   1. `mutationFn` faz a chamada real a API.
 *   2. Ao terminar com sucesso (ou erro, dependendo do caso), invalidamos a
 *      query `['tarefas']` com `queryClient.invalidateQueries`. Isso avisa o
 *      React Query "os dados que voce tem em cache podem estar
 *      desatualizados" — ele entao refaz o `useTarefas()` automaticamente,
 *      e a lista na tela se atualiza sozinha, sem precisarmos gerenciar
 *      nenhum estado manualmente.
 */

export function useCriarTarefa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: NovaTarefaInput) => tarefasService.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAVE_TAREFAS });
    },
  });
}

interface VariaveisAtualizar {
  id: number;
  dados: AtualizarTarefaInput;
}

export function useAtualizarTarefa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }: VariaveisAtualizar) => tarefasService.atualizar(id, dados),

    /**
     * Atualizacao otimista: ao mover uma tarefa entre colunas, nao queremos
     * que o usuario espere a resposta do servidor para ver o cartao "pular"
     * de coluna — isso deixaria a interface com sensacao de lentidao. Em vez
     * disso, atualizamos o cache local IMEDIATAMENTE em `onMutate`, antes da
     * requisicao terminar, e so revertemos se o servidor responder com erro.
     */
    onMutate: async ({ id, dados }) => {
      // Cancela qualquer refetch de ['tarefas'] em andamento, para que ele
      // nao sobrescreva a atualizacao otimista que estamos prestes a fazer.
      await queryClient.cancelQueries({ queryKey: CHAVE_TAREFAS });

      // Guarda o estado atual para poder restaurar em caso de erro.
      const tarefasAnteriores = queryClient.getQueryData<Tarefa[]>(CHAVE_TAREFAS);

      queryClient.setQueryData<Tarefa[]>(CHAVE_TAREFAS, (atual) =>
        atual?.map((tarefa) => (tarefa.id === id ? { ...tarefa, ...dados } : tarefa)),
      );

      // Isso e devolvido como "contexto" e chega em `onError` como terceiro argumento.
      return { tarefasAnteriores };
    },

    onError: (_erro, _variaveis, contexto) => {
      // Algo deu errado no servidor (ex.: a tarefa foi excluida por outra
      // aba entre o clique e a resposta) — desfaz a mudanca otimista.
      if (contexto?.tarefasAnteriores) {
        queryClient.setQueryData(CHAVE_TAREFAS, contexto.tarefasAnteriores);
      }
    },

    onSettled: () => {
      // Roda tanto em sucesso quanto em erro: garante que o cache acabe
      // sempre refletindo o estado real do servidor, mesmo que a atualizacao
      // otimista e a resposta do servidor tenham divergido em algum detalhe.
      queryClient.invalidateQueries({ queryKey: CHAVE_TAREFAS });
    },
  });
}

export function useExcluirTarefa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tarefasService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAVE_TAREFAS });
    },
  });
}
