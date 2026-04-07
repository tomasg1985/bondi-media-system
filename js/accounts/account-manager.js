// ══════════════════════════════════════════════════════
// INTERCEPTOR: Garantiza que bondi-accounts nunca incluya fotos
// Aplica a CUALQUIER código que escriba en esa key (config.js, etc.)
// ══════════════════════════════════════════════════════
(function() {
    var _origSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function(key, value) {
        if (key === 'bondi-accounts') {
            try {
                var parsed = typeof value === 'string' ? JSON.parse(value) : value;
                if (Array.isArray(parsed)) {
                    var clean = parsed.map(function(a) {
                        if (a && a.photo) {
                            // Mover la foto a su key individual antes de limpiar
                            try { _origSetItem('bondi-photo-' + a.id, a.photo); } catch(e) {}
                            var c = Object.assign({}, a);
                            delete c.photo;
                            return c;
                        }
                        return a;
                    });
                    return _origSetItem(key, JSON.stringify(clean));
                }
            } catch(e) { /* Si falla el parse, guardar tal cual */ }
        }
        return _origSetItem(key, value);
    };
})();

// ==================================================
// ACCOUNT MANAGER — FIX
// - window.accounts en lugar de variable local
// - switchAccount definida UNA sola vez
// - sin alert() bloqueante
// ==================================================

let currentAccount = 'bondi-media';

// Helpers para normalizar y almacenar cuentas de forma consistente
window.prepareAccountsForStorage = function(accounts) {
    const clean = [];
    (accounts || []).forEach(function(a) {
        if (!a || !a.id) return;

        if (a.photo) {
            try { localStorage.setItem('bondi-photo-' + a.id, a.photo); } catch(e) {
                console.warn('No se pudo guardar la foto de', a.name, e);
            }
        }

        var copy = Object.assign({}, a);
        delete copy.photo;
        clean.push(copy);
    });
    return clean;
};

window.normalizeLoadedAccounts = function(savedAccounts) {
    const seen = new Set();
    const normalized = [];

    if (!Array.isArray(savedAccounts)) return normalized;

    savedAccounts.forEach(function(a) {
        if (!a || !a.id || seen.has(a.id)) return;
        seen.add(a.id);

        var record = Object.assign({}, a);
        var key = 'bondi-photo-' + a.id;

        if (a.photo) {
            try { localStorage.setItem(key, a.photo); } catch(e) {
                console.warn('No se pudo migrar foto de', a.name, e);
            }
        } else {
            var stored = localStorage.getItem(key);
            if (stored) record.photo = stored;
        }

        normalized.push(record);
    });

    if (!normalized.find(function(a) { return a.id === 'bondi-media'; })) {
        normalized.unshift({
            id: 'bondi-media',
            name: 'Bondi Media',
            brand: 'Principal',
            type: 'active',
            industry: 'Agencia',
            notes: 'Cuenta principal de la agencia'
        });
    }

    return normalized;
};

// SIEMPRE usar window.accounts para que client-manager.js
// y account-manager.js compartan el mismo array
window.accounts = [{
    id: 'bondi-media',
    name: 'Bondi Media',
    brand: 'Principal',
    type: 'active',
    industry: 'Agencia',
    notes: 'Cuenta principal de la agencia'
}];

async function loadAccounts() {
    const saved = await storage.get('bondi-accounts');
    if (saved && saved.length > 0) {
        window.accounts = window.normalizeLoadedAccounts(saved);

        // Siempre escribir la versión limpia de accounts para eliminar datos antiguos o duplicados
        try {
            localStorage.setItem('bondi-accounts', JSON.stringify(window.prepareAccountsForStorage(window.accounts)));
        } catch(e) {
            console.warn('No se pudo reescribir bondi-accounts al cargar:', e);
        }
    }
    // Restaurar cuenta activa guardada
    const savedAccount = await storage.get('bondi-current-account');
    if (savedAccount && window.accounts.find(a => a.id === savedAccount)) {
        currentAccount = savedAccount;
    }
    updateAccountSelector();
    // Si había un cliente activo, actualizar el indicador visual
    const acc = window.accounts.find(a => a.id === currentAccount);
    if (acc) updateActiveClientIndicator(acc);
}

