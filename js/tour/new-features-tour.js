// ==================================================
// NEW FEATURES TOUR - TOUR DE NUEVAS FUNCIONES
// ==================================================

console.log('🚀 Cargando tour de nuevas funciones...');

class NewFeaturesTour {
    constructor() {
        this.currentVersion = '2.0';
        this.newFeatures = [
            {
                version: '2.0',
                date: '2026-03-15',
                features: [
                    {
                        name: '🤖 Asistente IA',
                        description: 'Genera contenido automático con inteligencia artificial',
                        element: '[data-section="ai-assistant"]',
                        action: 'window.navigateToAI("assistant")'
                    },
                    {
                        name: '📊 Benchmarking',
                        description: 'Compara tu rendimiento con la competencia',
                        element: '[data-section="ai-benchmarking"]',
                        action: 'window.navigateToAI("benchmarking")'
                    },
                    {
                        name: '📱 Optimizador Multiplataforma',
                        description: 'Adapta tu contenido para redes sociales',
                        element: '[data-section="ai-platform"]',
                        action: 'window.navigateToAI("platform")'
                    },
                    {
                        name: '🔮 Análisis Predictivo',
                        description: 'Predice el rendimiento de tu contenido',
                        element: '[data-section="ai-predictive"]',
                        action: 'window.navigateToAI("predictive")'
                    },
                    {
                        name: '🎯 Biblioteca de Hooks',
                        description: 'Generador y analizador de hooks',
                        element: '[data-section="ai-hooks"]',
                        action: 'window.navigateToAI("hooks")'
                    }
                ]
            }
        ];
        
        this.init();
    }

    init() {
        this.checkNewVersion();
    }

    getLastSeenVersion() {
        return localStorage.getItem('last-version') || '1.0';
    }

    getNewFeatures() {
        const lastSeen = this.getLastSeenVersion();
        return this.newFeatures.filter(v => v.version > lastSeen);
    }

    checkNewVersion() {
        const newFeatures = this.getNewFeatures();
        
        if (newFeatures.length > 0 && !localStorage.getItem('new-features-shown')) {
            setTimeout(() => this.showNewFeaturesModal(newFeatures), 2000);
            localStorage.setItem('new-features-shown', 'true');
        }
    }

    showNewFeaturesModal(newVersions) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 class="modal-title">🚀 ¡Nuevas funciones disponibles!</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                
                <div style="padding: 20px;">
                    <p style="margin-bottom: 20px; color: var(--gray-600);">
                        Hemos agregado nuevas herramientas para potenciar tu trabajo:
                    </p>
                    
                    ${newVersions.map(v => `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: var(--primary); margin-bottom: 10px;">Versión ${v.version}</h4>
                            <div style="display: grid; gap: 15px;">
                                ${v.features.map(f => `
                                    <div style="background: var(--gray-50); padding: 15px; border-radius: 8px; cursor: pointer;" 
                                         onclick="${f.action}; this.closest('.modal').remove()">
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <span style="font-size: 24px;">${f.name.split(' ')[0]}</span>
                                            <div>
                                                <strong>${f.name}</strong>
                                                <p style="font-size: 12px; color: var(--gray-600); margin-top: 4px;">${f.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button class="btn-primary" onclick="this.closest('.modal').remove()">
                            ¡Probar ahora!
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

// Inicializar
setTimeout(() => {
    window.newFeaturesTour = new NewFeaturesTour();
}, 3000);

console.log('✅ Tour de nuevas funciones cargado');