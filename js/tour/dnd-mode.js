// ==================================================
// DND MODE - MODO NO MOLESTAR PARA TOURS
// ==================================================

console.log('🔕 Cargando modo No Molestar...');

class DNDMode {
    constructor() {
        this.enabled = localStorage.getItem('tour-dnd') === 'true';
        this.init();
    }

    init() {
        this.addDNDButton();
        
        if (this.enabled) {
            this.enableDND();
        }
    }

    addDNDButton() {
        const button = document.createElement('button');
        button.className = 'dnd-toggle';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 80px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${this.enabled ? 'var(--gray-600)' : 'var(--primary)'};
            color: white;
            border: none;
            cursor: pointer;
            font-size: 18px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.2s;
        `;
        button.innerHTML = this.enabled ? '🔕' : '🔔';
        button.title = this.enabled ? 'Activar ayuda' : 'Modo No Molestar (ocultar ayuda)';
        
        button.onclick = () => this.toggleDND();
        
        document.body.appendChild(button);
    }

    toggleDND() {
        this.enabled = !this.enabled;
        localStorage.setItem('tour-dnd', this.enabled);
        
        const button = document.querySelector('.dnd-toggle');
        if (button) {
            button.innerHTML = this.enabled ? '🔕' : '🔔';
            button.style.background = this.enabled ? 'var(--gray-600)' : 'var(--primary)';
            button.title = this.enabled ? 'Activar ayuda' : 'Modo No Molestar (ocultar ayuda)';
        }
        
        if (this.enabled) {
            this.enableDND();
        } else {
            this.disableDND();
        }
    }

    enableDND() {
        // Ocultar tooltips y badges
        document.querySelectorAll('.tooltip-badge, .tour-highlight, .tour-card, .tour-reminder').forEach(el => {
            el.style.display = 'none';
        });
        
        // Prevenir nuevos tours
        this.preventNewTours = true;
        
        console.log('🔕 Modo No Molestar activado');
    }

    disableDND() {
        // Mostrar tooltips y badges
        document.querySelectorAll('.tooltip-badge').forEach(el => {
            el.style.display = 'block';
        });
        
        this.preventNewTours = false;
        
        console.log('🔔 Ayuda reactivada');
    }

    shouldShowTour() {
        return !this.enabled && !this.preventNewTours;
    }
}

// Inicializar
window.dndMode = new DNDMode();

// Interceptar intentos de mostrar tours
const originalShowTour = window.tourManager?.showTourSelector;
if (originalShowTour) {
    window.tourManager.showTourSelector = function() {
        if (window.dndMode.shouldShowTour()) {
            originalShowTour.call(this);
        } else {
            alert('💤 El modo No Molestar está activado. Desactívalo para ver los tours.');
        }
    };
}

console.log('✅ Modo No Molestar cargado');