// Exponer para que initApp la pueda llamar
window.loadAccounts = loadAccounts;

function updateAccountSelector() {
    const selector = document.getElementById('account-selector');
    if (!selector) return;
    selector.innerHTML = window.accounts
        .map(acc => '<option value="' + acc.id + '"' + (acc.id === currentAccount ? ' selected' : '') + '>'
            + acc.name + (acc.brand ? ' (' + acc.brand + ')' : '') + '</option>')
        .join('');

    // También actualizar el panel multi-cliente si está abierto
    if (typeof renderMultiClientPanel === 'function') renderMultiClientPanel();
}

// switchAccount — definida UNA sola vez, con avatar y re-render
window.switchAccount = async function(accountId) {
    const acc = (window.accounts || []).find(a => a.id === accountId);
    if (!acc) { console.error('Cuenta no encontrada:', accountId); return; }

    currentAccount = accountId;
    await storage.set('bondi-current-account', accountId);

    // Cargar calendario del cliente
    const savedCalendar = await storage.get('bondi-calendar-' + accountId);
    if (savedCalendar && savedCalendar.length > 0) {
        appData.calendar = savedCalendar;
    } else {
        appData.calendar = accountId === 'bondi-media' ? (window.MARZO_CALENDAR ? [...window.MARZO_CALENDAR] : []) : [];
    }

    // Cargar leads del cliente
    const savedLeads = await storage.get('bondi-leads-' + accountId);
    appData.leads = savedLeads || [];

    // Actualizar selector
    updateAccountSelector();

    // Actualizar avatar
    if (typeof loadAvatarForAccount === 'function') {
        await loadAvatarForAccount(accountId);
    }

    // Actualizar nombre en sidebar header
    const nameEl = document.getElementById('account-name');
    if (nameEl) nameEl.textContent = acc.name;
    const roleEl = document.getElementById('account-role');
    if (roleEl) roleEl.textContent = acc.brand || 'Cliente';

    // Re-render completo — misma secuencia que initApp()
    if (typeof loadDashboard         === 'function') loadDashboard();
    if (typeof loadCalendar          === 'function') loadCalendar();
    if (typeof loadContent           === 'function') loadContent();
    if (typeof loadTracking          === 'function') loadTracking();
    if (typeof loadLeads             === 'function') loadLeads();
    if (typeof loadUpcoming          === 'function') loadUpcoming();
    if (typeof loadGlobalPerformance === 'function') loadGlobalPerformance();
    if (typeof updateAllCharts       === 'function') updateAllCharts();
    if (typeof updateSidebarBadges   === 'function') updateSidebarBadges();
    if (typeof updateMonthCounts     === 'function') updateMonthCounts();
    if (typeof renderCalendarItems   === 'function') {
        renderCalendarItems('calendar-content');
        if (typeof renderContentList === 'function') {
            renderContentList();
        } else {
            renderCalendarItems('content-list');
        }
    }
    if (typeof renderMonthTabs       === 'function') renderMonthTabs();

    // Navegar al dashboard para que el cambio sea visible
    if (typeof navigateTo === 'function') {
        navigateTo('dashboard');
    }

    // Actualizar indicador visual en topbar + sidebar header
    updateActiveClientIndicator(acc);

    // Toast sin alert bloqueante
    if (typeof showSuccess === 'function') {
        showSuccess('Cuenta cambiada a ' + acc.name);
    }
};

