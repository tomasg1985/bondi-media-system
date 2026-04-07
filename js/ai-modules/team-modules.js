// ==================================================
// TEAM MODULES - MÓDULOS DE EQUIPO
// ==================================================

console.log('👥 Cargando módulos de equipo...');

// ==================================================
// DASHBOARD DE EQUIPO
// ==================================================
window.initTeamDashboard = function(container) {
    container.innerHTML = `
        <div style="padding: 30px;">
            <style>
                .team-stat-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                }
                .member-list {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                }
                .member-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 10px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                .member-item:last-child {
                    border-bottom: none;
                }
                .member-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                }
            </style>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; margin-bottom: 24px;">
                <h2 style="font-size: 28px; margin-bottom: 10px;">👥 Dashboard de Equipo</h2>
                <p style="opacity: 0.9;">Visión general de tu equipo y su actividad</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                <div class="team-stat-card">
                    <div style="color: #6b7280; font-size: 12px;">Miembros activos</div>
                    <div style="font-size: 36px; font-weight: 700; color: #667eea;">5</div>
                </div>
                <div class="team-stat-card">
                    <div style="color: #6b7280; font-size: 12px;">Invitaciones pendientes</div>
                    <div style="font-size: 36px; font-weight: 700; color: #f59e0b;">2</div>
                </div>
                <div class="team-stat-card">
                    <div style="color: #6b7280; font-size: 12px;">Actividad hoy</div>
                    <div style="font-size: 36px; font-weight: 700; color: #10b981;">12</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <div class="member-list">
                    <h3 style="margin-bottom: 20px;">👤 Miembros del equipo</h3>
                    
                    <div class="member-item">
                        <div class="member-avatar">AD</div>
                        <div style="flex: 1;">
                            <strong>Administrador</strong>
                            <div style="font-size: 12px; color: #6b7280;">admin@bondimedia.com</div>
                        </div>
                        <span class="badge badge-primary">Admin</span>
                    </div>
                    
                    <div class="member-item">
                        <div class="member-avatar">MC</div>
                        <div style="flex: 1;">
                            <strong>María González</strong>
                            <div style="font-size: 12px; color: #6b7280;">maria@bondimedia.com</div>
                        </div>
                        <span class="badge badge-success">Editor</span>
                    </div>
                    
                    <div class="member-item">
                        <div class="member-avatar">JL</div>
                        <div style="flex: 1;">
                            <strong>Juan López</strong>
                            <div style="font-size: 12px; color: #6b7280;">juan@bondimedia.com</div>
                        </div>
                        <span class="badge badge-success">Editor</span>
                    </div>
                    
                    <div class="member-item">
                        <div class="member-avatar">CP</div>
                        <div style="flex: 1;">
                            <strong>Carlos Pérez</strong>
                            <div style="font-size: 12px; color: #6b7280;">carlos@bondimedia.com</div>
                        </div>
                        <span class="badge badge-info">Viewer</span>
                    </div>
                </div>

                <div style="background: white; border-radius: 12px; padding: 20px;">
                    <h3 style="margin-bottom: 20px;">📊 Actividad reciente</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: 600;">María González</div>
                        <div style="font-size: 12px;">Creó un nuevo reel hace 5 min</div>
                        <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Hace 5 minutos</div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: 600;">Juan López</div>
                        <div style="font-size: 12px;">Agregó métricas a "Marketing digital"</div>
                        <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Hace 2 horas</div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: 600;">Carlos Pérez</div>
                        <div style="font-size: 12px;">Comentó en "Estrategia de contenido"</div>
                        <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Hace 3 horas</div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ==================================================
// MIEMBROS DEL EQUIPO
// ==================================================
window.initTeamMembers = function(container) {
    container.innerHTML = `
        <div style="padding: 30px;">
            <style>
                .members-table {
                    width: 100%;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .members-table th {
                    background: #f9fafb;
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 12px;
                    color: #6b7280;
                    border-bottom: 2px solid #e5e7eb;
                }
                .members-table td {
                    padding: 15px;
                    border-bottom: 1px solid #e5e7eb;
                }
                .member-avatar-sm {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                }
            </style>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="font-size: 24px;">👤 Miembros del Equipo</h2>
                <button class="btn-primary" onclick="window.showInviteMemberModal ? window.showInviteMemberModal() : alert('Función no disponible')">
                    + Invitar miembro
                </button>
            </div>

            <table class="members-table">
                <thead>
                    <tr>
                        <th>Miembro</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Última actividad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div class="member-avatar-sm">AD</div>
                                <span>Administrador</span>
                            </div>
                        </td>
                        <td>admin@bondimedia.com</td>
                        <td><span class="badge badge-primary">Administrador</span></td>
                        <td><span class="badge badge-success">Activo</span></td>
                        <td>Hace 5 minutos</td>
                        <td>
                            <button class="btn-secondary btn-sm">✏️</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div class="member-avatar-sm">MG</div>
                                <span>María González</span>
                            </div>
                        </td>
                        <td>maria@bondimedia.com</td>
                        <td><span class="badge badge-success">Editor</span></td>
                        <td><span class="badge badge-success">Activo</span></td>
                        <td>Hace 15 minutos</td>
                        <td>
                            <button class="btn-secondary btn-sm">✏️</button>
                            <button class="btn-danger btn-sm">🗑️</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div class="member-avatar-sm">JL</div>
                                <span>Juan López</span>
                            </div>
                        </td>
                        <td>juan@bondimedia.com</td>
                        <td><span class="badge badge-success">Editor</span></td>
                        <td><span class="badge badge-warning">Ausente</span></td>
                        <td>Hace 2 días</td>
                        <td>
                            <button class="btn-secondary btn-sm">✏️</button>
                            <button class="btn-danger btn-sm">🗑️</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div class="member-avatar-sm">CP</div>
                                <span>Carlos Pérez</span>
                            </div>
                        </td>
                        <td>carlos@bondimedia.com</td>
                        <td><span class="badge badge-info">Espectador</span></td>
                        <td><span class="badge badge-success">Activo</span></td>
                        <td>Hace 1 hora</td>
                        <td>
                            <button class="btn-secondary btn-sm">✏️</button>
                            <button class="btn-danger btn-sm">🗑️</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
};

// ==================================================
// INVITACIONES
// ==================================================
window.initTeamInvitations = function(container) {
    container.innerHTML = `
        <div style="padding: 30px;">
            <style>
                .invitation-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 15px;
                }
            </style>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="font-size: 24px;">📨 Invitaciones Pendientes</h2>
                <button class="btn-primary" onclick="window.showInviteMemberModal ? window.showInviteMemberModal() : alert('Función no disponible')">
                    + Nueva invitación
                </button>
            </div>

            <div class="invitation-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>ana@ejemplo.com</strong>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Invitado como Editor • Hace 2 días</div>
                    </div>
                    <div>
                        <span class="badge badge-warning">Pendiente</span>
                        <button class="btn-secondary btn-sm" style="margin-left: 10px;">Reenviar</button>
                        <button class="btn-danger btn-sm">Cancelar</button>
                    </div>
                </div>
            </div>

            <div class="invitation-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>pedro@ejemplo.com</strong>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Invitado como Espectador • Hace 5 días</div>
                    </div>
                    <div>
                        <span class="badge badge-danger">Expirada</span>
                        <button class="btn-secondary btn-sm" style="margin-left: 10px;">Reenviar</button>
                        <button class="btn-danger btn-sm">Eliminar</button>
                    </div>
                </div>
            </div>

            <div class="invitation-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>laura@ejemplo.com</strong>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Invitado como Editor • Hace 1 día</div>
                    </div>
                    <div>
                        <span class="badge badge-warning">Pendiente</span>
                        <button class="btn-secondary btn-sm" style="margin-left: 10px;">Reenviar</button>
                        <button class="btn-danger btn-sm">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ==================================================
// PERMISOS
// ==================================================
window.initTeamPermissions = function(container) {
    const ROLES = {
        admin: {
            name: 'Administrador',
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
            color: '#10b981',
            permissions: [
                'Ver dashboard',
                'Ver contenido',
                'Ver reportes'
            ]
        }
    };

    container.innerHTML = `
        <div style="padding: 30px;">
            <style>
                .permission-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                .role-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                }
                .permission-list {
                    list-style: none;
                    padding: 0;
                }
                .permission-list li {
                    padding: 8px 0;
                    border-bottom: 1px solid #f3f4f6;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .permission-list li:before {
                    content: "✓";
                    color: #10b981;
                    font-weight: bold;
                }
            </style>

            <h2 style="font-size: 24px; margin-bottom: 20px;">🔐 Permisos por Rol</h2>

            <div class="permission-grid">
                ${Object.entries(ROLES).map(([key, role]) => `
                    <div class="role-card">
                        <h3 style="color: ${role.color}; margin-bottom: 15px;">${role.name}</h3>
                        <ul class="permission-list">
                            ${role.permissions.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

// ==================================================
// ACTIVIDAD
// ==================================================
window.initTeamActivity = function(container) {
    container.innerHTML = `
        <div style="padding: 30px;">
            <style>
                .activity-feed {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                }
                .activity-item {
                    display: flex;
                    gap: 15px;
                    padding: 15px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                .activity-item:last-child {
                    border-bottom: none;
                }
                .activity-icon {
                    width: 40px;
                    height: 40px;
                    background: #f3f4f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
            </style>

            <h2 style="font-size: 24px; margin-bottom: 20px;">📊 Registro de Actividad</h2>

            <div class="activity-feed">
                <div class="activity-item">
                    <div class="activity-icon">📝</div>
                    <div style="flex: 1;">
                        <strong>María González</strong> creó un nuevo reel
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Hace 5 minutos</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">📊</div>
                    <div style="flex: 1;">
                        <strong>Juan López</strong> agregó métricas a "Marketing digital"
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Hace 2 horas</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">💬</div>
                    <div style="flex: 1;">
                        <strong>Carlos Pérez</strong> comentó en "Estrategia de contenido"
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Hace 3 horas</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">👥</div>
                    <div style="flex: 1;">
                        <strong>Administrador</strong> invitó a ana@ejemplo.com
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Hace 1 día</div>
                    </div>
                </div>

                <div class="activity-item">
                    <div class="activity-icon">⚙️</div>
                    <div style="flex: 1;">
                        <strong>Sistema</strong> backup automático completado
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Hace 2 días</div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

console.log('✅ Módulos de equipo cargados');