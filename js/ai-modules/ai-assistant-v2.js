// ==================================================
// ASISTENTE IA - VERSIÓN OPTIMIZADA
// ==================================================

console.log('🤖 Cargando Asistente IA Optimizado...');

// Configuración inteligente
const AI_CONFIG = {
    mode: window.location.hostname === 'localhost' || 
          window.location.hostname === '127.0.0.1' 
          ? 'demo' 
          : 'production',
    apiUrl: 'https://api.bondimedia.com/ai',
    cacheEnabled: true,
    maxCacheAge: 24 * 60 * 60 * 1000, // 24 horas
    retryAttempts: 3
};

// ==================================================
// ANALIZADOR DE CONTENIDO
// ==================================================
class ContentAnalyzer {
    constructor() {
        this.data = window.appData?.calendar || [];
    }
    
    getStats() {
        const total = this.data.length;
        const withMetrics = this.data.filter(c => c.metrics).length;
        const reels = this.data.filter(c => c.type === 'reel').length;
        const carousels = this.data.filter(c => c.type === 'carousel').length;
        const stories = this.data.filter(c => c.type === 'stories').length;
        
        return { total, withMetrics, reels, carousels, stories };
    }
    
    getBestReels() {
        return this.data
            .filter(c => c.type === 'reel' && c.metrics?.videoMetrics)
            .sort((a, b) => 
                (b.metrics.videoMetrics.retentionPercent || 0) - 
                (a.metrics.videoMetrics.retentionPercent || 0)
            )
            .slice(0, 5);
    }
    
    getPopularTopics() {
        const topics = {};
        this.data.forEach(item => {
            const words = item.title.toLowerCase().split(' ');
            words.forEach(word => {
                if (word.length > 3) {
                    topics[word] = (topics[word] || 0) + 1;
                }
            });
        });
        
        return Object.entries(topics)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([topic, count]) => ({ topic, count }));
    }
    
    getRecommendations() {
        const recommendations = [];
        const stats = this.getStats();
        
        if (stats.withMetrics === 0) {
            recommendations.push({
                type: 'data',
                title: '📊 Comienza a medir',
                description: 'Agregá métricas a tus publicaciones para obtener recomendaciones personalizadas.',
                priority: 'alta'
            });
        }
        
        const bestReels = this.getBestReels();
        if (bestReels.length > 0) {
            recommendations.push({
                type: 'insight',
                title: '🎯 Lo que funciona',
                description: `Tus mejores reels tienen retención de ${bestReels[0].metrics.videoMetrics.retentionPercent}%. Analizá su estructura.`,
                examples: bestReels.slice(0, 2).map(r => r.title),
                priority: 'media'
            });
        }
        
        return recommendations;
    }
}

// ==================================================
// GENERADOR DE CONTENIDO
// ==================================================
class ContentGenerator {
    constructor(analyzer) {
        this.analyzer = analyzer;
        this.templates = this.loadTemplates();
    }
    
    loadTemplates() {
        return {
            reel: {
                hooks: [
                    "Si querés dejar de publicar por publicar, mirá esto sobre {tema}",
                    "¿Por qué {tema} debería ser parte de tu estrategia real?",
                    "Esto es lo que pasa cuando {tema} no está alineado con tu marca",
                    "Tu próxima publicación sobre {tema} debe decir esto",
                    "Así se hace {tema} cuando el objetivo es tener resultados reales"
                ],
                bodies: [
                    "En este post te explico por qué {tema} importa y qué hacer para que funcione.",
                    "Esto no es solo teoría: aplicá estas ideas para que {tema} deje de ser contenido perdido.",
                    "Te muestro la forma más clara de abordar {tema} y generar impacto real.",
                    "Este contenido está pensado para ayudarte a transformar {tema} en una estrategia con sentido."
                ],
                ctas: [
                    "👉 Escribí {keyword} para recibir la guía completa",
                    "💬 Contame si querés un ejemplo real de {tema}",
                    "📌 Guardá este post si querés mejorar tu estrategia",
                    "🔄 Compartí esto con quien necesite mejorar su {tema}"
                ]
            },
            carousel: {
                structures: [
                    {
                        name: "Educativo",
                        slides: [
                            "Introducción al problema",
                            "Dato curioso/Estadística",
                            "Solución paso 1",
                            "Solución paso 2",
                            "Solución paso 3",
                            "Ejemplo práctico",
                            "Conclusión y CTA"
                        ]
                    },
                    {
                        name: "Lista",
                        slides: [
                            "Título llamativo",
                            "Punto #1",
                            "Punto #2", 
                            "Punto #3",
                            "Punto #4",
                            "Resumen",
                            "CTA"
                        ]
                    }
                ]
            }
        };
    }
    
    generateReel(topic, audience, keyword) {
        // Versión legacy (templates) — se mantiene como fallback
        const hooks = this.templates.reel.hooks;
        const bodies = this.templates.reel.bodies;
        const ctas = this.templates.reel.ctas;
        const hook = hooks[Math.floor(Math.random() * hooks.length)]
            .replace('{tema}', topic).replace('{objetivo}', 'mejorar ' + topic).replace('{competencia}', 'la competencia');
        const body = bodies[Math.floor(Math.random() * bodies.length)]
            .replace('{tema}', topic)
            .replace('{numero}', '50')
            .replace('{conclusion}', 'la mejor forma de abordar ' + topic);
        const cta = ctas[Math.floor(Math.random() * ctas.length)]
            .replace('{keyword}', keyword)
            .replace('{pregunta}', 'cómo mejorás tu ' + topic + '?')
            .replace('{tema}', topic);
        return { hook, body, cta, full: hook + '\n\n' + body + '\n\n' + cta };
    }
    
    generateMultiple(topic, type, count = 3) {
        const options = [];
        for (let i = 0; i < count; i++) {
            if (type === 'reel') {
                options.push(this.generateReel(topic, 'tu audiencia', 'INFO'));
            }
        }
        return options;
    }
}

// ==================================================
// SISTEMA DE CACHÉ
// ==================================================
class AICache {
    constructor() {
        this.prefix = 'ai-cache-';
        this.maxAge = AI_CONFIG.maxCacheAge;
    }
    
    get(key) {
        const cached = localStorage.getItem(this.prefix + key);
        if (!cached) return null;
        
        try {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < this.maxAge) {
                return data.value;
            }
        } catch (e) {
            console.warn('Cache corrupto:', e);
        }
        return null;
    }
    
    set(key, value) {
        const data = {
            timestamp: Date.now(),
            value: value
        };
        localStorage.setItem(this.prefix + key, JSON.stringify(data));
    }
    
    clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => localStorage.removeItem(key));
    }
}

// ==================================================
// INTERFAZ DE USUARIO MEJORADA
// ==================================================
class AIAssistantUI {
    constructor() {
        this.analyzer = new ContentAnalyzer();
        this.generator = new ContentGenerator(this.analyzer);
        this.cache = new AICache();
        this.currentDepartment = 'writer'; // Por defecto: Guionista
    }

    setDepartment(deptId) {
        this.currentDepartment = deptId;
        this.render();
        if (typeof showSuccess === 'function') {
            const dept = window.AI_DEPARTMENTS[deptId];
            showSuccess('Consultando con: ' + dept.icon + ' ' + dept.name);
        }
    }
    
