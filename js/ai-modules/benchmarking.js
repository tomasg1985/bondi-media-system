// ==================================================
// BENCHMARKING — Versión completa con métricas reales
// js/ai-modules/benchmarking.js
// ==================================================

console.log('📊 Cargando Benchmarking...');

window.initBenchmarking = function(container) {
    if (!container) return;
    container.innerHTML = _buildBenchmarkingUI();
    _initBenchmarkingLogic();
};

// --------------------------------------------------
// STORAGE
// --------------------------------------------------
function _bKey() { return 'bondi-competitors-' + (window.currentAccount || 'bondi-media'); }

function _loadCompetitors() {
    try { return JSON.parse(localStorage.getItem(_bKey()) || '[]'); } catch(e) { return []; }
}

function _saveCompetitors(data) {
    try { localStorage.setItem(_bKey(), JSON.stringify(data)); } catch(e) {}
}

// --------------------------------------------------
// MÉTRICAS PROPIAS — desde datos reales del cliente
// --------------------------------------------------
function _calcMyMetrics() {
    var cal = (window.appData && window.appData.calendar) ? window.appData.calendar : [];
    var withM = cal.filter(function(c){ return c.metrics; });
    if (!withM.length) return null;

    function reach(c) {
        return ((c.metrics.instagram ? c.metrics.instagram.reach || 0 : 0)
              + (c.metrics.facebook  ? c.metrics.facebook.reach  || 0 : 0));
    }
    function eng(c) {
        return ((c.metrics.instagram ? (c.metrics.instagram.likes||0)+(c.metrics.instagram.comments||0) : 0)
              + (c.metrics.facebook  ? (c.metrics.facebook.reactions||0)+(c.metrics.facebook.comments||0) : 0));
    }

    var totalReach = withM.reduce(function(s,c){ return s+reach(c); },0);
    var totalEng   = withM.reduce(function(s,c){ return s+eng(c); },0);
    var avgReach   = Math.round(totalReach / withM.length);
    var engRate    = totalReach > 0 ? ((totalReach > 0 ? (totalEng/totalReach*100) : 0)).toFixed(1) : '—';
    var freq       = withM.length;

    // Por tipo
    var byType = {};
    withM.forEach(function(c){
        var t = c.type || 'reel';
        byType[t] = (byType[t] || 0) + 1;
    });

    // Mejor post
    var best = withM.slice().sort(function(a,b){ return reach(b)-reach(a); })[0];

    return {
        avgReach: avgReach,
        engRate:  engRate,
        freq:     freq,
        byType:   byType,
        bestPost: best ? { title: best.title, reach: reach(best) } : null,
        hasDatos: true
    };
}

