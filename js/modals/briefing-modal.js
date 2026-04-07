// Ya está implementado en modules/briefings.js
// Este archivo puede estar vacío

// ==================================================
// MODAL: BRIEFINGS
// ==================================================

function openAddBriefingModal() {
    const selector = document.getElementById('briefing-client');
    if (selector && window.accounts) {
        selector.innerHTML = '<option value="">Seleccionar cliente...</option>' +
            accounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
    }
    document.getElementById('briefing-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('briefing-modal').classList.add('active');
}

async function saveBriefing() {
    const briefing = {
        id: Date.now(),
        clientId: document.getElementById('briefing-client').value,
        type: document.getElementById('briefing-type').value,
        date: document.getElementById('briefing-date').value,
        objectives: document.getElementById('briefing-objectives').value,
        audience: document.getElementById('briefing-audience').value,
        competitors: document.getElementById('briefing-competitors').value,
        tone: document.getElementById('briefing-tone').value,
        notes: document.getElementById('briefing-notes').value,
        status: 'pending'
    };

    if (!window.briefings) window.briefings = [];
    briefings.push(briefing);
    
    await storage.set('bondi-briefings', briefings);

    if (typeof loadBriefings === 'function') loadBriefings();
    closeModal('briefing-modal');
    document.getElementById('briefing-modal').querySelector('form').reset();
    
    addNotification('Briefing Guardado', 'Nuevo briefing agregado');
    alert('✅ Briefing guardado');
}

// Exportar funciones
window.openAddBriefingModal = openAddBriefingModal;
window.saveBriefing = saveBriefing;