// ==================================================
// SELECTOR DE IDIOMAS - VERSIÓN CORREGIDA
// ==================================================

(function() {
    'use strict';
    
    console.log('🔤 Inicializando selector de idiomas...');
    
    function initLanguageSelector() {
        const dropdownBtn = document.getElementById('languageDropdownBtn');
        const dropdown = document.getElementById('languageDropdown');
        
        if (!dropdownBtn) {
            console.log('⏳ Esperando selector de idiomas...');
            setTimeout(initLanguageSelector, 500);
            return;
        }
        
        console.log('✅ Selector de idiomas encontrado');
        
        const options = document.querySelectorAll('.language-option');
        
        // Configurar según idioma actual
        const currentLang = window.i18n?.currentLang || 'es';
        
        // Marcar opción activa
        options.forEach(opt => {
            if (opt.dataset.lang === currentLang) {
                opt.classList.add('active');
                opt.querySelector('.check-icon').textContent = '✓';
                
                // Actualizar botón
                const flag = opt.dataset.flag;
                const name = opt.querySelector('.language-name').textContent;
                dropdownBtn.querySelector('.selected-language').innerHTML = `
                    <span class="flag-icon">${flag}</span>
                    <span class="language-name">${name}</span>
                `;
            } else {
                opt.classList.remove('active');
                opt.querySelector('.check-icon').textContent = '';
            }
        });
        
        // Toggle dropdown
        dropdownBtn.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.classList.toggle('active');
            dropdown.classList.toggle('show');
        };
        
        // Seleccionar idioma
        options.forEach(option => {
            option.onclick = function(e) {
                e.stopPropagation();
                
                const lang = this.dataset.lang;
                const flag = this.dataset.flag;
                const name = this.querySelector('.language-name').textContent;
                
                console.log('Idioma seleccionado:', lang);
                
                // Actualizar botón
                dropdownBtn.querySelector('.selected-language').innerHTML = `
                    <span class="flag-icon">${flag}</span>
                    <span class="language-name">${name}</span>
                `;
                
                // Actualizar checks
                options.forEach(opt => {
                    opt.classList.remove('active');
                    opt.querySelector('.check-icon').textContent = '';
                });
                this.classList.add('active');
                this.querySelector('.check-icon').textContent = '✓';
                
                // Cerrar dropdown
                dropdownBtn.classList.remove('active');
                dropdown.classList.remove('show');
                
                // Cambiar idioma
                if (window.changeLanguage) {
                    window.changeLanguage(lang);
                }
            };
        });
        
        // Cerrar al hacer clic fuera
        document.onclick = function(e) {
            if (!dropdownBtn.contains(e.target)) {
                dropdownBtn.classList.remove('active');
                dropdown.classList.remove('show');
            }
        };
        
        console.log('✅ Selector de idiomas listo');
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSelector);
    } else {
        initLanguageSelector();
    }
    
    // Backup
    setTimeout(initLanguageSelector, 1000);
})();