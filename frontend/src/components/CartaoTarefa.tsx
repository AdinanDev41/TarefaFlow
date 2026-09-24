import type { CSSProperties } from 'react';

import { useAtualizarTarefa, useExcluirTarefa } from '../hooks/useMutarTarefa';
import { COLUNAS, type StatusTarefa, type Tarefa } from '../types/tarefa';

const CORES_POR_STATUS: Record<StatusTarefa, string> = {
  a_fazer: 'var(--cor-a-fazer)',
  em_andamento: 'var(--cor-em-andamento)',
  concluido: 'var(--cor-concluido)',
};

interface CartaoTarefaProps {
  tarefa: Tarefa;
}

/**
 * Uma leve rotacao, deterministica a partir do id da tarefa, e o que da ao
 * quadro a sensacao de fichas presas a mao em um quadro fisico, em vez de
 * elementos alinhados por um grid perfeito.
 */
function rotacaoParaCartao(id: number): number {
  const sequencia = [-1.4, 1.1, -0.6, 1.6, -1.1, 0.7];
  return sequencia[id % sequencia.length];
}

export function CartaoTarefa({ tarefa }: CartaoTarefaProps) {
  const atualizarTarefa = useAtualizarTarefa();
  const excluirTarefa = useExcluirTarefa();

  const estaProcessando = atualizarTarefa.isPending || excluirTarefa.isPending;

  function moverParaStatus(novoStatus: StatusTarefa) {
    if (novoStatus === tarefa.status) return;
    atualizarTarefa.mutate({ id: tarefa.id, dados: { status: novoStatus } });
  }

  function excluir() {
    excluirTarefa.mutate(tarefa.id);
  }

  const estilo: CSSProperties = {
    transform: `rotate(${rotacaoParaCartao(tarefa.id)}deg)`,
  };

  return (
    <article
      className={`cartao-tarefa${excluirTarefa.isPending ? ' cartao-pendente' : ''}`}
      style={estilo}
    >
      <span className="cartao-pino" style={{ background: CORES_POR_STATUS[tarefa.status] }} />
      <h3 className="cartao-titulo">{tarefa.titulo}</h3>
      {tarefa.descricao && <p className="cartao-descricao">{tarefa.descricao}</p>}
      <div className="cartao-rodape">
        <select
          className="cartao-select"
          value={tarefa.status}
          disabled={estaProcessando}
          onChange={(evento) => moverParaStatus(evento.target.value as StatusTarefa)}
          aria-label={`Mover "${tarefa.titulo}" para outra coluna`}
        >
          {COLUNAS.map((coluna) => (
            <option key={coluna.status} value={coluna.status}>
              {coluna.titulo}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="cartao-excluir"
          onClick={excluir}
          disabled={estaProcessando}
          aria-label={`Excluir "${tarefa.titulo}"`}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
