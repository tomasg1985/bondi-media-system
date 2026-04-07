// ==================================================
// BRIEFINGS.JS
// FIX: Expandidos los campos del briefing para incluir información
// completa y útil para la gestión de clientes. Se agrega:
// - Presupuesto estimado
// - Plataformas objetivo
// - Referencias visuales / inspiración
// - Productos o servicios a comunicar
// - Restricciones o limitaciones
// - Fecha de entrega / deadline
// - Historial completo de briefings en la tabla
// - Vista detallada mejorada (sin alert, en un modal dedicado)
// ==================================================

let briefings = [];

// ==================================================
// CARGAR BRIEFINGS
// ==================================================
async function loadBriefings() {
    const saved = await storage.get('bondi-briefings');
    if (saved) briefings = saved;

    // Intentar en ambos contenedores posibles
    const tbody   = document.getElementById('briefings-table');
    const content = document.getElementById('briefings-content');

    if (!tbody && !content) return;

    if (briefings.length === 0) {
        const emptyHtml = '<div style="padding:48px;text-align:center;color:var(--gray-400);">'
            + '<div style="font-size:56px;margin-bottom:16px;">📝</div>'
            + '<p style="font-size:16px;font-weight:600;color:var(--gray-600);margin-bottom:8px;">Aún no hay briefings registrados</p>'
            + '<p style="font-size:13px;margin-bottom:20px;">Creá el primer briefing para documentar la estrategia de tu cliente</p>'
            + '<button class="btn-primary" onclick="openAddBriefingModal()">+ Crear primer briefing</button>'
            + '</div>';
        if (tbody) tbody.innerHTML = '<tr><td colspan="6">' + emptyHtml + '</td></tr>';
        if (content) content.innerHTML = emptyHtml;
        return;
    }

    const tableHtml = briefings.slice().reverse().map(b => {
        const client = (window.accounts || []).find(a => a.id === b.clientId);
        const typeLabels = { strategy: '🎯 Estrategia', campaign: '📣 Campaña', brand: '🎨 Marca', launch: '🚀 Lanzamiento', other: '📋 Otro' };
        const statusLabels = { pending: '⏳ Pendiente', in_progress: '🔄 En proceso', approved: '✅ Aprobado', completed: '🏁 Completado' };
        const statusColors = { pending: '#f59e0b', in_progress: '#3b82f6', approved: '#10b981', completed: '#6b7280' };
        const statusBg    = { pending: '#fef3c7', in_progress: '#dbeafe', approved: '#d1fae5', completed: '#f3f4f6' };
        const s = b.status || 'pending';
        const dateStr = b.date ? new Date(b.date).toLocaleDateString('es-AR', {day:'2-digit',month:'short',year:'numeric'}) : '—';
        const deadline = b.deadline ? new Date(b.deadline).toLocaleDateString('es-AR', {day:'2-digit',month:'short'}) : '—';
        return '<tr style="border-bottom:1px solid var(--gray-100);transition:background .15s;" onmouseover="this.style.background=\'var(--gray-50)\'" onmouseout="this.style.background=\'\';">'
            + '<td style="padding:12px;font-size:13px;color:var(--gray-500);">' + dateStr + '</td>'
            + '<td style="padding:12px;font-weight:500;">' + (client ? client.name : '<span style="color:var(--gray-400);">—</span>') + '</td>'
            + '<td style="padding:12px;font-size:13px;">' + (typeLabels[b.type] || b.type || '—') + '</td>'
            + '<td style="padding:12px;font-size:13px;color:var(--gray-500);">' + deadline + '</td>'
            + '<td style="padding:12px;">'
            + '<span style="font-size:12px;padding:3px 10px;border-radius:20px;background:' + (statusBg[s]||'#f3f4f6') + ';color:' + (statusColors[s]||'#6b7280') + ';font-weight:600;">' + (statusLabels[s]||s) + '</span>'
            + '</td>'
            + '<td style="padding:12px;text-align:center;white-space:nowrap;">'
            + '<button class="btn-secondary btn-sm" onclick="viewBriefing(' + b.id + ')" style="margin-right:4px;">👁️ Ver</button>'
            + '<button class="btn-secondary btn-sm" onclick="updateBriefingStatus(' + b.id + ')" style="margin-right:4px;">🔄</button>'
            + '<button class="btn-danger btn-sm" onclick="deleteBriefing(' + b.id + ')">🗑️</button>'
            + '</td>'
            + '</tr>';
    }).join('');

    const fullTable = '<div style="overflow-x:auto;">'
        + '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
        + '<thead><tr style="background:var(--gray-50);border-bottom:2px solid var(--gray-200);">'
        + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">FECHA</th>'
        + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">CLIENTE</th>'
        + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">TIPO</th>'
        + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">DEADLINE</th>'
        + '<th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:var(--gray-500);">ESTADO</th>'
        + '<th style="padding:12px;text-align:center;font-size:12px;font-weight:600;color:var(--gray-500);">ACCIONES</th>'
        + '</tr></thead>'
        + '<tbody>' + tableHtml + '</tbody>'
        + '</table></div>';

    if (tbody)   tbody.innerHTML   = tableHtml; // modo tabla embebida
    if (content) content.innerHTML = fullTable;  // modo sección completa
}

