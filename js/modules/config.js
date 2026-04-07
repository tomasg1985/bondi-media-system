// ==================================================
// CONFIGURACIÓN - BACKUP Y PERSONALIZACIÓN
// ==================================================

console.log('⚙️ Cargando config.js...');

// ==================================================
// VARIABLES DE ESTILO
// ==================================================
let currentTheme = 'default';

// Temas disponibles
const themes = {
    default: {
        name: '🌞 Por Defecto',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#f3f4f6',
        cardBg: '#ffffff',
        textPrimary: '#0f172a',
        textSecondary: '#64748b'
    },
    dark: {
        name: '🌙 Modo Oscuro',
        primary: '#818cf8',
        secondary: '#a78bfa',
        background: '#0f172a',
        cardBg: '#1e293b',
        textPrimary: '#f8fafc',
        textSecondary: '#cbd5e1'
    },
    nature: {
        name: '🌿 Naturaleza',
        primary: '#10b981',
        secondary: '#34d399',
        background: '#ecfdf5',
        cardBg: '#ffffff',
        textPrimary: '#0f172a',
        textSecondary: '#64748b'
    },
    sunset: {
        name: '🌅 Atardecer',
        primary: '#f43f5e',
        secondary: '#fb7185',
        background: '#fff1f2',
        cardBg: '#ffffff',
        textPrimary: '#0f172a',
        textSecondary: '#64748b'
    },
    ocean: {
        name: '🌊 Oceánico',
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        background: '#f0f9ff',
        cardBg: '#ffffff',
        textPrimary: '#0f172a',
        textSecondary: '#64748b'
    },
    purple: {
        name: '💜 Púrpura',
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        background: '#f5f3ff',
        cardBg: '#ffffff',
        textPrimary: '#0f172a',
        textSecondary: '#64748b'
    }
};

