// ==================================================
// CALENDAR VISUAL MODULE - VERSIÓN NUEVA CON DRAG & DROP
// Vista mensual en grilla con FullCalendar + drag & drop
// ==================================================

console.log('📅 Cargando calendar-visual.js...');

// ==================================================
// VARIABLES GLOBALES
// ==================================================
let calendarInstance = null;
let isVisualMode = false;

// ==================================================
// FUNCIÓN PRINCIPAL PARA INICIALIZAR CALENDARIO VISUAL
// ==================================================
function initVisualCalendar() {
    console.log('📅 Inicializando calendario visual...');

    const container = document.getElementById('calendar-content');
    if (!container) {
        console.error('❌ Container calendar-content no encontrado');
        return;
    }

    // Crear estructura HTML para el calendario visual
    container.innerHTML = `
        <div class="visual-calendar-container">
            <div class="calendar-controls">
                <div class="view-toggle">
                    <button id="list-view-btn" class="view-toggle-btn active" onclick="switchToListView()">
                        📋 Lista
                    </button>
                    <button id="calendar-view-btn" class="view-toggle-btn" onclick="switchToCalendarView()">
                        📅 Calendario
                    </button>
                </div>
                <div class="calendar-nav">
                    <button onclick="prevMonth()" class="nav-btn">◀</button>
                    <span id="current-month-title" class="month-title"></span>
                    <button onclick="nextMonth()" class="nav-btn">▶</button>
                </div>
            </div>
            <div id="visual-calendar" class="visual-calendar-grid"></div>
        </div>
    `;

    // Inicializar en vista de lista por defecto
    switchToListView();
}

// ==================================================
// CAMBIAR A VISTA DE LISTA (ORIGINAL)
// ==================================================
function switchToListView() {
    console.log('📋 Cambiando a vista de lista');
    isVisualMode = false;

    // Actualizar botones
    document.getElementById('list-view-btn').classList.add('active');
    document.getElementById('calendar-view-btn').classList.remove('active');

    // Mostrar vista de lista original
    const container = document.getElementById('visual-calendar');
    container.innerHTML = '';

    // Cargar contenido original
    if (typeof renderCalendarItems === 'function') {
        renderCalendarItems('calendar-content');
    }
}

// ==================================================
// CAMBIAR A VISTA DE CALENDARIO VISUAL
// ==================================================
function switchToCalendarView() {
    console.log('📅 Cambiando a vista de calendario');
    isVisualMode = true;

    // Actualizar botones
    document.getElementById('list-view-btn').classList.remove('active');
    document.getElementById('calendar-view-btn').classList.add('active');

    // Renderizar calendario visual
    renderVisualCalendar();
}

// ==================================================
// RENDERIZAR CALENDARIO VISUAL CON FULLCALENDAR
// ==================================================
function renderVisualCalendar() {
    const container = document.getElementById('visual-calendar');
    if (!container) return;

    // Limpiar contenedor
    container.innerHTML = '';

    // Obtener datos del calendario
    const calendarData = window.appData?.calendar || [];
    const currentMonth = getCurrentCalendarMonth();

    // Crear estructura de grilla mensual
    const calendarHTML = createMonthlyGrid(currentMonth, calendarData);
    container.innerHTML = calendarHTML;

    // Actualizar título del mes
    updateMonthTitle(currentMonth);

    // Hacer elementos arrastrables
    makeItemsDraggable();
}

// ==================================================
// CREAR GRILLA MENSUAL
// ==================================================
function createMonthlyGrid(monthYear, calendarData) {
    const [year, month] = monthYear.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Comenzar desde domingo

    let html = '<div class="calendar-week days-header">';
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    html += '</div>';

    let currentDate = new Date(startDate);

    for (let week = 0; week < 6; week++) {
        html += '<div class="calendar-week">';

        for (let day = 0; day < 7; day++) {
            const isCurrentMonth = currentDate.getMonth() === month - 1;
            const isToday = isSameDay(currentDate, new Date());
            const dateStr = formatDateForCalendar(currentDate);

            // Filtrar contenido para este día
            const dayContent = calendarData.filter(item =>
                item.date && isSameDay(new Date(item.date), currentDate)
            );

            html += `
                <div class="calendar-day ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}"
                     data-date="${dateStr}">
                    <div class="day-number">${currentDate.getDate()}</div>
                    <div class="day-content" id="day-${dateStr}">
                        ${dayContent.map(item => createCalendarItem(item)).join('')}
                    </div>
                </div>
            `;

            currentDate.setDate(currentDate.getDate() + 1);
        }

        html += '</div>';

        // Si ya pasamos el último día del mes, salir
        if (currentDate > lastDay && currentDate.getDay() !== 0) break;
    }

    return `<div class="monthly-calendar">${html}</div>`;
}

