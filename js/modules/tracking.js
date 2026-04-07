// ==================================================
// TRACKING REELS - VERSIÓN CON FUNCIÓN GLOBAL
// ==================================================

console.log('🎬 Cargando tracking.js...');

// Hacer la función global
window.loadTracking = function() {
    console.log('📊 Cargando tracking de reels...');
    
    // USAR EL CONTAINER CORRECTO: tracking-content
    const container = document.getElementById('tracking-content');
    if (!container) {
        console.error('❌ Container tracking-content no encontrado');
        return;
    }
    
    // Verificar que appData existe
    if (!window.appData || !window.appData.calendar) {
        container.innerHTML = '<div class="empty-state">Error: Datos no disponibles</div>';
        return;
    }
    
    // Filtrar solo reels con métricas
    const reels = window.appData.calendar.filter(c => 
        c.type === 'reel' && c.metrics
    );
    
    console.log(`🎬 Reels encontrados: ${reels.length}`);
    
    if (reels.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎬</div>
                <p><strong>No hay Reels con métricas</strong></p>
                <p style="color: var(--gray-600); margin-top: 8px;">
                    Agrega métricas a los Reels desde el calendario
                </p>
            </div>
        `;
        return;
    }
    
    // Calcular estadísticas generales
    let totalReach = 0;
    let totalEngagement = 0;
    let totalDMs = 0;
    let totalRetention = 0;
    let reelsWithVideo = 0;
    
    reels.forEach(reel => {
        const ig = reel.metrics?.instagram || {};
        const fb = reel.metrics?.facebook || {};
        const tt = reel.metrics?.tiktok || {};
        
        totalReach += (ig.reach || 0) + (fb.reach || 0);
        totalEngagement += (ig.likes || 0) + (ig.comments || 0) + 
                          (fb.reactions || 0) + (fb.comments || 0) +
                          (tt.likes || 0) + (tt.comments || 0);
        totalDMs += (ig.dms || 0) + (fb.messages || 0);
        
        if (reel.metrics.videoMetrics) {
            totalRetention += reel.metrics.videoMetrics.retentionPercent || 0;
            reelsWithVideo++;
        }
    });
    
    const avgRetention = reelsWithVideo > 0 ? (totalRetention / reelsWithVideo).toFixed(1) : 0;
    
    // Crear HTML
    let html = `
        <style>
            .tracking-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            .tracking-stat-card {
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                border: 1px solid var(--gray-200);
            }
            .tracking-stat-label {
                font-size: 12px;
                color: var(--gray-600);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .tracking-stat-value {
                font-size: 28px;
                font-weight: 700;
                margin-top: 8px;
                color: var(--primary);
            }
            .tracking-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .tracking-table th {
                background: var(--gray-100);
                padding: 12px;
                text-align: left;
                font-weight: 600;
                border-bottom: 2px solid var(--gray-300);
            }
            .tracking-table td {
                padding: 12px;
                border-bottom: 1px solid var(--gray-200);
            }
            .tracking-table tr:hover {
                background: var(--gray-50);
            }
            .rating-excelente { color: #10b981; font-weight: 600; }
            .rating-bueno { color: #3b82f6; font-weight: 600; }
            .rating-regular { color: #f59e0b; font-weight: 600; }
            .rating-malo { color: #ef4444; font-weight: 600; }
            .action-buttons {
                display: flex;
                gap: 4px;
            }
        </style>
    `;
    
    // Estadísticas generales
    html += `
        <div class="tracking-stats">
            <div class="tracking-stat-card">
                <div class="tracking-stat-label">Total Reels</div>
                <div class="tracking-stat-value">${reels.length}</div>
            </div>
            <div class="tracking-stat-card">
                <div class="tracking-stat-label">Alcance Total</div>
                <div class="tracking-stat-value">${totalReach.toLocaleString()}</div>
            </div>
            <div class="tracking-stat-card">
                <div class="tracking-stat-label">Engagement Total</div>
                <div class="tracking-stat-value">${totalEngagement.toLocaleString()}</div>
            </div>
            <div class="tracking-stat-card">
                <div class="tracking-stat-label">DMs Totales</div>
                <div class="tracking-stat-value">${totalDMs}</div>
            </div>
            <div class="tracking-stat-card">
                <div class="tracking-stat-label">Retención Prom.</div>
                <div class="tracking-stat-value">${avgRetention}%</div>
            </div>
        </div>
    `;
    
    // Tabla de reels
    html += `
        <table class="tracking-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Título</th>
                    <th>Alcance</th>
                    <th>Engagement</th>
                    <th>DMs</th>
                    <th>Duración</th>
                    <th>Watch Time</th>
                    <th>Retención</th>
                    <th>Rating</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Ordenar por fecha (más reciente primero)
    const sortedReels = [...reels].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedReels.forEach(reel => {
        const ig = reel.metrics?.instagram || {};
        const fb = reel.metrics?.facebook || {};
        const tt = reel.metrics?.tiktok || {};
        const vm = reel.metrics?.videoMetrics || {};
        
        const reach = (ig.reach || 0) + (fb.reach || 0);
        const engagement = (ig.likes || 0) + (ig.comments || 0) + 
                          (fb.reactions || 0) + (fb.comments || 0) +
                          (tt.likes || 0) + (tt.comments || 0);
        const dms = (ig.dms || 0) + (fb.messages || 0);
        
        let ratingClass = '';
        let ratingText = '—';
        
        if (vm.rating) {
            switch(vm.rating) {
                case 'excelente': 
                    ratingClass = 'rating-excelente'; 
                    ratingText = '🌟 EXCELENTE'; 
                    break;
                case 'bueno': 
                    ratingClass = 'rating-bueno'; 
                    ratingText = '✅ BUENO'; 
                    break;
                case 'regular': 
                    ratingClass = 'rating-regular'; 
                    ratingText = '⚠️ REGULAR'; 
                    break;
                case 'malo': 
                    ratingClass = 'rating-malo'; 
                    ratingText = '❌ MALO'; 
                    break;
                default: 
                    ratingText = vm.rating.toUpperCase();
            }
        }
        
        html += `
            <tr>
                <td>${formatDate(reel.date)}</td>
                <td><strong>${reel.title}</strong></td>
                <td>${reach.toLocaleString()}</td>
                <td>${engagement.toLocaleString()}</td>
                <td>${dms}</td>
                <td>${vm.duration ? vm.duration + 's' : '—'}</td>
                <td>${vm.avgWatchTime ? vm.avgWatchTime + 's' : '—'}</td>
                <td>${vm.retentionPercent ? vm.retentionPercent + '%' : '—'}</td>
                <td class="${ratingClass}">${ratingText}</td>
                <td class="action-buttons">
                    <button class="btn-secondary btn-sm" onclick="openMetricsModal(${reel.id})" title="Ver/Editar métricas">
                        📊
                    </button>
                    <button class="btn-secondary btn-sm" onclick="openEditContentModal(${reel.id})" title="Editar contenido">
                        ✏️
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    console.log('✅ Tracking de reels cargado');
};

console.log('✅ tracking.js cargado correctamente');