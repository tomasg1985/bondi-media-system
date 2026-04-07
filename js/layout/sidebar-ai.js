// ==================================================
// SIDEBAR AI - VERSIÓN CORREGIDA
// FIX #1: getSidebarHTML usa concatenación de strings en lugar de template
//   literal para evitar problemas de encoding/parsing que causaban que solo
//   se mostrara la sección EQUIPO (team-manager.js la agregaba sola porque
//   sidebar-ai.js fallaba silenciosamente).
// FIX #2: Se agrega id="team-section" al div EQUIPO para que la verificación
//   de team-manager.js (getElementById('team-section')) lo encuentre y no
//   agregue una sección duplicada.
// FIX #3: Eliminadas redefiniciones de getUserPermissions/isAdmin/getCurrentUser
//   que sobreescribían la versión autoritativa de permissions.js.
// ==================================================

console.log('🎨 Inicializando sidebar IA...');

let isReconstructing = false;

function reconstructSidebar() {
    if (isReconstructing) return;
    isReconstructing = true;

    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) {
        console.log('⏳ Sidebar no disponible, reintentando...');
        isReconstructing = false;
        setTimeout(reconstructSidebar, 500);
        return;
    }

    sidebar.innerHTML = getSidebarHTML();
    updateBadges();
    addNavigationEvents();
    
    // Sincronizar badge de licencia si existe el módulo
    if (window.LicensingUI && typeof window.LicensingUI.updateGlobalStatusBadge === 'function') {
        window.LicensingUI.updateGlobalStatusBadge();
    }
    
    console.log('✅ Sidebar reconstruido');
    setTimeout(function() { isReconstructing = false; }, 500);
}

// Usa concatenación de strings para evitar cualquier problema de encoding
// con template literals (backticks) que en algunos editores/copias se corrompen
function getSidebarHTML() {
    var html = '';

    // PRINCIPAL
    html += '<div class="nav-section">';
    html += '<div class="nav-section-title">Principal</div>';
    html += '<div class="nav-item" data-section="dashboard"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></span><span>Dashboard</span></div>';
    html += '<div class="nav-item" data-section="calendar"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span><span>Calendario Visual</span></div>';
    html += '<div class="nav-item" data-section="content"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span><span>Contenido</span><span class="nav-badge" id="sidebar-content-count">0</span></div>';
    // Ocultar temporalmente la sección de copy publishing hasta que el hosting esté listo.
    html += '</div>';

    // INTELIGENCIA ARTIFICIAL
    html += '<div class="nav-section">';
    html += '<div class="nav-section-title">Inteligencia Artificial</div>';
    html += '<div class="nav-item" data-section="ai-assistant"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="14" x2="22" y2="14"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="14" x2="4" y2="14"/></svg></span><span>Asistente IA</span><span class="nav-badge nav-badge-new">beta</span></div>';
    html += '<div class="nav-item" data-section="ai-benchmarking"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg></span><span>Benchmarking</span></div>';
    html += '<div class="nav-item" data-section="ai-platform"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span><span>Multiplataforma</span></div>';
    html += '<div class="nav-item" data-section="ai-predictive"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span><span>Predictivo</span><span class="nav-badge nav-badge-new">nuevo</span></div>';
    html += '<div class="nav-item" data-section="ai-hooks"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.5 2.8-1.4 3.8L20 16a2 2 0 0 1-2.8 2.8L11 12.5V19a3 3 0 0 1-6 0v-7a6 6 0 0 1 7-5.9z"/></svg></span><span>Hooks</span><span class="nav-badge nav-badge-new">nuevo</span></div>';
    html += '</div>';

    // CAPTACIÓN
    html += '<div class="nav-section">';
    html += '<div class="nav-section-title">Captación</div>';
    html += '<div class="nav-item" data-section="prosp-messages"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/></svg></span><span>Mensajes DM</span></div>';
    html += '<div class="nav-item" data-section="prosp-responses"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg></span><span>Respuestas DM</span></div>';
    html += '<div class="nav-item" data-section="prosp-guide"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></span><span>Guión de reunión</span></div>';
    html += '<div class="nav-item" data-section="prosp-hashtags"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg></span><span>Hashtags</span></div>';
    html += '<div class="nav-item" data-section="prosp-qualify"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span><span>Calificar prospecto</span></div>';
    html += '<div class="nav-item" data-section="prosp-limits"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><span>Límites diarios</span><span class="nav-badge" id="limits-badge" style="display:none;">!</span></div>';
    html += '<div class="nav-item" data-section="prosp-schedule"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span><span>Horarios óptimos</span></div>';
    html += '<div class="nav-item" data-section="prosp-nichos"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span><span>Editor de nichos</span></div>';

    html += '</div>';

    // GESTIÓN
    html += '<div class="nav-section">';
    html += '<div class="nav-section-title">Gestión</div>';
    html += '<div class="nav-item" data-section="tracking"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></span><span>Tracking Reels</span></div>';
    html += '<div class="nav-item" data-section="leads"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span>Leads & Pipeline</span></div>';
    html += '<div class="nav-item" data-section="comparisons"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span><span>Comparativas</span></div>';
    html += '<div class="nav-item" data-section="briefings"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></svg></span><span>Briefings</span></div>';
    html += '<div class="nav-item" data-section="analysis"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span><span>Análisis Mensual</span></div>';
    html += '</div>';

    // EQUIPO
    html += '<div class="nav-section" id="team-section">';
    html += '<div class="nav-section-title">Equipo</div>';
    html += '<div class="nav-item" data-section="team-dashboard"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span>Dashboard Equipo</span><span class="nav-badge" id="team-active-badge">0</span></div>';
    html += '<div class="nav-item" data-section="team-members"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span>Miembros</span></div>';
    html += '<div class="nav-item" data-section="team-invitations"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span><span>Invitaciones</span><span class="nav-badge" id="invitations-badge" style="display:none;">0</span></div>';
    html += '<div class="nav-item" data-section="team-permissions"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><span>Permisos</span></div>';
    html += '<div class="nav-item" data-section="team-activity"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span><span>Actividad</span></div>';
    html += '</div>';

    // COLABORADORES
    html += '<div class="nav-section">';
    html += '<div class="nav-section-title">Equipo</div>';
    html += '<div class="nav-item" data-section="team-portal"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span>Colaboradores</span><span class="nav-badge" id="team-portal-badge">0</span></div>';
    html += '</div>';

    // SISTEMA
    html += '<div class="nav-section">';
    html += '<div class="nav-section-title">Sistema</div>';
    html += '<div class="nav-item" data-section="licensing"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span><span>Planes y Licencias</span></div>';
    html += '<div class="nav-item" data-section="reports"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg></span><span>Reportes</span></div>';
    html += '<div class="nav-item" data-section="config"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span><span>Configuración</span></div>';
    html += '</div>';

    // CLIENTES
    html += '<div class="nav-section nav-section-clients">';
    html += '<button class="btn-clients-manage" onclick="openManageClientsModal()"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></span><span>Gestionar Clientes</span></button>';
    html += '<button class="btn-clients-add" onclick="openAddClientModal()"><span class="nav-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></span><span>Agregar Cliente</span></button>';
    html += '</div>';

    return html;
}

