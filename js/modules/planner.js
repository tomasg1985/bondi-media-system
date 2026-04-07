// ==================================================
// PLANIFICADOR VISUAL MEJORADO
// ==================================================

console.log('📅 Cargando planificador visual...');

let calendar = null;
let currentPlannerView = 'calendar'; // calendar, week, day

// ==================================================
// INICIALIZAR PLANIFICADOR
// ==================================================
window.initPlanner = function() {
    console.log('📅 Inicializando planificador visual...');
    
    // Agregar sección al sidebar
    addPlannerToSidebar();
    
    console.log('✅ Planificador inicializado');
};

// ==================================================
// AGREGAR PLANIFICADOR AL SIDEBAR
// ==================================================
function addPlannerToSidebar() {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;
    
    // Verificar si ya existe
    if (document.getElementById('planner-section')) return;
    
    const plannerSection = document.createElement('div');
    plannerSection.id = 'planner-section';
    plannerSection.className = 'nav-section';
    plannerSection.innerHTML = `
        <div class="nav-section-title">PLANIFICACIÓN</div>
        <div class="nav-item" onclick="openPlannerView('calendar')">
            <span class="nav-item-icon">📅</span>
            <span>Calendario Visual</span>
        </div>
        <div class="nav-item" onclick="openPlannerView('week')">
            <span class="nav-item-icon">📆</span>
            <span>Vista Semanal</span>
        </div>
        <div class="nav-item" onclick="openPlannerView('day')">
            <span class="nav-item-icon">📋</span>
            <span>Agenda Diaria</span>
        </div>
        <div class="nav-item" onclick="openPlannerView('timeline')">
            <span class="nav-item-icon">⏰</span>
            <span>Línea de Tiempo</span>
        </div>
    `;
    
    // Insertar después de PRINCIPAL
    const principalSection = document.querySelector('.nav-section');
    if (principalSection) {
        principalSection.insertAdjacentElement('afterend', plannerSection);
    } else {
        sidebar.appendChild(plannerSection);
    }
}

// ==================================================
// ABRIR VISTA DEL PLANIFICADOR
// ==================================================
window.openPlannerView = function(view) {
    console.log(`📅 Abriendo vista: ${view}`);
    currentPlannerView = view;
    
    // Desactivar todos los nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Activar el item clickeado
    event.currentTarget.classList.add('active');
    
    // Crear o mostrar sección del planificador
    let plannerSection = document.getElementById('planner-content');
    
    if (!plannerSection) {
        plannerSection = document.createElement('div');
        plannerSection.id = 'planner-content';
        plannerSection.className = 'section';
        document.querySelector('.content-area').appendChild(plannerSection);
    }
    
    // Ocultar otras secciones
    document.querySelectorAll('.section').forEach(s => {
        if (s.id !== 'planner-content') {
            s.classList.remove('active');
        }
    });
    
    plannerSection.classList.add('active');
    
    // Cargar vista correspondiente
    switch(view) {
        case 'calendar':
            loadCalendarView();
            break;
        case 'week':
            loadWeekView();
            break;
        case 'day':
            loadDayView();
            break;
        case 'timeline':
            loadTimelineView();
            break;
    }
};

