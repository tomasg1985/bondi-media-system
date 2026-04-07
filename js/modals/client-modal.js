// ==================================================
// MODAL: AGREGAR/EDITAR CONTENIDO - VERSIÓN LIMPIA
// Una sola definición de cada función. Sin duplicados.
// Re-render directo + toast en lugar de alert.
// ==================================================

console.log('📦 Cargando content-modal.js...');

let currentEditId = null;

// ==================================================
// HELPER: RE-RENDER INMEDIATO DEL CALENDARIO
// ==================================================
if (typeof refreshCalendarViews === 'undefined') {
    window.refreshCalendarViews = function () {
        if (typeof renderCalendarItems === 'function') {
            renderCalendarItems('calendar-content');
        }
        if (typeof renderContentList === 'function') {
            renderContentList();
        }
        if (typeof renderMonthTabs === 'function') renderMonthTabs();
        if (typeof updateMonthCounts === 'function') updateMonthCounts();
    };
}

// ==================================================
// TOGGLE PRESUPUESTO ADS
// ==================================================
window.toggleAdsBudget = function(value) {
    const container = document.getElementById('ads-budget-container');
    if (container) container.style.display = value === 'true' ? 'block' : 'none';
};

// ==================================================
// TOGGLE CAMPOS POR TIPO
// ==================================================
window.toggleContentFields = function(type) {
    ['reel', 'carousel', 'stories'].forEach(function(s) {
        const el = document.getElementById('fields-' + s);
        if (el) el.style.display = s === type ? 'block' : 'none';
    });
};

// ==================================================
// ABRIR MODAL AGREGAR
// ==================================================
window.openAddContentModal = function() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('new-date');
    if (dateInput) dateInput.value = today;

    // Reset tipo y mostrar campos correctos
    const typeInput = document.getElementById('new-type');
    if (typeInput) {
        typeInput.value = 'reel';
        window.toggleContentFields('reel');
    }

    // Actualizar el indicador de cliente en el header del modal
    const acct = (window.accounts || []).find(function(a) { return a.id === (window.currentAccount || 'bondi-media'); });
    const isMain = !acct || acct.id === 'bondi-media';
    const indicator = document.getElementById('add-modal-client-indicator');
    if (indicator) {
        if (isMain) {
            indicator.style.display = 'none';
        } else {
            indicator.style.display = 'flex';
            const nm = indicator.querySelector('.amc-name');
            if (nm) nm.textContent = acct.name;
            const clr = acct.primaryColor || '#F97316';
            indicator.style.background = clr + '12';
            indicator.style.borderColor = clr + '55';
            const dot = indicator.querySelector('.amc-dot');
            if (dot) dot.style.background = clr;
        }
    }

    const modal = document.getElementById('add-content-modal');
    if (modal) modal.classList.add('active');
};

// ==================================================
// GUARDAR NUEVO CONTENIDO — única definición
// ==================================================
window.saveNewContent = async function() {
    const titleEl = document.getElementById('new-title');
    const dateEl  = document.getElementById('new-date');
    if (!titleEl?.value || !dateEl?.value) {
        if (typeof showError === 'function') showError('Título y fecha son obligatorios');
        else alert('Título y fecha son obligatorios');
        return;
    }

    const tipo = document.getElementById('new-type').value;

    // Campos de producción según tipo
    let produccion = {};
    if (tipo === 'reel') {
        produccion = {
            escenas:  document.getElementById('new-reel-escenas')?.value  || '',
            copy:     document.getElementById('new-reel-copy')?.value     || '',
            specs:    document.getElementById('new-reel-specs')?.value    || '',
            escaleta: document.getElementById('new-reel-escaleta')?.value || '',
            guion:    document.getElementById('new-reel-guion')?.value    || '',
            planos:   document.getElementById('new-reel-planos')?.value   || '',
            hashtags: document.getElementById('new-reel-hashtags')?.value || '',
            idea:     document.getElementById('new-reel-idea')?.value     || ''
        };
    } else if (tipo === 'carousel') {
        produccion = {
            copy:     document.getElementById('new-carousel-copy')?.value     || '',
            slides:   document.getElementById('new-carousel-slides')?.value   || '',
            hashtags: document.getElementById('new-carousel-hashtags')?.value || '',
            idea:     document.getElementById('new-carousel-idea')?.value     || ''
        };
    } else if (tipo === 'stories') {
        produccion = {
            texto:    document.getElementById('new-stories-texto')?.value    || '',
            stickers: document.getElementById('new-stories-stickers')?.value || ''
        };
    }

    const newContent = {
        id:         Date.now(),
        date:       document.getElementById('new-date').value,
        time:       document.getElementById('new-time').value,
        type:       tipo,
        title:      document.getElementById('new-title').value,
        objective:  document.getElementById('new-objective').value,
        notes:      document.getElementById('new-notes').value,
        status:     document.getElementById('new-status').value,
        hasAds:     document.getElementById('new-has-ads').value === 'true',
        adBudget:   parseInt(document.getElementById('new-ads-budget').value) || 0,
        produccion: produccion,
        details:    {}
    };

    if (!appData) appData = {};
    if (!appData.calendar) appData.calendar = [];
    appData.calendar.push(newContent);
    appData.calendar.sort((a, b) => new Date(a.date) - new Date(b.date));

    await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);

    closeModal('add-content-modal');
    refreshCalendarViews();

    if (typeof showSuccess === 'function') showSuccess('Publicación creada correctamente');
    else if (typeof addNotification === 'function') addNotification('Contenido creado', newContent.title);
};

