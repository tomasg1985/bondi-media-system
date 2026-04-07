// ==================================================
// TOUR REMINDER - RECORDATORIO DE TOUR INCOMPLETO
// ==================================================

console.log('⏰ Cargando recordatorio de tours...');

class TourReminder {
    constructor() {
        this.reminderShown = false;
        this.init();
    }

    init() {
        // Verificar al cargar la página
        setTimeout(() => this.checkReminder(), 5000);
        
        // También verificar cuando el usuario vuelve a la página
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => this.checkReminder(), 3000);
            }
        });
    }

    checkReminder() {
        // No mostrar si ya mostramos uno
        if (this.reminderShown) return;
        
        // Verificar si hay tours disponibles
        const availableTours = window.tourManager?.getAvailableTours() || [];
        if (availableTours.length === 0) return;
        
        // Verificar última visita
        const lastVisit = localStorage.getItem('last-visit');
        const now = new Date().toISOString();
        
        if (lastVisit) {
            const daysSinceLastVisit = Math.floor((new Date() - new Date(lastVisit)) / (1000 * 60 * 60 * 24));
            
            // Si pasaron más de 2 días y hay tours disponibles
            if (daysSinceLastVisit >= 2) {
                this.showReminder(availableTours.length);
            }
        }
        
        // Actualizar última visita
        localStorage.setItem('last-visit', now);
    }

    showReminder(tourCount) {
        const reminder = document.createElement('div');
        reminder.className = 'tour-reminder';
        reminder.innerHTML = `
            <div class="tour-reminder-content">
                <h4>🎓 ¿Necesitas ayuda?</h4>
                <p>Tienes ${tourCount} tour${tourCount > 1 ? 's' : ''} disponible${tourCount > 1 ? 's' : ''} para conocer mejor el sistema.</p>
                <div class="tour-reminder-actions">
                    <button class="btn-primary btn-sm" onclick="showTourReminder()">Ver tours</button>
                    <button class="btn-secondary btn-sm" onclick="this.closest('.tour-reminder').remove()">Ahora no</button>
                    <button class="btn-secondary btn-sm" onclick="dontShowReminder()">No mostrar más</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reminder);
        this.reminderShown = true;
        
        // Auto-cerrar después de 10 segundos
        setTimeout(() => {
            if (reminder.parentNode) {
                reminder.remove();
            }
        }, 10000);
    }
}

// Funciones globales
window.showTourReminder = function() {
    document.querySelectorAll('.tour-reminder').forEach(el => el.remove());
    window.tourManager?.showTourSelector();
};

window.dontShowReminder = function() {
    localStorage.setItem('tour-reminder-disabled', 'true');
    document.querySelectorAll('.tour-reminder').forEach(el => el.remove());
    alert('✅ No volveremos a mostrarte recordatorios');
};

// Inicializar
window.tourReminder = new TourReminder();

console.log('✅ Recordatorio de tours cargado');