// --------------------------------------------------
// RENDER UI
// --------------------------------------------------
function _buildBenchmarkingUI() {
    return '<div style="padding:24px;font-family:Inter,sans-serif;">'

        // Header
        + '<div style="background:linear-gradient(135deg,#10b981,#059669);padding:24px 28px;border-radius:14px;color:#fff;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">'
        + '<div><h2 style="font-size:22px;font-weight:700;margin:0 0 4px;">📊 Benchmarking</h2>'
        + '<p style="opacity:.85;font-size:13px;margin:0;">Analizá tu posición frente a la competencia con datos reales</p></div>'
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">'
        + '<select id="b-account-switch" onchange="_bSwitchAccount(this.value)" style="padding:7px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.15);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">'
        + _buildAccountOptions()
        + '</select>'
        + '<button onclick="_bAddCompetitorForm()" style="background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);color:#fff;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;white-space:nowrap;">+ Agregar competidor</button>'
        + '</div>'
        + '</div>'

        // Estadísticas propias
        + '<div id="b-own-stats" style="margin-bottom:20px;"></div>'

        // Comparativa
        + '<div id="b-comparison" style="margin-bottom:20px;"></div>'

        // Competidores
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;margin-bottom:20px;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
        + '<h3 style="font-size:14px;font-weight:700;color:#111827;margin:0;">👥 Competidores registrados</h3>'
        + '</div>'
        + '<div id="b-competitors-list"></div>'
        + '</div>'

        // Insights
        + '<div id="b-insights" style="margin-bottom:20px;"></div>'

        // Análisis diferencial
        + '<div id="b-differential" style="margin-bottom:20px;"></div>'

        // Tips y consejos
        + '<div id="b-tips" style="margin-bottom:20px;"></div>'

        // Formulario (oculto por defecto)
        + '<div id="b-form-container" style="display:none;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:14px;padding:20px;margin-bottom:20px;">'
        + '<h3 style="font-size:14px;font-weight:700;color:#111827;margin:0 0 6px;">➕ Registrar competidor / referente</h3>'
        + '<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:10px 12px;font-size:11px;color:#1E40AF;margin-bottom:14px;">'
        + '💡 <strong>Solo datos observables</strong> — Todo lo que pedimos podés verlo en el perfil público del competidor en 2 minutos, sin necesitar acceso a sus estadísticas privadas.'
        + '</div>'

        // Fila 1: Nombre + Handle
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">NOMBRE</label>'
        + '<input id="b-name" class="form-input" placeholder="Ej: Agencia XYZ" style="width:100%;"></div>'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">USUARIO IG 👁 visible en perfil</label>'
        + '<input id="b-handle" class="form-input" placeholder="@usuario" style="width:100%;"></div>'
        + '</div>'

        // Fila 2: Seguidores + Formato
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">SEGUIDORES 👁 visible en perfil</label>'
        + '<input id="b-followers" class="form-input" type="number" placeholder="Ej: 12000" style="width:100%;"></div>'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">FORMATO PRINCIPAL 👁 su grilla</label>'
        + '<select id="b-format" class="form-select" style="width:100%;">'
        + '<option value="reels">Principalmente Reels</option>'
        + '<option value="carruseles">Principalmente Carruseles</option>'
        + '<option value="mixto">Mixto (Reels + Carruseles)</option>'
        + '<option value="stories">Foco en Stories</option>'
        + '<option value="estaticos">Posts estáticos</option>'
        + '</select></div>'
        + '</div>'

        // Fila 3: Frecuencia estimada + Interacción visible
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">FRECUENCIA DE PUBLICACIÓN 👁 su feed</label>'
        + '<select id="b-freq" class="form-select" style="width:100%;">'
        + '<option value="muy_baja">Muy baja (1 post o menos por semana)</option>'
        + '<option value="baja">Baja (2-3 por semana)</option>'
        + '<option value="media">Media (1 por día aprox.)</option>'
        + '<option value="alta">Alta (más de 1 por día)</option>'
        + '</select></div>'
        + '<div><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">INTERACCIÓN VISIBLE 👁 likes y comentarios</label>'
        + '<select id="b-engagement-nivel" class="form-select" style="width:100%;">'
        + '<option value="bajo">Baja — pocos likes/comentarios por post</option>'
        + '<option value="medio">Media — comentarios activos, algunos guardados</option>'
        + '<option value="alto">Alta — muchos comentarios, conversación real</option>'
        + '<option value="viral">Viral — posts con miles de interacciones</option>'
        + '</select></div>'
        + '</div>'

        // Fila 4: Observaciones
        + '<div style="margin-bottom:12px;"><label style="font-size:11px;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">QUÉ HACE BIEN / QUÉ DIFERENCIA 📝 tu análisis personal</label>'
        + '<textarea id="b-notes" class="form-input" rows="2" placeholder="Ej: Sus hooks de reel son muy directos, usa mucho B-roll de proceso, CTA siempre con palabra clave..." style="width:100%;"></textarea></div>'

        + '<div style="display:flex;gap:8px;">'
        + '<button onclick="_bSaveCompetitor()" style="padding:8px 18px;background:#10b981;border:none;border-radius:8px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;">Guardar</button>'
        + '<button onclick="_bHideForm()" style="padding:8px 18px;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:8px;color:#374151;font-size:12px;cursor:pointer;">Cancelar</button>'
        + '</div>'
        + '</div>'

        + '</div>';
}

// Helper: opciones de cuentas para el select
function _buildAccountOptions() {
    var accounts  = window.accounts || [];
    var current   = window.currentAccount || 'bondi-media';
    return accounts.map(function(a) {
        return '<option value="' + a.id + '"' + (a.id === current ? ' selected' : '') + '>'
            + (a.id === 'bondi-media' ? '🏢 ' : '👤 ') + a.name + '</option>';
    }).join('') || '<option value="bondi-media">Bondi Media</option>';
}

function _initBenchmarkingLogic() {
    _renderOwnStats();
    _renderCompetitors();
    _renderComparison();
    _renderInsights();
    _renderDifferential();
    _renderTips();
}

// Cambiar cuenta activa desde el selector del benchmarking
window._bSwitchAccount = function(accountId) {
    if (typeof switchAccount === 'function') {
        switchAccount(accountId).then(function() {
            // Re-renderizar todo el módulo con la nueva cuenta
            setTimeout(function() {
                _renderOwnStats();
                _renderCompetitors();
                _renderComparison();
                _renderInsights();
                _renderDifferential();
                _renderTips();
            }, 400);
        });
    }
};

