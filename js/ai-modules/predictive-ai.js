// ==================================================
// PREDICTIVE AI - FASE 1: PREDICCIONES REALES + CLAUDE
// ==================================================

console.log('Cargando Analisis Predictivo...');

window.initPredictiveAI = function(container) {
    console.log('Ejecutando Predictivo...');

    container.innerHTML = [
        '<div style="padding:30px;">',
        '<style>.pred-card{background:white;border-radius:12px;padding:20px;border:1px solid #e5e7eb;margin-bottom:16px;}</style>',

        '<div style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);padding:30px;border-radius:12px;color:white;margin-bottom:24px;">',
        '<h2 style="font-size:26px;margin-bottom:8px;">Analisis Predictivo</h2>',
        '<p style="opacity:.9;font-size:14px;">Predicciones basadas en tu historial real de contenido</p>',
        '</div>',

        '<div id="pred-stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:20px;"></div>',

        '<div class="pred-card">',
        '<h3 style="margin-bottom:14px;font-size:16px;">Calculadora de prediccion</h3>',
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">',
        '<div><label style="font-size:13px;color:#6b7280;">Tipo de contenido</label>',
        '<select id="pred-tipo" class="form-select" style="width:100%;margin-top:4px;font-size:13px;">',
        '<option value="reel">Reel</option>',
        '<option value="carousel">Carrusel</option>',
        '<option value="stories">Stories</option>',
        '</select></div>',
        '<div><label style="font-size:13px;color:#6b7280;">Horario</label>',
        '<select id="pred-hora" class="form-select" style="width:100%;margin-top:4px;font-size:13px;">',
        '<option value="9">09:00</option>',
        '<option value="12">12:00</option>',
        '<option value="18">18:00</option>',
        '<option value="20" selected>20:00</option>',
        '<option value="21">21:00</option>',
        '</select></div>',
        '</div>',
        '<button class="btn-primary" style="display:block;margin:0 auto 14px;min-width:220px;text-align:center;" onclick="calcularPrediccion()">Calcular predicción</button>',
        '<div id="pred-result"></div>',
        '</div>',

        '<div class="pred-card">',
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">',
        '<h3 style="font-size:16px;margin:0;">Insight de IA</h3>',
        '<button onclick="generarInsightIA()" style="font-size:12px;padding:6px 14px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:white;border:none;border-radius:8px;cursor:pointer;">Generar insight</button>',
        '</div>',
        '<div id="pred-ia-insight" style="font-size:13px;color:#6b7280;font-style:italic;">Hace clic en Generar insight para obtener un analisis en lenguaje natural de tus datos.</div>',
        '</div>',

        '</div>'
    ].join('');

    renderPredStats();
};

// --------------------------------------------------
// CALCULAR ESTADISTICAS REALES
// --------------------------------------------------
function getPredData() {
    var cal = (window.appData && window.appData.calendar) ? window.appData.calendar : [];
    var withMetrics = cal.filter(function(c) { return c.metrics; });

    var byType = { reel: [], carousel: [], stories: [] };
    withMetrics.forEach(function(c) {
        var reach = (c.metrics.instagram ? (c.metrics.instagram.reach || 0) : 0)
                  + (c.metrics.facebook  ? (c.metrics.facebook.reach  || 0) : 0);
        var t = c.type || 'reel';
        if (!byType[t]) byType[t] = [];
        byType[t].push(reach);
    });

    function avg(arr) { return arr.length ? Math.round(arr.reduce(function(a, b) { return a + b; }, 0) / arr.length) : 0; }
    function max(arr) { return arr.length ? Math.max.apply(null, arr) : 0; }

    var allReach = withMetrics.map(function(c) {
        return (c.metrics.instagram ? (c.metrics.instagram.reach || 0) : 0)
             + (c.metrics.facebook  ? (c.metrics.facebook.reach  || 0) : 0);
    });

    var sorted = withMetrics.slice().sort(function(a, b) {
        var ra = (a.metrics.instagram ? a.metrics.instagram.reach || 0 : 0) + (a.metrics.facebook ? a.metrics.facebook.reach || 0 : 0);
        var rb = (b.metrics.instagram ? b.metrics.instagram.reach || 0 : 0) + (b.metrics.facebook ? b.metrics.facebook.reach || 0 : 0);
        return rb - ra;
    });

    var bestHour = null;
    if (sorted.length > 0 && sorted[0].time) bestHour = sorted[0].time.substring(0, 5);

    var reelItems = withMetrics.filter(function(c) { return c.type === 'reel' && c.metrics && c.metrics.videoMetrics; });
    var avgRet = reelItems.length
        ? Math.round(reelItems.reduce(function(s, r) { return s + (r.metrics.videoMetrics.retentionPercent || 0); }, 0) / reelItems.length)
        : null;

    return {
        totalWithMetrics: withMetrics.length,
        avgReach:     avg(allReach),
        avgReel:      avg(byType.reel),      maxReel:    max(byType.reel),    countReel:    byType.reel.length,
        avgCarousel:  avg(byType.carousel),  maxCarousel: max(byType.carousel), countCarousel: byType.carousel.length,
        avgStories:   avg(byType.stories),   maxStories: max(byType.stories), countStories: byType.stories.length,
        bestHour: bestHour,
        avgRetention: avgRet
    };
}