// ==================================================
// ABRIR MODAL EDITAR
// ==================================================
window.openEditContentModal = function(contentId) {
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content) { console.error('Contenido no encontrado:', contentId); return; }

    currentEditId = contentId;

    // Campos básicos
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('edit-title',     content.title);
    set('edit-date',      content.date);
    set('edit-time',      content.time);
    set('edit-status',    content.status);
    set('edit-objective', content.objective);
    set('edit-notes',     content.notes);

    const typeEl = document.getElementById('edit-type');
    if (typeEl) typeEl.value = content.type || 'reel';

    // Campos de producción (nuevo sistema)
    const p = content.produccion || content.details || {};
    if (content.type === 'reel') {
        set('edit-reel-escenas',  p.escenas  || p.scenes || '');
        set('edit-reel-copy',     p.copy     || '');
        set('edit-reel-specs',    p.specs    || '');
        set('edit-reel-escaleta', p.escaleta || p.script || '');
        set('edit-reel-guion',    p.guion    || p.literaryScript || '');
        set('edit-reel-planos',   p.planos   || p.cameraShots || '');
        set('edit-reel-hashtags', p.hashtags || '');
        set('edit-reel-idea',     p.idea     || p.creative || '');
    } else if (content.type === 'carousel') {
        set('edit-carousel-copy',     p.copy     || '');
        set('edit-carousel-slides',   p.slides   || p.designText || '');
        set('edit-carousel-hashtags', p.hashtags || '');
        set('edit-carousel-idea',     p.idea     || p.creative || '');
    } else if (content.type === 'stories') {
        set('edit-stories-texto',    p.texto    || p.designText || '');
        set('edit-stories-stickers', p.stickers || '');
    }

    const modal = document.getElementById('edit-content-modal');
    if (modal) modal.classList.add('active');
};

// ==================================================
// GUARDAR EDICIÓN — única definición
// ==================================================
window.saveContentEdit = async function() {
    if (!currentEditId) { console.error('Sin currentEditId'); return; }

    const content = appData.calendar.find(c => c.id === currentEditId);
    if (!content) { console.error('Contenido no encontrado'); return; }

    const get = id => document.getElementById(id)?.value || '';

    // Campos básicos
    content.title     = get('edit-title')     || content.title;
    content.date      = get('edit-date')      || content.date;
    content.time      = get('edit-time')      || content.time;
    content.status    = get('edit-status')    || content.status;
    content.objective = get('edit-objective') || content.objective;
    content.notes     = get('edit-notes');

    const typeEl = document.getElementById('edit-type');
    if (typeEl) content.type = typeEl.value;

    // Campos de producción
    if (!content.produccion) content.produccion = {};
    const p = content.produccion;

    if (content.type === 'reel') {
        p.escenas  = get('edit-reel-escenas');
        p.copy     = get('edit-reel-copy');
        p.specs    = get('edit-reel-specs');
        p.escaleta = get('edit-reel-escaleta');
        p.guion    = get('edit-reel-guion');
        p.planos   = get('edit-reel-planos');
        p.hashtags = get('edit-reel-hashtags');
        p.idea     = get('edit-reel-idea');
    } else if (content.type === 'carousel') {
        p.copy     = get('edit-carousel-copy');
        p.slides   = get('edit-carousel-slides');
        p.hashtags = get('edit-carousel-hashtags');
        p.idea     = get('edit-carousel-idea');
    } else if (content.type === 'stories') {
        p.texto    = get('edit-stories-texto');
        p.stickers = get('edit-stories-stickers');
    }

    await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);

    closeModal('edit-content-modal');
    refreshCalendarViews();

    if (typeof showSuccess === 'function') showSuccess('Publicación actualizada correctamente');
    else if (typeof addNotification === 'function') addNotification('Contenido actualizado', content.title);
};

