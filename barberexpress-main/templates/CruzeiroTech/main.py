import os
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# --- PARTE 1: LÓGICA DO CHATBOT (Classe Chatbot) ---

class Chatbot:
    """
    Encapsula toda a lógica de configuração e comunicação com a API do Gemini.
    """
    def __init__(self):
        """
        Configura a API e inicializa o modelo de chat.
        """
        self.configure_api()
        self.model = self.initialize_model()
        self.chat = self.model.start_chat(history=[])

    def configure_api(self):
        """
        Configura a chave de API a partir de variáveis de ambiente.
        """
        try:
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("A variável de ambiente GOOGLE_API_KEY não foi configurada.")
            genai.configure(api_key=api_key)
        except ValueError as e:
            print(f"ERRO CRÍTICO: {e}")
            exit()

    def initialize_model(self):
        """
        Define as configurações e inicializa o modelo generativo.
        """
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
        }
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            # Adicione outras configurações de segurança se necessário
        ]
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        return model

    def get_response(self, user_message: str) -> str:
        """
        Envia a mensagem do usuário para o chat e retorna a resposta do modelo.
        """
        if not user_message.strip():
            return "Por favor, digite uma mensagem."

        try:
            # O histórico é mantido dentro do objeto `self.chat`
            response = self.chat.send_message(user_message)
            return response.text
        except Exception as e:
            print(f"Ocorreu um erro na API: {e}")
            return f"Desculpe, ocorreu um erro ao processar sua mensagem: {e}"

# --- PARTE 2: APLICAÇÃO FLASK ---

# Cria a instância da aplicação Flask
# O diretório 'templates' será usado para renderizar os arquivos HTML
app = Flask(__name__, template_folder='templates')

# Instancia o chatbot. Para uma aplicação simples, uma instância global é suficiente.
chatbot = Chatbot()

@app.route("/")
def home():
    """
    Renderiza a página principal do chat (index.html).
    """
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    """
    Endpoint da API para receber a mensagem do usuário e retornar a resposta do bot.
    """
    # Pega a mensagem do corpo da requisição JSON
    data = request.get_json()
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem fornecida."}), 400

    # Obtém a resposta do chatbot
    bot_response = chatbot.get_response(user_message)
    
    # Retorna a resposta como JSON
    return jsonify({"response": bot_response})

# --- PARTE 3: PONTO DE ENTRADA DA APLICAÇÃO ---

if __name__ == "__main__":
    # Inicia o servidor Flask em modo de depuração
    app.run(debug=True, port=5000)
