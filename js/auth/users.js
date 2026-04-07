// ==================================================
// USERS MANAGEMENT - SINCRONIZADO CON TEAM
// BUG FIX: SessionManager ahora usa sessionStorage en lugar de localStorage.
// Antes había DOS sistemas de sesión incompatibles:
//   - login.js guardaba en sessionStorage
//   - SessionManager (este archivo) guardaba en localStorage
// index.html verifica sessionStorage, así que los usuarios que se autenticaban
// via SessionManager nunca eran reconocidos por la protección de acceso.
// ==================================================
 
console.log('👤 Sistema de usuarios iniciado...');
 
const DEFAULT_USERS = [
    {
        id: 'user-1',
        email: 'admin@bondimedia.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin',
        roleName: 'Administrador',
        createdAt: new Date().toISOString()
    },
    {
        id: 'user-client-test',
        email: 'cliente@fitness.com',
        password: 'cliente123',
        name: 'Fitness Center',
        role: 'client',
        roleName: 'Gimnasio',
        createdAt: new Date().toISOString()
    },
    {
        id: 'user-client-2',
        email: 'burger@test.com',
        password: 'burger123',
        name: 'Burger House',
        role: 'client',
        roleName: 'Restaurante',
        createdAt: new Date().toISOString()
    },
    {
        id: 'user-client-3',
        email: 'studio@glow.com',
        password: 'glow123',
        name: 'Studio Glow',
        role: 'client',
        roleName: 'Estética',
        createdAt: new Date().toISOString()
    }
];
 
// ==================================================
// GESTIÓN DE USUARIOS (usa localStorage — correcto para persistir usuarios)
// ==================================================
const UserManager = {
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
    },
    save(users) {
        localStorage.setItem('bondi-users', JSON.stringify(users));
    },
    findByEmail(email) {
        return this.getAll().find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    validateCredentials(email, password) {
        const user = this.findByEmail(email);
        if (user && user.password === password) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    },
    create(userData) {
        const users = this.getAll();
        if (this.findByEmail(userData.email)) throw new Error('El email ya está registrado');
 
        const newUser = {
            id: 'user-' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        users.push(newUser);
        this.save(users);
 
        // Sincronizar con teamMembers
        if (window.teamMembers) {
            window.teamMembers.push({
                id: newUser.id, name: newUser.name, email: newUser.email,
                role: newUser.role, createdAt: newUser.createdAt, lastActive: null
            });
            localStorage.setItem(
                `team-members-${window.currentAccount || 'bondi-media'}`,
                JSON.stringify(window.teamMembers)
            );
        }
 
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },
    delete(userId) {
        const users = this.getAll().filter(u => u.id !== userId);
        this.save(users);
        if (window.teamMembers) {
            window.teamMembers = window.teamMembers.filter(m => m.id !== userId);
            localStorage.setItem(
                `team-members-${window.currentAccount || 'bondi-media'}`,
                JSON.stringify(window.teamMembers)
            );
        }
    },
    updateLastLogin(userId) {
        const users = this.getAll();
        const user = users.find(u => u.id === userId);
        if (user) {
            user.lastLogin = new Date().toISOString();
            this.save(users);
            if (window.teamMembers) {
                const member = window.teamMembers.find(m => m.id === userId);
                if (member) {
                    member.lastActive = new Date().toISOString();
                    localStorage.setItem(
                        `team-members-${window.currentAccount || 'bondi-media'}`,
                        JSON.stringify(window.teamMembers)
                    );
                }
            }
        }
    }
};
 
// ==================================================
// GESTIÓN DE SESIÓN — CORREGIDO: usa sessionStorage
// (mismo storage que usa login.js e index.html)
// ==================================================
const SessionManager = {
    setSession(user) {
        sessionStorage.setItem('bondi-current-user', JSON.stringify(user));
        // Token en sessionStorage también para consistencia
        sessionStorage.setItem('bondi-auth-token', 'token-' + Date.now());
    },
    getCurrentUser() {
        const user = sessionStorage.getItem('bondi-current-user');
        return user ? JSON.parse(user) : null;
    },
    isAuthenticated() {
        return !!this.getCurrentUser();
    },
    logout() {
        sessionStorage.removeItem('bondi-current-user');
        sessionStorage.removeItem('bondi-auth-token');
        window.location.href = 'login.html';
    },
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};
 
window.UserManager    = UserManager;
window.SessionManager = SessionManager;
 
console.log('✅ Sistema de usuarios listo');