// ==================================================
// CARGAR VISTA DE CALENDARIO (Mensual)
// ==================================================
function loadCalendarView() {
    const container = document.getElementById('planner-content');
    
    const html = `
        <style>
            .planner-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .planner-title {
                font-size: 24px;
                font-weight: 700;
            }
            .planner-controls {
                display: flex;
                gap: 12px;
            }
            .planner-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin-bottom: 24px;
            }
            .stat-box {
                background: white;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--gray-200);
            }
            .stat-label {
                font-size: 12px;
                color: var(--gray-600);
            }
            .stat-number {
                font-size: 24px;
                font-weight: 700;
                color: var(--primary);
            }
            #calendar-container {
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                min-height: 600px;
            }
            .fc-event {
                cursor: pointer;
                padding: 2px 4px;
                font-size: 12px;
            }
            .fc-event-title {
                font-weight: 500;
            }
            .reel-event { background-color: #d1fae5; border-color: #10b981; color: #065f46; }
            .carousel-event { background-color: #dbeafe; border-color: #3b82f6; color: #1e40af; }
            .stories-event { background-color: #fef3c7; border-color: #f59e0b; color: #92400e; }
        </style>
        
        <div class="planner-header">
            <div class="planner-title">📅 Calendario de Contenido</div>
            <div class="planner-controls">
                <button class="btn-secondary" onclick="previousMonth()">← Anterior</button>
                <button class="btn-secondary" onclick="nextMonth()">Siguiente →</button>
                <button class="btn-primary" onclick="openAddContentModal()">+ Nuevo</button>
            </div>
        </div>
        
        <div class="planner-stats">
            <div class="stat-box">
                <div class="stat-label">Este Mes</div>
                <div class="stat-number" id="month-total">0</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Reels</div>
                <div class="stat-number" id="month-reels">0</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Carruseles</div>
                <div class="stat-number" id="month-carousels">0</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Stories</div>
                <div class="stat-number" id="month-stories">0</div>
            </div>
        </div>
        
        <div id="calendar-container"></div>
    `;
    
    container.innerHTML = html;
    
    // Inicializar calendario después de que el DOM esté listo
    setTimeout(() => {
        initFullCalendar();
        updateMonthStats();
    }, 100);
}

// ==================================================
// INICIALIZAR FULLCALENDAR
// ==================================================
function initFullCalendar() {
    const calendarEl = document.getElementById('calendar-container');
    if (!calendarEl) return;
    
    // Limpiar contenedor
    calendarEl.innerHTML = '';
    
    // Crear eventos desde appData
    const events = window.appData.calendar.map(item => {
        const colors = {
            reel: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
            carousel: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
            stories: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }
        };
        
        const color = colors[item.type] || colors.reel;
        
        return {
            id: item.id,
            title: item.title,
            start: `${item.date}T${item.time || '20:00:00'}`,
            allDay: false,
            backgroundColor: color.bg,
            borderColor: color.border,
            textColor: color.text,
            className: `${item.type}-event`,
            extendedProps: {
                type: item.type,
                status: item.status,
                hasAds: item.hasAds,
                objective: item.objective
            }
        };
    });
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        events: events,
        eventClick: function(info) {
            const contentId = info.event.id;
            openEditContentModal(parseInt(contentId));
        },
        eventDrop: function(info) {
            // Actualizar fecha al arrastrar
            const contentId = info.event.id;
            const newDate = info.event.start.toISOString().split('T')[0];
            
            const content = window.appData.calendar.find(c => c.id == contentId);
            if (content) {
                content.date = newDate;
                storage.set(`bondi-calendar-${window.currentAccount}`, window.appData.calendar);
                updateMonthStats();
            }
        },
        datesSet: function() {
            updateMonthStats();
        },
        height: 'auto',
        firstDay: 1, // Lunes
        slotMinTime: '08:00:00',
        slotMaxTime: '23:00:00'
    });
    
    calendar.render();
}

// ==================================================
// ACTUALIZAR ESTADÍSTICAS DEL MES
// ==================================================
function updateMonthStats() {
    if (!calendar) return;
    
    const currentDate = calendar.getDate();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const monthStr = `${year}-${month}`;
    
    const monthContent = window.appData.calendar.filter(c => c.date?.startsWith(monthStr));
    
    document.getElementById('month-total').textContent = monthContent.length;
    document.getElementById('month-reels').textContent = monthContent.filter(c => c.type === 'reel').length;
    document.getElementById('month-carousels').textContent = monthContent.filter(c => c.type === 'carousel').length;
    document.getElementById('month-stories').textContent = monthContent.filter(c => c.type === 'stories').length;
}

// ==================================================
// NAVEGACIÓN DEL CALENDARIO
// ==================================================
window.previousMonth = function() {
    if (calendar) {
        calendar.prev();
        updateMonthStats();
    }
};

window.nextMonth = function() {
    if (calendar) {
        calendar.next();
        updateMonthStats();
    }
};

