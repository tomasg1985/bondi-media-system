// ==================================================
// TOUR ANALYTICS - ESTADÍSTICAS DE USO DE TOURS
// ==================================================

console.log('📊 Cargando analytics de tours...');

class TourAnalytics {
    constructor() {
        this.stats = JSON.parse(localStorage.getItem('tour-stats') || '{}');
        this.init();
    }

    init() {
        // Agregar botón de estadísticas en configuración
        this.addAnalyticsButton();
    }

    addAnalyticsButton() {
        // Esperar a que la sección de configuración esté lista
        setTimeout(() => {
            const configSection = document.getElementById('config');
            if (!configSection) return;
            
            const analyticsBtn = document.createElement('div');
            analyticsBtn.style.marginTop = '20px';
            analyticsBtn.innerHTML = `
                <h4 style="margin-bottom: 12px;">📊 Estadísticas de Tours</h4>
                <button class="btn-secondary" onclick="window.tourAnalytics.showReport()">
                    Ver reporte de uso
                </button>
            `;
            
            // Insertar antes de la zona de peligro
            const dangerZone = configSection.querySelector('[style*="border: 2px solid #ef4444"]');
            if (dangerZone) {
                dangerZone.insertAdjacentElement('beforebegin', analyticsBtn);
            }
        }, 3000);
    }

    calculateMetrics() {
        const metrics = {
            totalUsers: 1, // En versión real, sería dinámico
            totalToursStarted: 0,
            totalToursCompleted: 0,
            totalStepsViewed: 0,
            completionRate: 0,
            mostViewedTour: null,
            mostSkippedTour: null,
            tours: {}
        };
        
        Object.entries(this.stats).forEach(([tourName, data]) => {
            metrics.totalToursStarted += data.starts || 0;
            metrics.totalToursCompleted += data.completions || 0;
            
            const stepsViewed = (data.steps || []).reduce((sum, count) => sum + count, 0);
            metrics.totalStepsViewed += stepsViewed;
            
            metrics.tours[tourName] = {
                starts: data.starts || 0,
                completions: data.completions || 0,
                skips: data.skips || 0,
                stepsViewed: stepsViewed,
                completionRate: data.starts ? ((data.completions / data.starts) * 100).toFixed(1) : 0
            };
        });
        
        metrics.completionRate = metrics.totalToursStarted ? 
            ((metrics.totalToursCompleted / metrics.totalToursStarted) * 100).toFixed(1) : 0;
        
        // Encontrar tour más visto
        let maxStarts = 0;
        Object.entries(metrics.tours).forEach(([name, data]) => {
            if (data.starts > maxStarts) {
                maxStarts = data.starts;
                metrics.mostViewedTour = name;
            }
        });
        
        return metrics;
    }

    showReport() {
        const metrics = this.calculateMetrics();
        
        let html = `
            <div style="padding: 20px;">
                <h3 style="margin-bottom: 20px;">📊 Reporte de uso de tours</h3>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
                    <div style="background: var(--gray-50); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 12px; color: var(--gray-600);">Tours iniciados</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--primary);">${metrics.totalToursStarted}</div>
                    </div>
                    <div style="background: var(--gray-50); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 12px; color: var(--gray-600);">Tours completados</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--success);">${metrics.totalToursCompleted}</div>
                    </div>
                    <div style="background: var(--gray-50); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 12px; color: var(--gray-600);">Tasa de finalización</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--warning);">${metrics.completionRate}%</div>
                    </div>
                </div>
                
                <h4 style="margin-bottom: 15px;">Detalle por tour</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--gray-100);">
                            <th style="padding: 10px; text-align: left;">Tour</th>
                            <th style="padding: 10px; text-align: center;">Inicios</th>
                            <th style="padding: 10px; text-align: center;">Completados</th>
                            <th style="padding: 10px; text-align: center;">Abandonos</th>
                            <th style="padding: 10px; text-align: center;">Pasos vistos</th>
                            <th style="padding: 10px; text-align: center;">% éxito</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        Object.entries(metrics.tours).forEach(([name, data]) => {
            const abandonos = data.starts - data.completions;
            html += `
                <tr style="border-bottom: 1px solid var(--gray-200);">
                    <td style="padding: 10px;"><strong>${name}</strong></td>
                    <td style="padding: 10px; text-align: center;">${data.starts}</td>
                    <td style="padding: 10px; text-align: center;">${data.completions}</td>
                    <td style="padding: 10px; text-align: center; color: var(--danger);">${abandonos}</td>
                    <td style="padding: 10px; text-align: center;">${data.stepsViewed}</td>
                    <td style="padding: 10px; text-align: center; color: ${data.completionRate > 70 ? 'var(--success)' : 'var(--warning)'};">${data.completionRate}%</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
                
                <div style="margin-top: 30px; padding: 20px; background: var(--gray-50); border-radius: 8px;">
                    <strong>💡 Insights:</strong>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        <li>Tour más popular: <strong>${metrics.mostViewedTour || 'N/A'}</strong></li>
                        <li>Total pasos vistos: <strong>${metrics.totalStepsViewed}</strong></li>
                        <li>Tasa de éxito global: <strong>${metrics.completionRate}%</strong></li>
                    </ul>
                </div>
            </div>
        `;
        
        // Mostrar en modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3 class="modal-title">📊 Estadísticas de Tours</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                ${html}
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    resetStats() {
        if (confirm('¿Eliminar todas las estadísticas de tours?')) {
            localStorage.removeItem('tour-stats');
            this.stats = {};
            alert('✅ Estadísticas eliminadas');
        }
    }
}

// Inicializar
window.tourAnalytics = new TourAnalytics();

console.log('✅ Analytics de tours cargado');