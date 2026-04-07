// ==================================================
// DASHBOARD CHART - GRÁFICO PRINCIPAL
// ==================================================

console.log('📈 Cargando dashboard-chart.js...');

// Esta función es un alias para mantener compatibilidad
window.initDashboardChart = function() {
    console.log('📊 Inicializando gráfico del dashboard...');
    if (typeof updateDashboardChart === 'function') {
        updateDashboardChart();
    }
};

console.log('✅ dashboard-chart.js cargado');