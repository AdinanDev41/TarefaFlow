import { ErroDeConexao } from '../api/tarefas.service';
import { useTarefas } from '../hooks/useTarefas';
import { COLUNAS, type StatusTarefa, type Tarefa } from '../types/tarefa';
import { ColunaKanban } from './ColunaKanban';
import { FormularioNovaTarefa } from './FormularioNovaTarefa';

function agruparPorStatus(tarefas: Tarefa[]): Record<StatusTarefa, Tarefa[]> {
  const grupos: Record<StatusTarefa, Tarefa[]> = {
    a_fazer: [],
    em_andamento: [],
    concluido: [],
  };
  for (const tarefa of tarefas) {
    grupos[tarefa.status].push(tarefa);
  }
  return grupos;
}

export function QuadroKanban() {
  const { data: tarefas, isLoading, isError, error } = useTarefas();

  const grupos = agruparPorStatus(tarefas ?? []);
  const ehErroDeConexao = error instanceof ErroDeConexao;

  return (
    <>
      <FormularioNovaTarefa />

      {isError && (
        <div className="aviso-conexao" role="alert">
          <strong>⚠</strong>
          <span>
            {ehErroDeConexao
              ? 'Nao foi possivel conectar ao servidor. Confira se o backend esta rodando em ' +
                '"uvicorn app.main:app --reload --port 8000".'
              : error.message}
          </span>
        </div>
      )}

      <div className="quadro-kanban">
        {COLUNAS.map((coluna) => (
          <ColunaKanban
            key={coluna.status}
            status={coluna.status}
            titulo={coluna.titulo}
            tarefas={grupos[coluna.status]}
            carregando={isLoading}
          />
        ))}
      </div>
    </>
  );
}