// ==================================================
// ELIMINAR CONTENIDO
// ==================================================
window.deleteContent = async function(contentId) {
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content) return;

    if (!confirm('¿Eliminar "' + content.title + '"?\nEsta acción no se puede deshacer.')) return;

    appData.calendar = appData.calendar.filter(c => c.id !== contentId);
    await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);

    refreshCalendarViews();

    if (typeof showSuccess === 'function') showSuccess('"' + content.title + '" eliminado');
    else if (typeof addNotification === 'function') addNotification('Eliminado', content.title);
};

// ==================================================
// DESCARGAR GUION
// ==================================================
window.downloadGuion = function(contentId) {
    const cal  = (window.appData && window.appData.calendar) || [];
    const item = cal.find(function(c) { return c.id === contentId; });
    if (!item) { alert('Contenido no encontrado'); return; }

    const p    = item.produccion || item.details || {};
    const tipo = item.type || 'reel';
    const lines = [];

    lines.push('BONDI MEDIA — GUION DE CONTENIDO');
    lines.push('='.repeat(50));
    lines.push('');
    lines.push('TITULO:   ' + (item.title    || ''));
    lines.push('FECHA:    ' + (item.date     || '') + ' ' + (item.time || ''));
    lines.push('TIPO:     ' + (tipo === 'reel' ? 'Reel' : tipo === 'carousel' ? 'Carrusel' : 'Stories'));
    lines.push('ESTADO:   ' + (item.status   || ''));
    lines.push('OBJETIVO: ' + (item.objective|| ''));
    lines.push('');

    if (tipo === 'reel') {
        lines.push('-'.repeat(50));
        lines.push('CANTIDAD DE ESCENAS');
        lines.push(p.escenas || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('COPY PARA LA PUBLICACION');
        lines.push(p.copy || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('ESPECIFICACIONES TECNICAS');
        lines.push(p.specs || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('ESCALETA');
        lines.push(p.escaleta || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('GUION LITERARIO');
        lines.push(p.guion || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('PLANOS DE CAMARA');
        lines.push(p.planos || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('HASHTAGS');
        lines.push(p.hashtags || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('IDEA CREATIVA');
        lines.push(p.idea || '-');
    } else if (tipo === 'carousel') {
        lines.push('-'.repeat(50));
        lines.push('COPY PARA LA PUBLICACION');
        lines.push(p.copy || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('TEXTO POR SLIDE');
        lines.push(p.slides || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('HASHTAGS');
        lines.push(p.hashtags || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('IDEA CREATIVA');
        lines.push(p.idea || '-');
    } else if (tipo === 'stories') {
        lines.push('-'.repeat(50));
        lines.push('TEXTO POR HISTORIA');
        lines.push(p.texto || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('STICKERS POR HISTORIA');
        lines.push(p.stickers || '-');
    }

    if (item.notes) {
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('NOTAS ADICIONALES');
        lines.push(item.notes);
    }

    lines.push('');
    lines.push('='.repeat(50));
    lines.push('Generado por Bondi Media Sistema de Gestion');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'guion-' + (item.title || 'contenido').replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// ==================================================
// TOGGLE ADS BUDGET (alias para el edit modal)
// ==================================================
window.toggleEditAdsBudget = function(value) {
    const container = document.getElementById('edit-ads-budget-container');
    if (container) container.style.display = value === 'true' ? 'block' : 'none';
};

console.log('✅ content-modal.js cargado correctamente');