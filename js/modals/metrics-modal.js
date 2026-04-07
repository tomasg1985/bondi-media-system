// ==================================================
// MODAL: MÉTRICAS
// ==================================================

let tempScreenshots = { 0: null, 1: null, 3: null };
let tempCarouselScreenshot = null;
let tempStoriesScreenshot = null;

function openMetricsModal(contentId) {
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content) return;

    appData.currentMetricsId = contentId;

    const header = document.getElementById('metrics-header');
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

    // Mostrar/ocultar secciones según tipo
    const videoSection = document.getElementById('video-metrics-section');
    if (videoSection) videoSection.style.display = content.type === 'reel' ? 'block' : 'none';

    // Carrusel: mostrar secciones de slides por plataforma
    const igCarousel = document.getElementById('ig-carousel-section');
    const fbCarousel = document.getElementById('fb-carousel-section');
    const igStories  = document.getElementById('ig-stories-section');
    const fbStories  = document.getElementById('fb-stories-section');
    if (igCarousel) igCarousel.style.display = content.type === 'carousel' ? 'block' : 'none';
    if (fbCarousel) fbCarousel.style.display = content.type === 'carousel' ? 'block' : 'none';
    if (igStories)  igStories.style.display  = content.type === 'stories'  ? 'block' : 'none';
    if (fbStories)  fbStories.style.display  = content.type === 'stories'  ? 'block' : 'none';

    // Resetear capturas
    tempScreenshots = { 0: null, 1: null, 3: null };
    tempCarouselScreenshot = null;
    tempStoriesScreenshot = null;

    // Cargar métricas existentes
    if (content.metrics) {
        const ig = content.metrics.instagram || {};
        const fb = content.metrics.facebook || {};
        const tt = content.metrics.tiktok || {};

        document.getElementById('ig-views').value = ig.views || '';
        document.getElementById('ig-reach').value = ig.reach || '';
        document.getElementById('ig-likes').value = ig.likes || '';
        document.getElementById('ig-comments').value = ig.comments || '';
        document.getElementById('ig-saves').value = ig.saves || '';
        document.getElementById('ig-shares').value = ig.shares || '';
        document.getElementById('ig-dms').value = ig.dms || '';

        document.getElementById('fb-views').value = fb.views || '';
        document.getElementById('fb-reach').value = fb.reach || '';
        document.getElementById('fb-reactions').value = fb.reactions || '';
        document.getElementById('fb-comments').value = fb.comments || '';
        document.getElementById('fb-shares').value = fb.shares || '';
        document.getElementById('fb-clicks').value = fb.clicks || '';
        document.getElementById('fb-messages').value = fb.messages || '';

        document.getElementById('tt-views').value = tt.views || '';
        document.getElementById('tt-likes').value = tt.likes || '';
        document.getElementById('tt-comments').value = tt.comments || '';
        document.getElementById('tt-saves').value = tt.saves || '';
        document.getElementById('tt-shares').value = tt.shares || '';

        // Interacciones generales
        const igI = document.getElementById('ig-interactions');
        const fbI = document.getElementById('fb-interactions');
        if (igI) igI.value = ig.interactions || '';
        if (fbI) fbI.value = fb.interactions || '';

        // Carrusel — slides dinámicos
        if (content.type === 'carousel') {
            const igSlides = (ig.slides || []).filter(v => v > 0);
            const fbSlides = (fb.slides || []).filter(v => v > 0);
            buildSlides('ig', igSlides.length || 1, igSlides);
            buildSlides('fb', fbSlides.length || 1, fbSlides);
        }

        // Stories — historias dinámicas
        if (content.type === 'stories') {
            const igSt = ig.stories || [];
            const fbSt = fb.stories || [];
            buildStories('ig', igSt.length || 1, igSt);
            buildStories('fb', fbSt.length || 1, fbSt);
        }

        // Cargar métricas de video
        if (content.type === 'reel' && content.metrics.videoMetrics) {
            const vm = content.metrics.videoMetrics;
            document.getElementById('video-duration').value = vm.duration || '';
            document.getElementById('video-avg-watch').value = vm.avgWatchTime || '';
            document.getElementById('video-retention').value = vm.retentionPercent || '';
            document.getElementById('video-first3s').value = vm.first3sPercent || '';
            document.getElementById('video-first3s-analysis').value = vm.first3sAnalysis || '';
            
            if (vm.retentionPercent) {
                const ratingData = getRatingFromRetention(vm.retentionPercent);
                document.getElementById('video-rating').value = `${ratingData.emoji} ${ratingData.label} (${vm.retentionPercent}%)`;
                document.getElementById('video-rating').style.color = ratingData.color;
            }
        }
    } else {
        // Limpiar campos estáticos
        document.querySelectorAll('#metrics-modal input[type="number"]').forEach(input => input.value = '');
        document.querySelectorAll('#metrics-modal textarea').forEach(input => input.value = '');
        // Limpiar contenedores dinámicos — arrancar con 1 slide/historia
        if (content.type === 'carousel') {
            buildSlides('ig', 1, []);
            buildSlides('fb', 1, []);
        }
        if (content.type === 'stories') {
            buildStories('ig', 1, []);
            buildStories('fb', 1, []);
        }
    }

    document.getElementById('metrics-modal').classList.add('active');
}

