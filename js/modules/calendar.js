// ==================================================
// CALENDAR MODULE - VERSIÓN COMPLETA Y FUNCIONAL
// ==================================================

console.log('📅 Cargando calendar.js...');

// ==================================================
// VARIABLES GLOBALES
// ==================================================
let selectedContentId = null;

// ==================================================
// FUNCIÓN PRINCIPAL PARA CARGAR EL CALENDARIO
// ==================================================
function loadCalendar() {
    console.log('📅 Cargando calendario...');
    renderCalendarItems('calendar-content');
    renderMonthTabs();

    // Inicializar calendario visual si está disponible
    if (typeof initVisualCalendar === 'function') {
        setTimeout(() => {
            initVisualCalendar();
        }, 200);
    }
}

// ==================================================
// FUNCIÓN PARA CARGAR LA VISTA DE CONTENIDO
// ==================================================
window.renderContentList = function() {
    if (typeof renderFilteredContent === 'function' && window._contentFilters &&
        (window._contentFilters.type !== 'all' ||
         window._contentFilters.status !== 'all' ||
         window._contentFilters.month !== 'all' ||
         window._contentFilters.search ||
         window._contentFilters.metrics !== 'all' ||
         window._contentFilters.objective !== 'all')) {
        renderFilteredContent();
        return;
    }
    if (typeof renderCalendarItems === 'function') {
        renderCalendarItems('content-list', window.appData?.calendar || []);
    }
};

function loadContent() {
    console.log('📝 Cargando contenido...');
    renderContentList();
}

