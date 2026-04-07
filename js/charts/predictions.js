// ==================================================
// PREDICCIONES - ANÁLISIS PREDICTIVO
// ==================================================

console.log('🔮 Cargando predictions.js...');

// ==================================================
// CALCULAR PREDICCIONES BASADAS EN DATOS HISTÓRICOS
// ==================================================
window.calculatePredictions = function() {
    console.log('📊 Calculando predicciones...');
    
    if (!window.appData || !window.appData.calendar) {
        console.log('⚠️ No hay datos de calendario');
        return null;
    }
    
    // Obtener últimos 30 días de métricas
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const recentContent = window.appData.calendar.filter(c => {
        if (!c.date || !c.metrics) return false;
        const contentDate = new Date(c.date);
        return contentDate >= thirtyDaysAgo && contentDate <= today;
    });
    
    console.log(`📊 Contenido reciente (30 días): ${recentContent.length} items`);
    
    if (recentContent.length < 3) {
        console.log('⚠️ Necesitamos al menos 3 items para predecir');
        return null;
    }
    
    // Extraer métricas por día
    const dailyMetrics = {};
    
    recentContent.forEach(content => {
        const date = content.date;
        if (!dailyMetrics[date]) {
            dailyMetrics[date] = {
                reach: 0,
                engagement: 0,
                dms: 0,
                count: 0
            };
        }
        
        const ig = content.metrics?.instagram || {};
        const fb = content.metrics?.facebook || {};
        const tt = content.metrics?.tiktok || {};
        
        dailyMetrics[date].reach += (ig.reach || 0) + (fb.reach || 0);
        dailyMetrics[date].engagement += (ig.likes || 0) + (ig.comments || 0) + 
                                        (fb.reactions || 0) + (fb.comments || 0) +
                                        (tt.likes || 0) + (tt.comments || 0);
        dailyMetrics[date].dms += (ig.dms || 0) + (fb.messages || 0);
        dailyMetrics[date].count++;
    });
    
    // Convertir a array para análisis
    const metricsArray = Object.entries(dailyMetrics).map(([date, data]) => ({
        date,
        reach: data.reach,
        engagement: data.engagement,
        dms: data.dms,
        avgReach: data.count > 0 ? data.reach / data.count : 0
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    console.log(`📊 Días con métricas: ${metricsArray.length}`);
    
    // Calcular tendencias (regresión lineal simple)
    const n = metricsArray.length;
    if (n < 2) return null;
    
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yReach = metricsArray.map(m => m.reach);
    const yEngagement = metricsArray.map(m => m.engagement);
    const yDMs = metricsArray.map(m => m.dms);
    
    // Calcular pendiente para reach
    const slopeReach = calculateSlope(xValues, yReach);
    const slopeEngagement = calculateSlope(xValues, yEngagement);
    const slopeDMs = calculateSlope(xValues, yDMs);
    
    // Calcular promedios móviles
    const avgReach = yReach.reduce((a, b) => a + b, 0) / n;
    const avgEngagement = yEngagement.reduce((a, b) => a + b, 0) / n;
    const avgDMs = yDMs.reduce((a, b) => a + b, 0) / n;
    
    // Predecir próximos 7 días
    const predictions = [];
    const lastDate = new Date(metricsArray[n-1].date);
    
    for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(lastDate);
        nextDate.setDate(lastDate.getDate() + i);
        
        const predictedReach = Math.max(0, Math.round(avgReach + (slopeReach * i)));
        const predictedEngagement = Math.max(0, Math.round(avgEngagement + (slopeEngagement * i)));
        const predictedDMs = Math.max(0, Math.round(avgDMs + (slopeDMs * i)));
        
        predictions.push({
            date: nextDate.toISOString().split('T')[0],
            reach: predictedReach,
            engagement: predictedEngagement,
            dms: predictedDMs,
            confidence: calculateConfidence(i, n)
        });
    }
    
    // Determinar tendencia general
    let trend = 'estable';
    let trendIcon = '➡️';
    let trendColor = '#6b7280';
    
    if (slopeReach > avgReach * 0.05) {
        trend = 'creciendo';
        trendIcon = '📈';
        trendColor = '#10b981';
    } else if (slopeReach < -avgReach * 0.05) {
        trend = 'decreciendo';
        trendIcon = '📉';
        trendColor = '#ef4444';
    }
    
    const result = {
        summary: {
            avgReach: Math.round(avgReach),
            avgEngagement: Math.round(avgEngagement),
            avgDMs: Math.round(avgDMs),
            totalContent: recentContent.length,
            trend: trend,
            trendIcon: trendIcon,
            trendColor: trendColor,
            slope: slopeReach.toFixed(1)
        },
        predictions: predictions,
        nextWeek: {
            reach: predictions.reduce((sum, p) => sum + p.reach, 0),
            engagement: predictions.reduce((sum, p) => sum + p.engagement, 0),
            dms: predictions.reduce((sum, p) => sum + p.dms, 0)
        }
    };
    
    console.log('✅ Predicciones calculadas:', result);
    return result;
};

// ==================================================
// CALCULAR PENDIENTE (REGRESIÓN LINEAL)
// ==================================================
function calculateSlope(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + (b * y[i]), 0);
    const sumXX = x.reduce((a, b) => a + (b * b), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return isFinite(slope) ? slope : 0;
}

// ==================================================
// CALCULAR CONFIANZA DE LA PREDICCIÓN
// ==================================================
function calculateConfidence(daysAhead, dataPoints) {
    // A más datos y menos días adelante, mayor confianza
    let confidence = 100;
    
    // Reducir confianza por cada día adelante
    confidence -= daysAhead * 5;
    
    // Aumentar confianza con más datos
    confidence += Math.min(30, dataPoints * 3);
    
    // Limitar entre 20 y 95
    return Math.min(95, Math.max(20, Math.round(confidence)));
}

// ==================================================
// ACTUALIZAR WIDGET DE PREDICCIONES
// ==================================================
window.updatePredictionsWidget = function() {
    console.log('🔮 Actualizando widget de predicciones...');
    
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    // Buscar si ya existe el widget
    let widget = document.getElementById('predictions-widget');
    
    if (!widget) {
        // Crear el widget si no existe
        widget = document.createElement('div');
        widget.id = 'predictions-widget';
        widget.className = 'card';
        widget.style.marginBottom = '24px';
        
        // Insertar después de las stats grid
        const statsGrid = document.querySelector('#dashboard .stats-grid');
        if (statsGrid) {
            statsGrid.insertAdjacentElement('afterend', widget);
        } else {
            dashboard.insertBefore(widget, dashboard.firstChild);
        }
    }
    
    // Calcular predicciones
    const predictions = calculatePredictions();
    
    if (!predictions) {
        widget.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">🔮 Predicciones</h3>
            </div>
            <div style="padding: 40px; text-align: center; color: var(--gray-600);">
                <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                <p>Se necesitan al menos 3 publicaciones con métricas en los últimos 30 días</p>
                <p style="font-size: 13px; margin-top: 8px;">Agrega más métricas para ver predicciones</p>
            </div>
        `;
        return;
    }
    
    // Crear HTML del widget
    let html = `
        <style>
            .predictions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                padding: 20px;
            }
            .prediction-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
                padding: 20px;
                position: relative;
                overflow: hidden;
            }
            .prediction-card::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                transform: rotate(45deg);
            }
            .prediction-label {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                opacity: 0.8;
                margin-bottom: 8px;
            }
            .prediction-value {
                font-size: 36px;
                font-weight: 700;
                margin-bottom: 4px;
            }
            .prediction-trend {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 14px;
                opacity: 0.9;
            }
            .summary-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                border: 1px solid var(--gray-200);
                grid-column: span 2;
            }
            .trend-indicator {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 14px;
            }
            .predictions-list {
                margin-top: 20px;
                padding: 0 20px 20px;
            }
            .prediction-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid var(--gray-200);
            }
            .prediction-item:last-child {
                border-bottom: none;
            }
            .prediction-date {
                font-weight: 600;
                color: var(--gray-700);
            }
            .prediction-numbers {
                display: flex;
                gap: 20px;
            }
            .prediction-numbers span {
                font-size: 13px;
            }
            .confidence-badge {
                background: var(--gray-100);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                color: var(--gray-600);
            }
        </style>
    `;
    
    html += `
        <div class="card-header">
            <h3 class="card-title">🔮 Predicciones para los próximos 7 días</h3>
            <div class="trend-indicator" style="background: ${predictions.summary.trendColor}20; color: ${predictions.summary.trendColor};">
                ${predictions.summary.trendIcon} Tendencia ${predictions.summary.trend}
            </div>
        </div>
        
        <div class="predictions-grid">
            <div class="prediction-card">
                <div class="prediction-label">Alcance estimado</div>
                <div class="prediction-value">${predictions.nextWeek.reach.toLocaleString()}</div>
                <div class="prediction-trend">
                    <span>📊 Promedio: ${predictions.summary.avgReach.toLocaleString()}/día</span>
                </div>
            </div>
            
            <div class="prediction-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                <div class="prediction-label">Engagement estimado</div>
                <div class="prediction-value">${predictions.nextWeek.engagement.toLocaleString()}</div>
                <div class="prediction-trend">
                    <span>💬 Promedio: ${predictions.summary.avgEngagement.toLocaleString()}/día</span>
                </div>
            </div>
            
            <div class="prediction-card" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                <div class="prediction-label">DMs estimados</div>
                <div class="prediction-value">${predictions.nextWeek.dms.toLocaleString()}</div>
                <div class="prediction-trend">
                    <span>💌 Promedio: ${predictions.summary.avgDMs.toLocaleString()}/día</span>
                </div>
            </div>
            
            <div class="summary-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <strong>📈 Proyección diaria</strong>
                    <span class="confidence-badge">Basado en ${predictions.summary.totalContent} publicaciones</span>
                </div>
                <div class="predictions-list">
    `;
    
    predictions.predictions.forEach(p => {
        const date = new Date(p.date);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
        const formattedDate = `${dayName} ${date.getDate()}/${date.getMonth()+1}`;
        
        html += `
            <div class="prediction-item">
                <span class="prediction-date">${formattedDate}</span>
                <div class="prediction-numbers">
                    <span>👁️ ${p.reach.toLocaleString()}</span>
                    <span>💬 ${p.engagement.toLocaleString()}</span>
                    <span>📩 ${p.dms}</span>
                    <span class="confidence-badge">${p.confidence}%</span>
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    widget.innerHTML = html;
    console.log('✅ Widget de predicciones actualizado');
};

console.log('✅ predictions.js cargado correctamente');