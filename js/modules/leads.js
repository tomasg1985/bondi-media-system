// ==================================================
// LEADS & PIPELINE
// FIX: Reemplaza el placeholder vacío ("No hay leads") con una
// implementación completa que incluye tabla, estadísticas de pipeline,
// vista de embudo y carga de datos reales desde storage.
// ==================================================

console.log('💬 Cargando leads.js...');

// Estado del pipeline con colores y etiquetas
const LEAD_STAGES = {
    new:       { label: 'Nuevo',     color: '#6b7280', bg: '#f3f4f6', icon: '🆕' },
    qualified: { label: 'Calificado', color: '#3b82f6', bg: '#dbeafe', icon: '✅' },
    call:      { label: 'En llamada', color: '#f59e0b', bg: '#fef3c7', icon: '📞' },
    proposal:  { label: 'Propuesta',  color: '#8b5cf6', bg: '#ede9fe', icon: '📋' },
    won:       { label: 'Ganado',     color: '#10b981', bg: '#d1fae5', icon: '🏆' },
    lost:      { label: 'Perdido',    color: '#ef4444', bg: '#fee2e2', icon: '❌' }
};

const SOURCE_LABELS = {
    instagram: '📸 Instagram',
    facebook:  '📘 Facebook',
    tiktok:    '🎵 TikTok',
    whatsapp:  '💬 WhatsApp',
    referral:  '🤝 Referido',
    other:     '🔗 Otro'
};

// ==================================================
// CARGAR SECCIÓN LEADS
// ==================================================
window.loadLeads = async function() {
    console.log('💬 Cargando leads...');
    const saved = await storage.get('bondi-leads-' + (window.currentAccount || 'bondi-media'));
    if (saved) window.appData.leads = saved;
    if (!window.appData.leads) window.appData.leads = [];

    const container = document.getElementById('leads-content');
    if (!container) return;

    const leads = window.appData.leads;

    // Calcular estadísticas
    const stats = {
        total:    leads.length,
        active:   leads.filter(l => !['won','lost'].includes(l.status)).length,
        won:      leads.filter(l => l.status === 'won').length,
        pipeline: leads.filter(l => !['won','lost'].includes(l.status)).reduce((s, l) => s + (l.value || 0), 0)
    };

    // Agrupar por etapa para el funnel
    const byStage = {};
    Object.keys(LEAD_STAGES).forEach(s => { byStage[s] = leads.filter(l => l.status === s); });

    // HTML de estadísticas
    let statsHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;margin-bottom:24px;">'
        + _statCard('💬', stats.total, 'Leads totales', 'linear-gradient(135deg,#667eea,#764ba2)')
        + _statCard('🔥', stats.active, 'En progreso', 'linear-gradient(135deg,#f59e0b,#d97706)')
        + _statCard('🏆', stats.won, 'Ganados', 'linear-gradient(135deg,#10b981,#059669)')
        + _statCard('💰', '$' + stats.pipeline.toLocaleString(), 'Pipeline activo', 'linear-gradient(135deg,#3b82f6,#1d4ed8)')
        + '</div>';

    // HTML del funnel (solo etapas con leads o las primeras 4)
    let funnelHtml = '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">';
    Object.entries(LEAD_STAGES).forEach(([key, stage]) => {
        const count = byStage[key].length;
        funnelHtml += '<div onclick="filterLeads(\'' + key + '\')" style="flex:1;min-width:80px;background:' + stage.bg + ';border:2px solid ' + (count > 0 ? stage.color : 'transparent') + ';border-radius:10px;padding:12px;text-align:center;cursor:pointer;transition:all .2s;" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'\';">'
            + '<div style="font-size:20px;">' + stage.icon + '</div>'
            + '<div style="font-size:22px;font-weight:700;color:' + stage.color + ';margin:4px 0;">' + count + '</div>'
            + '<div style="font-size:11px;color:' + stage.color + ';font-weight:600;">' + stage.label + '</div>'
            + '</div>';
    });
    funnelHtml += '</div>';

    // HTML de la tabla
    let tableHtml = '';
    if (leads.length === 0) {
        tableHtml = '<div style="padding:48px;text-align:center;color:var(--gray-400);">'
            + '<div style="font-size:56px;margin-bottom:16px;">📭</div>'
            + '<p style="font-size:16px;font-weight:600;color:var(--gray-600);margin-bottom:8px;">Aún no hay leads registrados</p>'
            + '<p style="font-size:13px;margin-bottom:20px;">Cuando tus publicaciones generen consultas, registralas aquí para darles seguimiento</p>'
            + '<button class="btn-primary" onclick="openAddLeadModal()">+ Agregar primer lead</button>'
            + '</div>';
    } else {
        tableHtml = '<div style="overflow-x:auto;">'
            + '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
            + '<thead><tr style="background:var(--gray-50);border-bottom:2px solid var(--gray-200);">'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">NOMBRE / EMPRESA</th>'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">ORIGEN</th>'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">KEYWORD</th>'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">ETAPA</th>'
            + '<th style="padding:12px;text-align:right;font-size:12px;font-weight:600;color:var(--gray-500);">VALOR</th>'
            + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">FECHA</th>'
            + '<th style="padding:12px;text-align:center;font-size:12px;font-weight:600;color:var(--gray-500);">ACCIONES</th>'
            + '</tr></thead><tbody id="leads-table-body">'
            + _renderLeadRows(leads)
            + '</tbody></table></div>';
    }

    container.innerHTML = statsHtml + funnelHtml
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'
        + '<span style="font-size:13px;color:var(--gray-500);" id="leads-filter-label">Mostrando todos los leads</span>'
        + (leads.length > 0 ? '<button class="btn-secondary btn-sm" onclick="filterLeads(\'all\')">Ver todos</button>' : '')
        + '</div>'
        + tableHtml;
};

