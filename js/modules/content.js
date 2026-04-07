// Función para eliminar contenido (reemplaza tu función actual)
function deleteContent(id) {
    deleteContentWithConfirm(id);
}

// Función para guardar nuevo contenido
function saveNewContent() {
    // ... tu código para validar y guardar ...
    
    // Después de guardar exitosamente
    showSuccess('Contenido creado correctamente', '📝 Nuevo contenido');
    closeModal('add-content-modal');
}

// Función para guardar cambios en edición
function saveContentEdit() {
    // ... tu código para validar y guardar ...
    
    // Después de guardar exitosamente
    showSuccess('Cambios guardados correctamente', '✏️ Contenido actualizado');
    closeModal('edit-content-modal');
}

// Función para renderizar lista de contenido
function renderContentListStatic(contentData) {
    const container = document.getElementById('content-list');
    if (!container) return;
    
    let html = '';
    
    contentData.forEach(item => {
        html += `
            <div class="calendar-item" data-id="${item.id}">
                <div class="calendar-header">
                    <div class="calendar-date">${item.date} ${item.time || ''}</div>
                    <h4 class="calendar-title">${item.title}</h4>
                    <div class="calendar-type">
                        <span class="type-badge ${item.type}">${item.type}</span>
                    </div>
                </div>
                
                <div class="calendar-metrics">
                    ${renderMetricsPreview(item)}
                </div>
                
                <div class="calendar-actions">
                    <button onclick="openMetricsModal('${item.id}')" class="btn-secondary">
                        📊 ${item.igViews ? 'Editar' : 'Agregar'} métricas
                    </button>
                    <button onclick="openEditContentModal('${item.id}')" class="btn-secondary">
                        ✏️ Editar
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Función para previsualizar métricas
function renderMetricsPreview(item) {
    if (!item.igViews && !item.fbViews && !item.ttViews) {
        return '<p style="color: var(--gray-500); padding: 10px;">Sin métricas aún</p>';
    }
    
    return `
        <div class="metrics-row">
            <span>📸 Instagram:</span>
            <strong>${item.igViews || 0} vistas</strong>
        </div>
        <div class="metrics-row">
            <span>📘 Facebook:</span>
            <strong>${item.fbViews || 0} vistas</strong>
        </div>
        <div class="metrics-row">
            <span>📱 TikTok:</span>
            <strong>${item.ttViews || 0} vistas</strong>
        </div>
    `;
}