function calculateRetention() {
    const duration = parseFloat(document.getElementById('video-duration').value) || 0;
    const avgWatch = parseFloat(document.getElementById('video-avg-watch').value) || 0;
    
    if (duration > 0 && avgWatch > 0) {
        const retention = Math.round((avgWatch / duration) * 100);
        document.getElementById('video-retention').value = retention;
        
        const ratingData = getRatingFromRetention(retention);
        document.getElementById('video-rating').value = `${ratingData.emoji} ${ratingData.label} (${retention}%)`;
        document.getElementById('video-rating').style.color = ratingData.color;
    }
}

async function saveMetrics() {
    const contentId = appData.currentMetricsId;
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content) return;

    // Helper para leer número
    const num = id => parseInt(document.getElementById(id)?.value) || 0;

    // Slides (carousel) — leer cantidad dinámica
    const igSlidesSave = readSlides('ig');
    const fbSlidesSave = readSlides('fb');

    // Stories — leer cantidad dinámica
    const igStoriesSave = readStories('ig');
    const fbStoriesSave = readStories('fb');

    content.metrics = {
        instagram: {
            views: num('ig-views'),
            reach: num('ig-reach'),
            likes: num('ig-likes'),
            comments: num('ig-comments'),
            saves: num('ig-saves'),
            shares: num('ig-shares'),
            dms: num('ig-dms'),
            interactions: num('ig-interactions'),
            slides: content.type === 'carousel' ? igSlidesSave : undefined,
            stories: content.type === 'stories'  ? igStoriesSave : undefined
        },
        facebook: {
            views: num('fb-views'),
            reach: num('fb-reach'),
            reactions: num('fb-reactions'),
            comments: num('fb-comments'),
            shares: num('fb-shares'),
            clicks: num('fb-clicks'),
            messages: num('fb-messages'),
            interactions: num('fb-interactions'),
            slides: content.type === 'carousel' ? fbSlidesSave : undefined,
            stories: content.type === 'stories'  ? fbStoriesSave : undefined
        },
        tiktok: {
            views: num('tt-views'),
            likes: num('tt-likes'),
            comments: num('tt-comments'),
            saves: num('tt-saves'),
            shares: num('tt-shares')
        },
        updatedAt: new Date().toISOString()
    };

    // Guardar métricas de video para Reels
    if (content.type === 'reel') {
        const duration = parseInt(document.getElementById('video-duration').value) || 0;
        const avgWatch = parseInt(document.getElementById('video-avg-watch').value) || 0;
        const retention = parseInt(document.getElementById('video-retention').value) || 0;
        const first3s = parseInt(document.getElementById('video-first3s').value) || 0;
        const analysis = document.getElementById('video-first3s-analysis').value || '';

        if (duration > 0) {
            const ratingData = getRatingFromRetention(retention);
            
            content.metrics.videoMetrics = {
                duration: duration,
                avgWatchTime: avgWatch,
                retentionPercent: retention,
                first3sPercent: first3s,
                rating: ratingData.rating,
                first3sAnalysis: analysis
            };
        }
    }

    await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);

    // Cerrar modal primero
    closeModal('metrics-modal');

    // Re-render inmediato del calendario sin necesidad de F5
    if (typeof renderCalendarItems === 'function') {
        renderCalendarItems('calendar-content');
        renderContentList();
    }
    if (typeof updateMonthCounts === 'function') updateMonthCounts();
    if (typeof updateAllModules === 'function') await updateAllModules();

    // Confirmación visual con toast (sin alert bloqueante)
    if (typeof showSuccess === 'function') {
        showSuccess('Métricas de "' + content.title + '" guardadas correctamente');
    } else if (typeof addNotification === 'function') {
        addNotification('Métricas guardadas', 'Métricas de "' + content.title + '" actualizadas');
    }
}

