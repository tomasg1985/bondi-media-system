// ==================================================
// AI CONTENT LOADER - CARGA DE MÓDULOS EN SECCIÓN IA
// ==================================================

console.log('🤖 Inicializando cargador de contenido IA...');

// ==================================================
// CARGAR CONTENIDO SEGÚN LA SECCIÓN
// ==================================================
window.loadAIContent = function(section) {
    console.log(`📂 Cargando contenido IA: ${section}`);
    
    const container = document.getElementById('ai-module-content');
    if (!container) return;

    // Limpiar contenedor
    container.innerHTML = '';

    switch(section) {
        case 'assistant':
            loadAIAssistant();
            break;
        case 'benchmarking':
            loadBenchmarking();
            break;
        case 'platform':
            loadPlatformOptimizer();
            break;
        case 'predictive':
            loadPredictiveAI();
            break;
        case 'hooks':
            loadHookLibrary();
            break;
        default:
            container.innerHTML = '<p>Seleccioná un módulo</p>';
    }
};

// ==================================================
// CARGAR ASISTENTE IA
// ==================================================
function loadAIAssistant() {
    const container = document.getElementById('ai-module-content');
    
    // Crear contenedor para el asistente
    const assistantContainer = document.createElement('div');
    assistantContainer.id = 'ai-assistant-container';
    container.appendChild(assistantContainer);

    // Inicializar o mover el asistente existente
    if (window.aiUI) {
        // Si ya existe, moverlo al nuevo contenedor
        const oldAssistant = document.getElementById('ai-assistant-card');
        if (oldAssistant) {
            assistantContainer.appendChild(oldAssistant);
        } else {
            // Si no existe, crear uno nuevo
            initAIAssistantInContainer(assistantContainer);
        }
    } else {
        // Esperar a que el asistente esté disponible
        const checkInterval = setInterval(() => {
            if (window.aiUI) {
                clearInterval(checkInterval);
                const oldAssistant = document.getElementById('ai-assistant-card');
                if (oldAssistant) {
                    assistantContainer.appendChild(oldAssistant);
                } else {
                    initAIAssistantInContainer(assistantContainer);
                }
            }
        }, 500);
    }
}

// ==================================================
// INICIALIZAR ASISTENTE EN CONTENEDOR
// ==================================================
function initAIAssistantInContainer(container) {
    // Crear estructura básica del asistente
    container.innerHTML = `
        <div id="ai-assistant-card" class="card">
            <div class="card-header">
                <h3 class="card-title">🤖 Asistente IA</h3>
            </div>
            <div id="ai-assistant-content" style="padding: 20px;">
                <p>Cargando asistente...</p>
            </div>
        </div>
    `;

    // Inicializar el asistente
    if (window.initOptimizedAI) {
        setTimeout(window.initOptimizedAI, 500);
    }
}

// ==================================================
// CARGAR BENCHMARKING
// ==================================================
function loadBenchmarking() {
    const container = document.getElementById('ai-module-content');
    
    // Crear contenedor para benchmarking
    const benchmarkingContainer = document.createElement('div');
    benchmarkingContainer.id = 'benchmarking-container';
    container.appendChild(benchmarkingContainer);

    // Inicializar benchmarking en el contenedor
    if (!document.getElementById('benchmarking-panel')) {
        const panel = document.createElement('div');
        panel.id = 'benchmarking-panel';
        benchmarkingContainer.appendChild(panel);
        
        // Inicializar benchmarking
        if (window.initBenchmarking) {
            setTimeout(window.initBenchmarking, 500);
        }
    } else {
        // Mover el panel existente
        const oldPanel = document.getElementById('benchmarking-panel');
        if (oldPanel) {
            benchmarkingContainer.appendChild(oldPanel);
        }
    }
}

