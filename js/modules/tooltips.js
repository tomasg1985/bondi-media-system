// ==================================================
// TOOLTIPS.JS - Sistema de tooltips configurable por secciones
// ==================================================

console.log('💬 Cargando sistema de tooltips...');

// Configuración por defecto
const DEFAULT_TOOLTIP_CONFIG = {
    global: true,           // Tooltips globales activados
    topbar: true,          // Tooltips en barra superior
    calendar: true,        // Tooltips en calendario
    content: true,         // Tooltips en contenido
    metrics: true,         // Tooltips en métricas
    dashboard: true,       // Tooltips en dashboard
    config: true,          // Tooltips en configuración
    help: true             // Tooltips de ayuda específica
};

// Cargar configuración guardada
let tooltipConfig = { ...DEFAULT_TOOLTIP_CONFIG };

function loadTooltipConfig() {
    const saved = localStorage.getItem('bondi-tooltip-config');
    if (saved) {
        try {
            tooltipConfig = JSON.parse(saved);
            console.log('📋 Configuración de tooltips cargada:', tooltipConfig);
        } catch (e) {
            console.error('Error cargando configuración:', e);
        }
    } else {
        // Guardar configuración por defecto
        saveTooltipConfig();
    }
}

function saveTooltipConfig() {
    localStorage.setItem('bondi-tooltip-config', JSON.stringify(tooltipConfig));
    console.log('💾 Configuración de tooltips guardada');
}

// Verificar si una sección específica tiene tooltips activados
function areTooltipsEnabled(section = 'global') {
    if (!tooltipConfig.global) return false; // Si global está apagado, todo apagado
    return tooltipConfig[section] !== false; // Por defecto true si no está especificado
}

// Mostrar tooltip solo si la sección está activada
window.showTooltip = function(element, message, section = 'global', position = 'top') {
    if (!areTooltipsEnabled(section)) return;
    
    // Eliminar tooltips existentes
    hideAllTooltips();
    
    // Crear tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'var(--gray-800)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '6px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '10000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    tooltip.style.maxWidth = '250px';
    tooltip.style.whiteSpace = 'normal';
    tooltip.style.wordWrap = 'break-word';
    tooltip.style.lineHeight = '1.4';
    
    // Posicionar
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    switch(position) {
        case 'top':
            tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2 + scrollLeft) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 8 + scrollTop) + 'px';
            break;
        case 'bottom':
            tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2 + scrollLeft) + 'px';
            tooltip.style.top = (rect.bottom + 8 + scrollTop) + 'px';
            break;
        case 'left':
            tooltip.style.left = (rect.left - tooltip.offsetWidth - 8 + scrollLeft) + 'px';
            tooltip.style.top = (rect.top + rect.height/2 - tooltip.offsetHeight/2 + scrollTop) + 'px';
            break;
        case 'right':
            tooltip.style.left = (rect.right + 8 + scrollLeft) + 'px';
            tooltip.style.top = (rect.top + rect.height/2 - tooltip.offsetHeight/2 + scrollTop) + 'px';
            break;
    }
    
    document.body.appendChild(tooltip);
    
    // Auto-eliminar después de 2 segundos
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.remove();
        }
    }, 2000);
};

// Ocultar todos los tooltips
function hideAllTooltips() {
    document.querySelectorAll('.custom-tooltip').forEach(t => t.remove());
}

// Función para actualizar configuración desde el panel
window.updateTooltipConfig = function(section, enabled) {
    if (section === 'global') {
        tooltipConfig.global = enabled;
    } else {
        tooltipConfig[section] = enabled;
    }
    saveTooltipConfig();
    
    // Actualizar checkboxes en el panel si existe
    updateConfigCheckboxes();
    
    // Mostrar notificación
    if (typeof showInfo === 'function') {
        showInfo(
            `Tooltips ${enabled ? 'activados' : 'desactivados'} para ${section}`,
            '⚙️ Configuración actualizada'
        );
    }
};

// Actualizar checkboxes en el panel de configuración
function updateConfigCheckboxes() {
    const checkboxes = {
        'global': document.getElementById('tooltip-global'),
        'topbar': document.getElementById('tooltip-topbar'),
        'calendar': document.getElementById('tooltip-calendar'),
        'content': document.getElementById('tooltip-content'),
        'metrics': document.getElementById('tooltip-metrics'),
        'dashboard': document.getElementById('tooltip-dashboard'),
        'config': document.getElementById('tooltip-config'),
        'help': document.getElementById('tooltip-help')
    };
    
    for (let [section, checkbox] of Object.entries(checkboxes)) {
        if (checkbox) {
            checkbox.checked = tooltipConfig[section] !== false;
            checkbox.disabled = section !== 'global' && !tooltipConfig.global;
        }
    }
}

// Inicializar tooltips en elementos con data-tooltip
function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        const section = element.dataset.tooltipSection || 'global';
        
        element.addEventListener('mouseenter', (e) => {
            if (areTooltipsEnabled(section)) {
                const message = e.target.dataset.tooltip;
                const position = e.target.dataset.tooltipPosition || 'top';
                window.showTooltip(e.target, message, section, position);
            }
        });
        
        element.addEventListener('mouseleave', hideAllTooltips);
    });
}

// Cargar configuración al inicio
loadTooltipConfig();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
    
    // Agregar estilos si no existen
    if (!document.getElementById('tooltip-styles')) {
        const style = document.createElement('style');
        style.id = 'tooltip-styles';
        style.textContent = `
            [data-tooltip] {
                position: relative;
                cursor: help;
            }
            
            .custom-tooltip {
                animation: tooltipFade 0.2s ease;
                pointer-events: none;
                font-weight: normal;
                z-index: 10000;
            }
            
            @keyframes tooltipFade {
                from {
                    opacity: 0;
                    transform: translateY(5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Panel de configuración de tooltips */
            .tooltip-config-section {
                background: var(--gray-50);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
            }
            
            .tooltip-config-section h4 {
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--gray-700);
            }
            
            .tooltip-config-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 12px;
            }
            
            .tooltip-config-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px;
                background: white;
                border-radius: 8px;
                border: 1px solid var(--gray-200);
            }
            
            .tooltip-config-item input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: var(--sky-blue);
            }
            
            .tooltip-config-item label {
                flex: 1;
                font-size: 13px;
                font-weight: 500;
                color: var(--gray-700);
                cursor: pointer;
            }
            
            .tooltip-config-item.disabled {
                opacity: 0.5;
                background: var(--gray-100);
            }
            
            body.dark-theme .tooltip-config-section {
                background: var(--gray-800);
            }
            
            body.dark-theme .tooltip-config-item {
                background: var(--gray-700);
                border-color: var(--gray-600);
            }
            
            body.dark-theme .tooltip-config-item label {
                color: var(--gray-200);
            }
        `;
        document.head.appendChild(style);
    }
});

console.log('✅ Sistema de tooltips configurable listo');