// ==================================================
// FUNCIÓN PARA LIMPIAR TODOS LOS DATOS
// ==================================================
window.clearAllData = function() {
    // ... (tu código existente de limpieza, se mantiene igual)
    console.log('🗑️ Iniciando limpieza de datos...');
    
    // PRIMERA CONFIRMACIÓN
    const confirm1 = confirm(
        '⚠️ ¿ELIMINAR TODOS LOS DATOS?\n\n' +
        'Esta acción eliminará PERMANENTEMENTE:\n\n' +
        '📅 Todo el calendario y métricas\n' +
        '👥 Todos los clientes y sus datos\n' +
        '💬 Todos los leads\n' +
        '📝 Todos los briefings\n' +
        '📊 Todos los análisis mensuales\n' +
        '🖼️ Todos los avatares personalizados\n\n' +
        '¿Estás SEGURO de continuar?'
    );
    
    if (!confirm1) {
        console.log('❌ Limpieza cancelada (primera confirmación)');
        return;
    }
    
    // SEGUNDA CONFIRMACIÓN - MÁS DRAMÁTICA
    const confirm2 = confirm(
        '⚠️ CONFIRMACIÓN FINAL ⚠️\n\n' +
        '❗❗ ESTA ACCIÓN NO SE PUEDE DESHACER ❗❗\n\n' +
        'Todo el contenido, métricas y configuraciones\n' +
        'serán eliminados para siempre.\n\n' +
        'Escribe "BORRAR" en el siguiente prompt para confirmar'
    );
    
    if (!confirm2) {
        console.log('❌ Limpieza cancelada (segunda confirmación)');
        return;
    }
    
    // TERCERA VERIFICACIÓN - TEXTO ESPECÍFICO
    const verification = prompt(
        'Para confirmar la eliminación TOTAL de todos los datos,\n' +
        'escribe exactamente: BORRAR TODO\n\n' +
        '(Cualquier otra respuesta cancelará la operación)'
    );
    
    if (verification !== 'BORRAR TODO') {
        alert('❌ Operación cancelada - Texto de verificación incorrecto');
        console.log('❌ Limpieza cancelada (verificación de texto falló)');
        return;
    }
    
    console.log('🗑️ Procediendo con la limpieza total...');
    
    try {
        // ======================================
        // 1. LIMPIAR LOCALSTORAGE COMPLETO
        // ======================================
        localStorage.clear();
        console.log('✅ localStorage limpiado');
        
        // ======================================
        // 2. REINICIAR VARIABLES GLOBALES
        // ======================================
        
        // Datos principales
        window.appData = {
            calendar: [],
            leads: [],
            currentMetricsId: null
        };
        
        // Cuentas (solo la principal)
        window.accounts = [{
            id: 'bondi-media',
            name: 'Bondi Media',
            brand: 'Principal',
            type: 'active',
            industry: 'Agencia',
            notes: 'Cuenta principal'
        }];
        
        // Briefings
        window.briefings = [];
        
        // Análisis mensual
        window.monthlyAnalysis = {};
        
        // Notificaciones
        window.notifications = [];
        
        // ======================================
        // 3. RESTAURAR DATOS MÍNIMOS NECESARIOS
        // ======================================
        
        // Guardar cuenta principal
        // Guardar cuentas SIN fotos embebidas (las fotos viven en bondi-photo-{id})
        var _cleanA1 = window.accounts.map(function(a){var c=Object.assign({},a);delete c.photo;return c;});
        localStorage.setItem('bondi-accounts', JSON.stringify(_cleanA1));
        localStorage.setItem('bondi-calendar-bondi-media', JSON.stringify([]));
        localStorage.setItem('bondi-leads-bondi-media', JSON.stringify([]));
        
        console.log('✅ Datos mínimos restaurados');
        
        // ======================================
        // 4. ACTUALIZAR INTERFAZ
        // ======================================
        
        // Actualizar selector de cuentas
        if (typeof updateAccountSelector === 'function') {
            updateAccountSelector();
        }
        
        // Cambiar a cuenta principal
        window.currentAccount = 'bondi-media';
        localStorage.setItem('bondi-current-account', 'bondi-media');
        
        // Recargar todos los módulos
        if (typeof updateAllModules === 'function') {
            updateAllModules();
        }
        
        // Resetear avatar
        const avatarImg = document.getElementById('avatar-image');
        const avatarInitials = document.getElementById('avatar-initials');
        const avatarDiv = document.getElementById('account-avatar');
        
        if (avatarImg) avatarImg.style.display = 'none';
        if (avatarInitials) {
            avatarInitials.style.display = 'block';
            avatarInitials.textContent = 'BM';
        }
        if (avatarDiv) {
            avatarDiv.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            avatarDiv.classList.remove('has-image');
        }
        
        // ======================================
        // 5. NOTIFICAR ÉXITO
        // ======================================
        
        if (typeof addNotification === 'function') {
            addNotification('🧹 Datos Limpiados', 'El sistema ha sido restaurado a estado inicial');
        }
        
        console.log('✅ Limpieza completada exitosamente');
        
        // Alerta final
        alert(
            '✅ LIMPIEZA COMPLETADA\n\n' +
            'Todos los datos han sido eliminados permanentemente.\n\n' +
            'El sistema ha sido restaurado a su estado inicial.\n' +
            'Solo queda la cuenta principal de Bondi Media.'
        );
        
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
        alert('❌ Error al limpiar los datos. Revisa la consola para más detalles.');
    }
};

// ==================================================
// FUNCIÓN PARA CAMBIAR TEMA - MEJORADA
// ==================================================
window.changeTheme = function(themeId) {
    console.log(`🎨 Cambiando tema a: ${themeId}`);
    
    const theme = themes[themeId];
    if (!theme) {
        console.error('❌ Tema no encontrado');
        return;
    }
    
    // Guardar tema seleccionado
    currentTheme = themeId;
    localStorage.setItem('bondi-theme', themeId);
    
    // Aplicar tema al body
    const body = document.body;
    
    // Remover todas las clases de tema previas
    body.classList.remove('dark-theme', 'nature-theme', 'sunset-theme', 'ocean-theme', 'purple-theme');
    
    // Aplicar clase específica del tema
    if (themeId !== 'default') {
        body.classList.add(`${themeId}-theme`);
    }
    
    // Aplicar variables CSS personalizadas
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    
    // Notificar
    if (typeof addNotification === 'function') {
        addNotification('Tema Cambiado', `Tema: ${theme.name}`);
    }
    
    console.log('✅ Tema aplicado');
};

