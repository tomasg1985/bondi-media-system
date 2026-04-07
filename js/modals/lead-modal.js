// Ya está implementado en modules/leads.js
// Este archivo puede estar vacío o contener funciones específicas del modal

// ==================================================
// MODAL: LEADS
// ==================================================

function openAddLeadModal() {
    document.getElementById('lead-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('lead-modal').classList.add('active');
}

async function saveLead() {
    const lead = {
        id: Date.now(),
        date: document.getElementById('lead-date').value,
        name: document.getElementById('lead-name').value,
        source: document.getElementById('lead-source').value,
        keyword: document.getElementById('lead-keyword').value,
        status: document.getElementById('lead-status').value,
        value: parseInt(document.getElementById('lead-value').value) || 0
    };

    if (!appData.leads) appData.leads = [];
    appData.leads.push(lead);
    
    await storage.set(`bondi-leads-${currentAccount}`, appData.leads);

    if (typeof loadLeads === 'function') loadLeads();
    closeModal('lead-modal');
    document.getElementById('lead-modal').querySelector('form').reset();
    
    addNotification('Lead Agregado', `Nuevo lead: ${lead.name}`);
    alert('✅ Lead guardado');
}

// Exportar funciones
window.openAddLeadModal = openAddLeadModal;
window.saveLead = saveLead;