    render() {
        console.log('🎨 Renderizando Asistente IA (v2)...');
        const container = document.getElementById('ai-assistant-card');
        if (!container) {
            console.warn('⚠️ No se encontró #ai-assistant-card para renderizar');
            return;
        }
        
        let stats = { total: 0, withMetrics: 0, reels: 0, carousels: 0, stories: 0 };
        let recommendations = [];

        try {
            stats = this.analyzer.getStats();
            recommendations = this.analyzer.getRecommendations();
        } catch (e) {
            console.error('❌ Error al obtener estadísticas:', e);
        }
        
        container.innerHTML = `
            <style>
                .ai-optimized {
                    padding: 20px;
                }
                .ai-stats-mini {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .ai-stat-mini {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    text-align: center;
                }
                .ai-stat-mini-value {
                    font-size: 20px;
                    font-weight: 700;
                }
                .ai-stat-mini-label {
                    font-size: 11px;
                    opacity: 0.9;
                }
                .ai-recommendations {
                    margin-bottom: 20px;
                }
                .ai-recommendation {
                    background: white;
                    border-left: 4px solid var(--primary);
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                }
                .ai-tabs-modern {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    border-bottom: 2px solid var(--gray-200);
                    padding-bottom: 10px;
                }
                .ai-tab-modern {
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .ai-tab-modern:hover {
                    background: var(--gray-100);
                }
                .ai-tab-modern.active {
                    background: var(--primary);
                    color: white;
                }
                .ai-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                }
                .ai-option-card {
                    background: white;
                    border: 1px solid var(--gray-200);
                    border-radius: 12px;
                    padding: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ai-option-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border-color: var(--primary);
                }
                .ai-option-preview {
                    background: var(--gray-50);
                    padding: 10px;
                    border-radius: 6px;
                    margin: 10px 0;
                    font-size: 12px;
                    color: var(--gray-700);
                }
                .ai-badge-smart {
                    background: #10b981;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    display: inline-block;
                }
            </style>
            
            <div class="ai-optimized">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="font-size: 18px;">🤖 Asistente IA Optimizado</h3>
                    <span class="ai-badge-smart">Modo ${AI_CONFIG.mode === 'demo' ? 'Demostración' : 'Producción'}</span>
                </div>

                <!-- SELECTOR DE DEPARTAMENTOS -->
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 11px; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 10px;">🏢 Consultar Departamento</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        ${Object.values(window.AI_DEPARTMENTS).map(dept => `
                            <div class="ai-dept-chip ${this.currentDepartment === dept.id ? 'active' : ''}" 
                                 onclick="window.aiUI.setDepartment('${dept.id}')"
                                 title="${dept.expertise}">
                                <span style="font-size: 16px;">${dept.icon}</span>
                                <span style="font-size: 10px; font-weight: 600;">${dept.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <style>
                    .ai-dept-chip {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                        padding: 8px;
                        background: white;
                        border: 1.5px solid var(--gray-200);
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.2s;
                        text-align: center;
                    }
                    .ai-dept-chip:hover {
                        border-color: var(--primary);
                        background: var(--gray-50);
                    }
                    .ai-dept-chip.active {
                        border-color: var(--primary);
                        background: var(--primary-50);
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    }
                </style>
                
                <div class="ai-stats-mini">
                    <div class="ai-stat-mini">
                        <div class="ai-stat-mini-value">${stats.total}</div>
                        <div class="ai-stat-mini-label">Total Posts</div>
                    </div>
                    <div class="ai-stat-mini" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                        <div class="ai-stat-mini-value">${stats.reels}</div>
                        <div class="ai-stat-mini-label">Reels</div>
                    </div>
                    <div class="ai-stat-mini" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                        <div class="ai-stat-mini-value">${stats.carousels + stats.stories}</div>
                        <div class="ai-stat-mini-label">Otros</div>
                    </div>
                </div>
                
                ${recommendations.length > 0 ? `
                    <div class="ai-recommendations">
                        ${recommendations.map(rec => `
                            <div class="ai-recommendation">
                                <strong>${rec.title}</strong>
                                <p style="font-size: 13px; margin-top: 5px;">${rec.description}</p>
                                ${rec.examples ? `
                                    <div style="font-size: 11px; color: var(--gray-600); margin-top: 5px;">
                                        Ej: ${rec.examples.join(', ')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="ai-tabs-modern">
                    <div class="ai-tab-modern active" onclick="window.aiUI.switchTab('generator')">✨ Generar</div>
                    <div class="ai-tab-modern" onclick="window.aiUI.switchTab('analyze')">🔍 Analizar hook</div>
                    <div class="ai-tab-modern" onclick="window.aiUI.switchTab('tips')">💡 Tips</div>
                    <div class="ai-tab-modern" onclick="window.aiUI.switchTab('learn')">🎓 Aprender</div>
                </div>
                
                <div id="ai-dynamic-content">
                    ${this.renderGeneratorTab()}
                </div>
            </div>
        `;
    }
    
    renderGeneratorTab() {
        const hasKey = !!(localStorage.getItem('bondi-openai-key') || localStorage.getItem('bondi-claude-key'));
        const ctx = typeof window.buildEnrichedContext === 'function' ? window.buildEnrichedContext() : {};
        const accountName = ctx.account?.name || 'este cliente';
        return '<div>'
            + (!hasKey ? '<div style="background:#fef3c7;padding:10px 14px;border-radius:8px;margin-bottom:12px;font-size:13px;color:#92400e;border-left:3px solid #f59e0b;">⚠️ Sin API key configurada — la IA usa modo demo. Configurala en <strong>⚙️ Configuración → Inteligencia Artificial</strong>.</div>' : '')
            + '<div style="background:var(--gray-50);padding:12px 14px;border-radius:8px;margin-bottom:14px;font-size:13px;color:var(--gray-600);">Generando para: <strong>' + accountName + '</strong> — el copy se personaliza con el historial y el briefing del cliente activo.</div>'
            + '<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;margin-bottom:10px;">'
            + '<input type="text" class="form-input" id="ai-topic" placeholder="Tema (ej: 5 errores en branding)" style="font-size:13px;">'
            + '<select class="form-select" id="ai-type" style="font-size:13px;">'
            + '<option value="reel">🎬 Reel</option>'
            + '<option value="carousel">📊 Carrusel</option>'
            + '<option value="stories">📲 Stories</option>'
            + '</select>'
            + '<select class="form-select" id="ai-objetivo" style="font-size:13px;">'
            + '<option value="conversion">Conversión</option>'
            + '<option value="educativo">Educativo</option>'
            + '<option value="engagement">Engagement</option>'
            + '<option value="awareness">Awareness</option>'
            + '<option value="brand">Marca</option>'
            + '</select>'
            + '</div>'
            + '<button class="btn-primary" onclick="window.aiUI.generate()" style="width:100%;margin-bottom:16px;">✨ Generar con IA</button>'
            + '<div id="ai-results" class="ai-options"></div>'
            + '</div>';
    }
    
    generateDemoOptions() {
        const options = this.generator.generateMultiple('marketing', 'reel', 3);
        
        return options.map((opt, i) => `
            <div class="ai-option-card" onclick="window.aiUI.selectOption(${i})">
                <div style="display: flex; justify-content: space-between;">
                    <strong>Opción ${i + 1}</strong>
                    <span style="color: var(--gray-500); font-size: 11px;">${i === 0 ? '🔥 Popular' : i === 1 ? '⚡ Directo' : '🎯 Efectivo'}</span>
                </div>
                <div class="ai-option-preview">
                    ${opt.hook.substring(0, 60)}...
                </div>
                <div style="display: flex; gap: 5px; margin-top: 10px;">
                    <span class="badge badge-info" style="font-size: 9px;">Hook</span>
                    <span class="badge badge-success" style="font-size: 9px;">CTA</span>
                </div>
            </div>
        `).join('');
    }
    
    switchTab(tab) {
        document.querySelectorAll('.ai-tab-modern').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        const contentDiv = document.getElementById('ai-dynamic-content');
        if (tab === 'generator') {
            contentDiv.innerHTML = this.renderGeneratorTab();
        } else if (tab === 'analyze') {
            contentDiv.innerHTML = this.renderAnalyzeTab();
        } else if (tab === 'tips') {
            contentDiv.innerHTML = this.renderTipsTab();
        } else {
            contentDiv.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray-500);"><div style="font-size:40px;margin-bottom:15px;">🎓</div><p>Próximamente: análisis de aprendizaje del sistema</p></div>';
        }
    }

    renderAnalyzeTab() {
        return '<div>'
            + '<p style="font-size:13px;color:var(--gray-600);margin-bottom:12px;">Pegá tu hook o copy y la IA lo analiza en el contexto de tu cliente activo.</p>'
            + '<textarea id="ai-hook-input" class="form-input" rows="4" placeholder="Pegá aquí tu hook, título o copy completo..." style="width:100%;box-sizing:border-box;font-size:13px;margin-bottom:8px;"></textarea>'
            + '<button class="btn-primary" onclick="window.aiUI.analyzeHook()" style="width:100%;margin-bottom:16px;">🔍 Analizar con IA</button>'
            + '<div id="ai-analysis-result"></div>'
            + '</div>';
    }

    renderTipsTab() {
        // ── Calcular tips desde métricas reales ─────────────────────────
        var accountId = window.currentAccount || 'bondi-media';
        var calendar  = [];
        try { calendar = JSON.parse(localStorage.getItem('bondi-calendar-' + accountId) || '[]'); } catch(e) {}

        var withM = calendar.filter(function(c){ return c.metrics && c.metrics.instagram; });

        // Mejor horario
        var hourMap = {};
        withM.forEach(function(c) {
            if (!c.time) return;
            var h = parseInt(c.time.split(':')[0]);
            if (!hourMap[h]) hourMap[h] = { reach:0, saves:0, count:0 };
            hourMap[h].reach += c.metrics.instagram.reach || 0;
            hourMap[h].saves += c.metrics.instagram.saves || 0;
            hourMap[h].count++;
        });
        var bestHourVal = null, bestHourScore = -1;
        Object.keys(hourMap).forEach(function(h) {
            var score = (hourMap[h].reach + hourMap[h].saves * 2) / hourMap[h].count;
            if (score > bestHourScore) { bestHourScore = score; bestHourVal = parseInt(h); }
        });
        var bestHour = bestHourVal !== null ? bestHourVal + ':00hs' : '20:00hs';
        var hourSource = bestHourVal !== null ? 'desde tus métricas' : 'referencia del nicho';

        // Mejor día
        var DAYS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
        var dayMap = {};
        withM.forEach(function(c) {
            if (!c.date) return;
            var d = DAYS[new Date(c.date + 'T00:00:00').getDay()];
            if (!dayMap[d]) dayMap[d] = { reach:0, count:0 };
            dayMap[d].reach += c.metrics.instagram.reach || 0;
            dayMap[d].count++;
        });
        var bestDayVal = null, bestDayScore = -1;
        Object.keys(dayMap).forEach(function(d) {
            var score = dayMap[d].reach / dayMap[d].count;
            if (score > bestDayScore) { bestDayScore = score; bestDayVal = d; }
        });
        var bestDay = bestDayVal || 'Jueves';
        var daySource = bestDayVal ? 'desde tus métricas' : 'referencia del nicho';

        // Mejor formato
        var typeMap = {};
        withM.forEach(function(c) {
            var t = c.type || 'reel';
            if (!typeMap[t]) typeMap[t] = { score:0, count:0 };
            typeMap[t].score += (c.metrics.instagram.reach || 0) + (c.metrics.instagram.saves || 0)*2;
            typeMap[t].count++;
        });
        var bestTypeKey = null, bestTypeScore = -1;
        Object.keys(typeMap).forEach(function(t) {
            var s = typeMap[t].score / typeMap[t].count;
            if (s > bestTypeScore) { bestTypeScore = s; bestTypeKey = t; }
        });
        var typeLabels = { reel:'Reel 🎬', carousel:'Carrusel 📊', stories:'Stories 📲' };
        var bestFormat = bestTypeKey ? (typeLabels[bestTypeKey] || bestTypeKey) : 'Reel 🎬';
        var formatSource = bestTypeKey ? 'desde tus métricas' : 'referencia del nicho';

        // Alcance promedio
        var avgReach = withM.length
            ? Math.round(withM.reduce(function(s,c){ return s + (c.metrics.instagram.reach||0); },0) / withM.length)
            : null;

        // Guardados promedio
        var avgSaves = withM.length
            ? Math.round(withM.reduce(function(s,c){ return s + (c.metrics.instagram.saves||0); },0) / withM.length)
            : null;

        // Hook rotativo diario
        var hooks = [
            '¿Sabías que el 90% de [profesión] comete este error?',
            'Lo que nadie te cuenta sobre [tema]...',
            '3 cosas que cambiarán tu [resultado] para siempre',
            'El error que cometí y que vos podés evitar',
            'Por qué todos hablan de [tema] y nadie lo hace bien',
            'Si hacés esto, tus resultados mejorarán en 30 días',
            'La verdad incómoda sobre [tema] en redes'
        ];
        var hookIdx  = Math.floor(Date.now() / (1000*60*60*24)) % hooks.length;
        var todayHook = hooks[hookIdx];

        // ── Construir HTML ───────────────────────────────────────────────
        var noData = withM.length === 0;
        var banner = noData
            ? '<div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:10px 14px;font-size:12px;color:#92400E;margin-bottom:14px;">⚠️ Todavía no hay métricas cargadas para este cliente. Los valores son referencias del nicho — se actualizarán automáticamente cuando cargues métricas en el calendario.</div>'
            : '<div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:10px;padding:10px 14px;font-size:12px;color:#065F46;margin-bottom:14px;">✅ Calculado desde <strong>' + withM.length + ' publicaciones</strong> con métricas de este cliente.</div>';

        var cards = [
            { bg:'#ECFDF5', icon:'⏰', label:'Mejor horario para publicar', value: bestHour, sub: hourSource },
            { bg:'#EFF6FF', icon:'📅', label:'Mejor día de la semana',      value: bestDay,   sub: daySource  },
            { bg:'#FFF7ED', icon:'🏆', label:'Formato más efectivo',        value: bestFormat,sub: formatSource},
            { bg:'#FEF3C7', icon:'🎯', label:'Hook del día',                value: '"' + todayHook + '"', sub: 'rota cada 24 horas' },
        ];
        if (avgReach !== null) cards.push({ bg:'#F5F3FF', icon:'📊', label:'Alcance promedio IG', value: avgReach > 999 ? (avgReach/1000).toFixed(1)+'K' : avgReach, sub: 'últimas publicaciones con métricas' });
        if (avgSaves !== null) cards.push({ bg:'#ECFDF5', icon:'💾', label:'Guardados promedio IG', value: avgSaves, sub: 'indicador de contenido valioso' });

        return '<div style="padding:4px 0;">'
            + banner
            + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:18px;">'
            + cards.map(function(c) {
                return '<div style="background:' + c.bg + ';border-radius:12px;padding:16px;">'
                    + '<div style="font-size:20px;margin-bottom:4px;">' + c.icon + '</div>'
                    + '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#374151;margin-bottom:6px;">' + c.label + '</div>'
                    + '<div style="font-size:17px;font-weight:700;color:#0D1117;line-height:1.3;margin-bottom:4px;">' + c.value + '</div>'
                    + '<div style="font-size:10px;color:#9CA3AF;">' + c.sub + '</div>'
                    + '</div>';
            }).join('')
            + '</div>'
            + '<div style="border-top:1px solid #E5E7EB;padding-top:14px;">'
            + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:10px;">Recomendaciones basadas en el historial</div>'
            + this._buildRecs(withM)
            + '</div>'
            + '</div>';
    }

    _buildRecs(withM) {
        var recs = [];
        if (!withM.length) {
            return '<div style="font-size:13px;color:#9CA3AF;">Cargá métricas en el calendario para ver recomendaciones personalizadas.</div>';
        }
        var avgSaves   = withM.reduce(function(s,c){ return s+(c.metrics.instagram.saves||0);   },0) / withM.length;
        var avgComments= withM.reduce(function(s,c){ return s+(c.metrics.instagram.comments||0);},0) / withM.length;
        var avgReach   = withM.reduce(function(s,c){ return s+(c.metrics.instagram.reach||0);   },0) / withM.length;

        if (avgSaves < 15)    recs.push({ icon:'💾', title:'Potenciá los guardados', desc:'Tu promedio de guardados es bajo ('+ Math.round(avgSaves) +'). Terminá los Reels con una instrucción clara de guardar — "Guardalo para cuando lo necesites". Los posts con CTA de guardado tienen hasta 3x más saves.' });
        if (avgComments < 5)  recs.push({ icon:'💬', title:'Generá más comentarios', desc:'Promedio de comentarios: '+ Math.round(avgComments) +'. Terminá tus publicaciones con una pregunta abierta. Respondé cada comentario en la primera hora — Instagram lo interpreta como contenido relevante y amplía el alcance.' });
        if (avgReach < 1000)  recs.push({ icon:'📈', title:'Aumentá el alcance', desc:'El alcance promedio es '+ Math.round(avgReach) +'. Probá publicar en el mejor horario detectado y usá más hashtags de nicho. Los Reels tienen mayor alcance orgánico que los carruseles en este momento.' });

        // Formato con mejor performance
        var typeMap = {};
        withM.forEach(function(c) {
            var t = c.type||'reel';
            if (!typeMap[t]) typeMap[t] = { s:0, n:0 };
            typeMap[t].s += (c.metrics.instagram.reach||0) + (c.metrics.instagram.saves||0)*2;
            typeMap[t].n++;
        });
        var bestT = Object.keys(typeMap).sort(function(a,b){ return typeMap[b].s/typeMap[b].n - typeMap[a].s/typeMap[a].n; })[0];
        var bestLabels = { reel:'Reels', carousel:'Carruseles', stories:'Stories' };
        if (bestT) recs.push({ icon:'🎯', title:'Apostá más a ' + (bestLabels[bestT]||bestT), desc:'Tu mejor formato por performance es <strong>' + (bestLabels[bestT]||bestT) + '</strong>. Te recomendamos aumentar la frecuencia de este tipo en el próximo mes.' });

        if (!recs.length) recs.push({ icon:'✅', title:'Todo en orden', desc:'Tus métricas están por encima de los promedios. Seguí con la misma frecuencia y tipo de contenido.' });

        return recs.map(function(r) {
            return '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:10px;padding:12px 14px;margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;">'
                + '<span style="font-size:18px;flex-shrink:0;">' + r.icon + '</span>'
                + '<div><div style="font-size:12px;font-weight:700;color:#0D1117;margin-bottom:3px;">' + r.title + '</div>'
                + '<div style="font-size:12px;color:#6B7280;line-height:1.5;">' + r.desc + '</div></div>'
                + '</div>';
        }).join('');
    }

    async analyzeHook() {
        const input  = document.getElementById('ai-hook-input')?.value?.trim();
        const result = document.getElementById('ai-analysis-result');
        if (!input) { alert('Ingresá el texto a analizar'); return; }
        if (!result) return;

        result.innerHTML = '<div style="text-align:center;padding:20px;color:var(--gray-500);">⏳ Analizando...</div>';

        const hasKey = !!(localStorage.getItem('bondi-openai-key') || localStorage.getItem('bondi-claude-key'));
        if (!hasKey || typeof window.callClaudeAPI !== 'function') {
            result.innerHTML = '<div style="background:#fef3c7;padding:12px;border-radius:8px;font-size:13px;color:#92400e;">⚠️ Configurá tu API key para obtener análisis real.</div>';
            return;
        }

        const ctx = typeof window.buildEnrichedContext === 'function' ? window.buildEnrichedContext() : {};
        const account = ctx.account || { name: 'el cliente', industry: 'no especificado' };
        const tono    = ctx.lastBriefing?.tone || 'profesional pero cercano';

        const dept = window.AI_DEPARTMENTS[this.currentDepartment];
        const systemPrompt = dept.systemPrompt + '\n' + (window.DepartmentBus?.getLastResponse() ? 'IMPORTANTE: Estás colaborando con otro departamento. Revisá el contexto previo.' : '');
        
        let userPrompt   = 'Analizá este copy/hook para ' + account.name + ' (' + (account.industry || 'sin industria') + '), tono: ' + tono + ':\n\n"' + input + '"\n\n'
            + 'Dame: 1) PUNTUACIÓN (0-10) con justificación desde tu perspectiva de ' + dept.name + ', 2) FORTALEZAS, 3) DEBILIDADES, 4) TU VERSIÓN MEJORADA DESDE TU EXPERTISE.';

        if (window.DepartmentBus) {
            userPrompt = window.DepartmentBus.getEnrichedPrompt(userPrompt);
        }

        const resp = await window.callClaudeAPI(systemPrompt, userPrompt, { maxTokens: 800, useCache: false });

        if (!resp.ok) {
            result.innerHTML = '<div style="background:#fee2e2;padding:12px;border-radius:8px;font-size:13px;color:#991b1b;">❌ ' + (resp.message || 'Error') + '</div>';
            return;
        }

        result.innerHTML = '<div style="background:white;border:1px solid var(--gray-200);border-radius:10px;padding:16px;">'
            + '<div style="font-size:12px;color:#10b981;font-weight:600;margin-bottom:10px;">✅ Análisis para ' + account.name + '</div>'
            + '<div style="font-size:13px;line-height:1.7;white-space:pre-wrap;">' + resp.text + '</div>'
            + '<button onclick="window.copyHookInput()" style="margin-top:10px;font-size:11px;padding:4px 10px;background:var(--gray-100);border:1px solid var(--gray-200);border-radius:6px;cursor:pointer;">📋 Copiar texto original</button>'
            + '</div>';
    }
    
    async generate() {
        const topic   = document.getElementById('ai-topic')?.value?.trim() || 'marketing de contenidos';
        const type    = document.getElementById('ai-type')?.value || 'reel';
        const results = document.getElementById('ai-results');
        const objetivo = document.getElementById('ai-objetivo')?.value || 'conversion';

        results.innerHTML = '<div style="text-align:center;padding:30px;color:var(--gray-500);">⏳ Generando con IA...</div>';

        // Si no hay API key, usar templates legacy
        const hasKey = !!(localStorage.getItem('bondi-openai-key') || localStorage.getItem('bondi-claude-key'));
        if (!hasKey || typeof window.callClaudeAPI !== 'function') {
            const options = this.generator.generateMultiple(topic, type, 3);
            results.innerHTML = '<div style="background:#fef3c7;padding:10px 14px;border-radius:8px;margin-bottom:12px;font-size:13px;color:#92400e;">⚠️ Usando modo demo — configurá tu API key en Configuración para obtener copies reales con IA.</div>'
                + options.map((opt, i) => '<div class="ai-option-card"><strong>Opción ' + (i+1) + '</strong><div class="ai-option-preview">' + opt.hook + '</div><div style="margin-top:8px;font-size:12px;color:var(--gray-600);">CTA: ' + opt.cta + '</div></div>').join('');
            return;
        }

        // Construir contexto enriquecido
        const ctx = typeof window.buildEnrichedContext === 'function' ? window.buildEnrichedContext() : {};
        const account = ctx.account || { name: 'Bondi Media', industry: 'Agencia' };
        const tono    = ctx.lastBriefing?.tone || 'profesional pero cercano';
        const top3str = (ctx.top3 || []).map(c => '"' + c.title + '"').join(', ') || 'sin datos históricos aún';
        const retStr  = ctx.avgRetention ? ctx.avgRetention + '% de retención promedio en reels' : 'sin métricas de retención aún';
        const horario = ctx.bestHour ? 'El mejor horario detectado es a las ' + ctx.bestHour + ':00.' : '';

        const dept = window.AI_DEPARTMENTS[this.currentDepartment];
        const systemPrompt = dept.systemPrompt + '\n'
            + 'Contexto de Bondi Media: Agencia de marketing digital para emprendedores. El cliente activo es ' + account.name + ' (' + (account.industry || 'Rubro no especificado') + '). '
            + 'Tono: ' + tono + '. Mejores contenidos: ' + top3str + '. Retención: ' + retStr + '. ' + horario
            + ' Generás contenido bajo tu expertise específica.';

        const typeLabels = { reel: 'reel de Instagram', carousel: 'carrusel de Instagram', stories: 'stories de Instagram' };
        const objLabels  = { conversion: 'generar consultas o ventas', educativo: 'educar a la audiencia', engagement: 'generar interacción', awareness: 'posicionar la marca', brand: 'mostrar la identidad de marca' };

        let userPrompt = 'Generame 3 opciones de copy para un ' + (typeLabels[type] || type) + ' sobre el tema: "' + topic + '". '
            + 'Objetivo del contenido: ' + (objLabels[objetivo] || objetivo) + '. '
            + 'Como ' + dept.name + ', incluí: HOOK, CUERPO, CTA. '
            + 'Separalas con ---OPCION--- entre cada una. Sin explicaciones adicionales.';

        if (window.DepartmentBus) {
            userPrompt = window.DepartmentBus.getEnrichedPrompt(userPrompt);
        }

        const resp = await window.callClaudeAPI(systemPrompt, userPrompt, { maxTokens: 1200, useCache: false });

        if (!resp.ok) {
            results.innerHTML = '<div style="background:#fee2e2;padding:12px 16px;border-radius:8px;font-size:13px;color:#991b1b;">❌ ' + (resp.message || 'Error al conectar con la IA') + '</div>';
            return;
        }

        // Guardar respuesta para colaboración entre departamentos
        if (window.DepartmentBus) {
            window.DepartmentBus.setLastResponse(resp.text, this.currentDepartment);
        }

        // Parsear las 3 opciones
        const parts = resp.text.split(/---OPCION---/i).map(s => s.trim()).filter(Boolean);
        window._lastAIOptions = parts;

        results.innerHTML = '<div style="background:#d1fae5;padding:8px 14px;border-radius:8px;margin-bottom:12px;font-size:12px;color:#065f46;">✅ Copy generado con IA para ' + account.name + '</div>'
            + parts.map((opt, i) => {
                return '<div class="ai-option-card">'
                    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
                    + '<strong style="font-size:14px;">Opción ' + (i+1) + '</strong>'
                    + '<button onclick="window.aiUI.copyToClipboard(' + i + ')" style="font-size:11px;padding:3px 10px;background:var(--gray-100);border:1px solid var(--gray-200);border-radius:6px;cursor:pointer;">📋 Copiar</button>'
                    + '</div>'
                    + '<div class="ai-option-preview" style="white-space:pre-wrap;font-size:13px;line-height:1.6;">' + opt + '</div>'
                    + '<div style="display:flex;gap:8px;margin-top:10px;">'
                    + '<button onclick="window.aiUI.addToCalendar(' + i + ')" class="btn-secondary btn-sm" style="flex:1;font-size:11px;">📅 Calendario</button>'
                    + '<button onclick="window.aiUI.handOff(' + i + ')" class="btn-secondary btn-sm" style="flex:1;font-size:11px;background:#F0F9FF;border-color:#BAE6FD;color:#0369A1;">🤝 Colaborar</button>'
                    + '</div>'
                    + '</div>';
            }).join('');
    }
    
    selectOption(index) {
        const options = this.generator.generateMultiple('marketing', 'reel', 3);
        const selected = options[index];
        alert('✅ Opción seleccionada:\n\n' + selected.full);
    }

    copyToClipboard(index) {
        const opts = window._lastAIOptions || [];
        const text = opts[index] || '';
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showSuccess === 'function') showSuccess('Copy copiado al portapapeles');
            else alert('✅ Copiado');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            if (typeof showSuccess === 'function') showSuccess('Copy copiado');
        });
    }

    addToCalendar(index) {
        const opts = window._lastAIOptions || [];
        const copyText = opts[index] || '';
        const topic = document.getElementById('ai-topic')?.value?.trim() || '';
        const type  = document.getElementById('ai-type')?.value || 'reel';
        if (typeof openAddContentModal === 'function') {
            openAddContentModal();
            setTimeout(function() {
                var titleInput = document.getElementById('new-title');
                var notesInput = document.getElementById('new-notes');
                var typeInput  = document.getElementById('new-type');
                if (titleInput) titleInput.value = topic;
                if (typeInput)  typeInput.value  = type;
                if (notesInput) notesInput.value  = 'DEPARTAMENTO (' + window.aiUI.currentDepartment.toUpperCase() + '):\n\n' + copyText;
                if (typeof showSuccess === 'function') showSuccess('Copy cargado en el modal — completá la fecha y guardá');
            }, 400);
        }
    }

    handOff(index) {
        const opts = window._lastAIOptions || [];
        const copyText = opts[index] || '';
        
        // 1. Guardar en el bus de comunicación general (colaboración IA)
        if (window.DepartmentBus) {
            window.DepartmentBus.setLastResponse(copyText, this.currentDepartment);
        }

        // 2. Si hay un contenido activo de consulta, inyectar el dato automáticamente
        if (window._activeAIContentId && window.appData?.calendar) {
            const content = window.appData.calendar.find(c => c.id === window._activeAIContentId);
            if (content) {
                if (!content.produccion) content.produccion = {};
                const p = content.produccion;
                const dept = this.currentDepartment;

                // Mapeo inteligente por departamento
                if (dept === 'writer') {
                    p.copy = copyText;
                    // Extraer hashtags si existen (patrón #word)
                    const hashtags = copyText.match(/#[a-zA-Z0-9_]+/g);
                    if (hashtags) p.hashtags = hashtags.join(' ');
                    
                    if (!p.plataformas) p.plataformas = { instagram: {}, facebook: {}, tiktok: {} };
                    if (p.plataformas.instagram) p.plataformas.instagram.copy = copyText;
                    
                    if (typeof showSuccess === 'function') showSuccess('✅ Copy y estructura narrativa actualizada');
                } else if (dept === 'filmmaker') {
                    p.specs = copyText;
                    // Intentar extraer cantidad de escenas (ej: "Escenas: 5" o "12 escenas")
                    const sceneMatch = copyText.match(/(\d+)\s*escenas/i) || copyText.match(/escenas:\s*(\d+)/i);
                    if (sceneMatch) p.escenas = parseInt(sceneMatch[1]);
                    
                    if (typeof showSuccess === 'function') showSuccess('✅ Especificaciones técnicas y escenas actualizadas');
                } else if (dept === 'design') {
                    p.idea = copyText;
                    // Intentar extraer slides (ej: "7 slides" o "Slides: 10")
                    const slideMatch = copyText.match(/(\d+)\s*slides/i) || copyText.match(/slides:\s*(\d+)/i);
                    if (slideMatch) {
                        p.slideCount = parseInt(slideMatch[1]);
                        p.storyCount = parseInt(slideMatch[1]);
                    }
                    if (typeof showSuccess === 'function') showSuccess('✅ Diseño e idea creativa actualizada');
                } else if (dept === 'marketing' || dept === 'strategy') {
                    // Estos roles suelen dar consejos estratégicos que van a IDEA CREATIVA en lugar de notas técnicas
                    p.idea = (p.idea ? p.idea + '\n\n' : '') + '💡 SUGERENCIA ' + dept.toUpperCase() + ':\n' + copyText;
                    if (typeof showSuccess === 'function') showSuccess('✅ Estrategia integrada en la idea creativa');
                }

                // 3. Persistir y refrescar todas las vistas
                const account = window.currentAccount || 'bondi-media';
                localStorage.setItem(`bondi-calendar-${account}`, JSON.stringify(window.appData.calendar));
                
                // Forzar actualización global
                if (typeof window.refreshCalendarViews === 'function') window.refreshCalendarViews();
                
                // Si el modal de detalles está abierto, refrescarlo "en vivo"
                if (typeof window.refreshOpenDetails === 'function') {
                    window.refreshOpenDetails(content.id);
                }
            }
        } else {
            if (typeof showInfo === 'function') {
                showInfo('✅ Resultado guardado en el bus de colaboración.');
            }
        }
        
        // Hacer scroll hacia arriba para cambiar de departamento o cerrar
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==================================================
// INICIALIZACIÓN
// ==================================================
window.aiUI = null;

window.initOptimizedAI = function(outerContainer) {
    console.log('🤖 Inicializando Asistente IA Optimizado...');

    // Si se pasa un contenedor externo (desde sidebar), crear el card adentro
    if (outerContainer) {
        outerContainer.innerHTML = '<div id="ai-assistant-card" style="padding:0;"></div>';
    }

    const checkContainer = setInterval(() => {
        const container = document.getElementById('ai-assistant-card');
        if (container) {
            clearInterval(checkContainer);
            if (!window.aiUI) {
                window.aiUI = new AIAssistantUI();
            }
            window.aiUI.render();
            console.log('✅ Asistente IA Optimizado listo');
        }
    }, 100); // Frecuencia más rápida (100ms)
};

// ALIAS PARA COMPATIBILIDAD
window.initAIAssistant = window.initOptimizedAI;

// Auto-inicializar de forma inmediata
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initOptimizedAI();
    });
} else {
    initOptimizedAI();
}


