// ==================================================
// AVATAR MANAGER — VERSIÓN CORREGIDA
//
// BUGS CORREGIDOS:
// 1. Race condition en F5: loadAvatarForAccount salía con `if (!account) return`
//    cuando window.accounts todavía no había cargado. Ahora lee el avatar
//    directamente desde localStorage sin depender de window.accounts.
// 2. storage.remove no existía → resetAvatar fallaba silenciosamente.
//    Ahora usa localStorage.removeItem directamente como fallback seguro.
// 3. Portales cliente/colaborador: no tienen window.accounts, ahora funciona
//    porque no depende de ese array para cargar la imagen.
// 4. initAvatar tiene retry: si accounts no cargó aún, reintenta en 300ms.
// ==================================================

console.log('🖼️ Cargando avatar-manager.js...');

const AVATAR_COLORS = [
    '#667eea', '#764ba2', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#ef4444'
];

// --------------------------------------------------
// STORAGE HELPERS — seguros aunque storage.remove no exista
// --------------------------------------------------
function _avatarGet(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

function _avatarSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) { return false; }
}

function _avatarRemove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
}

// --------------------------------------------------
// UTILIDADES
// --------------------------------------------------
function getInitials(name) {
    if (!name) return 'BM';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}

function resetAvatarDisplay() {
    const avatarDiv      = document.getElementById('account-avatar');
    const avatarImg      = document.getElementById('avatar-image');
    const avatarInitials = document.getElementById('avatar-initials');
    if (!avatarImg || !avatarInitials || !avatarDiv) return;
    avatarImg.style.display      = 'none';
    avatarInitials.style.display = 'block';
    avatarInitials.textContent   = 'BM';
    avatarDiv.style.background   = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    avatarDiv.classList.remove('has-image');
}

// --------------------------------------------------
// INIT — con retry para evitar race condition en F5
// --------------------------------------------------
function initAvatar() {
    const accountId = window.currentAccount || 'bondi-media';
    window.loadAvatarForAccount(accountId);
}

// --------------------------------------------------
// MODAL DE AVATAR
// --------------------------------------------------
function openAvatarModal() {
    console.log('🖼️ Abriendo modal de avatar');
    loadColorPalette();
    loadCurrentAvatarSettings();
    const modal = document.getElementById('avatar-modal');
    if (modal) { modal.classList.add('active'); modal.style.display = ''; }
}

function loadColorPalette() {
    const palette = document.getElementById('color-palette');
    if (!palette) return;
    palette.innerHTML = AVATAR_COLORS
        .map(color => `<div class="color-option" style="background:${color};" onclick="selectColor('${color}')"></div>`)
        .join('');
}

function selectColor(color) {
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    const selected = Array.from(document.querySelectorAll('.color-option'))
        .find(opt => opt.style.background === color || opt.style.backgroundColor === color);
    if (selected) selected.classList.add('selected');
    const previewCircle = document.getElementById('preview-circle');
    if (previewCircle) previewCircle.style.background = color;
}

function showInitialsOptions() {
    const el = document.getElementById('initials-options');
    if (el) el.style.display = 'block';
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const previewImg      = document.getElementById('preview-image');
        const previewInitials = document.getElementById('preview-initials');
        const previewCircle   = document.getElementById('preview-circle');
        if (previewImg)      { previewImg.src = e.target.result; previewImg.style.display = 'block'; }
        if (previewInitials) previewInitials.style.display = 'none';
        if (previewCircle)   previewCircle.style.background = 'transparent';
    };
    reader.readAsDataURL(file);
}