function _statCard(icon, value, label, gradient) {
    return '<div style="background:' + gradient + ';padding:20px;border-radius:12px;color:white;text-align:center;">'
        + '<div style="font-size:24px;margin-bottom:4px;">' + icon + '</div>'
        + '<div style="font-size:26px;font-weight:700;">' + value + '</div>'
        + '<div style="font-size:12px;opacity:.85;margin-top:2px;">' + label + '</div>'
        + '</div>';
}

function _renderLeadRows(leads) {
    return leads.map(lead => {
        const stage = LEAD_STAGES[lead.status] || LEAD_STAGES.new;
        const source = SOURCE_LABELS[lead.source] || lead.source || '—';
        const dateStr = lead.date ? new Date(lead.date).toLocaleDateString('es-AR', {day:'2-digit',month:'short'}) : '—';
        return '<tr style="border-bottom:1px solid var(--gray-100);transition:background .15s;" onmouseover="this.style.background=\'var(--gray-50)\'" onmouseout="this.style.background=\'\';">'
            + '<td style="padding:12px;font-weight:500;">' + (lead.name || '—') + '</td>'
            + '<td style="padding:12px;font-size:13px;">' + source + '</td>'
            + '<td style="padding:12px;font-size:13px;color:var(--gray-500);">' + (lead.keyword || '—') + '</td>'
            + '<td style="padding:12px;">'
            + '<span style="font-size:12px;padding:3px 10px;border-radius:20px;background:' + stage.bg + ';color:' + stage.color + ';font-weight:600;">'
            + stage.icon + ' ' + stage.label + '</span>'
            + '</td>'
            + '<td style="padding:12px;text-align:right;font-weight:600;">' + (lead.value ? '$' + lead.value.toLocaleString() : '—') + '</td>'
            + '<td style="padding:12px;font-size:13px;color:var(--gray-500);">' + dateStr + '</td>'
            + '<td style="padding:12px;text-align:center;white-space:nowrap;">'
            + '<button class="btn-secondary btn-sm" onclick="openEditLeadModal(' + lead.id + ')" style="margin-right:4px;">✏️</button>'
            + '<button class="btn-danger btn-sm" onclick="deleteLead(' + lead.id + ')">🗑️</button>'
            + '</td>'
            + '</tr>';
    }).join('');
}

// Filtrar por etapa al hacer click en el funnel
window.filterLeads = function(stage) {
    const leads = window.appData.leads || [];
    const filtered = stage === 'all' ? leads : leads.filter(l => l.status === stage);
    const tbody = document.getElementById('leads-table-body');
    const label = document.getElementById('leads-filter-label');
    if (tbody) tbody.innerHTML = _renderLeadRows(filtered);
    if (label) {
        label.textContent = stage === 'all'
            ? 'Mostrando todos los leads (' + leads.length + ')'
            : 'Filtrando: ' + (LEAD_STAGES[stage]?.label || stage) + ' (' + filtered.length + ')';
    }
};

// ==================================================
// ABRIR MODAL — Usa el modal existente en index.html
// ==================================================
window.openAddLeadModal = function() {
    const dateInput = document.getElementById('lead-date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    const modal = document.getElementById('lead-modal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = '';
    }
};

