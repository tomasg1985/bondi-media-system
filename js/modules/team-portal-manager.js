// ==================================================
// TEAM PORTAL MANAGER — Gestión de colaboradores
// Portal de acceso para el equipo de Bondi Media
// ==================================================

console.log('👥 Cargando team-portal-manager.js...');

var TEAM_STORAGE_KEY  = 'bondi-team-members';
var TEAM_SESSION_KEY  = 'team-portal-session';

// ── Roles y permisos disponibles ──────────────────
var TEAM_ROLES = {
    community_manager: {
        label:       'Community Manager',
        color:       '#3B82F6',
        bg:          '#EFF6FF',
        border:      '#BFDBFE',
        icon:        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        description: 'Gestiona el contenido y métricas de sus clientes asignados',
        perms: {
            verCalendario:   true,
            crearContenido:  true,
            editarContenido: true,
            eliminarContenido: false,
            cargarMetricas:  true,
            verMetricas:     true,
            gestionarClientes: false,
            verTodosClientes:  false,
            configuracion:   false,
            reportes:        true,
        }
    },
    editor: {
        label:       'Editor de Contenido',
        color:       '#8B5CF6',
        bg:          '#F5F3FF',
        border:      '#DDD6FE',
        icon:        '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
        description: 'Crea y edita contenido, sin acceso a métricas ni clientes',
        perms: {
            verCalendario:     true,
            crearContenido:    true,
            editarContenido:   true,
            eliminarContenido: false,
            cargarMetricas:    false,
            verMetricas:       false,
            gestionarClientes: false,
            verTodosClientes:  false,
            configuracion:     false,
            reportes:          false,
        }
    },
    analista: {
        label:       'Analista',
        color:       '#10B981',
        bg:          '#ECFDF5',
        border:      '#A7F3D0',
        icon:        '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>',
        description: 'Solo lectura y carga de métricas, sin edición de contenido',
        perms: {
            verCalendario:     true,
            crearContenido:    false,
            editarContenido:   false,
            eliminarContenido: false,
            cargarMetricas:    true,
            verMetricas:       true,
            gestionarClientes: false,
            verTodosClientes:  false,
            configuracion:     false,
            reportes:          true,
        }
    },
    admin: {
        label:       'Administrador',
        color:       '#F97316',
        bg:          '#FFF7ED',
        border:      '#FED7AA',
        icon:        '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
        description: 'Acceso completo a todos los clientes y funciones del sistema',
        perms: {
            verCalendario:     true,
            crearContenido:    true,
            editarContenido:   true,
            eliminarContenido: true,
            cargarMetricas:    true,
            verMetricas:       true,
            gestionarClientes: true,
            verTodosClientes:  true,
            configuracion:     true,
            reportes:          true,
        }
    }
};

var PERM_LABELS = {
    verCalendario:     'Ver calendario',
    crearContenido:    'Crear contenido',
    editarContenido:   'Editar contenido',
    eliminarContenido: 'Eliminar contenido',
    cargarMetricas:    'Cargar métricas',
    verMetricas:       'Ver métricas',
    gestionarClientes: 'Gestionar clientes',
    verTodosClientes:  'Ver todos los clientes',
    configuracion:     'Configuración del sistema',
    reportes:          'Ver reportes',
};

// ── Storage ───────────────────────────────────────
function getTeamMembers() {
    try { return JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY) || '[]'); }
    catch(e) { return []; }
}
function saveTeamMembersLocal(data) {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(data));
}

