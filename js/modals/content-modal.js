// ==================================================
// MODAL: AGREGAR/EDITAR CONTENIDO - VERSIÓN LIMPIA
// Una sola definición de cada función. Sin duplicados.
// Re-render directo + toast en lugar de alert.
// ==================================================

console.log('📦 Cargando content-modal.js...');

let currentEditId = null;

// ==================================================
// PAPELERA DE RECICLAJE PARA CONTENIDO ELIMINADO
// ==================================================
window.deletedContentTrash = [];
window.trashTimeoutId = null;

// ==================================================
// HELPER: RE-RENDER INMEDIATO DEL CALENDARIO
// ==================================================

// ==================================================
// HELPER: RE-RENDER INMEDIATO DEL CALENDARIO
// ==================================================
function refreshCalendarViews() {
    // Renderizar el calendario en dashboard-content SIN cambiar de sección
    if (typeof renderCalendarItems === 'function') {
        renderCalendarItems('calendar-content');
    }
    // Renderizar contenido usando el helper central para preservar filtros y evitar doble lógica
    if (typeof renderContentList === 'function') {
        renderContentList();
    }
    // Actualizar UI sin cambiar de sección
    if (typeof renderMonthTabs === 'function') renderMonthTabs();
    if (typeof updateMonthCounts === 'function') updateMonthCounts();
    if (typeof window.populateContentMonthFilter === 'function') window.populateContentMonthFilter();
    // Actualizar dashboard también
    if (typeof updateDashboardStats === 'function') updateDashboardStats();
    // Actualizar próximas publicaciones
    if (typeof refreshUpcomingContent === 'function') refreshUpcomingContent();
}

// ==================================================
// TOGGLE PRESUPUESTO ADS
// ==================================================
window.toggleAdsBudget = function (value) {
    const container = document.getElementById('ads-budget-container');
    if (container) container.style.display = value === 'true' ? 'block' : 'none';
};

// ==================================================
// TOGGLE CAMPOS POR TIPO
// ==================================================
window.toggleContentFields = function (type) {
    ['reel', 'carousel', 'stories'].forEach(function (s) {
        const el = document.getElementById('fields-' + s);
        if (el) el.style.display = s === type ? 'block' : 'none';
    });
};

// ==================================================
// ABRIR MODAL AGREGAR
// ==================================================
// ── Cambio de tab de plataforma ────────────────────────────────────────────
window.switchPlatTab = function (tipo, plat, btn) {
    // Desactivar todos los tabs del grupo
    var tabGroup = document.getElementById(tipo + '-plat-tabs');
    if (!tabGroup) return;
    tabGroup.querySelectorAll('.plat-tab').forEach(function (t) { t.classList.remove('active'); });
    btn.classList.add('active');
    // Ocultar todos los paneles del tipo
    ['instagram', 'facebook', 'tiktok'].forEach(function (p) {
        var panel = document.getElementById(tipo + '-panel-' + p);
        if (panel) panel.style.display = 'none';
    });
    // Mostrar el panel seleccionado
    var active = document.getElementById(tipo + '-panel-' + plat);
    if (active) active.style.display = 'block';
};

window.openAddContentModal = function () {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('new-date');
    if (dateInput) dateInput.value = today;

    // Reset tipo y mostrar campos correctos
    const typeInput = document.getElementById('new-type');
    if (typeInput) {
        typeInput.value = 'reel';
        window.toggleContentFields('reel');
    }
    // Inicializar campos dinámicos
    if (typeof window.initDynamicScenes === 'function') window.initDynamicScenes('new-reel-scenes-container', 3);
    if (typeof window.initDynamicSlides === 'function') window.initDynamicSlides('new-carousel-slides-container', 3);
    if (typeof window.initDynamicStories === 'function') window.initDynamicStories('new-stories-container', 3);

    // Actualizar el indicador de cliente en el header del modal
    const acct = (window.accounts || []).find(function (a) { return a.id === (window.currentAccount || 'bondi-media'); });
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
window.saveNewContent = async function () {
    const titleEl = document.getElementById('new-title');
    const dateEl = document.getElementById('new-date');
    if (!titleEl?.value || !dateEl?.value) {
        if (typeof showError === 'function') showError('Título y fecha son obligatorios');
        else alert('Título y fecha son obligatorios');
        return;
    }

    // Deshabilitar botón y mostrar indicador de guardado
    const submitBtn = document.querySelector('#add-content-modal button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Guardando...';
    }

    const tipo = document.getElementById('new-type').value;

    // Campos de producción según tipo — con datos por plataforma
    const gv = id => document.getElementById(id)?.value || '';
    let produccion = {};
    if (tipo === 'reel') {
        var scenes = typeof window.serializeScenes === 'function' ? window.serializeScenes('new-reel-scenes-container') : [];
        produccion = {
            escenas: scenes.length,
            scenes: scenes,
            specs: gv('new-reel-specs'),
            idea: gv('new-reel-idea'),
            // Legado — mantener copy/hashtags globales por compatibilidad
            copy: gv('new-reel-ig-copy'),
            hashtags: gv('new-reel-ig-hashtags'),
            // Por plataforma
            plataformas: {
                instagram: { copy: gv('new-reel-ig-copy'), hashtags: gv('new-reel-ig-hashtags'), diseño: gv('new-reel-ig-diseño') },
                facebook: { copy: gv('new-reel-fb-copy'), hashtags: gv('new-reel-fb-hashtags'), notas: gv('new-reel-fb-notas') },
                tiktok: { copy: gv('new-reel-tt-copy'), hashtags: gv('new-reel-tt-hashtags'), audio: gv('new-reel-tt-audio') }
            }
        };
    } else if (tipo === 'carousel') {
        var slides = typeof window.serializeSlides === 'function' ? window.serializeSlides('new-carousel-slides-container') : [];
        produccion = {
            slidesData: slides,
            slideCount: slides.length,
            idea: gv('new-carousel-idea'),
            copy: gv('new-carousel-ig-copy'),
            hashtags: gv('new-carousel-ig-hashtags'),
            plataformas: {
                instagram: { copy: gv('new-carousel-ig-copy'), hashtags: gv('new-carousel-ig-hashtags'), diseño: gv('new-carousel-ig-diseño') },
                facebook: { copy: gv('new-carousel-fb-copy'), hashtags: gv('new-carousel-fb-hashtags') },
                tiktok: { copy: gv('new-carousel-tt-copy'), hashtags: gv('new-carousel-tt-hashtags') }
            }
        };
    } else if (tipo === 'stories') {
        var stories = typeof window.serializeStories === 'function' ? window.serializeStories('new-stories-container') : [];
        produccion = {
            storiesData: stories,
            storyCount: stories.length,
            plataformas: {
                instagram: { copy: gv('new-stories-ig-copy'), link: gv('new-stories-ig-link') },
                facebook: { copy: gv('new-stories-fb-copy') }
            }
        };
    }

    const newContent = {
        id: Date.now(),
        date: document.getElementById('new-date').value,
        time: document.getElementById('new-time').value,
        type: tipo,
        title: document.getElementById('new-title').value,
        objective: document.getElementById('new-objective').value,
        notes: document.getElementById('new-notes').value,
        status: document.getElementById('new-status').value,
        hasAds: document.getElementById('new-has-ads').value === 'true',
        adBudget: parseInt(document.getElementById('new-ads-budget').value) || 0,
        produccion: produccion,
        details: {}
    };

    if (!appData) appData = {};
    if (!appData.calendar) appData.calendar = [];
    appData.calendar.push(newContent);
    appData.calendar.sort((a, b) => new Date(a.date) - new Date(b.date));

    try {
        console.log('Iniciando guardado...');
        await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);
        console.log('Guardado completado, cerrando modal...');
        
        // Forzar cierre del modal
        const modal = document.getElementById('add-content-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            console.log('Modal cerrado forzosamente');
        }
        
        console.log('Modal cerrado, refrescando vistas...');
        refreshCalendarViews();
        if (typeof showSuccess === 'function') showSuccess('Publicación creada correctamente');
        else if (typeof addNotification === 'function') addNotification('Contenido creado', newContent.title);
        console.log('Proceso completado exitosamente');
    } catch (error) {
        console.error('Error guardando contenido:', error);
        // Forzar cierre del modal incluso en error
        const modal = document.getElementById('add-content-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
        if (typeof showError === 'function') showError('Error al guardar: ' + error.message);
        else alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar botón
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '✅ Crear';
        }
    }
};

// ==================================================
// ABRIR MODAL EDITAR
// ==================================================
window.openEditContentModal = function (contentId) {
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content) { console.error('Contenido no encontrado:', contentId); return; }

    currentEditId = contentId;

    // Campos básicos
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('edit-title', content.title);
    set('edit-date', content.date);
    set('edit-time', content.time);
    set('edit-status', content.status);
    set('edit-objective', content.objective);
    set('edit-notes', content.notes);

    const typeEl = document.getElementById('edit-type');
    if (typeEl) typeEl.value = content.type || 'reel';

    // ── GESTIÓN DE DATOS Y FALLBACK ──────────────────────────────────────────
    // Asegurarnos de que no perdemos info de versiones anteriores
    const p = content.produccion || content.details || {};

    // Si produccion está vacío pero hay datos en raíz (compatibilidad legado), migrarlos temporalmente
    if (!p.copy && content.copy) p.copy = content.copy;
    if (!p.hashtags && content.hashtags) p.hashtags = content.hashtags;
    if (!p.idea && content.idea) p.idea = content.idea;
    if (!p.specs && content.specs) p.specs = content.specs;

    const pp = p.plataformas || { instagram: {}, facebook: {}, tiktok: {} };
    // Asegurar que plataformas tiene lo básico para evitar errores en buildEditPlatTabs
    if (!pp.instagram) pp.instagram = { copy: p.copy || '', hashtags: p.hashtags || '' };
    if (!pp.facebook) pp.facebook = { copy: '' };
    if (!pp.tiktok) pp.tiktok = { copy: '' };

    const tipo = content.type || 'reel';
    const container = document.getElementById('edit-type-specific-content');
    if (container) {
        container.innerHTML = buildEditPlatTabs(tipo, p, pp);
        // Inicializar campos dinámicos (escenas / slides / historias)
        window.initEditDynamicFields(tipo, p);
    }

    const modal = document.getElementById('edit-content-modal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
};

