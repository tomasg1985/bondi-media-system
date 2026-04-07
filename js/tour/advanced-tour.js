// ==================================================
// ADVANCED TOUR - TOURS POR MÓDULO
// ==================================================

console.log('🎓 Cargando tours avanzados...');

// Registrar tours por módulo
const tours = {
    dashboard: {
        name: 'Dashboard',
        icon: '📊',
        steps: [
            { element: '.stats-grid', text: 'Las estadísticas te dan un resumen rápido de todo tu contenido: publicaciones totales, publicadas este mes, en progreso y programadas.' },
            { element: '#dashboard-chart', text: 'El gráfico de performance muestra la evolución de tu alcance y engagement semana a semana. Pasa el mouse para ver detalles.' },
            { element: '#upcoming-content', text: 'Aquí ves las próximas publicaciones que aún no tienen estado asignado. Puedes ir directamente a editarlas.' },
            { element: '#global-performance', text: 'El performance acumulado global te muestra métricas de todas tus publicaciones, sin importar el mes.' }
        ]
    },
    calendario: {
        name: 'Calendario',
        icon: '📅',
        steps: [
            { element: '.month-tabs', text: 'Cambia entre meses para ver el contenido planificado. El número indica cuántas publicaciones tienes cada mes.' },
            { element: '.calendar-grid', text: 'Cada tarjeta es una publicación. Verás fecha, título, tipo y si tiene inversión en ads.' },
            { element: '.calendar-actions', text: 'Desde aquí puedes: ver detalles, editar, agregar métricas o borrar la publicación.' },
            { element: '.calendar-metrics', text: 'Si ya agregaste métricas, verás un resumen del rendimiento de esa publicación.' }
        ]
    },
    contenido: {
        name: 'Contenido',
        icon: '📝',
        steps: [
            { element: '#content-list', text: 'Lista completa de todo tu contenido, igual que en el calendario pero sin filtro por mes.' },
            { element: '.btn-primary[onclick="openAddContentModal()"]', text: 'Crea nuevo contenido rápido con este botón.' },
            { element: '.calendar-item', text: 'Cada tarjeta tiene toda la información de tu publicación.' }
        ]
    },
    ia: {
        name: 'Inteligencia Artificial',
        icon: '🤖',
        steps: [
            { element: '[data-section="ai-assistant"]', text: 'El asistente IA te ayuda a generar copies y optimizar tu contenido basado en tus datos.' },
            { element: '[data-section="ai-benchmarking"]', text: 'Benchmarking compara tu rendimiento con la competencia y te da insights estratégicos.' },
            { element: '[data-section="ai-platform"]', text: 'El optimizador multiplataforma adapta tu contenido para Instagram, TikTok y Facebook.' },
            { element: '[data-section="ai-predictive"]', text: 'Análisis predictivo estima el rendimiento futuro de tu contenido.' },
            { element: '[data-section="ai-hooks"]', text: 'Biblioteca de hooks con generador aleatorio y analizador de efectividad.' }
        ]
    },
    equipo: {
        name: 'Equipo',
        icon: '👥',
        steps: [
            { element: '[data-section="team-dashboard"]', text: 'Dashboard de equipo con estadísticas de miembros y actividad.' },
            { element: '[data-section="team-members"]', text: 'Gestiona los miembros de tu equipo, invita nuevos y asigna roles.' },
            { element: '[data-section="team-invitations"]', text: 'Invita a nuevos miembros al equipo y gestiona invitaciones pendientes.' },
            { element: '[data-section="team-permissions"]', text: 'Define qué puede hacer cada rol en el sistema.' }
        ]
    },
    metricas: {
        name: 'Métricas',
        icon: '📊',
        steps: [
            { element: '[data-section="tracking"]', text: 'Tracking de reels con métricas detalladas y distribución por rating.' },
            { element: '[data-section="comparisons"]', text: 'Comparativas mensuales y recomendaciones personalizadas basadas en tus datos.' },
            { element: '[data-section="analysis"]', text: 'Análisis mensual detallado con top publicaciones y notas de mejora.' }
        ]
    }
};

// Registrar todos los tours
Object.entries(tours).forEach(([key, tour]) => {
    window.tourManager.registerTour(key, tour);
});

// Función global para iniciar tour específico
window.startModuleTour = function(module) {
    if (window.tourManager.tours[module]) {
        window.tourManager.startTour(module);
    } else {
        console.error(`❌ Módulo no encontrado: ${module}`);
    }
};

// Agregar botón de tours al sidebar
function addTourButtonToSidebar() {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;
    
    const tourSection = document.createElement('div');
    tourSection.className = 'nav-section';
    tourSection.style.marginTop = 'auto';
    tourSection.style.paddingTop = '20px';
    tourSection.style.borderTop = '1px solid rgba(255,255,255,0.1)';
    tourSection.innerHTML = `
        <div class="nav-section-title">AYUDA</div>
        <div class="nav-item" onclick="window.tourManager.showTourSelector()">
            <span class="nav-item-icon">🎓</span>
            <span>Tours disponibles</span>
            <span class="nav-badge" id="tours-available-badge">${window.tourManager.getAvailableTours().length}</span>
        </div>
    `;
    
    sidebar.appendChild(tourSection);
}

// Agregar después de que el sidebar esté listo
setTimeout(addTourButtonToSidebar, 3000);

console.log('✅ Tours avanzados cargados');