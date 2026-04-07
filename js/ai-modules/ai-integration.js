// ==================================================
// AI INTEGRATION - FASE 1: CLAUDE API + CONTEXTO ENRIQUECIDO
// Agrega callClaudeAPI() reutilizable con:
//   - Autenticación via API key guardada en config
//   - Caché de 24hs para no repetir llamadas idénticas
//   - Retry automático en caso de error de red
//   - buildEnrichedContext() que inyecta datos reales del cliente
// El código existente de integración con aiLearningEngine
// se mantiene intacto al final del archivo.
// ==================================================

// --------------------------------------------------
// CONSTANTES DE LA API
// --------------------------------------------------
const CLAUDE_API_URL = 'https://api.openai.com/v1/chat/completions';
const CLAUDE_MODEL   = 'gpt-4o';
// OpenAI no requiere header de version
const CACHE_TTL_MS   = 24 * 60 * 60 * 1000; // 24 horas

// --------------------------------------------------
// OBTENER API KEY (guardada en localStorage por config.js)
// --------------------------------------------------
function getClaudeAPIKey() {
    try {
        // Soporta tanto la key de OpenAI como la anterior de Anthropic
        const enc = localStorage.getItem('bondi-openai-key') || localStorage.getItem('bondi-claude-key');
        if (!enc) return null;
        return atob(enc);
    } catch (e) {
        return null;
    }
}

// --------------------------------------------------
// CACHÉ DE RESPUESTAS
// --------------------------------------------------
function getCachedResponse(cacheKey) {
    try {
        const raw = localStorage.getItem('bondi-ai-cache-' + cacheKey);
        if (!raw) return null;
        const entry = JSON.parse(raw);
        if (Date.now() - entry.ts > CACHE_TTL_MS) {
            localStorage.removeItem('bondi-ai-cache-' + cacheKey);
            return null;
        }
        return entry.value;
    } catch (e) { return null; }
}

function setCachedResponse(cacheKey, value) {
    try {
        localStorage.setItem('bondi-ai-cache-' + cacheKey,
            JSON.stringify({ ts: Date.now(), value }));
    } catch (e) {}
}

