// ==================================================
// COMPARATIVAS - VERSIÓN COMPLETA CON TODAS LAS FUNCIONES
// ==================================================

console.log('📈 Cargando comparisons.js...');

// ==================================================
// VARIABLES GLOBALES
// ==================================================
let activeComparisonTab = 'monthly';

// ==================================================
// FUNCIÓN PARA MOSTRAR TABS
// ==================================================
window.showComparisonTab = function(tab) {
    activeComparisonTab = tab;
    
    document.querySelectorAll('.comparison-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.comparison-tabs .btn-secondary').forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'monthly') {
        document.getElementById('comparison-monthly').style.display = 'block';
        document.querySelector('[onclick="showComparisonTab(\'monthly\')"]').classList.add('active');
        loadMonthlyComparison();
    } else if (tab === 'performance') {
        document.getElementById('comparison-performance').style.display = 'block';
        document.querySelector('[onclick="showComparisonTab(\'performance\')"]').classList.add('active');
        loadPerformanceComparison();
    } else if (tab === 'recommendations') {
        document.getElementById('comparison-recommendations').style.display = 'block';
        document.querySelector('[onclick="showComparisonTab(\'recommendations\')"]').classList.add('active');
        loadRecommendations();
    }
};

// ==================================================
// TAB 1: COMPARATIVA MENSUAL
// ==================================================
window.loadMonthlyComparison = function() {
    console.log('📊 Cargando comparativa mensual...');
    
    const container = document.getElementById('comparison-monthly');
    if (!container) return;
    
    const allContent = window.appData?.calendar?.filter(c => c.metrics) || [];
    
    const marchContent = allContent.filter(c => c.date?.startsWith('2026-03'));
    const aprilContent = allContent.filter(c => c.date?.startsWith('2026-04'));
    const mayContent = allContent.filter(c => c.date?.startsWith('2026-05'));
    
    // MARZO
    let marchReach = 0, marchEngagement = 0, marchDMs = 0;
    marchContent.forEach(c => {
        const ig = c.metrics?.instagram || {};
        const fb = c.metrics?.facebook || {};
        const tt = c.metrics?.tiktok || {};
        
        marchReach += (ig.reach || 0) + (fb.reach || 0);
        
        const engagement = (ig.likes || 0) + (ig.comments || 0) + 
                          (fb.reactions || 0) + (fb.comments || 0) +
                          (tt.likes || 0) + (tt.comments || 0);
        marchEngagement += engagement;
        
        marchDMs += (ig.dms || 0) + (fb.messages || 0);
    });
    
    const marchAvgReach = marchContent.length > 0 ? Math.round(marchReach / marchContent.length) : 0;
    const marchAvgEng = marchContent.length > 0 ? (marchEngagement / marchContent.length).toFixed(1) : 0;
    
    // ABRIL
    let aprilReach = 0, aprilEngagement = 0, aprilDMs = 0;
    aprilContent.forEach(c => {
        const ig = c.metrics?.instagram || {};
        const fb = c.metrics?.facebook || {};
        const tt = c.metrics?.tiktok || {};
        
        aprilReach += (ig.reach || 0) + (fb.reach || 0);
        
        const engagement = (ig.likes || 0) + (ig.comments || 0) + 
                          (fb.reactions || 0) + (fb.comments || 0) +
                          (tt.likes || 0) + (tt.comments || 0);
        aprilEngagement += engagement;
        
        aprilDMs += (ig.dms || 0) + (fb.messages || 0);
    });
    
    const aprilAvgReach = aprilContent.length > 0 ? Math.round(aprilReach / aprilContent.length) : 0;
    const aprilAvgEng = aprilContent.length > 0 ? (aprilEngagement / aprilContent.length).toFixed(1) : 0;
    
    // MAYO
    let mayReach = 0, mayEngagement = 0, mayDMs = 0;
    mayContent.forEach(c => {
        const ig = c.metrics?.instagram || {};
        const fb = c.metrics?.facebook || {};
        const tt = c.metrics?.tiktok || {};
        
        mayReach += (ig.reach || 0) + (fb.reach || 0);
        
        const engagement = (ig.likes || 0) + (ig.comments || 0) + 
                          (fb.reactions || 0) + (fb.comments || 0) +
                          (tt.likes || 0) + (tt.comments || 0);
        mayEngagement += engagement;
        
        mayDMs += (ig.dms || 0) + (fb.messages || 0);
    });
    
    const mayAvgReach = mayContent.length > 0 ? Math.round(mayReach / mayContent.length) : 0;
    const mayAvgEng = mayContent.length > 0 ? (mayEngagement / mayContent.length).toFixed(1) : 0;
    
    // Diferencias
    const diffReachMarzoAbril = aprilAvgReach - marchAvgReach;
    const diffReachAbrilMayo = mayAvgReach - aprilAvgReach;
    
    const diffEngMarzoAbril = (parseFloat(aprilAvgEng) - parseFloat(marchAvgEng)).toFixed(1);
    const diffEngAbrilMayo = (parseFloat(mayAvgEng) - parseFloat(aprilAvgEng)).toFixed(1);
    
    const diffDMsMarzoAbril = aprilDMs - marchDMs;
    const diffDMsAbrilMayo = mayDMs - aprilDMs;
    
    // Crear HTML
    let html = `
        <style>
            .comparison-table {
                width: 100%;
                border-collapse: collapse;
                margin: 16px 0;
            }
            .comparison-table th {
                background: var(--gray-100);
                padding: 12px;
                text-align: left;
                font-weight: 600;
                border-bottom: 2px solid var(--gray-300);
            }
            .comparison-table td {
                padding: 12px;
                border-bottom: 1px solid var(--gray-200);
            }
            .positive { color: #10b981; font-weight: 600; }
            .negative { color: #ef4444; font-weight: 600; }
        </style>
        <div style="overflow-x: auto;">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Métrica</th>
                        <th>Marzo</th>
                        <th>Abril</th>
                        <th>Mayo</th>
                        <th>Var M→A</th>
                        <th>Var A→M</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Alcance
    html += `
        <tr>
            <td><strong>Alcance Promedio</strong></td>
            <td>${marchAvgReach > 0 ? marchAvgReach.toLocaleString() : '—'}</td>
            <td>${aprilAvgReach > 0 ? aprilAvgReach.toLocaleString() : '—'}</td>
            <td>${mayAvgReach > 0 ? mayAvgReach.toLocaleString() : '—'}</td>
            <td class="${diffReachMarzoAbril > 0 ? 'positive' : diffReachMarzoAbril < 0 ? 'negative' : ''}">
                ${diffReachMarzoAbril !== 0 ? (diffReachMarzoAbril > 0 ? '▲' : '▼') + ' ' + Math.abs(diffReachMarzoAbril).toLocaleString() : '—'}
            </td>
            <td class="${diffReachAbrilMayo > 0 ? 'positive' : diffReachAbrilMayo < 0 ? 'negative' : ''}">
                ${diffReachAbrilMayo !== 0 ? (diffReachAbrilMayo > 0 ? '▲' : '▼') + ' ' + Math.abs(diffReachAbrilMayo).toLocaleString() : '—'}
            </td>
        </tr>
    `;
    
    // Engagement
    html += `
        <tr>
            <td><strong>Engagement Promedio</strong></td>
            <td>${parseFloat(marchAvgEng) > 0 ? marchAvgEng : '—'}</td>
            <td>${parseFloat(aprilAvgEng) > 0 ? aprilAvgEng : '—'}</td>
            <td>${parseFloat(mayAvgEng) > 0 ? mayAvgEng : '—'}</td>
            <td class="${parseFloat(diffEngMarzoAbril) > 0 ? 'positive' : parseFloat(diffEngMarzoAbril) < 0 ? 'negative' : ''}">
                ${parseFloat(diffEngMarzoAbril) !== 0 ? (parseFloat(diffEngMarzoAbril) > 0 ? '▲' : '▼') + ' ' + Math.abs(diffEngMarzoAbril) : '—'}
            </td>
            <td class="${parseFloat(diffEngAbrilMayo) > 0 ? 'positive' : parseFloat(diffEngAbrilMayo) < 0 ? 'negative' : ''}">
                ${parseFloat(diffEngAbrilMayo) !== 0 ? (parseFloat(diffEngAbrilMayo) > 0 ? '▲' : '▼') + ' ' + Math.abs(diffEngAbrilMayo) : '—'}
            </td>
        </tr>
    `;
    
    // DMs
    html += `
        <tr>
            <td><strong>DMs Totales</strong></td>
            <td>${marchDMs > 0 ? marchDMs.toLocaleString() : '—'}</td>
            <td>${aprilDMs > 0 ? aprilDMs.toLocaleString() : '—'}</td>
            <td>${mayDMs > 0 ? mayDMs.toLocaleString() : '—'}</td>
            <td class="${diffDMsMarzoAbril > 0 ? 'positive' : diffDMsMarzoAbril < 0 ? 'negative' : ''}">
                ${diffDMsMarzoAbril !== 0 ? (diffDMsMarzoAbril > 0 ? '▲' : '▼') + ' ' + Math.abs(diffDMsMarzoAbril).toLocaleString() : '—'}
            </td>
            <td class="${diffDMsAbrilMayo > 0 ? 'positive' : diffDMsAbrilMayo < 0 ? 'negative' : ''}">
                ${diffDMsAbrilMayo !== 0 ? (diffDMsAbrilMayo > 0 ? '▲' : '▼') + ' ' + Math.abs(diffDMsAbrilMayo).toLocaleString() : '—'}
            </td>
        </tr>
    `;
    
    // Publicaciones
    html += `
        <tr>
            <td><strong>Publicaciones c/métricas</strong></td>
            <td>${marchContent.length}</td>
            <td>${aprilContent.length}</td>
            <td>${mayContent.length}</td>
            <td colspan="2"></td>
        </tr>
    `;
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
    console.log('✅ Comparativa mensual cargada');
};

// ==================================================
// TAB 2: ANÁLISIS DE PERFORMANCE
// ==================================================
window.loadPerformanceComparison = function() {
    console.log('🎬 Cargando análisis de performance...');
    
    const container = document.getElementById('comparison-performance');
    if (!container) return;
    
    const reels = window.appData?.calendar?.filter(c => c.type === 'reel' && c.metrics?.videoMetrics) || [];
    
    if (reels.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎬</div>
                <p>No hay Reels con métricas de video</p>
            </div>
        `;
        return;
    }
    
    // Calcular estadísticas generales
    const avgRetention = reels.reduce((sum, r) => sum + (r.metrics.videoMetrics.retentionPercent || 0), 0) / reels.length;
    
    // Clasificar por rating
    const byRating = {
        excelente: reels.filter(r => r.metrics.videoMetrics.rating === 'excelente'),
        bueno: reels.filter(r => r.metrics.videoMetrics.rating === 'bueno'),
        regular: reels.filter(r => r.metrics.videoMetrics.rating === 'regular'),
        malo: reels.filter(r => r.metrics.videoMetrics.rating === 'malo')
    };
    
    let html = `
        <style>
            .performance-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            .rating-section {
                margin-bottom: 20px;
                padding: 16px;
                border-radius: 8px;
            }
        </style>
    `;
    
    html += `
        <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 16px;">📊 Estadísticas generales</h3>
            <div class="performance-stats">
                <div class="stat-card" style="padding: 16px;">
                    <div class="stat-label">Total Reels</div>
                    <div class="stat-value" style="font-size: 28px;">${reels.length}</div>
                </div>
                <div class="stat-card" style="padding: 16px;">
                    <div class="stat-label">Retención Promedio</div>
                    <div class="stat-value" style="font-size: 28px;">${avgRetention.toFixed(1)}%</div>
                </div>
            </div>
        </div>
    `;
    
    // Reels por rating
    if (byRating.excelente.length > 0) {
        html += `
            <div class="rating-section" style="background: #ecfdf5; border-left: 4px solid #10b981;">
                <h4 style="color: #059669; margin-bottom: 12px;">🌟 EXCELENTES (${byRating.excelente.length})</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${byRating.excelente.map(r => `<li style="margin-bottom: 4px;">${r.title} <strong>(${r.metrics.videoMetrics.retentionPercent}%)</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (byRating.bueno.length > 0) {
        html += `
            <div class="rating-section" style="background: #eff6ff; border-left: 4px solid #3b82f6;">
                <h4 style="color: #2563eb; margin-bottom: 12px;">✅ BUENOS (${byRating.bueno.length})</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${byRating.bueno.map(r => `<li style="margin-bottom: 4px;">${r.title} <strong>(${r.metrics.videoMetrics.retentionPercent}%)</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (byRating.regular.length > 0) {
        html += `
            <div class="rating-section" style="background: #fffbeb; border-left: 4px solid #f59e0b;">
                <h4 style="color: #d97706; margin-bottom: 12px;">⚠️ REGULARES (${byRating.regular.length})</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${byRating.regular.map(r => `<li style="margin-bottom: 4px;">${r.title} <strong>(${r.metrics.videoMetrics.retentionPercent}%)</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (byRating.malo.length > 0) {
        html += `
            <div class="rating-section" style="background: #fef2f2; border-left: 4px solid #ef4444;">
                <h4 style="color: #dc2626; margin-bottom: 12px;">❌ MALOS (${byRating.malo.length})</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${byRating.malo.map(r => `<li style="margin-bottom: 4px;">${r.title} <strong>(${r.metrics.videoMetrics.retentionPercent}%)</strong></li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    container.innerHTML = html;
    console.log('✅ Análisis de performance cargado');
};

// ==================================================
// TAB 3: RECOMENDACIONES DINÁMICAS
// ==================================================
window.loadRecommendations = function() {
    console.log('💡 Generando recomendaciones personalizadas...');
    
    const container = document.getElementById('comparison-recommendations');
    if (!container) return;
    
    const allContent = window.appData?.calendar || [];
    const withMetrics = allContent.filter(c => c.metrics);
    
    if (withMetrics.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p><strong>No hay suficientes datos</strong></p>
                <p style="color: var(--gray-600);">Agregá métricas a tus publicaciones para obtener recomendaciones personalizadas.</p>
            </div>
        `;
        return;
    }

    // Analizar datos para generar recomendaciones personalizadas
    const recommendations = generateSmartRecommendations(withMetrics);
    
    let html = `
        <style>
            .rec-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                border-radius: 12px;
                color: white;
                margin-bottom: 20px;
            }
            .rec-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                border: 1px solid var(--gray-200);
            }
            .rec-priority-high {
                border-left: 4px solid #ef4444;
            }
            .rec-priority-medium {
                border-left: 4px solid #f59e0b;
            }
            .rec-priority-low {
                border-left: 4px solid #3b82f6;
            }
            .rec-tag {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                margin-right: 8px;
            }
            .metric-highlight {
                background: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                margin: 10px 0;
            }
        </style>

        <div class="rec-header">
            <h2 style="font-size: 24px; margin-bottom: 10px;">💡 Recomendaciones Personalizadas</h2>
            <p style="opacity: 0.9;">Basadas en el análisis de ${withMetrics.length} publicaciones</p>
        </div>
    `;

    if (recommendations.length === 0) {
        html += `
            <div class="rec-card">
                <p style="text-align: center; color: var(--gray-600);">¡Todo va bien! No hay recomendaciones específicas en este momento.</p>
            </div>
        `;
    } else {
        recommendations.forEach(rec => {
            const priorityClass = rec.priority === 'alta' ? 'rec-priority-high' : 
                                 rec.priority === 'media' ? 'rec-priority-medium' : 'rec-priority-low';
            
            html += `
                <div class="rec-card ${priorityClass}">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <h3 style="font-size: 16px; font-weight: 600;">${rec.titulo}</h3>
                        <span class="rec-tag" style="background: ${rec.priority === 'alta' ? '#fee2e2' : rec.priority === 'media' ? '#fef3c7' : '#dbeafe'}; 
                                   color: ${rec.priority === 'alta' ? '#dc2626' : rec.priority === 'media' ? '#d97706' : '#2563eb'};">
                            ${rec.priority === 'alta' ? '🔴 Alta' : rec.priority === 'media' ? '🟡 Media' : '🔵 Baja'}
                        </span>
                    </div>
                    
                    <p style="color: var(--gray-700); margin-bottom: 15px;">${rec.descripcion}</p>
                    
                    ${rec.datos ? `
                        <div class="metric-highlight">
                            <strong>📊 Datos relevantes:</strong>
                            <p style="margin-top: 5px;">${rec.datos}</p>
                        </div>
                    ` : ''}
                    
                    <div style="margin-top: 15px;">
                        <strong>🎯 Acciones sugeridas:</strong>
                        <ul style="margin-top: 8px; padding-left: 20px;">
                            ${rec.acciones.map(a => `<li style="margin-bottom: 5px;">✓ ${a}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${rec.ejemplos ? `
                        <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--gray-200);">
                            <strong>📝 Ejemplo:</strong>
                            <p style="font-style: italic; margin-top: 5px; color: var(--gray-600);">"${rec.ejemplos}"</p>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    }

    container.innerHTML = html;
};

// ==================================================
// GENERADOR INTELIGENTE DE RECOMENDACIONES
// ==================================================
function generateSmartRecommendations(contenidos) {
    const recommendations = [];
    
    // 1. Analizar reels con baja retención
    const reelsConMetricas = contenidos.filter(c => c.type === 'reel' && c.metrics?.videoMetrics);
    const reelsBajaRetencion = reelsConMetricas.filter(r => (r.metrics.videoMetrics.retentionPercent || 0) < 40);
    
    if (reelsBajaRetencion.length > 0) {
        const porcentaje = Math.round((reelsBajaRetencion.length / reelsConMetricas.length) * 100);
        recommendations.push({
            titulo: `⚠️ ${reelsBajaRetencion.length} reels con baja retención`,
            descripcion: `El ${porcentaje}% de tus reels tienen retención menor al 40%. Esto significa que la audiencia abandona antes de ver el contenido completo.`,
            datos: `${reelsBajaRetencion.length} de ${reelsConMetricas.length} reels necesitan mejora.`,
            acciones: [
                "Revisá los primeros 3 segundos de esos reels (deben enganchar inmediatamente)",
                "Acelerá el ritmo de edición (cortes cada 2-3 segundos)",
                "Agregá subtítulos grandes y llamativos",
                "Usá hooks con preguntas o datos curiosos"
            ],
            ejemplos: "¿Sabías que...? / El error que estás cometiendo... / 3 señales de que...",
            prioridad: reelsBajaRetencion.length > 3 ? 'alta' : 'media'
        });
    }

    // 2. Analizar engagement bajo
    const publicaciones = contenidos.filter(c => c.metrics?.instagram || c.metrics?.facebook);
    if (publicaciones.length > 0) {
        let totalEngagement = 0;
        let totalAlcance = 0;
        
        publicaciones.forEach(p => {
            const ig = p.metrics.instagram || {};
            const fb = p.metrics.facebook || {};
            const alcance = (ig.reach || 0) + (fb.reach || 0);
            const engagement = (ig.likes || 0) + (ig.comments || 0) + (fb.reactions || 0) + (fb.comments || 0);
            
            totalAlcance += alcance;
            totalEngagement += engagement;
        });
        
        const avgEngagementRate = totalAlcance > 0 ? (totalEngagement / totalAlcance) * 100 : 0;
        
        if (avgEngagementRate < 3) {
            recommendations.push({
                titulo: "💬 Engagement por debajo del promedio",
                descripcion: `Tu engagement rate promedio es de ${avgEngagementRate.toFixed(1)}%. El promedio saludable es 3-6%.`,
                datos: `${totalEngagement} interacciones en ${totalAlcance.toLocaleString()} alcance.`,
                acciones: [
                    "Incluí preguntas en tus copies",
                    "Agregá CTAs más claros (Escribí INFO, Comentá, Guardá)",
                    "Respondé comentarios rápidamente para generar conversación",
                    "Usá stickers interactivos en stories (encuestas, quizzes)"
                ],
                ejemplos: "¿Qué opinás? / ¿Te pasó? / Escribí INFO para más tips",
                prioridad: 'alta'
            });
        }
    }

    // 3. Analizar consistencia de publicación
    const fechas = publicaciones.map(p => new Date(p.date)).sort((a,b) => a - b);
    if (fechas.length > 3) {
        const primerFecha = fechas[0];
        const ultimaFecha = fechas[fechas.length - 1];
        const diasTotales = Math.round((ultimaFecha - primerFecha) / (1000 * 60 * 60 * 24));
        const frecuencia = (publicaciones.length / diasTotales) * 7; // publicaciones por semana
        
        if (frecuencia < 2) {
            recommendations.push({
                titulo: "📅 Frecuencia de publicación baja",
                descripcion: `Estás publicando aproximadamente ${frecuencia.toFixed(1)} veces por semana. Para mantener el engagement, se recomienda 3-5 publicaciones semanales.`,
                datos: `${publicaciones.length} publicaciones en ${diasTotales} días.`,
                acciones: [
                    "Aumentá gradualmente la frecuencia",
                    "Planificá contenido con anticipación",
                    "Usá contenido de valor que no requiera mucha producción",
                    "Reutilizá contenido que funcionó bien"
                ],
                prioridad: 'media'
            });
        }
    }

    // 4. Analizar mejores horarios (si hay datos)
    const horas = {};
    publicaciones.forEach(p => {
        const hora = parseInt(p.time?.split(':')[0] || 20);
        const alcance = (p.metrics?.instagram?.reach || 0) + (p.metrics?.facebook?.reach || 0);
        
        if (!horas[hora]) {
            horas[hora] = { total: 0, count: 0 };
        }
        horas[hora].total += alcance;
        horas[hora].count++;
    });

    let mejorHora = 20;
    let mejorPromedio = 0;
    Object.entries(horas).forEach(([hora, data]) => {
        if (data.count > 0) {
            const promedio = data.total / data.count;
            if (promedio > mejorPromedio) {
                mejorHora = parseInt(hora);
                mejorPromedio = promedio;
            }
        }
    });

    if (mejorHora !== 20 && mejorPromedio > 0) {
        recommendations.push({
            titulo: "⏰ Optimización de horarios",
            descripcion: `Según tus datos, el mejor horario para publicar es las ${mejorHora}:00hs.`,
            datos: `Alcance promedio: ${Math.round(mejorPromedio).toLocaleString()}`,
            acciones: [
                `Programá tus publicaciones importantes a las ${mejorHora}:00hs`,
                "Hacé pruebas en diferentes horarios",
                "Analizá si tu audiencia es más activa en ese momento"
            ],
            prioridad: 'media'
        });
    }

    // Limitar a máximo 5 recomendaciones para no saturar
    return recommendations.slice(0, 5);
}

console.log('✅ comparisons.js cargado con todas las funciones');