// ==================================================
// FUNCIÓN PARA RENDERIZAR LAS TARJETAS
// ==================================================
function renderCalendarItems(containerId, itemsToRender) {
    console.log(`🖼️ Renderizando items en ${containerId}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Container ${containerId} no encontrado`);
        return;
    }
    
    // Verificar que appData y calendar existen
    if (!appData || !appData.calendar) {
        console.error('❌ appData.calendar no está definido');
        container.innerHTML = '<div class="empty-state">Error: Datos no disponibles</div>';
        return;
    }
    
    // Obtener mes actual de los tabs
    const activeTab = document.querySelector('.month-tab.active');
    const currentMonth = activeTab ? activeTab.dataset.month : '2026-03';

    const items = Array.isArray(itemsToRender)
        ? itemsToRender
        : appData.calendar.filter(c => c.date && c.date.startsWith(currentMonth));

    if (!Array.isArray(itemsToRender)) {
        console.log(`📆 Mes actual: ${currentMonth}`);
        console.log(`📊 Total contenido: ${appData.calendar.length} items`);
        console.log(`📊 Contenido para ${currentMonth}: ${items.length} items`);
    } else {
        console.log(`📊 Renderizando ${items.length} items en ${containerId} (sin filtro por mes)`);
    }

    if (items.length === 0) {
        if (containerId === 'content-list') {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📄</div>
                    <p><strong>No hay contenido que coincida con tus filtros</strong></p>
                    <p style="margin-top: 8px; color: var(--gray-600);">
                        Ajusta los filtros o agrega nuevo contenido para ver resultados.
                    </p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <p><strong>No hay contenido para ${currentMonth}</strong></p>
                    <p style="margin-top: 8px; color: var(--gray-600);">
                        Haz clic en "+ Nuevo Contenido" para comenzar
                    </p>
                    <div style="display: flex; gap: 8px; justify-content: center; margin-top: 16px;">
                        <button class="btn-primary" onclick="openAddContentModal()">
                            + Agregar Contenido
                        </button>
                    </div>
                </div>
            `;
        }
        return;
    }
    
    // Generar HTML para cada item
    let html = '';
    
    items.forEach(item => {
        // Verificar si tiene métricas (usando la estructura original)
        const hasMetrics = !!(item.metrics || item.igViews || item.fbViews || item.ttViews);
        const adsBadge = item.hasAds ? `<span class="badge badge-success" style="background: #10b981; color: white;">💰 Inversión</span>` : '';
        
        // Status badge
        const statusLabels = {
            'not-started': '⚪ No Iniciado',
            'design': '🎨 En Diseño',
            'correction': '✏️ En Corrección',
            'designed': '✅ Diseñado',
            'scheduled': '⏰ Programado',
            'published': '🚀 Publicado'
        };
        
        const statusColors = {
            'not-started': 'secondary',
            'design': 'warning',
            'correction': 'info',
            'designed': 'success',
            'scheduled': 'primary',
            'published': 'success'
        };
        
        const status = item.status || 'not-started';
        const statusBadge = `<span class="badge badge-${statusColors[status]}">${statusLabels[status]}</span>`;
        
        // Obtener métricas (compatible con ambas estructuras)
        let igReach = 0, igLikes = 0, igComments = 0, igDMs = 0;
        let fbReach = 0, fbReactions = 0, fbComments = 0, fbMessages = 0;
        let ttViews = 0, ttLikes = 0, ttComments = 0;
        
        if (item.metrics) {
            // Estructura antigua: item.metrics.instagram.reach
            igReach = item.metrics?.instagram?.reach || 0;
            igLikes = item.metrics?.instagram?.likes || 0;
            igComments = item.metrics?.instagram?.comments || 0;
            igDMs = item.metrics?.instagram?.dms || 0;
            
            fbReach = item.metrics?.facebook?.reach || 0;
            fbReactions = item.metrics?.facebook?.reactions || 0;
            fbComments = item.metrics?.facebook?.comments || 0;
            fbMessages = item.metrics?.facebook?.messages || 0;
            
            ttViews = item.metrics?.tiktok?.views || 0;
            ttLikes = item.metrics?.tiktok?.likes || 0;
            ttComments = item.metrics?.tiktok?.comments || 0;
        } else {
            // Estructura nueva: item.igReach, item.fbReach, etc.
            igReach = parseInt(item.igReach) || 0;
            igLikes = parseInt(item.igLikes) || 0;
            igComments = parseInt(item.igComments) || 0;
            igDMs = parseInt(item.igDMs) || 0;
            
            fbReach = parseInt(item.fbReach) || 0;
            fbReactions = parseInt(item.fbReactions) || 0;
            fbComments = parseInt(item.fbComments) || 0;
            fbMessages = parseInt(item.fbMessages) || 0;
            
            ttViews = parseInt(item.ttViews) || 0;
            ttLikes = parseInt(item.ttLikes) || 0;
            ttComments = parseInt(item.ttComments) || 0;
        }
        
        // Métricas HTML (Ultra-Compacta)
        let metricsHtml = '';
        if (hasMetrics) {
            const totalReach = igReach + fbReach;
            const totalEng = igLikes + igComments + fbReactions + fbComments + ttLikes + ttComments;
            const totalDMs = igDMs + fbMessages;
            
            const mId = 'metrics-' + item.id;
            metricsHtml = `
                <div class="compact-metrics-bar" onclick="toggleFullMetrics('${mId}', this)" title="Ver detalle completo" style="cursor:pointer;">
                    <div class="compact-metric-item">
                        <span class="compact-metric-val">🚀 ${totalReach.toLocaleString()}</span>
                        <span class="compact-metric-label">Alcance</span>
                    </div>
                    <div class="compact-metric-item">
                        <span class="compact-metric-val">❤️ ${totalEng.toLocaleString()}</span>
                        <span class="compact-metric-label">Eng.</span>
                    </div>
                    <div class="compact-metric-item">
                        <span class="compact-metric-val">📩 ${totalDMs}</span>
                        <span class="compact-metric-label">DMs</span>
                    </div>
                </div>
                <!-- Detalle oculto por defecto -->
                <div class="calendar-metrics" id="${mId}" style="display:none; font-size:11px; padding:8px; background:var(--gray-50); border-radius:8px; margin-bottom:10px;">
                    <div class="metrics-row"><span>📸 IG:</span> <strong>${igReach.toLocaleString()}</strong></div>
                    <div class="metrics-row"><span>📘 FB:</span> <strong>${fbReach.toLocaleString()}</strong></div>
                    <div class="metrics-row"><span>📱 TT:</span> <strong>${ttViews.toLocaleString()}</strong></div>
                </div>
            `;
        }
        
        html += `
            <div class="calendar-item ${item.hasAds ? 'has-ads' : ''} ${hasMetrics ? 'has-metrics' : ''}" data-id="${item.id}">
                <div class="calendar-date">
                    📅 ${formatDate(item.date)} - ${item.time}
                    ${adsBadge}
                    ${statusBadge}
                </div>
                <div class="calendar-title">${item.title || 'Sin título'}</div>
                <div class="calendar-type">
                    <span class="badge badge-${getTypeBadge(item.type)}">${getTypeLabel(item.type)}</span>
                    <span class="badge badge-info">${item.objective || 'general'}</span>
                </div>
                ${(function() {
                    var notes = item.notes || 'Sin notas';
                    var id = 'notes-' + item.id;
                    var preview = notes.length > 120 ? notes.substring(0, 120) + '...' : notes;
                    var needsToggle = notes.length > 120;
                    if (!needsToggle) {
                        return '<div class="calendar-notes">' + notes + '</div>';
                    }
                    return '<div class="calendar-notes">'
                        + '<span class="notes-preview" id="prev-' + id + '">' + preview + '</span>'
                        + '<span class="notes-full" id="full-' + id + '" style="display:none;">' + notes + '</span>'
                        + '<button class="notes-toggle" onclick="toggleNotes(\'' + id + '\', this)">'
                        + '▼ Ver más</button>'
                        + '</div>';
                })()}
                ${metricsHtml}
                
                <div class="calendar-actions calendar-actions-fixed" style="display: flex; flex-direction: column; gap: 6px;">
                    <!-- ACCIONES PRINCIPALES -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                        <button class="btn-secondary btn-sm" onclick="openEditContentModal(${item.id})" style="width: 100%; border-radius: 6px; font-weight: 600; font-size:11px; padding: 6px;">✏️ Editar Contenido</button>
                        <button class="btn-${hasMetrics ? 'secondary' : 'success'} btn-sm" onclick="openMetricsModal(${item.id})" style="width: 100%; border-radius: 6px; font-weight: 600; font-size:11px; padding: 6px;">
                            📊 ${hasMetrics ? 'Ver Métricas' : '+ Agregar Datos'}
                        </button>
                    </div>

                    <!-- ACCIONES RÁPIDAS CON TEXTO -->
                    <div style="display: flex; flex-direction: column; gap: 4px; background: var(--gray-50); padding: 8px; border-radius: 8px; border: 1px solid var(--gray-200);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                            <button onclick="openDetailsModal(${item.id})" style="background:white; border:1px solid var(--gray-200); border-radius:4px; cursor:pointer; font-size:10px; display:flex; align-items:center; gap:4px; padding:4px 6px;">
                                📋 Detalles
                            </button>
                            <button onclick="window.showExpertSelector(${item.id}, event)" style="background:white; border:1px solid var(--gray-200); border-radius:4px; cursor:pointer; font-size:10px; display:flex; align-items:center; gap:4px; padding:4px 6px;">
                                🤖 Experto IA
                            </button>
                            ${item.type === 'reel' ? `
                            <button onclick="downloadGuion(${item.id})" style="background:white; border:1px solid var(--gray-200); border-radius:4px; cursor:pointer; font-size:10px; display:flex; align-items:center; gap:4px; padding:4px 6px; grid-column: span 2;">
                                📄 Ver Guion Técnico
                            </button>` : ''}
                        </div>
                        <div style="display: flex; justify-content: flex-end; padding-top: 4px; border-top: 1px solid var(--gray-100); margin-top: 4px;">
                            <button onclick="deleteContent(${item.id})" style="background:none; border:none; cursor:pointer; font-size:10px; color: #ef4444; display:flex; align-items:center; gap:4px; opacity: 0.8;">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    console.log(`✅ Renderizados ${items.length} items en ${containerId}`);
}

// ==================================================
// FUNCIÓN PARA RENDERIZAR LOS TABS DE MESES — DINÁMICA
// FIX: Ya no usa una lista hardcodeada de meses.
// Genera los tabs a partir de los meses que realmente tienen
// contenido en appData.calendar, más un mínimo base de 3 meses
// futuros vacíos para que siempre haya dónde agregar contenido nuevo.
// Esto garantiza que cualquier mes importado via CSV aparezca
// automáticamente como tab sin importar el año.
// ==================================================
function renderMonthTabs() {
    console.log('📆 Renderizando tabs de meses (dinámico)...');

    const tabsContainer = document.getElementById('month-tabs');
    if (!tabsContainer) { console.error('❌ month-tabs no encontrado'); return; }

    // Usar siempre appData como fuente de verdad (es más fresco que localStorage)
    const calendarData = window.appData?.calendar || [];

    const MONTH_NAMES = {
        '01':'Enero','02':'Febrero','03':'Marzo','04':'Abril',
        '05':'Mayo','06':'Junio','07':'Julio','08':'Agosto',
        '09':'Septiembre','10':'Octubre','11':'Noviembre','12':'Diciembre'
    };

    // 1. Recopilar todos los meses que tienen contenido
    const monthsWithData = new Set();
    calendarData.forEach(c => {
        if (c.date && c.date.length >= 7) monthsWithData.add(c.date.substring(0, 7));
    });

    // 2. Calcular el mes actual del sistema para el mínimo base
    const now        = new Date();
    const currentYM  = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    // 3. Generar los 4 meses siguientes al mes actual (base mínimo visible)
    const baseFuture = new Set();
    for (let i = 0; i < 4; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        baseFuture.add(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
    }

    // 4. Unir: meses con contenido + meses base, ordenados
    const allMonths = [...new Set([...monthsWithData, ...baseFuture])].sort();

    // 5. Determinar cuál tab debe estar activo
    // Prioridad: tab previamente activo > mes actual > primer mes con contenido > primer mes de la lista
    const currentActiveTab = document.querySelector('.month-tab.active')?.dataset?.month;
    let targetActive = currentActiveTab || currentYM;
    if (!allMonths.includes(targetActive)) {
        targetActive = allMonths.find(m => monthsWithData.has(m)) || allMonths[0];
    }

    // 6. Generar HTML
    let tabsHtml = '';
    allMonths.forEach(monthValue => {
        const parts = monthValue.split('-');
        const label = MONTH_NAMES[parts[1]] + ' ' + parts[0];
        const count = calendarData.filter(c => c.date && c.date.startsWith(monthValue)).length;
        const isActive = monthValue === targetActive;

        tabsHtml += '<div class="month-tab ' + (isActive ? 'active' : '') + '" '
            + 'data-month="' + monthValue + '" '
            + 'onclick="switchMonth(\'' + monthValue + '\')">'
            + label
            + '<span class="month-tab-count ' + (count === 0 ? 'empty' : '') + '">' + count + '</span>'
            + '</div>';
    });

    tabsContainer.innerHTML = tabsHtml;
    console.log('✅ Tabs generados dinámicamente: ' + allMonths.length + ' meses');
}

// ==================================================
// FUNCIÓN PARA CAMBIAR DE MES
// ==================================================
function switchMonth(month) {
    console.log(`🔄 Cambiando a mes: ${month}`);
    
    // Actualizar tabs
    document.querySelectorAll('.month-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.month === month) {
            tab.classList.add('active');
        }
    });
    
    // Recargar calendario y contenido
    renderCalendarItems('calendar-content');
    renderContentList();
}