// ── INDICADOR DE CLIENTE ACTIVO ────────────────────
function updateActiveClientIndicator(acc) {
    const indicator = document.getElementById('active-client-indicator');
    const aciName   = document.getElementById('aci-name');
    const nameEl    = document.getElementById('account-name');
    const roleEl    = document.getElementById('account-role');
    const rolePill  = document.getElementById('user-role-badge-wrap');
    const shLogo    = document.querySelector('.sh-logomark text, .sh-logomark');

    const isPrincipal = acc.id === 'bondi-media';

    // Topbar pill
    if (indicator) {
        if (isPrincipal) {
            indicator.style.display = 'none';
        } else {
            indicator.style.display = 'flex';
            if (aciName) aciName.textContent = acc.name;
            // Color del cliente si tiene uno personalizado
            if (acc.primaryColor) {
                indicator.style.borderColor = acc.primaryColor + '88';
                indicator.style.background  = acc.primaryColor + '14';
                const dot = document.getElementById('aci-dot');
                if (dot) dot.style.background = acc.primaryColor;
                if (aciName) aciName.style.color = acc.primaryColor;
            } else {
                indicator.style.borderColor = '#FED7AA';
                indicator.style.background  = '#FFF7ED';
                const dot = document.getElementById('aci-dot');
                if (dot) dot.style.background = '#F97316';
                if (aciName) aciName.style.color = '#C2410C';
            }
        }
    }

    // Sidebar header — nombre y rol
    if (nameEl) nameEl.textContent = isPrincipal ? 'Bondi Media' : acc.name;
    if (roleEl) roleEl.textContent = isPrincipal ? 'Cuenta Principal' : (acc.brand ? acc.brand : acc.industry || 'Cliente');

    // Role pill — ocultar en clientes, mostrar en principal
    if (rolePill) rolePill.style.display = isPrincipal ? '' : 'none';

    // Botón del switcher en topbar
    const switcherLabel = document.getElementById('client-switcher-label');
    const switcherBtn   = document.getElementById('client-switcher-btn');
    if (switcherLabel) switcherLabel.textContent = acc.name;
    if (switcherBtn && !isPrincipal) {
        switcherBtn.style.borderColor = (acc.primaryColor || '#F97316') + '88';
        switcherBtn.style.background  = (acc.primaryColor || '#F97316') + '0A';
        switcherBtn.style.color       = acc.primaryColor || '#F97316';
    } else if (switcherBtn) {
        switcherBtn.style.borderColor = '#E5E7EB';
        switcherBtn.style.background  = '#fff';
        switcherBtn.style.color       = '#4B5563';
    }

    // Avatar initials
    const initials = acc.name.split(' ').map(function(w){ return w[0]; }).slice(0,2).join('').toUpperCase();
    const avatarInitEl = document.getElementById('avatar-initials');
    if (avatarInitEl && !acc.photo) avatarInitEl.textContent = initials;
}

// Exponer para que otros módulos puedan llamarla
window.updateActiveClientIndicator = updateActiveClientIndicator;

// Alias para compatibilidad
window.currentAccount = currentAccount;
Object.defineProperty(window, 'currentAccount', {
    get: function() { return currentAccount; },
    set: function(v) { currentAccount = v; }
});

// ==================================================
// updateAllModules — alias global para que cualquier
// módulo que lo llame dispare el refresco completo
// ==================================================
window.updateAllModules = async function() {
    if (typeof loadDashboard         === 'function') loadDashboard();
    if (typeof loadCalendar          === 'function') loadCalendar();
    if (typeof loadContent           === 'function') loadContent();
    if (typeof loadTracking          === 'function') loadTracking();
    if (typeof loadLeads             === 'function') loadLeads();
    if (typeof loadUpcoming          === 'function') loadUpcoming();
    if (typeof loadGlobalPerformance === 'function') loadGlobalPerformance();
    if (typeof updateAllCharts       === 'function') updateAllCharts();
    if (typeof updateSidebarBadges   === 'function') updateSidebarBadges();
    if (typeof updateMonthCounts     === 'function') updateMonthCounts();
    if (typeof renderCalendarItems   === 'function') {
        renderCalendarItems('calendar-content');
        if (typeof renderContentList === 'function') {
            renderContentList();
        } else {
            renderCalendarItems('content-list');
        }
    }
    if (typeof renderMonthTabs       === 'function') renderMonthTabs();
};

