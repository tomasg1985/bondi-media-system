// ==================================================
// PLATFORM OPTIMIZER - MÓDULO COMPLETO CON MODALES
// ==================================================

console.log('📱 Cargando Optimizador Multiplataforma...');

window.initPlatformOptimizer = function(container) {
    window.platformOptimizerContainer = container;

    function loadAccountCalendar(accountId) {
        if (typeof window.switchAccount === 'function') {
            return window.switchAccount(accountId);
        }
        if (typeof storage !== 'undefined' && storage.get) {
            return storage.get('bondi-calendar-' + accountId).then(function(savedCalendar) {
                if (savedCalendar && savedCalendar.length) {
                    window.appData.calendar = savedCalendar;
                } else {
                    window.appData.calendar = accountId === 'bondi-media' ? (window.MARZO_CALENDAR ? [...window.MARZO_CALENDAR] : []) : [];
                }
            }).catch(function() {
                window.appData.calendar = accountId === 'bondi-media' ? (window.MARZO_CALENDAR ? [...window.MARZO_CALENDAR] : []) : [];
            });
        }
        return Promise.resolve();
    }

    window.handlePlatformOptimizerClientChange = async function(event) {
        var accountId = event && event.target ? event.target.value : (window.currentAccount || 'bondi-media');
        if (!accountId || accountId === (window.currentAccount || 'bondi-media')) return;
        await loadAccountCalendar(accountId);
        if (typeof window.switchAccount === 'function') {
            window.currentAccount = accountId;
        }
        if (window.platformOptimizerContainer) {
            window.initPlatformOptimizer(window.platformOptimizerContainer);
        }
    };

    // Calcular mejores horarios desde métricas reales
    var cal = (window.appData && window.appData.calendar) ? window.appData.calendar : [];
    var withMetrics = cal.filter(function(c){ return c.metrics; });

    function totalReach(c) {
        return ((c.metrics.instagram ? c.metrics.instagram.reach || 0 : 0)
              + (c.metrics.facebook  ? c.metrics.facebook.reach  || 0 : 0)
              + (c.metrics.tiktok    ? c.metrics.tiktok.views    || 0 : 0));
    }

    function platformValue(c, platform) {
        if (!c.metrics) return 0;
        if (platform === 'instagram') return c.metrics.instagram ? c.metrics.instagram.reach || 0 : 0;
        if (platform === 'facebook') return c.metrics.facebook ? c.metrics.facebook.reach || 0 : 0;
        if (platform === 'tiktok') return c.metrics.tiktok ? c.metrics.tiktok.views || 0 : 0;
        return 0;
    }

    function platformItems(platform) {
        return withMetrics.filter(function(c){
            return (c.metrics && c.metrics[platform])
                || (c.plataformas && c.plataformas[platform] && Object.keys(c.plataformas[platform]).length);
        });
    }

    function platformSchedule(platform, fallbackHour, fallbackDay, fallbackFreq) {
        var items = platformItems(platform);
        var hourCounts = {};
        var dayCounts = {};
        items.forEach(function(c){
            if (c.time) {
                var h = c.time.substring(0,5);
                hourCounts[h] = (hourCounts[h]||0) + 1;
            }
            if (c.date) {
                var d = new Date(c.date+'T12:00:00').getDay();
                dayCounts[d] = (dayCounts[d]||0) + 1;
            }
        });
        var bestHour = Object.entries(hourCounts).sort(function(a,b){ return b[1]-a[1]; })[0];
        var bestDay = Object.entries(dayCounts).sort(function(a,b){ return b[1]-a[1]; })[0];

        var recentPosts = cal.filter(function(c){
            if (!c.date) return false;
            var d = new Date(c.date+'T12:00:00');
            var diffDays = (new Date() - d) / (1000*60*60*24);
            return diffDays <= 30;
        }).filter(function(c){
            return (c.plataformas && c.plataformas[platform] && Object.keys(c.plataformas[platform]).length)
                || (c.metrics && c.metrics[platform]);
        });

        var currentFrequency = Math.round((recentPosts.length / Math.max(1, 30/7)) * 10) / 10;
        var recommendedFrequency = {
            instagram: 4,
            facebook: 3,
            tiktok: 5
        }[platform] || fallbackFreq;

        return {
            bestHour: bestHour ? bestHour[0] + 'hs' : fallbackHour,
            bestDay:  bestDay ? DIAS[parseInt(bestDay[0])] : fallbackDay,
            currentFrequency: currentFrequency,
            recommendedFrequency: recommendedFrequency,
            sampleSize: items.length
        };
    }

    var selectedAccountId = window.currentAccount || 'bondi-media';
    var clientInfo = (window.accounts || []).find(function(a){ return a.id === selectedAccountId; }) || { id: selectedAccountId, name: 'Cuenta activa' };
    var clientName = clientInfo.name || 'Cuenta activa';
    var accountOptionsHtml = (window.accounts || []).map(function(a){
        return '<option value="' + a.id + '"' + (a.id === selectedAccountId ? ' selected' : '') + '>'
            + a.name + (a.brand ? ' (' + a.brand + ')' : '') + '</option>';
    }).join('');

    var totalRecent = cal.filter(function(c){
        if (!c.date) return false;
        var d = new Date(c.date+'T12:00:00');
        return (new Date() - d) / (1000*60*60*24) <= 30;
    }).length;
    var currentFreqOverall = Math.round((totalRecent / Math.max(1, 30/7)) * 10) / 10;

    var igData = platformSchedule('instagram', '20:00hs', 'Jueves', 4);
    var fbData = platformSchedule('facebook', '15:00hs', 'Miércoles', 3);
    var ttData = platformSchedule('tiktok', '19:00hs', 'Viernes', 5);

    var platformAdvice = [
        { name: 'Instagram', icon: '📸', color: '#E4405F', data: igData },
        { name: 'TikTok', icon: '🎵', color: '#06b6d4', data: ttData },
        { name: 'Facebook', icon: '📘', color: '#1877f2', data: fbData }
    ];

    var recommendedOverall = igData.recommendedFrequency + fbData.recommendedFrequency + ttData.recommendedFrequency;
    var currentOverall = Math.round((igData.currentFrequency + fbData.currentFrequency + ttData.currentFrequency) * 10) / 10;

    var hasDatos = withMetrics.length > 0;
    var dataNote = hasDatos
        ? '✅ Basado en ' + withMetrics.length + ' publicación' + (withMetrics.length!==1?'es':'') + ' con métricas reales del cliente activo.'
        : '⚠️ Sin métricas cargadas — mostrando promedios generales del mercado. Cargá métricas para ver datos reales.';

    var scheduleCardsHtml = platformAdvice.map(function(entry){
        return '<div style="background:white;padding:16px;border-radius:12px;border:1px solid #E5E7EB;">'
            + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
            + '<div style="display:flex;align-items:center;gap:10px;"><div style="font-size:24px;">'+entry.icon+'</div><strong style="font-size:13px;">'+entry.name+'</strong></div>'
            + '<div style="font-size:11px;color:#6b7280;">'+(hasDatos ? 'Cuenta activa' : 'Promedio general')+'</div>'
            + '</div>'
            + '<div style="font-size:12px;color:#111827;line-height:1.6;">'
            + '<div><strong>Hora ideal:</strong> '+entry.data.bestHour+'</div>'
            + '<div><strong>Día ideal:</strong> '+entry.data.bestDay+'</div>'
            + '<div><strong>Frecuencia:</strong> '+entry.data.currentFrequency+' actual → '+entry.data.recommendedFrequency+' recomendada / semana</div>'
            + '</div>'
            + '</div>';
    }).join('');

    // Listado completo del calendario para el select
    var contentOptions = cal.length
        ? cal.slice().sort(function(a,b){ return new Date(b.date)-new Date(a.date); })
             .map(function(c){
                 var hasM = !!c.metrics;
                 return '<option value="' + c.id + '">' + (hasM?'📊 ':'     ') + c.title + ' (' + c.type + ' — ' + c.date + ')</option>';
             }).join('')
        : '<option disabled>No hay contenido disponible</option>';

    container.innerHTML = `
        <div style="padding: 24px; font-family: Inter, sans-serif;">
            <style>
                .platform-card { background: white; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #e5e7eb; transition: transform 0.2s; }
                .platform-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
            </style>

            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 24px 28px; border-radius: 14px; color: white; margin-bottom: 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                <div><h2 style="font-size: 22px; font-weight:700; margin:0 0 4px;">📱 Optimizador Multiplataforma</h2>
                <p style="opacity: 0.9; font-size:13px; margin:0;">Adaptá y analizá tu contenido para cada red social</p></div>
            </div>

            <!-- Selector de cliente -->
            <div style="margin-bottom: 20px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                <div style="flex:1; min-width:220px;">
                    <label style="display:block; margin-bottom:6px; font-weight:600; font-size:13px;">👥 Cliente</label>
                    <select id="platform-account-select" class="form-input" style="width:100%; padding:10px;" onchange="window.handlePlatformOptimizerClientChange(event)">
                        ${accountOptionsHtml}
                    </select>
                </div>
                <div style="font-size:12px; color:#4b5563; min-width:220px;">
                    Mostrando recomendaciones para <strong>${clientName}</strong>.
                </div>
            </div>

            <!-- Nota de datos -->
            <div style="background:${hasDatos?'#ECFDF5':'#FFFBEB'};border:1px solid ${hasDatos?'#A7F3D0':'#FDE68A'};border-radius:10px;padding:10px 14px;font-size:12px;color:${hasDatos?'#065F46':'#92400E'};margin-bottom:20px;">
                ${dataNote}
            </div>

            <!-- Selector de contenido -->
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size:13px;">📋 Contenido a optimizar / analizar:</label>
                <select id="platform-content-select" class="form-input" style="width: 100%; padding: 10px;" onchange="actualizarPreviews()">
                    <option value="">— Seleccionar publicación —</option>
                    ${contentOptions}
                </select>
            </div>

            <!-- Tarjetas de plataforma -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
                <div class="platform-card">
                    <div style="font-size:40px;margin-bottom:8px;">📸</div>
                    <h3 style="margin-bottom:6px;">Instagram</h3>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">Reel 9:16 • Carrusel 1:1 • Stories</div>
                    <button class="btn-primary btn-sm" onclick="verPlataforma('instagram')" style="width: 100%;">Ver especificaciones</button>
                </div>
                <div class="platform-card">
                    <div style="font-size:40px;margin-bottom:8px;">🎵</div>
                    <h3 style="margin-bottom:6px;">TikTok</h3>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">Video 9:16 • 21-34s • Trending sounds</div>
                    <button class="btn-primary btn-sm" onclick="verPlataforma('tiktok')" style="width: 100%;">Ver especificaciones</button>
                </div>
                <div class="platform-card">
                    <div style="font-size:40px;margin-bottom:8px;">📘</div>
                    <h3 style="margin-bottom:6px;">Facebook</h3>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">Video 16:9 • Carrusel • Posts largos</div>
                    <button class="btn-primary btn-sm" onclick="verPlataforma('facebook')" style="width: 100%;">Ver especificaciones</button>
                </div>
            </div>

            <!-- Plan de publicación con datos reales -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom:20px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px;">
                    <div>
                        <h3 style="margin-bottom: 6px; font-size:14px; font-weight:700;">📋 Mejores momentos para publicar</h3>
                        <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">Recomendaciones personalizadas para <strong>${clientName}</strong> basadas en el histórico de métricas y el comportamiento reciente.</p>
                    </div>
                    <div style="font-size:12px;color:#374151;background:white;padding:10px 14px;border-radius:999px;border:1px solid #d1d5db;">Últimos 30 días: <strong>${totalRecent}</strong> publicaciones · Frecuencia actual: <strong>${currentOverall}</strong>/semana</div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
                    ${scheduleCardsHtml}
                </div>
                <div style="margin-top:16px;font-size:12px;color:#4b5563;">
                    <strong>Meta recomendada:</strong> Publicar alrededor de <strong>${recommendedOverall}</strong> veces por semana en total para mantener el crecimiento orgánico y el ritmo de publicación del cliente.
                </div>
            </div>

            <!-- Panel de optimización — se llena al seleccionar contenido -->
            <div id="optimization-panel" style="display:none;background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;">
                <div id="optimization-content"></div>
            </div>
        </div>
    `;

    // Actualizar previews + análisis de optimización al seleccionar contenido
    window.actualizarPreviews = function() {
        var select    = document.getElementById('platform-content-select');
        var contentId = select ? select.value : '';
        var panel     = document.getElementById('optimization-panel');
        var panelBody = document.getElementById('optimization-content');
        if (!panel || !panelBody) return;

        if (!contentId) { panel.style.display = 'none'; return; }

        var content = (window.appData && window.appData.calendar || []).find(function(c){ return c.id == contentId; });
        if (!content) { panel.style.display = 'none'; return; }

        panel.style.display = 'block';

        var hasM = !!content.metrics;
        var cal  = (window.appData && window.appData.calendar) ? window.appData.calendar : [];

        // Calcular promedios del tipo de este contenido para comparar
        var sameType = cal.filter(function(c){ return c.type === content.type && c.metrics; });
        var avgReach = 0;
        if (sameType.length) {
            avgReach = Math.round(sameType.reduce(function(s,c){
                return s + ((c.metrics.instagram?c.metrics.instagram.reach||0:0)+(c.metrics.facebook?c.metrics.facebook.reach||0:0));
            }, 0) / sameType.length);
        }

        var thisReach = hasM
            ? ((content.metrics.instagram?content.metrics.instagram.reach||0:0)+(content.metrics.facebook?content.metrics.facebook.reach||0:0))
            : null;

        var vsPromedio = (thisReach && avgReach)
            ? (thisReach > avgReach ? '↑ ' + Math.round((thisReach/avgReach-1)*100) + '% sobre promedio' : '↓ ' + Math.round((1-thisReach/avgReach)*100) + '% bajo promedio')
            : null;

        // Análisis de qué funcionó, qué no y qué mejorar
        var funcionoBien = [];
        var noFunciono   = [];
        var mejorar      = [];

        if (hasM) {
            var dms = (content.metrics.instagram?content.metrics.instagram.dms||0:0)+(content.metrics.facebook?content.metrics.facebook.messages||0:0);
            var eng = (content.metrics.instagram?(content.metrics.instagram.likes||0)+(content.metrics.instagram.comments||0):0)
                    + (content.metrics.facebook?(content.metrics.facebook.reactions||0)+(content.metrics.facebook.comments||0):0);

            if (thisReach > avgReach * 1.2) funcionoBien.push('Alcance superior al promedio de ' + content.type + 's (' + thisReach.toLocaleString() + ' vs avg ' + avgReach.toLocaleString() + ')');
            if (dms > 5)                    funcionoBien.push('Generó ' + dms + ' DMs — alto nivel de conversación directa');
            if (content.metrics.videoMetrics && content.metrics.videoMetrics.retentionPercent >= 60) funcionoBien.push('Retención de ' + content.metrics.videoMetrics.retentionPercent + '% — audiencia comprometida hasta el final');
            if (eng > 50)                   funcionoBien.push('Buen engagement: ' + eng + ' interacciones totales');

            if (thisReach < avgReach * 0.8) noFunciono.push('Alcance por debajo del promedio del tipo (' + thisReach.toLocaleString() + ' vs avg ' + avgReach.toLocaleString() + ')');
            if (dms === 0)                  noFunciono.push('Sin DMs generados — el CTA no impulsó conversación directa');
            if (content.metrics.videoMetrics && content.metrics.videoMetrics.retentionPercent < 40) noFunciono.push('Retención baja (' + content.metrics.videoMetrics.retentionPercent + '%) — la audiencia abandonó antes del final');
            if (eng < 10)                   noFunciono.push('Engagement bajo — el contenido no generó suficiente reacción');
        }

        // Sugerencias siempre presentes
        var prod = content.produccion || {};
        if (!prod.plataformas || !prod.plataformas.tiktok || !prod.plataformas.tiktok.copy) mejorar.push('Agregar copy específico para TikTok — actualmente reutiliza el de Instagram');
        if (!content.hasAds && content.type === 'reel') mejorar.push('Probar con presupuesto de ads en este reel para amplificar el alcance orgánico');
        if (content.type === 'reel' && (!prod.scenes || !prod.scenes.length)) mejorar.push('Completar la escaleta por escenas para mejorar la coherencia visual del reel');
        if (!hasM) mejorar.push('Cargar las métricas reales de esta publicación para habilitar el análisis completo');

        // Construir HTML del panel
        var html = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;">'
            + '<h3 style="font-size:14px;font-weight:700;color:#111827;margin:0;">🔍 Análisis de optimización</h3>'
            + '<span style="font-size:11px;background:#F3F4F6;color:#6B7280;padding:3px 10px;border-radius:20px;">' + content.title.substring(0,40) + (content.title.length>40?'...':'') + '</span>'
            + (vsPromedio ? '<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:' + (vsPromedio.startsWith('↑')?'#ECFDF5':'#FEF2F2') + ';color:' + (vsPromedio.startsWith('↑')?'#065F46':'#991B1B') + ';">' + vsPromedio + '</span>' : '')
            + '</div>';

        if (!hasM) {
            html += '<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:14px;font-size:12px;color:#92400E;margin-bottom:14px;">'
                + '⚠️ Esta publicación no tiene métricas cargadas. El análisis es parcial. '
                + '<button onclick="openMetricsModal(' + content.id + ')" class="btn-primary btn-sm" style="margin-left:8px;">Cargar métricas</button>'
                + '</div>';
        }

        if (funcionoBien.length) {
            html += '<div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:14px;margin-bottom:10px;">'
                + '<div style="font-size:12px;font-weight:700;color:#065F46;margin-bottom:8px;">✅ Qué funcionó bien</div>'
                + funcionoBien.map(function(t){ return '<div style="font-size:12px;color:#047857;margin-bottom:4px;">• ' + t + '</div>'; }).join('')
                + '</div>';
        }

        if (noFunciono.length) {
            html += '<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:14px;margin-bottom:10px;">'
                + '<div style="font-size:12px;font-weight:700;color:#991B1B;margin-bottom:8px;">❌ Qué no funcionó</div>'
                + noFunciono.map(function(t){ return '<div style="font-size:12px;color:#B91C1C;margin-bottom:4px;">• ' + t + '</div>'; }).join('')
                + '</div>';
        }

        if (mejorar.length) {
            html += '<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:14px;">'
                + '<div style="font-size:12px;font-weight:700;color:#1D4ED8;margin-bottom:8px;">💡 Qué implementar para mejorar</div>'
                + mejorar.map(function(t){ return '<div style="font-size:12px;color:#1E40AF;margin-bottom:4px;">• ' + t + '</div>'; }).join('')
                + '</div>';
        }

        // ── OPCIONES DE CONTENIDO SUGERIDAS ────────────────
        html += _buildContentSuggestions(content, funcionoBien, noFunciono);

        panelBody.innerHTML = html;
    };

    // ── GENERADOR DE OPCIONES DE CONTENIDO MEJORADO ────
    function _buildContentSuggestions(content, funcionoBien, noFunciono) {
        var tipo  = content.type || 'reel';
        var title = content.title || '';
        var obj   = content.objective || 'educativo';

        // Aprender de lo que funcionó/no funcionó para sugerir variantes
        var bajoAlcance = noFunciono.some(function(t){ return t.toLowerCase().includes('alcance'); });
        var bajoDMs     = noFunciono.some(function(t){ return t.toLowerCase().includes('dm'); });
        var bajaRet     = noFunciono.some(function(t){ return t.toLowerCase().includes('retención'); });
        var bienAlcance = funcionoBien.some(function(t){ return t.toLowerCase().includes('alcance'); });

        // Sugerencias según diagnóstico
        var sugerencias = [];

        if (tipo === 'reel') {
            if (bajoAlcance || bajaRet) {
                sugerencias.push({
                    icon: '🎣',
                    titulo: 'Versión con hook más fuerte',
                    descripcion: 'Grabá la misma idea pero empezá con una pregunta directa o afirmación polémica. El hook define el watch time de los primeros 3 segundos.',
                    formato: 'Reel',
                    objetivo: 'alcance',
                    accion: 'Usar de referencia'
                });
            }
            if (bajoDMs) {
                sugerencias.push({
                    icon: '📩',
                    titulo: 'Reel con CTA de conversación directa',
                    descripcion: 'Misma temática pero el CTA final debe ser una palabra clave en DM ("Escribime CONSULTA") en lugar de solo comentarios. Los DMs convierten 3x más.',
                    formato: 'Reel',
                    objetivo: 'conversion',
                    accion: 'Aplicar CTA'
                });
            }
            sugerencias.push({
                icon: '📊',
                titulo: 'Convertilo en carrusel educativo',
                descripcion: 'El mismo tema como carrusel "guardable" genera el doble de alcance orgánico por compartidos y guardados que impulsan el algoritmo.',
                formato: 'Carrusel',
                objetivo: 'educativo',
                accion: 'Crear carrusel'
            });
        } else if (tipo === 'carousel') {
            if (bajoAlcance) {
                sugerencias.push({
                    icon: '🎬',
                    titulo: 'Transformalo en reel de 30s',
                    descripcion: 'Resumí el punto más importante de este carrusel en un reel vertical. Los reels tienen 6x más alcance orgánico que los carruseles en 2026.',
                    formato: 'Reel',
                    objetivo: 'alcance',
                    accion: 'Crear reel'
                });
            }
            sugerencias.push({
                icon: '🔁',
                titulo: 'Versión con portada más impactante',
                descripcion: 'Mantené el contenido interno pero cambiá el slide 1. Probá con una pregunta directa o una estadística impactante como título de portada.',
                formato: 'Carrusel',
                objetivo: 'engagement',
                accion: 'Rediseñar portada'
            });
            if (bajoDMs) {
                sugerencias.push({
                    icon: '📲',
                    titulo: 'Serie de Stories interactivas',
                    descripcion: 'Convertí cada slide en una historia con encuesta o pregunta. El sticker interactivo en el slide más relevante puede generar hasta 5x más respuestas.',
                    formato: 'Stories',
                    objetivo: 'engagement',
                    accion: 'Crear stories'
                });
            }
        } else if (tipo === 'stories') {
            if (bajoAlcance) {
                sugerencias.push({
                    icon: '🎬',
                    titulo: 'Expandilo a reel',
                    descripcion: 'El tema de estas stories tiene potencial de alcance mayor. Desarrollalo como reel con guion completo para llegar a audiencia nueva.',
                    formato: 'Reel',
                    objetivo: 'alcance',
                    accion: 'Crear reel'
                });
            }
            sugerencias.push({
                icon: '🗳️',
                titulo: 'Stories con mayor interacción',
                descripcion: 'Agregá más stickers: votación + pregunta abierta + slider en distintas historias. La interacción en stories sube el score del perfil y amplía el alcance orgánico.',
                formato: 'Stories',
                objetivo: 'engagement',
                accion: 'Versión mejorada'
            });
        }

        // Siempre agregar esta si funcionó bien para reforzar el aprendizaje
        if (bienAlcance) {
            sugerencias.push({
                icon: '🌟',
                titulo: 'Línea temática (serie de contenido)',
                descripcion: 'Este tema funcionó. Convertilo en una serie: "Parte 2", "Lo que no dije en el anterior", "Preguntas que me llegaron". Las series generan expectativa y fidelidad.',
                formato: tipo === 'reel' ? 'Reel' : 'Carrusel',
                objetivo: 'awareness',
                accion: 'Crear serie'
            });
        }

        if (!sugerencias.length) return '';

        var FMT_COLORS = { 'Reel':'#FFF7ED','Carrusel':'#EFF6FF','Stories':'#F0FDF4' };
        var FMT_BORDER = { 'Reel':'#FED7AA','Carrusel':'#BFDBFE','Stories':'#A7F3D0' };
        var FMT_TEXT   = { 'Reel':'#C2410C','Carrusel':'#1D4ED8','Stories':'#065F46' };

        var html = '<div style="margin-top:14px;border-top:1px solid #F3F4F6;padding-top:14px;">'
            + '<div style="font-size:12px;font-weight:700;color:#111827;margin-bottom:10px;">🚀 Opciones de contenido para mejorar esta publicación</div>'
            + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">';

        sugerencias.forEach(function(s) {
            var bg = FMT_COLORS[s.formato] || '#F9FAFB';
            var bd = FMT_BORDER[s.formato] || '#E5E7EB';
            var tc = FMT_TEXT[s.formato]   || '#374151';
            html += '<div style="background:' + bg + ';border:1px solid ' + bd + ';border-radius:10px;padding:12px;">'
                + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">'
                + '<span style="font-size:18px;">' + s.icon + '</span>'
                + '<span style="font-size:11px;font-weight:700;color:' + tc + ';background:' + bd + ';padding:2px 8px;border-radius:20px;">' + s.formato + '</span>'
                + '</div>'
                + '<div style="font-size:12px;font-weight:700;color:#111827;margin-bottom:4px;">' + s.titulo + '</div>'
                + '<div style="font-size:11px;color:#6B7280;line-height:1.5;margin-bottom:8px;">' + s.descripcion + '</div>'
                + '<button onclick="_aprenderDeSugerencia(\'' + content.id + '\',\'' + s.formato.toLowerCase() + '\',\'' + s.objetivo + '\')" '
                + 'style="width:100%;padding:5px 10px;background:' + tc + ';color:#fff;border:none;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">'
                + s.accion + ' ✨</button>'
                + '</div>';
        });

        html += '</div></div>';
        return html;
    }

    // Registrar aprendizaje cuando el usuario elige una sugerencia
    window._aprenderDeSugerencia = function(contentId, tipoSugerido, objetivo) {
        var clientId = window.currentAccount || 'bondi-media';
        var key = 'bondi-sugerencias-aprendidas-' + clientId;
        try {
            var data = JSON.parse(localStorage.getItem(key) || '[]');
            data.push({ contentId: contentId, tipoSugerido: tipoSugerido, objetivo: objetivo, fecha: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(data));
        } catch(e) {}
        // Abrir el modal de nuevo contenido con el tipo sugerido pre-seleccionado
        if (typeof openAddContentModal === 'function') {
            openAddContentModal();
            setTimeout(function() {
                var typeEl = document.getElementById('new-type');
                if (typeEl) { typeEl.value = tipoSugerido; if (typeof toggleContentFields === 'function') toggleContentFields(tipoSugerido); }
            }, 200);
        }
        if (typeof showSuccess === 'function') showSuccess('Abrí el modal con el tipo sugerido pre-seleccionado. ¡El sistema aprendió de esta elección!');
    };
    window.verPlataforma = function(plataforma) {
        var select    = document.getElementById('platform-content-select');
        var contentId = select ? select.value : '';
        var cal       = (window.appData && window.appData.calendar) ? window.appData.calendar : [];
        var withM     = cal.filter(function(c){ return c.metrics; });

        // Recalcular mejor horario para el modal
        var top = withM.slice().sort(function(a,b){
            var rA=(a.metrics.instagram?a.metrics.instagram.reach||0:0)+(a.metrics.facebook?a.metrics.facebook.reach||0:0);
            var rB=(b.metrics.instagram?b.metrics.instagram.reach||0:0)+(b.metrics.facebook?b.metrics.facebook.reach||0:0);
            return rB-rA;
        }).slice(0,5);
        var hCts={}; top.forEach(function(c){ if(c.time){ var h=c.time.substring(0,5); hCts[h]=(hCts[h]||0)+1; } });
        var bH = Object.entries(hCts).sort(function(a,b){ return b[1]-a[1]; })[0];
        var dynHour = bH ? bH[0]+'hs' : null;

        var plats = {
            instagram: { nombre:'Instagram', icono:'📸', color:'#e4405f',
                specs: { 'Reel':'9:16, 1080×1920, 30-45 segundos', 'Carrusel':'1:1, 1080×1080, 5-7 slides', 'Hashtags':'Recomendados 5-10 (máx 30)', 'Caption':'Hasta 2.200 caracteres' },
                tips: ['Hook visual en el primer segundo', 'Subtítulos grandes y legibles', 'Música trending sin copyright', 'CTA al final + en comentario fijado'],
                bestHour: dynHour || '20:00hs' },
            tiktok: { nombre:'TikTok', icono:'🎵', color:'#000',
                specs: { 'Video':'9:16, 1080×1920, 21-34 segundos ideal', 'Hashtags':'3-5 hashtags relevantes', 'Descripción':'Máximo 150 caracteres' },
                tips: ['Hook en los primeros 2 segundos', 'Sonidos del momento o tendencias', 'Participar de trends activos', 'Comentario fijado con CTA'],
                bestHour: dynHour || '19:00hs' },
            facebook: { nombre:'Facebook', icono:'📘', color:'#1877f2',
                specs: { 'Video':'16:9 o 9:16, 60-120 segundos', 'Carrusel':'1:1, 5-10 slides', 'Caption':'Hasta 63.000 caracteres' },
                tips: ['Textos más largos funcionan mejor', 'CTA explícito y claro', 'Engagement en comentarios primero', 'Compartir en grupos relevantes del nicho'],
                bestHour: dynHour || '15:00hs' }
        };

        var plat = plats[plataforma];
        var content = contentId ? cal.find(function(c){ return c.id == contentId; }) : null;

        var modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = '<div class="modal-content" style="max-width:580px;">'
            + '<div class="modal-header" style="border-bottom-color:' + plat.color + ';">'
            + '<h3 class="modal-title">' + plat.icono + ' ' + plat.nombre + '</h3>'
            + '<button class="modal-close" onclick="this.closest(\'.modal\').remove()">×</button>'
            + '</div>'
            + '<div style="padding:20px;">'
            + (content ? '<div style="background:#F3F4F6;padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px;"><strong>Publicación:</strong> ' + content.title + '</div>' : '')
            + '<h4 style="margin-bottom:12px;font-size:13px;">📏 Especificaciones técnicas</h4>'
            + '<div style="background:#F9FAFB;padding:14px;border-radius:8px;margin-bottom:16px;">'
            + Object.entries(plat.specs).map(function(e){ return '<div style="margin-bottom:6px;font-size:13px;"><strong>' + e[0] + ':</strong> ' + e[1] + '</div>'; }).join('')
            + '</div>'
            + '<h4 style="margin-bottom:12px;font-size:13px;">💡 Tips para ' + plat.nombre + '</h4>'
            + '<ul style="padding-left:18px;margin-bottom:16px;">'
            + plat.tips.map(function(t){ return '<li style="margin-bottom:6px;font-size:13px;">' + t + '</li>'; }).join('')
            + '</ul>'
            + '<div style="background:#E0F2FE;padding:12px;border-radius:8px;font-size:13px;">'
            + '<strong>⏰ Mejor horario ' + (withM.length ? '(datos reales)' : '(promedio general)') + ':</strong> ' + plat.bestHour
            + (withM.length ? '' : ' <span style="font-size:11px;color:#0369A1;">— Cargá métricas para personalizar.</span>')
            + '</div>'
            + '</div>'
            + '<div style="display:flex;gap:10px;justify-content:flex-end;padding:16px 20px;border-top:1px solid #E5E7EB;">'
            + '<button class="btn-secondary" onclick="this.closest(\'.modal\').remove()">Cerrar</button>'
            + '</div>'
            + '</div>';
        document.body.appendChild(modal);
    };
};

console.log('✅ Optimizador Multiplataforma cargado');