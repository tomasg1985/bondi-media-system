// ==================================================
// STORAGE.JS — CORREGIDO
// Agrega método remove() que faltaba y que avatar-manager.js
// llama en resetAvatar(), causando error silencioso.
// ==================================================

window.appData = window.appData || { calendar: [] };

const storage = {
    async get(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    async set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    // CORREGIDO: método remove que faltaba
    // Era llamado por resetAvatar() y fallaba silenciosamente
    async remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    async list(prefix) {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!prefix || key.startsWith(prefix)) {
                    keys.push(key);
                }
            }
            return keys;
        } catch (error) {
            console.error('Storage list error:', error);
            return [];
        }
    }
};

console.log('✅ storage.js cargado');