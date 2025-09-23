// --- INICIALIZAÇÃO ---
// Guarda referências para os elementos HTML que vamos manipular, para não precisar buscá-los toda hora.
const chatContainer = document.getElementById('chat-container'); // A área onde as mensagens aparecem.
const chatForm = document.getElementById('chat-form'); // O formulário que contém o input e o botão.
const messageInput = document.getElementById('message-input'); // A caixa de texto onde o usuário digita.
const sendButton = document.getElementById('send-button'); // O botão de enviar.

/**
 * Função principal para adicionar uma nova mensagem (seja do usuário ou do bot) na tela.
 * @param {string} sender - Define quem enviou a mensagem. Deve ser 'user' ou 'bot'.
 * @param {string} text - O conteúdo da mensagem a ser exibida.
 * @param {boolean} isHtml - (Opcional) Se true, o 'text' será inserido como HTML. Se false (padrão), será tratado como texto puro para evitar problemas de segurança.
 */
function appendMessage(sender, text, isHtml = false) {
    // Verifica se a mensagem é do usuário para alinhar à direita.
    const isUser = sender === 'user';
    
    // Define os ícones de SVG para o bot e para o usuário.
    const botIcon = `<div class="bg-indigo-600 p-2 rounded-full flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-robot" viewBox="0 0 16 16"><path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a2.5 2.5 0 0 1-1.871-.183.25.25 0 0 0-.068.217l.92.9a2.5 2.5 0 0 1 1.871.183.25.25 0 0 0 .217-.068l.92-.9a2.5 2.5 0 0 1 1.871.183.25.25 0 0 0 .068-.217l-.92-.9a2.5 2.5 0 0 1-1.871-.183Z"/><path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/></svg></div>`;
    const userIcon = `<div class="bg-gray-600 p-2 rounded-full flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg></div>`;

    // Cria o elemento principal do balão de mensagem (a linha toda).
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', 'items-start', 'gap-3');
    // Se for o usuário, alinha o conteúdo à direita.
    if (isUser) {
        messageElement.classList.add('justify-end');
    }

    // Define o conteúdo da mensagem. Se for HTML, insere diretamente.
    // Senão, substitui os caracteres '<' e '>' para evitar que o navegador interprete tags HTML enviadas pelo usuário (Cross-Site Scripting - XSS).
    const messageContent = isHtml
        ? text
        : `<p class="text-sm">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;

    // Monta a estrutura final do HTML para a mensagem (ícone + balão).
    messageElement.innerHTML = `
        ${!isUser ? botIcon : ''}
        <div class="${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'} p-3 rounded-lg max-w-xs md:max-w-md shadow-md">
            ${messageContent}
        </div>
        ${isUser ? userIcon : ''}
    `;

    // Adiciona a mensagem completa ao container do chat.
    chatContainer.appendChild(messageElement);
    // Rola a tela para baixo automaticamente para mostrar a última mensagem.
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Função que lida com o envio do formulário. É chamada quando o usuário clica em "Enviar" ou aperta Enter.
 * @param {Event} event - O evento de submit do formulário.
 */
async function handleFormSubmit(event) {
    // Impede o comportamento padrão do formulário, que é recarregar a página.
    event.preventDefault(); 
    
    // Pega a mensagem do campo de texto e remove espaços em branco extras do início e do fim.
    const userMessage = messageInput.value.trim();
    // Se a mensagem estiver vazia, não faz nada.
    if (!userMessage) return;

    // Desabilita o campo de texto e o botão para impedir envios múltiplos enquanto espera a resposta.
    messageInput.disabled = true;
    sendButton.disabled = true;

    // Adiciona a mensagem do usuário na tela.
    appendMessage('user', userMessage, false);
    // Limpa o campo de texto.
    messageInput.value = '';

    // Cria e exibe o indicador de "digitando..." para dar feedback visual ao usuário.
    const typingIndicatorId = 'typing-indicator';
    const typingIndicatorHtml = `<div id="${typingIndicatorId}" class="flex items-center space-x-1"><div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div></div>`;
    appendMessage('bot', typingIndicatorHtml, true); // O 'true' aqui é crucial para renderizar o HTML da animação.

    // Bloco `try...catch...finally` para lidar com a comunicação com o servidor.
    try {
        // Envia a mensagem do usuário para o backend Flask (endpoint /ask).
        const response = await fetch('/ask', {
            method: 'POST', // Método da requisição.
            headers: { 'Content-Type': 'application/json' }, // Informa ao servidor que estamos enviando JSON.
            body: JSON.stringify({ message: userMessage }), // Converte o objeto JavaScript em uma string JSON.
        });

        // Se a resposta do servidor não for bem-sucedida (ex: erro 500), lança um erro.
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        // Converte a resposta JSON do servidor em um objeto JavaScript.
        const data = await response.json();
        
        // Remove o indicador de "digitando..." da tela.
        document.getElementById(typingIndicatorId).closest('.flex.items-start.gap-3').remove();
        
        // Adiciona a resposta do bot na tela.
        appendMessage('bot', data.response, false);

    } catch (error) {
        // Se ocorrer qualquer erro na comunicação (ex: servidor offline), exibe no console.
        console.error("Falha ao comunicar com o servidor:", error);
        // Remove o indicador de "digitando..." se ele ainda estiver na tela.
        document.getElementById(typingIndicatorId)?.closest('.flex.items-start.gap-3')?.remove();
        // Exibe uma mensagem de erro amigável para o usuário.
        appendMessage('bot', 'Desculpe, não consegui me conectar. Tente novamente mais tarde.', false);
    } finally {
        // Este bloco é executado SEMPRE, independentemente de ter ocorrido um erro ou não.
        // Reabilita o campo de texto e o botão para que o usuário possa enviar outra mensagem.
        messageInput.disabled = false;
        sendButton.disabled = false;
        // Coloca o foco (cursor) de volta no campo de texto para facilitar a digitação.
        messageInput.focus();
    }
}

// --- PONTO DE ENTRADA ---
// Adiciona um "ouvinte" ao formulário. Quando o evento 'submit' ocorrer, a função 'handleFormSubmit' será chamada.
chatForm.addEventListener('submit', handleFormSubmit);