// Helper global para copiar el input del analizador de hook
window.copyHookInput = function() {
    var el = document.getElementById('ai-hook-input');
    if (el) navigator.clipboard.writeText(el.value).catch(function(){});
};

window._aiCopyState = {
    selectedId: null,
    results: null
};

window._aiCopyLoadItems = function() {
    if (!window.appData || !Array.isArray(window.appData.calendar)) return [];
    
    // Obtener fecha actual para filtrar publicaciones relevantes
    var now = new Date();
    var currentMonth = now.getMonth();
    var currentYear = now.getFullYear();
    
    return window.appData.calendar.slice()
        .filter(function(item) {
            // Filtrar publicaciones del mes actual y futuro, o sin fecha
            if (!item.date) return true;
            var itemDate = new Date(item.date);
            return itemDate >= new Date(currentYear, currentMonth, 1);
        })
        .sort(function(a, b) {
            // Ordenar por fecha descendente (más recientes primero)
            return new Date(b.date || '9999-12-31') - new Date(a.date || '9999-12-31');
        });
};

window._aiCopyGetSelected = function() {
    var items = window._aiCopyLoadItems();
    if (!items.length) return null;
    if (!window._aiCopyState.selectedId) {
        window._aiCopyState.selectedId = items[0].id;
    }
    return items.find(function(item) {
        return item.id == window._aiCopyState.selectedId || 
               (window._aiCopyState.selectedId && parseInt(item.id) === parseInt(window._aiCopyState.selectedId));
    }) || items[0];
};

