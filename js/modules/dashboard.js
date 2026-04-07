// ==================================================
// DASHBOARD - VERSIÓN LIMPIA (SIN MÓDULOS IA)
// ==================================================

console.log('📊 Cargando dashboard...');

// ==================================================
// FUNCIÓN PRINCIPAL DEL DASHBOARD
// ==================================================
window.loadDashboard = async function() {
    console.log('📊 Actualizando dashboard...');
    
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) {
        console.error('❌ Dashboard no encontrado');
        return;
    }
    
    // Asegurarse de que los datos estén cargados
    if (!window.appData || !window.appData.calendar) {
        console.log('📊 Datos no disponibles, cargando desde localStorage...');
        const storageKey = `bondi-calendar-${window.currentAccount || 'bondi-media'}`;
        try {
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                window.appData = window.appData || {};
                window.appData.calendar = JSON.parse(savedData);
                console.log(`✅ Datos cargados: ${window.appData.calendar.length} items`);
            } else {
                // Intentar cargar datos de prueba para desarrollo
                try {
                    const response = await fetch('./test_data_current_month.json');
                    if (response.ok) {
                        const testData = await response.json();
                        window.appData = { calendar: testData };
                        console.log('🧪 Datos de prueba cargados:', testData.length, 'elementos');
                        
                        // Guardar en localStorage para persistencia
                        localStorage.setItem(storageKey, JSON.stringify(testData));
                    } else {
                        throw new Error('No test data available');
                    }
                } catch (testError) {
                    window.appData = window.appData || { calendar: [] };
                    console.log('ℹ️ No hay datos guardados ni de prueba, usando array vacío');
                }
            }
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            window.appData = window.appData || { calendar: [] };
        }
    }
    
    // Verificar si la estructura existe
    if (!document.getElementById('dashboard-stats')) {
        createDashboardStructure();
    }
    
    // Actualizar estadísticas
    updateDashboardStats();
    
    // Cargar componentes nativos del dashboard
    if (typeof loadUpcoming === 'function') {
        loadUpcoming();
    }
    
    if (typeof loadGlobalPerformance === 'function') {
        loadGlobalPerformance();
    }
    
    if (typeof updateDashboardChart === 'function') {
        updateDashboardChart();
    }
    
    console.log('✅ Dashboard actualizado');
};

// ==================================================
// CREAR ESTRUCTURA DEL DASHBOARD
// ==================================================
function createDashboardStructure() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    dashboard.innerHTML = `
        <!-- STATS GRID -->
        <div class="stats-grid" id="dashboard-stats"></div>
        
        <!-- PERFORMANCE CHART + HISTÓRICO -->
        <div class="card" style="margin-bottom: 24px;">
            <div class="card-header" style="flex-wrap: wrap; gap: 8px;">
                <h3 class="card-title" id="dashboard-chart-title">📊 Performance del Mes Actual</h3>
                <div style="display: flex; gap: 6px;" id="chart-tab-buttons">
                    <button onclick="showChartTab('current')" id="tab-btn-current"
                        style="padding: 4px 14px; border-radius: 20px; border: 1.5px solid #6366f1; background: #6366f1; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer;">
                        Mes actual
                    </button>
                    <button onclick="showChartTab('historic')" id="tab-btn-historic"
                        style="padding: 4px 14px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: transparent; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer;">
                        Histórico
                    </button>
                </div>
            </div>

            <!-- Panel: mes actual -->
            <div id="chart-panel-current" style="padding: 20px; position: relative;">
                <div class="chart-container" style="position: relative; height: 350px; width: 100%;">
                    <canvas id="dashboard-chart"></canvas>
                </div>
            </div>

            <!-- Panel: histórico -->
            <div id="chart-panel-historic" style="display: none; padding: 20px;">
                <div id="historic-months-content"></div>
            </div>
        </div>
        
        <!-- UPCOMING CARD -->
        <div class="card" id="upcoming-card">
            <div class="card-header">
                <h3 class="card-title">🚀 Próximas Publicaciones</h3>
                <button class="btn-secondary" onclick="navigateTo('calendar')">Ver Calendario</button>
            </div>
            <div id="upcoming-content"></div>
        </div>
        
        <!-- GLOBAL PERFORMANCE CARD -->
        <div class="card" id="global-card" style="margin-bottom: 24px;">
            <div class="card-header">
                <h3 class="card-title">🌎 Performance Acumulado Global</h3>
            </div>
            <div id="global-performance"></div>
        </div>

        <!-- AI EXPERTS QUICK ACCESS -->
        <div class="card" id="ai-experts-card" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0;">
            <div class="card-header">
                <h3 class="card-title">🤖 Consultar con Expertos IA</h3>
                <span class="badge badge-success">Nuevo</span>
            </div>
            <div style="padding: 20px;">
                <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;">Seleccioná un departamento especializado para optimizar tu estrategia.</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px;" id="dashboard-ai-experts">
                    <!-- Se llena dinámicamente -->
                </div>
            </div>
        </div>
    `;
    
    console.log('✅ Estructura del dashboard creada');
}