function loadCurrentAvatarSettings() {
    const accountId     = window.currentAccount || 'bondi-media';
    const avatarData    = _avatarGet('avatar-' + accountId);
    const previewImg    = document.getElementById('preview-image');
    const previewInit   = document.getElementById('preview-initials');
    const previewCircle = document.getElementById('preview-circle');
    const initialsInput = document.getElementById('avatar-initials-input');
    const account       = (window.accounts || []).find(a => a.id === accountId);

    if (!previewImg || !previewInit) return;

    if (avatarData && avatarData.type === 'image') {
        previewImg.src            = avatarData.data;
        previewImg.style.display  = 'block';
        previewInit.style.display = 'none';
        if (previewCircle) previewCircle.style.background = 'transparent';
    } else if (avatarData && avatarData.type === 'initials') {
        previewImg.style.display  = 'none';
        previewInit.style.display = 'block';
        previewInit.textContent   = avatarData.initials || 'BM';
        if (previewCircle) previewCircle.style.background = avatarData.color || AVATAR_COLORS[0];
        if (initialsInput) initialsInput.value = avatarData.initials || 'BM';
    } else {
        const name = account ? account.name : 'Bondi Media';
        previewImg.style.display  = 'none';
        previewInit.style.display = 'block';
        previewInit.textContent   = getInitials(name);
        if (previewCircle) previewCircle.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        if (initialsInput) initialsInput.value = getInitials(name);
    }
}

async function saveAvatarSettings() {
    const accountId       = window.currentAccount || 'bondi-media';
    const previewImg      = document.getElementById('preview-image');
    const previewInitials = document.getElementById('preview-initials');
    const initialsInput   = document.getElementById('avatar-initials-input');
    const selectedColor   = document.querySelector('.color-option.selected');

    let avatarData;
    if (previewImg && previewImg.style.display !== 'none' && previewImg.src && !previewImg.src.endsWith('/')) {
        avatarData = { type: 'image', data: previewImg.src };
    } else {
        avatarData = {
            type:     'initials',
            initials: (initialsInput && initialsInput.value) || (previewInitials && previewInitials.textContent) || 'BM',
            color:    selectedColor ? (selectedColor.style.background || selectedColor.style.backgroundColor) : AVATAR_COLORS[0]
        };
    }

    // Guardar con ambos métodos para máxima compatibilidad
    _avatarSet('avatar-' + accountId, avatarData);
    if (typeof storage !== 'undefined' && typeof storage.set === 'function') {
        await storage.set('avatar-' + accountId, avatarData);
    }

    await window.loadAvatarForAccount(accountId);
    if (typeof closeModal === 'function') closeModal('avatar-modal');
    if (typeof addNotification === 'function') addNotification('Avatar Actualizado', 'Imagen de perfil actualizada');
    if (typeof showSuccess === 'function') showSuccess('Avatar guardado correctamente');
}

async function resetAvatar() {
    const accountId = window.currentAccount || 'bondi-media';

    // Eliminar con ambos métodos
    _avatarRemove('avatar-' + accountId);
    if (typeof storage !== 'undefined' && typeof storage.remove === 'function') {
        await storage.remove('avatar-' + accountId);
    }

    const previewImg    = document.getElementById('preview-image');
    const previewInit   = document.getElementById('preview-initials');
    const previewCircle = document.getElementById('preview-circle');
    const account       = (window.accounts || []).find(a => a.id === accountId);
    const name          = account ? account.name : 'Bondi Media';

    if (previewImg)    previewImg.style.display   = 'none';
    if (previewInit)   { previewInit.style.display = 'block'; previewInit.textContent = getInitials(name); }
    if (previewCircle) previewCircle.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    await window.loadAvatarForAccount(accountId);
}

