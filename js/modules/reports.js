// ==================================================
// REPORTES AUTOMÁTICOS - GENERACIÓN DE PDF
// ==================================================

console.log('📄 Cargando módulo de reportes...');

// ==================================================
// GENERAR REPORTE POR TIPO
// ==================================================
window.generateReport = function(type) {
    console.log(`📊 Generando reporte: ${type}`);
    
    const month = document.getElementById('report-month')?.value || '2026-03';
    const account = window.accounts?.find(a => a.id === window.currentAccount) || { name: 'Bondi Media' };
    
    // Mostrar indicador de carga
    showLoadingIndicator();
    
    // Generar el reporte según el tipo
    setTimeout(() => {
        switch(type) {
            case 'monthly':
                generateMonthlyReportPDF(month, account);
                break;
            case 'performance':
                generatePerformanceReportPDF(month, account);
                break;
            case 'content':
                generateContentReportPDF(month, account);
                break;
            case 'roi':
                generateROIReportPDF(month, account);
                break;
            default:
                alert('Tipo de reporte no válido');
                hideLoadingIndicator();
        }
    }, 100);
};

// ==================================================
// MOSTRAR INDICADOR DE CARGA
// ==================================================
function showLoadingIndicator() {
    let loader = document.getElementById('pdf-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'pdf-loader';
        loader.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 12px; text-align: center;">
                    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #6366f1; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <p style="color: var(--gray-700);">Generando PDF...<br><small style="color: var(--gray-500);">Esto puede tomar unos segundos</small></p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'block';
}

function hideLoadingIndicator() {
    const loader = document.getElementById('pdf-loader');
    if (loader) loader.style.display = 'none';
}

// ==================================================
// GENERAR REPORTE MENSUAL EN PDF
// ==================================================
async function generateMonthlyReportPDF(month, account) {
    console.log(`📅 Generando PDF mensual para ${month}`);
    
    // Obtener datos del mes
    const monthData = window.appData.calendar.filter(c => c.date?.startsWith(month));
    const withMetrics = monthData.filter(c => c.metrics);
    
    if (withMetrics.length === 0) {
        alert('No hay métricas para este mes');
        hideLoadingIndicator();
        return;
    }
    
    // Calcular métricas
    let totalReach = 0, totalEngagement = 0, totalDMs = 0, totalRetention = 0;
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
    
    const monthName = new Date(month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    // Crear elemento HTML temporal
    const element = document.createElement('div');
    element.style.width = '800px';
    element.style.padding = '40px';
    element.style.background = '#f9fafb';
    element.style.fontFamily = 'Arial, sans-serif';
    
    element.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1;">
            <div style="font-size: 24px; font-weight: bold; color: #6366f1;">BONDI MEDIA</div>
            <div style="color: #6b7280; font-size: 14px;">${new Date().toLocaleDateString('es-ES')}</div>
        </div>
        
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 10px; color: #1f2937;">📊 Reporte Mensual</h1>
        <h2 style="font-size: 18px; font-weight: 400; margin-bottom: 30px; color: #6b7280;">${monthName} • ${account.name}</h2>
        
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-bottom: 40px;">
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Publicaciones</div>
                <div style="font-size: 28px; font-weight: 700; color: #6366f1;">${withMetrics.length}</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Alcance Total</div>
                <div style="font-size: 28px; font-weight: 700; color: #6366f1;">${totalReach.toLocaleString()}</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Engagement Total</div>
                <div style="font-size: 28px; font-weight: 700; color: #6366f1;">${totalEngagement.toLocaleString()}</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">DMs Totales</div>
                <div style="font-size: 28px; font-weight: 700; color: #6366f1;">${totalDMs}</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Retención Prom.</div>
                <div style="font-size: 28px; font-weight: 700; color: #6366f1;">${avgRetention}%</div>
            </div>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📈 Métricas Detalladas</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280;">Métrica</th>
                    <th style="background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280;">Total</th>
                    <th style="background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280;">Promedio</th>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Alcance</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${totalReach.toLocaleString()}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${avgReach.toLocaleString()}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Engagement</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${totalEngagement.toLocaleString()}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${avgEngagement}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">DMs</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${totalDMs}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${(totalDMs / withMetrics.length).toFixed(1)}</td>
                </tr>
            </table>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #1f2937;">🏆 Top 3 Publicaciones</h3>
            ${top3.map((item, index) => {
                const reach = (item.metrics?.instagram?.reach || 0) + (item.metrics?.facebook?.reach || 0);
                return `
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                        <div>
                            <span style="font-weight: 700; color: #6366f1; margin-right: 12px;">#${index + 1}</span>
                            ${item.title}
                        </div>
                        <div style="color: #10b981; font-weight: 600;">${reach.toLocaleString()} alcance</div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #1f2937;">📉 Áreas de Oportunidad</h3>
            ${bottom3.map((item, index) => {
                const reach = (item.metrics?.instagram?.reach || 0) + (item.metrics?.facebook?.reach || 0);
                return `
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                        <div>
                            <span style="font-weight: 700; color: #6366f1; margin-right: 12px;">#${index + 1}</span>
                            ${item.title}
                        </div>
                        <div style="color: #ef4444; font-weight: 600;">${reach.toLocaleString()} alcance</div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            Bondi Media - Sistema de Gestión Profesional
        </div>
    `;
    
    // Convertir a PDF
    document.body.appendChild(element);
    
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#f9fafb',
            logging: false,
            allowTaint: false,
            useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width * 0.75, canvas.height * 0.75]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.75, canvas.height * 0.75);
        pdf.save(`reporte-mensual-${month}.pdf`);
        
        alert('✅ PDF generado correctamente');
    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('❌ Error al generar el PDF. Intentá de nuevo.');
    }
    
    document.body.removeChild(element);
    hideLoadingIndicator();
}

// ==================================================
// GENERAR REPORTE DE PERFORMANCE EN PDF
// ==================================================
async function generatePerformanceReportPDF(month, account) {
    console.log(`📈 Generando PDF de performance para ${month}`);
    
    const monthData = window.appData.calendar.filter(c => c.date?.startsWith(month));
    const reels = monthData.filter(c => c.type === 'reel' && c.metrics?.videoMetrics);
    
    if (reels.length === 0) {
        alert('No hay Reels con métricas de video para este mes');
        hideLoadingIndicator();
        return;
    }
    
    const avgRetention = reels.reduce((sum, r) => sum + r.metrics.videoMetrics.retentionPercent, 0) / reels.length;
    
    const byRating = {
        excelente: reels.filter(r => r.metrics.videoMetrics.rating === 'excelente'),
        bueno: reels.filter(r => r.metrics.videoMetrics.rating === 'bueno'),
        regular: reels.filter(r => r.metrics.videoMetrics.rating === 'regular'),
        malo: reels.filter(r => r.metrics.videoMetrics.rating === 'malo')
    };
    
    const monthName = new Date(month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    const element = document.createElement('div');
    element.style.width = '800px';
    element.style.padding = '40px';
    element.style.background = '#f9fafb';
    element.style.fontFamily = 'Arial, sans-serif';
    
    element.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1;">
            <div style="font-size: 24px; font-weight: bold; color: #6366f1;">BONDI MEDIA</div>
            <div style="color: #6b7280; font-size: 14px;">${new Date().toLocaleDateString('es-ES')}</div>
        </div>
        
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 10px; color: #1f2937;">🎬 Reporte de Performance</h1>
        <h2 style="font-size: 18px; font-weight: 400; margin-bottom: 30px; color: #6b7280;">${monthName} • ${account.name}</h2>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 40px;">
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">Total Reels</div>
                <div style="font-size: 28px; font-weight: 700; color: #6366f1;">${reels.length}</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">Retención Prom.</div>
                <div style="font-size: 28px; font-weight: 700; color: #10b981;">${avgRetention.toFixed(1)}%</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">Excelentes</div>
                <div style="font-size: 28px; font-weight: 700; color: #10b981;">${byRating.excelente.length}</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">A Mejorar</div>
                <div style="font-size: 28px; font-weight: 700; color: #ef4444;">${byRating.regular.length + byRating.malo.length}</div>
            </div>
        </div>
        
        ${byRating.excelente.length > 0 ? `
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #10b981;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #10b981;">🌟 EXCELENTES (${byRating.excelente.length})</h3>
                ${byRating.excelente.map(r => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span>${r.title}</span>
                        <span style="color: #10b981;">${r.metrics.videoMetrics.retentionPercent}%</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${byRating.bueno.length > 0 ? `
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #3b82f6;">✅ BUENOS (${byRating.bueno.length})</h3>
                ${byRating.bueno.map(r => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span>${r.title}</span>
                        <span style="color: #3b82f6;">${r.metrics.videoMetrics.retentionPercent}%</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${byRating.regular.length > 0 ? `
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #f59e0b;">⚠️ REGULARES (${byRating.regular.length})</h3>
                ${byRating.regular.map(r => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span>${r.title}</span>
                        <span style="color: #f59e0b;">${r.metrics.videoMetrics.retentionPercent}%</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${byRating.malo.length > 0 ? `
            <div style="background: white; border-radius: 12px; padding: 20px; border-left: 4px solid #ef4444;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #ef4444;">❌ MALOS (${byRating.malo.length})</h3>
                ${byRating.malo.map(r => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <span>${r.title}</span>
                        <span style="color: #ef4444;">${r.metrics.videoMetrics.retentionPercent}%</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
    
    document.body.appendChild(element);
    
    try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#f9fafb' });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width * 0.75, canvas.height * 0.75]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.75, canvas.height * 0.75);
        pdf.save(`reporte-performance-${month}.pdf`);
        alert('✅ PDF generado correctamente');
    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('❌ Error al generar el PDF');
    }
    
    document.body.removeChild(element);
    hideLoadingIndicator();
}

// ==================================================
// GENERAR REPORTE DE CONTENIDO EN PDF
// ==================================================
async function generateContentReportPDF(month, account) {
    console.log(`📝 Generando PDF de contenido para ${month}`);
    
    const monthData = window.appData.calendar.filter(c => c.date?.startsWith(month));
    
    if (monthData.length === 0) {
        alert('No hay contenido para este mes');
        hideLoadingIndicator();
        return;
    }
    
    const monthName = new Date(month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    const reels = monthData.filter(c => c.type === 'reel').length;
    const carousels = monthData.filter(c => c.type === 'carousel').length;
    const stories = monthData.filter(c => c.type === 'stories').length;
    
    const published = monthData.filter(c => c.status === 'published').length;
    const scheduled = monthData.filter(c => c.status === 'scheduled').length;
    const inProgress = monthData.filter(c => ['design', 'correction'].includes(c.status)).length;
    
    const element = document.createElement('div');
    element.style.width = '800px';
    element.style.padding = '40px';
    element.style.background = '#f9fafb';
    element.style.fontFamily = 'Arial, sans-serif';
    
    element.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1;">
            <div style="font-size: 24px; font-weight: bold; color: #6366f1;">BONDI MEDIA</div>
            <div style="color: #6b7280; font-size: 14px;">${new Date().toLocaleDateString('es-ES')}</div>
        </div>
        
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 10px; color: #1f2937;">📅 Reporte de Contenido</h1>
        <h2 style="font-size: 18px; font-weight: 400; margin-bottom: 30px; color: #6b7280;">${monthName} • ${account.name}</h2>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 40px;">
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">Total Publicaciones</div>
                <div style="font-size: 28px; font-weight: 700; color: #6366f1;">${monthData.length}</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">Por Tipo</div>
                <div style="margin-top: 10px;">
                    <div>🎬 Reels: ${reels}</div>
                    <div>📊 Carruseles: ${carousels}</div>
                    <div>📲 Stories: ${stories}</div>
                </div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">Por Estado</div>
                <div style="margin-top: 10px;">
                    <div>🚀 Publicado: ${published}</div>
                    <div>⏰ Programado: ${scheduled}</div>
                    <div>⚡ En Progreso: ${inProgress}</div>
                </div>
            </div>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">📋 Calendario de Publicaciones</h3>
            ${monthData.sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => {
                const typeColor = item.type === 'reel' ? '#d1fae5' : item.type === 'carousel' ? '#dbeafe' : '#fef3c7';
                const typeTextColor = item.type === 'reel' ? '#065f46' : item.type === 'carousel' ? '#1e40af' : '#92400e';
                const typeLabel = item.type === 'reel' ? '🎬 Reel' : item.type === 'carousel' ? '📊 Carrusel' : '📲 Stories';
                return `
                    <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #e5e7eb;">
                        <div>
                            <strong>${new Date(item.date).toLocaleDateString('es-ES')}</strong> - ${item.title}
                            <span style="background: ${typeColor}; color: ${typeTextColor}; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 10px;">${typeLabel}</span>
                        </div>
                        <div>${item.status || 'Sin estado'}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    document.body.appendChild(element);
    
    try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#f9fafb' });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width * 0.75, canvas.height * 0.75]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.75, canvas.height * 0.75);
        pdf.save(`reporte-contenido-${month}.pdf`);
        alert('✅ PDF generado correctamente');
    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('❌ Error al generar el PDF');
    }
    
    document.body.removeChild(element);
    hideLoadingIndicator();
}

// ==================================================
// GENERAR REPORTE DE ROI EN PDF
// ==================================================
async function generateROIReportPDF(month, account) {
    console.log(`💰 Generando PDF de ROI para ${month}`);
    
    const monthData = window.appData.calendar.filter(c => c.date?.startsWith(month) && c.metrics);
    
    if (monthData.length === 0) {
        alert('No hay métricas para calcular ROI');
        hideLoadingIndicator();
        return;
    }
    
    const totalInvestment = monthData.reduce((sum, c) => sum + (c.adBudget || 0), 0) * 1000;
    
    const totalReach = monthData.reduce((sum, c) => {
        return sum + (c.metrics?.instagram?.reach || 0) + (c.metrics?.facebook?.reach || 0);
    }, 0);
    
    const totalDMs = monthData.reduce((sum, c) => {
        return sum + (c.metrics?.instagram?.dms || 0) + (c.metrics?.facebook?.messages || 0);
    }, 0);
    
    const valuePerDM = 5000;
    const estimatedValue = totalDMs * valuePerDM;
    const roi = totalInvestment > 0 ? ((estimatedValue - totalInvestment) / totalInvestment * 100).toFixed(1) : 0;
    
    const monthName = new Date(month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    const element = document.createElement('div');
    element.style.width = '800px';
    element.style.padding = '40px';
    element.style.background = '#f9fafb';
    element.style.fontFamily = 'Arial, sans-serif';
    
    element.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1;">
            <div style="font-size: 24px; font-weight: bold; color: #6366f1;">BONDI MEDIA</div>
            <div style="color: #6b7280; font-size: 14px;">${new Date().toLocaleDateString('es-ES')}</div>
        </div>
        
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 10px; color: #1f2937;">💰 Reporte de ROI</h1>
        <h2 style="font-size: 18px; font-weight: 400; margin-bottom: 30px; color: #6b7280;">${monthName} • ${account.name}</h2>
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 10px;">RETORNO DE INVERSIÓN</div>
            <div style="font-size: 48px; font-weight: 700; margin: 10px 0;">${roi}%</div>
            <div style="font-size: 14px; opacity: 0.9;">${roi > 0 ? '📈 Rentabilidad positiva' : '📉 Por debajo del objetivo'}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">Inversión Total</div>
                <div style="font-size: 28px; font-weight: 700; color: #6366f1;">$${totalInvestment.toLocaleString()}</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-size: 12px; color: #6b7280;">Valor Estimado</div>
                <div style="font-size: 28px; font-weight: 700; color: #10b981;">$${estimatedValue.toLocaleString()}</div>
            </div>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 20px;">📊 Detalle de Métricas</h3>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span>Alcance Total</span>
                <span style="font-weight: 600;">${totalReach.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span>DMs Generados</span>
                <span style="font-weight: 600;">${totalDMs}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span>Valor por DM</span>
                <span style="font-weight: 600;">$${valuePerDM.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span>Costo por DM</span>
                <span style="font-weight: 600;">$${(totalInvestment / (totalDMs || 1)).toFixed(0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0;">
                <span>Costo por Alcance</span>
                <span style="font-weight: 600;">$${(totalInvestment / (totalReach || 1)).toFixed(2)}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(element);
    
    try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#f9fafb' });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width * 0.75, canvas.height * 0.75]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.75, canvas.height * 0.75);
        pdf.save(`reporte-roi-${month}.pdf`);
        alert('✅ PDF generado correctamente');
    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('❌ Error al generar el PDF');
    }
    
    document.body.removeChild(element);
    hideLoadingIndicator();
}

// ==================================================
// FUNCIÓN PARA DESCARGAR REPORTE (desde el botón)
// ==================================================
window.downloadReport = function() {
    const month = document.getElementById('report-month')?.value || '2026-03';
    const activeCard = document.querySelector('.report-card.active');
    
    if (!activeCard) {
        alert('Seleccioná un tipo de reporte');
        return;
    }
    
    const onclickAttr = activeCard.getAttribute('onclick');
    const typeMatch = onclickAttr.match(/'([^']+)'/);
    
    if (typeMatch && typeMatch[1]) {
        generateReport(typeMatch[1]);
    } else {
        generateReport('monthly');
    }
};

// ==================================================
// INICIALIZAR SECCIÓN DE REPORTES
// ==================================================
window.initReports = function() {
    console.log('📄 Inicializando módulo de reportes');
    
    // Activar el primer reporte por defecto
    setTimeout(() => {
        const firstCard = document.querySelector('.report-card');
        if (firstCard) {
            firstCard.classList.add('active');
        }
    }, 500);
};

console.log('✅ Módulo de reportes PDF cargado');

// ==================================================
// POBLAR SELECT DE CLIENTES EN REPORTES
// ==================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const sel = document.getElementById('report-client');
        if (sel && window.accounts) {
            sel.innerHTML = '<option value="">Todos los clientes</option>'
                + window.accounts.map(a => '<option value="' + a.id + '">' + a.name + '</option>').join('');
        }
    }, 1500);
});

// ==================================================
// VISTA PREVIA DEL REPORTE
// ==================================================
window.updateReportPreview = function() {
    const month   = document.getElementById('report-month')?.value || '2026-03';
    const account = window.accounts?.find(a => a.id === window.currentAccount) || { name: 'Bondi Media' };
    const preview = document.getElementById('report-preview-content');
    if (!preview) return;

    const cal    = window.appData?.calendar || [];
    const monthData   = cal.filter(c => c.date?.startsWith(month));
    const withMetrics = monthData.filter(c => c.metrics);

    const totalReach = withMetrics.reduce((s, c) => s + (c.metrics?.instagram?.reach||0) + (c.metrics?.facebook?.reach||0), 0);
    const totalEng   = withMetrics.reduce((s, c) => s + (c.metrics?.instagram?.likes||0) + (c.metrics?.instagram?.comments||0) + (c.metrics?.facebook?.reactions||0) + (c.metrics?.facebook?.comments||0), 0);
    const totalDMs   = withMetrics.reduce((s, c) => s + (c.metrics?.instagram?.dms||0) + (c.metrics?.facebook?.messages||0), 0);

    const reels = withMetrics.filter(c => c.type === 'reel' && c.metrics?.videoMetrics);
    const avgRet = reels.length > 0
        ? (reels.reduce((s,r) => s + r.metrics.videoMetrics.retentionPercent, 0) / reels.length).toFixed(1)
        : null;

    const monthNames = { '2026-03':'Marzo','2026-04':'Abril','2026-05':'Mayo','2026-06':'Junio','2026-07':'Julio','2026-08':'Agosto','2026-09':'Septiembre','2026-10':'Octubre','2026-11':'Noviembre','2026-12':'Diciembre' };
    const monthName = monthNames[month] || month;

    if (monthData.length === 0) {
        preview.innerHTML = '<div style="padding:32px;text-align:center;color:var(--gray-400);">'
            + '<div style="font-size:40px;margin-bottom:12px;">📭</div>'
            + '<p style="font-size:14px;color:var(--gray-600);">No hay contenido registrado para ' + monthName + ' 2026</p>'
            + '</div>';
        return;
    }

    preview.innerHTML = '<div style="padding:16px 0;">'
        // Encabezado
        + '<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px 24px;border-radius:12px;color:white;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">'
        + '<div>'
        + '<div style="font-size:18px;font-weight:700;">' + account.name + '</div>'
        + '<div style="font-size:13px;opacity:.85;margin-top:2px;">Reporte de ' + monthName + ' 2026</div>'
        + '</div>'
        + '<div style="text-align:right;">'
        + '<div style="font-size:12px;opacity:.7;">Generado</div>'
        + '<div style="font-size:13px;font-weight:600;">' + new Date().toLocaleDateString('es-AR') + '</div>'
        + '</div>'
        + '</div>'
        // Stats
        + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px;">'
        + _previewStat('📋', monthData.length, 'Publicaciones')
        + _previewStat('👁️', totalReach.toLocaleString(), 'Alcance total')
        + _previewStat('💬', totalEng.toLocaleString(), 'Interacciones')
        + _previewStat('📩', totalDMs, 'DMs / Mensajes')
        + (avgRet ? _previewStat('🎬', avgRet + '%', 'Retención prom.') : '')
        + '</div>'
        // Tabla de contenido
        + '<div style="background:white;border:1px solid var(--gray-200);border-radius:10px;overflow:hidden;">'
        + '<div style="padding:14px 16px;border-bottom:1px solid var(--gray-100);font-weight:600;font-size:14px;">📅 Contenido del mes</div>'
        + '<div style="overflow-x:auto;max-height:280px;overflow-y:auto;">'
        + '<table style="width:100%;border-collapse:collapse;font-size:13px;">'
        + '<thead><tr style="background:var(--gray-50);position:sticky;top:0;">'
        + '<th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;color:var(--gray-500);">FECHA</th>'
        + '<th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;color:var(--gray-500);">TÍTULO</th>'
        + '<th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;color:var(--gray-500);">TIPO</th>'
        + '<th style="padding:10px 12px;text-align:right;font-weight:600;font-size:11px;color:var(--gray-500);">ALCANCE</th>'
        + '<th style="padding:10px 12px;text-align:right;font-weight:600;font-size:11px;color:var(--gray-500);">ENG.</th>'
        + '</tr></thead><tbody>'
        + monthData.map((c, i) => {
            const reach = (c.metrics?.instagram?.reach||0) + (c.metrics?.facebook?.reach||0);
            const eng   = (c.metrics?.instagram?.likes||0) + (c.metrics?.instagram?.comments||0) + (c.metrics?.facebook?.reactions||0) + (c.metrics?.facebook?.comments||0);
            const typeIcons = { reel:'🎬', carousel:'📊', stories:'📲' };
            return '<tr style="border-bottom:1px solid var(--gray-50);" onmouseover="this.style.background=\'#f9fafb\'" onmouseout="this.style.background=\'\'">'
                + '<td style="padding:9px 12px;color:var(--gray-500);">' + (c.date || '') + '</td>'
                + '<td style="padding:9px 12px;font-weight:500;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (c.title || '—') + '</td>'
                + '<td style="padding:9px 12px;">' + (typeIcons[c.type]||'') + ' ' + (c.type||'') + '</td>'
                + '<td style="padding:9px 12px;text-align:right;' + (reach > 0 ? 'color:#10b981;font-weight:600;' : 'color:var(--gray-400);') + '">' + (reach > 0 ? reach.toLocaleString() : '—') + '</td>'
                + '<td style="padding:9px 12px;text-align:right;' + (eng > 0 ? 'color:#3b82f6;font-weight:600;' : 'color:var(--gray-400);') + '">' + (eng > 0 ? eng.toLocaleString() : '—') + '</td>'
                + '</tr>';
        }).join('')
        + '</tbody></table></div></div>'
        + '<div style="margin-top:16px;padding:12px 16px;background:var(--gray-50);border-radius:8px;font-size:12px;color:var(--gray-500);text-align:center;">'
        + '📥 Hacé clic en "Descargar reporte completo" para obtener el PDF listo para enviar al cliente'
        + '</div>'
        + '</div>';

    // Poblar también el select de clientes si está vacío
    const clientSel = document.getElementById('report-client');
    if (clientSel && clientSel.options.length <= 1 && window.accounts) {
        clientSel.innerHTML = '<option value="">Todos los clientes</option>'
            + window.accounts.map(a => '<option value="' + a.id + '">' + a.name + '</option>').join('');
    }
};

function _previewStat(icon, value, label) {
    return '<div style="background:var(--gray-50);padding:16px;border-radius:10px;text-align:center;">'
        + '<div style="font-size:22px;margin-bottom:4px;">' + icon + '</div>'
        + '<div style="font-size:20px;font-weight:700;color:var(--primary);">' + value + '</div>'
        + '<div style="font-size:11px;color:var(--gray-500);margin-top:2px;">' + label + '</div>'
        + '</div>';
}