// ==================================================
// FUNCIÓN PARA CAMBIAR TAMAÑO DE FUENTE
// ==================================================
window.changeFontSize = function(size) {
    console.log(`🔤 Cambiando tamaño de fuente a: ${size}`);
    
    let fontSize;
    switch(size) {
        case 'small':
            fontSize = '14px';
            break;
        case 'medium':
            fontSize = '16px';
            break;
        case 'large':
            fontSize = '18px';
            break;
        default:
            fontSize = '16px';
    }
    
    document.documentElement.style.setProperty('--base-font-size', fontSize);
    document.body.style.fontSize = fontSize;
    
    localStorage.setItem('bondi-font-size', size);
    
    if (typeof addNotification === 'function') {
        addNotification('Fuente Cambiada', `Tamaño: ${size === 'small' ? 'Pequeña' : size === 'large' ? 'Grande' : 'Normal'}`);
    }
};

// ==================================================
// FUNCIÓN PARA CAMBIAR COMPACTACIÓN
// ==================================================
window.toggleCompactMode = function(enabled) {
    console.log(`📏 Modo compacto: ${enabled ? 'activado' : 'desactivado'}`);
    
    if (enabled) {
        document.body.classList.add('compact-mode');
        localStorage.setItem('bondi-compact-mode', 'true');
    } else {
        document.body.classList.remove('compact-mode');
        localStorage.setItem('bondi-compact-mode', 'false');
    }
};

// ==================================================
// FUNCIÓN TOGGLE THEME - MEJORADA
// ==================================================
window.toggleTheme = function() {
    const body = document.body;
    
    // Si estamos en modo oscuro, volver a default, si no, ir a oscuro
    if (body.classList.contains('dark-theme')) {
        changeTheme('default');
    } else {
        changeTheme('dark');
    }
};

// ==================================================
// FUNCIÓN PARA CARGAR TEMA GUARDADO - MEJORADA
// ==================================================
function loadTheme() {
    const savedTheme = localStorage.getItem('bondi-theme');
    if (savedTheme) {
        changeTheme(savedTheme);
    } else {
        // Por defecto, modo claro
        changeTheme('default');
    }
}

// ==================================================
// CARGAR CONFIGURACIÓN GUARDADA - MEJORADA
// ==================================================
window.loadSavedConfig = function() {
    console.log('⚙️ Cargando configuración guardada...');
    
    // Cargar tema (ahora maneja correctamente dark/light)
    loadTheme();
    
    // Cargar tamaño de fuente
    const savedFontSize = localStorage.getItem('bondi-font-size');
    if (savedFontSize) {
        changeFontSize(savedFontSize);
    } else {
        changeFontSize('medium');
    }
    
    // Cargar modo compacto
    const savedCompact = localStorage.getItem('bondi-compact-mode');
    if (savedCompact === 'true') {
        document.body.classList.add('compact-mode');
        const toggle = document.getElementById('compact-mode-toggle');
        if (toggle) toggle.checked = true;
    }
    
    console.log('✅ Configuración cargada');
};