// ==================================================
// CREAR ITEM PARA CALENDARIO VISUAL
// ==================================================
function createCalendarItem(item) {
    const statusColors = {
        'not-started': '#94a3b8',
        'design': '#f59e0b',
        'correction': '#3b82f6',
        'designed': '#10b981',
        'scheduled': '#8b5cf6',
        'published': '#10b981'
    };

    const typeIcons = {
        'reel': '🎬',
        'carousel': '📊',
        'stories': '📱'
    };

    const status = item.status || 'not-started';
    const typeIcon = typeIcons[item.type] || '📝';

    return `
        <div class="calendar-item-visual"
             data-id="${item.id}"
             draggable="true"
             style="background-color: ${statusColors[status]}"
             onclick="openEditContentModal(${item.id})"
             title="${item.title || 'Sin título'} - ${item.time || ''}">
            <div class="item-icon">${typeIcon}</div>
            <div class="item-title">${truncateText(item.title || 'Sin título', 20)}</div>
            <div class="item-time">${item.time || ''}</div>
        </div>
    `;
}

// ==================================================
// FUNCIONES DE DRAG & DROP
// ==================================================
function makeItemsDraggable() {
    const items = document.querySelectorAll('.calendar-item-visual');
    const days = document.querySelectorAll('.calendar-day');

    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    days.forEach(day => {
        day.addEventListener('dragover', handleDragOver);
        day.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const itemId = e.dataTransfer.getData('text/plain');
    const newDate = e.currentTarget.dataset.date;

    if (itemId && newDate) {
        moveContentToDate(itemId, newDate);
    }
}

// ==================================================
// MOVER CONTENIDO A NUEVA FECHA
// ==================================================
function moveContentToDate(itemId, newDate) {
    console.log(`📅 Moviendo contenido ${itemId} a fecha ${newDate}`);

    // Encontrar el item en appData
    const item = window.appData.calendar.find(c => c.id == itemId);
    if (!item) {
        console.error('❌ Item no encontrado');
        return;
    }

    // Actualizar fecha
    item.date = newDate;

    // Guardar cambios usando el sistema de storage
    const currentAccount = localStorage.getItem('bondi-current-account') || 'bondi-media';
    storage.set(`bondi-calendar-${currentAccount}`, window.appData.calendar);

    // Re-renderizar calendario
    if (isVisualMode) {
        renderVisualCalendar();
    } else {
        renderCalendarItems('calendar-content');
    }

    // Actualizar otras vistas
    if (typeof renderContentList === 'function') {
        renderContentList();
    }
    if (typeof updateDashboardStats === 'function') {
        updateDashboardStats();
    }

    // Mostrar notificación
    alert('✅ Contenido movido exitosamente');
}

// ==================================================
// FUNCIONES DE NAVEGACIÓN
// ==================================================
function prevMonth() {
    const currentMonth = getCurrentCalendarMonth();
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 2, 1); // Mes anterior
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    setCurrentCalendarMonth(newMonth);
    if (isVisualMode) renderVisualCalendar();
}

function nextMonth() {
    const currentMonth = getCurrentCalendarMonth();
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month, 1); // Mes siguiente
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    setCurrentCalendarMonth(newMonth);
    if (isVisualMode) renderVisualCalendar();
}

// ==================================================
// UTILIDADES PARA FECHAS
// ==================================================
function getCurrentCalendarMonth() {
    const activeTab = document.querySelector('.month-tab.active');
    return activeTab ? activeTab.dataset.month : '2026-03';
}

function setCurrentCalendarMonth(month) {
    // Actualizar tabs
    document.querySelectorAll('.month-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.month === month) {
            tab.classList.add('active');
        }
    });
}

function updateMonthTitle(monthYear) {
    const [year, month] = monthYear.split('-').map(Number);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const title = `${monthNames[month - 1]} ${year}`;
    const titleEl = document.getElementById('current-month-title');
    if (titleEl) titleEl.textContent = title;
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function formatDateForCalendar(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ==================================================
// INTEGRACIÓN CON SISTEMA EXISTENTE
// ==================================================
function refreshVisualCalendar() {
    if (isVisualMode) {
        renderVisualCalendar();
    }
}

// ==================================================
// INICIALIZACIÓN
// ==================================================
document.addEventListener('DOMContentLoaded', function() {
    // Agregar botón de toggle al cargar la página
    setTimeout(() => {
        initVisualCalendar();
    }, 100);
});