// Ponto de entrada da aplicação React
// Importa StrictMode para ajudar na identificação de problemas
import { StrictMode } from 'react';
// Importa createRoot para renderizar o app na DOM
import { createRoot } from 'react-dom/client';
// Importa o componente principal da aplicação
import App from './App.tsx';
// Importa estilos globais
import './index.css';

// Renderiza o componente App dentro do elemento com id 'root'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* StrictMode ativa verificações extras no React */}
    <App />
  </StrictMode>
);
