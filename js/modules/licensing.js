/**
 * ==================================================
 * LICENSING.JS - Lógica de Planes y Licencias
 * ==================================================
 */

const DEFAULT_PLANS = {
    'basic': {
        id: 'basic',
        name: 'Bondi Esencial',
        price: '49',
        currency: 'USD',
        features: [
            '1 Cuenta de Cliente',
            'Calendario de Contenidos Básico',
            'Asistente IA Estándar',
            'Soporte por Email'
        ],
        limits: { accounts: 1, aiExperts: false, customBranding: false }
    },
    'growth': {
        id: 'growth',
        name: 'Bondi Crecimiento',
        price: '99',
        currency: 'USD',
        recommended: true,
        features: [
            'Hasta 5 Cuentas de Clientes',
            'Todos los Expertos IA (Filmmaker, Guionista, etc.)',
            'Analíticas de Rendimiento',
            'Soporte Prioritario'
        ],
        limits: { accounts: 5, aiExperts: true, customBranding: false }
    },
    'agency': {
        id: 'agency',
        name: 'Bondi Dominio',
        price: '199',
        currency: 'USD',
        features: [
            'Cuentas de Clientes Ilimitadas',
            'IA Ilimitada con Memoria de Marca',
            'Marca Blanca (Logos Personalizados)',
            'Gestión de Colaboradores'
        ],
        limits: { accounts: 999, aiExperts: true, customBranding: true }
    },
    'demo': {
        id: 'demo',
        name: 'Pase Demo',
        price: '0',
        currency: 'USD',
        features: [
            'Acceso Total por tiempo limitado',
            'Probar todos los Expertos IA',
            'Configuración de 1 Cliente real'
        ],
        limits: { accounts: 1, aiExperts: true, customBranding: false, isDemo: true }
    }
};

class LicensingManager {
    constructor() {
        this.storageKey = 'bondi-licensing-data';
        this.plansKey = 'bondi-licensing-plans';
        this.plans = this.loadPlans();
        this.data = this.loadData();
        this.syncLicensePlanNames();
    }

