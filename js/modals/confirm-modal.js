// ==================================================
// CONFIRM-MODAL.JS - Modal de confirmación personalizado
// ==================================================

// Mostrar modal de confirmación personalizado
function showConfirm(options) {
    const {
        title = 'Confirmar acción',
        message = '¿Estás seguro?',
        icon = '⚠️',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        onConfirm,
        onCancel,
        confirmButtonClass = 'btn-danger' // Por defecto rojo, pero puede ser 'btn-success' etc
    } = options;
    
    // Actualizar modal
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmIcon').textContent = icon;
    document.getElementById('confirmMessage').textContent = message;
    
    const confirmBtn = document.getElementById('confirmActionBtn');
    confirmBtn.textContent = confirmText;
    
    // Cambiar clase del botón según necesidad
    confirmBtn.className = confirmButtonClass;
    
    // Configurar acción de confirmación
    confirmBtn.onclick = function() {
        closeModal('confirmModal');
        if (onConfirm) onConfirm();
    };
    
    // Configurar cancelación
    const cancelBtn = document.querySelector('#confirmModal .btn-secondary');
    cancelBtn.onclick = function() {
        closeModal('confirmModal');
        if (onCancel) onCancel();
    };
    
    // Mostrar modal
    openModal('confirmModal');
}

// Función helper para eliminar contenido (ejemplo con permisos)
function deleteContentWithConfirm(id) {
    // Verificar permisos primero
    if (!hasPermission('canDeleteContent')) {
        showError('No tienes permisos para eliminar contenido');
        return;
    }
    
    showConfirm({
        title: '🗑️ Eliminar contenido',
        message: '¿Estás seguro de eliminar este contenido? Esta acción no se puede deshacer.',
        icon: '⚠️',
        confirmText: 'Sí, eliminar',
        confirmButtonClass: 'btn-danger',
        onConfirm: () => {
            // Aquí va tu código para eliminar
            console.log('Eliminando contenido:', id);
            showSuccess('Contenido eliminado correctamente');
            
            // Actualizar la lista después de eliminar
            if (typeof loadContent === 'function') {
                loadContent();
            }
        },
        onCancel: () => {
            showInfo('Operación cancelada');
        }
    });
}

// Función helper para guardar cambios (ejemplo)
function saveChangesWithConfirm(data) {
    showConfirm({
        title: '💾 Guardar cambios',
        message: '¿Estás seguro de guardar estos cambios?',
        icon: '📝',
        confirmText: 'Sí, guardar',
        confirmButtonClass: 'btn-success',
        onConfirm: () => {
            console.log('Guardando cambios:', data);
            showSuccess('Cambios guardados correctamente');
        },
        onCancel: () => {
            showInfo('Cambios descartados');
        }
    });
}

// Exportar funciones
window.showConfirm = showConfirm;
window.deleteContentWithConfirm = deleteContentWithConfirm;
window.saveChangesWithConfirm = saveChangesWithConfirm;

console.log('✅ confirm-modal.js cargado correctamente');