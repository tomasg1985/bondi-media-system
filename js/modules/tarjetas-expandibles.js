// ==================================================
// TARJETAS EXPANDIBLES - VER MÁS / VER MENOS
// ==================================================

console.log('🃏 Inicializando tarjetas expandibles...');

function initExpandableCards() {
    document.querySelectorAll('.calendar-item').forEach(card => {
        const metricsContainer = card.querySelector('.calendar-metrics-container');
        
        // Si ya tiene el botón, no hacer nada
        if (card.querySelector('.expand-btn')) return;
        
        // Verificar si el contenido excede la altura máxima
        if (metricsContainer && metricsContainer.scrollHeight > 120) {
            
            // Crear botón "Ver más"
            const expandBtn = document.createElement('div');
            expandBtn.className = 'expand-btn';
            expandBtn.innerHTML = `
                <span class="more-text">📋 Ver más métricas</span>
                <span class="less-text">📋 Ver menos</span>
            `;
            
            // Agregar después del contenedor
            metricsContainer.insertAdjacentElement('afterend', expandBtn);
            
            // Agregar clase collapsed inicialmente
            metricsContainer.classList.add('collapsed');
            
            // Evento click
            expandBtn.addEventListener('click', function() {
                if (metricsContainer.classList.contains('collapsed')) {
                    metricsContainer.classList.remove('collapsed');
                    expandBtn.classList.add('expanded');
                } else {
                    metricsContainer.classList.add('collapsed');
                    expandBtn.classList.remove('expanded');
                }
            });
        }
    });
}

// Ejecutar después de cargar el contenido
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initExpandableCards, 1000);
    });
} else {
    setTimeout(initExpandableCards, 1000);
}

// También ejecutar cuando se actualice el calendario
document.addEventListener('calendarUpdated', function() {
    setTimeout(initExpandableCards, 500);
});

console.log('✅ Tarjetas expandibles listas');