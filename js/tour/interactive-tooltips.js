// ==================================================
// INTERACTIVE TOOLTIPS - TOOLTIPS CON ACCIONES
// ==================================================

console.log('💡 Cargando tooltips interactivos...');

class InteractiveTooltips {
    constructor() {
        this.tooltips = [
            {
                element: '.btn-primary[onclick="openAddContentModal()"]',
                text: '¿Quieres crear tu primer contenido?',
                action: 'openAddContentModal()',
                buttonText: '¡Crear ahora!'
            },
            {
                element: '[data-section="ai-assistant"]',
                text: 'Prueba el asistente IA para generar copies automáticos',
                action: 'window.navigateToAI("assistant")',
                buttonText: 'Probar asistente'
            },
            {
                element: '[data-section="team-members"]',
                text: 'Invita a tu equipo para colaborar',
                action: 'window.navigateToTeam("members")',
                buttonText: 'Invitar equipo'
            },
            {
                element: '#account-selector',
                text: 'Cambia entre tus clientes fácilmente',
                action: 'alert("Selecciona un cliente del menú desplegable")',
                buttonText: 'Ver cómo'
            }
        ];
        
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        setTimeout(() => this.addTooltips(), 3000);
    }

    addTooltips() {
        this.tooltips.forEach(tooltip => {
            const element = document.querySelector(tooltip.element);
            if (element && !element.dataset.tooltipAdded) {
                this.addTooltipToElement(element, tooltip);
                element.dataset.tooltipAdded = 'true';
            }
        });
    }

    addTooltipToElement(element, config) {
        // Crear contenedor del tooltip
        const container = document.createElement('div');
        container.className = 'interactive-tooltip-container';
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        
        // Reemplazar elemento por el contenedor
        element.parentNode.insertBefore(container, element);
        container.appendChild(element);
        
        // Crear badge
        const badge = document.createElement('div');
        badge.className = 'tooltip-badge';
        badge.style.backgroundColor = 'var(--coral)';
        badge.style.animation = 'pulse 2s infinite';
        container.appendChild(badge);
        
        // Crear tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'interactive-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: white;
            border-radius: 12px;
            padding: 16px;
            width: 250px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            border: 1px solid var(--gray-200);
            z-index: 1000;
            display: none;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 10px;
        `;
        
        tooltip.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px; color: var(--deep-navy);">💡 ¿Sabías que...?</div>
            <p style="font-size: 13px; color: var(--gray-700); margin-bottom: 12px;">${config.text}</p>
            <button class="btn-primary btn-sm" onclick="${config.action}" style="width: 100%;">
                ${config.buttonText}
            </button>
        `;
        
        container.appendChild(tooltip);
        
        // Eventos
        let timeout;
        
        container.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            tooltip.style.display = 'block';
        });
        
        container.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                tooltip.style.display = 'none';
            }, 300);
        });
        
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
        });
    }
}

// Inicializar
setTimeout(() => {
    window.interactiveTooltips = new InteractiveTooltips();
}, 2000);

console.log('✅ Tooltips interactivos cargados');