// ==================================================
// FUNCIÓN PARA CARGAR PRÓXIMAS PUBLICACIONES
// ==================================================
function loadUpcoming() {
    console.log('📅 Cargando próximas publicaciones...');
    
    const container = document.getElementById('upcoming-content');
    if (!container) {
        console.error('❌ Container upcoming-content no encontrado');
        return;
    }
    
    if (!appData || !appData.calendar) {
        container.innerHTML = '<div class="empty-state">Error: Datos no disponibles</div>';
        return;
    }
    
    // Filtrar publicaciones sin estado o no iniciadas
    const upcoming = appData.calendar
        .filter(item => !item.status || item.status === 'not-started')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--gray-600);">
                ✅ Todas las publicaciones tienen estado asignado
            </div>
        `;
        return;
    }
    
    let html = '<table><thead><tr><th>Fecha</th><th>Título</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
    
    upcoming.forEach(item => {
        html += `
            <tr>
                <td>${formatDate(item.date)} ${item.time}</td>
                <td>${item.title}</td>
                <td><span class="badge badge-${getTypeBadge(item.type)}">${getTypeLabel(item.type)}</span></td>
                <td><span class="badge badge-secondary">⚪ Sin Estado</span></td>
                <td>
                    <button class="btn-secondary btn-sm" onclick="goToContent(${item.id})">📝 Ir</button>
                    <button class="btn-success btn-sm" onclick="quickAssignStatus(${item.id})">🎨 Estado</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
    console.log('✅ Próximas publicaciones cargadas');
}

// ==================================================
// FUNCIÓN PARA IR A CONTENIDO ESPECÍFICO
// ==================================================
function goToContent(contentId) {
    navigateTo('content');
    setTimeout(() => {
        if (typeof openEditContentModal === 'function') {
            openEditContentModal(contentId);
        }
    }, 300);
}

// ==================================================
// FUNCIÓN PARA ASIGNAR ESTADO RÁPIDO
// ==================================================
function quickAssignStatus(contentId) {
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content) return;
    
    const status = prompt(`Asignar estado a "${content.title}":\n\n1. En Diseño\n2. En Corrección\n3. Diseñado\n4. Programado\n5. Publicado`, '1');
    
    const statusMap = {
        '1': 'design',
        '2': 'correction',
        '3': 'designed',
        '4': 'scheduled',
        '5': 'published'
    };
    
    if (statusMap[status]) {
        content.status = statusMap[status];
        storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);
        if (typeof updateAllModules === 'function') updateAllModules();
        if (typeof addNotification === 'function') addNotification('Estado Asignado', `"${content.title}" actualizado`);
        alert('✅ Estado asignado');
    }
}

// ==================================================
// FUNCIÓN PARA ACTUALIZAR CONTADORES DE MESES
// FIX: ya no usa lista hardcodeada — itera los tabs que existen en el DOM
// ==================================================
function updateMonthCounts() {
    const cal = window.appData?.calendar || [];
    document.querySelectorAll('.month-tab[data-month]').forEach(tab => {
        const month = tab.dataset.month;
        const count = cal.filter(c => c.date && c.date.startsWith(month)).length;
        const badge = tab.querySelector('.month-tab-count');
        if (badge) {
            badge.textContent = count;
            badge.className = 'month-tab-count' + (count === 0 ? ' empty' : '');
        }
    });
}

// ==================================================
// FUNCIÓN PARA ABRIR EL MODAL DE MÉTRICAS
// ==================================================
function openMetricsModal(contentId) {
    console.log('Abriendo métricas para contenido:', contentId);
    
    if (!contentId) {
        console.error('No se proporcionó ID de contenido');
        return;
    }
    
    // Guardar el ID del contenido seleccionado
    selectedContentId = contentId;
    
    // Buscar el contenido en el calendario
    const content = appData.calendar.find(item => item.id === contentId);
    
    if (!content) {
        console.error('Contenido no encontrado:', contentId);
        if (typeof showError === 'function') {
            showError('No se encontró el contenido');
        } else {
            alert('No se encontró el contenido');
        }
        return;
    }
    
    // Actualizar header del modal
    const header = document.getElementById('metrics-header');
    if (header) {
        header.innerHTML = `
            <h4 style="margin-bottom: 8px;">${content.title}</h4>
            <p style="font-size: 13px; color: var(--gray-600);">${content.date || 'Fecha no disponible'}</p>
        `;
    }
    
    // Cargar métricas existentes
    loadMetricsData(content);
    
    // Mostrar el modal
    if (typeof openModal === 'function') {
        openModal('metrics-modal');
    } else {
        const modal = document.getElementById('metrics-modal');
        if (modal) modal.style.display = 'flex';
    }
}

// ==================================================
// FUNCIÓN PARA CARGAR DATOS DE MÉTRICAS EXISTENTES
// ==================================================
function loadMetricsData(content) {
    // Instagram
    document.getElementById('ig-views').value = content.igViews || '';
    document.getElementById('ig-reach').value = content.igReach || '';
    document.getElementById('ig-likes').value = content.igLikes || '';
    document.getElementById('ig-comments').value = content.igComments || '';
    document.getElementById('ig-saves').value = content.igSaves || '';
    document.getElementById('ig-shares').value = content.igShares || '';
    document.getElementById('ig-dms').value = content.igDMs || '';
    
    // Facebook
    document.getElementById('fb-views').value = content.fbViews || '';
    document.getElementById('fb-reach').value = content.fbReach || '';
    document.getElementById('fb-reactions').value = content.fbReactions || '';
    document.getElementById('fb-comments').value = content.fbComments || '';
    document.getElementById('fb-shares').value = content.fbShares || '';
    document.getElementById('fb-clicks').value = content.fbClicks || '';
    document.getElementById('fb-messages').value = content.fbMessages || '';
    
    // TikTok
    document.getElementById('tt-views').value = content.ttViews || '';
    document.getElementById('tt-likes').value = content.ttLikes || '';
    document.getElementById('tt-comments').value = content.ttComments || '';
    document.getElementById('tt-saves').value = content.ttSaves || '';
    document.getElementById('tt-shares').value = content.ttShares || '';
    
    // Video metrics
    const videoSection = document.getElementById('video-metrics-section');
    if (videoSection) {
        if (content.type === 'reel') {
            videoSection.style.display = 'block';
            document.getElementById('video-duration').value = content.videoDuration || '';
            document.getElementById('video-avg-watch').value = content.videoAvgWatch || '';
            document.getElementById('video-retention').value = content.videoRetention || '';
            document.getElementById('video-first3s').value = content.videoFirst3s || '';
            document.getElementById('video-rating').value = content.videoRating || '';
            document.getElementById('video-first3s-analysis').value = content.videoFirst3sAnalysis || '';
        } else {
            videoSection.style.display = 'none';
        }
    }
}

