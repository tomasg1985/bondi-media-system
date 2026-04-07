// ==================================================
// ROLE BASED TOUR - TOURS POR ROL DE USUARIO
// ==================================================

console.log('👤 Cargando tours por rol...');

class RoleBasedTour {
    constructor() {
        this.roleTours = {
            admin: ['dashboard', 'calendario', 'contenido', 'ia', 'equipo', 'metricas'],
            editor: ['dashboard', 'calendario', 'contenido', 'ia', 'metricas'],
            viewer: ['dashboard', 'metricas']
        };
        
        this.init();
    }

    init() {
        // Esperar a que el usuario esté cargado
        setTimeout(() => this.checkUserRole(), 3000);
    }

    getUserRole() {
        // Obtener rol del usuario actual
        const currentUser = JSON.parse(localStorage.getItem('bondi-current-user') || '{}');
        return currentUser.role || 'viewer';
    }

    getRecommendedTours() {
        const role = this.getUserRole();
        return this.roleTours[role] || this.roleTours.viewer;
    }

    checkUserRole() {
        const role = this.getUserRole();
        console.log(`👤 Rol detectado: ${role}`);
        
        // Verificar si ya completó los tours recomendados
        const completed = JSON.parse(localStorage.getItem('completed-tours') || '[]');
        const recommended = this.getRecommendedTours();
        
        const pending = recommended.filter(tour => !completed.includes(tour));
        
        if (pending.length > 0 && !localStorage.getItem('role-tour-shown')) {
            this.showRoleRecommendation(pending);
            localStorage.setItem('role-tour-shown', 'true');
        }
    }

    showRoleRecommendation(pendingTours) {
        const role = this.getUserRole();
        const roleNames = {
            admin: 'Administrador',
            editor: 'Editor',
            viewer: 'Espectador'
        };
        
        const card = document.createElement('div');
        card.className = 'tour-card';
        card.style.position = 'fixed';
        card.style.top = '50%';
        card.style.left = '50%';
        card.style.transform = 'translate(-50%, -50%)';
        card.style.zIndex = '10003';
        
        card.innerHTML = `
            <div class="tour-header">
                <div class="tour-icon">👤</div>
                <div>
                    <div class="tour-title">Bienvenido, ${roleNames[role]}</div>
                    <div class="tour-subtitle">Tours recomendados para tu rol</div>
                </div>
            </div>
            
            <p style="margin-bottom: 20px; color: var(--gray-600);">
                Como ${roleNames[role]}, estos tours te ayudarán a aprovechar mejor el sistema:
            </p>
            
            <div class="tour-selector" style="margin-bottom: 20px;">
                ${pendingTours.map(tourName => {
                    const tour = window.tourManager?.tours[tourName];
                    return tour ? `
                        <button class="tour-module-btn" onclick="window.tourManager.startTour('${tourName}'); this.closest('.tour-card').remove()">
                            ${tour.icon || '📌'} ${tour.name}
                        </button>
                    ` : '';
                }).join('')}
            </div>
            
            <div class="tour-buttons">
                <button class="tour-skip" onclick="this.closest('.tour-card').remove()">Ahora no</button>
                <button class="tour-next" onclick="window.tourManager.startTour('${pendingTours[0]}'); this.closest('.tour-card').remove()">
                    Comenzar primer tour
                </button>
            </div>
        `;
        
        document.body.appendChild(card);
    }
}

// Inicializar
setTimeout(() => {
    window.roleBasedTour = new RoleBasedTour();
}, 4000);

console.log('✅ Tours por rol cargados');