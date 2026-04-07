// ==================================================
// LOGIN.JS - Bondi Media - CON ROLES DE USUARIO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const forgotLink = document.getElementById('forgotLink');
    const googleBtn = document.getElementById('googleBtn');
    const signupLink = document.getElementById('signupLink');
    const rememberCheck = document.getElementById('remember');

    // Verificar si ya hay sesión activa - PERO SOLO SI ESTAMOS EN LOGIN
    const currentUser = sessionStorage.getItem('bondi-current-user');
    
    // IMPORTANTE: Verificar que estamos en login.html antes de redirigir
    if (currentUser && window.location.pathname.includes('login.html')) {
        console.log('Sesión existente en login, redirigiendo al sistema');
        window.location.href = 'index.html';
        return;
    }

    // Cargar email guardado si existe
    const savedEmail = localStorage.getItem('bondi-email');
    const savedRemember = localStorage.getItem('bondi-remember');
    
    if (savedEmail && savedRemember === 'true') {
        emailInput.value = savedEmail;
        rememberCheck.checked = true;
    }

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = document.getElementById('toggleIcon');
            if (icon) {
                if (type === 'password') {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            }
        });
    }

    // Handle login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const remember = rememberCheck.checked;
            
            console.log('Intentando login:', email);
            
            // Validaciones
            if (!email || !password) {
                showError('Por favor completa todos los campos');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Por favor ingresa un email válido');
                return;
            }
            
            // Mostrar loading
            loginBtn.classList.add('loading');
            loginBtn.textContent = 'Iniciando sesión...';
            
            // Simular llamada a API
            setTimeout(() => {
                loginBtn.classList.remove('loading');
                
                let userRole = '';
                let userName = '';
                let userRoleName = '';
                let userPermissions = {};
                
                // Credenciales demo - admin por defecto
                if (email === 'demo@bondi.com' && password === 'bondi2026') {
                    console.log('Login exitoso (demo)');
                    userRole = 'admin';
                    userName = 'Usuario Demo';
                    userRoleName = 'Administrador';
                } else {
                    // Buscar en usuarios registrados
                    const users = JSON.parse(localStorage.getItem('bondi-users') || '[]');
                    const foundUser = users.find(u => u.email === email && u.password === password);
                    
                    if (foundUser) {
                        console.log('Login exitoso (usuario real):', foundUser.role);
                        userRole = foundUser.role;
                        userName = foundUser.name;
                        userRoleName = foundUser.roleName;
                        
                        // Si el usuario tiene permisos personalizados, los cargamos
                        if (foundUser.permissions) {
                            userPermissions = foundUser.permissions;
                        }
                    } else {
                        // Login fallido
                        console.log('Login fallido');
                        loginBtn.textContent = 'Iniciar sesión';
                        showError('Email o contraseña incorrectos');
                        
                        // Efecto de error en inputs
                        emailInput.style.borderColor = '#ef4444';
                        passwordInput.style.borderColor = '#ef4444';
                        
                        setTimeout(() => {
                            emailInput.style.borderColor = '';
                            passwordInput.style.borderColor = '';
                        }, 500);
                        return;
                    }
                }
                
                // Guardar en localStorage si "recordarme" está marcado
                if (remember) {
                    localStorage.setItem('bondi-remember', 'true');
                    localStorage.setItem('bondi-email', email);
                } else {
                    localStorage.removeItem('bondi-remember');
                    localStorage.removeItem('bondi-email');
                }
                
                // Guardar sesión actual en sessionStorage CON EL ROL
                sessionStorage.setItem('bondi-current-user', JSON.stringify({
                    email: email,
                    name: userName,
                    role: userRole,
                    roleName: userRoleName,
                    permissions: userPermissions,
                    loggedInAt: new Date().toISOString()
                }));
                
                // Mostrar éxito y redirigir al SISTEMA COMPLETO
                loginBtn.textContent = '✓ Bienvenido!';
                loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            }, 1500);
        });
    }

    // Función para mostrar errores
    function showError(message) {
        if (errorMessage) {
            const errorSpan = errorMessage.querySelector('span');
            if (errorSpan) {
                errorSpan.textContent = message;
            }
            errorMessage.style.display = 'flex';
            
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Forgot password - AHORA REDIRIGE A LA PÁGINA DE RECUPERACIÓN
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            // No hacer preventDefault, dejar que el href funcione
            console.log('Redirigiendo a recuperación de contraseña');
        });
    }

    // Google sign in
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            const originalText = googleBtn.innerHTML;
            googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
            googleBtn.disabled = true;
            
            setTimeout(() => {
                alert('Demo: Google Sign In - Funcionalidad en desarrollo');
                googleBtn.innerHTML = originalText;
                googleBtn.disabled = false;
            }, 1500);
        });
    }

    // Sign up
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            // No hacemos preventDefault, dejamos que el enlace funcione
            console.log('Redirigiendo a registro');
        });
    }

    // Focus en email al cargar
    setTimeout(() => {
        emailInput.focus();
    }, 100);
});