// ==================================================
// CARGAR OPTIMIZADOR MULTIPLATAFORMA
// ==================================================
function loadPlatformOptimizer() {
    const container = document.getElementById('ai-module-content');
    
    // Crear contenedor para optimizador
    const platformContainer = document.createElement('div');
    platformContainer.id = 'platform-container';
    container.appendChild(platformContainer);

    // Inicializar optimizador en el contenedor
    if (!document.getElementById('platform-optimizer-panel')) {
        const panel = document.createElement('div');
        panel.id = 'platform-optimizer-panel';
        platformContainer.appendChild(panel);
        
        // Inicializar optimizador
        if (window.initPlatformOptimizer) {
            setTimeout(window.initPlatformOptimizer, 500);
        }
    } else {
        // Mover el panel existente
        const oldPanel = document.getElementById('platform-optimizer-panel');
        if (oldPanel) {
            platformContainer.appendChild(oldPanel);
        }
    }
}

// ==================================================
// CARGAR ANÁLISIS PREDICTIVO (PRÓXIMAMENTE)
// ==================================================
function loadPredictiveAI() {
    const container = document.getElementById('ai-module-content');
    
    container.innerHTML = `
        <div class="card" style="text-align: center; padding: 60px;">
            <div style="font-size: 64px; margin-bottom: 20px;">🔮</div>
            <h2 style="font-size: 24px; margin-bottom: 10px;">Análisis Predictivo</h2>
            <p style="color: var(--gray-600); max-width: 500px; margin: 0 auto;">
                Este módulo estará disponible próximamente. Podrás predecir el rendimiento de tu contenido basado en datos históricos y tendencias del mercado.
            </p>
            <div style="margin-top: 30px; background: var(--gray-100); padding: 20px; border-radius: 8px; max-width: 400px; margin: 30px auto 0;">
                <h4 style="margin-bottom: 10px;">🚀 Próximas funcionalidades:</h4>
                <ul style="text-align: left; padding-left: 20px;">
                    <li>Predicción de alcance viral</li>
                    <li>Detección de tendencias emergentes</li>
                    <li>Recomendaciones de contenido timely</li>
                    <li>Alertas de oportunidades de mercado</li>
                </ul>
            </div>
        </div>
    `;
}

// ==================================================
// CARGAR BIBLIOTECA DE HOOKS (PRÓXIMAMENTE)
// ==================================================
function loadHookLibrary() {
    const container = document.getElementById('ai-module-content');
    
    container.innerHTML = `
        <div class="card" style="text-align: center; padding: 60px;">
            <div style="font-size: 64px; margin-bottom: 20px;">🎯</div>
            <h2 style="font-size: 24px; margin-bottom: 10px;">Biblioteca de Hooks</h2>
            <p style="color: var(--gray-600); max-width: 500px; margin: 0 auto;">
                Próximamente: Una colección de los hooks más efectivos para cada nicho, con ejemplos reales y métricas de rendimiento.
            </p>
            <div style="margin-top: 30px; background: var(--gray-100); padding: 20px; border-radius: 8px; max-width: 400px; margin: 30px auto 0;">
                <h4 style="margin-bottom: 10px;">📚 Lo que incluirá:</h4>
                <ul style="text-align: left; padding-left: 20px;">
                    <li>+100 hooks probados por nicho</li>
                    <li>Análisis de retención por hook</li>
                    <li>Ejemplos de tus mejores hooks</li>
                    <li>Generador de variaciones</li>
                </ul>
            </div>
        </div>
    `;
}