// ── Render sección en el admin ────────────────────
window.renderTeamPortalSection = function() {
    var c = document.getElementById('team-portal-section');
    if (!c) return;

    var members = getTeamMembers();
    var clients = (window.accounts || []).filter(function(a){ return a.id !== 'bondi-media'; });

    c.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div>'
        + '<h2 style="font-size:18px;font-weight:700;color:#0D1117;">Colaboradores</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Gestioná el acceso al portal del equipo para cada colaborador</p>'
        + '</div>'
        + '<button class="btn-primary" onclick="openAddTeamMemberModal()" style="display:flex;align-items:center;gap:6px;">'
        + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
        + 'Agregar colaborador</button>'
        + '</div>'

        // Roles disponibles
        + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">'
        + Object.keys(TEAM_ROLES).map(function(k) {
            var r = TEAM_ROLES[k];
            var count = members.filter(function(m){ return m.role === k; }).length;
            return '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:12px 14px;">'
                + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
                + '<div style="width:28px;height:28px;border-radius:8px;background:' + r.bg + ';border:1px solid ' + r.border + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
                + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="' + r.color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + r.icon + '</svg>'
                + '</div>'
                + '<span style="font-size:12px;font-weight:700;color:#0D1117;">' + r.label + '</span>'
                + '</div>'
                + '<div style="font-size:11px;color:#9CA3AF;">' + count + ' colaborador' + (count !== 1 ? 'es' : '') + '</div>'
                + '</div>';
        }).join('')
        + '</div>'

        // Lista de colaboradores
        + (members.length === 0
            ? '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:48px 20px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
              + '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" style="display:block;margin:0 auto 12px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
              + '<p style="font-size:14px;font-weight:600;color:#374151;margin-bottom:6px;">Sin colaboradores todavía</p>'
              + '<p style="font-size:13px;color:#9CA3AF;margin-bottom:16px;">Agregá tu primer colaborador para asignarle clientes y permisos</p>'
              + '<button class="btn-primary" onclick="openAddTeamMemberModal()">+ Agregar colaborador</button>'
              + '</div>'
            : '<div style="display:flex;flex-direction:column;gap:10px;">'
              + members.map(function(m) { return renderMemberCard(m, clients); }).join('')
              + '</div>'
        );

    // ── Delegated listener para todos los botones de la tarjeta ──────────
    if (c && !c._tmBound) {
        c._tmBound = true;
        c.addEventListener('click', function(e) {
            var btn = e.target.closest('button[data-mid], button.tm-copy-btn');
            if (!btn) return;
            var mid = btn.getAttribute('data-mid');
            if (btn.classList.contains('tm-edit-btn'))     { openEditTeamMemberModal(mid); }
            if (btn.classList.contains('tm-activate-btn')) { setTeamPortalAccess(mid, 'active'); }
            if (btn.classList.contains('tm-pause-btn'))    { setTeamPortalAccess(mid, 'paused'); }
            if (btn.classList.contains('tm-cred-btn'))     { openTeamCredentialsModal(mid); }
            if (btn.classList.contains('tm-copy-btn'))     { copyTeamPortalLink(); }
            if (btn.classList.contains('tm-delete-btn'))   { deleteTeamMember(mid, btn.getAttribute('data-name')); }
        });
    }
};

