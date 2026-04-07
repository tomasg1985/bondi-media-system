// ==================================================
// FORCE-UPDATE.JS - Actualización forzada del sistema
// ==================================================

console.log('🔄 Cargando actualizador forzado...');

// Función para recargar datos desde localStorage
window.reloadDataFromStorage = function() {
    console.log('📦 Recargando datos desde localStorage...');
    
    const account = window.currentAccount || 'bondi-media';
    const storedData = localStorage.getItem(`bondi-calendar-${account}`);
    
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            if (window.appData) {
                window.appData.calendar = parsedData;
                console.log(`✅ Datos recargados: ${parsedData.length} items`);
            } else {
                window.appData = { calendar: parsedData };
                console.log(`✅ appData creado con ${parsedData.length} items`);
            }
        } catch (e) {
            console.error('❌ Error parseando datos:', e);
        }
    } else {
        console.log('📦 No hay datos en localStorage');
        if (window.appData) {
            window.appData.calendar = [];
        } else {
            window.appData = { calendar: [] };
        }
    }
};

// Función para forzar renderizado completo
window.forceFullRender = function() {
    console.log('🎨 Forzando renderizado completo...');
    
    // 1. Recargar datos
    reloadDataFromStorage();
    
    // 2. Forzar renderizado de calendario
    const calendarContainer = document.getElementById('calendar-content');
    const contentContainer = document.getElementById('content-list');
    const monthTabsContainer = document.getElementById('month-tabs');
    
    if (calendarContainer) {
        console.log('📅 Renderizando calendario...');
        if (typeof renderCalendarItems === 'function') {
            renderCalendarItems('calendar-content');
        } else {
            // Render manual si no existe la función
            renderCalendarManually('calendar-content');
        }
    }
    
    if (contentContainer) {
        console.log('📝 Renderizando contenido...');
        if (typeof renderFilteredContent === 'function' && window._contentFilters && (window._contentFilters.type !== 'all' ||
            window._contentFilters.status !== 'all' ||
            window._contentFilters.search ||
            window._contentFilters.metrics !== 'all' ||
            window._contentFilters.objective !== 'all')) {
            renderFilteredContent();
        } else if (typeof renderContentList === 'function') {
            renderContentList();
        } else if (typeof renderCalendarItems === 'function') {
            renderCalendarItems('content-list');
        } else {
            renderCalendarManually('content-list');
        }
    }
    
    // 3. Actualizar tabs
    if (monthTabsContainer) {
        console.log('📆 Actualizando tabs...');
        if (typeof renderMonthTabs === 'function') {
            renderMonthTabs();
        } else {
            updateTabsManually();
        }
    }
    
    // 4. Actualizar contadores
    if (typeof updateMonthCounts === 'function') {
        updateMonthCounts();
    } else {
        updateCountsManually();
    }
    
    // 5. Actualizar próximas publicaciones
    if (typeof loadUpcoming === 'function') {
        loadUpcoming();
    }
    
    console.log('✅ Renderizado forzado completado');
};

// Render manual si las funciones no existen
function renderCalendarManually(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const activeTab = document.querySelector('.month-tab.active');
    const currentMonth = activeTab ? activeTab.dataset.month : '2026-03';
    
    const monthContent = (window.appData?.calendar || []).filter(c => c.date && c.date.startsWith(currentMonth));
    
    if (monthContent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <p><strong>No hay contenido para este mes</strong></p>
                <p style="margin-top: 8px; color: var(--gray-600);">
                    Haz clic en "+ Nuevo Contenido" para comenzar
                </p>
            </div>
        `;
        return;
    }
    
    let html = '';
    monthContent.forEach(item => {
        html += `
            <div class="calendar-item" data-id="${item.id}">
                <div class="calendar-date">📅 ${item.date} ${item.time || ''}</div>
                <div class="calendar-title">${item.title || 'Sin título'}</div>
                <div class="calendar-type">
                    <span class="badge badge-secondary">${item.type || 'reel'}</span>
                </div>
                <div class="calendar-actions">
                    <button class="btn-secondary btn-sm" onclick="editContent(${item.id})">✏️ Editar</button>
                    <button class="btn-danger btn-sm" onclick="deleteContent(${item.id})">🗑️ Eliminar</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateTabsManually() {
    const tabsContainer = document.getElementById('month-tabs');
    if (!tabsContainer) return;
    
    const months = [
        { value: '2026-03', label: 'Marzo 2026' },
        { value: '2026-04', label: 'Abril 2026' },
        { value: '2026-05', label: 'Mayo 2026' }
    ];
    
    let tabsHtml = '';
    months.forEach(month => {
        const count = (window.appData?.calendar || []).filter(c => c.date && c.date.startsWith(month.value)).length;
        const isActive = month.value === '2026-03';
        
        tabsHtml += `
            <div class="month-tab ${isActive ? 'active' : ''}" data-month="${month.value}" onclick="switchMonth('${month.value}')">
                ${month.label} <span class="month-tab-count">${count}</span>
            </div>
        `;
    });
    
    tabsContainer.innerHTML = tabsHtml;
}

function updateCountsManually() {
    const months = ['2026-03', '2026-04', '2026-05'];
    months.forEach(month => {
        const count = (window.appData?.calendar || []).filter(c => c.date && c.date.startsWith(month)).length;
        const tab = document.querySelector(`.month-tab[data-month="${month}"] .month-tab-count`);
        if (tab) tab.textContent = count;
    });
}

// Función de emergencia para recargar todo
window.emergencyReload = function() {
    console.log('🚨 RECARGA DE EMERGENCIA');
    forceFullRender();
    setTimeout(forceFullRender, 500);
};

// Hookear eventos de modales
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔌 Instalando hooks de actualización...');
    
    // Hookear función de guardado
    const originalSaveNewContent = window.saveNewContent;
    if (originalSaveNewContent) {
        window.saveNewContent = function() {
            originalSaveNewContent();
            setTimeout(forceFullRender, 300);
        };
    }
    
    // Hookear función de eliminación
    const originalDeleteContent = window.deleteContent;
    if (originalDeleteContent) {
        window.deleteContent = function(id) {
            if (originalDeleteContent(id) !== false) {
                setTimeout(forceFullRender, 300);
            }
        };
    }
    
    // Hookear función de importación
    const originalImport = window.importCalendarFile;
    if (originalImport) {
        window.importCalendarFile = function() {
            originalImport();
            setTimeout(forceFullRender, 1000);
        };
    }
    
    console.log('✅ Hooks instalados');
});

console.log('✅ Actualizador forzado listo');