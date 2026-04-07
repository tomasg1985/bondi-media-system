// ==================================================
// AI LOADER - CARGA DE MÓDULOS BAJO DEMANDA
// ==================================================

console.log('📦 Cargando AI Loader...');

// ==================================================
// CARGAR MÓDULOS CUANDO SE NECESITAN
// ==================================================
window.loadAIModule = function(module) {
    console.log(`📂 Cargando módulo: ${module}`);
    
    const container = document.getElementById('ai-module-content');
    if (!container) return;

    switch(module) {
        case 'assistant':
            loadAssistantModule(container);
            break;
        case 'benchmarking':
            loadBenchmarkingModule(container);
            break;
        case 'platform':
            loadPlatformModule(container);
            break;
    }
};

// ==================================================
// CARGAR ASISTENTE
// ==================================================
function loadAssistantModule(container) {
    // Verificar si ya está cargado
    if (document.getElementById('ai-assistant-card')) {
        container.innerHTML = '';
        container.appendChild(document.getElementById('ai-assistant-card'));
        return;
    }

    // Crear placeholder
    container.innerHTML = `
        <div id="ai-assistant-card" class="card">
            <div class="card-header">
                <h3 class="card-title">🤖 Asistente IA</h3>
            </div>
            <div style="padding: 40px; text-align: center;">
                <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 20px;">Inicializando asistente...</p>
            </div>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;

    // Inicializar asistente
    if (window.initOptimizedAI) {
        setTimeout(window.initOptimizedAI, 500);
    } else {
        // Cargar script del asistente si no está
        const script = document.createElement('script');
        script.src = 'js/modules/ai-assistant-v2.js';
        script.onload = () => setTimeout(window.initOptimizedAI, 500);
        document.body.appendChild(script);
    }
}

// ==================================================
// CARGAR BENCHMARKING
// ==================================================
function loadBenchmarkingModule(container) {
    // Verificar si ya está cargado
    if (document.getElementById('benchmarking-panel')) {
        container.innerHTML = '';
        container.appendChild(document.getElementById('benchmarking-panel'));
        return;
    }

    // Crear placeholder
    container.innerHTML = `
        <div id="benchmarking-panel" class="card">
            <div class="card-header">
                <h3 class="card-title">📊 Benchmarking</h3>
            </div>
            <div style="padding: 40px; text-align: center;">
                <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #10b981; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 20px;">Cargando datos de competencia...</p>
            </div>
        </div>
    `;

    // Inicializar benchmarking
    if (window.initBenchmarking) {
        setTimeout(window.initBenchmarking, 500);
    } else {
        const script = document.createElement('script');
        script.src = 'js/modules/benchmarking.js';
        script.onload = () => setTimeout(window.initBenchmarking, 500);
        document.body.appendChild(script);
    }
}

// ==================================================
// CARGAR OPTIMIZADOR
// ==================================================
function loadPlatformModule(container) {
    // Verificar si ya está cargado
    if (document.getElementById('platform-optimizer-panel')) {
        container.innerHTML = '';
        container.appendChild(document.getElementById('platform-optimizer-panel'));
        return;
    }

    // Crear placeholder
    container.innerHTML = `
        <div id="platform-optimizer-panel" class="card">
            <div class="card-header">
                <h3 class="card-title">📱 Optimizador Multiplataforma</h3>
            </div>
            <div style="padding: 40px; text-align: center;">
                <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #f59e0b; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 20px;">Preparando optimizador...</p>
            </div>
        </div>
    `;

    // Inicializar optimizador
    if (window.initPlatformOptimizer) {
        setTimeout(window.initPlatformOptimizer, 500);
    } else {
        const script = document.createElement('script');
        script.src = 'js/modules/platform-optimizer.js';
        script.onload = () => setTimeout(window.initPlatformOptimizer, 500);
        document.body.appendChild(script);
    }
}

console.log('✅ AI Loader listo');