// --------------------------------------------------
// CONSTRUIR CONTEXTO ENRIQUECIDO DEL CLIENTE ACTIVO
// Este es el diferenciador: cada llamada incluye datos
// reales del cliente (historial, métricas, briefing, tono)
// --------------------------------------------------
window.buildEnrichedContext = function() {
    const account  = (window.accounts || []).find(a => a.id === (window.currentAccount || 'bondi-media'))
                  || { name: 'Bondi Media', industry: 'Agencia de marketing digital' };
    const calendar = window.appData?.calendar || [];
    const briefings = window.briefings || [];

    // Último briefing del cliente activo
    const lastBriefing = briefings
        .filter(b => b.clientId === account.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    // Contenido con métricas para detectar patrones
    const withMetrics = calendar.filter(c => c.metrics);

    // Top 3 por alcance
    const top3 = [...withMetrics]
        .sort((a, b) => {
            const reachA = (a.metrics?.instagram?.reach || 0) + (a.metrics?.facebook?.reach || 0);
            const reachB = (b.metrics?.instagram?.reach || 0) + (b.metrics?.facebook?.reach || 0);
            return reachB - reachA;
        })
        .slice(0, 3);

    // Retención promedio de reels
    const reels = withMetrics.filter(c => c.type === 'reel' && c.metrics?.videoMetrics?.retentionPercent);
    const avgRetention = reels.length
        ? Math.round(reels.reduce((s, r) => s + r.metrics.videoMetrics.retentionPercent, 0) / reels.length)
        : null;

    // Mejor horario (moda de los top contenidos)
    const bestHour = top3.length
        ? top3.map(c => c.time?.substring(0, 2)).filter(Boolean)[0]
        : null;

    return {
        account,
        lastBriefing,
        top3,
        avgRetention,
        bestHour,
        totalContent: calendar.length,
        totalWithMetrics: withMetrics.length
    };
};

// --------------------------------------------------
// LLAMADA A CLAUDE API — función central de la Fase 1
// Firma: callClaudeAPI(systemPrompt, userPrompt, options)
// options: { useCache, maxTokens, cacheKey }
// --------------------------------------------------
window.callClaudeAPI = async function(systemPrompt, userPrompt, options = {}) {
    const {
        useCache  = true,
        maxTokens = 1000,
        cacheKey  = null
    } = options;

    const apiKey = getClaudeAPIKey();
    if (!apiKey) {
        return {
            ok: false,
            error: 'NO_KEY',
            message: 'API key no configurada. Configurala en ⚙️ Configuración → Inteligencia Artificial.'
        };
    }

    // Revisar caché
    const key = cacheKey || btoa(systemPrompt.substring(0, 40) + userPrompt.substring(0, 60));
    if (useCache) {
        const cached = getCachedResponse(key);
        if (cached) {
            console.log('✅ Claude: respuesta desde caché');
            return { ok: true, text: cached, fromCache: true };
        }
    }

    // Hacer la llamada
    let attempts = 0;
    while (attempts < 2) {
        try {
            const response = await fetch(CLAUDE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey
                },
                body: JSON.stringify({
                    model: CLAUDE_MODEL,
                    max_tokens: maxTokens,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user',   content: userPrompt   }
                    ]
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                if (response.status === 401) return { ok: false, error: 'INVALID_KEY', message: 'API key de OpenAI inválida. Verificala en Configuración.' };
                if (response.status === 429) return { ok: false, error: 'RATE_LIMIT', message: 'Límite de solicitudes alcanzado. Esperá un momento.' };
                throw new Error((err.error?.message) || 'Error ' + response.status);
            }

            const data  = await response.json();
            const text  = data.choices?.[0]?.message?.content || '';

            if (useCache && text) setCachedResponse(key, text);
            console.log('✅ Claude: respuesta obtenida');
            return { ok: true, text };

        } catch (e) {
            attempts++;
            if (attempts >= 2) return { ok: false, error: 'NETWORK', message: 'Error de conexión: ' + e.message };
            await new Promise(r => setTimeout(r, 1000));
        }
    }
};



// ==================================================
// AI INTEGRATION - CONEXIÓN ASISTENTE + APRENDIZAJE
// ==================================================

console.log('🔌 Integrando sistemas de IA...');

// ==================================================
// INTEGRAR ASISTENTE CON MOTOR DE APRENDIZAJE
// ==================================================
function integrateAISystems() {
    // Verificar que ambos sistemas existen
    if (!window.aiUI || !window.aiLearningEngine) {
        console.log('⏳ Esperando sistemas de IA...');
        setTimeout(integrateAISystems, 1000);
        return;
    }
    
    console.log('✅ Sistemas de IA integrados correctamente');
    
    // 1. Mejorar el generador con aprendizaje
    enhanceGeneratorWithLearning();
    
    // 2. Agregar panel de aprendizaje al asistente
    addLearningPanelToAssistant();
    
    // 3. Hook para actualizar aprendizaje cuando se guardan métricas
    hookMetricsSaving();
}

// ==================================================
// MEJORAR GENERADOR CON APRENDIZAJE
// ==================================================
function enhanceGeneratorWithLearning() {
    if (!window.aiUI || !window.aiUI.generator) {
        console.log('⏳ Esperando generador...');
        setTimeout(enhanceGeneratorWithLearning, 1000);
        return;
    }
    
    const originalGenerate = window.aiUI.generator.generateReel;
    
    if (originalGenerate) {
        window.aiUI.generator.generateReel = function(topic, audience, keyword) {
            // Obtener recomendaciones del motor de aprendizaje
            const recomendaciones = window.aiLearningEngine?.getRecomendacionesPersonalizadas();
            const mejorHorario = window.aiLearningEngine?.patronesExito?.mejorHorario;
            const mejorFormato = window.aiLearningEngine?.patronesExito?.mejorFormato;
            
            // Generar contenido base
            const result = originalGenerate.call(this, topic, audience, keyword);
            
            // Personalizar según aprendizaje
            if (mejorHorario) {
                result.hook = `🕐 Publicá a las ${mejorHorario}:00hs: ` + result.hook;
                result.full = `🕐 Mejor horario: ${mejorHorario}:00hs\n\n` + result.full;
            }
            
            return result;
        };
        
        console.log('✅ Generador mejorado con aprendizaje');
    }
}

// ==================================================
// AGREGAR PANEL DE APRENDIZAJE AL ASISTENTE
// ==================================================
function addLearningPanelToAssistant() {
    const assistantCard = document.getElementById('ai-assistant-card');
    if (!assistantCard) {
        console.log('⏳ Esperando asistente...');
        setTimeout(addLearningPanelToAssistant, 1000);
        return;
    }
    
    // Verificar si ya existe
    if (document.getElementById('ai-learning-panel')) return;
    
    // Crear panel de aprendizaje
    const learningPanel = document.createElement('div');
    learningPanel.id = 'ai-learning-panel';
    learningPanel.style.marginTop = '20px';
    learningPanel.style.borderTop = '2px solid var(--gray-200)';
    learningPanel.style.paddingTop = '20px';
    assistantCard.appendChild(learningPanel);
    
    // Renderizar UI de aprendizaje
    renderLearningUI();
}

// ==================================================