// --------------------------------------------------
// STATS PROPIAS
// --------------------------------------------------
function _renderOwnStats() {
    var el = document.getElementById('b-own-stats');
    if (!el) return;
    var m  = _calcMyMetrics();
    var acc = (window.accounts||[]).find(function(a){ return a.id===(window.currentAccount||'bondi-media'); });
    var nombre = acc ? acc.name : 'Tu cuenta';

    if (!m) {
        el.innerHTML = '<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:14px;font-size:12px;color:#92400E;">'
            + '⚠️ <strong>' + nombre + '</strong> no tiene publicaciones con métricas. Cargá métricas para habilitar el análisis comparativo.</div>';
        return;
    }

    var FMT_ICONS = { reel:'🎬', carousel:'📊', stories:'📲' };
    var fmtStr = Object.entries(m.byType).map(function(e){ return (FMT_ICONS[e[0]]||'📄') + ' ' + e[1] + ' ' + e[0]; }).join(' | ');

    el.innerHTML = '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;margin-bottom:0;">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">'
        + '<h3 style="font-size:14px;font-weight:700;color:#111827;margin:0;">📈 Tu posición — ' + nombre + '</h3>'
        + '<span style="font-size:11px;background:#ECFDF5;color:#065F46;padding:3px 10px;border-radius:20px;font-weight:600;">Datos reales</span>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;">'
        + _bStatCard('👁️', m.avgReach.toLocaleString(), 'Alcance promedio', '#ECFDF5','#065F46','#A7F3D0')
        + _bStatCard('💬', m.engRate + '%', 'Engagement rate', '#EFF6FF','#1E40AF','#BFDBFE')
        + _bStatCard('📋', m.freq, 'Posts con métricas', '#F5F3FF','#5B21B6','#C4B5FD')
        + (m.bestPost ? _bStatCard('⭐', m.bestPost.reach.toLocaleString(), 'Mejor alcance', '#FEF9C3','#854D0E','#FDE047') : '')
        + '</div>'
        + (fmtStr ? '<div style="margin-top:10px;font-size:11px;color:#6B7280;">Distribución de formatos: ' + fmtStr + '</div>' : '')
        + '</div>';
}

function _bStatCard(icon, val, label, bg, color, border) {
    return '<div style="background:' + bg + ';border:1px solid ' + border + ';border-radius:10px;padding:14px;text-align:center;">'
        + '<div style="font-size:18px;">' + icon + '</div>'
        + '<div style="font-size:20px;font-weight:700;color:' + color + ';margin:4px 0;">' + val + '</div>'
        + '<div style="font-size:10px;color:' + color + ';opacity:.8;">' + label + '</div>'
        + '</div>';
}

// --------------------------------------------------
// LISTA DE COMPETIDORES (cards en lugar de tabla)
// --------------------------------------------------
function _renderCompetitors() {
    var el = document.getElementById('b-competitors-list');
    if (!el) return;
    var comps = _loadCompetitors();

    if (!comps.length) {
        el.innerHTML = '<div style="text-align:center;padding:24px;color:#9CA3AF;font-size:13px;">'
            + '<div style="font-size:28px;margin-bottom:8px;">👀</div>'
            + 'Aún no agregaste competidores.<br>'
            + '<span style="font-size:11px;">Podés cargar cualquier cuenta que uses como referencia — agencias, marcas del sector, referentes de la industria.</span></div>';
        return;
    }

    // Solo mostramos el contador — la lista detallada está en la tabla comparativa
    el.innerHTML = '<div style="font-size:12px;color:#6B7280;padding:4px 0;">'
        + comps.length + ' competidor' + (comps.length!==1?'es':'') + ' registrado' + (comps.length!==1?'s':'') + '. '
        + 'Los detalles y la comparativa están en la tabla de abajo.'
        + '</div>';
}