// ==================================================
// GUARDAR LEAD
// ==================================================
window.saveLead = async function() {
    const lead = {
        id:      Date.now(),
        date:    document.getElementById('lead-date')?.value || new Date().toISOString().split('T')[0],
        name:    document.getElementById('lead-name')?.value || '',
        source:  document.getElementById('lead-source')?.value || 'instagram',
        keyword: document.getElementById('lead-keyword')?.value || '',
        status:  document.getElementById('lead-status')?.value || 'new',
        value:   parseInt(document.getElementById('lead-value')?.value) || 0
    };

    if (!lead.name) { alert('❌ El nombre es obligatorio'); return; }
    if (!window.appData.leads) window.appData.leads = [];
    window.appData.leads.push(lead);

    await storage.set('bondi-leads-' + (window.currentAccount || 'bondi-media'), window.appData.leads);

    closeModal('lead-modal');
    const form = document.querySelector('#lead-modal form');
    if (form) form.reset();

    if (typeof addNotification === 'function') addNotification('Lead Agregado', 'Nuevo lead: ' + lead.name);
    if (typeof showSuccess === 'function') showSuccess('Lead "' + lead.name + '" guardado correctamente');
    window.loadLeads();
};

// ==================================================
// EDITAR LEAD (abre el mismo modal con datos precargados)
// ==================================================
window.openEditLeadModal = function(leadId) {
    const lead = (window.appData.leads || []).find(l => l.id === leadId);
    if (!lead) return;

    // Reusar el modal existente rellenando sus campos
    const dateInput    = document.getElementById('lead-date');
    const nameInput    = document.getElementById('lead-name');
    const sourceInput  = document.getElementById('lead-source');
    const keywordInput = document.getElementById('lead-keyword');
    const statusInput  = document.getElementById('lead-status');
    const valueInput   = document.getElementById('lead-value');

    if (dateInput)    dateInput.value    = lead.date    || '';
    if (nameInput)    nameInput.value    = lead.name    || '';
    if (sourceInput)  sourceInput.value  = lead.source  || 'instagram';
    if (keywordInput) keywordInput.value = lead.keyword || '';
    if (statusInput)  statusInput.value  = lead.status  || 'new';
    if (valueInput)   valueInput.value   = lead.value   || '';

    // Cambiar el título del modal
    const title = document.querySelector('#lead-modal .modal-title');
    if (title) title.textContent = '✏️ Editar Lead';

    // Guardar el id del lead en edición
    window._editingLeadId = leadId;

    // Cambiar el submit para actualizar en lugar de crear
    const form = document.querySelector('#lead-modal form');
    if (form) {
        form.onsubmit = async function(e) {
            e.preventDefault();
            await updateLead(leadId);
            form.onsubmit = function(e) { e.preventDefault(); window.saveLead(); };
            const titleEl = document.querySelector('#lead-modal .modal-title');
            if (titleEl) titleEl.textContent = '💬 Nuevo Lead';
        };
    }

    const modal = document.getElementById('lead-modal');
    if (modal) { modal.classList.add('active'); modal.style.display = ''; }
};

async function updateLead(leadId) {
    const leads = window.appData.leads || [];
    const index = leads.findIndex(l => l.id === leadId);
    if (index === -1) return;

    leads[index] = {
        ...leads[index],
        date:    document.getElementById('lead-date')?.value    || leads[index].date,
        name:    document.getElementById('lead-name')?.value    || leads[index].name,
        source:  document.getElementById('lead-source')?.value  || leads[index].source,
        keyword: document.getElementById('lead-keyword')?.value || leads[index].keyword,
        status:  document.getElementById('lead-status')?.value  || leads[index].status,
        value:   parseInt(document.getElementById('lead-value')?.value) || leads[index].value
    };

    await storage.set('bondi-leads-' + (window.currentAccount || 'bondi-media'), leads);
    closeModal('lead-modal');
    if (typeof showSuccess === 'function') showSuccess('Lead actualizado');
    window.loadLeads();
}

// ==================================================
// ELIMINAR LEAD
// ==================================================
window.deleteLead = async function(leadId) {
    if (!confirm('¿Eliminar este lead?')) return;
    window.appData.leads = (window.appData.leads || []).filter(l => l.id !== leadId);
    await storage.set('bondi-leads-' + (window.currentAccount || 'bondi-media'), window.appData.leads);
    if (typeof showSuccess === 'function') showSuccess('Lead eliminado');
    window.loadLeads();
};

console.log('✅ leads.js cargado');