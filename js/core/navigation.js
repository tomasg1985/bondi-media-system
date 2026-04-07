// ==================================================
// NAVIGATION - CON PERSISTENCIA DE SECCIÓN
// ==================================================

console.log('🧭 Cargando navigation.js...');

// ==================================================
// GUARDAR SECCIÓN ACTUAL
// ==================================================
function saveCurrentSection(section) {
    localStorage.setItem('bondi-current-section', section);
    console.log(`💾 Sección guardada: ${section}`);
}

// ==================================================
// CARGAR ÚLTIMA SECCIÓN
// ==================================================
function loadLastSection() {
    const lastSection = localStorage.getItem('bondi-current-section');
    console.log(`📂 Última sección guardada: ${lastSection}`);
    return lastSection;
}

// ==================================================
// FUNCIÓN PRINCIPAL DE NAVEGACIÓN (MODIFICADA)
// ==================================================
window.navigateTo = function(section) {
    console.log(`🧭 Navegando a: ${section}`);
    
    // Guardar la sección actual
    saveCurrentSection(section);
    
    // Desactivar todos los nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Activar el nav item correspondiente (buscando por data-section)
    const navItem = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log(`✅ Sección ${section} activada`);
    } else {
        // Manejar secciones dinámicas como ai-copy-publisher
        if (section === 'ai-copy-publisher') {
            console.warn('⚠️ Copy por publicación está temporalmente deshabilitado hasta que el hosting esté disponible.');
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                let disabledSection = document.getElementById('ai-copy-publisher-section');
                if (!disabledSection) {
                    disabledSection = document.createElement('div');
                    disabledSection.id = 'ai-copy-publisher-section';
                    disabledSection.className = 'section active';
                    contentArea.appendChild(disabledSection);
                } else {
                    disabledSection.classList.add('active');
                }
                disabledSection.innerHTML = '<div style="padding:50px;text-align:center;max-width:600px;margin:0 auto;">'
                    + '<div style="font-size:40px;margin-bottom:14px;">🚧</div>'
                    + '<h2>Copy por publicación no disponible</h2>'
                    + '<p style="color:var(--gray-600);font-size:14px;line-height:1.6;margin-top:10px;">Esta opción está temporalmente oculta hasta que el servicio de hosting esté configurado correctamente. Volvé a intentarlo más tarde.</p>'
                    + '</div>';
            }
        } else {
            console.warn(`⚠️ Sección ${section} no encontrada`);
        }
    }
    
    // Cargar datos específicos si es necesario
    if (section === 'comparisons' && typeof loadMonthlyComparison === 'function') {
        loadMonthlyComparison();
    }
    if (section === 'analysis' && typeof loadMonthAnalysis === 'function') {
        loadMonthAnalysis('2026-03');
    }
};

// ==================================================
// RESTAURAR SECCIÓN AL CARGAR LA PÁGINA (NUEVO)
// ==================================================
function restoreLastSection() {
    console.log('🔄 Restaurando última sección...');
    
    const lastSection = loadLastSection();
    
    if (lastSection && lastSection !== 'dashboard' && lastSection !== 'ai-copy-publisher') {
        // Verificar que la sección existe
        const sectionElement = document.getElementById(lastSection);
        if (sectionElement) {
            console.log(`✅ Restaurando sección: ${lastSection}`);
            navigateTo(lastSection);
            return;
        }
    }
    
    // Si no hay sección guardada o no existe, ir a dashboard
    console.log('🏠 Cargando dashboard por defecto');
    navigateTo('dashboard');
}

// ==================================================
// INICIALIZAR NAVEGACIÓN EN ITEMS DEL SIDEBAR
// ==================================================
function initNavigation() {
    // Buscar todos los nav-items que tengan data-section
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        // Remover event listeners anteriores (para evitar duplicados)
        item.removeEventListener('click', handleNavClick);
        item.addEventListener('click', handleNavClick);
    });
    
    console.log('✅ Eventos de navegación inicializados');
}

// ==================================================
// MANEJADOR DE CLICK PARA NAVEGACIÓN
// ==================================================
function handleNavClick(event) {
    const section = event.currentTarget.dataset.section;
    if (section) {
        navigateTo(section);
    }
}

// ==================================================
// REINICIAR NAVEGACIÓN (útil después de cambios en el DOM)
// ==================================================
window.refreshNavigation = function() {
    console.log('🔄 Refrescando navegación...');
    initNavigation();
};

// ==================================================
// EXPORTAR FUNCIÓN PARA GUARDAR SECCIÓN (para usar desde otros módulos)
// ==================================================
window.saveCurrentSection = saveCurrentSection;

// ==================================================
// INICIALIZAR
// ==================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        // Restaurar sección DESPUÉS de que todo esté cargado
        setTimeout(restoreLastSection, 100);
    });
} else {
    initNavigation();
    setTimeout(restoreLastSection, 100);
}

console.log('✅ navigation.js cargado con persistencia');