// ==================================================
// ACTUALIZAR ESTADÍSTICAS
// ==================================================
function updateDashboardStats() {
    const now = new Date();
    const currentMonthKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const currentMonthLabel = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const currentMonthLabelCap = currentMonthLabel.charAt(0).toUpperCase() + currentMonthLabel.slice(1);

    // Actualizar titulo del grafico
    const chartTitle = document.getElementById('dashboard-chart-title');
    if (chartTitle) chartTitle.textContent = '📊 Performance de ' + currentMonthLabelCap;

    const allCalendar = window.appData?.calendar || [];
    // Filtrar solo el mes actual
    const monthCalendar = allCalendar.filter(c => c.date && c.date.startsWith(currentMonthKey));
    const withMetrics = monthCalendar.filter(c => c.metrics);

    // Calcular por estado (solo mes actual)
    const totalContent = monthCalendar.length;
    const published = monthCalendar.filter(c => c.status === 'published').length;
    const inProgress = monthCalendar.filter(c => ['design', 'correction'].includes(c.status)).length;
    const scheduled = monthCalendar.filter(c => ['scheduled', 'designed'].includes(c.status)).length;

    // Calcular métricas totales (solo mes actual con metricas)
    const totalReach = withMetrics.reduce((sum, c) => {
        const ig = c.metrics?.instagram?.reach || 0;
        const fb = c.metrics?.facebook?.reach || 0;
        return sum + ig + fb;
    }, 0);

    const totalEngagement = withMetrics.reduce((sum, c) => {
        const igReach = c.metrics?.instagram?.reach || 0;
        const igEng = (c.metrics?.instagram?.likes || 0) + (c.metrics?.instagram?.comments || 0);
        const fbReach = c.metrics?.facebook?.reach || 0;
        const fbEng = (c.metrics?.facebook?.reactions || 0) + (c.metrics?.facebook?.comments || 0);

        const totalR = igReach + fbReach;
        const totalE = igEng + fbEng;

        return totalR > 0 ? (totalE / totalR * 100) : 0;
    }, 0);

    const avgEngagement = withMetrics.length > 0 ? (totalEngagement / withMetrics.length).toFixed(1) : 0;
    const totalDMs = withMetrics.reduce((sum, c) => {
        const ig = c.metrics?.instagram?.dms || 0;
        const fb = c.metrics?.facebook?.messages || 0;
        return sum + ig + fb;
    }, 0);

    const statsGrid = document.getElementById('dashboard-stats');
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Contenido Planificado</div>
                    </div>
                    <div class="stat-icon">📋</div>
                </div>
                <div class="stat-value">${totalContent}</div>
                <div class="stat-meta positive">↑ ${currentMonthLabelCap}</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Publicado Este Mes</div>
                    </div>
                    <div class="stat-icon">✅</div>
                </div>
                <div class="stat-value">${published}</div>
                <div class="stat-meta">de ${totalContent} total</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">En Progreso</div>
                    </div>
                    <div class="stat-icon">⚡</div>
                </div>
                <div class="stat-value">${inProgress}</div>
                <div class="stat-meta">trabajando</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Programado</div>
                    </div>
                    <div class="stat-icon">📅</div>
                </div>
                <div class="stat-value">${scheduled}</div>
                <div class="stat-meta positive">listo para publicar</div>
            </div>
        `;
    }

    // Actualizar elementos de performance general
    const reachEl = document.getElementById('total-reach');
    const engagementEl = document.getElementById('avg-engagement');
    const dmsEl = document.getElementById('total-dms');

    if (reachEl) reachEl.textContent = totalReach.toLocaleString();
    if (engagementEl) engagementEl.textContent = avgEngagement + '%';
    if (dmsEl) dmsEl.textContent = totalDMs;
}

// ==================================================
// TABS DEL GRÁFICO (Mes actual / Histórico)
// ==================================================
window.showChartTab = function(tab) {
    var panelCurrent  = document.getElementById('chart-panel-current');
    var panelHistoric = document.getElementById('chart-panel-historic');
    var btnCurrent    = document.getElementById('tab-btn-current');
    var btnHistoric   = document.getElementById('tab-btn-historic');
    var chartTitle    = document.getElementById('dashboard-chart-title');

    if (tab === 'current') {
        if (panelCurrent)  panelCurrent.style.display  = 'block';
        if (panelHistoric) panelHistoric.style.display = 'none';
        if (btnCurrent)  { btnCurrent.style.background = '#6366f1'; btnCurrent.style.color = '#fff'; btnCurrent.style.borderColor = '#6366f1'; }
        if (btnHistoric) { btnHistoric.style.background = 'transparent'; btnHistoric.style.color = '#64748b'; btnHistoric.style.borderColor = '#e2e8f0'; }
        var now = new Date();
        var label = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        var labelCap = label.charAt(0).toUpperCase() + label.slice(1);
        if (chartTitle) chartTitle.textContent = '📊 Performance de ' + labelCap;
    } else {
        if (panelCurrent)  panelCurrent.style.display  = 'none';
        if (panelHistoric) panelHistoric.style.display = 'block';
        if (btnHistoric) { btnHistoric.style.background = '#6366f1'; btnHistoric.style.color = '#fff'; btnHistoric.style.borderColor = '#6366f1'; }
        if (btnCurrent)  { btnCurrent.style.background = 'transparent'; btnCurrent.style.color = '#64748b'; btnCurrent.style.borderColor = '#e2e8f0'; }
        if (chartTitle) chartTitle.textContent = '📅 Histórico de Meses Anteriores';
        renderHistoricMonths();
    }
};

// ==================================================
// HISTÓRICO DE MESES ANTERIORES
// ==================================================
function renderHistoricMonths() {
    const container = document.getElementById('historic-months-content');
    if (!container) return;

    const pastMonths = typeof window.getPastMonthsWithData === 'function'
        ? window.getPastMonthsWithData()
        : [];

    if (pastMonths.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray-600);">No hay meses anteriores con métricas registradas aún.</div>';
        return;
    }

    let html = '';
    pastMonths.forEach(function(monthKey) {
        const parts = monthKey.split('-');
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
        const label = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        const labelCap = label.charAt(0).toUpperCase() + label.slice(1);

        const allCal = window.appData?.calendar || [];
        const monthItems = allCal.filter(c => c.date && c.date.startsWith(monthKey));
        const withM = monthItems.filter(c => c.metrics);
        const totalReachM = withM.reduce((s, c) => s + (c.metrics?.instagram?.reach || 0) + (c.metrics?.facebook?.reach || 0), 0);
        const publishedM = monthItems.filter(c => c.status === 'published').length;
        const totalDMsM = withM.reduce((s, c) => s + (c.metrics?.instagram?.dms || 0) + (c.metrics?.facebook?.messages || 0), 0);

        const canvasId = 'historic-chart-' + monthKey.replace('-', '_');
        html += `
            <div style="margin-bottom: 24px; border: 1px solid var(--gray-200); border-radius: 12px; overflow: hidden;">
                <div style="padding: 12px 16px; background: var(--gray-50); border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <strong style="font-size: 14px; color: var(--gray-800);">📅 ${labelCap}</strong>
                    <div style="display: flex; gap: 16px; font-size: 12px; color: var(--gray-600);">
                        <span>📋 ${monthItems.length} publicaciones</span>
                        <span>✅ ${publishedM} publicadas</span>
                        <span>👁 ${totalReachM.toLocaleString()} alcance</span>
                        <span>💬 ${totalDMsM} DMs</span>
                    </div>
                </div>
                <div style="padding: 16px; position: relative; height: 220px;">
                    <canvas id="${canvasId}"></canvas>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    setTimeout(function() {
        pastMonths.forEach(function(monthKey) {
            const canvasId = 'historic-chart-' + monthKey.replace('-', '_');
            if (typeof window.renderHistoricChart === 'function') {
                window.renderHistoricChart(monthKey, canvasId);
            }
        });
    }, 50);
}