function viewMetrics(contentId) {
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content || !content.metrics) return;

    const ig = content.metrics.instagram || {};
    const fb = content.metrics.facebook || {};
    const tt = content.metrics.tiktok || {};
    const vm = content.metrics.videoMetrics || {};

    // Construir filas de la tabla
    function row(label, val, highlight) {
        if (!val && val !== 0) return '';
        const color = highlight ? 'color:#8b5cf6;font-weight:600;' : '';
        return '<tr><td style="padding:5px 10px;color:#6b7280;font-size:13px;">' + label + '</td>'
             + '<td style="padding:5px 10px;text-align:right;font-size:13px;' + color + '">' + (val || 0).toLocaleString() + '</td></tr>';
    }

    function section(icon, title, rows) {
        const filteredRows = rows.filter(Boolean).join('');
        if (!filteredRows) return '';
        return '<div style="margin-bottom:16px;">'
            + '<div style="font-size:12px;font-weight:600;color:#374151;background:#f3f4f6;padding:6px 10px;border-radius:6px;margin-bottom:4px;">' + icon + ' ' + title + '</div>'
            + '<table style="width:100%;border-collapse:collapse;">' + filteredRows + '</table>'
            + '</div>';
    }

    // Slides de carrusel
    let igSlidesHtml = '';
    if (content.type === 'carousel' && ig.slides && ig.slides.some(v => v > 0)) {
        igSlidesHtml = '<div style="margin-bottom:16px;">'
            + '<div style="font-size:12px;font-weight:600;color:#374151;background:#f3f4f6;padding:6px 10px;border-radius:6px;margin-bottom:4px;">📸 IG — Vistas por Slide</div>'
            + '<table style="width:100%;border-collapse:collapse;">'
            + ig.slides.map((v, i) => v > 0 ? row('Slide ' + (i+1), v) : '').join('')
            + '</table></div>';
    }
    let fbSlidesHtml = '';
    if (content.type === 'carousel' && fb.slides && fb.slides.some(v => v > 0)) {
        fbSlidesHtml = '<div style="margin-bottom:16px;">'
            + '<div style="font-size:12px;font-weight:600;color:#374151;background:#f3f4f6;padding:6px 10px;border-radius:6px;margin-bottom:4px;">📘 FB — Vistas por Slide</div>'
            + '<table style="width:100%;border-collapse:collapse;">'
            + fb.slides.map((v, i) => v > 0 ? row('Slide ' + (i+1), v) : '').join('')
            + '</table></div>';
    }

    // Stories por historia
    function storiesRows(stories, platform) {
        if (!stories || !stories.length) return '';
        return stories.map(function(s, i) {
            if (!s || (!s.views && !s.interactions && !s.forward && !s.next && !s.exits)) return '';
            return '<div style="background:#f9fafb;border-radius:6px;padding:8px 10px;margin-bottom:6px;">'
                + '<div style="font-size:11px;font-weight:600;color:#6b7280;margin-bottom:4px;">' + platform + ' — Historia ' + (i+1) + '</div>'
                + '<table style="width:100%;border-collapse:collapse;">'
                + row('Reproducciones', s.views)
                + row('Interacciones', s.interactions)
                + row('Avanzar →', s.forward)
                + row('Siguiente historia', s.next)
                + row('Abandonos', s.exits, true)
                + '</table></div>';
        }).join('');
    }

    const igStoriesHtml = content.type === 'stories' ? storiesRows(ig.stories, '📸 Instagram') : '';
    const fbStoriesHtml = content.type === 'stories' ? storiesRows(fb.stories, '📘 Facebook') : '';

    const html = '<div style="max-height:65vh;overflow-y:auto;padding-right:4px;">'

        + section('📸', 'Instagram', [
            row('Vistas',        ig.views),
            row('Alcance',       ig.reach),
            row('Likes',         ig.likes),
            row('Comentarios',   ig.comments),
            row('Guardados',     ig.saves),
            row('Compartidos',   ig.shares),
            row('DMs',           ig.dms),
            row('Interacciones', ig.interactions)
        ])

        + igSlidesHtml

        + (igStoriesHtml ? '<div style="margin-bottom:16px;"><div style="font-size:12px;font-weight:600;color:#374151;background:#f3f4f6;padding:6px 10px;border-radius:6px;margin-bottom:6px;">📸 Instagram — Por Historia</div>' + igStoriesHtml + '</div>' : '')

        + section('📘', 'Facebook', [
            row('Vistas',        fb.views),
            row('Alcance',       fb.reach),
            row('Reacciones',    fb.reactions),
            row('Comentarios',   fb.comments),
            row('Compartidos',   fb.shares),
            row('Clics',         fb.clicks),
            row('Mensajes',      fb.messages),
            row('Interacciones', fb.interactions)
        ])

        + fbSlidesHtml

        + (fbStoriesHtml ? '<div style="margin-bottom:16px;"><div style="font-size:12px;font-weight:600;color:#374151;background:#f3f4f6;padding:6px 10px;border-radius:6px;margin-bottom:6px;">📘 Facebook — Por Historia</div>' + fbStoriesHtml + '</div>' : '')

        + section('📱', 'TikTok', [
            row('Vistas',      tt.views),
            row('Likes',       tt.likes),
            row('Comentarios', tt.comments),
            row('Guardados',   tt.saves),
            row('Compartidos', tt.shares)
        ])

        + (content.type === 'reel' && vm.retentionPercent ? section('🎬', 'Video — Retención', [
            row('Duración (s)',      vm.duration),
            row('Tiempo promedio',   vm.avgWatchTime),
            row('% Retención',       vm.retentionPercent, true),
            row('% Primeros 3s',     vm.first3sPercent)
        ]) : '')

        + '</div>';

    // Mostrar en modal reutilizable o crear uno temporal
    const existingModal = document.getElementById('view-metrics-modal');
    if (existingModal) {
        existingModal.querySelector('.view-metrics-body').innerHTML = html;
        existingModal.querySelector('.view-metrics-title').textContent = content.title;
        existingModal.style.display = 'flex';
    } else {
        const overlay = document.createElement('div');
        overlay.id = 'view-metrics-modal';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9999;';
        // Build modal content via DOM to avoid quote conflicts
        const box = document.createElement('div');
        box.style.cssText = 'background:white;border-radius:16px;padding:24px;max-width:520px;width:90%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.2);';

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;';

        const titleBlock = document.createElement('div');
        const titleEl = document.createElement('div');
        titleEl.className = 'view-metrics-title';
        titleEl.style.cssText = 'font-size:16px;font-weight:600;';
        titleEl.textContent = content.title;
        const subtitleEl = document.createElement('div');
        subtitleEl.style.cssText = 'font-size:12px;color:#6b7280;margin-top:2px;';
        subtitleEl.textContent = (content.date || '') + ' · ' + (content.type === 'reel' ? 'Reel' : content.type === 'carousel' ? 'Carrusel' : 'Stories');
        titleBlock.appendChild(titleEl);
        titleBlock.appendChild(subtitleEl);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&#215;';
        closeBtn.style.cssText = 'background:none;border:none;font-size:22px;cursor:pointer;color:#6b7280;line-height:1;';
        closeBtn.addEventListener('click', function() { overlay.style.display = 'none'; });

        header.appendChild(titleBlock);
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.className = 'view-metrics-body';
        body.innerHTML = html;

        box.appendChild(header);
        box.appendChild(body);
        overlay.appendChild(box);
        overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.style.display = 'none'; });
        document.body.appendChild(overlay);
    }
}

