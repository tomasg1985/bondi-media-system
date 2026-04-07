// ==================================================
// PATCH: closeModal y openModal unificados (display + active class)
// ==================================================
(function() {
    var _orig = window.closeModal;
    window.closeModal = function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            el.classList.remove('active');
        }
        if (typeof _orig === 'function') _orig(id);
    };
})();

// ==================================================
// CLIENT MANAGER — VERSIÓN PORTAL
// Incluye gestión de acceso al portal del cliente:
// activar, pausar, pendiente, credenciales, color de marca
// ==================================================

console.log('👥 Cargando client-manager.js...');

// ── HELPERS ────────────────────────────────────────
function clientRefresh() {
    if (typeof updateAccountSelector === 'function') updateAccountSelector();
    loadClientsList();
}

async function clientSave() {
    // Guardar la versión limpia en localStorage y persistir fotos por separado
    var accountsClean = (typeof window.prepareAccountsForStorage === 'function')
        ? window.prepareAccountsForStorage(window.accounts)
        : (window.accounts || []).map(function(a) {
            if (!a || !a.id) return null;
            if (a.photo) {
                try { localStorage.setItem('bondi-photo-' + a.id, a.photo); } catch(e) { console.warn('No se pudo guardar la foto de', a.name, e); }
            }
            var clean = Object.assign({}, a);
            delete clean.photo;
            return clean;
        }).filter(Boolean);

    const saved = await storage.set('bondi-accounts', accountsClean);

    try {
        const verified = JSON.parse(localStorage.getItem('bondi-accounts') || '[]');
        if (!Array.isArray(verified) || verified.length !== accountsClean.length) {
            console.warn('Verificación de banci-accounts fallida, reintentando guardado', verified, accountsClean);
            localStorage.setItem('bondi-accounts', JSON.stringify(accountsClean));
        }
    } catch (e) {
        console.warn('Error verificando bondi-accounts después de guardarlo:', e);
    }

    return saved;
}

function showMsg(msg) {
    if (typeof showSuccess === 'function') showSuccess(msg);
    else if (typeof addNotification === 'function') addNotification('Clientes', msg);
}

// ── ABRIR MODALES ──────────────────────────────────

// ── Comprimir foto antes de guardar (max 200x200, calidad 0.7) ────────────
function compressPhoto(file) {
    return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var MAX = 200;
                var w = img.width, h = img.height;
                if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
                else       { if (h > MAX) { w = w * MAX / h; h = MAX; } }
                canvas.width  = Math.round(w);
                canvas.height = Math.round(h);
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.72));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