// ==================================================
// CARGAR PRÓXIMAS PUBLICACIONES CON FILTROS
// ==================================================
window.loadUpcoming = function() {
    const container = document.getElementById('upcoming-content');
    if (!container) return;

    // Verificar si hay datos, si no, cargar datos de prueba
    if (!window.appData || !window.appData.calendar || window.appData.calendar.length === 0) {
        try {
            fetch('./test_upcoming_content.json')
                .then(response => response.ok ? response.json() : [])
                .then(testData => {
                    if (testData.length > 0) {
                        window.appData = window.appData || {};
                        window.appData.calendar = testData;
                        renderUpcomingContent(testData);
                    } else {
                        renderUpcomingContent([]);
                    }
                })
                .catch(() => renderUpcomingContent([]));
        } catch (error) {
            renderUpcomingContent([]);
        }
    } else {
        renderUpcomingContent(window.appData.calendar);
    }
};

function renderUpcomingContent(calendarData) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Filtrar contenidos futuros o de hoy sin publicar
    let upcomingItems = calendarData.filter(item => {
        if (!item.date) return false;
        const itemDate = item.date;
        const itemTime = item.time || '00:00';

        // Comparar fecha y hora
        const itemDateTime = new Date(`${itemDate}T${itemTime}`);
        const nowDateTime = new Date();

        // Incluir si es futuro o si es hoy y no está publicado
        return itemDateTime >= nowDateTime || (item.date === todayStr && item.status !== 'published');
    });

    // Ordenar por fecha y hora
    upcomingItems.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
        return dateA - dateB;
    });

    // Limitar a 10 items para no sobrecargar
    upcomingItems = upcomingItems.slice(0, 10);

    // Crear HTML con filtros
    let html = `
        <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <label style="font-size: 12px; font-weight: 600; color: var(--gray-700);">Filtrar por estado:</label>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button onclick="filterUpcomingContent('all')" id="upcoming-filter-all"
                        style="padding: 4px 12px; border-radius: 16px; border: 1px solid #e2e8f0; background: #6366f1; color: #fff; font-size: 11px; cursor: pointer;">Todos</button>
                    <button onclick="filterUpcomingContent('scheduled')" id="upcoming-filter-scheduled"
                        style="padding: 4px 12px; border-radius: 16px; border: 1px solid #e2e8f0; background: transparent; color: #64748b; font-size: 11px; cursor: pointer;">Programados</button>
                    <button onclick="filterUpcomingContent('designed')" id="upcoming-filter-designed"
                        style="padding: 4px 12px; border-radius: 16px; border: 1px solid #e2e8f0; background: transparent; color: #64748b; font-size: 11px; cursor: pointer;">Diseñados</button>
                    <button onclick="filterUpcomingContent('design')" id="upcoming-filter-design"
                        style="padding: 4px 12px; border-radius: 16px; border: 1px solid #e2e8f0; background: transparent; color: #64748b; font-size: 11px; cursor: pointer;">En Diseño</button>
                    <button onclick="filterUpcomingContent('correction')" id="upcoming-filter-correction"
                        style="padding: 4px 12px; border-radius: 16px; border: 1px solid #e2e8f0; background: transparent; color: #64748b; font-size: 11px; cursor: pointer;">Corrección</button>
                </div>
            </div>
        </div>

        <div id="upcoming-items-container">
    `;

    if (upcomingItems.length === 0) {
        html += `
            <div class="empty-state" style="padding: 32px 16px; text-align: center;">
                <div class="empty-state-icon" style="font-size: 32px; margin-bottom: 12px;">🚀</div>
                <p><strong>No hay publicaciones próximas</strong></p>
                <p style="margin-top: 8px; color: var(--gray-600); font-size: 13px;">
                    Todas las publicaciones programadas ya fueron publicadas o no hay contenido futuro.
                </p>
            </div>
        `;
    } else {
        upcomingItems.forEach(item => {
            const itemDate = new Date(item.date);
            const formattedDate = itemDate.toLocaleDateString('es-ES', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });

            const statusConfig = getStatusConfig(item.status);
            const timeDisplay = item.time ? item.time : '--:--';

            html += `
                <div class="upcoming-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--gray-200); border-radius: 8px; margin-bottom: 8px; background: #fff; transition: all 0.2s;"
                     data-status="${item.status || 'no-status'}">
                    <div style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 6px; background: ${statusConfig.bg}; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                        ${statusConfig.icon}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 600; font-size: 13px; color: var(--gray-900); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${item.title || 'Sin título'}
                        </div>
                        <div style="font-size: 11px; color: var(--gray-600);">
                            ${formattedDate} • ${timeDisplay} • ${item.platform || 'Sin plataforma'}
                        </div>
                    </div>
                    <div style="flex-shrink: 0;">
                        <span class="status-badge" style="padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; background: ${statusConfig.bg}; color: ${statusConfig.color};">
                            ${statusConfig.label}
                        </span>
                    </div>
                </div>
            `;
        });
    }

    html += `
        </div>
    `;

    const container = document.getElementById('upcoming-content');
    if (container) {
        container.innerHTML = html;
        // Aplicar filtro inicial (todos)
        filterUpcomingContent('all');
    }
};