// ==================================================
// VISTA SEMANAL
// ==================================================
function loadWeekView() {
    const container = document.getElementById('planner-content');
    
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    
    let weekHtml = '';
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayContent = window.appData.calendar.filter(c => c.date === dateStr);
        
        weekHtml += `
            <div style="flex: 1; min-width: 130px; background: white; border-radius: 8px; padding: 12px; border: 1px solid var(--gray-200);">
                <div style="font-weight: 600; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid var(--primary);">
                    ${days[i]}<br>
                    <span style="font-size: 12px; color: var(--gray-600);">${date.toLocaleDateString()}</span>
                </div>
                <div style="min-height: 300px;">
                    ${dayContent.length === 0 ? 
                        '<p style="color: var(--gray-400); font-size: 12px; text-align: center; margin-top: 20px;">Sin contenido</p>' : 
                        dayContent.map(item => `
                            <div class="calendar-item" style="margin-bottom: 8px; cursor: pointer;" onclick="openEditContentModal(${item.id})">
                                <div style="font-size: 11px; color: var(--gray-600);">${item.time || '20:00'}</div>
                                <div style="font-weight: 600; font-size: 12px;">${item.title.substring(0, 20)}${item.title.length > 20 ? '...' : ''}</div>
                                <div style="display: flex; gap: 4px; margin-top: 4px;">
                                    <span class="badge badge-${item.type === 'reel' ? 'success' : item.type === 'carousel' ? 'info' : 'warning'}" style="font-size: 9px;">
                                        ${item.type === 'reel' ? '🎬' : item.type === 'carousel' ? '📊' : '📲'}
                                    </span>
                                    ${item.hasAds ? '<span class="badge badge-success" style="font-size: 9px;">💰</span>' : ''}
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
    }
    
    const html = `
        <style>
            .week-view {
                display: flex;
                gap: 12px;
                overflow-x: auto;
                padding: 20px 0;
            }
            .week-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding: 20px;
                background: white;
                border-radius: 12px;
            }
        </style>
        
        <div class="week-header">
            <h2 style="font-size: 24px;">📆 Vista Semanal</h2>
            <div>
                <button class="btn-secondary" onclick="previousWeek()">← Semana anterior</button>
                <button class="btn-secondary" onclick="nextWeek()">Semana siguiente →</button>
                <button class="btn-primary" onclick="openAddContentModal()">+ Nuevo</button>
            </div>
        </div>
        
        <div class="week-view">
            ${weekHtml}
        </div>
    `;
    
    container.innerHTML = html;
}

