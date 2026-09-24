import { QuadroKanban } from './components/QuadroKanban'

function App() {
  return (
    <main className="app">
      <header className="app-cabecalho">
        <h1>TarefaFlow</h1>
        <p>Seu quadro Kanban: A Fazer, Em Andamento e Concluido.</p>
      </header>
      <QuadroKanban />
    </main>
  )
}

export default App