// ==================================================
// GUARDAR EDICIÓN — única definición
// ==================================================
// ── Construye los campos de edición con tabs por plataforma ──────────────────
function buildEditPlatTabs(tipo, p, pp) {
    var ig = pp.instagram || {};
    var fb = pp.facebook || {};
    var tt = pp.tiktok || {};

    function tf(id, label, val, rows, ph) {
        rows = rows || 3;
        return '<div class="form-group"><label class="form-label">' + label + '</label>'
            + (rows === 1
                ? '<input class="form-input" id="' + id + '" value="' + (val || '').replace(/"/g, '&quot;') + '" placeholder="' + ph + '">'
                : '<textarea class="form-input" id="' + id + '" rows="' + rows + '" placeholder="' + ph + '">' + (val || '') + '</textarea>')
            + '</div>';
    }

    function platTabs(tipo, panels) {
        var platformNames = Object.keys(panels);
        var tabHtml = '<div class="plat-tabs" id="edit-' + tipo + '-plat-tabs">'
            + platformNames.map(function (plat, i) {
                var icons = { instagram: '📸', facebook: '📘', tiktok: '🎵' };
                var labels = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' };
                var prefixedTipo = 'edit-' + tipo;
                return '<button type="button" class="plat-tab' + (i === 0 ? ' active' : '') + '" data-tipo="' + prefixedTipo + '" data-plat="' + plat + '" data-editplat="1">'
                    + (icons[plat] || '') + ' ' + (labels[plat] || plat) + '</button>';
            }).join('') + '</div>';
        var panelHtml = platformNames.map(function (plat, i) {
            return '<div class="plat-panel" id="edit-' + tipo + '-panel-' + plat + '"' + (i === 0 ? '' : ' style="display:none;"') + '>' + panels[plat] + '</div>';
        }).join('');
        return tabHtml + panelHtml;
    }

    var html = '<div style="padding:16px 20px;border-top:1px solid #E5E7EB;">';

    if (tipo === 'reel') {
        html += '<div class="platform-section"><div class="platform-title">🎬 Reel — Producción general</div>'
            + tf('edit-reel-specs', 'Especificaciones técnicas', p.specs, 2, 'Formato, duración...')
            + tf('edit-reel-idea', 'Idea creativa', p.idea, 2, 'Concepto visual, tono...')
            + '<div style="display:flex;align-items:center;justify-content:space-between;margin:14px 0 10px;">'
            + '<label class="form-label" style="margin:0;font-weight:700;">🎬 Escenas <span id="edit-reel-scene-count" style="background:#F97316;color:#fff;font-size:10px;font-weight:700;border-radius:20px;padding:2px 8px;margin-left:6px;">1</span></label>'
            + '<button type="button" onclick="addEditReelScene()" style="display:flex;align-items:center;gap:5px;padding:5px 12px;background:#FFF7ED;border:1.5px solid #F97316;border-radius:8px;color:#F97316;font-size:11px;font-weight:700;cursor:pointer;">'
            + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Agregar escena</button>'
            + '</div>'
            + '<div id="edit-reel-scenes-container"></div>'
            + '</div>';
        html += '<div class="platform-section" style="margin-top:10px;"><div class="platform-title">📱 Copy y hashtags por plataforma</div>'
            + platTabs('reel', {
                instagram: tf('edit-reel-ig-copy', 'Copy Instagram', ig.copy, 3, 'Caption para Instagram...')
                    + tf('edit-reel-ig-hashtags', 'Hashtags Instagram', ig.hashtags, 2, '#hashtag1 ...')
                    + tf('edit-reel-ig-diseño', 'Texto en diseño', ig.diseño, 2, 'Texto visible en el video...'),
                facebook: tf('edit-reel-fb-copy', 'Copy Facebook', fb.copy, 3, 'Caption adaptado para Facebook...')
                    + tf('edit-reel-fb-hashtags', 'Hashtags Facebook', fb.hashtags, 2, '#tema1 #tema2')
                    + tf('edit-reel-fb-notas', 'Notas Facebook', fb.notas, 2, 'Grupo, boost, etc.'),
                tiktok: tf('edit-reel-tt-copy', 'Descripción TikTok', tt.copy, 3, 'Descripción corta con gancho...')
                    + tf('edit-reel-tt-hashtags', 'Hashtags TikTok', tt.hashtags, 2, '#parati #fyp ...')
                    + tf('edit-reel-tt-audio', 'Sonido/audio', tt.audio, 1, 'Tendencia de sonido...')
            }) + '</div>';

    } else if (tipo === 'carousel') {
        html += '<div class="platform-section"><div class="platform-title">📊 Carrusel — Producción general</div>'
            + tf('edit-carousel-idea', 'Idea creativa / diseño', p.idea, 2, 'Paleta, tipografía...')
            + '<div style="display:flex;align-items:center;justify-content:space-between;margin:14px 0 10px;">'
            + '<label class="form-label" style="margin:0;font-weight:700;">📊 Slides <span id="edit-carousel-slide-count" style="background:#F97316;color:#fff;font-size:10px;font-weight:700;border-radius:20px;padding:2px 8px;margin-left:6px;">1</span></label>'
            + '<button type="button" onclick="addEditCarouselSlide()" style="display:flex;align-items:center;gap:5px;padding:5px 12px;background:#FFF7ED;border:1.5px solid #F97316;border-radius:8px;color:#F97316;font-size:11px;font-weight:700;cursor:pointer;">'
            + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Agregar slide</button>'
            + '</div>'
            + '<div id="edit-carousel-slides-container"></div>'
            + '</div>';
        html += '<div class="platform-section" style="margin-top:10px;"><div class="platform-title">📱 Copy y hashtags por plataforma</div>'
            + platTabs('carousel', {
                instagram: tf('edit-carousel-ig-copy', 'Copy Instagram', ig.copy, 3, 'Caption para Instagram...')
                    + tf('edit-carousel-ig-hashtags', 'Hashtags Instagram', ig.hashtags, 2, '#hashtag1 ...')
                    + tf('edit-carousel-ig-diseño', 'Texto portada/diseño', ig.diseño, 2, 'Texto de la primera slide...'),
                facebook: tf('edit-carousel-fb-copy', 'Copy Facebook', fb.copy, 3, 'Caption para Facebook...')
                    + tf('edit-carousel-fb-hashtags', 'Hashtags Facebook', fb.hashtags, 2, '#tema1 #tema2'),
                tiktok: tf('edit-carousel-tt-copy', 'Descripción TikTok', tt.copy, 3, 'Los carruseles en TikTok se llaman fotosluces...')
                    + tf('edit-carousel-tt-hashtags', 'Hashtags TikTok', tt.hashtags, 2, '#parati #fyp ...')
            }) + '</div>';

    } else if (tipo === 'stories') {
        html += '<div class="platform-section"><div class="platform-title">📲 Stories — Producción general</div>'
            + '<div style="display:flex;align-items:center;justify-content:space-between;margin:8px 0 10px;">'
            + '<label class="form-label" style="margin:0;font-weight:700;">📲 Historias <span id="edit-stories-story-count" style="background:#F97316;color:#fff;font-size:10px;font-weight:700;border-radius:20px;padding:2px 8px;margin-left:6px;">1</span></label>'
            + '<button type="button" onclick="addEditStory()" style="display:flex;align-items:center;gap:5px;padding:5px 12px;background:#FFF7ED;border:1.5px solid #F97316;border-radius:8px;color:#F97316;font-size:11px;font-weight:700;cursor:pointer;">'
            + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Agregar historia</button>'
            + '</div>'
            + '<div id="edit-stories-container"></div>'
            + '</div>';
        html += '<div class="platform-section" style="margin-top:10px;"><div class="platform-title">📱 Copy por plataforma</div>'
            + platTabs('stories', {
                instagram: tf('edit-stories-ig-copy', 'Copy Instagram Stories', ig.copy, 3, 'Texto visible...')
                    + tf('edit-stories-ig-link', 'Link / CTA', ig.link, 1, 'Link en sticker...'),
                facebook: tf('edit-stories-fb-copy', 'Copy Facebook Stories', fb.copy, 3, 'Texto adaptado...')
            }) + '</div>';
    }

    html += '</div>';
    return html;
}

window.saveContentEdit = async function () {
    if (!currentEditId) { console.error('Sin currentEditId'); return; }

    const content = appData.calendar.find(c => c.id === currentEditId);
    if (!content) { console.error('Contenido no encontrado'); return; }

    // Deshabilitar botón y mostrar indicador de guardado
    const submitBtn = document.querySelector('#edit-content-modal button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Guardando...';
    }

    const get = id => document.getElementById(id)?.value || '';

    // Campos básicos
    content.title = get('edit-title') || content.title;
    content.date = get('edit-date') || content.date;
    content.time = get('edit-time') || content.time;
    content.status = get('edit-status') || content.status;
    content.objective = get('edit-objective') || content.objective;
    content.notes = get('edit-notes');

    const typeEl = document.getElementById('edit-type');
    if (typeEl) content.type = typeEl.value;

    // Campos de producción
    if (!content.produccion) content.produccion = {};
    const p = content.produccion;

    const gve = id => document.getElementById(id)?.value || '';
    if (content.type === 'reel') {
        // Serializar escenas dinámicas si están disponibles
        var scenes = typeof window.serializeEditScenes === 'function' ? window.serializeEditScenes() : [];
        p.scenes = scenes;
        p.escenas = scenes.length;
        p.specs = gve('edit-reel-specs');
        p.idea = gve('edit-reel-idea');
        // Mantener compatibilidad con campos de texto legados
        p.escaleta = scenes.map(function (s, i) { return 'ESC' + (i + 1) + ': ' + (s.escaleta || ''); }).join('\n');
        p.guion = scenes.map(function (s, i) { return 'ESC' + (i + 1) + ': ' + (s.guion || ''); }).join('\n');
        p.planos = scenes.map(function (s, i) { return 'ESC' + (i + 1) + ': ' + (s.plano || ''); }).join('\n');
        p.plataformas = {
            instagram: { copy: gve('edit-reel-ig-copy'), hashtags: gve('edit-reel-ig-hashtags'), diseño: gve('edit-reel-ig-diseño') },
            facebook: { copy: gve('edit-reel-fb-copy'), hashtags: gve('edit-reel-fb-hashtags'), notas: gve('edit-reel-fb-notas') },
            tiktok: { copy: gve('edit-reel-tt-copy'), hashtags: gve('edit-reel-tt-hashtags'), audio: gve('edit-reel-tt-audio') }
        };
        p.copy = gve('edit-reel-ig-copy');
        p.hashtags = gve('edit-reel-ig-hashtags');
    } else if (content.type === 'carousel') {
        // Serializar slides dinámicos si están disponibles
        var slides = typeof window.serializeEditSlides === 'function' ? window.serializeEditSlides() : [];
        p.slidesData = slides;
        p.slideCount = slides.length;
        p.idea = gve('edit-carousel-idea');
        // Mantener compatibilidad
        p.slides = slides.map(function (s, i) { return 'SLIDE' + (i + 1) + ': ' + (s.titulo || ''); }).join('\n');
        p.plataformas = {
            instagram: { copy: gve('edit-carousel-ig-copy'), hashtags: gve('edit-carousel-ig-hashtags'), diseño: gve('edit-carousel-ig-diseño') },
            facebook: { copy: gve('edit-carousel-fb-copy'), hashtags: gve('edit-carousel-fb-hashtags') },
            tiktok: { copy: gve('edit-carousel-tt-copy'), hashtags: gve('edit-carousel-tt-hashtags') }
        };
        p.copy = gve('edit-carousel-ig-copy');
        p.hashtags = gve('edit-carousel-ig-hashtags');
    } else if (content.type === 'stories') {
        // Serializar historias dinámicas si están disponibles
        var stories = typeof window.serializeEditStories === 'function' ? window.serializeEditStories() : [];
        p.storiesData = stories;
        p.storyCount = stories.length;
        // Mantener compatibilidad
        p.texto = stories.map(function (s, i) { return 'HISTORIA' + (i + 1) + ': ' + (s.texto || ''); }).join('\n');
        p.stickers = stories.map(function (s, i) { return 'HISTORIA' + (i + 1) + ': ' + (s.sticker || 'Sin sticker'); }).join('\n');
        p.plataformas = {
            instagram: { copy: gve('edit-stories-ig-copy'), link: gve('edit-stories-ig-link') },
            facebook: { copy: gve('edit-stories-fb-copy') }
        };
    }

    try {
        console.log('Iniciando guardado de edición...');
        await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);
        console.log('Guardado de edición completado, cerrando modal...');
        
        // Forzar cierre del modal
        const modal = document.getElementById('edit-content-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            console.log('Modal de edición cerrado forzosamente');
        }
        
        console.log('Modal de edición cerrado, refrescando vistas...');
        refreshCalendarViews();
        if (typeof window.refreshOpenDetails === 'function') window.refreshOpenDetails(content.id);

        if (typeof showSuccess === 'function') showSuccess('Publicación actualizada correctamente');
        else if (typeof addNotification === 'function') addNotification('Contenido actualizado', content.title);
        console.log('Proceso de edición completado exitosamente');
    } catch (error) {
        console.error('Error guardando edición:', error);
        // Forzar cierre del modal incluso en error
        const modal = document.getElementById('edit-content-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
        if (typeof showError === 'function') showError('Error al guardar: ' + error.message);
        else alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar botón
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '💾 Guardar Cambios';
        }
    }
};

