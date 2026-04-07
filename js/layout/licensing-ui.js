/**
 * ==================================================
 * LICENSING-UI.JS - Interfaz de Gestión de Planes
 * ==================================================
 */
const LicensingUI = {
    selectedPlanFilter: 'demo',

    init() {
        console.log('💎 Inicializando interfaz de Licencias...');
        this.setupNavigationHook();
        this.setupEventListener();
        this.injectStatusBadge();
    },

    setupNavigationHook() {
        const originalNavigate = window.navigateTo;
        window.navigateTo = (id) => {
            if (id === 'licensing') {
                this.showSection();
            } else {
                const licSection = document.getElementById('licensing');
                if (licSection) licSection.classList.remove('active');
                if (originalNavigate) originalNavigate(id);
            }
        };
    },

    setupEventListener() {
        window.addEventListener('licensing-updated', () => {
            console.log('🔄 Sincronización en tiempo real detectada.');
            LicensingUI.render();
            LicensingUI.updateGlobalStatusBadge();
        });
    },

    // 1. Inyectar Status Badge en el sidebar/avatar
    injectStatusBadge() {
        const container = document.getElementById('user-role-badge-wrap');
        if (!container) return;

        // Evitar duplicados
        if (document.getElementById('global-plan-badge')) return;

        const badge = document.createElement('div');
        badge.id = 'global-plan-badge';
        badge.className = 'user-status-badge';
        container.appendChild(badge);
        this.updateGlobalStatusBadge();
    },

    updateGlobalStatusBadge() {
        const badge = document.getElementById('global-plan-badge');
        if (!badge) return;

        const user = window.getCurrentUser ? window.getCurrentUser() : null;
        if (!user || user.role === 'admin') {
            badge.style.display = 'none';
            return;
        }

        badge.style.display = 'inline-flex';
        const lic = window.Licensing.getUserLicense(user.id);
        if (!lic) {
            badge.textContent = 'SIN PLAN';
            badge.className = 'user-status-badge';
            return;
        }

        badge.textContent = lic.planName;
        badge.className = 'user-status-badge ' + (lic.isDemo ? 'demo' : (lic.active ? 'premium' : 'expired'));
        if (!lic.active) badge.textContent += ' (EXPIRADO)';
    },

    showSection() {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const nav = document.querySelector('.nav-item[data-section="licensing"]');
        if (nav) nav.classList.add('active');

        let section = document.getElementById('licensing');
        if (section) {
            section.classList.add('active');
            section.innerHTML = `
                <div class="view-header" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 24px;">
                    <div>
                        <h3 style="color: #333333; font-size: 24px; margin-bottom: 8px;">💎 Planes y Licencias</h3>
                        <p style="color: var(--gray-500); font-size: 15px;">Gestiona tu suscripción y acceso a la plataforma Bondi Media.</p>
                    </div>
                    <div id="licensing-admin-actions"></div>
                </div>
                <div id="licensing-container"></div>
            `;
            this.render();
        }
    },

    getCurrentUser() {
        if (window.SessionManager) return window.SessionManager.getCurrentUser();
        if (window.getCurrentUser) return window.getCurrentUser();
        const session = sessionStorage.getItem('bondi-current-user');
        return session ? JSON.parse(session) : null;
    },

    render() {
        const container = document.getElementById('licensing-container');
        const adminActions = document.getElementById('licensing-admin-actions');
        if (!container) return;

        const user = this.getCurrentUser();
        const isAdmin = user && user.role === 'admin';

        if (isAdmin && adminActions) {
            adminActions.innerHTML = `
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-primary" onclick="LicensingUI.openCreatePlanModal()" style="display:flex; align-items:center; gap:8px; padding: 10px 18px; border-radius:12px;">
                        <i class="fas fa-plus-circle"></i> Nuevo Plan
                    </button>
                    <button class="btn btn-secondary" onclick="LicensingUI.render();" style="padding: 10px 14px; border-radius:12px;">
                        <i class="fas fa-sync"></i> Recargar
                    </button>
                </div>
            `;
        }

        if (isAdmin) {
            this.renderAdminView(container);
        } else {
            this.renderClientView(container, user);
        }
    },

    renderAdminView(container) {
        const users = window.UserManager ? window.UserManager.getAll() : [];
        const clients = users.filter(u => u.role === 'client');
        
        if (clients.length === 0) {
            container.innerHTML = `
                <div style="padding: 60px; text-align: center; background: var(--bg-card); border-radius: 20px; border: 1px dashed var(--border-color);">
                    <i class="fas fa-user-slash" style="font-size: 40px; color: var(--gray-600); margin-bottom: 20px;"></i>
                    <h4 style="color: white; margin-bottom: 10px;">No hay clientes registrados</h4>
                    <p style="color: var(--gray-500);">Los clientes aparecerán aquí automáticamente una vez creados.</p>
                </div>
            `;
            return;
        }

        const allPlans = Object.values(window.Licensing.plans || {});
        const filteredClients = this.selectedPlanFilter && this.selectedPlanFilter !== 'all'
            ? clients.filter(u => {
                const lic = window.Licensing.getUserLicense(u.id);
                return lic && lic.planId === this.selectedPlanFilter;
            })
            : clients;

        // ── CÁLCULO DE ESTADÍSTICAS SAAS ──
        let mrr = 0;
        let activeDemos = 0;
        clients.forEach(c => {
            const lic = window.Licensing.getUserLicense(c.id);
            if (lic) {
                if (lic.status === 'demo') activeDemos++;
                if ((lic.status === 'active' || lic.active) && !lic.isDemo) {
                    mrr += parseFloat(lic.price || 0);
                }
            }
        });

        container.innerHTML = `
            <!-- BARRA DE ESTADÍSTICAS SAAS -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: #3a3c3f; border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div style="font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Clientes Totales</div>
                    <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">${clients.length}</div>
                </div>
                <div style="background: #3a3c3f; border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div style="font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Demos Activas</div>
                    <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">${activeDemos}</div>
                </div>
                <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 20px; border-radius: 16px; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);">
                    <div style="font-size: 11px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">MRR (Ingresos Mes)</div>
                    <div style="font-size: 28px; font-weight: 800; color: white; margin-top: 5px;">$${mrr.toLocaleString()} <span style="font-size: 14px; font-weight: 500; opacity: 0.9;">USD</span></div>
                </div>
            </div>

            <!-- GESTIÓN DE PLANES -->
            <div style="background: var(--bg-card); padding: 24px; border-radius: 20px; border: 1px solid var(--border-color); box-shadow: var(--shadow-xl); overflow: hidden; margin-bottom: 24px;">
                <h4 style="margin: 0 0 16px; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-layer-group" style="color:var(--primary-color);"></i>
                    Gestión de Planes
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px;">
                    ${allPlans.map(plan => {
                        const clientsInPlan = clients.filter(c => {
                            const lic = window.Licensing.getUserLicense(c.id);
                            return lic && lic.planId === plan.id;
                        }).length;
                        return `
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div style="font-size:13px; font-weight:600; color:inherit; margin-bottom:4px;">${plan.name}</div>
                                    <div style="font-size:12px; color:var(--gray-500);">
                                        <span style="background:rgba(79,70,229,0.2); padding:2px 8px; border-radius:4px; display:inline-block;">
                                            ${clientsInPlan} cliente${clientsInPlan !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                                <button class="action-btn" onclick="LicensingUI.openRenamePlanModal('${plan.id}')" style="padding:6px 12px; border-radius:8px; display:flex; align-items:center; gap:6px; font-size:12px;">
                                    <i class="fas fa-edit"></i> Renombrar
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div style="background: var(--bg-card); padding: 24px; border-radius: 20px; border: 1px solid var(--border-color); box-shadow: var(--shadow-xl); overflow: hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px;">
                    <div>
                        <h4 style="margin:0; display:flex; align-items:center; gap:10px;">
                            <i class="fas fa-users-cog" style="color:var(--primary-color);"></i>
                            Gestión Global de Suscriptores
                        </h4>
                        <div style="margin-top: 6px; font-size: 13px; color: var(--gray-500);">
                            Mostrando ${filteredClients.length} de ${clients.length} clientes
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <label for="licensing-plan-filter" style="font-size:13px; color: var(--gray-500); margin:0;">Mostrar:</label>
                        <select id="licensing-plan-filter" onchange="LicensingUI.changePlanFilter(this.value)" style="padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-card); color: inherit;">
                            <option value="demo" ${this.selectedPlanFilter === 'demo' ? 'selected' : ''}>Solo Demo</option>
                            <option value="all" ${this.selectedPlanFilter === 'all' ? 'selected' : ''}>Todos los planes</option>
                            ${allPlans.map(plan => `<option value="${plan.id}" ${this.selectedPlanFilter === plan.id ? 'selected' : ''}>${plan.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div style="overflow-x: auto;">
                    <table class="license-admin-table" style="width:100%; border-collapse: separate; border-spacing: 0 8px;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.02);">
                                <th style="padding: 15px; border-radius: 12px 0 0 12px;">CLIENTE</th>
                                <th style="padding: 15px;">SUSCRIPCIÓN</th>
                                <th style="padding: 15px;">ESTADO</th>
                                <th style="padding: 15px;">VENCE</th>
                                <th style="padding: 15px; border-radius: 0 12px 12px 0; text-align:right;">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredClients.length === 0 ? `
                                <tr>
                                    <td colspan="5" style="padding: 40px 20px; text-align: center; color: var(--gray-500);">
                                        No se encontraron clientes para el filtro seleccionado.
                                    </td>
                                </tr>
                            ` : filteredClients.map(u => {
                                const lic = window.Licensing.getUserLicense(u.id);
                                const days = lic ? window.Licensing.getRemainingDays(u.id) : 0;
                                const status = lic ? (lic.status || (lic.isDemo ? 'demo' : 'active')) : 'none';
                                const price = lic ? (lic.price || '0') : '-';
                                const subType = lic ? (lic.subscriptionType === 'annual' ? 'Anual' : 'Mensual') : '-';
                                const isDemoStatus = lic && lic.status === 'demo';

                                return `
                                    <tr class="license-row" style="background: rgba(255,255,255,0.01); border: 1px solid transparent; transition: all 0.2s;">
                                        <td style="padding: 15px;">
                                            <div style="font-weight: 600; color:#1E293B; font-size:14px;">${u.name}</div>
                                            <div style="font-size: 11px; color: var(--gray-500);">${u.email}</div>
                                        </td>
                                        <td style="padding: 15px;">
                                            <div style="font-size:13px; color:var(--primary-color); font-weight:600;">${lic ? lic.planName : 'Sin asignar'}</div>
                                            ${!isDemoStatus && lic ? `<div style="font-size:11px; color:var(--gray-500); margin-top:2px;">$${price} / ${subType}</div>` : (lic ? '<div style="font-size:11px; color:#f59e0b; margin-top:2px; font-weight:600;">Acceso Gratuito</div>' : '')}
                                        </td>
                                        <td style="padding: 15px;">
                                            <span class="status-badge status-${status}">
                                                ${this.getStatusLabel(lic)}
                                            </span>
                                        </td>
                                        <td style="padding: 15px;">
                                            <div style="font-size:13px; color:#1E293B; font-weight:600;">${lic ? this.formatDateSimple(lic.expiryDate) : '-'}</div>
                                            <div style="font-size:11px; color:${days < 5 ? '#f87171' : 'var(--gray-600)'};">${lic ? (days + ' días') : ''}</div>
                                        </td>
                                        <td style="padding: 15px; text-align:right; display: flex; gap: 8px; justify-content: flex-end;">
                                            <button class="action-btn upgrade" onclick="LicensingUI.openManageModal('${u.id}')">
                                                <i class="fas fa-pencil-alt"></i> Gestionar
                                            </button>
                                            <button class="action-btn" onclick="LicensingUI.deleteLicense('${u.id}')" style="background: #FEE2E2; color: #DC2626; border-color: #FECACA; padding: 6px 12px; border-radius: 8px; font-weight: 600; display: flex; align-items:center; gap:6px;">
                                                <i class="fas fa-trash-alt"></i> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // --- MODALES SIN PROMPTS ---
    openManageModal(userId) {
        const users = window.UserManager.getAll();
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const lic = window.Licensing.getUserLicense(userId) || {
            planId: 'demo',
            price: '0',
            status: 'demo',
            subscriptionType: 'monthly',
            expiryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
        };

        // Rellenar campos
        document.getElementById('lm-user-id').value = userId;
        document.getElementById('lm-client-name').value = user.name;
        document.getElementById('lm-price').value = lic.price || '0';
        document.getElementById('lm-status').value = lic.status || (lic.isDemo ? 'demo' : 'active');
        document.getElementById('lm-type').value = lic.subscriptionType || 'monthly';
        
        const expiryDate = lic.expiryDate ? lic.expiryDate.split('T')[0] : '';
        document.getElementById('lm-expiry').value = expiryDate;

        // Cargar Planes
        const planSelect = document.getElementById('lm-plan-id');
        const plans = window.Licensing.plans;
        planSelect.innerHTML = Object.values(plans).map(p => 
            `<option value="${p.id}" ${lic.planId === p.id ? 'selected' : ''}>${p.name}</option>`
        ).join('');

        if (window.openModal) window.openModal('license-manage-modal');
    },

    saveLicenseUpdate() {
        const userId = document.getElementById('lm-user-id').value;
        const expiryVal = document.getElementById('lm-expiry').value;
        if (!expiryVal) return alert('Por favor, selecciona una fecha de vencimiento');

        // Parseo manual para evitar desfase UTC (18/04 no debe convertirse en 17/04 21:00)
        const parts = expiryVal.split('-');
        const localExpiry = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59);

        const updateData = {
            planId: document.getElementById('lm-plan-id').value,
            price: document.getElementById('lm-price').value,
            status: document.getElementById('lm-status').value,
            subscriptionType: document.getElementById('lm-type').value,
            expiryDate: localExpiry.toISOString(),
            isDemo: document.getElementById('lm-status').value === 'demo',
            active: ['active', 'demo', 'premium'].includes(document.getElementById('lm-status').value)
        };

        const currentLic = window.Licensing.data.licenses[userId];
        if (!currentLic) {
            window.Licensing.assignPlan(userId, updateData.planId, 30, updateData);
        } else {
            window.Licensing.updateLicense(userId, updateData);
        }

        if (window.closeModal) window.closeModal('license-manage-modal');
        if (window.showSuccess) window.showSuccess('Suscripción actualizada correctamente');
        
        // Refrescar explícitamente y notificar
        LicensingUI.render();
        LicensingUI.updateGlobalStatusBadge();
    },

    changePlanFilter(planId) {
        this.selectedPlanFilter = planId || 'all';
        this.render();
    },

    openRenamePlanModal(planId) {
        const plan = window.Licensing.plans[planId];
        if (!plan) return;

        const newName = prompt(`Renombrar plan "${plan.name}"`, plan.name);
        if (!newName || newName.trim() === '' || newName === plan.name) return;

        plan.name = newName.trim();
        window.Licensing.savePlans();

        if (window.showSuccess) window.showSuccess(`Plan renombrado a "${newName}" correctamente`);
        LicensingUI.render();
        LicensingUI.updateGlobalStatusBadge();
    },

    deleteLicense(userId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este cliente? Se eliminará el cliente y su licencia por completo.')) return;

        window.Licensing.removeLicense(userId);
        if (window.UserManager && typeof window.UserManager.delete === 'function') {
            window.UserManager.delete(userId);
        }
        if (window.showSuccess) window.showSuccess('Cliente y licencia eliminados correctamente');
        LicensingUI.render();
        LicensingUI.updateGlobalStatusBadge();
    },

    openCreatePlanModal() {
        const form = document.getElementById('plan-create-form');
        if (form) form.reset();
        if (window.openModal) window.openModal('plan-create-modal');
    },

    saveNewPlan() {
        const name = document.getElementById('cp-name').value;
        const price = document.getElementById('cp-price').value;
        const featuresRaw = document.getElementById('cp-features').value;
        const accounts = document.getElementById('cp-limit-accounts').value;
        const ai = document.getElementById('cp-limit-ai').checked;
        const branding = document.getElementById('cp-limit-branding').checked;

        if (!name || !price) return;

        const features = featuresRaw.split('\n').filter(f => f.trim() !== '');

        const planData = {
            id: 'plan-' + name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            price: price,
            currency: 'USD',
            features: features,
            limits: {
                accounts: parseInt(accounts),
                aiExperts: ai,
                customBranding: branding
            }
        };

        window.Licensing.createPlan(planData);

        if (window.closeModal) window.closeModal('plan-create-modal');
        if (window.showSuccess) window.showSuccess(`Plan "${name}" creado con éxito`);
        
        // El render se dispara por el evento 'plans-updated' en Licensing
    },

    onModalPlanChange(planId) {
        const plans = window.Licensing.plans;
        const plan = plans[planId];
        if (plan) {
            document.getElementById('lm-price').value = plan.price || '0';
            if (plan.limits && plan.limits.isDemo) {
                document.getElementById('lm-status').value = 'demo';
            } else {
                document.getElementById('lm-status').value = 'active';
            }
        }
    },

    // --- VISTA CLIENTE ---
    renderClientView(container, user) {
        const lic = window.Licensing.getUserLicense(user.id);
        const days = window.Licensing.getRemainingDays(user.id);
        const plans = window.Licensing.plans;

        let html = '';
        if (lic && lic.active) {
            html += `
                <div class="demo-timer" style="background: ${lic.isDemo ? 'linear-gradient(135deg, #f39c12, #e67e22)' : 'linear-gradient(135deg, #4F46E5, #7C3AED)'}">
                    <i class="fas ${lic.isDemo ? 'fa-hourglass-half' : 'fa-crown'}" style="font-size: 24px; margin-bottom: 8px;"></i>
                    <h4 style="margin: 0;">${lic.isDemo ? 'Periodo de Demo Activo' : 'Suscripción Premium Activa'}</h4>
                    <p style="margin: 4px 0 0; opacity: 0.9;">Plan: ${lic.planName} — ${days} días restantes</p>
                </div>
            `;
        }

        html += `
            <div style="margin-bottom: 30px; text-align: center;">
                <h4>Potencia tu marca con Bondi Media</h4>
                <p style="color: var(--gray-500);">Escoge el plan que mejor se adapte a tu volumen de contenido.</p>
            </div>
            <div class="licensing-grid">
                ${Object.values(plans).map(plan => `
                    <div class="plan-card ${plan.recommended ? 'recommended' : ''}">
                        ${plan.recommended ? '<div class="plan-badge">Popular</div>' : ''}
                        <div class="plan-header">
                            <div class="plan-name">${plan.name}</div>
                            <div class="plan-price">$${plan.price}<span>/mes</span></div>
                        </div>
                        <ul class="plan-features">
                            ${plan.features.slice(0, 5).map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                        </ul>
                        <button class="plan-btn ${lic && lic.planId === plan.id ? 'active' : ''}" 
                                onclick="LicensingUI.requestUpgrade('${plan.id}')">
                            ${lic && lic.planId === plan.id ? 'Tu Plan Actual' : 'Seleccionar'}
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    // Helpers
    getStatusClass(lic) {
        if (!lic) return 'status-expired';
        const st = lic.status || (lic.isDemo ? 'demo' : 'active');
        if (!lic.active && st !== 'blocked' && st !== 'suspended') return 'status-expired';
        return 'status-' + st;
    },
    
    getStatusLabel(lic) {
        if (!lic) return 'Sin Licencia';
        const st = lic.status || (lic.isDemo ? 'demo' : 'active');
        const labels = {
            'active': 'Premium',
            'demo': 'Demo',
            'suspended': 'Suspendido',
            'blocked': 'Bloqueado',
            'expired': 'Expirado'
        };
        if (!lic.active && st === 'active') return 'Expirado';
        return labels[st] || 'Inactivo';
    },

    formatDateSimple(iso) {
        if (!iso) return '-';
        const d = new Date(iso);
        return d.toLocaleDateString();
    },

    requestUpgrade(planId) {
        const plans = window.Licensing.plans;
        if (window.showInfo) {
            window.showInfo(`Has seleccionado el plan "${plans[planId].name}". Dirección enviada a administración.`);
        }
    }
};

// Iniciar
if (!window.LicensingUI_Initialized) {
    document.addEventListener('DOMContentLoaded', () => LicensingUI.init());
    window.LicensingUI = LicensingUI;
    window.LicensingUI_Initialized = true;
}
