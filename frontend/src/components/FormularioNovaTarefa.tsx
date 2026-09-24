import { type FormEvent, useState } from 'react';

import { useCriarTarefa } from '../hooks/useMutarTarefa';
import { ErroDaApi } from '../api/tarefas.service';

const TITULO_MAX = 120;

export function FormularioNovaTarefa() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  const criarTarefa = useCriarTarefa();

  function validar(): string | null {
    const tituloLimpo = titulo.trim();
    if (tituloLimpo.length === 0) {
      return 'O titulo nao pode ficar em branco.';
    }
    if (tituloLimpo.length > TITULO_MAX) {
      return `O titulo pode ter no maximo ${TITULO_MAX} caracteres.`;
    }
    return null;
  }

  function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    setErroLocal(null);

    const erroDeValidacao = validar();
    if (erroDeValidacao) {
      setErroLocal(erroDeValidacao);
      return;
    }

    // Toda tarefa nova entra sempre na coluna "A Fazer" — o backend ja
    // aplica esse default, entao nem enviamos o campo `status` aqui.
    criarTarefa.mutate(
      { titulo: titulo.trim(), descricao: descricao.trim() || undefined },
      {
        onSuccess: () => {
          setTitulo('');
          setDescricao('');
        },
        onError: (erro) => {
          // Um 422 do backend chega aqui com a mensagem de validacao do Pydantic.
          setErroLocal(erro instanceof ErroDaApi ? erro.message : erro.message);
        },
      },
    );
  }

  return (
    <form className="formulario-nova-tarefa" onSubmit={aoEnviar}>
      <div className="formulario-campo">
        <label htmlFor="titulo-nova-tarefa">Titulo</label>
        <input
          id="titulo-nova-tarefa"
          type="text"
          value={titulo}
          maxLength={TITULO_MAX}
          placeholder="Ex.: Configurar o CORS no backend"
          onChange={(evento) => setTitulo(evento.target.value)}
          disabled={criarTarefa.isPending}
        />
      </div>

      <div className="formulario-campo">
        <label htmlFor="descricao-nova-tarefa">Descricao (opcional)</label>
        <input
          id="descricao-nova-tarefa"
          type="text"
          value={descricao}
          placeholder="Detalhes rapidos sobre a tarefa"
          onChange={(evento) => setDescricao(evento.target.value)}
          disabled={criarTarefa.isPending}
        />
      </div>

      {erroLocal && <p className="formulario-erro">{erroLocal}</p>}

      <button type="submit" className="botao-primario" disabled={criarTarefa.isPending}>
        {criarTarefa.isPending ? 'Adicionando…' : 'Adicionar'}
      </button>
    </form>
  );
}