// --------------------------------------------------
// COMPARATIVA — Tabla de semáforos (fácil de leer)
// --------------------------------------------------
function _renderComparison() {
    var el = document.getElementById('b-comparison');
    if (!el) return;
    var comps = _loadCompetitors();
    if (!comps.length) { el.innerHTML = ''; return; }

    var own = _calcMyMetrics();
    var acc = (window.accounts||[]).find(function(a){ return a.id===(window.currentAccount||'bondi-media'); });
    var nombre = acc ? acc.name : 'Tu cuenta';

    // Niveles para leer mejor
    var FREQ_LABELS = { muy_baja:'1×/semana o menos', baja:'2-3×/semana', media:'1×/día aprox.', alta:'Más de 1×/día' };
    var FREQ_RANK   = { muy_baja:1, baja:2, media:3, alta:4 };
    var ENG_LABELS  = { bajo:'Baja', medio:'Media', alto:'Alta', viral:'Viral' };
    var ENG_RANK    = { bajo:1, medio:2, alto:3, viral:4 };

    // Semáforo: verde=ganás, amarillo=empate, rojo=perdés
    function sem(cond, empate) {
        if (cond === null) return '<span style="color:#9CA3AF;">—</span>';
        if (empate) return '<span title="Similar" style="font-size:16px;">🟡</span>';
        return cond
            ? '<span title="Tu cuenta tiene ventaja" style="font-size:16px;">🟢</span>'
            : '<span title="El competidor tiene ventaja" style="font-size:16px;">🔴</span>';
    }

    // Calcular rango de seguidor de TU cuenta para comparar
    // (usamos el mejor post reach como proxy de tamaño)
    var myFollowersProxy = own ? (own.avgReach * 3) : 0; // estimación muy gruesa

    var html = '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;margin-bottom:20px;">'

        // Leyenda de lectura
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">'
        + '<h3 style="font-size:14px;font-weight:700;color:#111827;margin:0;">🏁 Tabla comparativa</h3>'
        + '<div style="display:flex;gap:10px;font-size:11px;color:#6B7280;">'
        + '<span>🟢 Vos tenés ventaja</span>'
        + '<span>🟡 Similar</span>'
        + '<span>🔴 Competidor tiene ventaja</span>'
        + '</div>'
        + '</div>'

        // Nota de contexto
        + '<div style="background:#F0FDF4;border:1px solid #A7F3D0;border-radius:8px;padding:10px 12px;font-size:11px;color:#065F46;margin-bottom:14px;">'
        + '📖 <strong>Cómo leer esta tabla:</strong> Cada fila es un competidor. Los íconos de semáforo te dicen si estás por encima (🟢), similar (🟡) o por debajo (🔴) en cada dimensión. '
        + 'Las columnas con 👁 son datos que obtuviste mirando el perfil público; las tuyas vienen de tus métricas reales cargadas en el sistema.'
        + '</div>'

        + '<div style="overflow-x:auto;">'
        + '<table style="width:100%;border-collapse:collapse;font-size:12px;">'
        + '<thead><tr style="background:#F9FAFB;border-bottom:2px solid #E5E7EB;">'
        + '<th style="padding:10px 12px;text-align:left;min-width:120px;">COMPETIDOR</th>'
        + '<th style="padding:10px 12px;text-align:center;" title="Seguidores visibles en el perfil público">👥 SEGUIDORES 👁</th>'
        + '<th style="padding:10px 12px;text-align:center;" title="Qué tan seguido publican — estimado mirando su feed">📅 FRECUENCIA 👁</th>'
        + '<th style="padding:10px 12px;text-align:center;" title="Nivel de likes y comentarios visibles en sus posts">💬 INTERACCIÓN 👁</th>'
        + '<th style="padding:10px 12px;text-align:center;" title="Formato que más usa en su perfil">📱 FORMATO 👁</th>'
        + (own ? '<th style="padding:10px 12px;text-align:center;" title="Alcance promedio de tus publicaciones medidas — dato REAL tuyo">🎯 TU ALCANCE REAL</th>' : '')
        + '<th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#6B7280;">ACCIONES</th>'
        + '</tr></thead><tbody>';

    // Fila de TU cuenta (si tenés métricas)
    if (own) {
        html += '<tr style="background:#ECFDF5;border-bottom:2px solid #A7F3D0;font-weight:600;">'
            + '<td style="padding:10px 12px;color:#065F46;">👑 ' + _esc(nombre) + ' (vos)</td>'
            + '<td style="padding:10px 12px;text-align:center;color:#6B7280;font-size:11px;">— (privado)</td>'
            + '<td style="padding:10px 12px;text-align:center;color:#6B7280;font-size:11px;">— (privado)</td>'
            + '<td style="padding:10px 12px;text-align:center;font-size:12px;color:#065F46;">' + own.engRate + '% real</td>'
            + '<td style="padding:10px 12px;text-align:center;color:#065F46;font-size:11px;">'
            + Object.keys(own.byType).map(function(t){ var i={reel:'🎬',carousel:'📊',stories:'📲'}; return (i[t]||'📄'); }).join(' ')
            + '</td>'
            + '<td style="padding:10px 12px;text-align:center;font-weight:700;color:#065F46;">' + own.avgReach.toLocaleString() + '</td>'
            + '<td style="padding:10px 12px;text-align:center;color:#9CA3AF;font-size:11px;">—</td>'
            + '</tr>';
    }

    comps.forEach(function(c) {
        var freqLabel = FREQ_LABELS[c.freq] || c.freq || '—';
        var engLabel  = ENG_LABELS[c.engNivel] || c.engNivel || '—';

        var semFreq = c.freq ? sem(FREQ_RANK[c.freq] <= 2, FREQ_RANK[c.freq] === 3) : null;
        var semEng  = c.engNivel ? sem(ENG_RANK[c.engNivel] <= 2, ENG_RANK[c.engNivel] === 3) : null;
        var semFoll = c.followers && own ? sem(myFollowersProxy >= c.followers * 0.8, Math.abs(myFollowersProxy - c.followers) < c.followers * 0.2) : null;

        var isHighThreat = c.engNivel === 'viral' || c.engNivel === 'alto';

        html += '<tr style="border-bottom:1px solid #F3F4F6;" onmouseover="this.style.background=\'#F9FAFB\'" onmouseout="this.style.background=\'\'">'
            + '<td style="padding:10px 12px;">'
            + '<div style="font-weight:600;">' + _esc(c.name) + '</div>'
            + (c.handle ? '<div style="font-size:11px;color:#9CA3AF;">' + _esc(c.handle) + '</div>' : '')
            + '</td>'
            + '<td style="padding:10px 12px;text-align:center;">'
            + (c.followers ? '<span style="font-weight:600;">' + c.followers.toLocaleString() + '</span>' : '—')
            + (own && c.followers ? '<br><span style="font-size:10px;">' + semFoll + '</span>' : '')
            + '</td>'
            + '<td style="padding:10px 12px;text-align:center;">'
            + '<div style="font-size:11px;color:#374151;">' + freqLabel + '</div>'
            + (c.freq ? '<div>' + semFreq + '</div>' : '')
            + '</td>'
            + '<td style="padding:10px 12px;text-align:center;">'
            + '<div style="font-size:11px;color:#374151;">' + engLabel + '</div>'
            + (c.engNivel ? '<div>' + semEng + '</div>' : '')
            + '</td>'
            + '<td style="padding:10px 12px;text-align:center;font-size:12px;">' + _esc(c.format||'—') + '</td>'
            + (own ? '<td style="padding:10px 12px;text-align:center;font-size:12px;color:#9CA3AF;">— (privado)</td>' : '')
            // ACCIONES — botones visibles en cada fila
            + '<td style="padding:10px 12px;text-align:center;white-space:nowrap;">'
            + '<button onclick="_bEditCompetitor(\'' + c.id + '\')" title="Editar" style="font-size:11px;padding:4px 9px;border-radius:6px;background:#EFF6FF;border:1px solid #BFDBFE;color:#1D4ED8;cursor:pointer;margin-right:4px;">✏️ Editar</button>'
            + '<button onclick="_bDeleteCompetitor(\'' + c.id + '\')" title="Eliminar" style="font-size:11px;padding:4px 9px;border-radius:6px;background:#FEF2F2;border:1px solid #FECACA;color:#DC2626;cursor:pointer;">✕</button>'
            + '</td>'
            + '</tr>';

        // Observaciones inline si existen
        if (c.notes) {
            var colspan = own ? '7' : '6';
            html += '<tr style="border-bottom:1px solid #F3F4F6;background:#FAFAFA;">'
                + '<td colspan="' + colspan + '" style="padding:4px 12px 10px 28px;font-size:11px;color:#6B7280;">'
                + '📝 ' + _esc(c.notes)
                + '</td></tr>';
        }
    });

    html += '</tbody></table></div></div>';
    el.innerHTML = html;
}

