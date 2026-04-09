// ==================================================
// CHART UTILS - UTILIDADES PARA GRÁFICOS
// ==================================================

console.log('📊 Cargando chart-utils.js...');

// Variable global para el gráfico
window.dashboardChart = null;

// ==================================================
// FUNCIÓN PARA ACTUALIZAR TODOS LOS GRÁFICOS
// ==================================================
window.updateAllCharts = function() {
    console.log('🔄 Actualizando todos los gráficos...');
    updateDashboardChart();
};

// ==================================================
// FUNCIÓN PARA OBTENER DATOS DEL MES ACTUAL
// ==================================================
function getCurrentMonthData() {
    if (!window.appData || !window.appData.calendar) {
        console.log('⚠️ No hay datos de calendario');
        return [];
    }

    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const monthContent = window.appData.calendar.filter(c =>
        c.date && c.date.startsWith(currentMonth) && c.metrics
    );

    console.log(`📊 Datos para ${currentMonth}:`, monthContent.length);
    return monthContent;
}

// ==================================================
// FUNCIÓN PARA OBTENER DATOS DE UN MES ESPECÍFICO
// ==================================================
function getMonthData(monthKey) {
    if (!window.appData || !window.appData.calendar) return [];
    return window.appData.calendar.filter(c =>
        c.date && c.date.startsWith(monthKey) && c.metrics
    );
}

// ==================================================
// FUNCIÓN PARA OBTENER MESES CON DATOS HISTÓRICOS
// ==================================================
window.getPastMonthsWithData = function() {
    if (!window.appData || !window.appData.calendar) return [];

    const now = new Date();
    const currentMonthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    const monthsSet = new Set();
    window.appData.calendar.forEach(function(c) {
        if (c.date) {
            const mk = c.date.substring(0, 7);
            if (mk < currentMonthKey) monthsSet.add(mk);
        }
    });

    return Array.from(monthsSet).sort().reverse();
};

// ==================================================
// FUNCIÓN PARA RENDERIZAR GRÁFICO DE UN MES HISTÓRICO
// ==================================================
window.renderHistoricChart = function(monthKey, canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var parts = monthKey.split('-');
    var monthDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
    var monthLabel = monthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    monthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

    var monthContent = getMonthData(monthKey);
    var weeks = groupByWeek(monthContent);

    var weekKeys = Object.keys(weeks).sort(function(a, b) {
        return parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]);
    });

    var labels, reachData, engData;

    if (weekKeys.length === 0) {
        labels    = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        reachData = [0, 0, 0, 0];
        engData   = [0, 0, 0, 0];
    } else {
        labels    = weekKeys.map(function(k) { return k.replace('Semana', 'Sem'); });
        reachData = weekKeys.map(function(l) { return Math.round(weeks[l].reach / (weeks[l].count || 1)); });
        engData   = weekKeys.map(function(l) { return Math.round(weeks[l].engagement / (weeks[l].count || 1)); });
    }

    var existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Alcance — ' + monthLabel,
                    data: reachData,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.08)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 3
                },
                {
                    label: 'Engagement — ' + monthLabel,
                    data: engData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 10, font: { size: 11 } } },
                tooltip: { mode: 'index', intersect: false },
                title: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });
};

// ==================================================
// FUNCIÓN PARA AGRUPAR POR SEMANA
// ==================================================
function groupByWeek(monthContent) {
    const weeks = {};
    
    monthContent.forEach(content => {
        // Asegurarnos que la fecha sea válida para evitar NaN
        if (!content.date) return;
        
        const date = new Date(content.date);
        let weekNum = Math.ceil(date.getDate() / 7);
        
        // Limitar la semana a un máximo de 4 (los días finales del mes se suman a la semana 4)
        if (weekNum > 4) weekNum = 4;
        
        const weekKey = `Semana ${weekNum}`;
        
        if (!weeks[weekKey]) {
            weeks[weekKey] = { reach: 0, engagement: 0, count: 0 };
        }
        
        const ig = content.metrics?.instagram || {};
        const fb = content.metrics?.facebook || {};
        
        const reach = (ig.reach || 0) + (fb.reach || 0);
        const engagement = (ig.likes || 0) + (ig.comments || 0) + 
                          (fb.reactions || 0) + (fb.comments || 0);
        
        weeks[weekKey].reach += reach;
        weeks[weekKey].engagement += engagement;
        weeks[weekKey].count++;
    });
    
    // Rellenar exactamente 4 semanas para el historial, siempre de la 1 a la 4
    for (let i = 1; i <= 4; i++) {
        const weekKey = `Semana ${i}`;
        if (!weeks[weekKey]) {
            weeks[weekKey] = { reach: 0, engagement: 0, count: 0 };
        }
    }
    
    return weeks;
}

// ==================================================
// FUNCIÓN PARA ACTUALIZAR EL GRÁFICO DEL DASHBOARD
// ==================================================
window.updateDashboardChart = function() {
    console.log('📈 Actualizando gráfico del dashboard...');
    
    const canvas = document.getElementById('dashboard-chart');
    if (!canvas) {
        console.error('❌ Canvas dashboard-chart no encontrado');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('❌ No se pudo obtener contexto 2D');
        return;
    }

    // Obtener datos
    const monthContent = getCurrentMonthData();
    const weeks = groupByWeek(monthContent);
    
    // Preparar labels y datos
    let labels = Object.keys(weeks).sort((a, b) => {
        const numA = parseInt(a.split(' ')[1]);
        const numB = parseInt(b.split(' ')[1]);
        return numA - numB;
    });
    
    let reachData = labels.map(label => 
        Math.round(weeks[label].reach / (weeks[label].count || 1))
    );
    
    let engagementData = labels.map(label => 
        Math.round(weeks[label].engagement / (weeks[label].count || 1))
    );

    // Si no hay datos, usar datos de ejemplo
    if (labels.length === 0) {
        labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
        reachData = [1200, 1900, 1500, 2200];
        engagementData = [45, 62, 58, 78];
    }

    console.log('📊 Labels:', labels);
    console.log('📊 Reach data:', reachData);
    console.log('📊 Engagement data:', engagementData);

    // Destruir gráfico anterior si existe
    if (window.dashboardChart) {
        window.dashboardChart.destroy();
    }

    // Crear nuevo gráfico
    window.dashboardChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Alcance Promedio',
                    data: reachData,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Engagement Promedio',
                    data: engagementData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    console.log('✅ Gráfico del dashboard actualizado');
};

console.log('✅ chart-utils.js cargado');