function renderMemberCard(m, clients) {
    var role = TEAM_ROLES[m.role] || TEAM_ROLES.community_manager;
    var initials = (m.name || '?').split(' ').map(function(w){ return w[0]; }).slice(0,2).join('').toUpperCase();
    var avatarBg = role.color;
    var assignedClients = (m.assignedClients || []).map(function(cid) {
        return (clients.find(function(c){ return c.id === cid; }) || {}).name || cid;
    }).filter(Boolean);
    var statusCfg = m.portalAccess === 'active'
        ? { label:'Acceso activo', bg:'#D1FAE5', color:'#065F46', border:'#A7F3D0' }
        : { label:'Sin acceso',    bg:'#F3F4F6', color:'#9CA3AF', border:'#E5E7EB' };

    return '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'

        // Header
        + '<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;">'
        + '<div style="width:44px;height:44px;border-radius:50%;background:' + avatarBg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.12);">'
        + (m.photo ? '<img src="' + m.photo + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">' : initials)
        + '</div>'
        + '<div style="flex:1;min-width:0;">'
        + '<div style="font-size:14px;font-weight:700;color:#0D1117;">' + (m.name || 'Sin nombre') + '</div>'
        + '<div style="font-size:12px;color:#9CA3AF;margin-bottom:8px;">' + (m.email || '') + (m.phone ? ' · ' + m.phone : '') + '</div>'
        + '<div style="display:flex;gap:6px;flex-wrap:wrap;">'
        + '<span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:' + role.bg + ';color:' + role.color + ';border:1px solid ' + role.border + ';">' + role.label + '</span>'
        + '<span style="font-size:10px;font-weight:600;padding:3px 9px;border-radius:999px;background:' + statusCfg.bg + ';color:' + statusCfg.color + ';border:1px solid ' + statusCfg.border + ';">'
        + '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle;margin-right:3px;"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        + 'Portal: ' + statusCfg.label + '</span>'
        + '</div></div>'
        + '<div style="display:flex;gap:6px;flex-shrink:0;">'
        + '<button class="btn-secondary btn-sm tm-edit-btn" data-mid="' + m.id + '" title="Editar">'
        + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
        + ' Editar</button>'
        + '</div>'
        + '</div>'

        // Clientes asignados
        + '<div style="border-top:1px solid #F3F4F6;padding-top:12px;margin-bottom:12px;">'
        + '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9CA3AF;margin-bottom:8px;">Clientes asignados</div>'
        + (assignedClients.length
            ? '<div style="display:flex;gap:6px;flex-wrap:wrap;">'
              + assignedClients.map(function(name) {
                  return '<span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;background:#F3F4F6;color:#374151;border:1px solid #E5E7EB;">' + name + '</span>';
              }).join('') + '</div>'
            : '<span style="font-size:12px;color:#C4C9D4;">Sin clientes asignados</span>'
        )
        + '</div>'

        // Portal de acceso
        + '<div style="border-top:1px solid #F3F4F6;padding-top:12px;">'
        + '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9CA3AF;margin-bottom:8px;">Portal del colaborador</div>'
        + '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">'

        + '<button class="btn-sm tm-activate-btn ' + (m.portalAccess === 'active' ? 'btn-success' : 'btn-secondary') + '" data-mid="' + m.id + '">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        + ' Activar</button>'

        + '<button class="btn-sm btn-secondary tm-pause-btn" data-mid="' + m.id + '" style="' + (m.portalAccess !== 'active' ? 'opacity:.5;' : '') + '">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>'
        + ' Pausar</button>'

        + '<button class="btn-sm btn-secondary tm-cred-btn" data-mid="' + m.id + '">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>'
        + ' Credenciales</button>'

        + '<button class="btn-sm btn-secondary tm-copy-btn" title="Copiar link del portal">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
        + ' Copiar link</button>'

        + '<button class="btn-sm btn-secondary" onclick="deleteTeamMember(\'' + m.id + '\',\'' + (m.name||'').replace(/'/g,"\\'") + '\')" style="margin-left:auto;color:#EF4444;border-color:#FECACA;">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>'
        + ' Eliminar</button>'

        + (m.portalUsername ? '<span style="font-size:11px;color:#9CA3AF;padding:4px 8px;background:#F3F4F6;border-radius:6px;">👤 ' + m.portalUsername + '</span>' : '')
        + '</div></div>'
        + '</div>';
}

// ── Modal: agregar colaborador ─────────────────────
window.openAddTeamMemberModal = function() {
    var existing = document.getElementById('add-team-member-modal');
    if (existing) { existing.style.display = 'flex'; existing.classList.add('active'); return; }

    var modal = document.createElement('div');
    modal.id = 'add-team-member-modal';
    modal.className = 'modal';
    modal.style.cssText = 'z-index:10002;';

    var clients = (window.accounts || []).filter(function(a){ return a.id !== 'bondi-media'; });
    var roleOpts = Object.keys(TEAM_ROLES).map(function(k) {
        return '<option value="' + k + '">' + TEAM_ROLES[k].label + '</option>';
    }).join('');
    var clientChecks = clients.map(function(c) {
        return '<label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;border-bottom:1px solid #F8FAFC;">'
            + '<input type="checkbox" value="' + c.id + '" class="new-member-client-check" style="accent-color:#F97316;">'
            + '<span style="font-size:12px;color:#374151;">' + c.name + '</span>'
            + '</label>';
    }).join('');

    var box = document.createElement('div');
    box.className = 'modal-content';
    box.style.maxWidth = '540px';
    box.innerHTML = '<div class="modal-header">'
        + '<span class="modal-title" style="display:flex;align-items:center;gap:8px;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>Nuevo colaborador</span>'
        + '<button class="modal-close" id="close-add-team-btn">×</button>'
        + '</div>'
        + '<div style="padding:18px 20px;display:flex;flex-direction:column;gap:12px;max-height:70vh;overflow-y:auto;">'
        + '<div class="form-row">'
        + '<div class="form-group"><label class="form-label">Nombre completo *</label>'
        + '<input class="form-input" id="nm-name" placeholder="Ej: Valentina García"></div>'
        + '<div class="form-group"><label class="form-label">Email *</label>'
        + '<input class="form-input" id="nm-email" type="email" placeholder="vale@bondimedia.com"></div>'
        + '</div>'
        + '<div class="form-row">'
        + '<div class="form-group"><label class="form-label">Teléfono</label>'
        + '<input class="form-input" id="nm-phone" placeholder="+54911..."></div>'
        + '<div class="form-group"><label class="form-label">Rol *</label>'
        + '<select class="form-select" id="nm-role" onchange="updateRolePermsPreview()">' + roleOpts + '</select></div>'
        + '</div>'
        // Preview de permisos
        + '<div id="nm-perms-preview" style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:10px;padding:12px 14px;">'
        + '</div>'
        // Clientes asignados
        + '<div class="form-group"><label class="form-label">Clientes asignados</label>'
        + (clients.length
            ? '<div style="border:1px solid #E5E7EB;border-radius:8px;padding:4px 12px;max-height:150px;overflow-y:auto;">' + clientChecks + '</div>'
            : '<div style="font-size:12px;color:#9CA3AF;padding:8px 0;">No hay clientes registrados todavía</div>'
        )
        + '</div>'
        + '<div class="form-group"><label class="form-label">Notas internas</label>'
        + '<textarea class="form-input" id="nm-notes" rows="2" placeholder="Ej: Especialista en Reels, horario tarde..."></textarea></div>'
        + '</div>'
        + '<div class="modal-actions">'
        + '<button class="btn-success" id="save-new-team-btn">Guardar colaborador</button>'
        + '<button class="btn-secondary" id="cancel-new-team-btn">Cancelar</button>'
        + '</div>';

    modal.appendChild(box);
    modal.addEventListener('click', function(e){ if (e.target === modal) closeTeamModal('add-team-member-modal'); });
    document.body.appendChild(modal);

    document.getElementById('close-add-team-btn').addEventListener('click', function(){ closeTeamModal('add-team-member-modal'); });
    document.getElementById('cancel-new-team-btn').addEventListener('click', function(){ closeTeamModal('add-team-member-modal'); });
    document.getElementById('save-new-team-btn').addEventListener('click', saveNewTeamMember);

    modal.style.display = 'flex';
    modal.classList.add('active');
    updateRolePermsPreview();
};

window.updateRolePermsPreview = function() {
    var roleKey = document.getElementById('nm-role')?.value || 'community_manager';
    var role = TEAM_ROLES[roleKey];
    if (!role) return;
    var preview = document.getElementById('nm-perms-preview');
    if (!preview) return;
    var perms = role.perms;
    var allowed = [], denied = [];
    Object.keys(perms).forEach(function(k) {
        if (perms[k]) allowed.push(PERM_LABELS[k] || k);
        else denied.push(PERM_LABELS[k] || k);
    });
    preview.innerHTML = '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:8px;">Permisos del rol: ' + role.label + '</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:5px;">'
        + allowed.map(function(p) {
            return '<span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:999px;background:#D1FAE5;color:#065F46;border:1px solid #A7F3D0;">✓ ' + p + '</span>';
        }).join('')
        + denied.map(function(p) {
            return '<span style="font-size:10px;padding:2px 8px;border-radius:999px;background:#F3F4F6;color:#9CA3AF;border:1px solid #E5E7EB;">✕ ' + p + '</span>';
        }).join('')
        + '</div>';
};

window.saveNewTeamMember = function() {
    var name  = document.getElementById('nm-name')?.value?.trim();
    var email = document.getElementById('nm-email')?.value?.trim();
    var role  = document.getElementById('nm-role')?.value;
    if (!name || !email) { showMsg && showMsg('Nombre y email son obligatorios'); return; }
    var assignedClients = Array.from(document.querySelectorAll('.new-member-client-check:checked')).map(function(el){ return el.value; });
    var members = getTeamMembers();
    var member = {
        id:              'team-' + Date.now(),
        name:            name,
        email:           email,
        phone:           document.getElementById('nm-phone')?.value?.trim() || '',
        role:            role || 'community_manager',
        assignedClients: assignedClients,
        notes:           document.getElementById('nm-notes')?.value?.trim() || '',
        portalAccess:    'disabled',
        portalUsername:  '',
        portalPassword:  '',
        createdAt:       new Date().toISOString(),
    };
    members.push(member);
    saveTeamMembersLocal(members);
    closeTeamModal('add-team-member-modal');
    window.renderTeamPortalSection();
    if (typeof showSuccess === 'function') showSuccess('Colaborador "' + name + '" agregado correctamente');
};

// ── Modal: editar colaborador ──────────────────────
window.openEditTeamMemberModal = function(memberId) {
    var members = getTeamMembers();
    var m = members.find(function(x){ return x.id === memberId; });
    if (!m) return;

    var existing = document.getElementById('edit-team-member-modal');
    if (existing) { existing.parentNode.removeChild(existing); }

    var modal = document.createElement('div');
    modal.id = 'edit-team-member-modal';
    modal.className = 'modal';
    modal.style.cssText = 'z-index:10002;';

    var clients = (window.accounts || []).filter(function(a){ return a.id !== 'bondi-media'; });
    var roleOpts = Object.keys(TEAM_ROLES).map(function(k) {
        return '<option value="' + k + '"' + (m.role === k ? ' selected' : '') + '>' + TEAM_ROLES[k].label + '</option>';
    }).join('');
    var clientChecks = clients.map(function(c) {
        var checked = (m.assignedClients || []).indexOf(c.id) >= 0 ? 'checked' : '';
        return '<label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;border-bottom:1px solid #F8FAFC;">'
            + '<input type="checkbox" value="' + c.id + '" ' + checked + ' class="edit-member-client-check" style="accent-color:#F97316;">'
            + '<span style="font-size:12px;color:#374151;">' + c.name + '</span>'
            + '</label>';
    }).join('');

    // Permisos personalizados
    var customPerms = m.customPerms || (TEAM_ROLES[m.role] ? Object.assign({}, TEAM_ROLES[m.role].perms) : {});
    var permToggles = Object.keys(PERM_LABELS).map(function(k) {
        var val = customPerms[k] !== undefined ? customPerms[k] : (TEAM_ROLES[m.role] && TEAM_ROLES[m.role].perms[k]);
        return '<label style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid #F8FAFC;cursor:pointer;">'
            + '<span style="font-size:12px;color:#374151;">' + PERM_LABELS[k] + '</span>'
            + '<input type="checkbox" data-perm="' + k + '" ' + (val ? 'checked' : '') + ' class="edit-perm-check" style="accent-color:#F97316;width:16px;height:16px;">'
            + '</label>';
    }).join('');

    var box = document.createElement('div');
    box.className = 'modal-content';
    box.style.maxWidth = '560px';
    box.innerHTML = '<div class="modal-header">'
        + '<span class="modal-title">Editar colaborador</span>'
        + '<button class="modal-close" id="close-edit-team-btn">×</button>'
        + '</div>'
        + '<div style="padding:18px 20px;display:flex;flex-direction:column;gap:12px;max-height:72vh;overflow-y:auto;">'
        + '<div class="form-row">'
        + '<div class="form-group"><label class="form-label">Nombre completo</label>'
        + '<input class="form-input" id="em-name" value="' + (m.name||'') + '"></div>'
        + '<div class="form-group"><label class="form-label">Email</label>'
        + '<input class="form-input" id="em-email" type="email" value="' + (m.email||'') + '"></div>'
        + '</div>'
        + '<div class="form-row">'
        + '<div class="form-group"><label class="form-label">Teléfono</label>'
        + '<input class="form-input" id="em-phone" value="' + (m.phone||'') + '"></div>'
        + '<div class="form-group"><label class="form-label">Rol base</label>'
        + '<select class="form-select" id="em-role">' + roleOpts + '</select></div>'
        + '</div>'

        // Permisos personalizados
        + '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:10px;padding:12px 14px;">'
        + '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:10px;">Permisos personalizados</div>'
        + '<div style="font-size:11px;color:#6B7280;margin-bottom:10px;">Podés ajustar los permisos individualmente sin cambiar el rol base.</div>'
        + permToggles
        + '</div>'

        // Clientes asignados
        + '<div class="form-group"><label class="form-label">Clientes asignados</label>'
        + (clients.length
            ? '<div style="border:1px solid #E5E7EB;border-radius:8px;padding:4px 12px;max-height:130px;overflow-y:auto;">' + clientChecks + '</div>'
            : '<div style="font-size:12px;color:#9CA3AF;">No hay clientes registrados</div>'
        )
        + '</div>'
        + '<div class="form-group"><label class="form-label">Notas internas</label>'
        + '<textarea class="form-input" id="em-notes" rows="2">' + (m.notes||'') + '</textarea></div>'
        + '</div>'
        + '<div class="modal-actions">'
        + '<button class="btn-success" id="save-edit-team-btn">Guardar cambios</button>'
        + '<button class="btn-secondary" id="cancel-edit-team-btn">Cancelar</button>'
        + '</div>';

    modal.appendChild(box);
    modal.addEventListener('click', function(e){ if (e.target === modal) closeTeamModal('edit-team-member-modal'); });
    document.body.appendChild(modal);

    document.getElementById('close-edit-team-btn').addEventListener('click', function(){ closeTeamModal('edit-team-member-modal'); });
    document.getElementById('cancel-edit-team-btn').addEventListener('click', function(){ closeTeamModal('edit-team-member-modal'); });
    document.getElementById('save-edit-team-btn').addEventListener('click', function(){ saveEditedTeamMember(memberId); });

    modal.style.display = 'flex';
    modal.classList.add('active');
};

window.saveEditedTeamMember = function(memberId) {
    var members = getTeamMembers();
    var idx = members.findIndex(function(x){ return x.id === memberId; });
    if (idx === -1) return;

    var assignedClients = Array.from(document.querySelectorAll('.edit-member-client-check:checked')).map(function(el){ return el.value; });
    var customPerms = {};
    document.querySelectorAll('.edit-perm-check').forEach(function(el) {
        customPerms[el.getAttribute('data-perm')] = el.checked;
    });

    members[idx] = Object.assign(members[idx], {
        name:            document.getElementById('em-name')?.value?.trim() || members[idx].name,
        email:           document.getElementById('em-email')?.value?.trim() || members[idx].email,
        phone:           document.getElementById('em-phone')?.value?.trim() || '',
        role:            document.getElementById('em-role')?.value || members[idx].role,
        assignedClients: assignedClients,
        customPerms:     customPerms,
        notes:           document.getElementById('em-notes')?.value?.trim() || '',
    });
    saveTeamMembersLocal(members);
    closeTeamModal('edit-team-member-modal');
    window.renderTeamPortalSection();
    if (typeof showSuccess === 'function') showSuccess('Colaborador actualizado correctamente');
};

// ── Portal access ─────────────────────────────────
window.setTeamPortalAccess = function(memberId, access) {
    var members = getTeamMembers();
    var idx = members.findIndex(function(x){ return x.id === memberId; });
    if (idx === -1) return;
    members[idx].portalAccess = access;
    saveTeamMembersLocal(members);
    window.renderTeamPortalSection();
    var labels = { active:'Portal activado', paused:'Portal pausado' };
    if (typeof showSuccess === 'function') showSuccess(labels[access] || 'Acceso actualizado');
};

// ── Credenciales ──────────────────────────────────
window.openTeamCredentialsModal = function(memberId) {
    var members = getTeamMembers();
    var m = members.find(function(x){ return x.id === memberId; });
    if (!m) return;

    var existing = document.getElementById('team-cred-modal');
    if (existing) existing.parentNode.removeChild(existing);

    var modal = document.createElement('div');
    modal.id = 'team-cred-modal';
    modal.className = 'modal';
    modal.style.cssText = 'z-index:10003;';

    var box = document.createElement('div');
    box.className = 'modal-content';
    box.style.maxWidth = '440px';
    box.innerHTML = '<div class="modal-header">'
        + '<span class="modal-title">Credenciales — ' + (m.name||'Colaborador') + '</span>'
        + '<button class="modal-close" id="close-cred-team-btn">×</button>'
        + '</div>'
        + '<div style="padding:18px 20px;display:flex;flex-direction:column;gap:12px;">'
        + '<div class="form-group"><label class="form-label">Usuario</label>'
        + '<input class="form-input" id="tc-user" value="' + (m.portalUsername||'') + '" placeholder="usuario.colaborador"></div>'
        + '<div class="form-group"><label class="form-label">Contraseña</label>'
        + '<div style="display:flex;gap:8px;">'
        + '<input class="form-input" id="tc-pass" value="' + (m.portalPassword||'') + '" placeholder="••••••••" style="flex:1;">'
        + '<button class="btn-secondary btn-sm" id="gen-pass-team-btn" style="flex-shrink:0;">Generar</button>'
        + '</div></div>'
        + '<div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:10px;padding:12px;">'
        + '<div style="font-size:11px;font-weight:700;color:#0369A1;margin-bottom:4px;">Link del portal</div>'
        + '<div style="font-size:12px;color:#0C4A6E;word-break:break-all;">' + getTeamPortalLink() + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="modal-actions">'
        + '<button class="btn-success" id="save-cred-team-btn">Guardar credenciales</button>'
        + '<button class="btn-secondary" id="cancel-cred-team-btn">Cancelar</button>'
        + '</div>';

    modal.appendChild(box);
    modal.addEventListener('click', function(e){ if (e.target === modal) closeTeamModal('team-cred-modal'); });
    document.body.appendChild(modal);

    document.getElementById('close-cred-team-btn').addEventListener('click', function(){ closeTeamModal('team-cred-modal'); });
    document.getElementById('cancel-cred-team-btn').addEventListener('click', function(){ closeTeamModal('team-cred-modal'); });
    document.getElementById('save-cred-team-btn').addEventListener('click', function(){ saveTeamCredentials(memberId); });
    var genBtn = document.getElementById('gen-pass-team-btn');
    if (genBtn) genBtn.addEventListener('click', function(){ document.getElementById('tc-pass').value = genTeamPass(); });

    modal.style.display = 'flex';
    modal.classList.add('active');
};

function genTeamPass() {
    var chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    return Array.from({length: 10}, function(){ return chars[Math.floor(Math.random()*chars.length)]; }).join('');
}

window.saveTeamCredentials = function(memberId) {
    var user = document.getElementById('tc-user')?.value?.trim();
    var pass = document.getElementById('tc-pass')?.value?.trim();
    if (!user || !pass) { alert('Usuario y contraseña son obligatorios'); return; }
    var members = getTeamMembers();
    var idx = members.findIndex(function(x){ return x.id === memberId; });
    if (idx === -1) return;
    members[idx].portalUsername = user;
    members[idx].portalPassword = pass;
    saveTeamMembersLocal(members);
    closeTeamModal('team-cred-modal');
    window.renderTeamPortalSection();
    if (typeof showSuccess === 'function') showSuccess('Credenciales guardadas correctamente');
};

window.copyTeamPortalLink = function() {
    var link = getTeamPortalLink();
    navigator.clipboard.writeText(link).then(function() {
        if (typeof showSuccess === 'function') showSuccess('Link del portal copiado');
    });
};

function getTeamPortalLink() {
    var base = window.location.href.replace(/\/[^/]*$/, '/');
    return base + 'team-portal.html';
}

window.deleteTeamMember = function(memberId, name) {
    if (!confirm('¿Eliminar al colaborador "' + name + '"? Esta acción no se puede deshacer.')) return;
    var members = getTeamMembers().filter(function(x){ return x.id !== memberId; });
    saveTeamMembersLocal(members);
    window.renderTeamPortalSection();
    if (typeof showSuccess === 'function') showSuccess('Colaborador eliminado');
};

// ── Helpers ───────────────────────────────────────
function closeTeamModal(id) {
    var el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.classList.remove('active'); }
}

// ── Exponer para init ─────────────────────────────
window.getTeamMembers = getTeamMembers;
window.TEAM_ROLES     = TEAM_ROLES;

console.log('✅ team-portal-manager.js cargado');