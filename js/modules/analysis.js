// ==================================================
// ANÁLISIS MENSUAL - CON SUGERENCIAS Y EJEMPLOS
// ==================================================

console.log('🔍 Cargando analysis.js...');

// Variable para guardar análisis por mes
window.monthlyAnalysis = window.monthlyAnalysis || {};

// ==================================================
// GENERAR EJEMPLOS PARA MEJORAR
// ==================================================
function generateExamples(monthContent, withMetrics, stats) {
    const examples = [];
    
    // 1. Ejemplo de buen hook
    const bestReels = withMetrics
        .filter(c => c.type === 'reel' && c.metrics?.videoMetrics)
        .sort((a, b) => (b.metrics.videoMetrics.retentionPercent || 0) - (a.metrics.videoMetrics.retentionPercent || 0))
        .slice(0, 2);
    
    if (bestReels.length > 0) {
        examples.push({
            titulo: '🎯 Ejemplos de hooks que funcionaron',
            descripcion: 'Estos reels tuvieron la mejor retención. Analiza sus primeros 3 segundos:',
            items: bestReels.map(r => ({
                nombre: r.title,
                valor: `${r.metrics.videoMetrics.retentionPercent}% retención`,
                detalle: r.details?.script ? 
                    r.details.script.split('\n')[0] : 
                    'Hook: Revisar primeros 3 segundos',
                tipo: 'reel'
            }))
        });
    }
    
    // 2. Ejemplo de estructura de carrusel
    const bestCarousels = withMetrics
        .filter(c => c.type === 'carousel')
        .sort((a, b) => {
            const reachA = (a.metrics?.instagram?.reach || 0) + (a.metrics?.facebook?.reach || 0);
            const reachB = (b.metrics?.instagram?.reach || 0) + (b.metrics?.facebook?.reach || 0);
            return reachB - reachA;
        })
        .slice(0, 2);
    
    if (bestCarousels.length > 0) {
        examples.push({
            titulo: '📊 Ejemplos de carruseles efectivos',
            descripcion: 'Estos carruseles generaron más alcance. Analiza su estructura:',
            items: bestCarousels.map(c => ({
                nombre: c.title,
                valor: `${((c.metrics?.instagram?.reach || 0) + (c.metrics?.facebook?.reach || 0)).toLocaleString()} alcance`,
                detalle: c.details?.designText ? 
                    c.details.designText.split('\n').slice(0, 2).join(' • ') : 
                    'Estructura: 5-7 slides con valor progresivo',
                tipo: 'carrusel'
            }))
        });
    }
    
    // 3. Ejemplo de interacción en stories
    const bestStories = withMetrics
        .filter(c => c.type === 'stories')
        .sort((a, b) => {
            const reachA = (a.metrics?.instagram?.reach || 0);
            const reachB = (b.metrics?.instagram?.reach || 0);
            return reachB - reachA;
        })
        .slice(0, 2);
    
    if (bestStories.length > 0) {
        examples.push({
            titulo: '📲 Ejemplos de stories interactivas',
            descripcion: 'Estas stories generaron más interacción. Mira qué stickers usaron:',
            items: bestStories.map(s => ({
                nombre: s.title,
                valor: `${(s.metrics?.instagram?.reach || 0).toLocaleString()} alcance`,
                detalle: s.details?.stickers || 
                    'Stickers: Encuestas, quizzes, sliders',
                tipo: 'stories'
            }))
        });
    }
    
    // 4. Ejemplo de copy que convierte
    const bestConverting = withMetrics
        .filter(c => (c.metrics?.instagram?.dms || 0) > 0)
        .sort((a, b) => (b.metrics?.instagram?.dms || 0) - (a.metrics?.instagram?.dms || 0))
        .slice(0, 2);
    
    if (bestConverting.length > 0) {
        examples.push({
            titulo: '💬 Ejemplos de copies que generan DMs',
            descripcion: 'Estos posts generaron conversaciones. Analiza su llamado a la acción:',
            items: bestConverting.map(c => ({
                nombre: c.title,
                valor: `${c.metrics?.instagram?.dms || 0} DMs generados`,
                detalle: c.details?.copy ? 
                    c.details.copy.split('\n').find(l => l.includes('CTA') || l.includes('Escribí') || l.includes('INFO')) :
                    'CTA: "Escribí INFO" o "Contame en DM"',
                tipo: 'conversion'
            }))
        });
    }
    
    // 5. Ejemplo de hashtags que funcionaron
    const postsWithHashtags = withMetrics.filter(c => c.details?.hashtags);
    if (postsWithHashtags.length > 0) {
        const hashtagCounts = {};
        postsWithHashtags.forEach(p => {
            const hashtags = p.details.hashtags.match(/#[a-zA-Z0-9]+/g) || [];
            hashtags.forEach(h => {
                hashtagCounts[h] = (hashtagCounts[h] || 0) + 1;
            });
        });
        
        const topHashtags = Object.entries(hashtagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        if (topHashtags.length > 0) {
            examples.push({
                titulo: '🏷️ Hashtags más utilizados',
                descripcion: 'Estos hashtags aparecen en tus mejores posts:',
                items: topHashtags.map(([tag, count]) => ({
                    nombre: tag,
                    valor: `usado ${count} veces`,
                    detalle: 'Combinar 3-5 hashtags de alto y medio engagement',
                    tipo: 'hashtag'
                }))
            });
        }
    }
    
    return examples;
}

// ==================================================
// GENERAR SUGERENCIAS BASADAS EN DATOS
// ==================================================
function generateSuggestions(monthContent, withMetrics, stats) {
    const suggestions = [];
    
    // 1. Análisis de engagement
    if (stats.avgEngagement < 50) {
        suggestions.push({
            tipo: 'engagement',
            icono: '💬',
            titulo: 'Engagement bajo',
            descripcion: 'El engagement promedio es bajo. Prueba con:',
            acciones: [
                'Incluir preguntas en los copies',
                'Agregar CTAs más claros',
                'Usar stickers interactivos en stories',
                'Responder comentarios rápidamente'
            ]
        });
    }
    
    // 2. Análisis de reels
    const reels = withMetrics.filter(c => c.type === 'reel');
    const reelsWithVideo = reels.filter(r => r.metrics?.videoMetrics);
    
    if (reelsWithVideo.length > 0) {
        const lowRetention = reelsWithVideo.filter(r => (r.metrics.videoMetrics.retentionPercent || 0) < 40);
        
        if (lowRetention.length > 0) {
            suggestions.push({
                tipo: 'retencion',
                icono: '⏱️',
                titulo: 'Retención crítica',
                descripcion: `${lowRetention.length} reel(s) tienen retención baja:`,
                acciones: [
                    'Mejorar hook de primeros 3 segundos',
                    'Reducir introducciones largas',
                    'Acelerar el ritmo de edición',
                    'Usar subtítulos llamativos'
                ],
                reels: lowRetention.map(r => r.title)
            });
        }
    }
    
    // 3. Análisis de consistencia
    if (withMetrics.length > 0) {
        const reachValues = withMetrics.map(c => 
            (c.metrics?.instagram?.reach || 0) + (c.metrics?.facebook?.reach || 0)
        );
        const avg = reachValues.reduce((a, b) => a + b, 0) / reachValues.length;
        const variance = Math.sqrt(reachValues.map(v => Math.pow(v - avg, 2)).reduce((a, b) => a + b, 0) / reachValues.length);
        
        if (variance > avg * 0.5) {
            suggestions.push({
                tipo: 'consistencia',
                icono: '📊',
                titulo: 'Inconsistencia en resultados',
                descripcion: 'Hay mucha variación en el alcance entre publicaciones',
                acciones: [
                    'Identificar qué funcionó en las mejores',
                    'Documentar patrones de éxito',
                    'Mantener horarios consistentes',
                    'Estandarizar formatos'
                ]
            });
        }
    }
    
    // 4. Análisis de DMs
    const totalDMs = withMetrics.reduce((sum, c) => {
        return sum + (c.metrics?.instagram?.dms || 0) + (c.metrics?.facebook?.messages || 0);
    }, 0);
    
    const avgDMs = totalDMs / withMetrics.length;
    
    if (avgDMs < 1) {
        suggestions.push({
            tipo: 'conversion',
            icono: '💌',
            titulo: 'Baja generación de leads',
            descripcion: 'Pocos DMs por publicación',
            acciones: [
                'Incluir llamados a la acción más directos',
                'Ofrecer algo de valor (guía, diagnóstico)',
                'Preguntar algo al final del contenido',
                'Usar palabras clave como "INFO" o "AUDITORÍA"'
            ]
        });
    }
    
    return suggestions;
}

// ==================================================
// CARGAR ANÁLISIS DEL MES SELECCIONADO
// ==================================================
window.loadMonthAnalysis = async function(month) {
    console.log(`📊 Cargando análisis para ${month}...`);
    
    const container = document.getElementById('analysis-content');
    if (!container) {
        console.error('❌ Container analysis-content no encontrado');
        return;
    }
    
    if (!window.appData || !window.appData.calendar) {
        container.innerHTML = '<div class="empty-state">Error: Datos no disponibles</div>';
        return;
    }
    
    // Obtener contenido del mes
    const monthContent = window.appData.calendar.filter(c => c.date?.startsWith(month));
    const withMetrics = monthContent.filter(c => c.metrics);
    
    // Obtener análisis guardado
    const savedAnalysis = window.monthlyAnalysis[month] || {
        mejoras: '',
        descartar: '',
        ideas: ''
    };
    
    // Si no hay contenido
    if (monthContent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <p><strong>No hay contenido para este mes</strong></p>
                <p style="color: var(--gray-600); margin-top: 8px;">
                    Agrega contenido desde el calendario
                </p>
            </div>
        `;
        return;
    }
    
    // Si no hay métricas
    if (withMetrics.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p><strong>No hay métricas registradas</strong></p>
                <p style="color: var(--gray-600); margin-top: 8px;">
                    Agrega métricas a las publicaciones para ver el análisis
                </p>
            </div>
        `;
        return;
    }
    
    // Calcular métricas generales
    let totalReach = 0;
    let totalEngagement = 0;
    let totalDMs = 0;
    let totalRetention = 0;
    let reelsWithVideo = 0;
    
    withMetrics.forEach(c => {
        const ig = c.metrics?.instagram || {};
        const fb = c.metrics?.facebook || {};
        const tt = c.metrics?.tiktok || {};
        
        totalReach += (ig.reach || 0) + (fb.reach || 0);
        totalEngagement += (ig.likes || 0) + (ig.comments || 0) + 
                          (fb.reactions || 0) + (fb.comments || 0) +
                          (tt.likes || 0) + (tt.comments || 0);
        totalDMs += (ig.dms || 0) + (fb.messages || 0);
        
        if (c.metrics.videoMetrics) {
            totalRetention += c.metrics.videoMetrics.retentionPercent || 0;
            reelsWithVideo++;
        }
    });
    
    const avgReach = Math.round(totalReach / withMetrics.length);
    const avgEngagement = (totalEngagement / withMetrics.length).toFixed(1);
    const avgRetention = reelsWithVideo > 0 ? (totalRetention / reelsWithVideo).toFixed(1) : 0;
    
    // Ordenar por alcance
    const sortedByReach = [...withMetrics].sort((a, b) => {
        const reachA = (a.metrics?.instagram?.reach || 0) + (a.metrics?.facebook?.reach || 0);
        const reachB = (b.metrics?.instagram?.reach || 0) + (b.metrics?.facebook?.reach || 0);
        return reachB - reachA;
    });
    
    const top3 = sortedByReach.slice(0, 3);
    const bottom3 = sortedByReach.slice(-3).reverse();
    
    // Calcular distribución por tipo
    const reelsCount = withMetrics.filter(c => c.type === 'reel').length;
    const carouselsCount = withMetrics.filter(c => c.type === 'carousel').length;
    const storiesCount = withMetrics.filter(c => c.type === 'stories').length;
    
    // Generar sugerencias y ejemplos
    const suggestions = generateSuggestions(monthContent, withMetrics, {
        avgEngagement: parseFloat(avgEngagement),
        avgReach,
        totalDMs,
        avgRetention: parseFloat(avgRetention)
    });
    
    const examples = generateExamples(monthContent, withMetrics, {
        avgEngagement: parseFloat(avgEngagement),
        avgReach,
        totalDMs,
        avgRetention: parseFloat(avgRetention)
    });
    
    // Crear HTML
    let html = `
        <style>
            .analysis-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            .analysis-stat-card {
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                border: 1px solid var(--gray-200);
            }
            .analysis-stat-label {
                font-size: 12px;
                color: var(--gray-600);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .analysis-stat-value {
                font-size: 28px;
                font-weight: 700;
                margin-top: 8px;
                color: var(--primary);
            }
            .analysis-section {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                border: 1px solid var(--gray-200);
            }
            .analysis-section-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .top-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid var(--gray-200);
            }
            .top-item:last-child {
                border-bottom: none;
            }
            .top-rank {
                font-weight: 700;
                color: var(--primary);
                margin-right: 12px;
            }
            .top-value {
                font-weight: 600;
                color: #10b981;
            }
            .bottom-value {
                font-weight: 600;
                color: #ef4444;
            }
            .analysis-textarea {
                width: 100%;
                padding: 12px;
                border: 1px solid var(--gray-300);
                border-radius: 8px;
                font-size: 14px;
                margin-top: 8px;
                resize: vertical;
            }
            .analysis-textarea:focus {
                outline: none;
                border-color: var(--primary);
            }
            .save-button {
                margin-top: 12px;
                text-align: right;
            }
            .type-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                margin-left: 8px;
            }
            .type-reel { background: #d1fae5; color: #065f46; }
            .type-carousel { background: #dbeafe; color: #1e40af; }
            .type-stories { background: #fef3c7; color: #92400e; }
            
            /* Estilos para sugerencias */
            .suggestions-grid, .examples-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            .suggestion-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .example-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border: 1px solid var(--gray-200);
            }
            .example-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 2px solid var(--gray-200);
            }
            .example-icon {
                font-size: 28px;
            }
            .example-title {
                font-size: 16px;
                font-weight: 600;
                color: var(--gray-800);
            }
            .example-desc {
                font-size: 13px;
                color: var(--gray-600);
                margin-bottom: 16px;
            }
            .example-items {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .example-item {
                padding: 12px;
                background: var(--gray-50);
                border-radius: 8px;
                margin-bottom: 8px;
            }
            .example-item-name {
                font-weight: 600;
                color: var(--primary);
                margin-bottom: 4px;
            }
            .example-item-value {
                font-size: 12px;
                color: #10b981;
                margin-bottom: 4px;
            }
            .example-item-detail {
                font-size: 12px;
                color: var(--gray-600);
                font-style: italic;
                background: white;
                padding: 8px;
                border-radius: 4px;
                margin-top: 4px;
            }
            .suggestion-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }
            .suggestion-icon {
                font-size: 32px;
            }
            .suggestion-title {
                font-size: 18px;
                font-weight: 600;
            }
            .suggestion-desc {
                font-size: 14px;
                margin-bottom: 16px;
                opacity: 0.9;
            }
            .suggestion-actions {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .suggestion-actions li {
                padding: 8px 0;
                border-bottom: 1px solid rgba(255,255,255,0.2);
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .suggestion-actions li:last-child {
                border-bottom: none;
            }
            .suggestion-actions li:before {
                content: "✓";
                font-weight: bold;
            }
            .reel-list {
                margin-top: 12px;
                padding: 12px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                font-size: 12px;
            }
            .reel-list strong {
                display: block;
                margin-bottom: 8px;
            }
        </style>
    `;
    
    // Sección de sugerencias
    if (suggestions.length > 0) {
        html += `<h3 style="margin: 20px 0 12px;">💡 Sugerencias para mejorar</h3>`;
        html += `<div class="suggestions-grid">`;
        suggestions.forEach(s => {
            html += `
                <div class="suggestion-card">
                    <div class="suggestion-header">
                        <span class="suggestion-icon">${s.icono}</span>
                        <span class="suggestion-title">${s.titulo}</span>
                    </div>
                    <div class="suggestion-desc">${s.descripcion}</div>
                    <ul class="suggestion-actions">
                        ${s.acciones.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                    ${s.reels ? `
                        <div class="reel-list">
                            <strong>📋 Reels a revisar:</strong>
                            ${s.reels.map(r => `• ${r}<br>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // Sección de ejemplos
    if (examples.length > 0) {
        html += `<h3 style="margin: 30px 0 12px;">📚 Ejemplos de lo que funciona</h3>`;
        html += `<div class="examples-grid">`;
        examples.forEach(ex => {
            html += `
                <div class="example-card">
                    <div class="example-header">
                        <span class="example-icon">${ex.titulo.split(' ')[0]}</span>
                        <span class="example-title">${ex.titulo}</span>
                    </div>
                    <div class="example-desc">${ex.descripcion}</div>
                    <ul class="example-items">
                        ${ex.items.map(item => `
                            <li class="example-item">
                                <div class="example-item-name">${item.nombre}</div>
                                <div class="example-item-value">📊 ${item.valor}</div>
                                <div class="example-item-detail">💡 ${item.detalle}</div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // Estadísticas generales
    html += `
        <h3 style="margin: 20px 0 12px;">📊 Estadísticas del mes</h3>
        <div class="analysis-stats">
            <div class="analysis-stat-card">
                <div class="analysis-stat-label">Publicaciones</div>
                <div class="analysis-stat-value">${withMetrics.length}</div>
                <div style="font-size: 13px; color: var(--gray-600); margin-top: 4px;">
                    de ${monthContent.length} total
                </div>
            </div>
            <div class="analysis-stat-card">
                <div class="analysis-stat-label">Alcance Promedio</div>
                <div class="analysis-stat-value">${avgReach.toLocaleString()}</div>
            </div>
            <div class="analysis-stat-card">
                <div class="analysis-stat-label">Engagement Prom.</div>
                <div class="analysis-stat-value">${avgEngagement}</div>
            </div>
            <div class="analysis-stat-card">
                <div class="analysis-stat-label">DMs Totales</div>
                <div class="analysis-stat-value">${totalDMs}</div>
            </div>
            <div class="analysis-stat-card">
                <div class="analysis-stat-label">Retención Prom.</div>
                <div class="analysis-stat-value">${avgRetention}%</div>
            </div>
        </div>
    `;
    
    // Distribución por tipo
    html += `
        <div class="analysis-section">
            <div class="analysis-section-title">📊 Distribución por tipo</div>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                <div><span class="type-badge type-reel">🎬 Reels</span> ${reelsCount}</div>
                <div><span class="type-badge type-carousel">📊 Carruseles</span> ${carouselsCount}</div>
                <div><span class="type-badge type-stories">📲 Stories</span> ${storiesCount}</div>
            </div>
        </div>
    `;
    
    // Top 3
    html += `
        <div class="analysis-section" style="border-left: 4px solid #10b981;">
            <div class="analysis-section-title">🏆 Top 3 Publicaciones</div>
    `;
    
    top3.forEach((item, index) => {
        const reach = (item.metrics?.instagram?.reach || 0) + (item.metrics?.facebook?.reach || 0);
        const typeBadge = item.type === 'reel' ? '🎬' : item.type === 'carousel' ? '📊' : '📲';
        html += `
            <div class="top-item">
                <div>
                    <span class="top-rank">#${index + 1}</span>
                    ${typeBadge} ${item.title}
                </div>
                <div class="top-value">${reach.toLocaleString()} alcance</div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Bottom 3
    html += `
        <div class="analysis-section" style="border-left: 4px solid #ef4444;">
            <div class="analysis-section-title">📉 Necesitan mejora</div>
    `;
    
    bottom3.forEach((item, index) => {
        const reach = (item.metrics?.instagram?.reach || 0) + (item.metrics?.facebook?.reach || 0);
        const typeBadge = item.type === 'reel' ? '🎬' : item.type === 'carousel' ? '📊' : '📲';
        html += `
            <div class="top-item">
                <div>
                    <span class="top-rank">#${index + 1}</span>
                    ${typeBadge} ${item.title}
                </div>
                <div class="bottom-value">${reach.toLocaleString()} alcance</div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Notas de análisis
    html += `
        <div class="analysis-section">
            <div class="analysis-section-title">📈 Qué mejorar</div>
            <textarea class="analysis-textarea" id="improvements-${month}" rows="3" placeholder="Escribe qué aspectos se pueden mejorar...">${savedAnalysis.mejoras || ''}</textarea>
            <div class="save-button">
                <button class="btn-secondary btn-sm" onclick="saveAnalysisNote('${month}', 'mejoras')">💾 Guardar</button>
            </div>
        </div>
        
        <div class="analysis-section">
            <div class="analysis-section-title">❌ Qué descartar</div>
            <textarea class="analysis-textarea" id="discard-${month}" rows="3" placeholder="Escribe qué no funcionó y no repetir...">${savedAnalysis.descartar || ''}</textarea>
            <div class="save-button">
                <button class="btn-secondary btn-sm" onclick="saveAnalysisNote('${month}', 'descartar')">💾 Guardar</button>
            </div>
        </div>
        
        <div class="analysis-section">
            <div class="analysis-section-title">💡 Nuevas ideas</div>
            <textarea class="analysis-textarea" id="ideas-${month}" rows="4" placeholder="Escribe ideas para próximos meses...">${savedAnalysis.ideas || ''}</textarea>
            <div class="save-button">
                <button class="btn-secondary btn-sm" onclick="saveAnalysisNote('${month}', 'ideas')">💾 Guardar</button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    console.log(`✅ Análisis para ${month} cargado`);
};

// ==================================================
// GUARDAR NOTA DE ANÁLISIS
// ==================================================
window.saveAnalysisNote = async function(month, field) {
    console.log(`💾 Guardando nota de ${field} para ${month}...`);
    
    const value = document.getElementById(`${field === 'mejoras' ? 'improvements' : field === 'descartar' ? 'discard' : 'ideas'}-${month}`)?.value;
    
    if (!window.monthlyAnalysis[month]) {
        window.monthlyAnalysis[month] = {};
    }
    
    window.monthlyAnalysis[month][field] = value;
    
    // Guardar en localStorage
    await storage.set(`analysis-${month}`, window.monthlyAnalysis[month]);
    
    // Notificar
    if (typeof addNotification === 'function') {
        addNotification('Análisis Guardado', `Nota de ${field} guardada`);
    }
    
    alert('✅ Nota guardada correctamente');
};

// ==================================================
// CARGAR ANÁLISIS GUARDADO AL INICIAR
// ==================================================
window.loadSavedAnalysis = async function() {
    console.log('📂 Cargando análisis guardados...');
    
    const months = ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];
    
    for (const month of months) {
        const saved = await storage.get(`analysis-${month}`);
        if (saved) {
            window.monthlyAnalysis[month] = saved;
            console.log(`✅ Análisis cargado para ${month}`);
        }
    }
};

console.log('✅ analysis.js cargado correctamente');