window.openAddClientModal = function() {
    const modal = document.getElementById('client-modal');
    if (!modal) return;
    ['client-name','client-brand','client-notes'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const ind = document.getElementById('client-industry');
    if (ind) ind.value = 'health';
    const typ = document.getElementById('client-type');
    if (typ) typ.value = 'new';
    const prev = document.getElementById('client-photo-preview');
    const init = document.getElementById('client-photo-initials');
    if (prev) { prev.src = ''; prev.style.display = 'none'; }
    if (init) init.style.display = 'block';
    const inp = document.getElementById('client-photo');
    if (inp) inp.value = '';
    modal.classList.add('active');
    modal.style.display = 'flex';
};

window.openManageClientsModal = function() {
    const modal = document.getElementById('manage-clients-modal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        loadClientsList();
    }
};

// ── FOTO PREVIEW ───────────────────────────────────
window.previewClientPhoto = function(inputId, previewId) {
    const input   = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const initials = document.getElementById(previewId.replace('preview', 'initials'));
    if (input && input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
            if (initials) initials.style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.removeClientPhoto = function() {
    const preview  = document.getElementById('edit-client-photo-preview');
    const initials = document.getElementById('edit-client-photo-initials');
    const input    = document.getElementById('edit-client-photo');
    if (preview)  { preview.src = ''; preview.style.display = 'none'; }
    if (initials) initials.style.display = 'block';
    if (input)    input.value = '';
};

// ── LISTA DE CLIENTES ──────────────────────────────
window.loadClientsList = function() {
    const container = document.getElementById('clients-list');
    if (!container) return;

    if (!window.accounts) {
        window.accounts = [{ id: 'bondi-media', name: 'Bondi Media', brand: 'Principal', type: 'active' }];
    }

    const clients = window.accounts.filter(a => a.id !== 'bondi-media');

    if (!clients.length) {
        container.innerHTML = '<div style="text-align:center;padding:40px 20px;">'
            + '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 12px;display:block;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
            + '<p style="font-size:14px;font-weight:600;color:#374151;margin-bottom:6px;">Sin clientes registrados</p>'
            + '<p style="font-size:13px;color:#9CA3AF;margin-bottom:16px;">Agregá tu primer cliente para comenzar</p>'
            + '<button class="btn-primary" onclick="closeModal(\'manage-clients-modal\');openAddClientModal()">+ Agregar Cliente</button>'
            + '</div>';
        return;
    }

    const statusConfig = {
        active:  { label: 'Activo',   bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
        paused:  { label: 'Pausado',  bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
        pending: { label: 'Pendiente',bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
        new:     { label: 'Nuevo',    bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' },
    };
    const portalConfig = {
        active:   { label: 'Activo',   bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
        paused:   { label: 'Pausado',  bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
        pending:  { label: 'Pendiente',bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
        disabled: { label: 'Sin acceso',bg:'#F3F4F6', color: '#9CA3AF', border: '#E5E7EB' },
    };

    let html = '<div style="padding:4px 0;">';

    clients.forEach(client => {
        const sc  = statusConfig[client.type]   || statusConfig.new;
        const pc  = portalConfig[client.portalAccess || 'disabled'] || portalConfig.disabled;
        const cal = JSON.parse(localStorage.getItem('bondi-calendar-' + client.id) || '[]');
        const now = new Date();
        const thisMonth = cal.filter(c => c.date && c.date.startsWith(
            now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0')
        ));

        // Initials avatar
        const initials = (client.name || '?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
        const avatarBg  = client.primaryColor || '#F97316';

        html += '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px;margin-bottom:12px;">'

        // ── Top row ──
        + '<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;">'

        // Avatar
        + '<div style="width:44px;height:44px;border-radius:50%;background:' + avatarBg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.12);">'
        + (client.photo ? '<img src="' + client.photo + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">' : initials)
        + '</div>'

        // Info
        + '<div style="flex:1;min-width:0;">'
        + '<div style="font-size:14px;font-weight:700;color:#0D1117;margin-bottom:2px;">' + client.name + '</div>'
        + '<div style="font-size:12px;color:#9CA3AF;margin-bottom:8px;">'
        + (client.brand ? '@' + client.brand.replace('@','') + ' · ' : '')
        + (client.industry || '') + (client.createdAt ? ' · Desde ' + new Date(client.createdAt).toLocaleDateString('es-AR',{day:'2-digit',month:'short',year:'numeric'}) : '')
        + '</div>'
        // Badges de estado
        + '<div style="display:flex;gap:6px;flex-wrap:wrap;">'
        + '<span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:' + sc.bg + ';color:' + sc.color + ';border:1px solid ' + sc.border + ';">' + sc.label + '</span>'
        + '<span style="font-size:10px;font-weight:600;padding:3px 9px;border-radius:999px;background:' + pc.bg + ';color:' + pc.color + ';border:1px solid ' + pc.border + ';">'
        + '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle;margin-right:3px;"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        + 'Portal: ' + pc.label + '</span>'
        + '<span style="font-size:10px;color:#9CA3AF;padding:3px 6px;">' + thisMonth.length + ' piezas este mes</span>'
        + '</div>'
        + '</div>'

        // Acciones rápidas top-right
        + '<div style="display:flex;gap:6px;flex-shrink:0;">'
        + '<button class="btn-primary btn-sm" onclick="switchAccount(\'' + client.id + '\');closeModal(\'manage-clients-modal\')" title="Ver contenido de este cliente">'
        + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
        + 'Ver</button>'
        + '<button class="btn-secondary btn-sm" onclick="openEditClientModal(\'' + client.id + '\')" title="Editar datos">'
        + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
        + 'Editar</button>'
        + '</div>'
        + '</div>' // end top row

        // ── Acciones de estado ──
        + '<div style="border-top:1px solid #F3F4F6;padding-top:12px;">'
        + '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9CA3AF;margin-bottom:8px;">Estado del cliente</div>'
        + '<div style="display:flex;gap:6px;flex-wrap:wrap;">'

        // Activar
        + '<button class="btn-sm ' + (client.type === 'active' ? 'btn-success' : 'btn-secondary') + '" onclick="setClientStatus(\'' + client.id + '\',\'active\')" ' + (client.type === 'active' ? 'disabled style="opacity:.6;cursor:default;"' : '') + '>'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        + ' Activo</button>'

        // Pausar
        + '<button class="btn-sm ' + (client.type === 'paused' ? 'btn-warning' : 'btn-secondary') + '" onclick="setClientStatus(\'' + client.id + '\',\'paused\')" ' + (client.type === 'paused' ? 'disabled style="opacity:.6;cursor:default;"' : '') + ' style="' + (client.type !== 'paused' ? '' : '') + '">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/><circle cx="12" cy="12" r="10"/></svg>'
        + ' Pausar</button>'

        // Pendiente
        + '<button class="btn-sm ' + (client.type === 'pending' ? 'btn-info' : 'btn-secondary') + '" onclick="setClientStatus(\'' + client.id + '\',\'pending\')" ' + (client.type === 'pending' ? 'disabled style="opacity:.6;cursor:default;"' : '') + '>'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        + ' Pendiente</button>'

        // Eliminar
        + '<button class="btn-sm btn-secondary" onclick="deleteClient(\'' + client.id + '\',\'' + client.name.replace(/'/g,"\\'") + '\')" style="margin-left:auto;color:#EF4444;border-color:#FECACA;">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>'
        + ' Eliminar</button>'

        + '</div></div>' // end estado

        // ── Portal de acceso ──
        + '<div style="border-top:1px solid #F3F4F6;padding-top:12px;margin-top:12px;">'
        + '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9CA3AF;margin-bottom:8px;">Portal del cliente</div>'
        + '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">'

        // Activar portal
        + '<button class="btn-sm ' + (client.portalAccess === 'active' ? 'btn-success' : 'btn-secondary') + '" onclick="setPortalAccess(\'' + client.id + '\',\'active\')">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        + ' Activar acceso</button>'

        // Pausar portal
        + '<button class="btn-sm btn-secondary" onclick="setPortalAccess(\'' + client.id + '\',\'paused\')" style="' + (client.portalAccess !== 'active' ? 'opacity:.5;' : '') + '">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>'
        + ' Pausar portal</button>'

        // Credenciales
        + '<button class="btn-sm btn-secondary" onclick="openCredentialsModal(\'' + client.id + '\')">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>'
        + ' Credenciales</button>'

        // Link del portal
        + '<button class="btn-sm btn-secondary" onclick="copyPortalLink(\'' + client.id + '\')" title="Copiar link del portal">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
        + ' Copiar link</button>'

        // Credenciales actuales (si existen)
        + (client.portalUsername ? '<span style="font-size:11px;color:#9CA3AF;padding:4px 8px;background:#F3F4F6;border-radius:6px;">👤 ' + client.portalUsername + '</span>' : '')

        + '</div></div>' // end portal

        // ── Configuración del portal ──
        + '<div style="border-top:1px solid #F3F4F6;padding-top:12px;margin-top:12px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
        + '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9CA3AF;">Configuración del portal</div>'
        + '<button class="btn-sm btn-secondary edit-portal-config-btn" data-clientid="' + client.id + '">'
        + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
        + ' Editar</button>'
        + '</div>'

        // Row 1: plan + objetivo
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">'

        // Plan
        + '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:9px;padding:10px 12px;">'
        + '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:3px;">Plan</div>'
        + '<div style="font-size:12px;font-weight:600;color:#0D1117;">' + (client.planName || '<span style="color:#C4C9D4;font-weight:400;">Sin definir</span>') + '</div>'
        + '</div>'

        // Objetivo
        + '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:9px;padding:10px 12px;">'
        + '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:3px;">Objetivo del mes</div>'
        + '<div style="font-size:12px;font-weight:600;color:#0D1117;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'
        + (client.objetivoMes && client.objetivoMes.texto ? client.objetivoMes.texto.substring(0,40) + (client.objetivoMes.texto.length > 40 ? '...' : '') : '<span style="color:#C4C9D4;font-weight:400;">Sin definir</span>')
        + '</div>'
        + '</div>'
        + '</div>' // end row 1

        // Row 2: referente + contacto
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">'

        // Referente
        + (function() {
            var ref = client.referente || {};
            if (!ref.nombre) return '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:9px;padding:10px 12px;">'
                + '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:3px;">Referente</div>'
                + '<div style="font-size:12px;color:#C4C9D4;">Sin definir</div></div>';
            var initials = ref.nombre.split(' ').map(function(w){ return w[0]; }).slice(0,2).join('').toUpperCase();
            var col = client.primaryColor || '#F97316';
            return '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:9px;padding:10px 12px;display:flex;align-items:center;gap:8px;">'
                + '<div style="width:26px;height:26px;border-radius:50%;background:' + col + ';color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + initials + '</div>'
                + '<div style="min-width:0;">'
                + '<div style="font-size:12px;font-weight:600;color:#0D1117;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + ref.nombre + '</div>'
                + '<div style="font-size:10px;color:#9CA3AF;">' + (ref.rol || '') + '</div>'
                + '</div></div>';
        })()

        // Contacto
        + '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:9px;padding:10px 12px;">'
        + '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:3px;">Contacto del equipo</div>'
        + '<div style="font-size:12px;color:#0D1117;">'
        + (client.whatsapp ? '<span style="font-size:11px;color:#10B981;font-weight:600;">WA ✓</span> ' : '')
        + (client.contactEmail ? '<span style="font-size:11px;color:#3B82F6;font-weight:600;">Email ✓</span>' : '')
        + (!client.whatsapp && !client.contactEmail ? '<span style="color:#C4C9D4;">Sin definir</span>' : '')
        + '</div>'
        + '</div>'

        + '</div>' // end row 2

        // Tips — solo indicador
        + (function() {
            var tips = client.tipsDelMes || [];
            var count = tips.filter(function(t){ return t && t.trim(); }).length;
            return '<div style="display:flex;align-items:center;gap:6px;">'
                + '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;">Tips del mes:</div>'
                + (count > 0
                    ? '<span style="font-size:11px;font-weight:600;color:#10B981;">' + count + ' tip' + (count !== 1 ? 's' : '') + ' configurado' + (count !== 1 ? 's' : '') + '</span>'
                    : '<span style="font-size:11px;color:#C4C9D4;">Sin configurar — se mostrarán tips automáticos</span>')
                + '</div>';
        })()

        + '</div>' // end config del portal

        + '</div>'; // end card
    });

    html += '</div>'
        + '<div style="padding:14px 0 4px;text-align:center;">'
        + '<button class="btn-primary" onclick="closeModal(\'manage-clients-modal\');openAddClientModal()">+ Agregar Cliente</button>'
        + '</div>';

    container.innerHTML = html;

    // Delegated listener — edit portal config button
    container.addEventListener('click', function handler(e) {
        var btn = e.target.closest('.edit-portal-config-btn');
        if (!btn) return;
        var cid = btn.getAttribute('data-clientid');
        openEditClientModal(cid);
        setTimeout(function() {
            var el = document.getElementById('edit-client-plan-name');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
        container.removeEventListener('click', handler);
    });
};

// ── GUARDAR NUEVO CLIENTE ──────────────────────────
window.saveClient = async function() {
    const name = document.getElementById('client-name')?.value?.trim();
    if (!name) { alert('El nombre del cliente es obligatorio'); return; }

    const client = {
        id:          'client-' + Date.now(),
        name:        name,
        brand:       document.getElementById('client-brand')?.value || '',
        industry:    document.getElementById('client-industry')?.value || 'other',
        type:        document.getElementById('client-type')?.value || 'new',
        notes:       document.getElementById('client-notes')?.value || '',
        primaryColor: document.getElementById('client-primary-color')?.value || '#F97316',
        portalAccess: 'disabled',
        createdAt:   new Date().toISOString()
    };

    // Foto
    const photoInput = document.getElementById('client-photo');
    if (photoInput?.files?.[0]) {
        client.photo = await compressPhoto(photoInput.files[0]);
    }

    if (!window.accounts) window.accounts = [{ id:'bondi-media', name:'Bondi Media', brand:'Principal', type:'active' }];
    window.accounts.push(client);
    await clientSave();
    await storage.set('bondi-calendar-' + client.id, []);
    await storage.set('bondi-leads-'    + client.id, []);

    // ── INTERCONEXIÓN SASC (LICENCIAS Y LOGIN) ──────
    try {
        const cleanBase = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
        const autoEmail = `${cleanBase}@bondimedia.com`;
        const autoPass = `bondi${Math.floor(1000 + Math.random() * 9000)}`;

        // 1. Crear usuario para Login
        if (window.UserManager) {
            window.UserManager.create({
                id: client.id, // Sincronizar IDs
                email: autoEmail,
                password: autoPass,
                name: name,
                role: 'client',
                roleName: 'Cliente (' + (client.brand || 'General') + ')'
            });
            console.log(`🔑 Credenciales generadas: ${autoEmail} / ${autoPass}`);
        }

        // 2. Crear Licencia Demo Automática
        if (window.Licensing) {
            window.Licensing.assignPlan(client.id, 'demo', 14);
        }

        // 3. Notificar a otros módulos (Planes y Licencias UI)
        window.dispatchEvent(new CustomEvent('licensing-updated'));
        
        if (window.showSuccess) {
            window.showSuccess(`Cliente "${name}" creado con acceso: ${autoEmail}`);
        }
    } catch (err) {
        console.warn('Falla en la interconexión de licencia:', err);
    }

    closeModal('client-modal');
    clientRefresh();
};

// ── EDITAR CLIENTE ─────────────────────────────────
window.openEditClientModal = function(clientId) {
    const client = (window.accounts || []).find(a => a.id === clientId);
    if (!client) return;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('edit-client-id',         client.id);
    set('edit-client-name',       client.name);
    set('edit-client-brand',      client.brand);
    set('edit-client-industry',   client.industry || 'other');
    set('edit-client-type',       client.type     || 'new');
    set('edit-client-notes',      client.notes);
    set('edit-client-plan-name',  client.planName || '');
    set('edit-client-whatsapp',   client.whatsapp || '');
    set('edit-client-email',      client.contactEmail || '');
    set('edit-client-platforms',  (client.platforms || []).join(', '));
    // Objetivo
    if (client.objetivoMes) {
        set('edit-client-objetivo-texto', client.objetivoMes.texto);
        const tipoEl = document.getElementById('edit-client-objetivo-tipo');
        if (tipoEl) tipoEl.value = client.objetivoMes.tipo || 'alcance';
    } else {
        set('edit-client-objetivo-texto', '');
    }
    // Referente
    const ref = client.referente || {};
    set('edit-client-ref-nombre',  ref.nombre  || '');
    set('edit-client-ref-rol',     ref.rol     || '');
    set('edit-client-ref-wa',      ref.whatsapp|| '');
    set('edit-client-ref-horario', ref.horario || '');

    // Tips del mes
    const tips = client.tipsDelMes || [];
    set('edit-client-tip1', tips[0] || '');
    set('edit-client-tip2', tips[1] || '');
    set('edit-client-tip3', tips[2] || '');
    const colorEl = document.getElementById('edit-client-primary-color');
    if (colorEl) colorEl.value = client.primaryColor || '#F97316';

    const prev = document.getElementById('edit-client-photo-preview');
    const init = document.getElementById('edit-client-photo-initials');
    if (client.photo && prev) { prev.src = client.photo; prev.style.display = 'block'; if (init) init.style.display = 'none'; }
    else { if (prev) prev.style.display = 'none'; if (init) init.style.display = 'block'; }

    const modal = document.getElementById('edit-client-modal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
};

window.saveEditedClient = async function() {
    const clientId = document.getElementById('edit-client-id')?.value;
    const idx = (window.accounts || []).findIndex(a => a.id === clientId);
    if (idx === -1) return;

    const get = id => document.getElementById(id)?.value || '';
    const objetivoTexto = get('edit-client-objetivo-texto');
    const objetivoTipo  = get('edit-client-objetivo-tipo');
    window.accounts[idx] = {
        ...window.accounts[idx],
        name:         get('edit-client-name'),
        brand:        get('edit-client-brand'),
        industry:     get('edit-client-industry'),
        type:         get('edit-client-type'),
        notes:        get('edit-client-notes'),
        primaryColor: get('edit-client-primary-color') || window.accounts[idx].primaryColor,
        planName:     get('edit-client-plan-name')     || window.accounts[idx].planName,
        whatsapp:     get('edit-client-whatsapp'),
        contactEmail: get('edit-client-email'),
        platforms:    get('edit-client-platforms') ? get('edit-client-platforms').split(',').map(function(p){ return p.trim(); }).filter(Boolean) : window.accounts[idx].platforms,
        objetivoMes:  objetivoTexto ? { texto: objetivoTexto, tipo: objetivoTipo || 'alcance' } : null,
        tipsDelMes: [
            get('edit-client-tip1') || '',
            get('edit-client-tip2') || '',
            get('edit-client-tip3') || ''
        ].filter(Boolean),
        referente: {
            nombre:    get('edit-client-ref-nombre'),
            rol:       get('edit-client-ref-rol'),
            whatsapp:  get('edit-client-ref-wa'),
            horario:   get('edit-client-ref-horario'),
        },
        updatedAt:    new Date().toISOString()
    };

    const editPhoto = document.getElementById('edit-client-photo');
    if (editPhoto?.files?.[0]) {
        window.accounts[idx].photo = await compressPhoto(editPhoto.files[0]);
    }

    await clientSave();
    if (typeof updateAccountSelector === 'function') updateAccountSelector();
    loadClientsList();
    closeModal('edit-client-modal');
    showMsg('Cliente actualizado correctamente');
};

// ── ESTADOS DEL CLIENTE ────────────────────────────

// ==================================================
// NOTIFICACIONES AL CLIENTE — se guardan en su storage
// y el portal las lee al cargar
// ==================================================
async function pushClientNotification(clientId, type, message, detail) {
    var key = 'bondi-client-notifications-' + clientId;
    var existing = [];
    try { existing = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) {}

    var notif = {
        id:        Date.now(),
        type:      type,       // 'info' | 'warning' | 'success' | 'danger'
        message:   message,
        detail:    detail || '',
        createdAt: new Date().toISOString(),
        read:      false
    };

    existing.unshift(notif);
    // Mantener máximo 20 notificaciones
    if (existing.length > 20) existing = existing.slice(0, 20);
    localStorage.setItem(key, JSON.stringify(existing));
}
window.pushClientNotification = pushClientNotification;

window.setClientStatus = async function(clientId, status) {
    const idx = (window.accounts || []).findIndex(a => a.id === clientId);
    if (idx === -1) return;
    window.accounts[idx].type = status;
    await clientSave();
    clientRefresh();

    // Notificación para el cliente
    const msgs = {
        active:  { type: 'success', msg: 'Tu cuenta fue activada',      detail: 'Tu cuenta está activa. El equipo de Bondi Media está trabajando en tu contenido.' },
        paused:  { type: 'warning', msg: 'Tu cuenta fue pausada',        detail: 'Tu cuenta se pausó temporalmente. Contactá a Bondi Media para más información.' },
        pending: { type: 'info',    msg: 'Tu cuenta está en revisión',   detail: 'Tu cuenta está siendo revisada por el equipo. Te avisaremos cuando haya novedades.' },
    };
    const n = msgs[status];
    if (n) await pushClientNotification(clientId, n.type, n.msg, n.detail);

    const labels = { active:'activado', paused:'pausado', pending:'marcado como pendiente' };
    showMsg('Cliente ' + (labels[status] || status));
};

// Compatible con código anterior
window.toggleClientStatus = async function(clientId) {
    const client = (window.accounts || []).find(a => a.id === clientId);
    if (!client) return;
    await window.setClientStatus(clientId, client.type === 'paused' ? 'active' : 'paused');
};

// ── ACCESO AL PORTAL ───────────────────────────────
window.setPortalAccess = async function(clientId, access) {
    const idx = (window.accounts || []).findIndex(a => a.id === clientId);
    if (idx === -1) return;
    window.accounts[idx].portalAccess = access;
    await clientSave();
    loadClientsList();

    // Notificación para el cliente
    const msgs = {
        active:  { type: 'success', msg: '¡Tu portal fue activado!',    detail: 'Ya podés ingresar con tus credenciales y ver el seguimiento de tu contenido.' },
        paused:  { type: 'warning', msg: 'Tu acceso al portal fue pausado', detail: 'El acceso al portal está temporalmente desactivado. Contactá a Bondi Media.' },
        disabled:{ type: 'info',    msg: 'Tu acceso al portal fue desactivado', detail: '' },
    };
    const n = msgs[access];
    if (n) await pushClientNotification(clientId, n.type, n.msg, n.detail);

    const labels = { active:'Portal activado', paused:'Portal pausado', disabled:'Portal desactivado' };
    showMsg(labels[access] || 'Acceso actualizado');
};

// ── CREDENCIALES DEL PORTAL ────────────────────────
window.openCredentialsModal = function(clientId) {
    const client = (window.accounts || []).find(a => a.id === clientId);
    if (!client) return;

    // Crear modal temporal si no existe
    let m = document.getElementById('credentials-modal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'credentials-modal';
        m.className = 'modal';
        m.style.zIndex = '10000';
        document.body.appendChild(m);
    }

    m.innerHTML = '<div class="modal-content" style="max-width:440px;">'
        + '<div class="modal-header">'
        + '<span class="modal-title">Credenciales del portal — ' + client.name + '</span>'
        + '<button class="modal-close" onclick="closeModal(\'credentials-modal\')">×</button>'
        + '</div>'
        + '<div style="padding:20px;">'
        + '<div class="form-group"><label class="form-label">Usuario</label>'
        + '<input class="form-input" id="cred-user" placeholder="Ej: clinica.garcia" value="' + (client.portalUsername || '') + '"></div>'
        + '<div class="form-group"><label class="form-label">Contraseña</label>'
        + '<div style="display:flex;gap:8px;">'
        + '<input class="form-input" id="cred-pass" placeholder="Contraseña" value="' + (client.portalPassword || '') + '" style="flex:1;">'
        + '<button class="btn-secondary btn-sm" onclick="generatePassword()">Generar</button>'
        + '</div></div>'
        + '<div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:10px;padding:12px;margin-top:8px;">'
        + '<div style="font-size:11px;font-weight:700;color:#0369A1;margin-bottom:4px;">Link del portal</div>'
        + '<div style="font-size:12px;color:#0C4A6E;word-break:break-all;" id="portal-link-display">' + getPortalLink() + '</div>'
        + '</div>'
        + '<div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end;">'
        + '<button class="btn-success" onclick="saveCredentials(\'' + clientId + '\')">Guardar credenciales</button>'
        + '<button class="btn-secondary" onclick="closeModal(\'credentials-modal\')">Cancelar</button>'
        + '</div></div></div>';

    m.classList.add('active');
    m.style.display = 'flex';
};

function getPortalLink() {
    const base = window.location.href.replace(/\/[^\/]*$/, '/');
    return base + 'client-portal.html';
}

window.generatePassword = function() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    let pass = '';
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    const el = document.getElementById('cred-pass');
    if (el) el.value = pass;
};

window.saveCredentials = async function(clientId) {
    const user = document.getElementById('cred-user')?.value?.trim();
    const pass = document.getElementById('cred-pass')?.value?.trim();
    if (!user || !pass) { alert('Usuario y contraseña son obligatorios'); return; }

    // Verificar que el usuario no esté duplicado
    const duplicate = (window.accounts || []).find(a => a.id !== clientId && a.portalUsername === user);
    if (duplicate) { alert('Ese usuario ya existe para otro cliente'); return; }

    const idx = (window.accounts || []).findIndex(a => a.id === clientId);
    if (idx === -1) return;
    window.accounts[idx].portalUsername = user;
    window.accounts[idx].portalPassword = pass;

    await clientSave();
    closeModal('credentials-modal');
    loadClientsList();
    showMsg('Credenciales guardadas para ' + window.accounts[idx].name);
};

window.copyPortalLink = function(clientId) {
    const link = getPortalLink();
    navigator.clipboard.writeText(link).then(function() {
        showMsg('Link del portal copiado');
    }).catch(function() { alert('Link: ' + link); });
};

// ── ELIMINAR CLIENTE ───────────────────────────────
window.deleteClient = async function(clientId, clientName) {
    if (clientId === 'bondi-media') { alert('No podés eliminar la cuenta principal'); return; }
    if (window.currentAccount === clientId) { alert('Cambiá a otra cuenta antes de eliminar ésta'); return; }
    if (!confirm('¿Eliminar "' + clientName + '"?\nSe borrará todo su contenido. Esta acción no se puede deshacer.')) return;

    const idx = (window.accounts || []).findIndex(a => a.id === clientId);
    if (idx === -1) return;

    const removedClient = window.accounts[idx];
    window.accounts.splice(idx, 1);
    await clientSave();

    localStorage.removeItem('bondi-calendar-' + clientId);
    localStorage.removeItem('bondi-leads-'    + clientId);
    localStorage.removeItem('bondi-photo-'    + clientId);
    localStorage.removeItem('bondi-client-notifications-' + clientId);

    // Eliminar credenciales y licencia asociada si existen
    if (window.UserManager && typeof window.UserManager.delete === 'function') {
        window.UserManager.delete(clientId);
    }
    if (window.Licensing && typeof window.Licensing.removeLicense === 'function') {
        window.Licensing.removeLicense(clientId);
    }

    // Asegurar que la cuenta actual siga siendo válida
    if (window.currentAccount === clientId) {
        window.currentAccount = 'bondi-media';
        await storage.set('bondi-current-account', 'bondi-media');
    }

    if (typeof updateAccountSelector === 'function') updateAccountSelector();
    loadClientsList();
    showMsg('"' + (removedClient?.name || clientName) + '" eliminado correctamente');
};

console.log('✅ client-manager.js cargado correctamente');