// Función auxiliar para configuración de estados
function getStatusConfig(status) {
    const configs = {
        'published': { icon: '✅', label: 'Publicado', bg: '#dcfce7', color: '#166534' },
        'scheduled': { icon: '📅', label: 'Programado', bg: '#dbeafe', color: '#1e40af' },
        'designed': { icon: '🎨', label: 'Diseñado', bg: '#fef3c7', color: '#92400e' },
        'design': { icon: '⚡', label: 'En Diseño', bg: '#fee2e2', color: '#dc2626' },
        'correction': { icon: '🔧', label: 'Corrección', bg: '#fed7d7', color: '#b91c1c' },
        'no-status': { icon: '❓', label: 'Sin Estado', bg: '#f3f4f6', color: '#374151' }
    };
    return configs[status] || configs['no-status'];
}

// Función para filtrar contenido upcoming
function filterUpcomingContent(statusFilter) {
    const container = document.getElementById('upcoming-items-container');
    if (!container) return;

    // Actualizar botones activos
    const buttons = document.querySelectorAll('[id^="upcoming-filter-"]');
    buttons.forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = '#64748b';
        btn.style.borderColor = '#e2e8f0';
    });

    const activeBtn = document.getElementById(`upcoming-filter-${statusFilter}`);
    if (activeBtn) {
        activeBtn.style.background = '#6366f1';
        activeBtn.style.color = '#fff';
        activeBtn.style.borderColor = '#6366f1';
    }

    // Filtrar items
    const items = container.querySelectorAll('.upcoming-item');
    items.forEach(item => {
        const itemStatus = item.dataset.status;
        if (statusFilter === 'all' || itemStatus === statusFilter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Función para refrescar upcoming cuando se actualiza contenido
function refreshUpcomingContent() {
    if (typeof loadUpcoming === 'function') {
        loadUpcoming();
    }
}

// ==================================================
// CARGAR PERFORMANCE GLOBAL
// ==================================================
window.loadGlobalPerformance = function() {
    const container = document.getElementById('global-performance');
    if (!container) return;
    
    const allContent = window.appData?.calendar?.filter(c => c.metrics) || [];
    
    if (allContent.length === 0) {
        container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--gray-600);">No hay contenido con métricas aún</div>';
        return;
    }
    
    const totalPublished = allContent.length;
    const totalReach = allContent.reduce((sum, c) => {
        return sum + (c.metrics?.instagram?.reach || 0) + (c.metrics?.facebook?.reach || 0);
    }, 0);
    
    const totalDMs = allContent.reduce((sum, c) => {
        return sum + (c.metrics?.instagram?.dms || 0) + (c.metrics?.facebook?.messages || 0);
    }, 0);
    
    const reels = allContent.filter(c => c.type === 'reel');
    const carousels = allContent.filter(c => c.type === 'carousel');
    const stories = allContent.filter(c => c.type === 'stories');
    
    const reelsWithVideo = reels.filter(r => r.metrics?.videoMetrics);
    let avgRetention = 0;
    let ratingBreakdown = { excelente: 0, bueno: 0, regular: 0, malo: 0 };
    
    if (reelsWithVideo.length > 0) {
        avgRetention = reelsWithVideo.reduce((sum, r) => sum + r.metrics.videoMetrics.retentionPercent, 0) / reelsWithVideo.length;
        reelsWithVideo.forEach(r => {
            ratingBreakdown[r.metrics.videoMetrics.rating]++;
        });
    }
    
    let html = '<div class="stats-grid" style="margin-bottom: 16px;">';
    html += `
        <div class="stat-card">
            <div class="stat-label">Total Publicado</div>
            <div class="stat-value">${totalPublished}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Alcance Acumulado</div>
            <div class="stat-value">${totalReach.toLocaleString()}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">DMs Totales</div>
            <div class="stat-value">${totalDMs}</div>
        </div>
    `;
    html += '</div>';
    
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-top: 16px;">';
    html += `
        <div style="padding: 16px; background: var(--gray-50); border-radius: 8px;">
            <strong>🎬 Reels</strong>
            <div style="margin-top: 8px;">
                <div>Total: <strong>${reels.length}</strong></div>
                ${reelsWithVideo.length > 0 ? `
                    <div>Retención prom: <strong>${avgRetention.toFixed(1)}%</strong></div>
                    <div style="margin-top: 4px;">
                        ${ratingBreakdown.excelente > 0 ? `🌟 ${ratingBreakdown.excelente} ` : ''}
                        ${ratingBreakdown.bueno > 0 ? `✅ ${ratingBreakdown.bueno} ` : ''}
                        ${ratingBreakdown.regular > 0 ? `⚠️ ${ratingBreakdown.regular} ` : ''}
                        ${ratingBreakdown.malo > 0 ? `❌ ${ratingBreakdown.malo}` : ''}
                    </div>
                ` : '<div style="color: var(--gray-600);">Sin métricas de video</div>'}
            </div>
        </div>
        <div style="padding: 16px; background: var(--gray-50); border-radius: 8px;">
            <strong>📊 Carruseles</strong>
            <div style="margin-top: 8px;">Total: <strong>${carousels.length}</strong></div>
        </div>
        <div style="padding: 16px; background: var(--gray-50); border-radius: 8px;">
            <strong>📲 Stories</strong>
            <div style="margin-top: 8px;">Total: <strong>${stories.length}</strong></div>
        </div>
    `;
    container.innerHTML = html;

    // Rellenar sección de expertos (NUEVO)
    setTimeout(() => {
        const expertsGrid = document.getElementById('dashboard-ai-experts');
        if (expertsGrid && window.AI_DEPARTMENTS) {
            expertsGrid.innerHTML = Object.values(window.AI_DEPARTMENTS).map(dept => `
                <div class="ai-expert-pill" onclick="window.navigateToAIExpert('${dept.id}')" 
                     style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.2s; text-align: center;">
                    <div style="font-size: 20px; margin-bottom: 5px;">${dept.icon}</div>
                    <div style="font-size: 11px; font-weight: 700; color: #1e293b;">${dept.name}</div>
                </div>
            `).join('');

            // Estilos hover manuales
            const pills = expertsGrid.querySelectorAll('.ai-expert-pill');
            pills.forEach(p => {
                p.onmouseover = () => { 
                    p.style.borderColor = '#6366f1'; 
                    p.style.transform = 'translateY(-2px)'; 
                    p.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'; 
                };
                p.onmouseout = () => { 
                    p.style.borderColor = '#e2e8f0'; 
                    p.style.transform = 'translateY(0)'; 
                    p.style.boxShadow = 'none'; 
                };
            });
        }
    }, 100);
};

window.navigateToAIExpert = function(deptId) {
    if (typeof window.navigateToAI === 'function') {
        window.navigateToAI('assistant');
        const checkAI = setInterval(() => {
            if (window.aiUI) {
                clearInterval(checkAI);
                window.aiUI.setDepartment(deptId);
                // Scroll al asistente
                const assistant = document.getElementById('ai-assistant-card');
                if (assistant) assistant.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
};

// ==================================================
// FUNCIONES AUXILIARES (si no están en utils.js)
// ==================================================
if (typeof formatDate !== 'function') {
    window.formatDate = function(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    };
}

if (typeof getTypeBadge !== 'function') {
    window.getTypeBadge = function(type) {
        const types = { reel: 'success', carousel: 'info', stories: 'warning' };
        return types[type] || 'info';
    };
}

if (typeof getTypeLabel !== 'function') {
    window.getTypeLabel = function(type) {
        const labels = { reel: '🎬 Reel', carousel: '📊 Carrusel', stories: '📲 Stories' };
        return labels[type] || type;
    };
}

// ==================================================
// EXPORTAR
// ==================================================
console.log('✅ dashboard.js cargado correctamente');