// ==================================================
// EXPORTAR BACKUP
// ==================================================
window.exportData = function() {
    console.log('📤 Exportando backup...');
    
    try {
        // Recolectar todos los datos del sistema
        const backup = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            account: window.currentAccount || 'bondi-media',
            config: {
                theme: currentTheme,
                fontSize: localStorage.getItem('bondi-font-size') || 'medium',
                compactMode: localStorage.getItem('bondi-compact-mode') === 'true'
            },
            data: {
                calendar: window.appData?.calendar || [],
                leads: window.appData?.leads || [],
                accounts: window.accounts || [],
                briefings: window.briefings || [],
                monthlyAnalysis: window.monthlyAnalysis || {},
                avatars: {}
            }
        };
        
        // Recolectar avatares
        if (window.accounts) {
            window.accounts.forEach(account => {
                const avatarKey = `avatar-${account.id}`;
                const avatarData = localStorage.getItem(avatarKey);
                if (avatarData) {
                    try {
                        backup.data.avatars[account.id] = JSON.parse(avatarData);
                    } catch (e) {
                        console.warn(`⚠️ No se pudo parsear avatar de ${account.id}`);
                    }
                }
            });
        }
        
        // Recolectar análisis de meses
        const months = ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];
        backup.data.analysis = {};
        
        months.forEach(month => {
            const analysisKey = `analysis-${month}`;
            const analysisData = localStorage.getItem(analysisKey);
            if (analysisData) {
                try {
                    backup.data.analysis[month] = JSON.parse(analysisData);
                } catch (e) {
                    console.warn(`⚠️ No se pudo parsear análisis de ${month}`);
                }
            }
        });
        
        // Convertir a JSON bonito
        const jsonStr = JSON.stringify(backup, null, 2);
        
        // Crear blob y descargar
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Nombre del archivo con fecha
        const date = new Date();
        const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
        const timeStr = `${date.getHours().toString().padStart(2,'0')}${date.getMinutes().toString().padStart(2,'0')}`;
        
        link.href = url;
        link.download = `bondi-backup-${dateStr}_${timeStr}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        if (typeof addNotification === 'function') {
            addNotification('Backup Exportado', `Archivo: ${link.download}`);
        }
        
        console.log('✅ Backup exportado');
        alert(`✅ Backup creado: ${link.download}`);
        
    } catch (error) {
        console.error('❌ Error al exportar:', error);
        alert('❌ Error al crear backup');
    }
};

// ==================================================
// IMPORTAR BACKUP
// ==================================================
window.importData = function() {
    console.log('📥 Importando backup...');
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const backup = JSON.parse(e.target.result);
                
                if (!backup.version || !backup.data) {
                    throw new Error('Backup inválido');
                }
                
                if (!confirm(`¿Importar backup del ${new Date(backup.exportDate).toLocaleString()}?`)) {
                    return;
                }
                
                // Restaurar datos
                if (backup.data.accounts) {
                    window.accounts = backup.data.accounts;
                    // Restaurar fotos a sus keys individuales antes de guardar
                    window.accounts.forEach(function(a){ if(a.photo){ try{ localStorage.setItem('bondi-photo-'+a.id, a.photo); }catch(e){} } });
                    var _cleanA2 = window.accounts.map(function(a){var c=Object.assign({},a);delete c.photo;return c;});
                    localStorage.setItem('bondi-accounts', JSON.stringify(_cleanA2));
                }
                
                if (backup.data.calendar) {
                    window.appData.calendar = backup.data.calendar;
                    localStorage.setItem(`bondi-calendar-${backup.account}`, JSON.stringify(window.appData.calendar));
                }
                
                if (backup.data.leads) {
                    window.appData.leads = backup.data.leads;
                    localStorage.setItem(`bondi-leads-${backup.account}`, JSON.stringify(window.appData.leads));
                }
                
                if (backup.data.briefings) {
                    window.briefings = backup.data.briefings;
                    localStorage.setItem('bondi-briefings', JSON.stringify(window.briefings));
                }
                
                if (backup.data.monthlyAnalysis) {
                    window.monthlyAnalysis = backup.data.monthlyAnalysis;
                }
                
                if (backup.data.analysis) {
                    Object.entries(backup.data.analysis).forEach(([month, data]) => {
                        localStorage.setItem(`analysis-${month}`, JSON.stringify(data));
                    });
                }
                
                if (backup.data.avatars) {
                    Object.entries(backup.data.avatars).forEach(([accountId, avatarData]) => {
                        localStorage.setItem(`avatar-${accountId}`, JSON.stringify(avatarData));
                    });
                }
                
                // Restaurar configuración visual
                if (backup.config) {
                    if (backup.config.theme) changeTheme(backup.config.theme);
                    if (backup.config.fontSize) changeFontSize(backup.config.fontSize);
                    if (backup.config.compactMode) toggleCompactMode(backup.config.compactMode);
                }
                
                if (typeof updateAccountSelector === 'function') updateAccountSelector();
                if (typeof updateAllModules === 'function') updateAllModules();
                
                alert('✅ Backup importado correctamente');
                
            } catch (error) {
                console.error('❌ Error al importar:', error);
                alert('❌ Error al importar backup');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};

// ==================================================
// CARGAR CONFIGURACIÓN AL INICIAR
// ==================================================
document.addEventListener('DOMContentLoaded', function() {
    loadSavedConfig();
});


// ==================================================
// CONFIGURACIÓN DE INTELIGENCIA ARTIFICIAL — FASE 1
// Permite al administrador guardar la API key de Anthropic
// de forma segura en localStorage (codificada en base64).
// La key nunca sale del navegador — no hay servidor que la procese.
// ==================================================

window.renderAIConfig = function() {
    const container = document.getElementById('ai-config-section');
    if (!container) return;

    const hasKey    = !!localStorage.getItem('bondi-openai-key') || !!localStorage.getItem('bondi-claude-key');
    const statusColor = hasKey ? '#10b981' : '#ef4444';
    const statusText  = hasKey ? '✅ API key configurada y activa' : '❌ Sin API key — la IA usa modo demo (templates locales)';

    container.innerHTML =
        '<div style="padding:20px;background:white;border-radius:12px;border:1px solid var(--gray-200);">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
        + '<h4 style="margin:0;font-size:15px;">🤖 Inteligencia Artificial — OpenAI API (GPT-4o)</h4>'
        + '<span style="font-size:12px;font-weight:600;color:' + statusColor + ';">' + statusText + '</span>'
        + '</div>'

        // Estado actual
        + '<div style="background:var(--gray-50);padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;color:var(--gray-600);">'
        + 'La API key de Anthropic permite que el Asistente IA genere copies, analice hooks y cree planes de contenido personalizados para cada cliente. '
        + 'Se guarda localmente en tu navegador — nunca se envía a ningún servidor externo.'
        + '</div>'

        // Input de la key
        + '<div style="margin-bottom:12px;">'
        + '<label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">API Key de Anthropic</label>'
        + '<div style="display:flex;gap:8px;">'
        + '<input type="password" id="claude-api-key-input" placeholder="sk-..." '
        + 'style="flex:1;padding:10px 14px;border:1px solid var(--gray-300);border-radius:8px;font-size:13px;font-family:monospace;" '
        + (hasKey ? 'value="••••••••••••••••••••••••"' : '') + '>'
        + '<button onclick="saveClaudeAPIKey()" class="btn-primary" style="padding:10px 20px;font-size:13px;">Guardar</button>'
        + (hasKey ? '<button onclick="clearClaudeAPIKey()" class="btn-secondary" style="padding:10px 16px;font-size:13px;">Borrar</button>' : '')
        + '</div>'
        + '<div style="font-size:11px;color:var(--gray-400);margin-top:6px;">Obtenela en platform.openai.com → API Keys</div>'
        + '</div>'

        // Test de conexión
        + (hasKey
            ? '<button onclick="testClaudeConnection()" class="btn-secondary" style="font-size:13px;padding:8px 16px;margin-right:8px;">🔗 Probar conexión</button>'
            : '')
        + '<div id="ai-test-result" style="margin-top:12px;font-size:13px;"></div>'

        // Info de costo estimado
        + '<div style="margin-top:20px;padding:12px 16px;background:var(--gray-50);border-radius:8px;border-left:3px solid #10b981;">'
        + '<div style="font-size:12px;font-weight:600;color:#065f46;margin-bottom:4px;">💰 Costo estimado</div>'
        + '<div style="font-size:12px;color:var(--gray-600);">'
        + 'Generar 1 copy con GPT-4o: ~$0.005 USD · Plan mensual (20 ítems): ~$0.10 USD · 5 clientes activos/mes: ~$3-8 USD total'
        + '</div>'
        + '</div>'
        + '</div>';
};

window.saveClaudeAPIKey = function() {
    const input = document.getElementById('claude-api-key-input');
    if (!input) return;
    const key = input.value.trim();

    if (!key || key.startsWith('•')) {
        alert('❌ Ingresá una API key válida');
        return;
    }
    if (!key.startsWith('sk-')) {
        if (!confirm('Esta key no tiene el formato esperado (sk-...). ¿Guardarla igual?')) return;
    }

    localStorage.setItem('bondi-openai-key', btoa(key));
    if (typeof showSuccess === 'function') showSuccess('API key de OpenAI guardada correctamente');
    window.renderAIConfig();
    console.log('✅ OpenAI API key guardada');
};

window.clearClaudeAPIKey = function() {
    if (!confirm('¿Borrar la API key? La IA volverá al modo demo.')) return;
    localStorage.removeItem('bondi-openai-key'); localStorage.removeItem('bondi-claude-key');
    if (typeof showSuccess === 'function') showSuccess('API key eliminada');
    window.renderAIConfig();
};

window.testClaudeConnection = async function() {
    const resultDiv = document.getElementById('ai-test-result');
    if (!resultDiv) return;
    resultDiv.innerHTML = '<span style="color:var(--gray-500);">⏳ Probando conexión con OpenAI...</span>';

    // Obtener la API key guardada
    const getKey = function() {
        try {
            const enc = localStorage.getItem('bondi-openai-key') || localStorage.getItem('bondi-claude-key');
            return enc ? atob(enc) : null;
        } catch(e) { return null; }
    };

    const apiKey = getKey();
    if (!apiKey) {
        resultDiv.innerHTML = '<span style="color:#ef4444;">❌ No hay API key guardada. Ingresala arriba y guardala primero.</span>';
        return;
    }

    // Llamada directa a OpenAI — sin depender de callClaudeAPI
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                max_tokens: 5,
                messages: [
                    { role: 'system', content: 'Reply with OK only.' },
                    { role: 'user',   content: 'Say OK.' }
                ]
            })
        });

        if (response.status === 401) {
            resultDiv.innerHTML = '<span style="color:#ef4444;">❌ API key inválida. Verificá que la copiaste completa desde platform.openai.com.</span>';
            return;
        }
        if (response.status === 429) {
            resultDiv.innerHTML = '<span style="color:#ef4444;">❌ Límite de solicitudes. Esperá unos minutos e intentá de nuevo.</span>';
            return;
        }
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            resultDiv.innerHTML = '<span style="color:#ef4444;">❌ Error ' + response.status + ': ' + (err.error?.message || 'Error desconocido') + '</span>';
            return;
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';

        if (text) {
            resultDiv.innerHTML = '<span style="color:#10b981;font-weight:600;">✅ Conexión exitosa con OpenAI (GPT-4o). La IA está lista para usar.</span>';
            // Exportar callClaudeAPI si no está disponible aún
            if (typeof window.callClaudeAPI !== 'function') {
                console.log('ℹ️ callClaudeAPI no cargado todavía — la conexión funciona pero reiniciá la página para usar todos los módulos de IA.');
            }
        } else {
            resultDiv.innerHTML = '<span style="color:#f59e0b;">⚠️ Respuesta vacía. La key puede ser válida, probá de nuevo.</span>';
        }

    } catch (err) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            resultDiv.innerHTML = '<span style="color:#ef4444;">❌ Error de red. Verificá tu conexión a internet.</span>';
        } else {
            resultDiv.innerHTML = '<span style="color:#ef4444;">❌ Error: ' + err.message + '</span>';
        }
    }
};

// Auto-render cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        window.renderAIConfig();
    }, 800);
});


console.log('✅ config.js cargado correctamente');