window.initCopyPublisherAI = function(outerContainer) {
    console.log('🤖 Inicializando generador IA de copy por publicación...');
    if (outerContainer) {
        outerContainer.innerHTML = '<div id="ai-copy-publisher-card" style="padding:0;"></div>';
    }
    var check = setInterval(function() {
        var container = document.getElementById('ai-copy-publisher-card');
        if (container) {
            clearInterval(check);
            if (!window.aiUI) window.aiUI = new AIAssistantUI();
            window._aiCopyRender(container);
            console.log('✅ Generador de copy por publicación listo');
        }
    }, 100);
};

window._aiCopyGenerateHashtags = function(topic, plat) {
    var stopwords = /^(de|la|el|y|en|con|para|por|que|como|a|o|los|las|una|un|es|al|del|su|se|este|esta|sus|más|mas|sobre|entre|desde|contra|sin|muy|ya|pero|porque|qué|quién|quienes|está|ser|será)$/i;
    var words = topic.toLowerCase()
        .replace(/[^a-záéíóúñü0-9 ]/gi, ' ')
        .split(/\s+/)
        .filter(function(word) { return word.length > 2 && !stopwords.test(word); });
    var unique = [];
    words.forEach(function(word) { if (word && unique.indexOf(word) === -1) unique.push(word); });
    var base = unique.slice(0, 4).map(function(word) { return '#' + word; });
    var pools = {
        ig: ['#estrategiadigital', '#contenidodigital', '#marketingdecontenidos', '#socialmedia', '#branding', '#crecimientodigital', '#emprendimiento', '#instagrammarketing', '#communitymanager'],
        fb: ['#marketingdigital', '#ventas', '#negocios', '#emprendedores', '#contenidodigital'],
        tt: ['#fyp', '#parati', '#viral', '#marketing', '#emprendedor', '#aprendeentiktok']
    };
    var extra = pools[plat] ? pools[plat].slice(0, 3) : [];
    return base.concat(extra).filter(function(tag, idx, arr) {
        return arr.indexOf(tag) === idx;
    }).slice(0, plat === 'ig' ? 10 : plat === 'fb' ? 5 : 8).join(' ');
};

