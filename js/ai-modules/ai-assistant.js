// ==================================================
// BONDI MEDIA — AI Assistant (Asistente IA)
// js/ai-modules/ai-assistant.js
//
// CORRECCIÓN FASE 1: Los tips personalizados ahora son
// 100% dinámicos basados en métricas reales del cliente.
// Ya no existen valores hardcodeados (20:00hs, Jueves,
// "¿Sabías que...?").
//
// Cada vez que se abre el módulo recalcula:
//   - Mejor horario  → moda del horario de los top 5 posts por alcance
//   - Mejor día      → día de la semana con mayor alcance promedio
//   - Hook sugerido  → primer gancho del post con más alcance
//   - Mejor formato  → tipo con mayor alcance promedio
//   - Retención prom → promedio de los reels con métricas de video
//   - Tendencia      → si el alcance está subiendo o bajando
// ==================================================

console.log('🤖 Cargando Asistente IA (dinámico)...');

// --------------------------------------------------
// ANÁLISIS DE MÉTRICAS REALES
// --------------------------------------------------
function _calcularTips(clientId) {
    var cal = (window.appData && window.appData.calendar) ? window.appData.calendar : [];
    var acc = (window.accounts || []).find(function(a){ return a.id === (clientId || window.currentAccount || 'bondi-media'); });

    // Filtrar solo los del cliente activo con métricas
    var withMetrics = cal.filter(function(c){ return c.metrics; });

    if (!withMetrics.length) {
        return {
            sinDatos: true,
            nombre:   acc ? acc.name : 'este cliente'
        };
    }

    // Función alcance total de un item
    function reach(c) {
        return ((c.metrics.instagram ? c.metrics.instagram.reach  || 0 : 0)
              + (c.metrics.facebook  ? c.metrics.facebook.reach   || 0 : 0)
              + (c.metrics.tiktok    ? c.metrics.tiktok.views     || 0 : 0));
    }

    // Función engagement total
    function eng(c) {
        return ((c.metrics.instagram ? (c.metrics.instagram.likes    || 0) + (c.metrics.instagram.comments || 0) : 0)
              + (c.metrics.facebook  ? (c.metrics.facebook.reactions || 0) + (c.metrics.facebook.comments  || 0) : 0)
              + (c.metrics.tiktok    ? (c.metrics.tiktok.likes       || 0) + (c.metrics.tiktok.comments    || 0) : 0));
    }

    // Ordenar por alcance desc
    var sorted = withMetrics.slice().sort(function(a, b){ return reach(b) - reach(a); });
    var top5   = sorted.slice(0, Math.min(5, sorted.length));

    // ── 1. MEJOR HORARIO ───────────────────────────
    // Moda del horario de los top 5
    var hourCounts = {};
    top5.forEach(function(c) {
        if (!c.time) return;
        var h = c.time.substring(0, 5); // "HH:MM"
        hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    var bestHour = null;
    var bestHourCount = 0;
    Object.keys(hourCounts).forEach(function(h) {
        if (hourCounts[h] > bestHourCount) { bestHour = h; bestHourCount = hourCounts[h]; }
    });
    // Si no hay moda, promedio de horas
    if (!bestHour && top5.length) {
        var sum = 0; var cnt = 0;
        top5.forEach(function(c){ if(c.time){ sum += parseInt(c.time.substring(0,2)); cnt++; } });
        if (cnt) bestHour = String(Math.round(sum/cnt)).padStart(2,'0') + ':00';
    }

    // ── 2. MEJOR DÍA ───────────────────────────────
    // Día de la semana con mayor alcance promedio
    var DIAS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    var dayReach  = {};
    var dayCount  = {};
    withMetrics.forEach(function(c) {
        if (!c.date) return;
        var d = new Date(c.date + 'T12:00:00').getDay(); // evita DST offset
        dayReach[d] = (dayReach[d] || 0) + reach(c);
        dayCount[d] = (dayCount[d] || 0) + 1;
    });
    var bestDay = null; var bestDayAvg = 0;
    Object.keys(dayReach).forEach(function(d) {
        var avg = dayReach[d] / dayCount[d];
        if (avg > bestDayAvg) { bestDayAvg = avg; bestDay = parseInt(d); }
    });
    var bestDayLabel = bestDay !== null ? DIAS[bestDay] : null;

    // ── 3. MEJOR FORMATO ───────────────────────────
    var fmtReach = {}; var fmtCount = {};
    withMetrics.forEach(function(c) {
        var t = c.type || 'reel';
        fmtReach[t] = (fmtReach[t] || 0) + reach(c);
        fmtCount[t] = (fmtCount[t] || 0) + 1;
    });
    var bestFmt = null; var bestFmtAvg = 0;
    Object.keys(fmtReach).forEach(function(t) {
        var avg = fmtReach[t] / fmtCount[t];
        if (avg > bestFmtAvg) { bestFmtAvg = avg; bestFmt = t; }
    });
    var FMT_LABELS = { reel: '🎬 Reel', carousel: '📊 Carrusel', stories: '📲 Stories' };

    // ── 4. HOOK SUGERIDO ───────────────────────────
    // Tomamos el título del post con más alcance y extraemos el patrón
    var topPost    = sorted[0];
    var hookSugerido = null;
    var hookFuente   = null;
    if (topPost) {
        hookFuente = topPost.title;
        // Detectar patrón del título
        var title = topPost.title || '';
        if (/^\d+/.test(title))                    hookSugerido = 'Lista numérica: "' + title.substring(0, 40) + '..."';
        else if (/\?/.test(title))                  hookSugerido = 'Pregunta directa: "' + title.substring(0, 40) + '..."';
        else if (/error|fallo|problema/i.test(title)) hookSugerido = 'Problema/error: "' + title.substring(0, 40) + '..."';
        else if (/cómo|como/i.test(title))          hookSugerido = 'Tutorial: "' + title.substring(0, 40) + '..."';
        else if (/secreto|verdad|nadie/i.test(title)) hookSugerido = 'Revelación: "' + title.substring(0, 40) + '..."';
        else                                         hookSugerido = '"' + title.substring(0, 50) + (title.length > 50 ? '..."' : '"');
    }

    // ── 5. RETENCIÓN PROMEDIO REELS ────────────────
    var reelsConVideo = withMetrics.filter(function(c){ return c.type === 'reel' && c.metrics && c.metrics.videoMetrics && c.metrics.videoMetrics.retentionPercent; });
    var avgRetention  = null;
    if (reelsConVideo.length) {
        avgRetention = Math.round(reelsConVideo.reduce(function(s, c){ return s + c.metrics.videoMetrics.retentionPercent; }, 0) / reelsConVideo.length);
    }

    // ── 6. TENDENCIA ──────────────────────────────
    // Comparar alcance promedio últimos 5 vs anteriores 5
    var tendencia = null;
    if (sorted.length >= 6) {
        var recent = sorted.slice(0, 5).reduce(function(s, c){ return s + reach(c); }, 0) / 5;
        var older  = sorted.slice(5, 10).reduce(function(s, c){ return s + reach(c); }, 0) / Math.min(5, sorted.length - 5);
        if (recent > older * 1.1)       tendencia = { icon: '📈', label: 'Subiendo', color: '#10B981', pct: Math.round((recent/older - 1) * 100) };
        else if (recent < older * 0.9)  tendencia = { icon: '📉', label: 'Bajando',  color: '#EF4444', pct: Math.round((1 - recent/older) * 100) };
        else                            tendencia = { icon: '➡️', label: 'Estable',   color: '#F59E0B', pct: 0 };
    }

    // ── 7. ALCANCE PROMEDIO ────────────────────────
    var avgReach = Math.round(withMetrics.reduce(function(s, c){ return s + reach(c); }, 0) / withMetrics.length);

    // ── 8. ENGAGEMENT RATE PROMEDIO ───────────────
    var avgEngRate = null;
    var engItems = withMetrics.filter(function(c){ return reach(c) > 0; });
    if (engItems.length) {
        var totalEngRate = engItems.reduce(function(s, c){ return s + (eng(c) / reach(c) * 100); }, 0);
        avgEngRate = (totalEngRate / engItems.length).toFixed(1);
    }

    return {
        sinDatos:       false,
        nombre:         acc ? acc.name : 'este cliente',
        totalMedidos:   withMetrics.length,
        bestHour:       bestHour,
        bestDay:        bestDayLabel,
        bestFmt:        bestFmt ? (FMT_LABELS[bestFmt] || bestFmt) : null,
        bestFmtAvg:     Math.round(bestFmtAvg),
        hookSugerido:   hookSugerido,
        hookFuente:     hookFuente,
        avgRetention:   avgRetention,
        tendencia:      tendencia,
        avgReach:       avgReach,
        avgEngRate:     avgEngRate,
        topPost:        topPost ? { title: topPost.title, reach: reach(topPost) } : null,
        top5:           top5
    };
}

// --------------------------------------------------
// RENDER DE TIPS — tarjetas dinámicas
// --------------------------------------------------
function _renderTips(tips, container) {
    if (!container) return;

    if (tips.sinDatos) {
        container.innerHTML = '<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:18px;font-size:13px;color:#92400E;text-align:center;">'
            + '<div style="font-size:28px;margin-bottom:8px;">📊</div>'
            + '<strong>' + tips.nombre + ' aún no tiene publicaciones con métricas.</strong><br>'
            + '<span style="font-size:12px;color:#B45309;margin-top:4px;display:block;">Agregá métricas a las publicaciones publicadas para ver los tips personalizados.</span>'
            + '</div>';
        return;
    }

    var html = '';

    // Fila 1: los tres KPIs principales
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;">';

    // Mejor horario
    html += '<div style="background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border:1px solid #A7F3D0;padding:16px;border-radius:12px;">'
        + '<div style="font-size:11px;font-weight:700;color:#065F46;letter-spacing:.5px;margin-bottom:8px;">⏰ MEJOR HORARIO</div>'
        + '<div style="font-size:26px;font-weight:800;color:#047857;">' + (tips.bestHour || '—') + 'hs</div>'
        + '<div style="font-size:11px;color:#6EE7B7;margin-top:4px;">Basado en top ' + Math.min(5, tips.totalMedidos) + ' posts</div>'
        + '</div>';

    // Mejor día
    html += '<div style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:1px solid #BFDBFE;padding:16px;border-radius:12px;">'
        + '<div style="font-size:11px;font-weight:700;color:#1E40AF;letter-spacing:.5px;margin-bottom:8px;">📅 MEJOR DÍA</div>'
        + '<div style="font-size:26px;font-weight:800;color:#1D4ED8;">' + (tips.bestDay || '—') + '</div>'
        + '<div style="font-size:11px;color:#93C5FD;margin-top:4px;">Mayor alcance promedio</div>'
        + '</div>';

    // Mejor formato
    html += '<div style="background:linear-gradient(135deg,#FFF7ED,#FFEDD5);border:1px solid #FED7AA;padding:16px;border-radius:12px;">'
        + '<div style="font-size:11px;font-weight:700;color:#C2410C;letter-spacing:.5px;margin-bottom:8px;">🏆 MEJOR FORMATO</div>'
        + '<div style="font-size:20px;font-weight:800;color:#EA580C;">' + (tips.bestFmt || '—') + '</div>'
        + (tips.bestFmtAvg ? '<div style="font-size:11px;color:#FB923C;margin-top:4px;">~' + tips.bestFmtAvg.toLocaleString() + ' alcance prom.</div>' : '')
        + '</div>';

    html += '</div>';

    // Fila 2: Hook sugerido + Retención
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';

    // Hook sugerido
    html += '<div style="background:linear-gradient(135deg,#F5F3FF,#EDE9FE);border:1px solid #C4B5FD;padding:16px;border-radius:12px;">'
        + '<div style="font-size:11px;font-weight:700;color:#5B21B6;letter-spacing:.5px;margin-bottom:8px;">🎯 HOOK MÁS EFECTIVO</div>'
        + '<div style="font-size:13px;font-weight:600;color:#4C1D95;line-height:1.5;">' + (tips.hookSugerido || '—') + '</div>'
        + (tips.hookFuente ? '<div style="font-size:10px;color:#A78BFA;margin-top:6px;font-style:italic;">De: "' + tips.hookFuente.substring(0, 35) + (tips.hookFuente.length > 35 ? '..."' : '"') + '</div>' : '')
        + '</div>';

    // Retención + Tendencia
    var retBlock = '';
    if (tips.avgRetention !== null) {
        var retColor = tips.avgRetention >= 60 ? '#10B981' : tips.avgRetention >= 40 ? '#F59E0B' : '#EF4444';
        var retBg    = tips.avgRetention >= 60 ? '#ECFDF5' : tips.avgRetention >= 40 ? '#FFFBEB' : '#FEF2F2';
        var retBorder= tips.avgRetention >= 60 ? '#A7F3D0' : tips.avgRetention >= 40 ? '#FDE68A' : '#FECACA';
        retBlock = '<div style="background:linear-gradient(135deg,' + retBg + ',' + retBg + ');border:1px solid ' + retBorder + ';padding:16px;border-radius:12px;">'
            + '<div style="font-size:11px;font-weight:700;color:' + retColor + ';letter-spacing:.5px;margin-bottom:8px;">🎬 RETENCIÓN PROMEDIO</div>'
            + '<div style="font-size:26px;font-weight:800;color:' + retColor + ';">' + tips.avgRetention + '%</div>'
            + (tips.tendencia ? '<div style="font-size:12px;color:' + tips.tendencia.color + ';margin-top:4px;">' + tips.tendencia.icon + ' ' + tips.tendencia.label + (tips.tendencia.pct ? ' ' + tips.tendencia.pct + '%' : '') + '</div>' : '')
            + '</div>';
    } else if (tips.tendencia) {
        retBlock = '<div style="background:#F9FAFB;border:1px solid #E5E7EB;padding:16px;border-radius:12px;">'
            + '<div style="font-size:11px;font-weight:700;color:#374151;letter-spacing:.5px;margin-bottom:8px;">📈 TENDENCIA</div>'
            + '<div style="font-size:22px;font-weight:800;color:' + tips.tendencia.color + ';">' + tips.tendencia.icon + ' ' + tips.tendencia.label + '</div>'
            + (tips.tendencia.pct ? '<div style="font-size:12px;color:' + tips.tendencia.color + ';margin-top:4px;">' + tips.tendencia.pct + '% vs período anterior</div>' : '')
            + '</div>';
    } else {
        retBlock = '<div style="background:#F9FAFB;border:1px solid #E5E7EB;padding:16px;border-radius:12px;">'
            + '<div style="font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:.5px;margin-bottom:8px;">🎬 RETENCIÓN</div>'
            + '<div style="font-size:13px;color:#9CA3AF;">Sin datos de video aún</div>'
            + '</div>';
    }
    html += retBlock;
    html += '</div>';

    // Fila 3: Alcance promedio + Engagement rate + Total medido
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">';
    html += '<div style="background:#F8FAFC;border:1px solid #E5E7EB;padding:14px;border-radius:10px;text-align:center;">'
        + '<div style="font-size:10px;font-weight:700;color:#6B7280;letter-spacing:.5px;margin-bottom:6px;">👁️ ALCANCE PROMEDIO</div>'
        + '<div style="font-size:22px;font-weight:700;color:#111827;">' + tips.avgReach.toLocaleString() + '</div>'
        + '</div>';
    html += '<div style="background:#F8FAFC;border:1px solid #E5E7EB;padding:14px;border-radius:10px;text-align:center;">'
        + '<div style="font-size:10px;font-weight:700;color:#6B7280;letter-spacing:.5px;margin-bottom:6px;">💬 ENGAGEMENT RATE</div>'
        + '<div style="font-size:22px;font-weight:700;color:#111827;">' + (tips.avgEngRate !== null ? tips.avgEngRate + '%' : '—') + '</div>'
        + '</div>';
    html += '<div style="background:#F8FAFC;border:1px solid #E5E7EB;padding:14px;border-radius:10px;text-align:center;">'
        + '<div style="font-size:10px;font-weight:700;color:#6B7280;letter-spacing:.5px;margin-bottom:6px;">📋 POSTS MEDIDOS</div>'
        + '<div style="font-size:22px;font-weight:700;color:#111827;">' + tips.totalMedidos + '</div>'
        + '</div>';
    html += '</div>';

    // Nota de precisión
    html += '<div style="margin-top:12px;font-size:11px;color:#9CA3AF;text-align:center;">'
        + 'Calculado en tiempo real con ' + tips.totalMedidos + ' publicación' + (tips.totalMedidos !== 1 ? 'es' : '') + ' medida' + (tips.totalMedidos !== 1 ? 's' : '') + ' de <strong>' + tips.nombre + '</strong>. '
        + 'Los tips se actualizan automáticamente al agregar nuevas métricas.'
        + '</div>';

    container.innerHTML = html;
}

// --------------------------------------------------
// MÓDULO PRINCIPAL — initAIAssistant
// --------------------------------------------------
window.initAIAssistant = function(container) {
    if (!container) return;

    var clientId = window.currentAccount || 'bondi-media';

    container.innerHTML = '<div style="padding:24px;font-family:Inter,sans-serif;">'

        // Header
        + '<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:24px 28px;border-radius:14px;color:#fff;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">'
        + '<div><h2 style="font-size:22px;font-weight:700;margin:0 0 4px;">🤖 Asistente IA</h2>'
        + '<p style="opacity:.85;font-size:13px;margin:0;">Insights y contenido basados en tus datos reales</p></div>'
        + '<button id="ai-refresh-tips" onclick="window._refreshAITips()" style="background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:#fff;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:background .15s;" onmouseover="this.style.background=\'rgba(255,255,255,.25)\'" onmouseout="this.style.background=\'rgba(255,255,255,.15)\'">'
        + '🔄 Actualizar datos</button>'
        + '</div>'

        // Tips personalizados
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;margin-bottom:20px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">'
        + '<h3 style="font-size:15px;font-weight:700;color:#111827;margin:0;">💡 Tips personalizados</h3>'
        + '<span id="ai-tips-account" style="font-size:11px;background:#F3F4F6;color:#6B7280;padding:3px 10px;border-radius:20px;font-weight:600;"></span>'
        + '</div>'
        + '<div id="ai-tips-container"><!-- dinámico --></div>'
        + '</div>'

        // Hitos — base de conocimiento
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;margin-bottom:20px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
        + '<h3 style="font-size:15px;font-weight:700;color:#111827;margin:0;">📚 Base de conocimiento — Hitos</h3>'
        + '<button onclick="window.renderHitosPanel(\'ai-hitos-container\')" style="font-size:11px;padding:5px 12px;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:7px;cursor:pointer;color:#374151;font-weight:600;">🔄 Actualizar</button>'
        + '</div>'
        + '<p style="font-size:12px;color:#6B7280;margin:0 0 14px;">Los hitos virales y de bajo rendimiento alimentan la IA para mejorar cada generación de contenido.</p>'
        + '<div id="ai-hitos-container"><!-- dinámico --></div>'
        + '</div>'

        // Generador de copy
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;margin-bottom:20px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">'
        + '<h3 style="font-size:15px;font-weight:700;color:#111827;margin:0;">✍️ Generador de copy + hashtags</h3>'
        + '<span style="font-size:11px;color:#9CA3AF;">Genera para las 3 plataformas al mismo tiempo</span>'
        + '</div>'

        // Inputs
        + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;letter-spacing:.5px;">TEMA / IDEA</label>'
        + '<input type="text" id="ai-topic" class="form-input" placeholder="Ej: diseño web que convierte..." style="width:100%;"></div>'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;letter-spacing:.5px;">TIPO</label>'
        + '<select id="ai-type" class="form-select" style="width:100%;">'
        + '<option value="reel">🎬 Reel</option>'
        + '<option value="carousel">📊 Carrusel</option>'
        + '<option value="stories">📲 Stories</option>'
        + '</select></div>'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;letter-spacing:.5px;">PALABRA CTA</label>'
        + '<input type="text" id="ai-cta" class="form-input" value="INFO" placeholder="INFO, CONSULTA..." style="width:100%;"></div>'
        + '</div>'
        + '<button onclick="window._generarCopyAsistente()" style="width:100%;padding:10px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:8px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:16px;">✨ Generar copy + hashtags para todas las plataformas</button>'

        // Resultados por plataforma
        + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">'

        // Instagram
        + '<div style="background:#FFF0F3;border:1px solid #FECDD3;border-radius:12px;padding:14px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
        + '<span style="font-size:13px;font-weight:700;color:#E4405F;">📸 Instagram</span>'
        + '<button onclick="window._copiarPlataforma(\'ig\')" style="font-size:10px;padding:3px 8px;background:#fff;border:1px solid #FECDD3;border-radius:6px;cursor:pointer;color:#E4405F;font-weight:600;">📋 Copiar</button>'
        + '</div>'
        + '<div id="ai-result-ig" style="font-size:12px;line-height:1.7;color:#374151;white-space:pre-wrap;min-height:120px;">—</div>'
        + '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #FECDD3;">'
        + '<div style="font-size:10px;font-weight:700;color:#E4405F;margin-bottom:4px;">HASHTAGS</div>'
        + '<div id="ai-hash-ig" style="font-size:11px;color:#6B7280;line-height:1.6;">—</div>'
        + '</div>'
        + '</div>'

        // Facebook
        + '<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:14px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
        + '<span style="font-size:13px;font-weight:700;color:#1877F2;">📘 Facebook</span>'
        + '<button onclick="window._copiarPlataforma(\'fb\')" style="font-size:10px;padding:3px 8px;background:#fff;border:1px solid #BFDBFE;border-radius:6px;cursor:pointer;color:#1877F2;font-weight:600;">📋 Copiar</button>'
        + '</div>'
        + '<div id="ai-result-fb" style="font-size:12px;line-height:1.7;color:#374151;white-space:pre-wrap;min-height:120px;">—</div>'
        + '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #BFDBFE;">'
        + '<div style="font-size:10px;font-weight:700;color:#1877F2;margin-bottom:4px;">HASHTAGS</div>'
        + '<div id="ai-hash-fb" style="font-size:11px;color:#6B7280;line-height:1.6;">—</div>'
        + '</div>'
        + '</div>'

        // TikTok
        + '<div style="background:#F0FFF4;border:1px solid #A7F3D0;border-radius:12px;padding:14px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
        + '<span style="font-size:13px;font-weight:700;color:#065F46;">🎵 TikTok</span>'
        + '<button onclick="window._copiarPlataforma(\'tt\')" style="font-size:10px;padding:3px 8px;background:#fff;border:1px solid #A7F3D0;border-radius:6px;cursor:pointer;color:#065F46;font-weight:600;">📋 Copiar</button>'
        + '</div>'
        + '<div id="ai-result-tt" style="font-size:12px;line-height:1.7;color:#374151;white-space:pre-wrap;min-height:120px;">—</div>'
        + '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #A7F3D0;">'
        + '<div style="font-size:10px;font-weight:700;color:#065F46;margin-bottom:4px;">HASHTAGS</div>'
        + '<div id="ai-hash-tt" style="font-size:11px;color:#6B7280;line-height:1.6;">—</div>'
        + '</div>'
        + '</div>'

        + '</div>' // grid plataformas

        + '<div style="margin-top:10px;display:flex;gap:8px;">'
        + '<button onclick="window._usarEnModal()" style="flex:1;padding:8px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;color:#C2410C;">📝 Usar copy IG en modal abierto</button>'
        + '</div>'
        + '</div>'

        + '</div>';

    // Render inicial de tips
    _refreshTipsUI(clientId);

    // Render inicial de hitos
    if (typeof window.renderHitosPanel === 'function') {
        setTimeout(function () { window.renderHitosPanel('ai-hitos-container'); }, 50);
    }
};

// --------------------------------------------------
// ACTUALIZAR TIPS (llamado por botón y al cambiar cuenta)
// --------------------------------------------------
window._refreshAITips = function() {
    var clientId = window.currentAccount || 'bondi-media';
    var btn = document.getElementById('ai-refresh-tips');
    if (btn) { btn.textContent = '⏳ Calculando...'; btn.disabled = true; }
    setTimeout(function() {
        _refreshTipsUI(clientId);
        if (btn) { btn.textContent = '🔄 Actualizar datos'; btn.disabled = false; }
    }, 300);
};

function _refreshTipsUI(clientId) {
    var cont  = document.getElementById('ai-tips-container');
    var badge = document.getElementById('ai-tips-account');
    if (!cont) return;

    var acc = (window.accounts || []).find(function(a){ return a.id === clientId; });
    if (badge) badge.textContent = acc ? acc.name : 'Bondi Media';

    var tips = _calcularTips(clientId);
    _renderTips(tips, cont);
}

// --------------------------------------------------
// BANCO DE HOOKS — variados y humanizados por tipo
// --------------------------------------------------
var _HOOKS = {
    reel: [
        function(t){ return 'Nadie habla de esto en ' + t + ' y era lo que necesitaba saber.'; },
        function(t){ return 'Si estás en ' + t + ' y esto no lo sabés, estás perdiendo tiempo.'; },
        function(t){ return 'Le pregunté a 10 expertos en ' + t + '. Todos dijeron lo mismo.'; },
        function(t){ return 'Esto cambió todo en mi estrategia de ' + t + '. Y nadie lo enseña.'; },
        function(t){ return '¿Por qué el 90% fracasa con ' + t + '? Te lo explico en 30 segundos.'; },
        function(t){ return 'El error que comete todo el mundo al arrancar con ' + t + '.'; },
        function(t){ return 'Dejé de hacer esto en ' + t + ' y los resultados se triplicaron.'; },
        function(t){ return 'Esto es lo que distingue a los que triunfan en ' + t + ' de los que no.'; },
        function(t){ return 'Años perdidos por no saber esto sobre ' + t + '. No cometas el mismo error.'; },
        function(t){ return '¿Querés resultados reales con ' + t + '? Primero necesitás saber esto.'; },
        function(t){ return 'La trampa más común de ' + t + ' que casi nadie detecta a tiempo.'; },
        function(t){ return 'Esto sobre ' + t + ' lo aprendí a los golpes. Vos no tenés que hacerlo igual.'; },
    ],
    carousel: [
        function(t){ return 'Guardá esto porque lo vas a necesitar: ' + t + ' explicado sin rodeos.'; },
        function(t){ return 'Todo lo que sé sobre ' + t + ' en un solo post. No hay excusa para no empezar.'; },
        function(t){ return 'El camino más corto para dominar ' + t + '. Paso a paso, sin perderte nada.'; },
        function(t){ return 'Las ' + (Math.floor(Math.random()*3)+4) + ' cosas que ojalá hubiera sabido antes sobre ' + t + '.'; },
        function(t){ return 'Por qué ' + t + ' es más simple de lo que parece (si sabés por dónde empezar).'; },
        function(t){ return 'La guía definitiva de ' + t + ' que nadie se molestó en hacer bien hasta ahora.'; },
        function(t){ return 'Esto sobre ' + t + ' lo explico en slides porque en un solo texto no alcanza.'; },
        function(t){ return 'Si en algún momento te trabaste con ' + t + ', este carrusel es para vos.'; },
        function(t){ return 'Paso a paso: cómo implementar ' + t + ' sin morir en el intento.'; },
    ],
    stories: [
        function(t){ return '¿Sabés realmente cómo funciona ' + t + '? Te sorprenderías.'; },
        function(t){ return 'Rápido: ¿Qué sabés de ' + t + '? (Y lo que no sabés te puede costar caro).'; },
        function(t){ return 'Una pregunta sobre ' + t + ' que muy poca gente se hace.'; },
        function(t){ return 'Esto de ' + t + ' me lo preguntan todo el tiempo. Hoy te respondo.'; },
        function(t){ return 'Dato que pocos conocen sobre ' + t + '. ¿Lo sabías?'; },
        function(t){ return 'Si usás ' + t + ' esto te va a interesar más de lo que pensás.'; },
    ]
};

var _CUERPOS = {
    reel: [
        function(t, c) { return 'Tres cosas que podés implementar hoy mismo:\n\n① El primero que todos ignoran — [desarrollar con ' + t + ']\n② Lo que hacen diferente los que ya lograron resultados\n③ El detalle que parece menor pero lo cambia todo\n\n¿Te suena familiar alguno de estos errores? Contame en los comentarios 👇\n\n' + c; },
        function(t, c) { return 'Voy a ser directo:\n\nHay una razón por la que la mayoría no avanza con ' + t + '.\nY no es falta de talento. Es falta de sistema.\n\nEn este reel te muestro exactamente qué hacer, en qué orden y por qué funciona.\n\n' + c; },
        function(t, c) { return 'No te voy a vender nada.\nSolo te voy a mostrar cómo lo hacemos nosotros con ' + t + '.\n\nSi lo aplicás, los resultados llegan solos.\n\n🔁 Compartilo con quien lo necesite.\n\n' + c; },
        function(t, c) { return 'Esto lo hacen los que realmente entienden ' + t + ':\n\n→ No improvisan\n→ Tienen un proceso claro\n→ Miden, ajustan, escalan\n\nEl problema es que nadie te enseña el proceso. Hasta hoy.\n\n' + c; },
        function(t, c) { return 'La verdad incómoda de ' + t + ':\n\nNo es que sea difícil.\nEs que la mayoría lo está haciendo al revés.\n\nTe muestro la forma correcta en este reel.\n\n💬 Contame qué te pareció.\n\n' + c; },
        function(t, c) { return 'Me costó [tiempo] aprender esto sobre ' + t + '.\n\nVos lo vas a aprender en 30 segundos.\n\n¿Lo aplicabas así? Contame en los comentarios 👇\n\n' + c; },
    ],
    carousel: [
        function(t, c) { return 'Deslizá hasta el final — el slide más importante es el último.\n\n' + t + ' no es complicado cuando tenés el mapa correcto.\n\nGuardalo 📌 para tenerlo siempre a mano.\n\n¿Con cuál punto te quedás? Comentame abajo 👇\n\n' + c; },
        function(t, c) { return 'Este carrusel me llevó semanas de prueba y error resumir.\n\nTodo sobre ' + t + ' en slides que podés leer en 2 minutos.\n\n💾 Guardalo antes de que te olvides.\n\n' + c; },
        function(t, c) { return 'Antes de hacer cualquier cosa con ' + t + ', leé esto.\n\nSon los ' + (Math.floor(Math.random()*3)+4) + ' conceptos que separan a los que avanzan de los que dan vueltas.\n\n¿Falta alguno? Agregalo en los comentarios.\n\n' + c; },
        function(t, c) { return 'Lo que nadie te cuenta sobre ' + t + ' (porque no es negocio que lo sepas).\n\nDeslizá → cada slide vale oro.\n\n¿Cuál fue el más útil para vos? Decime en comentarios.\n\n' + c; },
        function(t, c) { return 'Guardá este post. En serio.\n\nDentro de unos meses vas a recordar este momento cuando arrancastes a aplicar ' + t + ' correctamente.\n\n¿Empezamos?\n\n' + c; },
    ],
    stories: [
        function(t, c) { return 'Historia 1: [Encuesta] ¿Ya trabajaste con ' + t + '?\n✅ Sí / ❌ Todavía no\n\nHistoria 2: [Texto] Lo que aprendí después de meses metido en ' + t + '. Y lo que cambiaría si empezara de cero.\n\nHistoria 3: [Link/DM] ¿Querés que lo analicemos juntos?\n' + c; },
        function(t, c) { return 'Historia 1: [Slider] ¿Qué tanto sabés de ' + t + '? 🤔\n\nHistoria 2: [Texto] Dato rápido: el 80% lo hace al revés. Así es como debería hacerse.\n\nHistoria 3: [Pregunta] ¿Cuál es tu mayor duda sobre ' + t + '?\n' + c; },
        function(t, c) { return 'Historia 1: [Quiz] ¿Cuál es el error más común en ' + t + '?\nA) No tener estrategia / B) No medir resultados\n\nHistoria 2: [Texto] La respuesta correcta (y por qué importa).\n\nHistoria 3: [DM] Si querés profundizar en ' + t + ', escribime.\n' + c; },
        function(t, c) { return 'Historia 1: [Texto] Un dato sobre ' + t + ' que cambia todo: [dato impactante]\n\nHistoria 2: [Votación] ¿Lo sabías? ✅ Sí / 🤔 Ahora lo sé\n\nHistoria 3: [Link/DM] Más sobre ' + t + ' en el perfil.\n' + c; },
    ]
};

// --------------------------------------------------
// HASHTAGS — pools dinámicos por nicho inferido del tema
// --------------------------------------------------
var _HASH_POOLS = {
    general_ig: ['#estrategiadigital','#contenidodigital','#marketingdecontenidos','#agenciadigital',
                 '#branding','#redessociales','#emprendimiento','#crecimientodigital','#instagram2026',
                 '#marketingargentina','#negociosonline','#posicionamiento','#identidaddemarca',
                 '#agenciamarketing','#crecimiento','#copywriting','#socialmediamanager','#marketingtips'],
    general_fb: ['#negocios','#emprendedores','#marketingdigital','#ventas','#crecimientonegocio'],
    general_tt: ['#parati','#fyp','#aprendeentiktok','#consejos','#estrategia','#emprendedor','#marketing'],
    diseño:     ['#diseñoweb','#ux','#diseñografico','#landingpage','#webdesign','#ui'],
    branding:   ['#branding','#identidaddemarca','#brandingargentina','#marcapersonal','#logo'],
    marketing:  ['#marketingdigital','#socialmedia','#contentmarketing','#inbound','#growth'],
    ventas:     ['#ventas','#salesfunnel','#conversion','#cerrarventas','#captacion'],
    redes:      ['#redessociales','#instagram','#tiktok','#facebook','#contenido'],
};

function _cleanWords(text) {
    return (text || '').toLowerCase()
        .replace(/[^a-záéíóúñü\s]/gi, ' ')
        .split(/\s+/)
        .filter(function (w) {
            return w.length > 2 && !/^(de|la|el|y|en|con|para|por|que|como|a|o|los|las|una|un|es|al|del|su|se|este|esta|sus|más|mas|para|con|sobre|entre|desde|contra|sin|muy|ya)$/.test(w);
        });
}

function _unique(arr) {
    return arr.filter(function (item, idx) { return arr.indexOf(item) === idx; });
}

function _hashForTopic(topic, plat) {
    var words = _unique(_cleanWords(topic));
    var specific = [];
    var t = topic.toLowerCase();
    if (/diseño|web|ux|landing|sitio/.test(t))        specific = _HASH_POOLS.diseño;
    else if (/brand|marca|identidad|logo/.test(t))    specific = _HASH_POOLS.branding;
    else if (/market|publicidad|ads|paid/.test(t))    specific = _HASH_POOLS.marketing;
    else if (/venta|convers|client|lead/.test(t))     specific = _HASH_POOLS.ventas;
    else if (/redes|social|instagram|tiktok/.test(t)) specific = _HASH_POOLS.redes;

    var topicTags = words.slice(0, 4).map(function(w){ return '#' + w.replace(/[^a-záéíóúñü]/gi,''); });
    function shuffle(arr){ return arr.slice().sort(function(){ return Math.random()-.5; }); }

    if (plat === 'ig') {
        var pool = shuffle(_HASH_POOLS.general_ig).slice(0, 4);
        var spec = specific.length ? shuffle(specific).slice(0, 3) : [];
        return topicTags.concat(spec).concat(pool).slice(0, 12).join(' ');
    }
    if (plat === 'fb') {
        var pool = shuffle(_HASH_POOLS.general_fb).slice(0, 2);
        var spec = specific.length ? shuffle(specific).slice(0, 1) : [];
        return topicTags.slice(0, 2).concat(spec).concat(pool).slice(0, 5).join(' ');
    }
    var pool = shuffle(_HASH_POOLS.general_tt).slice(0, 3);
    var spec = specific.length ? shuffle(specific).slice(0, 2) : [];
    return topicTags.slice(0, 3).concat(pool).concat(spec).slice(0, 8).join(' ');
}

var _HASHTAGS = {
    ig: function(t){ return _hashForTopic(t, 'ig'); },
    fb: function(t){ return _hashForTopic(t, 'fb'); },
    tt: function(t){ return _hashForTopic(t, 'tt'); }
};

function _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

window._extractContentTopic = function() {
    var topic = (document.getElementById('ai-topic')?.value || '').trim();
    if (topic) return topic;

    var title = (document.getElementById('edit-title')?.value || document.getElementById('new-title')?.value || '').trim();
    var objective = (document.getElementById('edit-objective')?.value || document.getElementById('new-objective')?.value || '').trim();
    var idea = (document.getElementById('edit-reel-idea')?.value || document.getElementById('new-reel-idea')?.value || document.getElementById('edit-carousel-idea')?.value || document.getElementById('new-carousel-idea')?.value || '').trim();
    var notes = (document.getElementById('edit-notes')?.value || document.getElementById('new-notes')?.value || '').trim();

    if (title && objective) return title + ' — ' + objective;
    if (title && idea) return title + ' — ' + idea;
    if (title) return title;
    if (objective) return objective;
    if (idea) return idea;
    if (notes) return notes.split('\n').slice(0, 2).join(' ');
    return '';
};

window._generarCopyAsistente = function() {
    var topic = window._extractContentTopic();
    if (!topic) {
        if (typeof showInfo === 'function') showInfo('Ingresá un tema o abrí el contenido para usar su título.');
        return;
    }
    var tipo = document.getElementById('ai-type')?.value || 'reel';
    var cta  = (document.getElementById('ai-cta')?.value || '').trim() || 'INFO';
    var ctaLine = '👉 Escribí ' + cta + ' en comentarios o por DM y te ayudo.';

    var tips      = _calcularTips(window.currentAccount || 'bondi-media');
    var hookBank  = _HOOKS[tipo]  || _HOOKS.reel;
    var bodyBank  = _CUERPOS[tipo] || _CUERPOS.reel;

    var hook = _pick(hookBank)(topic);
    var body = _pick(bodyBank)(topic, ctaLine);

    // IG — copy completo
    var igCopy = hook + '\n\n' + body;
    if (!tips.sinDatos && tips.bestHour && tips.bestDay) {
        igCopy += '\n\n📌 Pro-tip: publicá los ' + tips.bestDay + ' a las ' + tips.bestHour + 'hs — es cuando tu audiencia está más activa según tus métricas reales.';
    }

    // FB — tono más narrativo, sin exceso de hashtags
    var fbHooks = [
        'Quería compartir algo que me parece importante sobre ' + topic + '.',
        'Después de trabajar mucho tiempo con ' + topic + ', llegué a una conclusión.',
        'Hoy quiero hablarte con honestidad sobre ' + topic + '.',
    ];
    var fbCopy = _pick(fbHooks) + '\n\n'
        + body.replace('👉 Escribí ' + cta + ' en comentarios o por DM y te ayudo.', '')
        + '\n¿Cuál fue tu experiencia con este tema? Contame en los comentarios, me interesa saber. 👇\n\n'
        + ctaLine;

    // TikTok — ultra corto, gancho en primera línea
    var ttHooks = [
        topic + ': lo que nadie te dice 👀',
        '¿Sabías esto de ' + topic + '? 🤯',
        'El error más común en ' + topic + ' (y cómo evitarlo) ⚠️',
        topic + ' explicado en 30 segundos ⏱️',
    ];
    var ttCopy = _pick(ttHooks) + '\n\nSi esto te sirve, guardalo y compartilo con alguien que lo necesite.\n\n' + ctaLine;

    // Actualizar DOM
    var set = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
    set('ai-result-ig', igCopy);
    set('ai-result-fb', fbCopy);
    set('ai-result-tt', ttCopy);
    set('ai-hash-ig', _HASHTAGS.ig(topic));
    set('ai-hash-fb', _HASHTAGS.fb(topic));
    set('ai-hash-tt', _HASHTAGS.tt(topic));

    // Guardar última generación para "Usar en modal"
    window._lastGeneratedCopy = { ig: igCopy, fb: fbCopy, tt: ttCopy };
};

window._copiarPlataforma = function(plat) {
    var copy    = (document.getElementById('ai-result-' + plat)?.innerText || '').trim();
    var hashtags= (document.getElementById('ai-hash-' + plat)?.innerText  || '').trim();
    if (!copy || copy === '—') { if (typeof showInfo === 'function') showInfo('Primero generá el copy.'); return; }
    navigator.clipboard.writeText(copy + '\n\n' + hashtags).then(function() {
        if (typeof showSuccess === 'function') showSuccess('Copy + hashtags de ' + plat.toUpperCase() + ' copiados al portapapeles');
    });
};

window._usarEnModal = function() {
    var copy = window._lastGeneratedCopy ? window._lastGeneratedCopy.ig
             : (document.getElementById('ai-result-ig')?.innerText || '').trim();
    if (!copy || copy === '—') { if (typeof showInfo === 'function') showInfo('Primero generá el copy.'); return; }
    var targets = ['new-reel-ig-copy', 'new-carousel-ig-copy', 'new-stories-ig-copy'];
    var found = false;
    targets.forEach(function(id) {
        var el = document.getElementById(id);
        if (el && el.offsetParent !== null) { el.value = copy; found = true; }
    });
    if (found) { if (typeof showSuccess === 'function') showSuccess('Copy de Instagram pegado en el modal'); }
    else { if (typeof showInfo === 'function') showInfo('Abrí primero un modal de contenido para pegar el copy.'); }
};

// Escuchar cambios de cuenta para actualizar tips automáticamente
document.addEventListener('DOMContentLoaded', function() {
    var origSwitch = window.switchAccount;
    if (typeof origSwitch === 'function') {
        window.switchAccount = async function(accountId) {
            var result = await origSwitch(accountId);
            // Si el asistente está visible, refrescar
            setTimeout(function() {
                if (document.getElementById('ai-tips-container')) {
                    _refreshTipsUI(window.currentAccount || 'bondi-media');
                }
            }, 600);
            return result;
        };
    }
});

console.log('✅ Asistente IA (dinámico) cargado correctamente');