// ==================================================
// MULTI-CLIENT PANEL — selector compacto en modal
// ==================================================

// Lista de clientes "abiertos" para trabajo paralelo
window.openClients = window.openClients || [];

window.renderMultiClientPanel = function() {
    var container = document.getElementById('multi-client-panel');
    if (!container) return;

    var clients = (window.accounts || []).filter(function(a){ return a.id !== 'bondi-media'; });

    if (!clients.length) {
        container.innerHTML = '<div style="text-align:center;padding:24px 16px;">'
            + '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" style="display:block;margin:0 auto 10px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>'
            + '<p style="font-size:13px;color:#9CA3AF;">Sin clientes registrados</p>'
            + '</div>';
        return;
    }

    container.innerHTML = '';

    var statusDot = { active:'#10B981', paused:'#F59E0B', pending:'#3B82F6', new:'#9CA3AF' };
    var statusLabel = { active:'Activo', paused:'Pausado', pending:'Pendiente', new:'Nuevo' };
    var now = new Date();

    clients.forEach(function(c) {
        var isActive   = (currentAccount === c.id);
        var avatarBg   = c.primaryColor || '#F97316';
        var dot        = statusDot[c.type]   || '#9CA3AF';
        var label      = statusLabel[c.type] || 'Nuevo';
        var initials   = c.name.split(' ').map(function(w){ return w[0]; }).slice(0,2).join('').toUpperCase();
        var cal        = JSON.parse(localStorage.getItem('bondi-calendar-' + c.id) || '[]');
        var monthKey   = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
        var monthCount = cal.filter(function(x){ return x.date && x.date.startsWith(monthKey); }).length;

        // Build row via DOM
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;cursor:pointer;'
            + 'border:1.5px solid ' + (isActive ? avatarBg + '55' : '#E5E7EB') + ';'
            + 'background:' + (isActive ? avatarBg + '0A' : '#fff') + ';'
            + 'margin-bottom:6px;transition:all .14s;';

        row.addEventListener('mouseenter', function(){ this.style.background = avatarBg + '0F'; this.style.borderColor = avatarBg + '66'; });
        row.addEventListener('mouseleave', function(){ this.style.background = isActive ? avatarBg + '0A' : '#fff'; this.style.borderColor = isActive ? avatarBg + '55' : '#E5E7EB'; });
        row.addEventListener('click', function(){ selectClientFromPanel(c.id); });

        // Avatar
        var avatar = document.createElement('div');
        avatar.style.cssText = 'width:36px;height:36px;border-radius:50%;background:' + avatarBg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;color:#fff;box-shadow:0 2px 6px ' + avatarBg + '40;overflow:hidden;';
        if (c.photo) {
            var img = document.createElement('img');
            img.src = c.photo; img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
            avatar.appendChild(img);
        } else {
            avatar.textContent = initials;
        }

        // Info
        var info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';
        var nameDiv = document.createElement('div');
        nameDiv.style.cssText = 'font-size:13px;font-weight:600;color:#0D1117;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:Inter,sans-serif;';
        nameDiv.textContent = c.name;
        var metaDiv = document.createElement('div');
        metaDiv.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:2px;';
        metaDiv.innerHTML = '<span style="width:5px;height:5px;border-radius:50%;background:' + dot + ';flex-shrink:0;display:inline-block;"></span>'
            + '<span style="font-size:11px;color:#9CA3AF;font-family:Inter,sans-serif;">' + label + (c.industry ? ' · ' + c.industry : '') + '</span>'
            + '<span style="font-size:11px;color:#C4C9D4;">·</span>'
            + '<span style="font-size:11px;color:#9CA3AF;">' + monthCount + ' piezas</span>';
        info.appendChild(nameDiv);
        info.appendChild(metaDiv);

        // Badge / arrow
        var badge = document.createElement('div');
        badge.style.cssText = 'flex-shrink:0;';
        if (isActive) {
            badge.innerHTML = '<span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;background:' + avatarBg + '20;color:' + avatarBg + ';border:1px solid ' + avatarBg + '44;">Activo</span>';
        } else {
            badge.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4C9D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
        }

        row.appendChild(avatar);
        row.appendChild(info);
        row.appendChild(badge);
        container.appendChild(row);
    });
};

