import { QueryClient } from '@tanstack/react-query';

/**
 * Instancia unica do QueryClient para o app inteiro. E ele quem guarda o
 * cache de todas as queries (ex.: a lista de tarefas sob a chave ['tarefas'])
 * e coordena refetches, invalidacoes e o estado de loading/erro.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Evita refetch automatico so por trocar de aba do navegador — comum
      // em apps de producao, mas so gera ruido em um app didatico pequeno.
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
