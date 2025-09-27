// Aplicação principal do Barber Express
// Gerencia autenticação, agendamento, navegação e carregamento de dados
class BarberExpressApp {
    // Construtor: inicializa sistemas de autenticação e agendamento
    constructor() {
        this.authSystem = new AuthSystem(); // Sistema de login/cadastro
        this.bookingSystem = new BookingSystem(this.authSystem); // Sistema de agendamento
        this.init(); // Inicializa eventos e conteúdo
    }

    // Inicializa eventos e carrega conteúdo
    init() {
        this.bindEvents(); // Liga eventos de navegação e botões
        this.loadContent(); // Carrega serviços e barbeiros
        this.setupSmoothScrolling(); // Ativa navegação suave
    }

    // Liga eventos de navegação, menu e cards
    bindEvents() {
        // Eventos de navegação (links do menu)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target); // Navega para seção
            });
        });

        // Evento do menu hambúrguer (mobile)
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Clique em cards de serviço abre modal de agendamento
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-card')) {
                this.bookingSystem.openBookingModal();
            }
        });

        // Clique em cards de barbeiro abre modal de agendamento
        document.addEventListener('click', (e) => {
            if (e.target.closest('.barber-card')) {
                this.bookingSystem.openBookingModal();
            }
        });
    }

    // Navegação entre seções da página
    handleNavigation(link) {
        // Atualiza link ativo
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Scroll suave até a seção
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Atualiza link ativo conforme o scroll
    setupSmoothScrolling() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const updateActiveLink = () => {
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos <= bottom) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        };

        window.addEventListener('scroll', updateActiveLink);
    }

    // Carrega dados de serviços e barbeiros
    loadContent() {
        this.loadServices();
        this.loadBarbers();
    }

    // Renderiza os serviços na tela
    loadServices() {
        const services = getServices();
        const container = document.getElementById('servicesGrid');

        container.innerHTML = services.map(service => `
            <div class="service-card" data-service-id="${service.id}">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-price">${formatCurrency(service.price)}</div>
                <div class="service-duration">${formatDuration(service.duration)}</div>
            </div>
        `).join('');
    }
    
    loadBarbers() {
        const barbers = getBarbers();
        const container = document.getElementById('barbersGrid');
        
        container.innerHTML = barbers.map(barber => `
            <div class="barber-card" data-barber-id="${barber.id}">
                <img src="${barber.image}" alt="${barber.name}" class="barber-image">
                <div class="barber-info">
                    <h3 class="barber-name">${barber.name}</h3>
                    <p class="barber-specialty">${barber.specialty}</p>
                    <div class="barber-rating">
                        <span>⭐ ${barber.rating}</span>
                        <span>•</span>
                        <span>${barber.experience}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
    window.bookingSystem = new BookingSystem(window.authSystem);
    window.app = new BarberExpressApp();
});

// Add mobile navigation styles
const mobileNavStyle = document.createElement('style');
mobileNavStyle.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--primary-900);
            flex-direction: column;
            padding: var(--space-4);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
            display: flex;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(mobileNavStyle);