// ==================================================
// FUNCIÓN PARA GUARDAR MÉTRICAS
// ==================================================
function saveMetrics() {
    console.log('Guardando métricas para contenido:', selectedContentId);
    
    if (!selectedContentId) {
        if (typeof showError === 'function') {
            showError('No hay contenido seleccionado');
        } else {
            alert('No hay contenido seleccionado');
        }
        return;
    }
    
    // Verificar permisos
    if (typeof hasPermission === 'function' && !hasPermission('canEditContent')) {
        if (typeof showError === 'function') {
            showError('No tienes permisos para editar métricas');
        } else {
            alert('No tienes permisos para editar métricas');
        }
        return;
    }
    
    // Obtener datos del formulario
    const metricsData = {
        igViews: document.getElementById('ig-views').value,
        igReach: document.getElementById('ig-reach').value,
        igLikes: document.getElementById('ig-likes').value,
        igComments: document.getElementById('ig-comments').value,
        igSaves: document.getElementById('ig-saves').value,
        igShares: document.getElementById('ig-shares').value,
        igDMs: document.getElementById('ig-dms').value,
        
        fbViews: document.getElementById('fb-views').value,
        fbReach: document.getElementById('fb-reach').value,
        fbReactions: document.getElementById('fb-reactions').value,
        fbComments: document.getElementById('fb-comments').value,
        fbShares: document.getElementById('fb-shares').value,
        fbClicks: document.getElementById('fb-clicks').value,
        fbMessages: document.getElementById('fb-messages').value,
        
        ttViews: document.getElementById('tt-views').value,
        ttLikes: document.getElementById('tt-likes').value,
        ttComments: document.getElementById('tt-comments').value,
        ttSaves: document.getElementById('tt-saves').value,
        ttShares: document.getElementById('tt-shares').value,
        
        videoDuration: document.getElementById('video-duration').value,
        videoAvgWatch: document.getElementById('video-avg-watch').value,
        videoRetention: document.getElementById('video-retention').value,
        videoFirst3s: document.getElementById('video-first3s').value,
        videoRating: document.getElementById('video-rating').value,
        videoFirst3sAnalysis: document.getElementById('video-first3s-analysis').value,
        
        lastUpdated: new Date().toISOString()
    };
    
    // Buscar y actualizar el contenido en appData
    const index = appData.calendar.findIndex(item => item.id === selectedContentId);
    
    if (index !== -1) {
        // Mantener los datos existentes y agregar los nuevos
        appData.calendar[index] = { ...appData.calendar[index], ...metricsData };
        
        // Guardar en localStorage
        const account = window.currentAccount || 'bondi-media';
        localStorage.setItem(`bondi-calendar-${account}`, JSON.stringify(appData.calendar));
        
        if (typeof showSuccess === 'function') {
            showSuccess('Métricas guardadas correctamente');
        } else {
            alert('✅ Métricas guardadas correctamente');
        }
        
        if (typeof closeModal === 'function') {
            closeModal('metrics-modal');
        } else {
            const modal = document.getElementById('metrics-modal');
            if (modal) modal.style.display = 'none';
        }
        
        // Recargar vistas
        renderCalendarItems('calendar-content');
        renderContentList();
        updateMonthCounts();
    } else {
        if (typeof showError === 'function') {
            showError('Error al guardar: contenido no encontrado');
        } else {
            alert('Error al guardar: contenido no encontrado');
        }
    }
}

// ==================================================
// FUNCIÓN PARA CALCULAR RETENCIÓN
// ==================================================
function calculateRetention() {
    const duration = parseFloat(document.getElementById('video-duration').value) || 0;
    const avgWatch = parseFloat(document.getElementById('video-avg-watch').value) || 0;
    
    if (duration > 0 && avgWatch > 0) {
        const retention = (avgWatch / duration) * 100;
        document.getElementById('video-retention').value = retention.toFixed(1);
        
        // Calcular rating automático
        let rating = '';
        if (retention >= 70) rating = 'Excelente';
        else if (retention >= 50) rating = 'Bueno';
        else if (retention >= 30) rating = 'Regular';
        else rating = 'Malo';
        
        document.getElementById('video-rating').value = rating;
    }
}

// ==================================================
// FUNCIÓN PARA ALTERNAR MÉTRICAS COMPLETAS (ULTRA-COMPACTA)
// ==================================================
window.toggleFullMetrics = function(metricsId, element) {
    const detail = document.getElementById(metricsId);
    if (!detail) return;
    
    if (detail.style.display === 'none') {
        detail.style.display = 'block';
        element.style.background = 'var(--gray-100)';
    } else {
        detail.style.display = 'none';
        element.style.background = '#f8fafc';
    }
};

// ==================================================
// FUNCIÓN PARA ALTERNAR NOTAS (MANTENIDA POR COMPATIBILIDAD)
// ==================================================
function toggleAdsBudget(value) {
    const container = document.getElementById('ads-budget-container');
    if (container) {
        container.style.display = value === 'true' ? 'block' : 'none';
    }
}

// ==================================================
// FUNCIONES AUXILIARES
// ==================================================
function formatDate(dateStr) {
    if (!dateStr) return 'Fecha no disponible';
    try {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
        return dateStr;
    }
}

function getTypeBadge(type) {
    const badges = {
        'reel': 'primary',
        'carousel': 'success',
        'stories': 'info'
    };
    return badges[type] || 'secondary';
}

function getTypeLabel(type) {
    const labels = {
        'reel': '🎬 Reel',
        'carousel': '📊 Carrusel',
        'stories': '📲 Stories'
    };
    return labels[type] || type;
}

// ==================================================
// FUNCIÓN PARA ELIMINAR CONTENIDO - VERSIÓN FORZADA
// ==================================================
function deleteContent(contentId) {
    console.log('🗑️ Intentando eliminar contenido:', contentId);
    
    const content = window.appData?.calendar?.find(c => c.id === contentId);
    const contentTitle = content ? content.title : 'este contenido';
    
    if (typeof showConfirm === 'function') {
        showConfirm({
            title: '🗑️ Eliminar contenido',
            message: `¿Eliminar "${contentTitle}"?`,
            confirmText: 'Sí, eliminar',
            confirmButtonClass: 'btn-danger',
            onConfirm: () => {
                // Cerrar modal
                if (typeof closeModal === 'function') closeModal('confirmModal');
                
                setTimeout(() => {
                    // Eliminar de localStorage
                    const account = window.currentAccount || 'bondi-media';
                    let calendarData = JSON.parse(localStorage.getItem(`bondi-calendar-${account}`) || '[]');
                    const newData = calendarData.filter(c => c.id !== contentId);
                    localStorage.setItem(`bondi-calendar-${account}`, JSON.stringify(newData));
                    
                    // Actualizar appData
                    if (window.appData) window.appData.calendar = newData;
                    
                    console.log('✅ Contenido eliminado');
                    
                    // FORZAR ACTUALIZACIÓN MÚLTIPLE
                    if (typeof forceFullRender === 'function') {
                        forceFullRender();
                        setTimeout(forceFullRender, 200);
                        setTimeout(forceFullRender, 500);
                    } else {
                        // Recargar página como último recurso
                        location.reload();
                    }
                    
                    if (typeof showSuccess === 'function') {
                        showSuccess('Contenido eliminado');
                    }
                }, 200);
            }
        });
    } else {
        if (confirm(`¿Eliminar "${contentTitle}"?`)) {
            const account = window.currentAccount || 'bondi-media';
            let calendarData = JSON.parse(localStorage.getItem(`bondi-calendar-${account}`) || '[]');
            const newData = calendarData.filter(c => c.id !== contentId);
            localStorage.setItem(`bondi-calendar-${account}`, JSON.stringify(newData));
            if (window.appData) window.appData.calendar = newData;
            
            if (typeof forceFullRender === 'function') {
                forceFullRender();
            } else {
                location.reload();
            }
        }
    }
}