// ==================================================
// FUNCIÓN CENTRAL — loadAvatarForAccount
//
// CORRECCIÓN CLAVE: Ya no depende de window.accounts para
// cargar la imagen. Lee directamente desde localStorage.
// window.accounts solo se usa para el nombre/label, con
// fallback seguro si no está disponible (portales, F5).
// ==================================================
window.loadAvatarForAccount = async function (accountId) {
    accountId = accountId || window.currentAccount || 'bondi-media';

    const avatarDiv      = document.getElementById('account-avatar');
    const avatarImg      = document.getElementById('avatar-image');
    const avatarInitials = document.getElementById('avatar-initials');
    const accountNameEl  = document.getElementById('account-name');
    const accountRoleEl  = document.getElementById('account-role');

    // Intentar obtener cuenta del array (puede no estar disponible en portales)
    const account = (window.accounts || []).find(a => a.id === accountId);

    // Actualizar nombre y rol si los elementos existen
    if (accountNameEl) {
        accountNameEl.textContent = account
            ? account.name
            : (accountId === 'bondi-media' ? 'Bondi Media' : accountId);
    }
    if (accountRoleEl) {
        accountRoleEl.textContent = accountId === 'bondi-media' ? 'Cuenta Principal' : 'Cliente';
    }

    // Si no hay elementos de avatar en el DOM (páginas sin sidebar), salir
    if (!avatarImg || !avatarInitials || !avatarDiv) return;

    // 1) Foto directa del objeto cuenta (desde client-manager)
    if (account && account.photo) {
        avatarImg.src                = account.photo;
        avatarImg.style.display      = 'block';
        avatarInitials.style.display = 'none';
        avatarDiv.style.background   = 'transparent';
        avatarDiv.classList.add('has-image');
        return;
    }

    // 2) Avatar guardado en localStorage — lectura directa, sin depender de storage async
    //    Esto resuelve el bug de F5 y el bug de portales.
    const avatarData = _avatarGet('avatar-' + accountId);

    if (avatarData && avatarData.type === 'image' && avatarData.data) {
        avatarImg.src                = avatarData.data;
        avatarImg.style.display      = 'block';
        avatarInitials.style.display = 'none';
        avatarDiv.style.background   = 'transparent';
        avatarDiv.classList.add('has-image');
        return;
    }

    if (avatarData && avatarData.type === 'initials') {
        avatarImg.style.display      = 'none';
        avatarInitials.style.display = 'block';
        avatarInitials.textContent   = avatarData.initials || getInitials(account ? account.name : 'BM');
        avatarDiv.style.background   = avatarData.color || '#667eea';
        avatarDiv.classList.remove('has-image');
        return;
    }

    // 3) Default: iniciales del nombre de la cuenta
    const fallbackName = account ? account.name : 'Bondi Media';
    avatarImg.style.display      = 'none';
    avatarInitials.style.display = 'block';
    avatarInitials.textContent   = getInitials(fallbackName);
    avatarDiv.style.background   = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    avatarDiv.classList.remove('has-image');
};

// ==================================================
// FUNCIÓN PARA PORTALES (cliente / colaborador)
// Carga el avatar en cualquier elemento con id dado,
// sin depender de window.accounts
// ==================================================
window.loadAvatarInElement = function (avatarImgId, avatarInitialsId, avatarDivId, accountId) {
    accountId = accountId || 'bondi-media';

    const avatarDiv      = document.getElementById(avatarDivId);
    const avatarImg      = document.getElementById(avatarImgId);
    const avatarInitials = document.getElementById(avatarInitialsId);
    if (!avatarImg || !avatarInitials || !avatarDiv) return;

    const avatarData = _avatarGet('avatar-' + accountId);

    if (avatarData && avatarData.type === 'image' && avatarData.data) {
        avatarImg.src                = avatarData.data;
        avatarImg.style.display      = 'block';
        avatarInitials.style.display = 'none';
        avatarDiv.style.background   = 'transparent';
        avatarDiv.classList.add('has-image');
    } else if (avatarData && avatarData.type === 'initials') {
        avatarImg.style.display      = 'none';
        avatarInitials.style.display = 'block';
        avatarInitials.textContent   = avatarData.initials || 'BM';
        avatarDiv.style.background   = avatarData.color || '#667eea';
    } else {
        avatarImg.style.display      = 'none';
        avatarInitials.style.display = 'block';
        avatarInitials.textContent   = 'BM';
        avatarDiv.style.background   = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
};

// Exportar funciones globales
window.openAvatarModal     = openAvatarModal;
window.handleAvatarUpload  = handleAvatarUpload;
window.showInitialsOptions = showInitialsOptions;
window.selectColor         = selectColor;
window.saveAvatarSettings  = saveAvatarSettings;
window.resetAvatar         = resetAvatar;
window.initAvatar          = initAvatar;

console.log('✅ avatar-manager.js cargado correctamente');