// --------------------------------------------------
// ANÁLISIS DIFERENCIAL — Qué hacés bien / qué hace
// bien la competencia / cómo diferenciarte
// --------------------------------------------------
function _renderDifferential() {
    var el = document.getElementById('b-differential');
    if (!el) return;
    var comps = _loadCompetitors();
    var own   = _calcMyMetrics();
    if (!comps.length) { el.innerHTML = ''; return; }

    var ENG_RANK  = { bajo:1, medio:2, alto:3, viral:4 };
    var FREQ_RANK = { muy_baja:1, baja:2, media:3, alta:4 };

    // Analizar fortalezas propias
    var fortalezas = [];
    var debilidadesComp = [];
    var diferenciadores = [];

    if (own) {
        if (own.engRate && parseFloat(own.engRate) > 3)
            fortalezas.push('Tus publicaciones generan un engagement rate de <strong>' + own.engRate + '%</strong> — por encima del promedio del mercado de contenidos (2-3%).');
        if (own.avgReach > 2000)
            fortalezas.push('Tu alcance promedio de <strong>' + own.avgReach.toLocaleString() + '</strong> indica que el algoritmo está distribuyendo tu contenido activamente.');
        if (own.byType && own.byType.reel)
            fortalezas.push('Tenés <strong>' + own.byType.reel + ' reels medidos</strong> — el formato con mayor alcance orgánico en 2026.');
        if (own.bestPost && own.bestPost.reach > own.avgReach * 2)
            fortalezas.push('Tu mejor publicación ("<strong>' + _esc(own.bestPost.title) + '</strong>") tuvo <strong>' + own.bestPost.reach.toLocaleString() + '</strong> de alcance — casi el doble del promedio. Hay un hook o tema que resonó muy bien.');
    }
    if (!fortalezas.length)
        fortalezas.push('Aún no hay suficientes métricas propias para identificar fortalezas. Cargá métricas de tus publicaciones publicadas para habilitar este análisis.');

    // Analizar qué hace bien la competencia
    var viralComps = comps.filter(function(c){ return c.engNivel === 'viral' || c.engNivel === 'alto'; });
    var highFreqComps = comps.filter(function(c){ return FREQ_RANK[c.freq] >= 3; });
    var reelComps = comps.filter(function(c){ return c.format === 'reels' || c.format === 'mixto'; });

    if (viralComps.length)
        debilidadesComp.push('<strong>' + viralComps.map(function(c){ return _esc(c.name); }).join(', ') + '</strong> logra alta interacción visible en sus posts. Esto indica que sus CTAs y la temática de su contenido generan conversación real — revisá sus captions.');
    if (highFreqComps.length)
        debilidadesComp.push('<strong>' + highFreqComps.map(function(c){ return _esc(c.name); }).join(', ') + '</strong> publica con alta frecuencia — el volumen les da presencia constante en el feed de sus seguidores.');
    if (reelComps.length >= 2)
        debilidadesComp.push('La mayoría de tus competidores usa Reels — el formato es el estándar del mercado en tu segmento.');
    if (!debilidadesComp.length)
        debilidadesComp.push('Tus competidores tienen interacción y frecuencia generalmente bajas — el mercado no está siendo explotado a su máximo potencial. Esta es una ventana de oportunidad.');

    // Diferenciadores sugeridos
    diferenciadores.push('🎯 <strong>Profundidad vs volumen:</strong> Si la competencia publica mucho con poco valor, diferenciarte con menos publicaciones pero con más profundidad técnica genera más guardados y autoridad.');
    diferenciadores.push('🤝 <strong>Transparencia de proceso:</strong> Mostrar cómo trabajás internamente (B-roll de metodología, pantallas, reuniones) es un diferenciador que pocas agencias usan y que genera mucha confianza.');
    diferenciadores.push('📊 <strong>Contenido basado en datos:</strong> Publicar resultados reales de clientes (con permiso) — alcance, engagement, conversiones — diferencia a las agencias serias de las que solo prometen.');

    if (viralComps.length === 0)
        diferenciadores.push('🚀 <strong>Ocupar el espacio de alta interacción:</strong> Ninguno de tus competidores actuales tiene interacción viral. Si apostás por contenido que genere comentarios y debate, podés posicionarte como la referencia del nicho.');

    var html = '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;">'
        + '<h3 style="font-size:14px;font-weight:700;color:#111827;margin:0 0 16px;">🔬 Análisis diferencial</h3>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">'

        // Lo que hacés bien
        + '<div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:14px;">'
        + '<div style="font-size:12px;font-weight:700;color:#065F46;margin-bottom:10px;">✅ Lo que estás haciendo bien</div>'
        + fortalezas.map(function(t){ return '<div style="font-size:12px;color:#047857;margin-bottom:8px;line-height:1.5;">• ' + t + '</div>'; }).join('')
        + '</div>'

        // Lo que hace bien la competencia
        + '<div style="background:#FEF9C3;border:1px solid #FDE047;border-radius:10px;padding:14px;">'
        + '<div style="font-size:12px;font-weight:700;color:#854D0E;margin-bottom:10px;">👀 Lo que hace bien tu competencia</div>'
        + debilidadesComp.map(function(t){ return '<div style="font-size:12px;color:#92400E;margin-bottom:8px;line-height:1.5;">• ' + t + '</div>'; }).join('')
        + '</div>'
        + '</div>'

        // Cómo diferenciarte
        + '<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:14px;">'
        + '<div style="font-size:12px;font-weight:700;color:#1D4ED8;margin-bottom:10px;">🚀 Cómo diferenciarte</div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;">'
        + diferenciadores.map(function(t){
            return '<div style="background:#fff;border:1px solid #BFDBFE;border-radius:8px;padding:10px;font-size:12px;color:#1E40AF;line-height:1.5;">' + t + '</div>';
          }).join('')
        + '</div>'
        + '</div>'
        + '</div>';

    el.innerHTML = html;
}