function updateBadges() {
    var contentBadge = document.getElementById('sidebar-content-count');
    if (contentBadge && window.appData) {
        contentBadge.textContent = (window.appData.calendar && window.appData.calendar.length) || 0;
    }
    var teamBadge = document.getElementById('team-active-badge');
    if (teamBadge && window.teamMembers) {
        teamBadge.textContent = window.teamMembers.length || 0;
    }
    var invitesBadge = document.getElementById('invitations-badge');
    if (invitesBadge && window.teamInvitations) {
        invitesBadge.textContent = window.teamInvitations.length;
        invitesBadge.style.display = window.teamInvitations.length > 0 ? 'block' : 'none';
    }
}

function addNavigationEvents() {
    document.querySelectorAll('.nav-item[data-section]').forEach(function(item) {
        item.removeEventListener('click', handleNavClick);
        item.addEventListener('click', handleNavClick);
    });
}

function handleNavClick(e) {
    var section = this.dataset.section;
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    this.classList.add('active');
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });

    if (section.indexOf('ai-') === 0) {
        window.navigateToAI(section.replace('ai-', ''));
    } else if (section === 'team-portal') {
        // Activar la sección visualmente
        var tpSection = document.getElementById('team-portal');
        if (tpSection) tpSection.classList.add('active');
        // Renderizar contenido
        if (typeof window.renderTeamPortalSection === 'function') {
            window.renderTeamPortalSection();
        }
        // Actualizar badge
        var tpBadge = document.getElementById('team-portal-badge');
        if (tpBadge) {
            var members = typeof window.getTeamMembers === 'function' ? window.getTeamMembers() : [];
            tpBadge.textContent = members.length;
        }
    } else if (section.indexOf('team-') === 0) {
        window.navigateToTeam(section);
    } else {
        if (typeof window.navigateTo === 'function') window.navigateTo(section);
    }
}

