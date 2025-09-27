// Componente principal da aplicação React
// Este componente exibe uma tela inicial simples
// Pode ser expandido para incluir rotas, contexto, etc.

function App() {
  // Renderiza o conteúdo principal da página
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Mensagem inicial para o usuário */}
      <p>Start prompting (or editing) to see magic happen :)</p>
    </div>
  );
}

// Exporta o componente para ser usado em main.tsx
export default App;