// ==================================================
// CARGAR CONTENIDO DE EJEMPLO
// ==================================================
window.loadSampleData = function() {
    console.log('📚 Cargando datos de ejemplo...');
    
    const sampleData = [
        {
            id: 1,
            date: '2026-03-15',
            time: '18:00',
            type: 'reel',
            title: '5 señales de que necesitas rebranding',
            objective: 'conversion',
            notes: 'Ejemplo de contenido',
            status: 'published',
            categories: ['branding'],
            hasAds: true,
            adsInvestment: 50000
        },
        {
            id: 2,
            date: '2026-03-18',
            time: '19:30',
            type: 'carousel',
            title: 'Psicología del color en branding',
            objective: 'educativo',
            notes: 'Ejemplo de carrusel',
            status: 'scheduled',
            categories: ['educativo'],
            hasAds: false,
            adsInvestment: 0
        },
        {
            id: 3,
            date: '2026-04-01',
            time: '20:00',
            type: 'reel',
            title: 'El error de $50K en branding',
            objective: 'conversion',
            notes: 'Ejemplo abril',
            status: 'not-started',
            categories: ['venta'],
            hasAds: true,
            adsInvestment: 80000
        }
    ];
    
    const account = window.currentAccount || 'bondi-media';
    localStorage.setItem(`bondi-calendar-${account}`, JSON.stringify(sampleData));
    
    if (window.appData) {
        window.appData.calendar = sampleData;
    }
    
    // Forzar actualización
    if (typeof forceFullRender === 'function') {
        forceFullRender();
    } else {
        loadCalendar();
        loadContent();
        renderMonthTabs();
    }
    
    if (typeof showSuccess === 'function') {
        showSuccess('Datos de ejemplo cargados', '📚 3 publicaciones');
    }
    
    console.log('✅ Datos de ejemplo cargados');
};

// ==================================================
// IA EXPERT SELECTOR - SELECCIÓN RÁPIDA POR CONTENIDO
// ==================================================
window.showExpertSelector = function(contentId, event) {
    event.stopPropagation();
    
    // Eliminar selector previo si existe
    const existing = document.getElementById('expert-selector-popup');
    if (existing) existing.remove();
    
    const content = window.appData?.calendar?.find(c => c.id === contentId);
    if (!content) return;
    
    const popup = document.createElement('div');
    popup.id = 'expert-selector-popup';
    popup.style.cssText = `
        position: fixed;
        top: ${event.clientY}px;
        left: ${event.clientX}px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        padding: 12px;
        z-index: 10000;
        width: 220px;
        border: 1px solid var(--gray-200);
        display: flex;
        flex-direction: column;
        gap: 4px;
        animation: fadeIn 0.2s ease-out;
    `;
    
    const title = document.createElement('div');
    title.innerHTML = `<strong>Consultar experto para:</strong><div style="font-size:11px;color:var(--gray-500);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${content.title}</div>`;
    title.style.cssText = 'padding: 4px 8px 8px 8px; border-bottom: 1px solid var(--gray-100); margin-bottom: 4px;';
    popup.appendChild(title);
    
    if (window.AI_DEPARTMENTS) {
        Object.values(window.AI_DEPARTMENTS).forEach(dept => {
            const btn = document.createElement('button');
            btn.innerHTML = `<span style="margin-right:8px;">${dept.icon}</span> ${dept.name}`;
            btn.style.cssText = 'text-align:left; padding:8px 12px; border:none; background:none; border-radius:6px; cursor:pointer; font-size:12px; transition: background 0.2s;';
            btn.onmouseover = () => btn.style.background = 'var(--gray-50)';
            btn.onmouseout = () => btn.style.background = 'none';
            btn.onclick = () => {
                window.consultExpertForContent(contentId, dept.id);
                popup.remove();
            };
            popup.appendChild(btn);
        });
    }
    
    document.body.appendChild(popup);
    
    // Cerrar al hacer clic fuera
    const closePopup = (e) => {
        if (!popup.contains(e.target)) {
            popup.remove();
            document.removeEventListener('click', closePopup);
        }
    };
    setTimeout(() => document.addEventListener('click', closePopup), 10);
};