window._aiCopySelectContent = function(contentId) {
    window._aiCopyState.selectedId = contentId ? parseInt(contentId) : null;
    window._aiCopyRender();
};

window._aiCopyGenerate = function() {
    var selected = window._aiCopyGetSelected();
    if (!selected) {
        if (typeof showInfo === 'function') showInfo('Seleccioná primero una publicación.');
        return;
    }

    var topicEl = document.getElementById('ai-copy-topic');
    var typeEl = document.getElementById('ai-copy-type');
    var ctaEl = document.getElementById('ai-copy-cta');
    var topic = (topicEl?.value || selected.title || selected.objective || '').trim();
    var type = (typeEl?.value || selected.type || 'reel').trim();
    var cta = (ctaEl?.value || 'INFO').trim();
    if (!topic) {
        if (typeof showInfo === 'function') showInfo('Agregá un tema o el título de la publicación para generar.');
        return;
    }

    var generator = window.aiUI?.generator || new ContentGenerator();
    var base = generator.generateReel(topic, 'audiencia', cta);
    var igCopy = base.full;
    var fbCopy = 'Quería compartir algo importante sobre ' + topic + '.\n\n' + base.body + '\n\n' + cta + '.';
    var ttCopy = topic + ': ' + base.hook + '\n\n' + base.body.split('\n').slice(0, 3).join(' ') + '\n\n' + cta + '.';

    if (type === 'carousel') {
        fbCopy = 'En este carrusel sobre ' + topic + ' vas a encontrar:\n' + base.body + '\n\n' + cta + '.';
        ttCopy = topic + ' en formato carrusel 🚀\n' + cta + '.';
    } else if (type === 'stories') {
        fbCopy = 'Historias rápidas sobre ' + topic + '.\n\n' + base.body + '\n\n' + cta + '.';
        ttCopy = 'Historia rápida: ' + topic + ' \n' + cta + '.';
    }

    window._aiCopyState.results = {
        igCopy: igCopy,
        igHash: window._aiCopyGenerateHashtags(topic, 'ig'),
        fbCopy: fbCopy,
        fbHash: window._aiCopyGenerateHashtags(topic, 'fb'),
        ttCopy: ttCopy,
        ttHash: window._aiCopyGenerateHashtags(topic, 'tt')
    };

    window._aiCopyRender();
};

