// Sistema de autenticação principal do sistema Barber Express
// Gerencia login, cadastro, logout, UI e eventos do usuário
class AuthSystem {
    // Construtor: carrega usuário salvo e inicializa eventos/UI
    constructor() {
        this.currentUser = this.loadUser(); // Usuário atual, se existir
        this.init(); // Inicializa eventos e interface
    }
    
    // Inicializa eventos e atualiza interface
    init() {
        this.bindEvents(); // Liga eventos dos botões/modais
        this.updateUI(); // Atualiza UI conforme login
    }
    
    // Liga todos os eventos dos botões e formulários
    bindEvents() {
        // Eventos dos botões de abrir modais
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.openModal('loginModal'); // Abre modal de login
        });
        
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.openModal('registerModal'); // Abre modal de cadastro
        });
        
        // Eventos para fechar modais
        document.getElementById('loginClose').addEventListener('click', () => {
            this.closeModal('loginModal');
        });
        
        document.getElementById('registerClose').addEventListener('click', () => {
            this.closeModal('registerModal');
        });
        
        // Troca entre login e cadastro
        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('loginModal');
            this.openModal('registerModal');
        });
        
        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('registerModal');
            this.openModal('loginModal');
        });
        
        // Submissão dos formulários de login e cadastro
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e); // Processa login
        });
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e); // Processa cadastro
        });
        
        // Fecha modal ao clicar fora dele
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }
    
    // Abre um modal pelo ID
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active'); // Mostra modal
        document.body.style.overflow = 'hidden'; // Impede scroll
    }
    
    // Fecha um modal pelo ID
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active'); // Esconde modal
        document.body.style.overflow = 'auto'; // Libera scroll
    }
    
    // Processa o login do usuário
    handleLogin(e) {
        const formData = new FormData(e.target);
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simulação de login (poderia ser integrado com backend)
        if (email && password) {
            const user = {
                id: Date.now(), // Gera ID fake
                name: 'Usuário Teste',
                email: email,
                phone: '(11) 99999-9999'
            };
            
            this.saveUser(user); // Salva no localStorage
            this.currentUser = user;
            this.closeModal('loginModal');
            this.updateUI();
            this.showMessage('Login realizado com sucesso!', 'success');
        }
    }
    
    // Processa o cadastro de novo usuário
    handleRegister(e) {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        // Verifica se as senhas coincidem
        if (password !== confirmPassword) {
            this.showMessage('As senhas não coincidem!', 'error');
            return;
        }
        
        // Simulação de cadastro
        if (name && email && phone && password) {
            const user = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone
            };
            
            this.saveUser(user); // Salva no localStorage
            this.currentUser = user;
            this.closeModal('registerModal');
            this.updateUI();
            this.showMessage('Conta criada com sucesso!', 'success');
        }
    }
    
    // Faz logout do usuário
    logout() {
        localStorage.removeItem('barberExpressUser'); // Remove do localStorage
        this.currentUser = null;
        this.updateUI();
        this.showMessage('Logout realizado com sucesso!', 'success');
        window.location.hash = '#home'; // Redireciona para home
    }

    
    // Salva usuário no localStorage
    saveUser(user) {
        localStorage.setItem('barberExpressUser', JSON.stringify(user));
    }
    
    // Carrega usuário do localStorage
    loadUser() {
        const userData = localStorage.getItem('barberExpressUser');
        return userData ? JSON.parse(userData) : null;
    }
    
    // Atualiza a interface de autenticação conforme o estado do usuário
    updateUI() {
        const navAuth = document.querySelector('.nav-auth');
        
        if (this.currentUser) {
            // Usuário logado: mostra saudação e botões de dashboard/logout
            navAuth.innerHTML = `
                <span class="user-greeting">Olá, ${this.currentUser.name.split(' ')[0]}</span>
                <button class="btn-secondary" id="dashboardBtn">Minha Agenda</button>
                <button class="btn-secondary" id="logoutBtn">Sair</button>`
                window.location.hash = '#home';
                ;
            
            // Liga eventos dos botões
            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.logout();
            });
            
            document.getElementById('dashboardBtn').addEventListener('click', () => {
                this.showDashboard();
            });
        } else {
            // Usuário não logado: mostra botões de login/cadastro
            navAuth.innerHTML = `
                <button class="btn-secondary" id="loginBtn">Entrar</button>
                <button class="btn-primary" id="registerBtn">Cadastrar</button>
            `;
            
            // Liga eventos dos botões
            document.getElementById('loginBtn').addEventListener('click', () => {
                this.openModal('loginModal');
            });
            
            document.getElementById('registerBtn').addEventListener('click', () => {
                this.openModal('registerModal');
            });

            // Botão para abrir chatbot externo (feito em Python)
            document.getElementById('botao-externo').addEventListener('click', () => {
                this.openModal('botao-externo');
                // window.location.href = 'http://127.0.0.1:5000/', '_blank';

                window.open('http://127.0.0.1:5000/', '_blank'); // método correto para abrir em uma aba nova
            });
        }
    }

    
    // Mostra o dashboard do usuário logado
    showDashboard() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="dashboard">
                <div class="container">
                    <div class="dashboard-header">
                        <h1 class="dashboard-title">Minha Agenda</h1>
                        <p class="dashboard-subtitle">Gerencie seus agendamentos</p>
                    </div>
                    
                    <div class="dashboard-content">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Próximos Agendamentos</h3>
                                <button class="btn-primary" id="newBookingBtn">Novo Agendamento</button>
                            </div>
                            <div id="upcomingAppointments">
                                <div class="appointment-card">
                                    <div class="appointment-date">25 de Janeiro, 2025 - 14:30</div>
                                    <div class="appointment-details">
                                        <strong>Corte + Barba</strong><br>
                                        Barbeiro: Carlos Silva<br>
                                        Valor: R$ 55,00
                                    </div>
                                </div>
                                <div class="appointment-card">
                                    <div class="appointment-date">28 de Janeiro, 2025 - 16:00</div>
                                    <div class="appointment-details">
                                        <strong>Corte Tradicional</strong><br>
                                        Barbeiro: João Santos<br>
                                        Valor: R$ 35,00
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Histórico</h3>
                            </div>
                            <div id="appointmentHistory">
                                <div class="appointment-card" style="opacity: 0.7;">
                                    <div class="appointment-date">15 de Janeiro, 2025 - 15:00</div>
                                    <div class="appointment-details">
                                        <strong>Barba Completa</strong><br>
                                        Barbeiro: Pedro Costa<br>
                                        Status: Concluído
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Evento para novo agendamento
        document.getElementById('newBookingBtn').addEventListener('click', () => {
            window.bookingSystem.openBookingModal();
        });
        
        // Atualiza navbar para modo usuário
        document.querySelector('.navbar').classList.add('user-nav');
    }
    
    // Exibe uma mensagem temporária na tela (sucesso, erro, info)
    showMessage(message, type = 'info') {
        // Cria elemento de mensagem
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            background: ${type === 'success' ? 'var(--success-500)' : 
                       type === 'error' ? 'var(--error-500)' : 
                       'var(--primary-700)'};
        `;
        
        document.body.appendChild(messageEl);
        
        // Remove mensagem após 3 segundos
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 3000);
    }
    
    // Retorna se o usuário está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Retorna o usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Adiciona estilos para animações de mensagens e saudação do usuário
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .user-greeting {
        color: var(--primary-200);
        font-weight: 500;
        margin-right: var(--space-4);
    }
`;
document.head.appendChild(style);