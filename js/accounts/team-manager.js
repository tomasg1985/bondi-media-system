// ==================================================
// TEAM MANAGER - COLABORACIÓN EN EQUIPO
// ==================================================

console.log('👥 Cargando team-manager.js...');

// ==================================================
// ESTRUCTURA DE DATOS - CON LOS MIEMBROS DE LA CAPTURA
// ==================================================
let teamMembers = [];
let teamInvitations = [];
let currentUserRole = 'admin';

const ROLES = {
    admin: {
        name: 'Administrador',
        level: 3,
        color: '#ef4444',
        permissions: [
            'Ver dashboard',
            'Editar contenido',
            'Eliminar contenido',
            'Agregar métricas',
            'Gestionar clientes',
            'Gestionar equipo',
            'Ver reportes',
            'Exportar datos',
            'Configuración'
        ]
    },
    editor: {
        name: 'Editor',
        level: 2,
        color: '#3b82f6',
        permissions: [
            'Ver dashboard',
            'Editar contenido',
            'Agregar métricas',
            'Ver clientes',
            'Ver reportes'
        ]
    },
    viewer: {
        name: 'Espectador',
        level: 1,
        color: '#10b981',
        permissions: [
            'Ver dashboard',
            'Ver contenido',
            'Ver reportes'
        ]
    }
};

// ==================================================
// DATOS DE EJEMPLO POR DEFECTO
// ==================================================
const DEFAULT_MEMBERS = [
    {
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@bondimedia.com',
        role: 'admin',
        initials: 'AD',
        status: 'active',
        lastActive: new Date(Date.now() - 5 * 60000).toISOString() // Hace 5 minutos
    },
    {
        id: 'maria-1',
        name: 'María González',
        email: 'maria@bondimedia.com',
        role: 'editor',
        initials: 'MG',
        status: 'active',
        lastActive: new Date(Date.now() - 15 * 60000).toISOString() // Hace 15 minutos
    },
    {
        id: 'juan-1',
        name: 'Juan López',
        email: 'juan@bondimedia.com',
        role: 'editor',
        initials: 'JL',
        status: 'inactive',
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString() // Hace 2 días
    },
    {
        id: 'carlos-1',
        name: 'Carlos Pérez',
        email: 'carlos@bondimedia.com',
        role: 'viewer',
        initials: 'CP',
        status: 'active',
        lastActive: new Date(Date.now() - 60 * 60000).toISOString() // Hace 1 hora
    }
];

// ==================================================
// FUNCIÓN PARA CALCULAR TIEMPO DESDE ÚLTIMA ACTIVIDAD
// ==================================================
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Nunca';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace unos segundos';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
}

// ==================================================
// INICIALIZAR GESTIÓN DE EQUIPO
// ==================================================
window.initTeamManagement = async function() {
    console.log('👥 Inicializando gestión de equipo...');
    
    await loadTeamMembers();
    await loadTeamInvitations();
    
    // Actualizar badges si existen
    updateBadges();
    
    console.log('✅ Gestión de equipo inicializada');
    console.log('📊 Miembros cargados:', teamMembers.length);
};

// ==================================================
// CARGAR MIEMBROS DEL EQUIPO
// ==================================================
async function loadTeamMembers() {
    try {
        const saved = await storage.get(`team-members-${window.currentAccount || 'default'}`);
        if (saved && Array.isArray(saved) && saved.length > 0) {
            teamMembers = saved;
            console.log('📂 Miembros cargados desde storage:', teamMembers.length);
        } else {
            // Usar datos de ejemplo
            teamMembers = [...DEFAULT_MEMBERS];
            await saveTeamMembers();
            console.log('📋 Usando miembros por defecto:', teamMembers.length);
        }
    } catch (error) {
        console.error('Error cargando miembros:', error);
        teamMembers = [...DEFAULT_MEMBERS];
    }
}

async function saveTeamMembers() {
    try {
        await storage.set(`team-members-${window.currentAccount || 'default'}`, teamMembers);
        console.log('💾 Miembros guardados en storage');
    } catch (error) {
        console.error('Error guardando miembros:', error);
    }
}