window._aiCopyCopyPlatform = function(plat) {
    var results = window._aiCopyState.results;
    if (!results) {
        if (typeof showInfo === 'function') showInfo('Primero generá el copy.');
        return;
    }
    var copy = '';
    var hashtags = '';
    if (plat === 'ig') {
        copy = results.igCopy;
        hashtags = results.igHash;
    } else if (plat === 'fb') {
        copy = results.fbCopy;
        hashtags = results.fbHash;
    } else if (plat === 'tt') {
        copy = results.ttCopy;
        hashtags = results.ttHash;
    }
    if (!copy) {
        if (typeof showInfo === 'function') showInfo('No hay texto generado para ' + plat.toUpperCase() + '.');
        return;
    }
    navigator.clipboard.writeText(copy + '\n\n' + hashtags).then(function() {
        if (typeof showSuccess === 'function') showSuccess('Copy + hashtags de ' + plat.toUpperCase() + ' copiados al portapapeles');
    }).catch(function() {
        if (typeof showInfo === 'function') showInfo('No se pudo copiar al portapapeles.');
    });
};

window._aiCopyApply = async function() {
    var selected = window._aiCopyGetSelected();
    var results = window._aiCopyState.results;
    if (!selected || !results) {
        if (typeof showInfo === 'function') showInfo('Seleccioná una publicación y generá el copy primero.');
        return;
    }

    if (!selected.produccion) selected.produccion = {};
    if (!selected.produccion.plataformas) selected.produccion.plataformas = {};
    selected.produccion.plataformas.instagram = selected.produccion.plataformas.instagram || {};
    selected.produccion.plataformas.facebook = selected.produccion.plataformas.facebook || {};
    selected.produccion.plataformas.tiktok = selected.produccion.plataformas.tiktok || {};

    selected.produccion.plataformas.instagram.copy = results.igCopy;
    selected.produccion.plataformas.instagram.hashtags = results.igHash;
    selected.produccion.plataformas.facebook.copy = results.fbCopy;
    selected.produccion.plataformas.facebook.hashtags = results.fbHash;
    selected.produccion.plataformas.tiktok.copy = results.ttCopy;
    selected.produccion.plataformas.tiktok.hashtags = results.ttHash;

    if (selected.type === 'reel' || selected.type === 'carousel') {
        selected.produccion.copy = results.igCopy;
        selected.produccion.hashtags = results.igHash;
    }

    var account = window.currentAccount || 'bondi-media';
    if (typeof storage !== 'undefined' && typeof storage.set === 'function') {
        await storage.set('bondi-calendar-' + account, window.appData.calendar);
    } else {
        localStorage.setItem('bondi-calendar-' + account, JSON.stringify(window.appData.calendar));
    }

    if (typeof refreshCalendarViews === 'function') refreshCalendarViews();
    if (typeof window.refreshOpenDetails === 'function') window.refreshOpenDetails(selected.id);
    if (typeof showSuccess === 'function') showSuccess('Copy y hashtags guardados en la publicación seleccionada');
    window._aiCopyRender();
};

window._aiCopyOpenSelectedContent = function() {
    var selected = window._aiCopyGetSelected();
    if (!selected) {
        if (typeof showInfo === 'function') showInfo('Seleccioná primero una publicación.');
        return;
    }
    if (typeof openEditContentModal === 'function') {
        openEditContentModal(selected.id);
    }
};