// Exportar funciones
window.openMetricsModal = openMetricsModal;
window.calculateRetention = calculateRetention;
window.saveMetrics = saveMetrics;
window.viewMetrics = viewMetrics;

// ==================================================
// METRICS-MODAL.JS - Funciones para el modal de métricas
// ==================================================

// Inicializar eventos del modal de métricas
// El form ya tiene onsubmit='saveMetrics()' en el HTML — no se necesita addEventListener adicional.

// Función para cerrar el modal (si no existe globalmente)
if (typeof closeModal !== 'function') {
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };
}



// ==================================================
// SLIDES Y STORIES DINÁMICOS
// ==================================================

// ── Slides ──────────────────────────────────────────
function buildSlides(plat, count, values) {
    var container = document.getElementById(plat + '-slides-container');
    var countEl   = document.getElementById(plat + '-slides-count');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 1; i <= count; i++) {
        appendSlide(plat, i, values && values[i-1] ? values[i-1] : '');
    }
    _metricsUpdateSlideCount(plat);
}

function appendSlide(plat, num, val) {
    var container = document.getElementById(plat + '-slides-container');
    if (!container) return;

    var row = document.createElement('div');
    row.className = 'slide-row';
    row.dataset.slideNum = num;

    var lbl = document.createElement('span');
    lbl.className = 'slide-num';
    lbl.textContent = 'Slide ' + num;

    var inp = document.createElement('input');
    inp.type = 'number';
    inp.className = 'form-input';
    inp.id = plat + '-slide-' + num;
    inp.placeholder = 'Vistas';
    inp.style.cssText = 'flex:1;';
    if (val) inp.value = val;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dyn-remove-btn';
    btn.title = 'Eliminar slide';
    btn.innerHTML = '&times;';
    btn.addEventListener('click', function() { removeSlide(plat, row); });

    row.appendChild(lbl);
    row.appendChild(inp);
    row.appendChild(btn);
    container.appendChild(row);
}