function renderPredStats() {
    var d   = getPredData();
    var grid = document.getElementById('pred-stats-grid');
    if (!grid) return;

    if (d.totalWithMetrics === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;background:#fef3c7;padding:14px 16px;border-radius:10px;font-size:13px;color:#92400e;">'
            + 'Sin publicaciones con metricas todavia. Agrega metricas a tus publicaciones para ver predicciones reales.'
            + '</div>';
        return;
    }

    function card(icon, val, label, sub) {
        return '<div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;text-align:center;">'
            + '<div style="font-size:22px;">' + icon + '</div>'
            + '<div style="font-size:24px;font-weight:700;color:#8b5cf6;margin:4px 0;">' + val + '</div>'
            + '<div style="font-size:12px;color:#6b7280;">' + label + '</div>'
            + (sub ? '<div style="font-size:11px;color:#9ca3af;margin-top:2px;">' + sub + '</div>' : '')
            + '</div>';
    }

    grid.innerHTML = card('📸', d.avgReach.toLocaleString(), 'Alcance promedio', d.totalWithMetrics + ' publicaciones medidas')
        + card('🎬', d.avgReel.toLocaleString(), 'Promedio Reels', d.countReel + ' medidos')
        + card('📊', d.avgCarousel.toLocaleString(), 'Promedio Carruseles', d.countCarousel + ' medidos')
        + (d.bestHour ? card('⏰', d.bestHour, 'Mejor horario detectado', 'segun top de contenido') : '')
        + (d.avgRetention !== null ? card('🎬', d.avgRetention + '%', 'Retencion promedio Reels', 'de tus reels medidos') : '');
}

// --------------------------------------------------
// CALCULADORA
// --------------------------------------------------
window.calcularPrediccion = function() {
    var tipo = document.getElementById('pred-tipo') ? document.getElementById('pred-tipo').value : 'reel';
    var hora = document.getElementById('pred-hora') ? parseInt(document.getElementById('pred-hora').value) : 20;
    var d    = getPredData();
    var res  = document.getElementById('pred-result');
    if (!res) return;

    if (d.totalWithMetrics === 0) {
        res.innerHTML = '<div style="background:#fef3c7;padding:12px;border-radius:8px;font-size:13px;color:#92400e;">Sin datos historicos. Agrega metricas primero.</div>';
        return;
    }

    var base = tipo === 'reel' ? d.avgReel : tipo === 'carousel' ? d.avgCarousel : d.avgStories;
    if (base === 0) base = d.avgReach;
    if (base === 0) {
        res.innerHTML = '<div style="background:#fef3c7;padding:12px;border-radius:8px;font-size:13px;color:#92400e;">No hay datos del tipo "' + tipo + '" para predecir.</div>';
        return;
    }

    var horaMod = 1.0;
    if (hora >= 19 && hora <= 21) horaMod = 1.15;
    else if (hora >= 12 && hora <= 14) horaMod = 1.05;
    else if (hora < 9 || hora > 22) horaMod = 0.80;

    var predicted = Math.round(base * horaMod);
    var low  = Math.round(predicted * 0.75);
    var high = Math.round(predicted * 1.30);
    var conf = d.totalWithMetrics >= 10 ? 'Alta' : d.totalWithMetrics >= 5 ? 'Media' : 'Baja';
    var confColor = d.totalWithMetrics >= 10 ? '#10b981' : d.totalWithMetrics >= 5 ? '#f59e0b' : '#ef4444';

    res.innerHTML = '<div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:16px;">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'
        + '<strong style="font-size:14px;">Prediccion de alcance</strong>'
        + '<span style="font-size:11px;font-weight:600;color:' + confColor + ';">Confianza ' + conf + '</span>'
        + '</div>'
        + '<div style="font-size:32px;font-weight:700;color:#8b5cf6;margin-bottom:4px;">' + low.toLocaleString() + ' — ' + high.toLocaleString() + '</div>'
        + '<div style="font-size:13px;color:#6b7280;margin-bottom:10px;">Personas estimadas · Valor central: ' + predicted.toLocaleString() + '</div>'
        + '<div style="font-size:12px;color:#6b7280;">Basado en ' + d.totalWithMetrics + ' publicaciones reales del cliente.'
        + (horaMod > 1 ? ' Horario prime: +' + Math.round((horaMod - 1) * 100) + '%.' : '')
        + '</div></div>';
};