window._aiCopyRender = function(container) {
    container = container || document.getElementById('ai-copy-publisher-card');
    if (!container) return;

    var items = window._aiCopyLoadItems();
    var selected = window._aiCopyGetSelected();
    var selectedId = selected ? selected.id : '';
    var topicValue = document.getElementById('ai-copy-topic')?.value || (selected ? (selected.title || selected.objective || (selected.produccion?.idea || selected.notes) || '') : '');
    var ctaValue = document.getElementById('ai-copy-cta')?.value || 'INFO';
    var typeValue = document.getElementById('ai-copy-type')?.value || (selected ? selected.type : 'reel');
    var statusLabel = selected ? (selected.status || 'Sin estado') : 'Ninguna publicación seleccionada';
    var metaLabel = selected ? ((selected.date || 'Fecha pendiente') + (selected.time ? ' · ' + selected.time : '') + ' · ' + (selected.type || 'publicación') + ' · ' + statusLabel) : 'Ninguna publicación seleccionada';

    var optionsHtml = items.length
        ? items.map(function(item) {
            var label = (item.title || 'Sin título').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            var dateLabel = item.date ? item.date + ' · ' + (item.type || 'publicación') : item.type || 'publicación';
            var isSelected = item.id == selectedId || (selectedId && parseInt(item.id) === parseInt(selectedId));
            return '<option value="' + item.id + '"' + (isSelected ? ' selected' : '') + '>' + dateLabel + ' — ' + label + '</option>';
        }).join('')
        : '<option value="">No hay publicaciones en el calendario</option>';

    var results = window._aiCopyState.results;
    var resultsHtml = '<div style="background:linear-gradient(135deg,#F8FAFC,#F1F5F9);border:2px dashed #CBD5E1;border-radius:20px;padding:40px;text-align:center;color:#64748B;font-size:15px;">'
        + '<div style="width:80px;height:80px;border-radius:20px;background:#E2E8F0;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">'
        + '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'
        + '</div>'
        + '<div style="font-weight:600;margin-bottom:8px;">Listo para generar contenido</div>'
        + '<div>Seleccioná una publicación y hacé clic en "Generar copy + hashtags"</div>'
        + '</div>';

    if (results) {
        var renderBlock = function(title, copy, hashtags, plat, icon, color) {
            var platformIcons = {
                ig: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
                fb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
                tt: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>'
            };
            var platformColors = { ig: '#E4405F', fb: '#1877F2', tt: '#000000' };
            var platIcon = platformIcons[plat] || icon;
            var platColor = platformColors[plat] || color;

            return '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:16px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);transition:all 0.2s ease;">'
                + '<div style="display:flex;align-items:center;gap:12px;">'
                + '<div style="width:40px;height:40px;border-radius:12px;background:' + platColor + ';display:flex;align-items:center;justify-content:center;font-size:18px;">' + platIcon + '</div>'
                + '<div style="font-size:16px;font-weight:700;color:#111827;">' + title + '</div>'
                + '</div>'
                + '<div style="font-size:14px;line-height:1.6;color:#374151;white-space:pre-wrap;min-height:120px;padding:16px;background:#F9FAFB;border-radius:12px;border:1px solid #F3F4F6;">' + (copy || 'Sin contenido generado') + '</div>'
                + '<div style="background:#F8FAFC;border-radius:12px;padding:16px;border:1px solid #E5E7EB;">'
                + '<div style="font-size:12px;font-weight:600;color:#6B7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">Hashtags</div>'
                + '<div style="font-size:13px;color:#374151;font-family:monospace;">' + (hashtags || '—') + '</div>'
                + '</div>'
                + '<button onclick="window._aiCopyCopyPlatform(\'' + plat + '\')" style="width:100%;border:none;background:linear-gradient(135deg,' + platColor + ',#000);color:#fff;padding:14px 20px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;transition:all 0.2s ease;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 8px 25px -8px ' + platColor + '80\'" onmouseout="this.style.transform=\'translateY(0)\';this.style.boxShadow=\'none\'">'
                + '<span style="display:flex;align-items:center;justify-content:center;gap:8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copiar ' + title + '</span>'
                + '</button>'
                + '</div>';
        };
        resultsHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;">'
            + renderBlock('Instagram', results.igCopy, results.igHash, 'ig')
            + renderBlock('Facebook', results.fbCopy, results.fbHash, 'fb')
            + renderBlock('TikTok', results.ttCopy, results.ttHash, 'tt')
            + '</div>';
    }

    container.innerHTML = '<div style="font-family:Inter,sans-serif;max-width:1200px;margin:0 auto;">'
        // Header Section
        + '<div style="background:linear-gradient(135deg,#667EEA,#764BA2);border-radius:24px;padding:32px;margin-bottom:32px;color:#fff;position:relative;overflow:hidden;">'
        + '<div style="position:absolute;top:0;right:0;width:200px;height:200px;background:radial-gradient(circle,rgba(255,255,255,0.1),transparent);border-radius:50%;transform:translate(50px,-50px);"></div>'
        + '<div style="position:absolute;bottom:0;left:0;width:150px;height:150px;background:radial-gradient(circle,rgba(255,255,255,0.05),transparent);border-radius:50%;transform:translate(-50px,50px);"></div>'
        + '<div style="position:relative;z-index:1;">'
        + '<div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">'
        + '<div style="width:56px;height:56px;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;">'
        + '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#667EEA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>'
        + '</div>'
        + '<div>'
        + '<h1 style="font-size:28px;font-weight:800;margin:0;margin-bottom:4px;">Generador IA por Publicación</h1>'
        + '<p style="font-size:16px;margin:0;opacity:0.9;">Copy inteligente y hashtags optimizados para redes sociales</p>'
        + '</div>'
        + '</div>'
        + '<div style="background:#fff;border-radius:16px;padding:20px;margin-top:20px;">'
        + '<div style="display:flex;align-items:center;gap:12px;color:#374151;">'
        + '<div style="width:32px;height:32px;border-radius:8px;background:#F3F4F6;display:flex;align-items:center;justify-content:center;">🎯</div>'
        + '<span style="font-size:14px;font-weight:500;">Seleccioná una publicación del calendario y genera contenido personalizado para Instagram, Facebook y TikTok automáticamente.</span>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'

        // Main Content Grid
        + '<div style="display:grid;grid-template-columns:2fr 1fr;gap:32px;margin-bottom:32px;">'

        // Left Column - Configuration
        + '<div style="display:flex;flex-direction:column;gap:24px;">'

        // Publication Selection Card
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);">'
        + '<div style="display:flex;align-items-center;gap:12px;margin-bottom:20px;">'
        + '<div style="width:36px;height:36px;border-radius:10px;background:#F0F9FF;display:flex;align-items:center;justify-content:center;color:#0369A1;">'
        + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
        + '</div>'
        + '<h3 style="font-size:18px;font-weight:700;color:#111827;margin:0;">Seleccionar Publicación</h3>'
        + '</div>'
        + '<div style="margin-bottom:16px;">'
        + '<label style="display:block;font-size:14px;font-weight:600;color:#374151;margin-bottom:8px;">Publicación del calendario</label>'
        + '<select id="ai-copy-content-select" class="form-select" onchange="window._aiCopySelectContent(this.value)" style="width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:12px;font-size:14px;background:#fff;">'
        + optionsHtml + '</select>'
        + '</div>'
        + (selected ? '<button onclick="window._aiCopyOpenSelectedContent()" style="border:2px solid #E5E7EB;background:#fff;color:#374151;padding:10px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:500;transition:all 0.2s ease;" onmouseover="this.style.borderColor=\'#3B82F6\';this.style.color=\'#3B82F6\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.color=\'#374151\'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Abrir publicación</button>' : '')
        + '</div>'

        // Content Configuration Card
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);">'
        + '<div style="display:flex;align-items-center;gap:12px;margin-bottom:20px;">'
        + '<div style="width:36px;height:36px;border-radius:10px;background:#FEF3C7;display:flex;align-items:center;justify-content:center;color:#D97706;">'
        + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
        + '</div>'
        + '<h3 style="font-size:18px;font-weight:700;color:#111827;margin:0;">Configuración de Contenido</h3>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">'
        + '<div>'
        + '<label style="display:block;font-size:14px;font-weight:600;color:#374151;margin-bottom:8px;">Tema / Resumen</label>'
        + '<input id="ai-copy-topic" class="form-input" value="' + (topicValue || '') + '" placeholder="Ej: Campaña de temporada, lanzamiento..." style="width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:12px;font-size:14px;"/>'
        + '</div>'
        + '<div>'
        + '<label style="display:block;font-size:14px;font-weight:600;color:#374151;margin-bottom:8px;">Call to Action</label>'
        + '<input id="ai-copy-cta" class="form-input" value="' + (ctaValue || 'INFO') + '" placeholder="INFO, CONSULTA, ESCRIBÍ..." style="width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:12px;font-size:14px;"/>'
        + '</div>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:1fr 2fr;gap:16px;">'
        + '<div>'
        + '<label style="display:block;font-size:14px;font-weight:600;color:#374151;margin-bottom:8px;">Tipo</label>'
        + '<input id="ai-copy-type" class="form-input" value="' + (typeValue || 'reel') + '" readonly style="width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:12px;font-size:14px;background:#F9FAFB;color:#6B7280;"/>'
        + '</div>'
        + '<div>'
        + '<label style="display:block;font-size:14px;font-weight:600;color:#374151;margin-bottom:8px;">Detalles</label>'
        + '<div style="padding:12px 16px;border:2px solid #E5E7EB;border-radius:12px;background:#F9FAFB;font-size:13px;color:#6B7280;min-height:46px;display:flex;align-items:center;">' + metaLabel + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'

        + '</div>'

        // Right Column - Actions
        + '<div>'
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);position:sticky;top:20px;">'
        + '<div style="display:flex;align-items-center;gap:12px;margin-bottom:20px;">'
        + '<div style="width:36px;height:36px;border-radius:10px;background:#ECFDF5;display:flex;align-items:center;justify-content:center;color:#059669;">'
        + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
        + '</div>'
        + '<h3 style="font-size:18px;font-weight:700;color:#111827;margin:0;">Acciones</h3>'
        + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:12px;">'
        + '<button onclick="window._aiCopyGenerate()" style="width:100%;border:none;background:linear-gradient(135deg,#667EEA,#764BA2);color:#fff;padding:16px 20px;border-radius:12px;cursor:pointer;font-size:16px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s ease;" onmouseover="this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 8px 25px -8px rgba(102,126,234,0.5)\'" onmouseout="this.style.transform=\'translateY(0)\';this.style.boxShadow=\'none\'">'
        + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg><span>Generar Copy + Hashtags</span>'
        + '</button>'
        + (results ? '<button onclick="window._aiCopyApply()" style="width:100%;border:2px solid #10B981;background:#fff;color:#10B981;padding:14px 20px;border-radius:12px;cursor:pointer;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s ease;" onmouseover="this.style.background=\'#10B981\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'#fff\';this.style.color=\'#10B981\'">'
        + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg><span>Guardar en Publicación</span>'
        + '</button>' : '')
        + '</div>'
        + '<div style="margin-top:20px;padding:16px;background:#F8FAFC;border-radius:12px;border:1px solid #E5E7EB;">'
        + '<div style="font-size:13px;color:#6B7280;text-align:center;">'
        + '<div style="font-weight:600;margin-bottom:4px;display:flex;align-items:center;justify-content:center;gap:6px;">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'
        + '<span>Tip</span>'
        + '</div>'
        + '<div>El copy se genera automáticamente basado en el tema y tipo de publicación seleccionada.</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'

        + '</div>'

        // Results Section
        + '<div id="ai-copy-results" style="margin-top:0;">' + resultsHtml + '</div>'
        + '</div>';
};