    syncLicensePlanNames() {
        if (!this.data || !this.data.licenses) return;
        let updated = false;

        Object.entries(this.data.licenses).forEach(([userId, license]) => {
            if (!license || !license.planId) return;
            const plan = this.plans[license.planId];
            if (plan && license.planName !== plan.name) {
                license.planName = plan.name;
                updated = true;
            }
        });

        if (updated) {
            // Guardar sólo si encontramos licencias desincronizadas
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            window.dispatchEvent(new CustomEvent('licensing-updated'));
        }
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.deletedLicenses) parsed.deletedLicenses = [];
            return parsed;
        }
        return {
            licenses: {},
            deletedLicenses: [],
            settings: { defaultDemoDays: 14 }
        };
    }

    getAll() {
        const usersStr = localStorage.getItem('bondi-users');
        if (usersStr !== null) {
            try {
                const users = JSON.parse(usersStr);
                if (Array.isArray(users)) return users;
            } catch (e) {
                console.warn('Error parsing bondi-users:', e);
            }
        }
        return [...DEFAULT_USERS];
    }

    loadPlans() {
        const saved = localStorage.getItem(this.plansKey);
        if (saved) return JSON.parse(saved);
        return { ...DEFAULT_PLANS };
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        // Disparar evento de actualización global
        window.dispatchEvent(new CustomEvent('licensing-updated'));
    }

    savePlans() {
        localStorage.setItem(this.plansKey, JSON.stringify(this.plans));
        this.syncLicensePlanNames();
        window.dispatchEvent(new CustomEvent('plans-updated'));
    }

    // GESTIÓN DE PLANES (ADMIN)
    createPlan(planData) {
        const id = planData.id || 'plan-' + Date.now();
        this.plans[id] = { ...planData, id };
        this.savePlans();
        return id;
    }

    deletePlan(planId) {
        if (this.plans[planId]) {
            delete this.plans[planId];
            this.savePlans();
            return true;
        }
        return false;
    }

    // GESTIÓN DE LICENCIAS
    assignPlan(userId, planId, days = 30, customData = {}) {
        const plan = this.plans[planId];
        if (!plan) return false;

        const now = new Date();
        const expiry = new Date();
        expiry.setDate(now.getDate() + days);
        expiry.setHours(23, 59, 59, 999); // Final del día local

        this.data.licenses[userId] = {
            planId: planId,
            planName: plan.name,
            startDate: now.toISOString(),
            expiryDate: customData.expiryDate || expiry.toISOString(),
            isDemo: plan.limits.isDemo || false,
            active: true,
            status: customData.status || (plan.limits.isDemo ? 'demo' : 'active'),
            price: customData.price || plan.price,
            subscriptionType: customData.subscriptionType || 'monthly',
            updatedAt: now.toISOString()
        };

        this.saveData();
        return true;
    }

    removeLicense(userId) {
        if (!this.data.deletedLicenses) this.data.deletedLicenses = [];
        if (this.data.licenses[userId]) {
            delete this.data.licenses[userId];
        }
        if (!this.data.deletedLicenses.includes(userId)) {
            this.data.deletedLicenses.push(userId);
        }
        this.saveData();
        window.dispatchEvent(new CustomEvent('licensing-updated'));
        return true;
    }

    updateLicense(userId, updateData) {
        if (!this.data.licenses[userId]) return false;
        
        this.data.licenses[userId] = {
            ...this.data.licenses[userId],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        // Sincronizar planId con nombre si cambió
        if (updateData.planId) {
            const plan = this.plans[updateData.planId];
            if (plan) this.data.licenses[userId].planName = plan.name;
        }

        this.saveData();
        return true;
    }

    revokeLicense(userId) {
        if (this.data.licenses[userId]) {
            delete this.data.licenses[userId];
            this.saveData();
            return true;
        }
        return false;
    }

    getUserLicense(userId) {
        // HIDE ADMIN PLAN: Si es admin, no devolvemos licencia para que no aparezca el badge
        const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
        if (currentUser && currentUser.id === userId && currentUser.role === 'admin') {
            return null; // Cambiado de 'agency' a null
        }

        const license = this.data.licenses[userId];
        if (!license) return null;

        const plan = this.plans[license.planId];
        if (plan && license.planName !== plan.name) {
            license.planName = plan.name;
            this.saveData();
        }

        // Verificar expiración
        const now = new Date();
        const expiry = new Date(license.expiryDate);
        if (now > expiry) {
            license.active = false;
        }

        return license;
    }

    getRemainingDays(userId) {
        const license = this.getUserLicense(userId);
        if (!license || license.isInfinite) return 999;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizar a medianoche local
        
        const expiryDate = new Date(license.expiryDate);
        expiryDate.setHours(0, 0, 0, 0); // Normalizar a medianoche local
        
        const diff = expiryDate.getTime() - today.getTime();
        const days = Math.round(diff / (1000 * 3600 * 24));
        
        return Math.max(0, days);
    }

    seedDemoUser() {
        if (window.UserManager) {
            let users = window.UserManager.getAll();
            
            // Forzar creación de clientes de prueba si no existen en localStorage
            const testEmail = 'cliente@fitness.com';
            if (!users.find(u => u.email === testEmail)) {
                console.log('🌱 Forzando creación de clientes de prueba...');
                try {
                    window.UserManager.create({
                        id: 'user-client-test',
                        email: 'cliente@fitness.com',
                        password: 'cliente123',
                        name: 'Fitness Center',
                        role: 'client',
                        roleName: 'Gimnasio'
                    });
                    window.UserManager.create({
                        id: 'user-client-2',
                        email: 'burger@test.com',
                        password: 'burger123',
                        name: 'Burger House',
                        role: 'client',
                        roleName: 'Restaurante'
                    });
                } catch(e) {}
                users = window.UserManager.getAll();
            }

            const deleted = this.data.deletedLicenses || [];
            const testClients = users.filter(u => u.role === 'client');
            testClients.forEach(target => {
                if (!this.data.licenses[target.id] && !deleted.includes(target.id)) {
                    console.log('🌱 Seed: Asignando demo a', target.name);
                    this.assignPlan(target.id, 'demo', 14);
                }
            });
        }
    }
}

// Inicializar y exportar
window.Licensing = new LicensingManager();
window.BONDI_PLANS = window.Licensing.plans;

// Seed inmediato (100ms) al iniciar
setTimeout(() => {
    if (window.Licensing) window.Licensing.seedDemoUser();
}, 100);