// ==================================================
// MODIFICAR FUNCIÓN DE NAVEGACIÓN EXISTENTE
// ==================================================
// Actualizar la función navigateToAI en sidebar-ai.js
window.navigateToAI = function(section) {
    console.log(`🤖 Navegando a sección IA: ${section}`);

    // Desactivar todos los nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Activar el item clickeado
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // Crear o mostrar contenedor de IA
    let aiContainer = document.getElementById('ai-content-container');

    if (!aiContainer) {
        aiContainer = document.createElement('div');
        aiContainer.id = 'ai-content-container';
        aiContainer.className = 'section';
        document.querySelector('.content-area').appendChild(aiContainer);
    }

    // Ocultar otras secciones
    document.querySelectorAll('.section').forEach(s => {
        if (s.id !== 'ai-content-container') {
            s.classList.remove('active');
        }
    });

    aiContainer.classList.add('active');

    // Títulos y descripciones para cada sección
    const sections = {
        assistant: {
            title: '🤖 Asistente IA',
            description: 'Generación de contenido inteligente basado en tus datos',
            icon: '🤖',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        benchmarking: {
            title: '📊 Benchmarking',
            description: 'Compará tu rendimiento con la competencia',
            icon: '📊',
            color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        platform: {
            title: '📱 Optimizador Multiplataforma',
            description: 'Adaptá tu contenido para todas las redes sociales',
            icon: '📱',
            color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        predictive: {
            title: '🔮 Análisis Predictivo',
            description: 'Predicciones de rendimiento basadas en IA',
            icon: '🔮',
            color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        },
        hooks: {
            title: '🎯 Biblioteca de Hooks',
            description: 'Los hooks que mejor funcionan en tu nicho',
            icon: '🎯',
            color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
        }
    };

    const current = sections[section];

    aiContainer.innerHTML = `
        <style>
            .ai-header {
                background: ${current.color};
                padding: 30px;
                border-radius: 12px;
                color: white;
                margin-bottom: 24px;
            }
            .ai-modules-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            .ai-module-card {
                background: white;
                border-radius: 10px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s;
                border: 1px solid var(--gray-200);
                text-align: center;
            }
            .ai-module-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border-color: var(--primary);
            }
            .ai-module-card.active {
                border: 2px solid var(--primary);
                background: var(--gray-50);
            }
        </style>

        <div class="ai-header">
            <div style="font-size: 48px; margin-bottom: 10px;">${current.icon}</div>
            <h1 style="font-size: 28px; margin-bottom: 10px;">${current.title}</h1>
            <p style="font-size: 15px; opacity: 0.9;">${current.description}</p>
        </div>

        <div class="ai-modules-grid">
            <div class="ai-module-card ${section === 'assistant' ? 'active' : ''}" onclick="window.navigateToAI('assistant')">
                <div style="font-size: 28px; margin-bottom: 8px;">🤖</div>
                <div style="font-weight: 600; font-size: 13px;">Asistente IA</div>
            </div>
            <div class="ai-module-card ${section === 'benchmarking' ? 'active' : ''}" onclick="window.navigateToAI('benchmarking')">
                <div style="font-size: 28px; margin-bottom: 8px;">📊</div>
                <div style="font-weight: 600; font-size: 13px;">Benchmarking</div>
            </div>
            <div class="ai-module-card ${section === 'platform' ? 'active' : ''}" onclick="window.navigateToAI('platform')">
                <div style="font-size: 28px; margin-bottom: 8px;">📱</div>
                <div style="font-weight: 600; font-size: 13px;">Multiplataforma</div>
            </div>
            <div class="ai-module-card ${section === 'predictive' ? 'active' : ''}" onclick="window.navigateToAI('predictive')">
                <div style="font-size: 28px; margin-bottom: 8px;">🔮</div>
                <div style="font-weight: 600; font-size: 13px;">Predictivo</div>
            </div>
            <div class="ai-module-card ${section === 'hooks' ? 'active' : ''}" onclick="window.navigateToAI('hooks')">
                <div style="font-size: 28px; margin-bottom: 8px;">🎯</div>
                <div style="font-weight: 600; font-size: 13px;">Hooks</div>
            </div>
        </div>

        <div id="ai-module-content" style="min-height: 400px;"></div>
    `;

    // Cargar el contenido del módulo seleccionado
    window.loadAIContent(section);
};

console.log('✅ Cargador de contenido IA inicializado');