// ==================================================
// CARGAR INVITACIONES PENDIENTES
// ==================================================
async function loadTeamInvitations() {
    try {
        const saved = await storage.get(`team-invitations-${window.currentAccount || 'default'}`);
        if (saved && Array.isArray(saved)) {
            teamInvitations = saved;
        } else {
            teamInvitations = [];
        }
    } catch (error) {
        console.error('Error cargando invitaciones:', error);
        teamInvitations = [];
    }
}

async function saveTeamInvitations() {
    try {
        await storage.set(`team-invitations-${window.currentAccount || 'default'}`, teamInvitations);
    } catch (error) {
        console.error('Error guardando invitaciones:', error);
    }
}

// ==================================================
// ACTUALIZAR BADGES
// ==================================================
function updateBadges() {
    const teamBadge = document.getElementById('team-active-badge');
    if (teamBadge) {
        teamBadge.textContent = teamMembers.length;
    }

    const invitesBadge = document.getElementById('invitations-badge');
    if (invitesBadge) {
        invitesBadge.textContent = teamInvitations.length;
        invitesBadge.style.display = teamInvitations.length > 0 ? 'block' : 'none';
    }
}

// ==================================================
// AGREGAR SECCIÓN DE EQUIPO AL SIDEBAR
// ==================================================
function addTeamSectionToSidebar() {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;
    
    // Verificar si ya existe
    if (document.getElementById('team-section')) return;
    
    const teamSection = document.createElement('div');
    teamSection.id = 'team-section';
    teamSection.className = 'nav-section';
    teamSection.innerHTML = `
        <div class="nav-section-title">EQUIPO</div>
        <div class="nav-item" data-section="team-dashboard" onclick="navigateToTeam('team-dashboard')">
            <span class="nav-item-icon">👥</span>
            <span>Dashboard Equipo</span>
            <span class="nav-badge" id="team-active-badge">${teamMembers.length}</span>
        </div>
        <div class="nav-item" data-section="team-members" onclick="navigateToTeam('team-members')">
            <span class="nav-item-icon">👤</span>
            <span>Miembros</span>
        </div>
        <div class="nav-item" data-section="team-invitations" onclick="navigateToTeam('team-invitations')">
            <span class="nav-item-icon">📨</span>
            <span>Invitaciones</span>
            <span class="nav-badge" id="invitations-badge" style="${teamInvitations.length === 0 ? 'display:none;' : ''}">${teamInvitations.length}</span>
        </div>
        <div class="nav-item" data-section="team-permissions" onclick="navigateToTeam('team-permissions')">
            <span class="nav-item-icon">🔐</span>
            <span>Permisos</span>
        </div>
        <div class="nav-item" data-section="team-activity" onclick="navigateToTeam('team-activity')">
            <span class="nav-item-icon">📊</span>
            <span>Actividad</span>
        </div>
    `;
    
    sidebar.appendChild(teamSection);
}

