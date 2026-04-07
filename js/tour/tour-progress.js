// ==================================================
// TOUR PROGRESS - BARRA DE PROGRESO
// ==================================================

console.log('📊 Cargando barra de progreso...');

class TourProgress {
    constructor() {
        this.bar = null;
        this.text = null;
        this.init();
    }

    init() {
        // Crear barra de progreso
        this.bar = document.createElement('div');
        this.bar.className = 'tour-progress-bar';
        this.bar.innerHTML = '<div class="tour-progress-fill" style="width: 0%;"></div>';
        
        this.text = document.createElement('div');
        this.text.className = 'tour-progress-text';
        this.text.textContent = '0/0';
        
        document.body.appendChild(this.bar);
        document.body.appendChild(this.text);
        
        // Ocultar inicialmente
        this.hide();
    }

    show() {
        this.bar.style.display = 'block';
        this.text.style.display = 'block';
    }

    hide() {
        this.bar.style.display = 'none';
        this.text.style.display = 'none';
    }

    update(current, total) {
        const percent = (current / total) * 100;
        this.bar.querySelector('.tour-progress-fill').style.width = `${percent}%`;
        this.text.textContent = `${current}/${total}`;
        this.show();
    }

    reset() {
        this.update(0, 0);
        this.hide();
    }
}

// Inicializar
window.tourProgress = new TourProgress();

// Escuchar eventos del tour
document.addEventListener('tour-step-changed', (e) => {
    window.tourProgress.update(e.detail.current + 1, e.detail.total);
});

document.addEventListener('tour-ended', () => {
    window.tourProgress.reset();
});

console.log('✅ Barra de progreso cargada');