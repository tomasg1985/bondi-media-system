// ==================================================
// TOUR BASE - FUNCIONALIDAD PRINCIPAL
// ==================================================

console.log('🎓 Cargando sistema de tours...');

class TourManager {
    constructor() {
        this.currentTour = null;
        this.currentStep = 0;
        this.tours = {};
        this.completedTours = JSON.parse(localStorage.getItem('completed-tours') || '[]');
        this.tourStats = JSON.parse(localStorage.getItem('tour-stats') || '{}');
    }

    registerTour(name, config) {
        this.tours[name] = config;
        console.log(`✅ Tour registrado: ${name}`);
    }

    startTour(name) {
        const tour = this.tours[name];
        if (!tour) {
            console.error(`❌ Tour no encontrado: ${name}`);
            return;
        }

        this.currentTour = name;
        this.currentStep = 0;
        
        // Crear overlay si no existe
        this.createOverlay();
        
        // Mostrar primer paso
        this.showStep();
        
        // Registrar inicio
        this.trackEvent('tour_start', name);
    }

    showStep() {
        const tour = this.tours[this.currentTour];
        const step = tour.steps[this.currentStep];
        
        // Remover highlight anterior
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });
        
        // Highlight elemento actual
        const element = document.querySelector(step.element);
        if (element) {
            element.classList.add('tour-highlight');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Crear o actualizar tarjeta de tour
        this.showTourCard(step);
        
        // Actualizar progreso
        this.updateProgress();
        
        // Registrar paso
        this.trackEvent('tour_step', this.currentTour, this.currentStep);
    }

    createOverlay() {
        if (!document.getElementById('tour-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'tour-overlay';
            overlay.className = 'tour-overlay show';
            document.body.appendChild(overlay);
        }
    }

    showTourCard(step) {
        let card = document.getElementById('tour-card');
        
        if (!card) {
            card = document.createElement('div');
            card.id = 'tour-card';
            card.className = 'tour-card';
            document.body.appendChild(card);
        }
        
        const totalSteps = this.tours[this.currentTour].steps.length;
        const progress = ((this.currentStep + 1) / totalSteps) * 100;
        
        card.innerHTML = `
            <div class="tour-header">
                <div class="tour-icon">${this.tours[this.currentTour].icon || '🎓'}</div>
                <div>
                    <div class="tour-title">${this.tours[this.currentTour].name}</div>
                    <div class="tour-subtitle">Paso ${this.currentStep + 1} de ${totalSteps}</div>
                </div>
            </div>
            
            <div class="tour-description">${step.text}</div>
            
            <div class="tour-progress-dots">
                ${Array(totalSteps).fill(0).map((_, i) => `
                    <div class="tour-dot ${i === this.currentStep ? 'active' : ''} ${i < this.currentStep ? 'completed' : ''}"></div>
                `).join('')}
            </div>
            
            <div class="tour-buttons">
                <button class="tour-skip" onclick="tourManager.skipTour()">Saltar tour</button>
                ${this.currentStep > 0 ? '<button class="tour-prev" onclick="tourManager.prevStep()">← Anterior</button>' : ''}
                <button class="tour-next" onclick="tourManager.nextStep()">
                    ${this.currentStep === totalSteps - 1 ? 'Finalizar' : 'Siguiente →'}
                </button>
            </div>
        `;
        
        card.classList.remove('hidden');
    }

    nextStep() {
        const tour = this.tours[this.currentTour];
        
        if (this.currentStep < tour.steps.length - 1) {
            this.currentStep++;
            this.showStep();
        } else {
            this.completeTour();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep();
        }
    }

    skipTour() {
        this.endTour();
        this.trackEvent('tour_skipped', this.currentTour);
    }

    completeTour() {
        if (!this.completedTours.includes(this.currentTour)) {
            this.completedTours.push(this.currentTour);
            localStorage.setItem('completed-tours', JSON.stringify(this.completedTours));
        }
        
        this.trackEvent('tour_completed', this.currentTour);
        this.endTour();
        
        // Mostrar mensaje de felicitaciones
        this.showCompletionMessage();
    }

    endTour() {
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });
        
        const card = document.getElementById('tour-card');
        if (card) card.classList.add('hidden');
        
        const overlay = document.getElementById('tour-overlay');
        if (overlay) overlay.classList.remove('show');
    }

    showCompletionMessage() {
        const msg = document.createElement('div');
        msg.className = 'tour-reminder';
        msg.style.animation = 'slideInRight 0.3s ease';
        msg.innerHTML = `
            <div class="tour-reminder-content" style="border-left-color: var(--success);">
                <h4 style="color: var(--success);">🎉 ¡Tour completado!</h4>
                <p>Ya conoces las funciones básicas del sistema. ¿Listo para empezar?</p>
                <div class="tour-reminder-actions">
                    <button class="btn-primary btn-sm" onclick="this.closest('.tour-reminder').remove()">Comenzar</button>
                </div>
            </div>
        `;
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.remove();
        }, 5000);
    }

    updateProgress() {
        // Actualizar barra de progreso si existe
        const fill = document.querySelector('.tour-progress-fill');
        const text = document.querySelector('.tour-progress-text');
        
        if (fill && text) {
            const tour = this.tours[this.currentTour];
            const progress = ((this.currentStep + 1) / tour.steps.length) * 100;
            fill.style.width = `${progress}%`;
            text.textContent = `${this.currentStep + 1}/${tour.steps.length}`;
        }
    }

    trackEvent(event, tourName, step = null) {
        const stats = this.tourStats;
        
        if (!stats[tourName]) {
            stats[tourName] = { starts: 0, steps: [], completions: 0, skips: 0 };
        }
        
        switch(event) {
            case 'tour_start':
                stats[tourName].starts++;
                break;
            case 'tour_step':
                if (!stats[tourName].steps[step]) {
                    stats[tourName].steps[step] = 0;
                }
                stats[tourName].steps[step]++;
                break;
            case 'tour_completed':
                stats[tourName].completions++;
                break;
            case 'tour_skipped':
                stats[tourName].skips++;
                break;
        }
        
        localStorage.setItem('tour-stats', JSON.stringify(stats));
    }

    isTourCompleted(tourName) {
        return this.completedTours.includes(tourName);
    }

    getAvailableTours() {
        return Object.keys(this.tours).filter(tour => !this.isTourCompleted(tour));
    }

    showTourSelector() {
        const available = this.getAvailableTours();
        
        if (available.length === 0) {
            alert('🎉 ¡Has completado todos los tours disponibles!');
            return;
        }
        
        const selector = document.createElement('div');
        selector.className = 'tour-card';
        selector.style.position = 'fixed';
        selector.style.top = '50%';
        selector.style.left = '50%';
        selector.style.transform = 'translate(-50%, -50%)';
        selector.style.zIndex = '10003';
        
        selector.innerHTML = `
            <div class="tour-header">
                <div class="tour-icon">🎓</div>
                <div>
                    <div class="tour-title">Tours disponibles</div>
                    <div class="tour-subtitle">Selecciona qué área quieres explorar</div>
                </div>
            </div>
            
            <div class="tour-selector">
                ${available.map(tourName => {
                    const tour = this.tours[tourName];
                    return `
                        <button class="tour-module-btn" onclick="tourManager.startTour('${tourName}'); this.closest('.tour-card').remove()">
                            ${tour.icon || '📌'} ${tour.name}
                        </button>
                    `;
                }).join('')}
            </div>
            
            <div class="tour-buttons">
                <button class="tour-skip" onclick="this.closest('.tour-card').remove()">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(selector);
    }
}

// Inicializar tour manager global
window.tourManager = new TourManager();

console.log('✅ Tour base cargado');