// ==================================================
// LISTA DE MIEMBROS - CON TRES PUNTOS Y SIN SCROLL
// ==================================================
window.loadTeamMembersList = function() {
    console.log('📋 Cargando lista de miembros...');
    console.log('👥 Miembros actuales:', teamMembers);
    
    const container = document.getElementById('team-section-content');
    if (!container) {
        console.error('❌ Contenedor team-section-content no encontrado');
        return;
    }
    
    const html = `
        <style>
            .team-card {
                background: white;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .team-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                flex-wrap: wrap;
                gap: 16px;
            }
            .team-header h2 {
                font-size: 20px;
                font-weight: 700;
            }
            .members-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                table-layout: fixed; /* Fija el ancho de las columnas */
            }
            .members-table th {
                background: var(--gray-100);
                padding: 16px 8px;
                text-align: left;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                color: var(--gray-600);
                border-bottom: 2px solid var(--gray-300);
            }
            .members-table td {
                padding: 16px 8px;
                border-bottom: 1px solid var(--gray-200);
                vertical-align: middle;
            }
            .members-table tr:hover {
                background: var(--gray-50);
            }
            
            /* Anchos fijos para cada columna */
            .members-table th:nth-child(1) { width: 18%; } /* MIEMBRO */
            .members-table th:nth-child(2) { width: 22%; } /* EMAIL */
            .members-table th:nth-child(3) { width: 12%; } /* ROL */
            .members-table th:nth-child(4) { width: 12%; } /* ESTADO */
            .members-table th:nth-child(5) { width: 18%; } /* ÚLTIMA ACTIVIDAD */
            .members-table th:nth-child(6) { width: 18%; } /* ACCIONES */
            
            .member-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .member-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary) 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 13px;
                flex-shrink: 0;
            }
            .member-name {
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .email-cell {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--gray-600);
                font-size: 13px;
            }
            .role-badge {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
            }
            .role-badge.admin {
                background: #dbeafe;
                color: #1e40af;
            }
            .role-badge.editor {
                background: #dcfce7;
                color: #166534;
            }
            .role-badge.viewer {
                background: #f3f4f6;
                color: #4b5563;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 8px;
                border-radius: 20px;
                font-size: 12px;
                white-space: nowrap;
            }
            .status-badge.active {
                background: #d1fae5;
                color: #065f46;
            }
            .status-badge.inactive {
                background: #fee2e2;
                color: #991b1b;
            }
            .status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                display: inline-block;
            }
            .status-dot.active {
                background: #10b981;
                box-shadow: 0 0 0 2px #d1fae5;
            }
            .status-dot.inactive {
                background: #ef4444;
                box-shadow: 0 0 0 2px #fee2e2;
            }
            .last-active {
                color: var(--gray-600);
                font-size: 13px;
                white-space: nowrap;
            }
            
            /* Estilos para el menú de tres puntos */
            .action-menu {
                position: relative;
                display: flex;
                justify-content: center;
            }
            .action-button {
                background: var(--gray-100);
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                cursor: pointer;
                color: var(--gray-700);
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                margin: 0 auto;
            }
            .action-button:hover {
                background: var(--primary);
                color: white;
            }
            .action-menu-content {
                display: none;
                position: absolute;
                right: 0;
                top: 100%;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                min-width: 140px;
                z-index: 9999;
                border: 1px solid var(--gray-200);
                margin-top: 4px;
                pointer-events: auto;
            }
            .action-menu-content.show {
                display: block;
                animation: fadeIn 0.1s ease;
            }
            .action-menu-item {
                padding: 10px 14px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--gray-700);
                transition: background 0.2s;
                user-select: none;
            }
            .action-menu-item:hover {
                background: var(--gray-100);
            }
            .action-menu-item.delete:hover {
                background: #fee2e2;
                color: var(--danger);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Asegurar que la tabla no haga scroll vertical */
            .team-card {
                overflow: visible;
            }
            .members-table {
                overflow: visible;
            }
            tbody {
                overflow: visible;
            }
        </style>
        
        <div class="team-card">
            <div class="team-header">
                <h2>👥 Miembros del Equipo</h2>
                <button class="btn-primary" onclick="showInviteMemberModal()">
                    + Invitar miembro
                </button>
            </div>
            
            <table class="members-table">
                <thead>
                    <tr>
                        <th>MIEMBRO</th>
                        <th>EMAIL</th>
                        <th>ROL</th>
                        <th>ESTADO</th>
                        <th>ÚLTIMA ACTIVIDAD</th>
                        <th style="text-align: center;">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    ${teamMembers.map(m => {
                        const lastActive = m.lastActive ? getTimeAgo(m.lastActive) : 'Nunca';
                        const status = m.status || (m.role === 'admin' ? 'active' : 'active');
                        
                        return `
                        <tr>
                            <td>
                                <div class="member-info">
                                    <div class="member-avatar">${m.initials || m.name.charAt(0)}</div>
                                    <span class="member-name" title="${m.name}">${m.name}</span>
                                </div>
                            </td>
                            <td>
                                <div class="email-cell" title="${m.email}">${m.email}</div>
                            </td>
                            <td>
                                <span class="role-badge ${m.role}">
                                    ${ROLES[m.role]?.name || m.role}
                                </span>
                            </td>
                            <td>
                                <span class="status-badge ${status}">
                                    <span class="status-dot ${status}"></span>
                                    ${status === 'active' ? 'Activo' : 'Ausente'}
                                </span>
                            </td>
                            <td>
                                <span class="last-active">${lastActive}</span>
                            </td>
                            <td style="text-align: center;">
                                <div class="action-menu">
                                    <button class="action-button" onclick="toggleActionMenu(event, this, '${m.id}')">⋮</button>
                                    <div class="action-menu-content" id="menu-${m.id}">
                                        <div class="action-menu-item" onclick="openEditMemberModal('${m.id}')">
                                            ✏️ Editar
                                        </div>
                                        <div class="action-menu-item" onclick="suspendMember('${m.id}')">
                                            ⏸️ ${status === 'active' ? 'Suspender' : 'Activar'}
                                        </div>
                                        ${m.role !== 'admin' ? `
                                        <div class="action-menu-item delete" onclick="deleteMember('${m.id}')">
                                            🗑️ Eliminar
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
};

// ==================================================
// TOGGLE DEL MENÚ DE ACCIONES - CORREGIDO
// ==================================================
window.toggleActionMenu = function(event, button, memberId) {
    event.stopPropagation();
    event.preventDefault();
    
    console.log('🔽 Abriendo menú para miembro:', memberId);
    
    // Cerrar todos los menús abiertos
    document.querySelectorAll('.action-menu-content').forEach(menu => {
        menu.classList.remove('show');
    });
    
    // Abrir el menú actual
    const menu = document.getElementById(`menu-${memberId}`);
    if (menu) {
        menu.classList.add('show');
        console.log('✅ Menú abierto');
    }
    
    // Cerrar al hacer clic fuera (con un pequeño retraso)
    setTimeout(() => {
        const closeMenu = function(e) {
            if (!menu.contains(e.target) && e.target !== button && !button.contains(e.target)) {
                menu.classList.remove('show');
                document.removeEventListener('click', closeMenu);
                console.log('🔽 Menú cerrado');
            }
        };
        
        document.addEventListener('click', closeMenu);
        
        // Guardar referencia para poder removerlo después
        window.__currentMenuCloser = closeMenu;
    }, 10);
};

// ==================================================
// CERRAR TODOS LOS MENÚS
// ==================================================
window.closeAllMenus = function() {
    document.querySelectorAll('.action-menu-content').forEach(menu => {
        menu.classList.remove('show');
    });
    
    if (window.__currentMenuCloser) {
        document.removeEventListener('click', window.__currentMenuCloser);
        window.__currentMenuCloser = null;
    }
};

// ==================================================
// SUSPENDER/ACTIVAR MIEMBRO
// ==================================================
window.suspendMember = function(memberId) {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? 'activar' : 'suspender';
    
    if (confirm(`¿${actionText} a ${member.name}?`)) {
        member.status = newStatus;
        saveTeamMembers();
        window.loadTeamMembersList();
    }
    
    // Cerrar menús después de la acción
    closeAllMenus();
};

// ==================================================
// ABRIR MODAL DE EDICIÓN DE MIEMBRO
// ==================================================
window.openEditMemberModal = function(memberId) {
    console.log('🔵 Abriendo edición de miembro:', memberId);
    
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) {
        alert('Error: Miembro no encontrado');
        return;
    }
    
    // Crear modal si no existe
    let modal = document.getElementById('edit-member-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-member-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 class="modal-title">✏️ Editar Miembro</h3>
                    <button class="modal-close" onclick="closeModal('edit-member-modal')">×</button>
                </div>
                
                <form onsubmit="event.preventDefault(); saveEditedMember();">
                    <input type="hidden" id="edit-member-id">
                    
                    <div class="form-group">
                        <label class="form-label">Nombre</label>
                        <input type="text" class="form-input" id="edit-member-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="edit-member-email" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Rol</label>
                        <select class="form-select" id="edit-member-role" required>
                            <option value="editor">Editor</option>
                            <option value="viewer">Espectador</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
                        <button type="submit" class="btn-success">💾 Guardar Cambios</button>
                        <button type="button" class="btn-secondary" onclick="closeModal('edit-member-modal')">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Llenar datos del miembro
    document.getElementById('edit-member-id').value = member.id;
    document.getElementById('edit-member-name').value = member.name;
    document.getElementById('edit-member-email').value = member.email;
    document.getElementById('edit-member-role').value = member.role;
    
    // Abrir el modal
    modal.classList.add('active');
    
    // Cerrar menús después de abrir el modal
    closeAllMenus();
};

// ==================================================
// CERRAR MODAL
// ==================================================
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
};

// ==================================================
// GUARDAR MIEMBRO EDITADO
// ==================================================
window.saveEditedMember = async function() {
    console.log('💾 Guardando cambios de miembro...');
    
    const memberId = document.getElementById('edit-member-id').value;
    const memberIndex = teamMembers.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
        alert('Error: Miembro no encontrado');
        return;
    }
    
    teamMembers[memberIndex] = {
        ...teamMembers[memberIndex],
        name: document.getElementById('edit-member-name').value,
        email: document.getElementById('edit-member-email').value,
        role: document.getElementById('edit-member-role').value,
        updatedAt: new Date().toISOString()
    };
    
    await saveTeamMembers();
    
    closeModal('edit-member-modal');
    window.loadTeamMembersList();
    
    alert('✅ Miembro actualizado correctamente');
};

// ==================================================
// ELIMINAR MIEMBRO
// ==================================================
window.deleteMember = async function(memberId) {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    
    if (!confirm(`¿Estás seguro de eliminar a ${member.name} del equipo?`)) {
        return;
    }
    
    teamMembers = teamMembers.filter(m => m.id !== memberId);
    await saveTeamMembers();
    
    updateBadges();
    window.loadTeamMembersList();
    
    alert(`✅ ${member.name} eliminado del equipo`);
    
    // Cerrar menús después de la acción
    closeAllMenus();
};

// ==================================================
// MODAL DE INVITACIÓN
// ==================================================
window.showInviteMemberModal = function() {
    console.log('📨 Abriendo modal de invitación');
    
    let modal = document.getElementById('invite-member-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'invite-member-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 class="modal-title">📨 Invitar Miembro al Equipo</h3>
                    <button class="modal-close" onclick="closeModal('invite-member-modal')">×</button>
                </div>
                
                <form onsubmit="event.preventDefault(); sendInvitation();">
                    <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-input" id="invite-email" required placeholder="correo@ejemplo.com">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Nombre</label>
                        <input type="text" class="form-input" id="invite-name" placeholder="Nombre completo">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Rol *</label>
                        <select class="form-select" id="invite-role" required>
                            <option value="editor">Editor</option>
                            <option value="viewer">Espectador</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 12px; margin-top: 24px; justify-content: flex-end;">
                        <button type="submit" class="btn-success">📨 Enviar Invitación</button>
                        <button type="button" class="btn-secondary" onclick="closeModal('invite-member-modal')">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
};

// ==================================================
// ENVIAR INVITACIÓN
// ==================================================
window.sendInvitation = async function() {
    console.log('📨 Enviando invitación...');

    const email = document.getElementById('invite-email')?.value;
    const name  = document.getElementById('invite-name')?.value;
    const role  = document.getElementById('invite-role')?.value;

    if (!email || !role) { alert('Completá los campos requeridos'); return; }

    // Verificar si ya existe en teamMembers
    if (teamMembers.find(m => m.email === email)) {
        alert('⚠️ Ya existe un miembro con ese email');
        return;
    }
    // Verificar si ya hay invitación pendiente
    if (teamInvitations.find(i => i.email === email)) {
        alert('⚠️ Ya hay una invitación pendiente para ese email');
        return;
    }

    // FIX: guardar como invitación pendiente, no directamente como miembro.
    // El miembro se agrega cuando acepta la invitación (o en este sistema
    // cuando el admin confirma manualmente desde el panel de invitaciones).
    const invitation = {
        id: 'inv-' + Date.now(),
        email: email,
        name: name || email.split('@')[0],
        role: role,
        createdAt: new Date().toISOString(),
        status: 'pending'
    };

    teamInvitations.push(invitation);
    await saveTeamInvitations();

    updateBadges();
    closeModal('invite-member-modal');
    window.loadTeamInvitationsList();
    alert('✅ Invitación enviada a: ' + email);
};

// ==================================================
// DASHBOARD DE EQUIPO
// ==================================================
window.loadTeamDashboard = function() {
    const container = document.getElementById('team-section-content');
    if (!container) return;

    const today = new Date();
    const activeToday = teamMembers.filter(m => {
        if (!m.lastActive) return false;
        return new Date(m.lastActive).toDateString() === today.toDateString();
    }).length;
    const admins  = teamMembers.filter(m => m.role === 'admin').length;
    const editors = teamMembers.filter(m => m.role === 'editor').length;
    const viewers = teamMembers.filter(m => m.role === 'viewer').length;

    // Últimos 5 miembros activos ordenados por lastActive
    const recentlyActive = [...teamMembers]
        .filter(m => m.lastActive)
        .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
        .slice(0, 5);

    let membersHtml = recentlyActive.map(m => {
        const initials = m.initials || (m.name ? m.name.substring(0,2).toUpperCase() : '??');
        const roleColors = { admin: '#ef4444', editor: '#3b82f6', viewer: '#10b981' };
        const roleNames  = { admin: 'Admin', editor: 'Editor', viewer: 'Espectador' };
        return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--gray-100);">'
            + '<div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;flex-shrink:0;">' + initials + '</div>'
            + '<div style="flex:1;min-width:0;">'
            + '<div style="font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + m.name + '</div>'
            + '<div style="font-size:12px;color:var(--gray-500);">' + m.email + '</div>'
            + '</div>'
            + '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">'
            + '<span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;background:' + (roleColors[m.role] || '#6b7280') + '22;color:' + (roleColors[m.role] || '#6b7280') + ';">' + (roleNames[m.role] || m.role) + '</span>'
            + '<span style="font-size:11px;color:var(--gray-400);">' + getTimeAgo(m.lastActive) + '</span>'
            + '</div>'
            + '</div>';
    }).join('');

    if (!membersHtml) membersHtml = '<div style="padding:20px;text-align:center;color:var(--gray-400);">Sin actividad reciente registrada</div>';

    container.innerHTML =
        '<div style="padding:24px;">'
        + '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">👥 Dashboard de Equipo</h2>'
        // Stats
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;margin-bottom:24px;">'
        + '<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;border-radius:12px;color:white;text-align:center;">'
        + '<div style="font-size:32px;font-weight:700;">' + teamMembers.length + '</div>'
        + '<div style="font-size:12px;opacity:.85;margin-top:4px;">Miembros totales</div>'
        + '</div>'
        + '<div style="background:linear-gradient(135deg,#10b981,#059669);padding:20px;border-radius:12px;color:white;text-align:center;">'
        + '<div style="font-size:32px;font-weight:700;">' + activeToday + '</div>'
        + '<div style="font-size:12px;opacity:.85;margin-top:4px;">Activos hoy</div>'
        + '</div>'
        + '<div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:20px;border-radius:12px;color:white;text-align:center;">'
        + '<div style="font-size:32px;font-weight:700;">' + teamInvitations.length + '</div>'
        + '<div style="font-size:12px;opacity:.85;margin-top:4px;">Invitaciones pendientes</div>'
        + '</div>'
        + '<div style="background:var(--gray-50);padding:20px;border-radius:12px;text-align:center;">'
        + '<div style="font-size:13px;color:var(--gray-500);margin-bottom:8px;">Composición</div>'
        + '<div style="font-size:12px;color:#ef4444;">👑 ' + admins + ' Admins</div>'
        + '<div style="font-size:12px;color:#3b82f6;margin-top:2px;">✏️ ' + editors + ' Editores</div>'
        + '<div style="font-size:12px;color:#10b981;margin-top:2px;">👁️ ' + viewers + ' Viewers</div>'
        + '</div>'
        + '</div>'
        // Actividad reciente
        + '<div style="background:white;border:1px solid var(--gray-200);border-radius:12px;padding:20px;">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
        + '<h3 style="font-size:15px;font-weight:600;">🕐 Actividad reciente</h3>'
        + '<button class="btn-secondary btn-sm" onclick="window.navigateToTeam(\'team-members\')">Ver todos</button>'
        + '</div>'
        + membersHtml
        + '</div>'
        + '</div>';
};

// ==================================================
// OTRAS SECCIONES (placeholders)
// ==================================================
window.loadTeamInvitationsList = function() {
    const container = document.getElementById('team-section-content');
    if (!container) return;

    let invitationsHtml = '';
    if (teamInvitations.length === 0) {
        invitationsHtml = '<div style="padding:40px;text-align:center;color:var(--gray-400);">'
            + '<div style="font-size:48px;margin-bottom:12px;">📭</div>'
            + '<p style="font-size:15px;font-weight:600;color:var(--gray-600);">No hay invitaciones pendientes</p>'
            + '<p style="font-size:13px;margin-top:8px;">Usá el botón "+ Invitar miembro" para enviar una invitación</p>'
            + '</div>';
    } else {
        invitationsHtml = '<table style="width:100%;border-collapse:collapse;">'
            + '<thead><tr style="background:var(--gray-50);">'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;border-bottom:2px solid var(--gray-200);">EMAIL</th>'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;border-bottom:2px solid var(--gray-200);">NOMBRE</th>'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;border-bottom:2px solid var(--gray-200);">ROL</th>'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;border-bottom:2px solid var(--gray-200);">ENVIADA</th>'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;border-bottom:2px solid var(--gray-200);">ESTADO</th>'
            + '<th style="padding:12px;text-align:center;font-size:12px;font-weight:600;border-bottom:2px solid var(--gray-200);">ACCIONES</th>'
            + '</tr></thead><tbody>'
            + teamInvitations.map(inv => {
                const roleNames = { editor: 'Editor', viewer: 'Espectador', admin: 'Administrador' };
                return '<tr style="border-bottom:1px solid var(--gray-100);">'
                    + '<td style="padding:12px;font-size:14px;">' + inv.email + '</td>'
                    + '<td style="padding:12px;font-size:14px;">' + (inv.name || '—') + '</td>'
                    + '<td style="padding:12px;"><span style="font-size:12px;padding:3px 8px;border-radius:20px;background:#dbeafe;color:#1e40af;">' + (roleNames[inv.role] || inv.role) + '</span></td>'
                    + '<td style="padding:12px;font-size:13px;color:var(--gray-500);">' + getTimeAgo(inv.createdAt) + '</td>'
                    + '<td style="padding:12px;"><span style="font-size:12px;padding:3px 8px;border-radius:20px;background:#fef3c7;color:#92400e;">⏳ Pendiente</span></td>'
                    + '<td style="padding:12px;text-align:center;">'
                    + '<button class="btn-secondary btn-sm" onclick="resendInvitation(\'' + inv.id + '\')" style="margin-right:4px;">🔄 Reenviar</button>'
                    + '<button class="btn-danger btn-sm" onclick="cancelInvitation(\'' + inv.id + '\')">✕ Cancelar</button>'
                    + '</td>'
                    + '</tr>';
            }).join('')
            + '</tbody></table>';
    }

    container.innerHTML =
        '<div style="padding:24px;">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">'
        + '<h2 style="font-size:22px;font-weight:700;">📨 Invitaciones Pendientes</h2>'
        + '<button class="btn-primary" onclick="showInviteMemberModal()">+ Invitar miembro</button>'
        + '</div>'
        + '<div style="background:white;border:1px solid var(--gray-200);border-radius:12px;overflow:hidden;">'
        + invitationsHtml
        + '</div>'
        + '</div>';
};

window.loadTeamPermissions = function() {
    const container = document.getElementById('team-section-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">🔐 Permisos por Rol</h3>
            </div>
            <div style="padding: 20px;">
                ${Object.entries(ROLES).map(([key, role]) => `
                    <div style="margin-bottom: 20px; padding: 16px; border: 1px solid var(--gray-200); border-radius: 12px;">
                        <h4 style="color: ${role.color}; margin-bottom: 12px;">${role.name}</h4>
                        <ul style="list-style: none; padding: 0;">
                            ${role.permissions.map(p => `
                                <li style="padding: 4px 0;">✓ ${p}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

window.loadTeamActivity = function() {
    const container = document.getElementById('team-section-content');
    if (!container) return;

    // Generar actividad desde los timestamps de los miembros
    const activityItems = [];

    // Actividades basadas en lastActive de cada miembro
    [...teamMembers]
        .filter(m => m.lastActive)
        .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
        .forEach(m => {
            activityItems.push({
                icon: '👤',
                text: '<strong>' + m.name + '</strong> estuvo activo en el sistema',
                time: m.lastActive,
                color: '#667eea'
            });
        });

    // Actividades de invitaciones
    teamInvitations.forEach(inv => {
        activityItems.push({
            icon: '📨',
            text: 'Se envió invitación a <strong>' + inv.email + '</strong> como ' + (inv.role || 'miembro'),
            time: inv.createdAt || new Date().toISOString(),
            color: '#f59e0b'
        });
    });

    // Ordenar todas por tiempo
    activityItems.sort((a, b) => new Date(b.time) - new Date(a.time));

    let feedHtml = '';
    if (activityItems.length === 0) {
        feedHtml = '<div style="padding:40px;text-align:center;color:var(--gray-400);">'
            + '<div style="font-size:48px;margin-bottom:12px;">📋</div>'
            + '<p style="font-size:15px;font-weight:600;color:var(--gray-600);">Sin actividad registrada</p>'
            + '<p style="font-size:13px;margin-top:8px;">La actividad del equipo aparecerá aquí a medida que usen el sistema</p>'
            + '</div>';
    } else {
        feedHtml = activityItems.slice(0, 20).map((item, i) => {
            return '<div style="display:flex;gap:12px;padding:14px 0;' + (i < activityItems.length - 1 ? 'border-bottom:1px solid var(--gray-100);' : '') + '">'
                + '<div style="width:36px;height:36px;border-radius:50%;background:' + item.color + '22;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">' + item.icon + '</div>'
                + '<div style="flex:1;">'
                + '<div style="font-size:14px;">' + item.text + '</div>'
                + '<div style="font-size:12px;color:var(--gray-400);margin-top:4px;">' + getTimeAgo(item.time) + '</div>'
                + '</div>'
                + '</div>';
        }).join('');
    }

    container.innerHTML =
        '<div style="padding:24px;">'
        + '<h2 style="font-size:22px;font-weight:700;margin-bottom:20px;">📊 Registro de Actividad</h2>'
        + '<div style="background:white;border:1px solid var(--gray-200);border-radius:12px;padding:20px;">'
        + feedHtml
        + '</div>'
        + '</div>';
};

// ==================================================
// EXPORTAR AL ÁMBITO GLOBAL
// ==================================================
window.teamMembers = teamMembers;
window.teamInvitations = teamInvitations;

// ==================================================
// INICIALIZAR AUTOMÁTICAMENTE
// ==================================================
setTimeout(async () => {
    await loadTeamMembers();
    await loadTeamInvitations();
    addTeamSectionToSidebar();
    updateBadges();
    console.log('✅ team-manager.js completamente inicializado');
}, 1000);

console.log('✅ team-manager.js cargado correctamente');

// ==================================================
// CANCELAR INVITACIÓN
// ==================================================
window.cancelInvitation = async function(invId) {
    if (!confirm('¿Cancelar esta invitación?')) return;
    teamInvitations = teamInvitations.filter(i => i.id !== invId);
    await saveTeamInvitations();
    updateBadges();
    window.loadTeamInvitationsList();
};

// ==================================================
// REENVIAR INVITACIÓN (simula reenvío)
// ==================================================
window.resendInvitation = function(invId) {
    const inv = teamInvitations.find(i => i.id === invId);
    if (!inv) return;
    alert('✅ Invitación reenviada a: ' + inv.email);
};

// ==================================================
// ACEPTAR INVITACIÓN MANUALMENTE (el admin puede aprobarla)
// ==================================================
window.acceptInvitation = async function(invId) {
    const inv = teamInvitations.find(i => i.id === invId);
    if (!inv) return;
    const newMember = {
        id: 'member-' + Date.now(),
        name: inv.name,
        email: inv.email,
        role: inv.role,
        initials: inv.name.substring(0, 2).toUpperCase(),
        status: 'active',
        lastActive: new Date().toISOString()
    };
    teamMembers.push(newMember);
    teamInvitations = teamInvitations.filter(i => i.id !== invId);
    await saveTeamMembers();
    await saveTeamInvitations();
    updateBadges();
    window.loadTeamMembersList();
    alert('✅ ' + newMember.name + ' agregado al equipo');
};