window.consultExpertForContent = function(contentId, deptId) {
    window._activeAIContentId = contentId; // Guardar ID para el hand-off posterior
    const content = window.appData?.calendar?.find(c => c.id === contentId);
    const dept = window.AI_DEPARTMENTS ? window.AI_DEPARTMENTS[deptId] : null;
    
    if (!content || !window.DepartmentBus) return;
    
    const mission = dept ? dept.specificMission : 'Proporciona recomendaciones específicas desde tu área de expertise para mejorar o ejecutar esta pieza de contenido de la mejor manera posible.';

    // Preparar el contexto para la IA
    const contextText = `ANALIZAR ESTE CONTENIDO ESPECÍFICO:
Título: ${content.title}
Tipo: ${content.type}
Objetivo: ${content.objective || 'general'}
Notas: ${content.notes || 'Sin notas adicionales'}
Fecha: ${content.date}

TU MISIÓN COMO ${dept ? dept.name.toUpperCase() : 'EXPERTO'}: ${mission}`;

    // Guardar en el bus para que la IA lo vea
    window.DepartmentBus.setLastResponse(contextText, deptId || 'strategy');
    
    // Abrir asistente (usando la función específica de sidebar-ai.js)
    if (typeof window.navigateToAI === 'function') {
        window.navigateToAI('assistant');
    } else {
        window.navigateTo('ai-assistant');
    }

    const checkAI = setInterval(() => {
        if (window.aiUI) {
            clearInterval(checkAI);
            window.aiUI.setDepartment(deptId);
            // Hacer scroll a la zona de generación
            const card = document.getElementById('ai-assistant-card');
            if (card) card.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
};

console.log('✅ Lógica de Consultoría Experto IA integrada');

// ==================================================
// EXPORTAR FUNCIONES
// ==================================================
window.loadCalendar = loadCalendar;
window.loadContent = loadContent;
window.renderCalendarItems = renderCalendarItems;
window.renderMonthTabs = renderMonthTabs;
window.switchMonth = switchMonth;
window.loadUpcoming = loadUpcoming;
window.goToContent = goToContent;
window.quickAssignStatus = quickAssignStatus;
window.updateMonthCounts = updateMonthCounts;
window.openMetricsModal = openMetricsModal;
window.saveMetrics = saveMetrics;
window.calculateRetention = calculateRetention;
window.toggleAdsBudget = toggleAdsBudget;
window.deleteContent = deleteContent;


// ==================================================
// IMPORTACIÓN CSV — SISTEMA COMPLETO
// ==================================================

// --------------------------------------------------
// 1. ABRIR MODAL DE IMPORTACIÓN
// --------------------------------------------------
window.openImportModal = function() {
    var modal = document.getElementById('import-csv-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'import-csv-modal';
        modal.className = 'modal';
        modal.innerHTML = buildImportModalHTML();
        document.body.appendChild(modal);
    }
    modal.classList.add('active');
    modal.style.display = '';
    // Limpiar estado previo
    var preview = document.getElementById('import-preview');
    var fileInput = document.getElementById('csv-file-input');
    var feedback = document.getElementById('import-feedback');
    if (preview)   preview.innerHTML = '';
    if (fileInput) fileInput.value = '';
    if (feedback)  feedback.innerHTML = '';
    // Resetear botón confirmar
    var btn = document.getElementById('import-confirm-btn');
    if (btn) { btn.disabled = true; btn.textContent = '✅ Importar al calendario'; }
};

function buildImportModalHTML() {
    return '<div class="modal-content" style="max-width:700px;">'
        + '<div class="modal-header">'
        + '<h3 class="modal-title">📥 Importar Calendario desde CSV</h3>'
        + '<button class="modal-close" onclick="closeModal(\'import-csv-modal\')">×</button>'
        + '</div>'
        + '<div style="padding:20px 24px;">'

        // PASO 1 — Descargar plantilla
        + '<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:16px 20px;border-radius:12px;color:white;margin-bottom:20px;">'
        + '<div style="font-weight:700;font-size:15px;margin-bottom:6px;">📋 Paso 1 — Descargá la plantilla</div>'
        + '<div style="font-size:13px;opacity:.9;margin-bottom:12px;">La plantilla ya tiene las columnas correctas y ejemplos para guiarte. Completala en Excel o Google Sheets.</div>'
        + '<button onclick="downloadCSVTemplate()" style="background:white;color:#667eea;border:none;padding:8px 18px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;">⬇️ Descargar plantilla CSV</button>'
        + '</div>'

        // PASO 2 — Subir archivo
        + '<div style="margin-bottom:20px;">'
        + '<div style="font-weight:600;font-size:14px;margin-bottom:10px;color:var(--gray-700);">📂 Paso 2 — Subí tu CSV completado</div>'
        + '<div id="csv-drop-zone" style="border:2px dashed #d1d5db;border-radius:12px;padding:32px;text-align:center;cursor:pointer;transition:all .2s;background:var(--gray-50);" '
        + 'onclick="document.getElementById(\'csv-file-input\').click()" '
        + 'ondragover="event.preventDefault();this.style.borderColor=\'#667eea\';this.style.background=\'#f0f4ff\';" '
        + 'ondragleave="this.style.borderColor=\'#d1d5db\';this.style.background=\'var(--gray-50)\';" '
        + 'ondrop="event.preventDefault();this.style.borderColor=\'#d1d5db\';this.style.background=\'var(--gray-50)\';handleCSVDrop(event);">'
        + '<div style="font-size:36px;margin-bottom:8px;">📄</div>'
        + '<div style="font-weight:600;color:var(--gray-600);">Hacé clic o arrastrá tu archivo aquí</div>'
        + '<div style="font-size:12px;color:var(--gray-400);margin-top:4px;">Solo archivos .csv · Hasta 500 publicaciones</div>'
        + '</div>'
        + '<input type="file" id="csv-file-input" accept=".csv" style="display:none;" onchange="handleCSVFile(this.files[0])">'
        + '</div>'

        // PASO 3 — Preview
        + '<div id="import-feedback" style="margin-bottom:12px;"></div>'
        + '<div id="import-preview"></div>'

        // Opciones de importación
        + '<div id="import-options" style="display:none;margin:16px 0;padding:14px 16px;background:var(--gray-50);border-radius:10px;">'
        + '<div style="font-weight:600;font-size:13px;margin-bottom:10px;color:var(--gray-700);">⚙️ Opciones de importación</div>'
        + '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px;">'
        + '<input type="radio" name="import-mode" value="add" checked> <span><strong>Agregar</strong> al contenido existente</span>'
        + '</label>'
        + '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px;margin-top:8px;">'
        + '<input type="radio" name="import-mode" value="replace"> <span><strong>Reemplazar</strong> el contenido del mes importado</span>'
        + '</label>'
        + '</div>'

        + '</div>'
        + '<div style="padding:14px 24px;border-top:1px solid var(--gray-200);display:flex;gap:10px;justify-content:flex-end;">'
        + '<button id="import-confirm-btn" class="btn-primary" onclick="confirmImport()" disabled style="opacity:.5;">✅ Importar al calendario</button>'
        + '<button class="btn-secondary" onclick="closeModal(\'import-csv-modal\')">Cancelar</button>'
        + '</div>'
        + '</div>';
}

// --------------------------------------------------
// 2. PLANTILLA CSV — descarga con ejemplos reales
// --------------------------------------------------
window.downloadCSVTemplate = function() {
    var headers = ['fecha','hora','tipo','titulo','objetivo','estado','notas','tiene_ads','presupuesto_ads'];
    var examples = [
        ['2026-04-02','20:00','reel','El error que frena tu crecimiento','conversion','not-started','Hook: pregunta directa al problema del cliente','si','5000'],
        ['2026-04-05','19:00','carousel','5 pasos para posicionar tu marca','educativo','not-started','Carrusel educativo con tips accionables','no','0'],
        ['2026-04-08','20:00','stories','Encuesta: ¿Cuál es tu mayor desafío?','engagement','not-started','Stories interactivas con encuesta','no','0'],
        ['2026-04-10','18:00','reel','Caso de éxito cliente X','conversion','not-started','Mostrar resultados reales antes/después','si','8000'],
        ['2026-04-15','20:00','carousel','Errores que matan tu engagement','educativo','not-started','','no','0'],
        ['2026-05-01','20:00','reel','Mayo: Nueva temporada de contenido','awareness','not-started','Inicio de mes con contenido de alto impacto','si','10000'],
    ];

    var csvContent = '\uFEFF'; // BOM para que Excel lo abra en UTF-8
    csvContent += headers.join(',') + '\n';

    // Agregar fila de instrucciones como comentario (no se importa)
    csvContent += '# INSTRUCCIONES: No borres la primera fila. Tipos válidos: reel | carousel | stories\n';
    csvContent += '# Objetivos: conversion | educativo | engagement | awareness | brand\n';
    csvContent += '# Estados: not-started | design | correction | designed | scheduled | published\n';
    csvContent += '# tiene_ads: si o no\n';
    csvContent += '# fecha formato: YYYY-MM-DD (ej: 2026-04-15)\n';
    csvContent += '# ---\n';

    examples.forEach(function(row) {
        csvContent += row.map(function(v) {
            return v.indexOf(',') > -1 ? '"' + v + '"' : v;
        }).join(',') + '\n';
    });

    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;
    a.download = 'plantilla-calendario-bondi.csv';
    a.click();
    URL.revokeObjectURL(url);
};

// --------------------------------------------------
// 3. MANEJAR ARCHIVO — drop o click
// --------------------------------------------------
window.handleCSVDrop = function(e) {
    var file = e.dataTransfer.files[0];
    if (file) handleCSVFile(file);
};

window.handleCSVFile = function(file) {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
        showImportFeedback('error', '❌ El archivo debe ser .csv');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var text = e.target.result;
        parseAndPreviewCSV(text);
    };
    reader.readAsText(file, 'UTF-8');
};

// --------------------------------------------------
// 4. PARSEAR CSV Y MOSTRAR PREVIEW
// --------------------------------------------------
var _parsedItems = [];

function parseAndPreviewCSV(text) {
    _parsedItems = [];
    var errors   = [];
    var warnings = [];

    // Normalizar saltos de línea y remover BOM
    text = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var lines = text.split('\n');

    // Filtrar cabecera y comentarios
    var dataLines = lines.filter(function(l) {
        var t = l.trim();
        return t && !t.startsWith('#');
    });

    if (dataLines.length === 0) {
        showImportFeedback('error', '❌ El archivo está vacío o solo tiene comentarios');
        return;
    }

    // Detectar si la primera fila es la cabecera
    var firstRow = dataLines[0].toLowerCase();
    var startIdx = (firstRow.indexOf('fecha') > -1 || firstRow.indexOf('titulo') > -1 || firstRow.indexOf('tipo') > -1) ? 1 : 0;

    if (dataLines.length - startIdx === 0) {
        showImportFeedback('error', '❌ No hay datos después de la cabecera');
        return;
    }

    var validTypes     = ['reel','carousel','stories'];
    var validStatuses  = ['not-started','design','correction','designed','scheduled','published'];
    var validObjectives = ['conversion','educativo','engagement','awareness','brand','other'];

    for (var i = startIdx; i < dataLines.length; i++) {
        var line = dataLines[i].trim();
        if (!line) continue;

        var cols = parseCSVLine(line);

        // Mapear columnas (flexible: acepta orden canónico)
        var fecha    = (cols[0] || '').trim();
        var hora     = (cols[1] || '20:00').trim();
        var tipo     = (cols[2] || 'reel').trim().toLowerCase();
        var titulo   = (cols[3] || '').trim();
        var objetivo = (cols[4] || 'conversion').trim().toLowerCase();
        var estado   = (cols[5] || 'not-started').trim().toLowerCase();
        var notas    = (cols[6] || '').trim();
        var tieneAds = (cols[7] || 'no').trim().toLowerCase();
        var presup   = parseInt(cols[8] || '0') || 0;

        var rowNum = i + 1;

        // Validaciones
        if (!titulo) {
            errors.push('Fila ' + rowNum + ': falta el título');
            continue;
        }
        if (!fecha || !isValidDate(fecha)) {
            errors.push('Fila ' + rowNum + ' ("' + titulo + '"): fecha inválida "' + fecha + '" — usar formato YYYY-MM-DD');
            continue;
        }
        if (validTypes.indexOf(tipo) === -1) {
            warnings.push('Fila ' + rowNum + ' ("' + titulo + '"): tipo "' + tipo + '" desconocido, se usará "reel"');
            tipo = 'reel';
        }
        if (validStatuses.indexOf(estado) === -1) {
            estado = 'not-started';
        }
        if (validObjectives.indexOf(objetivo) === -1) {
            objetivo = 'conversion';
        }

        _parsedItems.push({
            id:        Date.now() + i + Math.random(),
            date:      fecha,
            time:      hora || '20:00',
            type:      tipo,
            title:     titulo,
            objective: objetivo,
            status:    estado,
            notes:     notas,
            hasAds:    tieneAds === 'si' || tieneAds === 'sí' || tieneAds === 'yes' || tieneAds === '1',
            adBudget:  presup,
            details:   {}
        });
    }

    // Mostrar resultado
    renderImportPreview(_parsedItems, errors, warnings);
}

function isValidDate(str) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
    var d = new Date(str);
    return d instanceof Date && !isNaN(d);
}

// Parser robusto de líneas CSV (maneja comas dentro de comillas)
function parseCSVLine(line) {
    var result = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
            else inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

// --------------------------------------------------
// 5. RENDERIZAR PREVIEW ANTES DE IMPORTAR
// --------------------------------------------------
function renderImportPreview(items, errors, warnings) {
    var feedback = document.getElementById('import-feedback');
    var preview  = document.getElementById('import-preview');
    var options  = document.getElementById('import-options');
    var btn      = document.getElementById('import-confirm-btn');

    var feedHtml = '';
    if (errors.length > 0) {
        feedHtml += '<div style="background:#fee2e2;border-left:4px solid #ef4444;padding:12px 16px;border-radius:8px;margin-bottom:10px;font-size:13px;">'
            + '<strong>❌ ' + errors.length + ' error(es) encontrado(s):</strong><br>'
            + errors.map(function(e) { return '• ' + e; }).join('<br>')
            + '</div>';
    }
    if (warnings.length > 0) {
        feedHtml += '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:8px;margin-bottom:10px;font-size:13px;">'
            + '<strong>⚠️ ' + warnings.length + ' advertencia(s):</strong><br>'
            + warnings.map(function(w) { return '• ' + w; }).join('<br>')
            + '</div>';
    }
    if (feedback) feedback.innerHTML = feedHtml;

    if (items.length === 0) {
        if (preview) preview.innerHTML = '<div style="text-align:center;padding:20px;color:var(--gray-400);">No se encontraron filas válidas para importar.</div>';
        if (btn)     { btn.disabled = true; btn.style.opacity = '.5'; }
        if (options) options.style.display = 'none';
        return;
    }

    // Agrupar por mes para el resumen
    var byMonth = {};
    items.forEach(function(item) {
        var m = item.date.substring(0, 7);
        if (!byMonth[m]) byMonth[m] = 0;
        byMonth[m]++;
    });

    var monthNames = { '01':'Ene','02':'Feb','03':'Mar','04':'Abr','05':'May','06':'Jun','07':'Jul','08':'Ago','09':'Sep','10':'Oct','11':'Nov','12':'Dic' };
    var summaryHtml = '<div style="background:#d1fae5;border-left:4px solid #10b981;padding:12px 16px;border-radius:8px;margin-bottom:14px;font-size:13px;">'
        + '<strong>✅ ' + items.length + ' publicaciones listas para importar</strong><br>'
        + Object.keys(byMonth).sort().map(function(m) {
            var parts = m.split('-');
            return '• ' + monthNames[parts[1]] + ' ' + parts[0] + ': ' + byMonth[m] + ' publicaciones';
        }).join('<br>')
        + '</div>';

    // Tabla preview (máx 10 filas, resto colapsado)
    var tableHtml = '<div style="overflow-x:auto;max-height:220px;overflow-y:auto;border:1px solid var(--gray-200);border-radius:10px;">'
        + '<table style="width:100%;border-collapse:collapse;font-size:13px;">'
        + '<thead><tr style="background:var(--gray-50);position:sticky;top:0;">'
        + '<th style="padding:8px 10px;text-align:left;font-weight:600;font-size:11px;color:var(--gray-500);">FECHA</th>'
        + '<th style="padding:8px 10px;text-align:left;font-weight:600;font-size:11px;color:var(--gray-500);">TÍTULO</th>'
        + '<th style="padding:8px 10px;text-align:left;font-weight:600;font-size:11px;color:var(--gray-500);">TIPO</th>'
        + '<th style="padding:8px 10px;text-align:left;font-weight:600;font-size:11px;color:var(--gray-500);">ESTADO</th>'
        + '<th style="padding:8px 10px;text-align:left;font-weight:600;font-size:11px;color:var(--gray-500);">ADS</th>'
        + '</tr></thead><tbody>'
        + items.map(function(item) {
            var typeIcons = { reel:'🎬', carousel:'📊', stories:'📲' };
            var statusLabels = { 'not-started':'⚪ Sin inicio','design':'🎨 Diseño','correction':'✏️ Corrección','designed':'✅ Diseñado','scheduled':'⏰ Programado','published':'🚀 Publicado' };
            return '<tr style="border-bottom:1px solid var(--gray-100);">'
                + '<td style="padding:7px 10px;color:var(--gray-500);">' + item.date + '</td>'
                + '<td style="padding:7px 10px;font-weight:500;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + item.title + '">' + item.title + '</td>'
                + '<td style="padding:7px 10px;">' + (typeIcons[item.type] || '') + ' ' + item.type + '</td>'
                + '<td style="padding:7px 10px;font-size:12px;">' + (statusLabels[item.status] || item.status) + '</td>'
                + '<td style="padding:7px 10px;">' + (item.hasAds ? '💰 $' + item.adBudget : '—') + '</td>'
                + '</tr>';
        }).join('')
        + '</tbody></table></div>';

    if (preview) preview.innerHTML = summaryHtml + tableHtml;
    if (options) options.style.display = 'block';
    if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.textContent = '✅ Importar ' + items.length + ' publicaciones';
    }
}

function showImportFeedback(type, msg) {
    var f = document.getElementById('import-feedback');
    var p = document.getElementById('import-preview');
    if (f) f.innerHTML = '<div style="background:' + (type==='error'?'#fee2e2':'#fef3c7') + ';border-left:4px solid ' + (type==='error'?'#ef4444':'#f59e0b') + ';padding:12px 16px;border-radius:8px;font-size:13px;">' + msg + '</div>';
    if (p) p.innerHTML = '';
    var btn = document.getElementById('import-confirm-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '.5'; }
    var options = document.getElementById('import-options');
    if (options) options.style.display = 'none';
}

// --------------------------------------------------
// 6. CONFIRMAR IMPORTACIÓN → actualizar en tiempo real
// --------------------------------------------------
window.confirmImport = async function() {
    if (_parsedItems.length === 0) return;

    var mode = document.querySelector('input[name="import-mode"]:checked')?.value || 'add';
    var account = window.currentAccount || 'bondi-media';
    var existing = window.appData?.calendar || [];

    var newCalendar;
    if (mode === 'replace') {
        // Obtener los meses que se importan
        var importMonths = [...new Set(_parsedItems.map(i => i.date.substring(0,7)))];
        // Mantener los ítems de meses NO importados + agregar los nuevos
        newCalendar = existing.filter(function(item) {
            return !importMonths.includes(item.date ? item.date.substring(0,7) : '');
        }).concat(_parsedItems);
    } else {
        // Modo agregar: combinar sin duplicar títulos+fecha
        var existingKeys = new Set(existing.map(function(i) { return i.date + '|' + i.title; }));
        var toAdd = _parsedItems.filter(function(i) {
            return !existingKeys.has(i.date + '|' + i.title);
        });
        newCalendar = existing.concat(toAdd);
    }

    // Ordenar por fecha
    newCalendar.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });

    // Persistir
    window.appData.calendar = newCalendar;
    await storage.set('bondi-calendar-' + account, newCalendar);

    // Cerrar modal
    closeModal('import-csv-modal');

    // Actualizar TODAS las vistas en tiempo real
    if (typeof renderMonthTabs       === 'function') renderMonthTabs();
    if (typeof updateMonthCounts     === 'function') updateMonthCounts();
    if (typeof renderCalendarItems   === 'function') {
        renderCalendarItems('calendar-content');
        renderContentList();
    }
    if (typeof loadUpcoming          === 'function') loadUpcoming();
    if (typeof updateSidebarBadges   === 'function') updateSidebarBadges();
    if (typeof loadDashboard         === 'function') loadDashboard();

    // Navegar al primer mes importado para mostrárselo
    var firstMonth = _parsedItems.map(i => i.date.substring(0,7)).sort()[0];
    if (firstMonth && typeof switchMonth === 'function') {
        setTimeout(function() { switchMonth(firstMonth); }, 200);
    }

    var count = _parsedItems.length;
    _parsedItems = [];

    if (typeof showSuccess === 'function') {
        showSuccess(count + ' publicaciones importadas correctamente', '📅 Calendario actualizado');
    } else {
        alert('✅ ' + count + ' publicaciones importadas correctamente');
    }
};