window.addSlide = function(plat) {
    var container = document.getElementById(plat + '-slides-container');
    if (!container) return;
    var current = container.querySelectorAll('.slide-row').length;
    appendSlide(plat, current + 1, '');
    _metricsUpdateSlideCount(plat);
};

function removeSlide(plat, row) {
    row.remove();
    renumberSlides(plat);
    _metricsUpdateSlideCount(plat);
}

function renumberSlides(plat) {
    var container = document.getElementById(plat + '-slides-container');
    if (!container) return;
    var rows = container.querySelectorAll('.slide-row');
    rows.forEach(function(r, i) {
        var n = i + 1;
        r.dataset.slideNum = n;
        var lbl = r.querySelector('.slide-num');
        if (lbl) lbl.textContent = 'Slide ' + n;
        var inp = r.querySelector('input');
        if (inp) inp.id = plat + '-slide-' + n;
    });
}

function _metricsUpdateSlideCount(plat) {
    var container = document.getElementById(plat + '-slides-container');
    var countEl   = document.getElementById(plat + '-slides-count');
    if (!container || !countEl) return;
    var n = container.querySelectorAll('.slide-row').length;
    countEl.textContent = n + ' slide' + (n !== 1 ? 's' : '');
}

function readSlides(plat) {
    var container = document.getElementById(plat + '-slides-container');
    if (!container) return [];
    var result = [];
    container.querySelectorAll('.slide-row').forEach(function(r) {
        var inp = r.querySelector('input');
        result.push(parseInt(inp ? inp.value : '') || 0);
    });
    return result;
}

// ── Stories ──────────────────────────────────────────
function buildStories(plat, count, values) {
    var container = document.getElementById(plat + '-stories-container');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 1; i <= count; i++) {
        appendStory(plat, i, values && values[i-1] ? values[i-1] : {});
    }
    _metricsUpdateStoryCount(plat);
}

function appendStory(plat, num, data) {
    var container = document.getElementById(plat + '-stories-container');
    if (!container) return;
    data = data || {};

    var block = document.createElement('div');
    block.className = 'dyn-item';
    block.dataset.storyNum = num;

    // Header
    var hdr = document.createElement('div');
    hdr.className = 'dyn-item-header';

    var lbl = document.createElement('span');
    lbl.className = 'dyn-item-label';
    lbl.textContent = 'Historia ' + num;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dyn-remove-btn';
    btn.title = 'Eliminar historia';
    btn.innerHTML = '&times;';
    btn.addEventListener('click', function() { removeStory(plat, block); });

    hdr.appendChild(lbl);
    hdr.appendChild(btn);

    // Row 1: views + interactions
    var row1 = document.createElement('div');
    row1.className = 'form-row';
    row1.style.marginBottom = '6px';

    var inpViews = makeInp(plat + '-story-' + num + '-views', 'Reproducciones', data.views);
    var inpInter = makeInp(plat + '-story-' + num + '-interactions', 'Interacciones', data.interactions);
    row1.appendChild(inpViews);
    row1.appendChild(inpInter);

    // Row 2: forward + next + exits
    var row2 = document.createElement('div');
    row2.className = 'form-row';

    var inpFwd  = makeInp(plat + '-story-' + num + '-forward', 'Avanzar →', data.forward);
    var inpNext = makeInp(plat + '-story-' + num + '-next',    'Siguiente ↷', data.next);
    var inpExit = makeInp(plat + '-story-' + num + '-exits',   'Abandonos ✕', data.exits);
    row2.appendChild(inpFwd);
    row2.appendChild(inpNext);
    row2.appendChild(inpExit);

    block.appendChild(hdr);
    block.appendChild(row1);
    block.appendChild(row2);
    container.appendChild(block);
}

