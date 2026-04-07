// ==================================================
// MODAL: DETALLES - SINCRONIZADO CON PRODUCCIÓN
// ==================================================

let currentDetailsId = null;

function openDetailsModal(contentId) {
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content) return;

    currentDetailsId = contentId;

    const header = document.getElementById('details-header');
    if (header) {
        header.innerHTML = `
            <div style="margin-bottom: 20px; padding: 16px; background: var(--gray-100); border-radius: 12px;">
                <strong style="font-size: 16px;">${content.title}</strong>
                <div style="font-size: 13px; color: var(--gray-600); margin-top: 4px;">
                    ${formatDate(content.date)} - ${content.time} • ${getTypeLabel(content.type)}
                </div>
            </div>
        `;
    }

    renderDetailsContent(content);

    const modal = document.getElementById('details-modal');
    if (modal) modal.classList.add('active');
}

function renderDetailsContent(content) {
    const detailsContainer = document.getElementById('details-content');
    if (!detailsContainer) return;

    // Sincronizar con la estructura de 'produccion' usada en el modal de edición
    // Fallback triple: produccion -> details -> root field
    const p = content.produccion || content.details || {};
    const type = content.type || 'reel';
    const ig = p.plataformas?.instagram || {};

    if (type === 'carousel') {
        const slides = p.slideCount || p.slides || content.slides || 7;
        const copy = p.copy || ig.copy || content.copy || '';
        const idea = p.idea || p.designText || content.notes || '';
        const hashtags = p.hashtags || ig.hashtags || content.hashtags || '';

        detailsContainer.innerHTML = `
            <div class="form-group">
                <label class="form-label">Cantidad de Slides</label>
                <input type="number" class="form-input" id="detail-slides" value="${slides}">
            </div>
            <div class="form-group">
                <label class="form-label">Copy (Instagram)</label>
                <textarea class="form-input" id="detail-copy" rows="4">${copy}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Diseño / Idea Creativa</label>
                <textarea class="form-input" id="detail-design-text" rows="4">${idea}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Hashtags</label>
                <input type="text" class="form-input" id="detail-hashtags" value="${hashtags}">
            </div>
        `;
    } else if (type === 'reel') {
        const escenas = p.escenas || p.scenes || content.scenes || 8;
        const copy = p.copy || ig.copy || content.copy || '';
        const guion = p.guion || p.script || p.escaleta || content.script || '';
        const specs = p.specs || content.specs || '';
        const hashtags = p.hashtags || ig.hashtags || content.hashtags || '';
        const idea = p.idea || p.creative || content.idea || content.notes || '';

        detailsContainer.innerHTML = `
            <div class="form-group">
                <label class="form-label">Escenas</label>
                <input type="number" class="form-input" id="detail-scenes" value="${escenas}">
            </div>
            <div class="form-group">
                <label class="form-label">Copy (Instagram)</label>
                <textarea class="form-input" id="detail-copy" rows="4">${copy}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Guion / Escaleta</label>
                <textarea class="form-input" id="detail-script" rows="6">${guion}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Especificaciones Técnicas</label>
                <textarea class="form-input" id="detail-specs" rows="3">${specs}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Hashtags</label>
                <input type="text" class="form-input" id="detail-hashtags" value="${hashtags}">
            </div>
            <div class="form-group">
                <label class="form-label">Idea Creativa</label>
                <textarea class="form-input" id="detail-creative" rows="3">${idea}</textarea>
            </div>
        `;
    } else if (type === 'stories') {
        const slides = p.storyCount || p.slides || content.slides || 5;
        const copy = p.copy || ig.copy || content.copy || '';
        const stickers = p.stickers || ig.link || content.stickers || '';

        detailsContainer.innerHTML = `
            <div class="form-group">
                <label class="form-label">Cantidad de Historias</label>
                <input type="number" class="form-input" id="detail-slides" value="${slides}">
            </div>
            <div class="form-group">
                <label class="form-label">Texto / Copy Stories</label>
                <textarea class="form-input" id="detail-copy" rows="4">${copy}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Stickers / Link</label>
                <textarea class="form-input" id="detail-stickers" rows="4">${stickers}</textarea>
            </div>
        `;
    }
}

async function saveDetails() {
    const content = appData.calendar.find(c => c.id === currentDetailsId);
    if (!content) return;

    if (!content.produccion) content.produccion = {};
    const p = content.produccion;

    const gv = id => document.getElementById(id)?.value || '';

    if (content.type === 'carousel') {
        p.slideCount = parseInt(gv('detail-slides')) || 0;
        p.copy = gv('detail-copy');
        p.idea = gv('detail-design-text');
        p.hashtags = gv('detail-hashtags');
        // Sincronizar con plataforma específica por defecto
        if (!p.plataformas) p.plataformas = { instagram: {}, facebook: {}, tiktok: {} };
        p.plataformas.instagram.copy = p.copy;
        p.plataformas.instagram.hashtags = p.hashtags;
    } else if (content.type === 'reel') {
        p.escenas = parseInt(gv('detail-scenes')) || 0;
        p.copy = gv('detail-copy');
        p.guion = gv('detail-script');
        p.specs = gv('detail-specs');
        p.hashtags = gv('detail-hashtags');
        p.idea = gv('detail-creative');
        if (!p.plataformas) p.plataformas = { instagram: {}, facebook: {}, tiktok: {} };
        p.plataformas.instagram.copy = p.copy;
        p.plataformas.instagram.hashtags = p.hashtags;
    } else if (content.type === 'stories') {
        p.storyCount = parseInt(gv('detail-slides')) || 0;
        p.copy = gv('detail-copy');
        p.stickers = gv('detail-stickers');
        if (!p.plataformas) p.plataformas = { instagram: {}, facebook: {} };
        p.plataformas.instagram.copy = p.copy;
    }

    await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);
    if (typeof refreshCalendarViews === 'function') refreshCalendarViews();
    closeModal('details-modal');

    if (typeof showSuccess === 'function') showSuccess('Detalles guardados y sincronizados');
}

// Función para refrescar el modal de detalles "en vivo" si está abierto
window.refreshOpenDetails = function(contentId) {
    if (currentDetailsId === contentId) {
        const content = appData.calendar.find(c => c.id === contentId);
        if (content) renderDetailsContent(content);
    }
};

// Exportar funciones
window.openDetailsModal = openDetailsModal;
window.saveDetails = saveDetails;