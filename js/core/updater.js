// ==================================================
// UPDATER.JS - Actualización centralizada del sistema
// ==================================================

console.log('🔄 Cargando actualizador del sistema...');

// Función única para actualizar todas las vistas
window.refreshAllViews = function() {
    console.log('🔄 Actualizando todas las vistas...');
    
    // Recargar calendario
    if (typeof loadCalendar === 'function') {
        loadCalendar();
        console.log('   ✅ Calendario actualizado');
    }
    
    // Recargar lista de contenido
    if (typeof loadContent === 'function') {
        loadContent();
        console.log('   ✅ Contenido actualizado');
    }
    
    // Actualizar contadores de meses
    if (typeof updateMonthCounts === 'function') {
        updateMonthCounts();
        console.log('   ✅ Contadores de meses actualizados');
    }
    
    // Renderizar tabs de meses
    if (typeof renderMonthTabs === 'function') {
        renderMonthTabs();
        console.log('   ✅ Tabs de meses renderizados');
    }
    
    // Actualizar próximas publicaciones
    if (typeof loadUpcoming === 'function') {
        loadUpcoming();
        console.log('   ✅ Próximas publicaciones actualizadas');
    }
    
    // Actualizar dashboard si es necesario
    if (typeof updateDashboardStats === 'function') {
        updateDashboardStats();
        console.log('   ✅ Dashboard actualizado');
    }
    
    console.log('✅ Todas las vistas actualizadas');
};

// Forzar actualización después de un delay (para asegurar que los datos se guardaron)
window.refreshAfterDelay = function(delay = 100) {
    setTimeout(() => {
        refreshAllViews();
    }, delay);
};

console.log('✅ Actualizador listo');