window.navigateToAI = function(section) {
    console.log('🤖 Navegando a IA:', section);
    
    // Desactivar todas las otras secciones para evitar solapamientos
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    
    // Desactivar todos los items del nav
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    // Activar el item correspondiente en el sidebar
    var navItem = document.querySelector(`.nav-item[data-section="ai-${section}"]`);
    if (navItem) navItem.classList.add('active');

    var aiContainer = document.getElementById('ai-content-container');
    if (!aiContainer) {
        aiContainer = document.createElement('div');
        aiContainer.id = 'ai-content-container';
        aiContainer.className = 'section active';
        var contentArea = document.querySelector('.content-area');
        if (contentArea) contentArea.appendChild(aiContainer);
    } else {
        aiContainer.classList.add('active');
    }
    aiContainer.innerHTML = '<div style="padding:60px;text-align:center;">Cargando módulo...</div>';
    if (section === 'copy-publisher') {
        aiContainer.innerHTML = '<div style="padding:50px;text-align:center;max-width:600px;margin:0 auto;">'
            + '<div style="font-size:40px;margin-bottom:14px;">🚧</div>'
            + '<h2>Copy por publicación no disponible</h2>'
            + '<p style="color:var(--gray-600);font-size:14px;line-height:1.6;margin-top:10px;">Esta opción está temporalmente oculta hasta que el servicio de hosting esté configurado correctamente. Volvé a intentarlo más tarde.</p>'
            + '</div>';
        return;
    }
    setTimeout(function() {
        // Diagnóstico: loguear qué funciones de IA están disponibles
        console.log('🔍 Módulos IA disponibles:', { initOptimizedAI: typeof window.initOptimizedAI, initPredictiveAI: typeof window.initPredictiveAI, initHookLibrary: typeof window.initHookLibrary, section: section });
        // Leer las funciones en el momento del clic (no al definir el mapa)
        // así cualquier script que cargue después del sidebar también funciona
        var moduleMap = {
            assistant:      window.initOptimizedAI || window.initAIAssistant,
            'copy-publisher': window.initCopyPublisherAI || window.initAIAssistant,
            benchmarking:   window.initBenchmarking,
            platform:       window.initPlatformOptimizer,
            predictive:     window.initPredictiveAI,
            hooks:          window.initHookLibrary
        };
        var fn = moduleMap[section];
        if (typeof fn === 'function') {
            fn(aiContainer);
        } else {
            // Último intento: buscar la función por nombre dinámico
            var fnName = 'init' + section.charAt(0).toUpperCase() + section.slice(1) + 'AI';
            var fnAlt  = window[fnName];
            if (typeof fnAlt === 'function') {
                fnAlt(aiContainer);
            } else {
                aiContainer.innerHTML = '<div style="padding:40px;text-align:center;">'
                    + '<div style="font-size:40px;margin-bottom:12px;">🔧</div>'
                    + '<p style="color:var(--gray-600);font-size:15px;">El módulo <strong>' + section + '</strong> no está cargado.</p>'
                    + '<p style="color:var(--gray-400);font-size:13px;margin-top:8px;">Verificá que el archivo correspondiente está en js/ai-modules/ y recargá la página.</p>'
                    + '</div>';
            }
        }
    }, 300);
};

window.navigateToTeam = function(section) {
    console.log('👥 Navegando a equipo:', section);
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    var teamSection = document.getElementById('team-section-content');
    if (!teamSection) {
        teamSection = document.createElement('div');
        teamSection.id = 'team-section-content';
        teamSection.className = 'section active';
        var ca = document.querySelector('.content-area');
        if (ca) ca.appendChild(teamSection);
    } else {
        teamSection.classList.add('active');
    }
    if (typeof window.closeAllMenus === 'function') window.closeAllMenus();
    var sectionMap = {
        'team-dashboard':   window.loadTeamDashboard,
        'team-members':     window.loadTeamMembersList,
        'team-invitations': window.loadTeamInvitationsList,
        'team-permissions': window.loadTeamPermissions,
        'team-activity':    window.loadTeamActivity
    };
    if (typeof sectionMap[section] === 'function') sectionMap[section]();
};

function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(reconstructSidebar, 1200);
        });
    } else {
        setTimeout(reconstructSidebar, 1200);
    }
}

init();
console.log('✅ sidebar-ai.js cargado correctamente');