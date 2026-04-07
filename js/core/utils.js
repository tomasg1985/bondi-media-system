function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: '2-digit', month: 'short' };
    return date.toLocaleDateString('es-ES', options);
}

function getTypeBadge(type) {
    const types = { reel: 'success', carousel: 'info', stories: 'warning' };
    return types[type] || 'info';
}

function getTypeLabel(type) {
    const labels = { reel: '🎬 Reel', carousel: '📊 Carrusel', stories: '📲 Stories' };
    return labels[type] || type;
}

function getRatingFromRetention(percent) {
    if (percent >= 80) return { rating: 'excelente', emoji: '🌟', label: 'EXCELENTE', color: '#10b981' };
    if (percent >= 60) return { rating: 'bueno', emoji: '✅', label: 'BUENO', color: '#3b82f6' };
    if (percent >= 40) return { rating: 'regular', emoji: '⚠️', label: 'REGULAR', color: '#f59e0b' };
    return { rating: 'malo', emoji: '❌', label: 'MALO', color: '#ef4444' };
}

console.log('✅ utils.js cargado');

// ==================================================
// KEYBOARD SHORTCUTS
// ==================================================

document.addEventListener('keydown', function(e) {
    // Ctrl + N = Nuevo contenido
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (typeof openAddContentModal === 'function') {
            openAddContentModal();
        }
    }
    
    // Ctrl + K = Buscar
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        showSearchModal();
    }
    
    // Ctrl + L = Ir a leads
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        if (typeof navigateTo === 'function') {
            navigateTo('leads');
        }
    }
    
    // Ctrl + D = Ir a dashboard
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (typeof navigateTo === 'function') {
            navigateTo('dashboard');
        }
    }
    
    // Ctrl + , = Configuración
    if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        if (typeof navigateTo === 'function') {
            navigateTo('config');
        }
    }
    
    // Escape = Cerrar modales
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Buscador rápido
function showSearchModal() {
    alert('Buscador rápido - Ctrl+K');
    // Aquí implementarías un modal de búsqueda
}

// Cerrar todos los modales
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// ==================================================
// TOAST NOTIFICATIONS
// ==================================================

function showToast(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Auto cerrar
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================================================
// TOAST NOTIFICATIONS - Sistema de notificaciones
// ==================================================

// Mostrar notificación toast
function showToast(title, message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.error('Toast container no encontrado');
        return;
    }
    
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Iconos por tipo
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const icon = icons[type] || icons.info;
    
    // Títulos por tipo
    const titles = {
        success: '✅ Éxito',
        error: '❌ Error',
        warning: '⚠️ Advertencia',
        info: 'ℹ️ Información'
    };
    
    const defaultTitle = titles[type] || titles.info;
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title || defaultTitle}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
        <div class="toast-progress"></div>
    `;
    
    // Agregar al contenedor
    container.appendChild(toast);
    
    // Auto-cerrar después de la duración
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideOutToast 0.3s ease forwards';
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, duration);
    
    // Cerrar al hacer clic
    toast.addEventListener('click', function(e) {
        if (e.target.closest('.toast-close')) return;
        this.style.animation = 'slideOutToast 0.3s ease forwards';
        setTimeout(() => this.remove(), 300);
    });
    
    return toast;
}

// Funciones helper para tipos específicos
function showSuccess(message, title = '✅ Éxito') {
    return showToast(title, message, 'success');
}

function showError(message, title = '❌ Error') {
    return showToast(title, message, 'error');
}

function showWarning(message, title = '⚠️ Advertencia') {
    return showToast(title, message, 'warning');
}

function showInfo(message, title = 'ℹ️ Información') {
    return showToast(title, message, 'info');
}

// ==================================================
// FUNCIONES PARA MODALES - CORREGIDAS
// ==================================================

// Abrir modal — FIX: usa solo classList, no inline style
// El CSS .modal.active maneja display:flex.
// Setear style.display inline causaba que closeModal (init.js)
// no pudiera ocultarlo si solo removía la clase 'active'.
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = '';   // limpia cualquier inline style previo
    }
}

// Cerrar modal — FIX: limpia inline style además de remover clase
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = '';   // limpia inline → CSS toma control (display:none)
    }
}

// Cerrar modal al hacer clic en el overlay
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal') && !event.target.classList.contains('modal-no-overlay-close')) {
        event.target.classList.remove('active');
        event.target.style.display = '';
    }
});

// Asegurar que los botones de cierre funcionen
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal-close, .btn-secondary[onclick*="closeModal"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
});

// Ejemplos de uso:
// showToast('Éxito', 'Contenido guardado correctamente', 'success');
// showToast('Error', 'No se pudo conectar', 'error');
// showToast('Advertencia', 'Esta acción no se puede deshacer', 'warning');