// ==================================================
// TOGGLE NOTAS Y MÉTRICAS EN TARJETAS
// ==================================================
window.toggleNotes = function(id, btn) {
    var prev = document.getElementById('prev-' + id);
    var full = document.getElementById('full-' + id);
    if (!prev || !full) return;
    var isExpanded = full.style.display !== 'none';
    prev.style.display = isExpanded ? 'inline' : 'none';
    full.style.display = isExpanded ? 'none' : 'inline';
    btn.textContent = isExpanded ? '▼ Ver más' : '▲ Ver menos';
};


// CSS para notas colapsables y métricas colapsables
(function() {
    if (document.getElementById('bondi-collapse-styles')) return;
    var style = document.createElement('style');
    style.id = 'bondi-collapse-styles';
    style.textContent = [
        '.calendar-notes { font-size: 13px; color: var(--gray-600); line-height: 1.5; margin: 8px 0; }',
        '.notes-toggle { background: none; border: none; color: var(--primary); font-size: 12px; cursor: pointer; padding: 2px 0; margin-top: 4px; display: block; font-weight: 500; }',
        '.notes-toggle:hover { text-decoration: underline; }',
        '.calendar-metrics-header:hover { opacity: .8; }',
        '.calendar-metrics { padding: 8px 0 4px; }',
        '.metrics-chevron { transition: none; }',
    ].join(' ');
    document.head.appendChild(style);
})();