window._aiCopyRender();

// Exponer generador para integración
if (window.aiUI) {
    window.aiUI.generator = window.aiUI.generator || new ContentGenerator();
}

// Integración con nuevo layout
if (window.AIHelper) {
    window.aiUI.navigateTo = window.AIHelper.navigateToAssistant;
}
// ══════════════════════════════════════════════════════
// TIPS PERSONALIZADOS DINÁMICOS — override del hardcoded
// ══════════════════════════════════════════════════════
(function patchDynamicTips() {
    function calcDynamicTips() {
        var accountId  = window.currentAccount || 'bondi-media';
        var calendar   = [];
        try { calendar = JSON.parse(localStorage.getItem('bondi-calendar-' + accountId) || '[]'); } catch(e) {}

        var withMetrics = calendar.filter(function(c){ return c.metrics && c.metrics.instagram; });

        // ── Mejor horario ──────────────────────────────
        var hourBuckets = {};
        withMetrics.forEach(function(c) {
            if (!c.time) return;
            var h = parseInt(c.time.split(':')[0]);
            var bucket = h + 'h';
            if (!hourBuckets[bucket]) hourBuckets[bucket] = { total:0, count:0 };
            hourBuckets[bucket].total += (c.metrics.instagram.reach || 0) + (c.metrics.instagram.saves || 0) * 2;
            hourBuckets[bucket].count++;
        });
        var bestHour = '20:00hs';
        var bestHourScore = 0;
        Object.keys(hourBuckets).forEach(function(h) {
            var avg = hourBuckets[h].total / hourBuckets[h].count;
            if (avg > bestHourScore) { bestHourScore = avg; bestHour = h; }
        });

        // ── Mejor día ──────────────────────────────────
        var days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
        var dayBuckets = {};
        withMetrics.forEach(function(c) {
            if (!c.date) return;
            var d = new Date(c.date + 'T00:00:00').getDay();
            var dn = days[d];
            if (!dayBuckets[dn]) dayBuckets[dn] = { total:0, count:0 };
            dayBuckets[dn].total += (c.metrics.instagram.reach || 0);
            dayBuckets[dn].count++;
        });
        var bestDay = 'Jueves';
        var bestDayScore = 0;
        Object.keys(dayBuckets).forEach(function(d) {
            var avg = dayBuckets[d].total / dayBuckets[d].count;
            if (avg > bestDayScore) { bestDayScore = avg; bestDay = d; }
        });

        // ── Mejor tipo de contenido ────────────────────
        var typeBuckets = {};
        withMetrics.forEach(function(c) {
            var t = c.type || 'reel';
            if (!typeBuckets[t]) typeBuckets[t] = { total:0, count:0 };
            typeBuckets[t].total += (c.metrics.instagram.reach || 0) + (c.metrics.instagram.saves || 0) * 2;
            typeBuckets[t].count++;
        });
        var bestType = 'Reel';
        var bestTypeScore = 0;
        var typeLabels = { reel:'Reel', carousel:'Carrusel', stories:'Stories' };
        Object.keys(typeBuckets).forEach(function(t) {
            var avg = typeBuckets[t].total / typeBuckets[t].count;
            if (avg > bestTypeScore) { bestTypeScore = avg; bestType = typeLabels[t] || t; }
        });

        // ── Hook con mejor engagement ──────────────────
        var hooks = ['¿Sabías que...?', 'El error que comete el 90% de...', 'Lo que nadie te cuenta sobre...', '3 cosas que cambiarán tu...', 'La verdad sobre...', 'Por qué fallás en...'];
        var hookIdx = Math.floor(Date.now() / (1000*60*60*24)) % hooks.length; // cambia cada día
        var bestHook = hooks[hookIdx];

        // ── Alcance promedio ───────────────────────────
        var avgReach = withMetrics.length
            ? Math.round(withMetrics.reduce(function(s,c){ return s + (c.metrics.instagram.reach||0); }, 0) / withMetrics.length)
            : null;

        return { bestHour:bestHour, bestDay:bestDay, bestType:bestType, bestHook:bestHook, avgReach:avgReach, hasMet:withMetrics.length > 0 };
    }

    function renderDynamicTips(container) {
        var el = container ? container.querySelector('.ai-tips-override') : document.querySelector('.ai-tips-override');
        if (!el) return;

        var t = calcDynamicTips();
        var cards = [
            { bg:'#ECFDF5', icon:'⏰', label:'Mejor horario', value: t.bestHour, sub: t.hasMet ? 'basado en tus métricas' : 'referencia del nicho' },
            { bg:'#EFF6FF', icon:'📅', label:'Mejor día',     value: t.bestDay,  sub: t.hasMet ? 'mayor alcance promedio' : 'referencia del nicho' },
            { bg:'#FFF7ED', icon:'🏆', label:'Mejor formato', value: t.bestType, sub: t.hasMet ? 'mayor engagement' : 'referencia del nicho' },
            { bg:'#FEF3C7', icon:'🎯', label:'Hook sugerido', value: '"' + t.bestHook + '"', sub: 'rota cada día' },
        ];
        if (t.avgReach) cards.push({ bg:'#F5F3FF', icon:'📊', label:'Alcance promedio', value: t.avgReach > 999 ? (t.avgReach/1000).toFixed(1)+'K' : t.avgReach, sub: 'últimas publicaciones' });

        el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;">'
            + cards.map(function(c) {
                return '<div style="background:' + c.bg + ';border-radius:10px;padding:14px 16px;">'
                    + '<div style="font-size:11px;font-weight:700;color:#374151;margin-bottom:4px;">' + c.icon + ' ' + c.label + '</div>'
                    + '<div style="font-size:18px;font-weight:700;color:#0D1117;margin-bottom:2px;">' + c.value + '</div>'
                    + '<div style="font-size:10px;color:#9CA3AF;">' + c.sub + '</div>'
                    + '</div>';
            }).join('')
            + '</div>';
    }

    // Patch: override tras render del asistente (espera que el DOM esté listo)
    var _origInitAI = window.initOptimizedAI;
    window.initOptimizedAI = function(container) {
        if (typeof _origInitAI === 'function') _origInitAI(container);
        // Buscar el card de tips y reemplazar contenido
        setTimeout(function() {
            var cards = (container || document).querySelectorAll('.ai-assistant-card h3');
            cards.forEach(function(h3) {
                if (h3.textContent.includes('Tips personalizados')) {
                    var card = h3.parentElement;
                    // Reemplazar el grid de tips hardcoded
                    var grid = card.querySelector('div[style*="grid"]');
                    if (grid) {
                        grid.className = 'ai-tips-override';
                        renderDynamicTips(card);
                    }
                }
            });
        }, 500);
    };

    // También exponer para llamado manual
    window.refreshDynamicTips = function() {
        var container = document.getElementById('ai-content-container');
        renderDynamicTips(container || document);
    };
})();