// ==================================================
// ABRIR MODAL — pobla el select de clientes
// ==================================================
function openAddBriefingModal() {
    const selector = document.getElementById('briefing-client');
    if (selector && window.accounts) {
        selector.innerHTML = '<option value="">Seleccionar cliente...</option>'
            + window.accounts.map(acc => '<option value="' + acc.id + '">' + acc.name + '</option>').join('');
    }
    const dateInput = document.getElementById('briefing-date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    const modal = document.getElementById('briefing-modal');
    if (modal) { modal.classList.add('active'); modal.style.display = ''; }
}

// ==================================================
// GUARDAR BRIEFING — campos completos
// ==================================================
async function saveBriefing() {
    const clientId = document.getElementById('briefing-client')?.value;
    if (!clientId) { alert('❌ Seleccioná un cliente'); return; }

    const briefing = {
        id:           Date.now(),
        clientId:     clientId,
        type:         document.getElementById('briefing-type')?.value || 'strategy',
        date:         document.getElementById('briefing-date')?.value,
        deadline:     document.getElementById('briefing-deadline')?.value || '',
        // Información estratégica
        objectives:   document.getElementById('briefing-objectives')?.value || '',
        audience:     document.getElementById('briefing-audience')?.value || '',
        platforms:    document.getElementById('briefing-platforms')?.value || '',
        products:     document.getElementById('briefing-products')?.value || '',
        competitors:  document.getElementById('briefing-competitors')?.value || '',
        tone:         document.getElementById('briefing-tone')?.value || '',
        references:   document.getElementById('briefing-references')?.value || '',
        restrictions: document.getElementById('briefing-restrictions')?.value || '',
        budget:       document.getElementById('briefing-budget')?.value || '',
        notes:        document.getElementById('briefing-notes')?.value || '',
        status:       'pending',
        createdAt:    new Date().toISOString()
    };

    briefings.push(briefing);
    await storage.set('bondi-briefings', briefings);

    loadBriefings();
    closeModal('briefing-modal');
    const form = document.getElementById('briefing-modal')?.querySelector('form');
    if (form) form.reset();
    if (typeof showSuccess === 'function') showSuccess('Briefing guardado correctamente');
    else alert('✅ Briefing guardado');
}

// ==================================================
// VER BRIEFING DETALLADO — modal dedicado en lugar de alert
// ==================================================
function viewBriefing(id) {
    const b = briefings.find(b => b.id === id);
    if (!b) return;
    const client = (window.accounts || []).find(a => a.id === b.clientId);
    const typeLabels = { strategy: '🎯 Estrategia', campaign: '📣 Campaña', brand: '🎨 Marca', launch: '🚀 Lanzamiento', other: '📋 Otro' };

    function row(label, value) {
        if (!value) return '';
        return '<div style="margin-bottom:16px;">'
            + '<div style="font-size:12px;font-weight:600;color:var(--gray-500);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">' + label + '</div>'
            + '<div style="font-size:14px;color:var(--gray-700);white-space:pre-wrap;background:var(--gray-50);padding:10px 14px;border-radius:8px;border-left:3px solid #667eea;">' + value + '</div>'
            + '</div>';
    }

    let modal = document.getElementById('briefing-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'briefing-detail-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = '<div class="modal-content" style="max-width:680px;max-height:85vh;overflow-y:auto;">'
        + '<div class="modal-header">'
        + '<h3 class="modal-title">📝 Briefing — ' + (client ? client.name : 'Cliente') + '</h3>'
        + '<button class="modal-close" onclick="closeModal(\'briefing-detail-modal\')">×</button>'
        + '</div>'
        + '<div style="padding:20px 24px;">'
        + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">'
        + '<div style="background:var(--gray-50);padding:12px;border-radius:8px;text-align:center;">'
        + '<div style="font-size:11px;color:var(--gray-400);">TIPO</div>'
        + '<div style="font-weight:600;font-size:13px;margin-top:4px;">' + (typeLabels[b.type] || b.type) + '</div>'
        + '</div>'
        + '<div style="background:var(--gray-50);padding:12px;border-radius:8px;text-align:center;">'
        + '<div style="font-size:11px;color:var(--gray-400);">FECHA</div>'
        + '<div style="font-weight:600;font-size:13px;margin-top:4px;">' + (b.date || '—') + '</div>'
        + '</div>'
        + '<div style="background:var(--gray-50);padding:12px;border-radius:8px;text-align:center;">'
        + '<div style="font-size:11px;color:var(--gray-400);">DEADLINE</div>'
        + '<div style="font-weight:600;font-size:13px;margin-top:4px;' + (b.deadline ? 'color:#ef4444;' : '') + '">' + (b.deadline || '—') + '</div>'
        + '</div>'
        + '</div>'
        + row('🎯 Objetivos', b.objectives)
        + row('👥 Público objetivo', b.audience)
        + row('📱 Plataformas', b.platforms)
        + row('🛍️ Productos / Servicios', b.products)
        + row('🏢 Competencia', b.competitors)
        + row('🎨 Tono de comunicación', b.tone)
        + row('✨ Referencias / Inspiración', b.references)
        + row('⚠️ Restricciones', b.restrictions)
        + row('💰 Presupuesto estimado', b.budget)
        + row('📌 Notas adicionales', b.notes)
        + '</div>'
        + '<div style="padding:16px 24px;border-top:1px solid var(--gray-200);display:flex;gap:8px;justify-content:flex-end;">'
        + '<button class="btn-primary" onclick="updateBriefingStatus(' + id + ')">🔄 Cambiar estado</button>'
        + '<button class="btn-secondary" onclick="closeModal(\'briefing-detail-modal\')">Cerrar</button>'
        + '</div>'
        + '</div>';

    modal.classList.add('active');
    modal.style.display = '';
}

// ==================================================
// ACTUALIZAR ESTADO
// ==================================================
window.updateBriefingStatus = async function(id) {
    const b = briefings.find(b => b.id === id);
    if (!b) return;
    const stages = ['pending','in_progress','approved','completed'];
    const labels  = ['Pendiente','En proceso','Aprobado','Completado'];
    const current = stages.indexOf(b.status || 'pending');
    const nextIdx = prompt('Estado actual: ' + (labels[current] || 'Pendiente') + '\n\nSeleccioná el nuevo estado:\n1. Pendiente\n2. En proceso\n3. Aprobado\n4. Completado\n\nIngresá el número (1-4):');
    if (!nextIdx) return;
    const idx = parseInt(nextIdx) - 1;
    if (idx < 0 || idx >= stages.length) { alert('Número inválido'); return; }
    b.status = stages[idx];
    await storage.set('bondi-briefings', briefings);
    loadBriefings();
    if (typeof showSuccess === 'function') showSuccess('Estado actualizado a: ' + labels[idx]);
};

// ==================================================
// ELIMINAR BRIEFING
// ==================================================
window.deleteBriefing = async function(id) {
    if (!confirm('¿Eliminar este briefing?')) return;
    briefings = briefings.filter(b => b.id !== id);
    await storage.set('bondi-briefings', briefings);
    loadBriefings();
    if (typeof showSuccess === 'function') showSuccess('Briefing eliminado');
};

window.openAddBriefingModal = openAddBriefingModal;
window.saveBriefing         = saveBriefing;
window.loadBriefings        = loadBriefings;
window.viewBriefing         = viewBriefing;