window.toggleMetrics = function(id, header) {
    var panel = document.getElementById(id);
    if (!panel) return;
    var chevron = header.querySelector('.metrics-chevron');
    var isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    if (chevron) chevron.textContent = isOpen ? '▼ Ver métricas' : '▲ Ocultar métricas';
};

console.log('✅ calendar.js cargado correctamente');

// ==================================================
// INTEGRACIÓN CON CALENDARIO VISUAL
// ==================================================

// Función para alternar vistas (llamada desde calendar-visual.js)
window.switchCalendarView = function(viewType) {
    console.log(`🔄 Cambiando a vista: ${viewType}`);

    // Si existe la función del calendario visual, usarla
    if (typeof switchToListView === 'function' && typeof switchToCalendarView === 'function') {
        if (viewType === 'list') {
            switchToListView();
        } else if (viewType === 'calendar') {
            switchToCalendarView();
        }
    }
};

// Función para refrescar calendario visual cuando cambian datos
window.refreshVisualCalendar = function() {
    if (typeof refreshVisualCalendar === 'function') {
        refreshVisualCalendar();
    }
};

// Modificar switchMonth para actualizar calendario visual
const originalSwitchMonth = window.switchMonth;
window.switchMonth = function(month) {
    // Llamar función original
    if (originalSwitchMonth) {
        originalSwitchMonth(month);
    }

    // Actualizar calendario visual si existe
    if (typeof refreshVisualCalendar === 'function') {
        setTimeout(() => {
            refreshVisualCalendar();
        }, 100);
    }
};