window.selectClientFromPanel = async function(clientId) {
    await window.switchAccount(clientId);
    closeModal('multi-client-modal');
};

window.openMultiClientModal = function() {
    var modal = document.getElementById('multi-client-modal');
    if (!modal) {
        // Build via DOM — zero quote conflicts
        modal = document.createElement('div');
        modal.id = 'multi-client-modal';
        modal.className = 'modal';
        modal.style.zIndex = '9999';

        var box = document.createElement('div');
        box.className = 'modal-content';
        box.style.maxWidth = '480px';

        // Header
        var hdr = document.createElement('div');
        hdr.className = 'modal-header';
        hdr.innerHTML = '<span class="modal-title" style="display:flex;align-items:center;gap:8px;">'
            + '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>'
            + 'Cambiar cliente</span>';
        var closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', function(){ closeModal('multi-client-modal'); });
        hdr.appendChild(closeBtn);

        // Bondi Media row
        var bmSection = document.createElement('div');
        bmSection.style.cssText = 'padding:12px 16px;border-bottom:1px solid #F3F4F6;';
        var bmRow = document.createElement('div');
        bmRow.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;cursor:pointer;border:1.5px solid #E5E7EB;background:#fff;transition:all .14s;';
        bmRow.addEventListener('mouseenter', function(){ this.style.background='#FFF7ED'; this.style.borderColor='#FED7AA'; });
        bmRow.addEventListener('mouseleave', function(){ this.style.background='#fff'; this.style.borderColor='#E5E7EB'; });
        bmRow.addEventListener('click', function(){ selectClientFromPanel('bondi-media'); });
        bmRow.innerHTML = '<div style="width:36px;height:36px;border-radius:50%;background:#0C1220;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;">BM</div>'
            + '<div style="flex:1;"><div style="font-size:13px;font-weight:600;color:#0D1117;font-family:Inter,sans-serif;">Bondi Media</div>'
            + '<div style="font-size:11px;color:#9CA3AF;font-family:Inter,sans-serif;">Cuenta principal de la agencia</div></div>'
            + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4C9D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
        bmSection.appendChild(bmRow);

        // Client list panel
        var panel = document.createElement('div');
        panel.id = 'multi-client-panel';
        panel.style.cssText = 'padding:12px 16px;max-height:360px;overflow-y:auto;';

        // Footer
        var footer = document.createElement('div');
        footer.style.cssText = 'padding:10px 16px 14px;border-top:1px solid #F3F4F6;text-align:center;';
        var addBtn = document.createElement('button');
        addBtn.className = 'btn-secondary btn-sm';
        addBtn.style.fontSize = '12px';
        addBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:middle;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Agregar cliente';
        addBtn.addEventListener('click', function(){ closeModal('multi-client-modal'); openAddClientModal(); });
        footer.appendChild(addBtn);

        box.appendChild(hdr);
        box.appendChild(bmSection);
        box.appendChild(panel);
        box.appendChild(footer);
        modal.appendChild(box);
        modal.addEventListener('click', function(e){ if (e.target === modal) closeModal('multi-client-modal'); });
        document.body.appendChild(modal);
    }

    renderMultiClientPanel();
    modal.classList.add('active');
};