import type { StatusTarefa, Tarefa } from '../types/tarefa';
import { CartaoTarefa } from './CartaoTarefa';

const CORES_POR_STATUS: Record<StatusTarefa, string> = {
  a_fazer: 'var(--cor-a-fazer)',
  em_andamento: 'var(--cor-em-andamento)',
  concluido: 'var(--cor-concluido)',
};

interface ColunaKanbanProps {
  status: StatusTarefa;
  titulo: string;
  tarefas: Tarefa[];
  carregando: boolean;
}

export function ColunaKanban({ status, titulo, tarefas, carregando }: ColunaKanbanProps) {
  return (
    <section className="coluna-kanban" aria-label={`Coluna ${titulo}`}>
      <header className="coluna-cabecalho">
        <span className="coluna-pino" style={{ background: CORES_POR_STATUS[status] }} />
        <h2 className="coluna-titulo">{titulo}</h2>
        {!carregando && <span className="coluna-contagem">{tarefas.length}</span>}
      </header>

      {carregando ? (
        <div className="coluna-esqueleto" aria-hidden="true">
          <div className="esqueleto-cartao" />
          <div className="esqueleto-cartao" />
        </div>
      ) : tarefas.length === 0 ? (
        <p className="coluna-vazia">Nenhuma tarefa aqui ainda</p>
      ) : (
        <div className="coluna-lista">
          {tarefas.map((tarefa) => (
            <CartaoTarefa key={tarefa.id} tarefa={tarefa} />
          ))}
        </div>
      )}
    </section>
  );
}