// --------------------------------------------------
// INSIGHT CON CLAUDE / GPT
// --------------------------------------------------
window.generarInsightIA = async function() {
    var insightDiv = document.getElementById('pred-ia-insight');
    if (!insightDiv) return;

    insightDiv.innerHTML = '<div style="color:#6b7280;font-style:italic;">Generando insight con IA...</div>';

    var hasKey = !!(localStorage.getItem('bondi-openai-key') || localStorage.getItem('bondi-claude-key'));
    if (!hasKey || typeof window.callClaudeAPI !== 'function') {
        insightDiv.innerHTML = '<div style="background:#fef3c7;padding:12px;border-radius:8px;font-size:13px;color:#92400e;">'
            + 'Configura tu API key en Configuracion para obtener insights en lenguaje natural.</div>';
        return;
    }

    var d   = getPredData();
    var ctx = typeof window.buildEnrichedContext === 'function' ? window.buildEnrichedContext() : {};
    var account = ctx.account || { name: 'el cliente', industry: 'no especificado' };

    if (d.totalWithMetrics === 0) {
        insightDiv.innerHTML = '<div style="background:#fef3c7;padding:12px;border-radius:8px;font-size:13px;color:#92400e;">Agrega metricas a tus publicaciones para obtener un insight real.</div>';
        return;
    }

    var sysP = 'Sos el asesor de contenido de Bondi Media. Interpretas datos de metricas en lenguaje claro y accionable. Nunca usas terminologia tecnica innecesaria. Siempre aterrizas en recomendaciones concretas.';
    var usrP = 'Con base en estos datos de ' + account.name + ', escribime un parrafo de 4-6 oraciones en tono conversacional que: 1) identifique que formato funciona mejor y por que importa, 2) de una recomendacion concreta para el proximo mes, 3) mencione que oportunidad existe segun los datos. Sin titulos, sin listas. Solo el parrafo.\n\nDatos:\nPublicaciones medidas: ' + d.totalWithMetrics + '\nAlcance promedio general: ' + d.avgReach + '\nAlcance promedio Reels: ' + d.avgReel + ' (' + d.countReel + ' medidos)\nAlcance promedio Carruseles: ' + d.avgCarousel + ' (' + d.countCarousel + ' medidos)\n' + (d.bestHour ? 'Mejor horario: ' + d.bestHour + '\n' : '') + (d.avgRetention !== null ? 'Retencion promedio reels: ' + d.avgRetention + '%' : '');

    var resp = await window.callClaudeAPI(sysP, usrP, { maxTokens: 300, useCache: true });

    if (!resp.ok) {
        insightDiv.innerHTML = '<div style="background:#fee2e2;padding:12px;border-radius:8px;font-size:13px;color:#991b1b;">Error: ' + (resp.message || 'Error desconocido') + '</div>';
        return;
    }

    insightDiv.innerHTML = '<div style="font-size:13px;line-height:1.8;color:#374151;background:#f5f3ff;padding:16px;border-radius:10px;border-left:3px solid #8b5cf6;">'
        + resp.text
        + '</div>'
        + (resp.fromCache ? '<div style="font-size:11px;color:#9ca3af;margin-top:6px;">(desde cache)</div>' : '');
};

console.log('Predictivo listo');