// --------------------------------------------------
// TIPS Y CONSEJOS
// --------------------------------------------------
function _renderTips() {
    var el = document.getElementById('b-tips');
    if (!el) return;
    var comps = _loadCompetitors();

    var tips = [
        { icon:'📅', color:'#1D4ED8', bg:'#EFF6FF', border:'#BFDBFE',
          titulo: 'Consistencia sobre perfección',
          texto: 'El algoritmo de Instagram 2026 premia la regularidad. Es mejor publicar 3 veces por semana con calidad aceptable que 1 vez por semana con calidad perfecta. La frecuencia genera señales al algoritmo de que la cuenta está activa.' },
        { icon:'🎣', color:'#065F46', bg:'#ECFDF5', border:'#A7F3D0',
          titulo: 'Los primeros 3 segundos del Reel lo son todo',
          texto: 'El 70% de las decisiones de si alguien continúa viendo se toman antes de los 3 segundos. Invertí más tiempo en el hook visual y la primera frase que en cualquier otra parte del video.' },
        { icon:'💾', color:'#5B21B6', bg:'#F5F3FF', border:'#C4B5FD',
          titulo: 'Los guardados son la métrica más valiosa',
          texto: 'Los guardados le dicen al algoritmo que tu contenido es tan valioso que la persona quiere volver a verlo. Un post con muchos guardados y pocos likes puede tener más alcance que uno con muchos likes. Creá contenido tipo "guía de referencia".' },
        { icon:'💬', color:'#92400E', bg:'#FFFBEB', border:'#FDE68A',
          titulo: 'El primer comentario define el alcance',
          texto: 'Respondé todos los comentarios en las primeras 2 horas de la publicación. El algoritmo mide la velocidad de conversación. Si la cuenta creadora responde rápido, el contenido se distribuye más.' },
        { icon:'🔁', color:'#C2410C', bg:'#FFF7ED', border:'#FED7AA',
          titulo: 'Reutilizá tu mejor contenido',
          texto: 'El contenido que funcionó bien puede publicarse de nuevo entre 3 y 6 meses después. La mayoría de los seguidores no lo vio la primera vez. Además, en una segunda publicación, ya sabés que funciona.' },
        { icon:'📊', color:'#1E40AF', bg:'#EFF6FF', border:'#BFDBFE',
          titulo: 'Medí todo lo que publicás',
          texto: 'Las decisiones de contenido sin métricas son intuición. Las decisiones con métricas son estrategia. Cargá los datos de alcance, guardados y DMs de cada publicación — incluso si los números son bajos. El patrón aparece con el tiempo.' },
    ];

    var html = '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;">'
        + '<h3 style="font-size:14px;font-weight:700;color:#111827;margin:0 0 14px;">💡 Tips y consejos para mejorar tu posición</h3>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;">';

    tips.forEach(function(t) {
        html += '<div style="background:' + t.bg + ';border:1px solid ' + t.border + ';border-radius:10px;padding:14px;">'
            + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">'
            + '<span style="font-size:18px;">' + t.icon + '</span>'
            + '<span style="font-size:12px;font-weight:700;color:' + t.color + ';">' + t.titulo + '</span>'
            + '</div>'
            + '<div style="font-size:11px;color:' + t.color + ';opacity:.9;line-height:1.6;">' + t.texto + '</div>'
            + '</div>';
    });

    html += '</div></div>';
    el.innerHTML = html;
}

