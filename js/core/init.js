// ==================================================
// INIT - VERSIÓN QUE RESPETA DATOS GUARDADOS
// ==================================================

console.log('🚀 init.js se está ejecutando...');

// ==================================================
// VARIABLES GLOBALES
// ==================================================
window.appData = {
    calendar: [],
    leads: [],
    currentMetricsId: null
};

window.notifications = [];
window.briefings = [];
window.currentMonth = '2026-03';
window.monthlyAnalysis = {};

// ==================================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// ==================================================
window.initApp = async function() {
    console.log('📦 initApp() ejecutándose...');
    
    try {
        // ==========================================
        // 0. CARGAR CUENTAS Y CLIENTES GUARDADOS
        // ==========================================
        if (typeof loadAccounts === 'function') {
            await loadAccounts();
        }

        // ==========================================
        // 1. VERIFICAR DATOS EN LOCALSTORAGE
        // ==========================================
        const storageKey = 'bondi-calendar-bondi-media';
        const savedCalendar = localStorage.getItem(storageKey);
        
        console.log('🔍 Buscando datos en localStorage...');
        console.log('📦 storageKey:', storageKey);
        console.log('💾 savedCalendar existe:', !!savedCalendar);
        
        if (savedCalendar) {
            // Si hay datos guardados, USARLOS (NO sobrescribir)
            try {
                window.appData.calendar = JSON.parse(savedCalendar);
                console.log(`✅ Datos recuperados de localStorage: ${window.appData.calendar.length} items`);
                console.log('📋 Primer item:', window.appData.calendar[0]);
                
                // Verificar si tienen métricas
                const withMetrics = window.appData.calendar.filter(c => c.metrics);
                console.log(`📊 Items con métricas: ${withMetrics.length}`);
                
            } catch (e) {
                console.error('❌ Error parseando localStorage:', e);
                // Si hay error, usar datos de respaldo
                window.appData.calendar = getBackupData();
            }
        } else {
            console.log('⚠️ No hay datos guardados, usando datos de respaldo');
            window.appData.calendar = getBackupData();
            // Guardar los datos de respaldo
            localStorage.setItem(storageKey, JSON.stringify(window.appData.calendar));
            console.log('✅ Datos de respaldo guardados');
        }

        // ==========================================
        // 2. CARGAR TODOS LOS MÓDULOS
        // ==========================================
        console.log('🔄 Cargando módulos...');
        
        // Dashboard
        if (typeof loadDashboard === 'function') {
            loadDashboard();
            console.log('✅ Dashboard cargado');
        }
        
        // Calendario
        if (typeof loadCalendar === 'function') {
            loadCalendar();
            console.log('✅ Calendario cargado');
        }
        
        // Contenido
        if (typeof loadContent === 'function') {
            loadContent();
            console.log('✅ Contenido cargado');
        }
        
        // Restaurar filtros de contenido guardados
        if (typeof restoreContentFilters === 'function') {
            restoreContentFilters();
            console.log('✅ Filtros de contenido restaurados');
        }
        
        // Tracking
        if (typeof loadTracking === 'function') {
            loadTracking();
            console.log('✅ Tracking cargado');
        }
        
        // Leads
        if (typeof loadLeads === 'function') {
            loadLeads();
            console.log('✅ Leads cargado');
        }
        
        // Próximas publicaciones
        if (typeof loadUpcoming === 'function') {
            loadUpcoming();
            console.log('✅ Próximas cargadas');
        }
        
        // Performance global
        if (typeof loadGlobalPerformance === 'function') {
            loadGlobalPerformance();
            console.log('✅ Performance global cargada');
        }
        
        // Contadores de meses
        if (typeof updateMonthCounts === 'function') {
            updateMonthCounts();
            console.log('✅ Contadores actualizados');
        }
        
        // Gráficos
        if (typeof updateAllCharts === 'function') {
            updateAllCharts();
            console.log('✅ Gráficos inicializados');
        }
        
        // Badges
        if (typeof updateSidebarBadges === 'function') {
            updateSidebarBadges();
            console.log('✅ Badges actualizados');
        }

        console.log('🎉 SISTEMA INICIADO CORRECTAMENTE');
        console.log('📊 Total contenidos:', window.appData.calendar.length);
        
        // ==========================================
        // 3. RESTAURAR LA ÚLTIMA SECCIÓN (NUEVO)
        // ==========================================
        setTimeout(() => {
            if (typeof window.restoreLastSection === 'function') {
                console.log('🔄 Restaurando última sección...');
                window.restoreLastSection();
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ Error en initApp:', error);
    }
};

// ==================================================
// DATOS DE RESPALDO (por si no hay nada en localStorage)
// ==================================================
function getBackupData() {
    // Si existe MARZO_CALENDAR, usarlo
    if (typeof MARZO_CALENDAR !== 'undefined' && MARZO_CALENDAR.length > 0) {
        console.log('📋 Usando MARZO_CALENDAR como respaldo');
        return [...MARZO_CALENDAR];
    }
    
    // Si no, crear un dato de prueba
    console.log('📋 Creando dato de prueba');
    return [
        {
            id: 1,
            date: '2026-03-02',
            time: '20:00',
            type: 'reel',
            title: 'Contenido de prueba',
            objective: 'conversion',
            notes: 'Notas de prueba',
            status: 'not-started',
            hasAds: false,
            details: {}
        }
    ];
}

// ==================================================
// FUNCIONES AUXILIARES
// ==================================================
window.updateSidebarBadges = function() {
    const contentBadge = document.getElementById('sidebar-content-count');
    if (contentBadge && window.appData?.calendar) {
        contentBadge.textContent = window.appData.calendar.length;
        console.log(`🔄 Sidebar: ${window.appData.calendar.length} contenidos`);
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
};

// ==================================================
// EJECUTAR INICIALIZACIÓN
// ==================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, ejecutando initApp...');
    window.initApp();
});

console.log('✅ init.js cargado completamente');

// Activar botón de importación cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof addImportButton === 'function') {
            addImportButton();
        }
    }, 1000);
});