function makeInp(id, placeholder, val) {
    var inp = document.createElement('input');
    inp.type = 'number';
    inp.className = 'form-input';
    inp.id = id;
    inp.placeholder = placeholder;
    if (val) inp.value = val;
    return inp;
}

// addStory: maneja tanto métricas (plat='ig'/'fb') como modal de contenido (containerId completo)
window.addStory = function(platOrContainerId) {
    // Si es plataforma de métricas (ig / fb)
    if (platOrContainerId === 'ig' || platOrContainerId === 'fb') {
        var container = document.getElementById(platOrContainerId + '-stories-container');
        if (!container) return;
        var current = container.querySelectorAll('.dyn-item').length;
        appendStory(platOrContainerId, current + 1, {});
        _metricsUpdateStoryCount(platOrContainerId);
        return;
    }
    // Si es el modal de agregar contenido (containerId completo con story-row)
    var container = document.getElementById(platOrContainerId);
    if (!container) return;
    var num = container.querySelectorAll('.story-row').length + 1;
    if (typeof addStoryRow === 'function') addStoryRow(container, num);
    if (typeof updateStoryNumbers === 'function') updateStoryNumbers(container);
};

// removeStory: compatible con ambos contextos
window.removeStory = function(btnOrPlat, blockOrContainerId) {
    // Caso métricas: removeStory(plat, block)
    if (typeof btnOrPlat === 'string' && (btnOrPlat === 'ig' || btnOrPlat === 'fb')) {
        var block = blockOrContainerId;
        block.remove();
        renumberStories(btnOrPlat);
        _metricsUpdateStoryCount(btnOrPlat);
        return;
    }
    // Caso modal de contenido: removeStory(btn, containerId)
    var container = document.getElementById(blockOrContainerId);
    if (!container) return;
    var row = btnOrPlat.closest ? btnOrPlat.closest('.dynamic-row, .dyn-story-card, [data-story]') : null;
    if (!row) row = btnOrPlat.parentElement;
    var rows = container.querySelectorAll('.story-row, .dyn-story-card, [data-story]');
    if (rows.length <= 1) return;
    row.remove();
    if (typeof updateStoryNumbers === 'function') updateStoryNumbers(container);
};


function renumberStories(plat) {
    var container = document.getElementById(plat + '-stories-container');
    if (!container) return;
    var blocks = container.querySelectorAll('.dyn-item');
    blocks.forEach(function(b, i) {
        var n = i + 1;
        b.dataset.storyNum = n;
        var lbl = b.querySelector('.dyn-item-label');
        if (lbl) lbl.textContent = 'Historia ' + n;
        // Re-id inputs
        var fields = ['views','interactions','forward','next','exits'];
        var inputs = b.querySelectorAll('input');
        inputs.forEach(function(inp, j) {
            inp.id = plat + '-story-' + n + '-' + fields[j];
        });
    });
}

function _metricsUpdateStoryCount(plat) {
    var container = document.getElementById(plat + '-stories-container');
    var countEl   = document.getElementById(plat + '-stories-count');
    if (!container || !countEl) return;
    var n = container.querySelectorAll('.dyn-item').length;
    countEl.textContent = n + ' historia' + (n !== 1 ? 's' : '');
}

function readStories(plat) {
    var container = document.getElementById(plat + '-stories-container');
    if (!container) return [];
    var result = [];
    var fields = ['views','interactions','forward','next','exits'];
    container.querySelectorAll('.dyn-item').forEach(function(b, i) {
        var n = i + 1;
        var obj = {};
        fields.forEach(function(f) {
            var inp = document.getElementById(plat + '-story-' + n + '-' + f);
            obj[f] = parseInt(inp ? inp.value : '') || 0;
        });
        result.push(obj);
    });
    return result;
}

// También limpiar los contenedores al resetear el modal
var _origResetMetrics = window.resetMetricsContainers;
window.resetMetricsContainers = function() {
    ['ig','fb'].forEach(function(plat) {
        var sc = document.getElementById(plat + '-slides-container');
        var stc = document.getElementById(plat + '-stories-container');
        if (sc) sc.innerHTML = '';
        if (stc) stc.innerHTML = '';
        _metricsUpdateSlideCount(plat);
        _metricsUpdateStoryCount(plat);
    });
};

console.log('✅ metrics-modal.js cargado correctamente');