// --------------------------------------------------
// INSIGHTS AUTOMÁTICOS — basados en campos observables
// --------------------------------------------------
function _renderInsights() {
    var el = document.getElementById('b-insights');
    if (!el) return;
    var comps = _loadCompetitors();
    if (!comps.length) { el.innerHTML = ''; return; }

    var own  = _calcMyMetrics();
    var ENG_RANK  = { bajo:1, medio:2, alto:3, viral:4 };
    var FREQ_RANK = { muy_baja:1, baja:2, media:3, alta:4 };
    var ENG_LABELS  = { bajo:'baja', medio:'media', alto:'alta', viral:'viral' };
    var FREQ_LABELS = { muy_baja:'muy baja', baja:'baja', media:'media', alta:'alta' };

    var insights = [];

    // Competidores con interacción viral/alta
    var highEng = comps.filter(function(c){ return c.engNivel === 'viral' || c.engNivel === 'alto'; });
    if (highEng.length) {
        insights.push({ icon:'💬', color:'#92400E', bg:'#FFFBEB', border:'#FDE68A',
            text: '<strong>' + highEng.map(function(c){ return _esc(c.name); }).join(', ') + '</strong> '
            + (highEng.length === 1 ? 'tiene' : 'tienen') + ' interacción ' + (highEng.length === 1 ? ENG_LABELS[highEng[0].engNivel] : 'alta/viral') + ' en sus publicaciones. '
            + 'Analizá qué preguntas hacen en sus copies y cómo estructuran sus CTAs — ahí está el diferencial.' });
    }

    // Competidores que publican más seguido
    var highFreq = comps.filter(function(c){ return FREQ_RANK[c.freq] >= 3; });
    if (highFreq.length) {
        insights.push({ icon:'📅', color:'#1D4ED8', bg:'#EFF6FF', border:'#BFDBFE',
            text: '<strong>' + highFreq.map(function(c){ return _esc(c.name); }).join(', ') + '</strong> '
            + 'publica con frecuencia ' + (highFreq.length===1 ? FREQ_LABELS[highFreq[0].freq] : 'alta o muy alta') + '. '
            + 'Mayor frecuencia = mayor visibilidad en el algoritmo. Si publicás menos, considerá aumentar la cadencia al menos un período de prueba.' });
    }

    // Competidores con muchos seguidores
    var bigAccounts = comps.filter(function(c){ return c.followers > 10000; });
    if (bigAccounts.length) {
        insights.push({ icon:'👥', color:'#5B21B6', bg:'#F5F3FF', border:'#C4B5FD',
            text: '<strong>' + bigAccounts.map(function(c){ return _esc(c.name); }).join(', ') + '</strong> '
            + 'tienen una base de seguidores establecida (más de 10.000). No compitas en volumen — diferenciarte en claridad de propuesta y calidad de producción es más efectivo en este estadio.' });
    }

    // Si todos tienen baja interacción — oportunidad
    var allLow = comps.every(function(c){ return !c.engNivel || ENG_RANK[c.engNivel] <= 2; });
    if (allLow && comps.length >= 2) {
        insights.push({ icon:'🚀', color:'#065F46', bg:'#ECFDF5', border:'#A7F3D0',
            text: 'El mercado que estás analizando tiene interacción generalmente baja. Eso es una oportunidad directa: '
            + 'si apostás por contenido educativo "guardable" y CTAs de conversación, podés diferenciarte sin necesitar más seguidores.' });
    }

    // Reels como formato dominante entre competidores
    var reelFirst = comps.filter(function(c){ return c.format === 'reels' || c.format === 'mixto'; });
    if (reelFirst.length >= 2) {
        insights.push({ icon:'🎬', color:'#1D4ED8', bg:'#EFF6FF', border:'#BFDBFE',
            text: 'La mayoría de tus competidores usa Reels o formato mixto. El algoritmo de Instagram 2026 sigue priorizando el video vertical. '
            + 'Si no tenés una cadencia fuerte de Reels, es la palanca con mayor retorno en alcance orgánico.' });
    }

    if (!insights.length) { el.innerHTML = ''; return; }

    var html = '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;">'
        + '<h3 style="font-size:14px;font-weight:700;color:#111827;margin:0 0 14px;">🧠 Insights del análisis</h3>';
    insights.forEach(function(ins) {
        html += '<div style="background:' + ins.bg + ';border:1px solid ' + ins.border + ';border-radius:10px;padding:12px 14px;margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;">'
            + '<span style="font-size:20px;flex-shrink:0;">' + ins.icon + '</span>'
            + '<div style="font-size:12px;color:' + ins.color + ';line-height:1.6;">' + ins.text + '</div>'
            + '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
}

// --------------------------------------------------
// CRUD COMPETIDORES
// --------------------------------------------------
window._bAddCompetitorForm = function() {
    var f = document.getElementById('b-form-container');
    if (f) { f.style.display = 'block'; f.scrollIntoView({behavior:'smooth',block:'nearest'}); }
    window._editingCompetitorId = null;
};

window._bHideForm = function() {
    var f = document.getElementById('b-form-container');
    if (f) f.style.display = 'none';
    ['b-name','b-handle','b-followers','b-notes'].forEach(function(id){
        var el = document.getElementById(id); if (el) el.value = '';
    });
    var fmtEl = document.getElementById('b-format'); if (fmtEl) fmtEl.value = 'mixto';
    var frEl  = document.getElementById('b-freq');   if (frEl)  frEl.value  = 'media';
    var enEl  = document.getElementById('b-engagement-nivel'); if (enEl) enEl.value = 'medio';
    window._editingCompetitorId = null;
};

window._bSaveCompetitor = function() {
    var name = (document.getElementById('b-name')?.value||'').trim();
    if (!name) { if(typeof showInfo==='function') showInfo('El nombre es obligatorio'); return; }

    var comp = {
        id:        window._editingCompetitorId || ('c-' + Date.now()),
        name:      name,
        handle:    (document.getElementById('b-handle')?.value||'').trim(),
        followers: parseInt(document.getElementById('b-followers')?.value) || 0,
        format:    document.getElementById('b-format')?.value || 'mixto',
        freq:      document.getElementById('b-freq')?.value || 'media',
        engNivel:  document.getElementById('b-engagement-nivel')?.value || 'medio',
        notes:     (document.getElementById('b-notes')?.value||'').trim(),
        updatedAt: new Date().toISOString()
    };

    var comps = _loadCompetitors();
    var idx   = comps.findIndex(function(c){ return c.id === comp.id; });
    if (idx >= 0) comps[idx] = comp; else comps.push(comp);
    _saveCompetitors(comps);

    _bHideForm();
    _renderCompetitors();
    _renderComparison();
    _renderInsights();
    if (typeof showSuccess === 'function') showSuccess('Competidor guardado correctamente');
};

window._bEditCompetitor = function(id) {
    var comps = _loadCompetitors();
    var comp  = comps.find(function(c){ return c.id === id; });
    if (!comp) return;

    var set = function(elId, val){ var el=document.getElementById(elId); if(el) el.value=val||''; };
    set('b-name',      comp.name);
    set('b-handle',    comp.handle);
    set('b-followers', comp.followers);
    set('b-notes',     comp.notes);
    var fmtEl = document.getElementById('b-format');         if (fmtEl) fmtEl.value = comp.format    || 'mixto';
    var frEl  = document.getElementById('b-freq');            if (frEl)  frEl.value  = comp.freq      || 'media';
    var enEl  = document.getElementById('b-engagement-nivel'); if (enEl) enEl.value  = comp.engNivel  || 'medio';

    window._editingCompetitorId = id;
    var f = document.getElementById('b-form-container');
    if (f) { f.style.display = 'block'; f.scrollIntoView({behavior:'smooth',block:'nearest'}); }
};

window._bDeleteCompetitor = function(id) {
    if (!confirm('¿Eliminar este competidor?')) return;
    var comps = _loadCompetitors().filter(function(c){ return c.id !== id; });
    _saveCompetitors(comps);
    _renderCompetitors();
    _renderComparison();
    _renderInsights();
    if (typeof showSuccess === 'function') showSuccess('Competidor eliminado');
};

function _esc(str) {
    return String(str||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

console.log('✅ Benchmarking cargado');