// ==================================================
// ELIMINAR CONTENIDO (CON RECUPERACIÓN)
// ==================================================
window.deleteContent = async function (contentId) {
    const content = appData.calendar.find(c => c.id === contentId);
    if (!content) return;

    if (!confirm('¿Eliminar "' + content.title + '"?\nPodrás recuperarlo desde la papelera durante 30 segundos.')) return;

    // Mover a papelera en lugar de eliminar permanentemente
    const deletedItem = {
        ...content,
        deletedAt: new Date().toISOString(),
        originalIndex: appData.calendar.findIndex(c => c.id === contentId)
    };

    window.deletedContentTrash.push(deletedItem);
    appData.calendar = appData.calendar.filter(c => c.id !== contentId);

    await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);
    refreshCalendarViews();

    // Mostrar notificación con opción de recuperación
    showDeleteNotification(deletedItem);

    // Limpiar papelera automáticamente después de 30 segundos
    if (window.trashTimeoutId) clearTimeout(window.trashTimeoutId);
    window.trashTimeoutId = setTimeout(() => {
        window.deletedContentTrash = [];
        console.log('🗑️ Papelera limpiada automáticamente');
    }, 30000); // 30 segundos
};

// ==================================================
// MOSTRAR NOTIFICACIÓN DE ELIMINACIÓN CON RECUPERACIÓN
// ==================================================
function showDeleteNotification(deletedItem) {
    // Crear notificación personalizada
    const notification = document.createElement('div');
    notification.className = 'delete-notification';
    notification.innerHTML = `
        <div class="delete-notification-content">
            <div class="delete-notification-icon">🗑️</div>
            <div class="delete-notification-text">
                <strong>"${deletedItem.title}"</strong> movido a papelera
            </div>
            <div class="delete-notification-actions">
                <button onclick="restoreContent('${deletedItem.id}')" class="btn-restore">
                    ↶ Recuperar
                </button>
                <button onclick="dismissDeleteNotification(this)" class="btn-dismiss">
                    ✕
                </button>
            </div>
        </div>
        <div class="delete-notification-timer">
            <div class="timer-bar"></div>
        </div>
    `;

    // Agregar estilos CSS
    const style = document.createElement('style');
    style.textContent = `
        .delete-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1f2937;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 350px;
            overflow: hidden;
            animation: slideInRight 0.3s ease-out;
        }

        .delete-notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
        }

        .delete-notification-icon {
            font-size: 20px;
        }

        .delete-notification-text {
            flex: 1;
            color: #f9fafb;
            font-size: 14px;
        }

        .delete-notification-actions {
            display: flex;
            gap: 8px;
        }

        .btn-restore {
            background: #10b981;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-restore:hover {
            background: #059669;
        }

        .btn-dismiss {
            background: transparent;
            color: #9ca3af;
            border: none;
            padding: 6px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }

        .btn-dismiss:hover {
            background: #374151;
        }

        .delete-notification-timer {
            height: 3px;
            background: #374151;
        }

        .timer-bar {
            height: 100%;
            background: #10b981;
            width: 100%;
            animation: timerCountdown 30s linear forwards;
        }

        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes timerCountdown {
            from { width: 100%; }
            to { width: 0%; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto-remover después de 30 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            style.remove();
        }
    }, 30000);
}

// ==================================================
// DESCARTAR NOTIFICACIÓN DE ELIMINACIÓN
// ==================================================
window.dismissDeleteNotification = function(button) {
    const notification = button.closest('.delete-notification');
    if (notification) {
        notification.remove();
        // También remover el estilo
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent.includes('delete-notification')) {
                style.remove();
            }
        });
    }
};

// ==================================================
// RECUPERAR CONTENIDO ELIMINADO
// ==================================================
window.restoreContent = async function(contentId) {
    const deletedItem = window.deletedContentTrash.find(item => item.id === contentId);
    if (!deletedItem) {
        alert('Contenido no encontrado en papelera');
        return;
    }

    // Restaurar el elemento
    appData.calendar.splice(deletedItem.originalIndex, 0, {
        ...deletedItem,
        deletedAt: undefined,
        originalIndex: undefined
    });

    // Remover de papelera
    window.deletedContentTrash = window.deletedContentTrash.filter(item => item.id !== contentId);

    // Guardar cambios
    await storage.set(`bondi-calendar-${currentAccount}`, appData.calendar);
    refreshCalendarViews();

    // Cerrar notificación
    const notification = document.querySelector('.delete-notification');
    if (notification) {
        notification.remove();
        // Remover estilos
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent.includes('delete-notification')) {
                style.remove();
            }
        });
    }

    // Mostrar confirmación
    if (typeof showSuccess === 'function') {
        showSuccess('"' + deletedItem.title + '" recuperado correctamente');
    } else if (typeof addNotification === 'function') {
        addNotification('Recuperado', deletedItem.title);
    } else {
        alert('Contenido recuperado: ' + deletedItem.title);
    }

    // Limpiar timeout si no quedan elementos
    if (window.deletedContentTrash.length === 0 && window.trashTimeoutId) {
        clearTimeout(window.trashTimeoutId);
        window.trashTimeoutId = null;
    }
};
window.downloadGuion = function (contentId) {
    const cal = (window.appData && window.appData.calendar) || [];
    const item = cal.find(function (c) { return c.id === contentId; });
    if (!item) { alert('Contenido no encontrado'); return; }

    const p = item.produccion || item.details || {};
    const tipo = item.type || 'reel';
    const lines = [];

    lines.push('BONDI MEDIA — GUION DE CONTENIDO');
    lines.push('='.repeat(50));
    lines.push('');
    lines.push('TITULO:   ' + (item.title || ''));
    lines.push('FECHA:    ' + (item.date || '') + ' ' + (item.time || ''));
    lines.push('TIPO:     ' + (tipo === 'reel' ? 'Reel' : tipo === 'carousel' ? 'Carrusel' : 'Stories'));
    lines.push('ESTADO:   ' + (item.status || ''));
    lines.push('OBJETIVO: ' + (item.objective || ''));
    lines.push('');

    if (tipo === 'reel') {
        lines.push('-'.repeat(50));
        lines.push('CANTIDAD DE ESCENAS');
        lines.push(p.escenas || '-');
        lines.push('');
        lines.push('-'.repeat(50));
        lines.push('COPY PARA LA PUBLICACION');
        lines.push(p.copy || (p.plataformas && p.plataformas.instagram && p.plataformas.instagram.copy) || '-');
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

        // ── REFERENCIA TÉCNICA DE PLANOS ──────────────────
        lines.push('='.repeat(50));
        lines.push('REFERENCIA TECNICA DE PLANOS DE CAMARA');
        lines.push('='.repeat(50));
        lines.push('');
        lines.push('TIPOS DE PLANO DISPONIBLES:');
        lines.push('');
        lines.push('--- OBJECT POV ---');
        lines.push('Simula que el espectador esta detras de la pantalla. Usado para mostrar');
        lines.push('procesos de busqueda, inspiracion o navegacion en pantalla.');
        lines.push('Ref: https://eyecannndy.com/technique/as-object');
        lines.push('');
        lines.push('--- FIRST PERSON POV ---');
        lines.push('Camara en perspectiva de primera persona. Zoom in rapido al tomar un');
        lines.push('objeto, seguido de zoom out. Genera sensacion de inmersion en el proceso.');
        lines.push('Ref: https://eyecannndy.com/technique/first-person-pov');
        lines.push('');
        lines.push('--- JUMP CUT ---');
        lines.push('Micro cortes rapidos asimilando Stop Motion. Usado para mostrar');
        lines.push('multiples objetos o pasos de forma dinamica sin perder fluidez.');
        lines.push('Ref: https://eyecannndy.com/technique/jump-cut');
        lines.push('');
        lines.push('--- QUICK CUT ---');
        lines.push('Camara hace seguimiento de la mano al tomar el lapiz o herramienta.');
        lines.push('Introduce dinamismo en la transicion entre acciones.');
        lines.push('Ref: https://eyecannndy.com/technique/quick-cuts');
        lines.push('');
        lines.push('--- OVER THE SHOULDER ---');
        lines.push('Toma por encima del hombro para mostrar el proceso de trabajo (bocetaje,');
        lines.push('escritura, edicion). Luego enfoca la mano y el papel/pantalla.');
        lines.push('Ref: https://eyecannndy.com/technique/fpv-drone');
        lines.push('');
        lines.push('--- FLOATING UI / DIGITAL OVERLAY ---');
        lines.push('Toma final para enfocar brevemente la cara del personaje (Object Portal).');
        lines.push('Se combina con overlay digital para mostrar interfaces flotantes.');
        lines.push('Ref: https://eyecannndy.com/technique/digital-overlay');
        lines.push('');
        lines.push('--- OBJECT PORTAL ---');
        lines.push('Revela uno a uno mockups y elementos del proyecto. Usa objetos como');
        lines.push('transicion entre planos. Efecto de Jump Cut entre cada elemento.');
        lines.push('Ref: https://eyecannndy.com/technique/jump-cut');
        lines.push('');
        lines.push('--- TRANSICION ZOOM IN/OUT ---');
        lines.push('Zoom in rapido al ojo del personaje → pantalla a negro → zoom out');
        lines.push('revelando nueva escena. La mano descubre el nuevo escenario.');
        lines.push('');
        lines.push('--- TRANSICION LIMPIEZA DE LENTE ---');
        lines.push('Enfoque en pantalla del PC → pano limpia el lente → revela siguiente');
        lines.push('escena. Transicion fluida y cinematografica.');
        lines.push('');
        lines.push('--- PLANO AEREO ---');
        lines.push('Toma cenital (desde arriba) para mostrar elementos sin movimiento.');
        lines.push('Ideal para mostrar mesas de trabajo, objetos, layout completo.');
        lines.push('');
        lines.push('--- TOMA DE CIERRE ---');
        lines.push('Aparicion del personaje en camara. Chasquido de dedos → desaparicion.');
        lines.push('Efecto de fade/desaparicion para el plano final del video.');
        lines.push('');
        lines.push('='.repeat(50));
        lines.push('SECUENCIA DE EJEMPLO (cronologica):');
        lines.push('');
        lines.push('1. BUSQUEDA DE INSPIRACION');
        lines.push('   Object POV — Personaje detras de pantalla navegando referencias');
        lines.push('');
        lines.push('2. PROCESO PREVIO / BOCETOS');
        lines.push('   Object POV — Cara del personaje abriendo gaveta');
        lines.push('   Aereo — Toma desde arriba del gavetero');
        lines.push('   First Person POV — Zoom in/out al tomar el primer objeto');
        lines.push('   Jump Cut — Micro cortes mostrando cada objeto tomado');
        lines.push('');
        lines.push('3. TRANSICION');
        lines.push('   Zoom in → pantalla blanca → zoom out al papel en blanco');
        lines.push('');
        lines.push('4. BOCETAJE');
        lines.push('   Quick Cut — Seguimiento de la mano tomando el lapiz');
        lines.push('   Over the Shoulder — Proceso de bocetaje');
        lines.push('   Plano fijo — Mano y papel durante el bocetaje');
        lines.push('   Floating UI — Breve enfoque a la cara del personaje');
        lines.push('');
        lines.push('5. TRANSICION');
        lines.push('   Zoom in al ojo → negro → mano descubre el nuevo escenario');
        lines.push('');
        lines.push('6. DIGITALIZACION');
        lines.push('   Pantalla de apertura del programa (Illustrator)');
        lines.push('   Proceso de digitalizacion del logotipo');
        lines.push('');
        lines.push('7. TRANSICION');
        lines.push('   Enfoque pantalla → pano limpia lente → nueva escena');
        lines.push('');
        lines.push('8. REVEAL DE MOCKUPS');
        lines.push('   Object Portal — Revelar uno a uno cada mockup con Jump Cut');
        lines.push('');
        lines.push('9. CIERRE');
        lines.push('   Personaje en camara → chasquido → desaparicion');
        lines.push('='.repeat(50));
        lines.push('');

        lines.push('-'.repeat(50));
        lines.push('HASHTAGS');
        lines.push(p.hashtags || (p.plataformas && p.plataformas.instagram && p.plataformas.instagram.hashtags) || '-');
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guion-' + (item.title || 'contenido').replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// ==================================================
// TOGGLE ADS BUDGET (alias para el edit modal)
// ==================================================
window.toggleEditAdsBudget = function (value) {
    const container = document.getElementById('edit-ads-budget-container');
    if (container) container.style.display = value === 'true' ? 'block' : 'none';
};

console.log('✅ content-modal.js cargado correctamente');

// ── Delegated listener para tabs de plataforma en modal de edición ──────────
document.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-editplat="1"]');
    if (!btn) return;
    var tipo = btn.getAttribute('data-tipo');
    var plat = btn.getAttribute('data-plat');
    if (!tipo || !plat) return;
    // Desactivar todos los tabs del grupo
    var tabGroup = btn.closest('.plat-tabs');
    if (tabGroup) tabGroup.querySelectorAll('.plat-tab').forEach(function (t) { t.classList.remove('active'); });
    btn.classList.add('active');
    // Ocultar todos los paneles
    ['instagram', 'facebook', 'tiktok'].forEach(function (p) {
        var panel = document.getElementById(tipo + '-panel-' + p);
        if (panel) panel.style.display = 'none';
    });
    // Mostrar el activo
    var active = document.getElementById(tipo + '-panel-' + plat);
    if (active) active.style.display = 'block';
});

// ══════════════════════════════════════════════════════
// FILTROS DE CONTENIDO — sección "Todo el Contenido"
// ══════════════════════════════════════════════════════
window._contentFilters = { search: '', type: 'all', status: 'all', month: 'all', metrics: 'all', objective: 'all' };

window.getContentFilterStorageKey = function () {
    var account = window.currentAccount || 'bondi-media';
    return 'bondi-content-filters-' + account;
};

window.saveContentFilters = function () {
    try {
        localStorage.setItem(window.getContentFilterStorageKey(), JSON.stringify(window._contentFilters));
    } catch (e) {
        console.warn('No se pudieron guardar los filtros de contenido:', e);
    }
};

window.syncContentFilterControls = function () {
    var mapping = {
        search: 'cf-search',
        type: 'cf-type',
        status: 'cf-status',
        month: 'cf-month',
        metrics: 'cf-metrics',
        objective: 'cf-objective'
    };
    Object.keys(mapping).forEach(function (key) {
        var el = document.getElementById(mapping[key]);
        if (!el) return;
        el.value = window._contentFilters[key] || (key === 'search' ? '' : 'all');
    });
};

window.populateContentMonthFilter = function () {
    var select = document.getElementById('cf-month');
    if (!select) return;

    var months = new Set();
    var now = new Date();
    var currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    months.add(currentMonth);

    if (window.appData && Array.isArray(window.appData.calendar)) {
        window.appData.calendar.forEach(function (c) {
            if (c.date && c.date.length >= 7) {
                months.add(c.date.substring(0, 7));
            }
        });
    }

    for (var i = 1; i <= 4; i++) {
        var next = new Date(now.getFullYear(), now.getMonth() + i, 1);
        months.add(next.getFullYear() + '-' + String(next.getMonth() + 1).padStart(2, '0'));
    }

    var monthNames = {
        '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
        '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
        '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
    };

    var options = '<option value="all">🗓️ Mes</option>';
    Array.from(months).sort().forEach(function (monthKey) {
        var parts = monthKey.split('-');
        if (parts.length !== 2) return;
        var label = monthNames[parts[1]] || parts[1] + '/' + parts[0];
        options += '<option value="' + monthKey + '">' + label + ' ' + parts[0] + '</option>';
    });
    select.innerHTML = options;
};

window.loadSavedContentFilters = function () {
    try {
        if (typeof window.populateContentMonthFilter === 'function') {
            window.populateContentMonthFilter();
        }
        var saved = localStorage.getItem(window.getContentFilterStorageKey());
        if (!saved) return;
        var parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
            window._contentFilters = Object.assign({ search: '', type: 'all', status: 'all', month: 'all', metrics: 'all', objective: 'all' }, parsed);
            window.syncContentFilterControls();
        }
    } catch (e) {
        console.warn('No se pudieron cargar los filtros de contenido:', e);
    }
};

window.restoreContentFilters = function () {
    window.loadSavedContentFilters();
    if (typeof renderContentList === 'function') {
        renderContentList();
    }
};

window.applyContentFilters = function () {
    window._contentFilters.search = (document.getElementById('cf-search')?.value || '').toLowerCase().trim();
    window._contentFilters.type = document.getElementById('cf-type')?.value || 'all';
    window._contentFilters.status = document.getElementById('cf-status')?.value || 'all';
    window._contentFilters.month = document.getElementById('cf-month')?.value || 'all';
    window._contentFilters.metrics = document.getElementById('cf-metrics')?.value || 'all';
    window._contentFilters.objective = document.getElementById('cf-objective')?.value || 'all';
    window.saveContentFilters();
    if (window._contentFilters.month !== 'all' && typeof switchMonth === 'function') {
        switchMonth(window._contentFilters.month);
    } else {
        renderFilteredContent();
    }
};

window.clearContentFilters = function () {
    window._contentFilters = { search: '', type: 'all', status: 'all', month: 'all', metrics: 'all', objective: 'all' };
    window.saveContentFilters();
    var ids = ['cf-search', 'cf-type', 'cf-status', 'cf-month', 'cf-metrics', 'cf-objective'];
    ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = el.tagName === 'INPUT' ? '' : 'all';
    });
    renderFilteredContent();
};

function renderFilteredContent() {
    var listEl = document.getElementById('content-list');
    if (!listEl) return;

    var cal = (window.appData && window.appData.calendar) || [];
    var f = window._contentFilters;

    var filtered = cal.filter(function (c) {
        if (f.search && !(c.title || '').toLowerCase().includes(f.search)) return false;
        if (f.type !== 'all' && c.type !== f.type) return false;
        if (f.status !== 'all' && c.status !== f.status) return false;
        if (f.month !== 'all' && (!c.date || !c.date.startsWith(f.month))) return false;
        if (f.objective !== 'all' && c.objective !== f.objective) return false;
        if (f.metrics === 'yes' && !c.metrics) return false;
        if (f.metrics === 'no' && c.metrics) return false;
        return true;
    }).sort(function (a, b) { return new Date(b.date || 0) - new Date(a.date || 0); });

    // Actualizar contador
    var countEl = document.getElementById('cf-count');
    if (countEl) countEl.textContent = filtered.length + ' de ' + cal.length;

    if (typeof renderCalendarItems === 'function') {
        renderCalendarItems('content-list', filtered);
    }
}

// Hook: aplicar filtros también al refrescar
var _origRefresh = window.refreshCalendarViews || function () { };
// No override needed — filters apply on demand via UI

// ══════════════════════════════════════════════════════
// CAMPOS DINÁMICOS — Escenas, Slides, Stories
// ══════════════════════════════════════════════════════

// ── Escenas de Reel ──────────────────────────────────
window.initDynamicScenes = function (containerId, initialCount) {
    var c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    var count = initialCount || 1;
    for (var i = 1; i <= count; i++) addSceneRow(c, i);
    updateSceneNumbers(c);
};

function addSceneRow(container, num, data) {
    data = data || {};
    var row = document.createElement('div');
    row.className = 'dynamic-row scene-row';
    row.style.cssText = 'background:#F8FAFC;border:1px solid #E5E7EB;border-radius:10px;padding:12px;margin-bottom:8px;';
    row.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
        + '<span class="scene-num" style="font-size:11px;font-weight:700;color:#F97316;text-transform:uppercase;letter-spacing:.5px;">Escena ' + num + '</span>'
        + '<div style="display:flex;gap:4px;">'
        + '<button type="button" class="btn-secondary btn-sm" onclick="addSceneAfter(this)" style="font-size:11px;padding:2px 8px;">+ Agregar</button>'
        + '<button type="button" class="btn-secondary btn-sm remove-row-btn" onclick="removeDynamicRow(this)" style="font-size:11px;padding:2px 8px;color:#EF4444;border-color:#FECACA;">✕</button>'
        + '</div></div>'
        + '<div class="form-row">'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Duración</label>'
        + '<input class="form-input scene-duracion" style="font-size:12px;" placeholder="Ej: 4s" value="' + (data.duracion || '') + '"></div>'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Plano de cámara</label>'
        + '<input class="form-input scene-plano" style="font-size:12px;" placeholder="Ej: Plano medio fijo" value="' + (data.plano || '') + '"></div>'
        + '</div>'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Guion / Acción</label>'
        + '<textarea class="form-input scene-guion" rows="2" style="font-size:12px;" placeholder="Texto exacto o descripción de la acción...">' + (data.guion || '') + '</textarea></div>'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Texto en diseño / cartel</label>'
        + '<input class="form-input scene-texto" style="font-size:12px;" placeholder="Texto visible en pantalla en esta escena" value="' + (data.texto || '') + '"></div>';
    row.innerHTML += '</div>';
    container.appendChild(row);
}

window.addSceneAfter = function (btn) {
    var row = btn.closest('.scene-row');
    var container = row.parentElement;
    var num = container.querySelectorAll('.scene-row').length + 1;
    var tempDiv = document.createElement('div');
    container.insertBefore(tempDiv, row.nextSibling);
    addSceneRow(container, num);
    var newRow = container.lastElementChild;
    container.insertBefore(newRow, tempDiv);
    tempDiv.remove();
    updateSceneNumbers(container);
    updateSceneCount(container);
};

// Alias: botón "Agregar escena" en modal de AGREGAR (index.html)
window.addReelScene = function (containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var num = container.querySelectorAll('.scene-row').length + 1;
    addSceneRow(container, num);
    updateSceneNumbers(container);
    updateSceneCount(container);
};

// Alias: botón "Agregar escena" en modal de EDITAR (buildEditPlatTabs)
window.addEditReelScene = function () {
    window.addReelScene('edit-reel-scenes-container');
};

function updateSceneCount(container) {
    var count = container.querySelectorAll('.scene-row').length;
    // Actualizar badge en modal de agregar o de editar
    var newBadge = document.getElementById('new-reel-scene-count');
    if (newBadge && container.id === 'new-reel-scenes-container') newBadge.textContent = count;
    var editBadge = document.getElementById('edit-reel-scene-count');
    if (editBadge && container.id === 'edit-reel-scenes-container') editBadge.textContent = count;
}

window.removeDynamicRow = function (btn) {
    var row = btn.closest('.dynamic-row');
    var container = row.parentElement;
    var rows = container.querySelectorAll('.dynamic-row');
    if (rows.length <= 1) return; // keep at least 1
    row.remove();
    updateSceneNumbers(container);
    updateSlideNumbers(container);
    updateStoryNumbers(container);
    updateSceneCount(container);
    updateSlideCount(container);
    updateStoryCount(container);
};

function updateSceneNumbers(container) {
    container.querySelectorAll('.scene-row').forEach(function (r, i) {
        var lbl = r.querySelector('.scene-num');
        if (lbl) lbl.textContent = 'Escena ' + (i + 1);
    });
}

// ── Slides de Carrusel ───────────────────────────────
window.initDynamicSlides = function (containerId, initialCount) {
    var c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    var count = initialCount || 3;
    for (var i = 1; i <= count; i++) addSlideRow(c, i);
};

function addSlideRow(container, num, data) {
    data = data || {};
    var row = document.createElement('div');
    row.className = 'dynamic-row slide-row modal-slide-row';
    row.style.cssText = 'background:#FFFFFF;border:1px solid #E5E7EB;border-radius:10px;padding:12px;margin-bottom:8px;';
    row.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
        + '<span class="slide-num" style="font-size:11px;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:.5px;">Slide ' + num + '</span>'
        + '<div style="display:flex;gap:4px;">'
        + '<button type="button" class="btn-secondary btn-sm" onclick="addSlideAfter(this)" style="font-size:11px;padding:2px 8px;">+ Slide</button>'
        + '<button type="button" class="btn-secondary btn-sm remove-row-btn" onclick="removeDynamicRow(this)" style="font-size:11px;padding:2px 8px;color:#EF4444;border-color:#FECACA;">✕</button>'
        + '</div></div>'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Título / Texto principal</label>'
        + '<input class="form-input slide-titulo" style="font-size:12px;" placeholder="' + (num === 1 ? 'Portada / Hook' : 'Punto ' + (num - 1)) + '" value="' + (data.titulo || '') + '"></div>'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Subtexto / Descripción</label>'
        + '<textarea class="form-input slide-subtexto" rows="2" style="font-size:12px;" placeholder="Texto secundario del slide...">' + (data.subtexto || '') + '</textarea></div>'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Notas de diseño</label>'
        + '<input class="form-input slide-diseño" style="font-size:12px;" placeholder="Color, imagen, ícono..." value="' + (data.diseño || '') + '"></div>';
    container.appendChild(row);
}

window.addSlideAfter = function (btn) {
    var row = btn.closest('.slide-row');
    var container = row.parentElement;
    var num = container.querySelectorAll('.slide-row').length + 1;
    var tempDiv = document.createElement('div');
    container.insertBefore(tempDiv, row.nextSibling);
    addSlideRow(container, num);
    var newRow = container.lastElementChild;
    container.insertBefore(newRow, tempDiv);
    tempDiv.remove();
    updateSlideNumbers(container);
    updateSlideCount(container);
};

// Alias: botón "Agregar slide" en modal de AGREGAR (index.html)
window.addCarouselSlide = function (containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var num = container.querySelectorAll('.slide-row').length + 1;
    addSlideRow(container, num);
    updateSlideNumbers(container);
    updateSlideCount(container);
};

// Alias: botón "Agregar slide" en modal de EDITAR (buildEditPlatTabs)
window.addEditCarouselSlide = function () {
    window.addCarouselSlide('edit-carousel-slides-container');
};

function updateSlideCount(container) {
    var count = container.querySelectorAll('.slide-row').length;
    var newBadge = document.getElementById('new-carousel-slide-count');
    if (newBadge && container.id === 'new-carousel-slides-container') newBadge.textContent = count;
    var editBadge = document.getElementById('edit-carousel-slide-count');
    if (editBadge && container.id === 'edit-carousel-slides-container') editBadge.textContent = count;
}

function updateSlideNumbers(container) {
    container.querySelectorAll('.slide-row').forEach(function (r, i) {
        var lbl = r.querySelector('.slide-num');
        if (lbl) lbl.textContent = 'Slide ' + (i + 1);
    });
}

// ── Stories ──────────────────────────────────────────
window.initDynamicStories = function (containerId, initialCount) {
    var c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    var count = initialCount || 3;
    for (var i = 1; i <= count; i++) addStoryRow(c, i);
};

function addStoryRow(container, num, data) {
    data = data || {};
    var row = document.createElement('div');
    row.className = 'dynamic-row story-row';
    row.style.cssText = 'background:#F8FAFC;border:1px solid #E5E7EB;border-radius:10px;padding:12px;margin-bottom:8px;';
    row.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'
        + '<span class="story-num" style="font-size:11px;font-weight:700;color:#8B5CF6;text-transform:uppercase;letter-spacing:.5px;">Historia ' + num + '</span>'
        + '<div style="display:flex;gap:4px;">'
        + '<button type="button" class="btn-secondary btn-sm" onclick="addStoryAfter(this)" style="font-size:11px;padding:2px 8px;">+ Historia</button>'
        + '<button type="button" class="btn-secondary btn-sm remove-row-btn" onclick="removeDynamicRow(this)" style="font-size:11px;padding:2px 8px;color:#EF4444;border-color:#FECACA;">✕</button>'
        + '</div></div>'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Texto / Mensaje</label>'
        + '<textarea class="form-input story-texto" rows="2" style="font-size:12px;" placeholder="Texto que aparece en la historia...">' + (data.texto || '') + '</textarea></div>'
        + '<div class="form-row">'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Sticker / CTA</label>'
        + '<input class="form-input story-sticker" style="font-size:12px;" placeholder="Encuesta, link, pregunta..." value="' + (data.sticker || '') + '"></div>'
        + '<div class="form-group"><label class="form-label" style="font-size:10px;">Fondo / Estilo</label>'
        + '<input class="form-input story-estilo" style="font-size:12px;" placeholder="Color, foto, video..." value="' + (data.estilo || '') + '"></div>'
        + '</div>';
    container.appendChild(row);
}

window.addStoryAfter = function (btn) {
    var row = btn.closest('.story-row');
    var container = row.parentElement;
    var num = container.querySelectorAll('.story-row').length + 1;
    var tempDiv = document.createElement('div');
    container.insertBefore(tempDiv, row.nextSibling);
    addStoryRow(container, num);
    var newRow = container.lastElementChild;
    container.insertBefore(newRow, tempDiv);
    tempDiv.remove();
    updateStoryNumbers(container);
    updateStoryCount(container);
};

// Alias: botón "Agregar historia" en modal de EDITAR (buildEditPlatTabs)
window.addEditStory = function () {
    var container = document.getElementById('edit-stories-container');
    if (!container) return;
    var num = container.querySelectorAll('.story-row').length + 1;
    addStoryRow(container, num);
    updateStoryNumbers(container);
    updateStoryCount(container);
};

function updateStoryCount(container) {
    var count = container.querySelectorAll('.story-row').length;
    var newBadge = document.getElementById('new-stories-story-count');
    if (newBadge && container.id === 'new-stories-container') newBadge.textContent = count;
    var editBadge = document.getElementById('edit-stories-story-count');
    if (editBadge && container.id === 'edit-stories-container') editBadge.textContent = count;
}

function updateStoryNumbers(container) {
    container.querySelectorAll('.story-row').forEach(function (r, i) {
        var lbl = r.querySelector('.story-num');
        if (lbl) lbl.textContent = 'Historia ' + (i + 1);
    });
}

// addStory y removeStory son manejadas por metrics-modal.js
// con soporte dual para modal de métricas (plat='ig'/'fb') y modal de contenido (containerId completo)


// ── Serializar para guardar ───────────────────────────
window.serializeScenes = function (containerId) {
    var c = document.getElementById(containerId);
    if (!c) return [];
    return Array.from(c.querySelectorAll('.scene-row')).map(function (r) {
        return {
            duracion: r.querySelector('.scene-duracion')?.value || '',
            plano: r.querySelector('.scene-plano')?.value || '',
            guion: r.querySelector('.scene-guion')?.value || '',
            texto: r.querySelector('.scene-texto')?.value || ''
        };
    });
};

window.serializeSlides = function (containerId) {
    var c = document.getElementById(containerId);
    if (!c) return [];
    return Array.from(c.querySelectorAll('.slide-row')).map(function (r) {
        return {
            titulo: r.querySelector('.slide-titulo')?.value || '',
            subtexto: r.querySelector('.slide-subtexto')?.value || '',
            diseño: r.querySelector('.slide-diseño')?.value || ''
        };
    });
};

window.serializeStories = function (containerId) {
    var c = document.getElementById(containerId);
    if (!c) return [];
    return Array.from(c.querySelectorAll('.story-row')).map(function (r) {
        return {
            texto: r.querySelector('.story-texto')?.value || '',
            sticker: r.querySelector('.story-sticker')?.value || '',
            estilo: r.querySelector('.story-estilo')?.value || ''
        };
    });
};

window.initEditDynamicFields = function (tipo, p) {
    var scenes = p && Array.isArray(p.scenes) ? p.scenes : [];
    var slides = p && Array.isArray(p.slidesData) ? p.slidesData : [];
    var stories = p && Array.isArray(p.storiesData) ? p.storiesData : [];

    if (tipo === 'reel') {
        var container = document.getElementById('edit-reel-scenes-container');
        if (!container) return;
        container.innerHTML = '';
        if (scenes.length) {
            scenes.forEach(function (data, index) {
                addSceneRow(container, index + 1, data);
            });
        } else {
            addSceneRow(container, 1, {});
        }
        updateSceneNumbers(container);
        updateSceneCount(container);
    }

    if (tipo === 'carousel') {
        var container = document.getElementById('edit-carousel-slides-container');
        if (!container) return;
        container.innerHTML = '';
        if (slides.length) {
            slides.forEach(function (data, index) {
                addSlideRow(container, index + 1, data);
            });
        } else {
            addSlideRow(container, 1, {});
        }
        updateSlideNumbers(container);
        updateSlideCount(container);
    }

    if (tipo === 'stories') {
        var container = document.getElementById('edit-stories-container');
        if (!container) return;
        container.innerHTML = '';
        if (stories.length) {
            stories.forEach(function (data, index) {
                addStoryRow(container, index + 1, data);
            });
        } else {
            addStoryRow(container, 1, {});
        }
        updateStoryNumbers(container);
        updateStoryCount(container);
    }
};

window.serializeEditScenes = function () {
    return window.serializeScenes('edit-reel-scenes-container');
};

window.serializeEditSlides = function () {
    return window.serializeSlides('edit-carousel-slides-container');
};

window.serializeEditStories = function () {
    return window.serializeStories('edit-stories-container');
};

// ══════════════════════════════════════════════════════
// PROMPT INTERNO — Generación automática de contenido por mes
// ══════════════════════════════════════════════════════

var CONTENT_TEMPLATES = {
    reel: {
        titles: [
            '[N] errores que cometen los {nicho} al publicar en redes',
            'La verdad sobre {tema} que nadie te cuenta',
            'Cómo {resultado} en 30 días sin {obstáculo}',
            'Lo que cambió cuando empecé a {acción}',
            'Por qué tu {elemento} no está funcionando',
            '{Número} cosas que hacen los {nicho} exitosos',
            'El secreto de {resultado} que nadie te enseñó',
            'Antes y después de implementar {estrategia}',
        ],
        objectives: ['conversion', 'educativo', 'engagement', 'authority'],
        igCopy: 'Hook: [Primera línea que para el scroll]\n\nDesarrollo: [Explicación del tema en 2-3 puntos]\n\nCTA: [Llamado a la acción específico — "Escribime INFO para..."]',
        igHashtags: '#contenido #estrategia #marketing #emprendimiento #redes #resultados',
        fbCopy: '[Versión más larga del copy para Facebook, con más contexto y sin exceso de hashtags]',
        ttCopy: '[Descripción corta y directa para TikTok — máx 2 líneas + CTA]',
        ttHashtags: '#parati #fyp #tips #emprendedor',
        specs: 'Formato vertical 9:16 | Duración: 15-30s | Subtítulos: Sí | Música: Tendencia del momento',
        idea: 'Tono directo y cercano | Fondo limpio | Texto en pantalla visible | Gancho visual en primer segundo',
    },
    carousel: {
        titles: [
            '{N} pasos para lograr {resultado}',
            'Guía completa de {tema}',
            'Los {N} errores más comunes en {área}',
            'Cómo funciona {proceso} — explicado simple',
            '{N} consejos para {objetivo}',
            'Todo lo que necesitás saber sobre {tema}',
        ],
        objectives: ['educativo', 'authority', 'engagement'],
        igCopy: '[Primera línea con gancho]\n\n¿Guardalo para después! 💾\n\n[2-3 líneas de contexto]\n\nSlide → para ver todo',
        igHashtags: '#tips #aprende #guia #conocimiento #estrategia',
        fbCopy: '[Copy más narrativo para Facebook explicando el contenido del carrusel]',
        ttCopy: '[Descripción breve para carrusel TikTok — "fotosluces"]',
        ttHashtags: '#aprende #tips #parati',
        idea: 'Slide 1: Portada con pregunta o promesa | Slides 2-N: Puntos clave | Última: CTA | Paleta consistente',
    },
    stories: {
        titles: [
            'Stories interactivas — encuesta',
            'Detrás de escenas',
            'Tip rápido de la semana',
            'Pregunta a la audiencia',
            'Novedad del mes',
            'CTA directa a consulta',
        ],
        objectives: ['engagement', 'conversion'],
        igCopy: 'Historia 1: [Gancho / pregunta]\nHistoria 2: [Desarrollo]\nHistoria 3: [CTA con sticker de link o encuesta]',
        fbCopy: 'Historia 1: [Adaptación para FB Stories]\nHistoria 2: [CTA]',
        idea: 'Fondo de color de marca | Texto grande y visible | Sticker de interacción obligatorio',
    }
};

window.openAutoGenerateModal = function () {
    var existing = document.getElementById('auto-gen-modal');
    if (existing) {
        existing.style.display = 'flex';
        existing.classList.add('active');
        // Re-poblar el select de clientes por si cambiaron
        _rebuildAgClientSelect();
        return;
    }

    var accounts = window.accounts || [];
    var clients = accounts.filter(function (a) { return a.id !== 'bondi-media'; });
    var now = new Date();

    // Generar 12 meses hacia adelante como opciones
    var months = [];
    for (var i = -1; i < 12; i++) {
        var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        var val = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        var label = d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
        label = label.charAt(0).toUpperCase() + label.slice(1);
        months.push({ val: val, label: label });
    }
    var defaultMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    var modal = document.createElement('div');
    modal.id = 'auto-gen-modal';
    modal.className = 'modal modal-no-overlay-close';
    modal.style.cssText = 'z-index:10005;';

    var box = document.createElement('div');
    box.className = 'modal-content';
    box.style.maxWidth = '540px';
    box.innerHTML = '<div class="modal-header" style="background:linear-gradient(135deg,#7C3AED,#4F46E5);border-radius:12px 12px 0 0;">'
        + '<span class="modal-title" style="display:flex;align-items:center;gap:8px;color:#fff;">'
        + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>'
        + '✨ Generador de Contenido IA</span>'
        + '<button class="modal-close" id="close-auto-gen" style="color:#fff;opacity:.7;">×</button>'
        + '</div>'
        + '<div style="padding:18px 20px;display:flex;flex-direction:column;gap:14px;">'

        // Banner AI
        + '<div id="ag-ai-banner" style="border-radius:10px;padding:10px 14px;font-size:12px;"></div>'

        // Fila 1: Mes + Cliente
        + '<div class="form-row">'
        + '<div class="form-group">'
        + '<label class="form-label">📅 Mes a generar</label>'
        + '<select class="form-select" id="ag-month">'
        + months.map(function (m) {
            return '<option value="' + m.val + '"' + (m.val === defaultMonth ? ' selected' : '') + '>'
                + m.label + ' (' + m.val + ')</option>';
        }).join('')
        + '</select>'
        // Input mes personalizado
        + '<div style="margin-top:6px;display:flex;align-items:center;gap:6px;">'
        + '<input type="month" class="form-input" id="ag-month-custom" style="font-size:12px;padding:5px 10px;flex:1;" placeholder="O ingresá un mes específico" title="Ingresá cualquier mes en formato AAAA-MM">'
        + '<span style="font-size:11px;color:#9CA3AF;white-space:nowrap;">mes específico</span>'
        + '</div>'
        + '</div>'
        + '<div class="form-group">'
        + '<label class="form-label">👤 Cliente</label>'
        + '<select class="form-select" id="ag-client">'
        + '<option value="">— Cliente activo —</option>'
        + clients.map(function (c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('')
        + '</select>'
        + '</div>'
        + '</div>'

        // Fila 2: Cantidades
        + '<div class="form-group">'
        + '<label class="form-label">📦 Publicaciones por tipo</label>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">'
        + '<div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:10px;text-align:center;">'
        + '<div style="font-size:18px;margin-bottom:4px;">🎬</div>'
        + '<div style="font-size:10px;color:#C2410C;font-weight:600;margin-bottom:4px;">Reels</div>'
        + '<input class="form-input" id="ag-reels" type="number" min="0" max="20" value="6" style="font-size:13px;font-weight:700;text-align:center;padding:4px;border-color:#FED7AA;"></div>'
        + '<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:10px;text-align:center;">'
        + '<div style="font-size:18px;margin-bottom:4px;">📊</div>'
        + '<div style="font-size:10px;color:#1D4ED8;font-weight:600;margin-bottom:4px;">Carruseles</div>'
        + '<input class="form-input" id="ag-carousels" type="number" min="0" max="20" value="4" style="font-size:13px;font-weight:700;text-align:center;padding:4px;border-color:#BFDBFE;"></div>'
        + '<div style="background:#F0FDF4;border:1px solid #A7F3D0;border-radius:8px;padding:10px;text-align:center;">'
        + '<div style="font-size:18px;margin-bottom:4px;">📲</div>'
        + '<div style="font-size:10px;color:#065F46;font-weight:600;margin-bottom:4px;">Stories</div>'
        + '<input class="form-input" id="ag-stories" type="number" min="0" max="20" value="4" style="font-size:13px;font-weight:700;text-align:center;padding:4px;border-color:#A7F3D0;"></div>'
        + '</div></div>'

        // Fila 3: Tema
        + '<div class="form-group">'
        + '<label class="form-label">🎯 Tema / Nicho del contenido</label>'
        + '<input class="form-input" id="ag-topic" placeholder="Ej: nutrición saludable, estrategia digital, diseño web para PyMEs...">'
        + '<div style="margin-top:5px;font-size:11px;color:#9CA3AF;">Si dejás este campo vacío, se usará la industria del cliente.</div>'
        + '</div>'

        // Status
        + '<div id="ag-status" style="display:none;border-radius:8px;padding:10px 14px;font-size:12px;"></div>'
        + '</div>'

        + '<div class="modal-actions">'
        + '<button style="display:flex;align-items:center;gap:7px;padding:10px 20px;background:linear-gradient(135deg,#7C3AED,#4F46E5);border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;color:#fff;transition:all .15s;" id="ag-run-btn">✨ Generar contenido del mes</button>'
        + '<button class="btn-secondary" id="ag-cancel-btn">Cancelar</button>'
        + '</div>';

    modal.appendChild(box);
    document.body.appendChild(modal);

    // Sincronizar: si el usuario elige en el input custom, actualiza el select (y viceversa)
    var selMonth = document.getElementById('ag-month');
    var inpMonth = document.getElementById('ag-month-custom');
    inpMonth.addEventListener('change', function () {
        if (this.value) {
            // Intentar seleccionar en el select si existe, sino agregarlo
            var opt = selMonth.querySelector('option[value="' + this.value + '"]');
            if (opt) {
                selMonth.value = this.value;
            } else {
                var newOpt = document.createElement('option');
                newOpt.value = this.value;
                newOpt.textContent = this.value + ' (personalizado)';
                newOpt.selected = true;
                selMonth.insertBefore(newOpt, selMonth.firstChild);
                selMonth.value = this.value;
            }
        }
    });
    selMonth.addEventListener('change', function () {
        inpMonth.value = '';
    });

    document.getElementById('close-auto-gen').addEventListener('click', closeAutoGenModal);
    document.getElementById('ag-cancel-btn').addEventListener('click', closeAutoGenModal);
    // ✅ Usar runAutoGenerateAI si está disponible (ai-content-generator.js cargado)
    // Si no, fallback al runAutoGenerate original con templates
    document.getElementById('ag-run-btn').addEventListener('click', function () {
        if (typeof window.runAutoGenerateAI === 'function') {
            window.runAutoGenerateAI();
        } else {
            runAutoGenerate();
        }
    });

    // Banner dinámico: muestra si hay API key configurada
    var banner = document.getElementById('ag-ai-banner');
    if (banner) {
        var hasKey = !!(localStorage.getItem('bondi-openai-key') || localStorage.getItem('bondi-claude-key'));
        if (hasKey) {
            banner.style.cssText = 'background:#F0FDF4;border:1px solid #A7F3D0;border-radius:10px;padding:10px 14px;font-size:12px;color:#065F46;';
            banner.innerHTML = '✨ <strong>IA activada.</strong> El sistema generará contenido completo con guiones, copies y hashtags reales para cada publicación usando el Prompt Maestro + datos del cliente.';
        } else {
            banner.style.cssText = 'background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:10px 14px;font-size:12px;color:#92400E;';
            banner.innerHTML = '📋 <strong>Modo plantilla.</strong> No hay API key configurada. Se usarán plantillas base. Configurá tu API key en ⚙️ Configuración → Inteligencia Artificial para activar la generación con IA.';
        }
    }

    modal.style.display = 'flex';
    modal.classList.add('active');
};

function closeAutoGenModal() {
    var m = document.getElementById('auto-gen-modal');
    if (m) { m.style.display = 'none'; m.classList.remove('active'); }
}

function _rebuildAgClientSelect() {
    var sel = document.getElementById('ag-client');
    if (!sel) return;
    var accounts = window.accounts || [];
    var clients = accounts.filter(function (a) { return a.id !== 'bondi-media'; });
    sel.innerHTML = '<option value="">— Cliente activo —</option>'
        + clients.map(function (c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('');
}

async function runAutoGenerate() {
    var month = document.getElementById('ag-month')?.value;
    var clientId = document.getElementById('ag-client')?.value || window.currentAccount || 'bondi-media';
    var nReels = parseInt(document.getElementById('ag-reels')?.value || '6');
    var nCar = parseInt(document.getElementById('ag-carousels')?.value || '4');
    var nSto = parseInt(document.getElementById('ag-stories')?.value || '4');
    var topic = document.getElementById('ag-topic')?.value?.trim() || 'contenido estratégico';

    var status = document.getElementById('ag-status');
    status.style.display = 'block';
    status.textContent = '⏳ Generando publicaciones...';

    var account = (window.accounts || []).find(function (a) { return a.id === clientId; }) || {};
    var total = nReels + nCar + nSto;
    var items = [];
    var types = [];

    for (var i = 0; i < nReels; i++)   types.push('reel');
    for (var i = 0; i < nCar; i++)     types.push('carousel');
    for (var i = 0; i < nSto; i++)     types.push('stories');

    // Distribuir fechas en el mes
    var year = parseInt(month.split('-')[0]);
    var mon = parseInt(month.split('-')[1]) - 1;
    var days = new Date(year, mon + 1, 0).getDate();
    var step = Math.floor(days / total);

    types.forEach(function (tipo, idx) {
        var T = CONTENT_TEMPLATES[tipo];
        var day = Math.min(days, 1 + idx * step + Math.floor(Math.random() * 2));
        var date = year + '-' + String(mon + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        var time = tipo === 'stories' ? '12:00' : (idx % 2 === 0 ? '19:00' : '20:00');

        var titleTpl = T.titles[idx % T.titles.length];
        var title = titleTpl
            .replace('{nicho}', account.industry || topic)
            .replace('{tema}', topic)
            .replace('{resultado}', 'mejores resultados')
            .replace('{N}', String(Math.floor(Math.random() * 3) + 3))
            .replace('{Número}', String(Math.floor(Math.random() * 3) + 3))
            .replace('{obstáculo}', 'complicarte')
            .replace('{acción}', 'medir mis métricas')
            .replace('{elemento}', 'contenido')
            .replace('{estrategia}', 'esta estrategia')
            .replace('{área}', topic)
            .replace('{proceso}', topic)
            .replace('{objetivo}', 'mejorar tus resultados');

        var obj = T.objectives[idx % T.objectives.length];

        var produccion = {
            specs: T.specs || '',
            idea: T.idea || '',
            plataformas: {
                instagram: {
                    copy: (T.igCopy || '').replace(/{nicho}/g, account.industry || topic).replace(/{tema}/g, topic),
                    hashtags: T.igHashtags || '',
                    diseño: 'Texto en pantalla visible | Marca de agua Bondi Media',
                },
                facebook: {
                    copy: (T.fbCopy || '').replace(/{tema}/g, topic),
                    hashtags: '#' + topic.split(' ').join(' #'),
                },
                tiktok: {
                    copy: (T.ttCopy || '').replace(/{tema}/g, topic),
                    hashtags: T.ttHashtags || '#parati #fyp',
                    audio: 'Tendencia del momento — verificar en TikTok Creative Center',
                }
            }
        };

        if (tipo === 'reel') {
            produccion.escenas = 5;
            produccion.escaleta = 'ESC1: Hook (4s) — pregunta o afirmación impactante\nESC2: Desarrollo punto 1 (6s)\nESC3: Desarrollo punto 2 (6s)\nESC4: Desarrollo punto 3 (6s)\nESC5: CTA + marca (4s)';
            produccion.guion = 'ESC1: [A CÁMARA] "¿Sabías que ' + topic + '..."\nESC2: [OFF/A CÁMARA] Explicación del primer punto\nESC3: Segundo punto con ejemplo concreto\nESC4: Tercer punto con llamada a la acción\nESC5: "Si te ayudó, compartilo. Para más contenido, seguime."';
            produccion.planos = 'ESC1: Plano medio fijo\nESC2-4: Object POV / Over the shoulder\nESC5: Plano medio + texto superpuesto';
            produccion.copy = produccion.plataformas.instagram.copy;
            produccion.hashtags = produccion.plataformas.instagram.hashtags;
        } else if (tipo === 'carousel') {
            produccion.slides = 'SLIDE 1: ' + title + '\nSLIDE 2: Punto clave 1 — [desarrollar]\nSLIDE 3: Punto clave 2 — [desarrollar]\nSLIDE 4: Punto clave 3 — [desarrollar]\nSLIDE 5: Ejemplo práctico\nSLIDE 6: Resumen + CTA — "Guardalo para después"';
            produccion.copy = produccion.plataformas.instagram.copy;
            produccion.hashtags = produccion.plataformas.instagram.hashtags;
        } else if (tipo === 'stories') {
            produccion.texto = 'Historia 1: [Pregunta o encuesta sobre ' + topic + ']\nHistoria 2: [Contexto o tip rápido]\nHistoria 3: [CTA con sticker de link a WhatsApp o perfil]';
            produccion.stickers = 'Historia 1: Encuesta o Slider\nHistoria 2: Sin sticker\nHistoria 3: Sticker de link';
        }

        items.push({
            id: Date.now() + idx,
            date: date,
            time: time,
            type: tipo,
            title: title,
            objective: obj,
            status: 'not-started',
            hasAds: false,
            adBudget: 0,
            notes: 'Generado automáticamente para ' + month + ' — tema: ' + topic,
            produccion: produccion,
            details: {}
        });
    });

    // Guardar en el calendario
    if (!window.appData) window.appData = { calendar: [] };
    if (!window.appData.calendar) window.appData.calendar = [];
    var existing = window.appData.calendar;
    items.forEach(function (item) { existing.push(item); });
    existing.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

    await storage.set('bondi-calendar-' + (window.currentAccount || 'bondi-media'), existing);

    status.textContent = '✅ ' + total + ' publicaciones creadas para ' + month + ' con todos los campos completados.';
    status.style.background = '#ECFDF5';
    status.style.borderColor = '#A7F3D0';
    status.style.color = '#065F46';

    // Refrescar vistas
    if (typeof refreshCalendarViews === 'function') refreshCalendarViews();

    setTimeout(function () {
        closeAutoGenModal();
        if (typeof showSuccess === 'function') showSuccess(total + ' publicaciones generadas para ' + month);
    }, 1500);
}