document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const sections = document.querySelectorAll('.section, .section-title');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Prevenir la selección de texto en elementos no editables
    function preventTextSelection() {
        const nonSelectableElements = document.querySelectorAll(
            'img, .logo-main, .navbar-logo img, .contact-logo, .nosotros-logo, ' +
            '.gallery-img, .contact-btn, .nosotros-logo-item, .nosotros-titulo h2, ' +
            '.navbar-menu, .nav-link, .btn, h1, h2, h3, h4, h5, h6, ' +
            '.gallery-link, .gallery-item, .video-container, .video-container iframe'
        );
        
        nonSelectableElements.forEach(element => {
            // Prevenir el comportamiento por defecto cuando se hace clic
            element.addEventListener('mousedown', function(e) {
                e.preventDefault();
            });
            
            // También prevenir el comportamiento de arrastrar
            element.addEventListener('dragstart', function(e) {
                e.preventDefault();
            });
        });
    }
    
    // Prevenir la selección específicamente en los logos y sus contenedores
    function preventLogoSelection() {
        // Seleccionar los logos y sus contenedores
        const logoElements = document.querySelectorAll('.logo-main, .contact-logo, #cix .column:first-child, .contact-content');
        
        logoElements.forEach(element => {
            // Evitar cualquier tipo de selección
            element.style.userSelect = 'none';
            element.style.webkitUserSelect = 'none';
            element.style.MozUserSelect = 'none';
            element.style.msUserSelect = 'none';
            
            if (element.tagName === 'IMG') {
                element.setAttribute('draggable', 'false');
            }
            
            // Eventos para evitar cualquier tipo de interacción que pueda causar selección
            element.addEventListener('mousedown', function(e) {
                e.preventDefault();
                return false;
            });
            
            element.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
            
            element.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
            });
            
            element.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Intento adicional para neutralizar cualquier comportamiento de selección
            element.addEventListener('click', function(e) {
                if (e.target === this || e.target.tagName === 'IMG') {
                    e.preventDefault();
                    // Desenfoque para evitar cualquier foco que pueda causar cursor
                    document.activeElement.blur();
                    return false;
                }
            });
        });
        
        // Asegurarse de que los botones sigan siendo clicables
        document.querySelectorAll('.contact-buttons a, .contact-btn').forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });
    }
    
    // Solución general para prevenir la selección en toda la página
    function preventGlobalSelection() {
        // Aplicar a todo el documento
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
        document.body.style.MozUserSelect = 'none';
        
        // Permitir selección en párrafos y en el footer (para SEO y usabilidad)
        const selectableElements = document.querySelectorAll('p, .footer, .footer-content, .footer-content p, .footer-info, .footer-contact, .footer-location');
        selectableElements.forEach(el => {
            el.style.userSelect = 'text';
            el.style.webkitUserSelect = 'text';
            el.style.msUserSelect = 'text';
            el.style.MozUserSelect = 'text';
            // Asegurar que el cursor de texto aparezca en el footer
            if (el.closest('.footer')) {
                el.style.cursor = 'auto';
            }
        });
        
        // Prevenir la selección en todo el documento excepto en el footer y párrafos
        document.addEventListener('selectstart', function(e) {
            const isFooter = e.target.closest('.footer') !== null;
            if (!isFooter && e.target.tagName !== 'P' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        });
        
        // Deshabilitar el cursor de texto en elementos que no deberían tenerlo
        // Excluir explícitamente cualquier elemento del footer
        const nonTextElements = document.querySelectorAll('img:not(.footer img), a:not(.footer a), button, .btn, .contact-btn, .navbar-logo, .logo-main, .contact-logo');
        nonTextElements.forEach(el => {
            if (!el.closest('.footer')) {
                el.style.cursor = 'default';
            }
        });
    }
    
    // Función para el menú móvil
    function setupMobileMenu() {
        const navMenu = document.querySelector('.navbar-menu');
        
        // Crear el botón hamburguesa si no existe
        let hamburger = document.querySelector('.hamburger');
        if (!hamburger) {
            hamburger = document.createElement('div');
            hamburger.classList.add('hamburger');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            document.querySelector('.navbar .container').appendChild(hamburger);
        }
        
        // Asegurarse de que el botón es visible en móvil
        hamburger.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        
        // Evento para mostrar/ocultar el menú al hacer clic en el botón hamburguesa
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Cerrar el menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Actualizar la visibilidad del botón hamburguesa al cambiar el tamaño de la ventana
        window.addEventListener('resize', function() {
            hamburger.style.display = window.innerWidth <= 768 ? 'block' : 'none';
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Función para resaltar el enlace de navegación activo
    function activeNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Función para animar elementos cuando entran en el viewport
    function animateOnScroll() {
        const elements = document.querySelectorAll('.column, .gallery-item, .mosaic-item, .extrema-item, .funnel-section, .contact-logo, .contact-btn, .contact-email, .title-miembros');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }
    
    // Función para configurar el modal de imágenes
    function setupImageModal() {
        const galleryLinks = document.querySelectorAll('.gallery-link');
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        const closeModal = document.querySelector('.close-modal');
        
        // Abrir modal al hacer clic en las imágenes
        galleryLinks.forEach(link => {
            link.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                modal.style.display = 'block';
                modalImg.src = imgSrc;
                document.body.style.overflow = 'hidden';  // Prevenir scroll cuando el modal está abierto
            });
        });
        
        // Cerrar modal con el botón X
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';  // Restaurar scroll
        });
        
        // Cerrar modal con clic fuera de la imagen
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';  // Restaurar scroll
            }
        });
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';  // Restaurar scroll
            }
        });
    }
    
    // Forzar recarga de imagen de fondo
    function forceBackgroundReload() {
        const nosotrosSection = document.getElementById('nosotros');
        if (nosotrosSection) {
            // Forzar recarga aplicando el estilo directamente
            nosotrosSection.style.backgroundImage = "url('images/b5.png?" + new Date().getTime() + "')";
            nosotrosSection.style.backgroundSize = 'cover';
            nosotrosSection.style.backgroundPosition = 'center';
            nosotrosSection.style.backgroundRepeat = 'no-repeat';
            
            console.log('Fondo actualizado para la sección Nosotros');
        }
    }
    
    // Inicializar
    function init() {
        setupMobileMenu();
        setupImageModal();
        preventTextSelection();
        preventLogoSelection();
        preventGlobalSelection();
        forceBackgroundReload(); // Forzar recarga de imagen de fondo
        window.addEventListener('scroll', activeNavLink);
        window.addEventListener('scroll', animateOnScroll);
        
        // Desplazamiento suave para enlaces
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Trigger initial animation
        setTimeout(animateOnScroll, 300);
    }
    
    // Cargar FontAwesome alternativamente
    function loadFontAwesome() {
        const faScript = document.querySelector('script[src*="fontawesome"]');
        if (faScript && faScript.crossOrigin) {
            // Si el script original falla, cargar desde CDN alternativo
            faScript.addEventListener('error', function() {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
                document.head.appendChild(link);
            });
        } else {
            // Si no hay script, cargar directamente
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
            document.head.appendChild(link);
        }
    }
    
    loadFontAwesome();
    init();
}); 