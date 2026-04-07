// ==================================================
// PERMISSIONS.JS - Gestión de permisos por rol
// BUG FIX: Agregado rol 'editor' que faltaba. login.js asigna role:'editor'
// pero este archivo no lo tenía definido, haciendo que cualquier usuario
// editor cayera al fallback 'viewer' y perdiera todos sus permisos de edición.
// ==================================================
 
const ROLE_PERMISSIONS = {
    admin: {
        name: 'Administrador', icon: '👑',
        canViewDashboard: true, canEditContent: true, canDeleteContent: true,
        canCreateContent: true, canViewCalendar: true, canEditCalendar: true,
        canViewTracking: true, canEditTracking: true, canViewLeads: true,
        canEditLeads: true, canViewComparisons: true, canViewAnalysis: true,
        canViewBriefings: true, canEditBriefings: true, canViewReports: true,
        canGenerateReports: true, canViewConfig: true, canEditConfig: true,
        canManageUsers: true, canExportData: true, canImportData: true, canClearData: true
    },
    // NUEVO ROL: editor — coincide con lo que login.js asigna
    editor: {
        name: 'Editor', icon: '✏️',
        canViewDashboard: true, canEditContent: true, canDeleteContent: false,
        canCreateContent: true, canViewCalendar: true, canEditCalendar: true,
        canViewTracking: true, canEditTracking: true, canViewLeads: true,
        canEditLeads: true, canViewComparisons: true, canViewAnalysis: true,
        canViewBriefings: true, canEditBriefings: true, canViewReports: true,
        canGenerateReports: false, canViewConfig: false, canEditConfig: false,
        canManageUsers: false, canExportData: false, canImportData: false, canClearData: false
    },
    client: {
        name: 'Cliente', icon: '🏢',
        canViewDashboard: true, canEditContent: false, canDeleteContent: false,
        canCreateContent: false, canViewCalendar: true, canEditCalendar: false,
        canViewTracking: true, canEditTracking: false, canViewLeads: false,
        canEditLeads: false, canViewComparisons: true, canViewAnalysis: true,
        canViewBriefings: true, canEditBriefings: false, canViewReports: true,
        canGenerateReports: false, canViewConfig: false, canEditConfig: false,
        canManageUsers: false, canExportData: false, canImportData: false, canClearData: false
    },
    viewer: {
        name: 'Visualizador', icon: '👁️',
        canViewDashboard: true, canEditContent: false, canDeleteContent: false,
        canCreateContent: false, canViewCalendar: true, canEditCalendar: false,
        canViewTracking: true, canEditTracking: false, canViewLeads: false,
        canEditLeads: false, canViewComparisons: true, canViewAnalysis: true,
        canViewBriefings: true, canEditBriefings: false, canViewReports: true,
        canGenerateReports: false, canViewConfig: false, canEditConfig: false,
        canManageUsers: false, canExportData: false, canImportData: false, canClearData: false
    }
};
 
function getCurrentUser() {
    const userStr = sessionStorage.getItem('bondi-current-user');
    if (!userStr) return null;
    try { return JSON.parse(userStr); }
    catch (e) { console.error('Error al parsear usuario:', e); return null; }
}
 
function getUserPermissions() {
    const user = getCurrentUser();
    if (!user) return ROLE_PERMISSIONS.viewer;
    return ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.viewer;
}
 
function hasPermission(permission) {
    return getUserPermissions()[permission] || false;
}
 
function isAdmin()  { const u = getCurrentUser(); return u && u.role === 'admin';  }
function isEditor() { const u = getCurrentUser(); return u && u.role === 'editor'; }
function isClient() { const u = getCurrentUser(); return u && u.role === 'client'; }
function isViewer() { const u = getCurrentUser(); return u && u.role === 'viewer'; }
 
function getCurrentRoleName() {
    const user = getCurrentUser();
    return user ? (ROLE_PERMISSIONS[user.role]?.name || user.roleName || 'Visitante') : 'Visitante';
}
 
function getCurrentRoleIcon() {
    const user = getCurrentUser();
    if (!user) return '👁️';
    return ROLE_PERMISSIONS[user.role]?.icon || '👁️';
}
 
function getAccessibleSections() {
    const p = getUserPermissions();
    const sections = [];
    if (p.canViewDashboard)   sections.push('dashboard');
    if (p.canViewCalendar)    sections.push('calendar');
    if (p.canViewTracking)    sections.push('tracking');
    if (p.canViewLeads)       sections.push('leads');
    if (p.canViewComparisons) sections.push('comparisons');
    if (p.canViewAnalysis)    sections.push('analysis');
    if (p.canViewBriefings)   sections.push('briefings');
    if (p.canViewReports)     sections.push('reports');
    if (p.canViewConfig)      sections.push('config');
    return sections;
}
 
window.getCurrentUser      = getCurrentUser;
window.getUserPermissions  = getUserPermissions;
window.hasPermission       = hasPermission;
window.isAdmin             = isAdmin;
window.isEditor            = isEditor;
window.isClient            = isClient;
window.isViewer            = isViewer;
window.getCurrentRoleName  = getCurrentRoleName;
window.getCurrentRoleIcon  = getCurrentRoleIcon;
window.getAccessibleSections = getAccessibleSections;
 
console.log('✅ permissions.js cargado correctamente');