// ==================================================
// VISTA DIARIA
// ==================================================
function loadDayView() {
    const container = document.getElementById('planner-content');
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    const dayContent = window.appData.calendar.filter(c => c.date === dateStr);
    const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 a 22
    
    const html = `
        <style>
            .day-view {
                background: white;
                border-radius: 12px;
                padding: 20px;
            }
            .hour-row {
                display: flex;
                border-bottom: 1px solid var(--gray-200);
            }
            .hour-label {
                width: 80px;
                padding: 15px 10px;
                font-weight: 600;
                color: var(--gray-600);
                border-right: 1px solid var(--gray-200);
            }
            .hour-content {
                flex: 1;
                padding: 10px;
                min-height: 60px;
            }
            .day-event {
                background: var(--gray-50);
                border-left: 3px solid var(--primary);
                padding: 8px 12px;
                margin-bottom: 5px;
                border-radius: 4px;
                cursor: pointer;
            }
            .day-event:hover {
                background: var(--gray-100);
            }
        </style>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="font-size: 24px;">📋 Agenda: ${today.toLocaleDateString()}</h2>
            <div>
                <button class="btn-secondary" onclick="previousDay()">← Día anterior</button>
                <button class="btn-secondary" onclick="nextDay()">Día siguiente →</button>
                <button class="btn-primary" onclick="openAddContentModal()">+ Nuevo</button>
            </div>
        </div>
        
        <div class="day-view">
            ${hours.map(hour => {
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const events = dayContent.filter(c => {
                    const eventHour = parseInt(c.time?.split(':')[0] || 20);
                    return eventHour === hour;
                });
                
                return `
                    <div class="hour-row">
                        <div class="hour-label">${hourStr}</div>
                        <div class="hour-content" ondrop="drop(event, '${dateStr}', ${hour})" ondragover="allowDrop(event)">
                            ${events.map(event => `
                                <div class="day-event" draggable="true" ondragstart="drag(event, ${event.id})" onclick="openEditContentModal(${event.id})">
                                    <strong>${event.title}</strong>
                                    <div style="font-size: 11px; color: var(--gray-600);">
                                        ${event.type} • ${event.status || 'sin estado'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// ==================================================
// VISTA DE LÍNEA DE TIEMPO
// ==================================================
function loadTimelineView() {
    const container = document.getElementById('planner-content');
    
    // Agrupar por mes
    const months = {};
    window.appData.calendar.forEach(item => {
        const month = item.date.substring(0, 7);
        if (!months[month]) months[month] = [];
        months[month].push(item);
    });
    
    const sortedMonths = Object.keys(months).sort();
    
    let timelineHtml = '';
    
    sortedMonths.forEach(month => {
        const monthName = new Date(month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        const monthItems = months[month];
        
        timelineHtml += `
            <div style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px; color: var(--primary);">${monthName}</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${monthItems.sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => {
                        const date = new Date(item.date).toLocaleDateString('es-ES');
                        return `
                            <div style="display: flex; align-items: center; gap: 15px; background: white; padding: 12px; border-radius: 8px; border: 1px solid var(--gray-200); cursor: pointer;" onclick="openEditContentModal(${item.id})">
                                <div style="min-width: 100px; font-weight: 600;">${date}</div>
                                <div style="min-width: 80px;">
                                    <span class="badge badge-${item.type === 'reel' ? 'success' : item.type === 'carousel' ? 'info' : 'warning'}">
                                        ${item.type}
                                    </span>
                                </div>
                                <div style="flex: 1;">
                                    <strong>${item.title}</strong>
                                </div>
                                <div style="min-width: 100px; color: var(--gray-600); font-size: 12px;">
                                    ${item.time || '20:00'}
                                </div>
                                <div>
                                    ${item.hasAds ? '<span class="badge badge-success">💰</span>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    const html = `
        <style>
            .timeline-view {
                max-height: 700px;
                overflow-y: auto;
                padding: 20px;
                background: var(--gray-50);
                border-radius: 12px;
            }
        </style>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="font-size: 24px;">⏰ Línea de Tiempo</h2>
            <button class="btn-primary" onclick="openAddContentModal()">+ Nuevo</button>
        </div>
        
        <div class="timeline-view">
            ${timelineHtml}
        </div>
    `;
    
    container.innerHTML = html;
}

// ==================================================
// FUNCIONES PARA DRAG & DROP
// ==================================================
window.allowDrop = function(ev) {
    ev.preventDefault();
};

window.drag = function(ev, contentId) {
    ev.dataTransfer.setData('text/plain', contentId);
};

window.drop = function(ev, date, hour) {
    ev.preventDefault();
    const contentId = ev.dataTransfer.getData('text/plain');
    
    const content = window.appData.calendar.find(c => c.id == contentId);
    if (content) {
        const newTime = `${hour.toString().padStart(2, '0')}:00`;
        content.date = date;
        content.time = newTime;
        
        storage.set(`bondi-calendar-${window.currentAccount}`, window.appData.calendar);
        loadDayView(); // Recargar vista
    }
};

// ==================================================
// NAVEGACIÓN DE SEMANAS
// ==================================================
window.previousWeek = function() {
    // Implementar navegación de semanas
    alert('Navegación de semanas próximamente');
};

window.nextWeek = function() {
    alert('Navegación de semanas próximamente');
};

window.previousDay = function() {
    alert('Navegación de días próximamente');
};

window.nextDay = function() {
    alert('Navegación de días próximamente');
};

// ==================================================
// INICIALIZAR
// ==================================================
// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initPlanner, 2500);
    });
} else {
    setTimeout(initPlanner, 2500);
}

console.log('✅ Planificador visual cargado');