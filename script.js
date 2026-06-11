// Variables para manejar la ventana más al frente
let highestZIndex = 10;

// Variables para el pop-up retro
let adPopupShown = { 'window-movego': false, 'window-spinzone': false };
let adPopupTimer = null;

function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.add('active');
        // Traer al frente
        highestZIndex++;
        win.style.zIndex = highestZIndex;
        
        // Quitar la selección del resto de iconos
        document.querySelectorAll('.desktop-icon, .folder-icon').forEach(icon => icon.classList.remove('selected'));

        // Lógica del Pop-up publicitario
        if ((id === 'window-movego' || id === 'window-spinzone') && !adPopupShown[id]) {
            clearTimeout(adPopupTimer);
            adPopupTimer = setTimeout(() => {
                showAdPopup(id);
            }, 2500);
        }
    }
}

function showAdPopup(sourceId) {
    const popup = document.getElementById('window-ad-popup');
    const adLink = document.getElementById('ad-link');
    
    if (popup && adLink) {
        if (sourceId === 'window-spinzone') {
            adLink.href = 'https://github.com/lucassmelendez/SZFrontend';
        } else if (sourceId === 'window-movego') {
            adLink.href = 'https://github.com/justinseron/MoveGo';
        }
        
        adPopupShown[sourceId] = true;
        popup.classList.add('active');
        highestZIndex++;
        popup.style.zIndex = highestZIndex;
    }
}

function closeAdPopup() {
    const popup = document.getElementById('window-ad-popup');
    if (popup) {
        popup.classList.remove('active');
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.remove('active');
        
        // Resetear el estado del popup si se cierra el archivo de texto
        if (id === 'window-movego' || id === 'window-spinzone') {
            adPopupShown[id] = false;
            clearTimeout(adPopupTimer); // Evitar que aparezca si se cierra antes de los 2.5s
        }
    }
}

// Lógica para que las ventanas se puedan arrastrar desde la barra de título
document.addEventListener('DOMContentLoaded', () => {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(win => {
        const titleBar = win.querySelector('.title-bar');
        
        // Enfocar ventana al hacer clic o tocar
        const bringToFront = () => {
            highestZIndex++;
            win.style.zIndex = highestZIndex;
        };
        win.addEventListener('mousedown', bringToFront);
        win.addEventListener('touchstart', bringToFront, { passive: true });

        if (titleBar) {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            const startDrag = (e) => {
                // No arrastrar si se hizo clic en los controles (la 'X')
                if (e.target.closest('.title-bar-controls')) return;

                isDragging = true;
                const touch = e.type.includes('touch') ? e.touches[0] : e;
                startX = touch.clientX;
                startY = touch.clientY;
                
                // Obtener posiciones iniciales
                const rect = win.getBoundingClientRect();
                
                // Limpiar reglas que bloquean el movimiento (ej. la de contacto)
                win.style.setProperty('bottom', 'auto', 'important');
                win.style.setProperty('right', 'auto', 'important');
                win.style.setProperty('transform', 'none', 'important');
                
                win.style.left = rect.left + 'px';
                win.style.top = rect.top + 'px';
                
                initialLeft = rect.left;
                initialTop = rect.top;
            };

            const doDrag = (e) => {
                if (!isDragging) return;
                
                const touch = e.type.includes('touch') ? e.touches[0] : e;
                const dx = touch.clientX - startX;
                const dy = touch.clientY - startY;
                
                // Si es un dispositivo móvil, bloquear el movimiento en X
                if (window.innerWidth <= 768) {
                    win.style.setProperty('left', '50%', 'important');
                    win.style.setProperty('transform', 'translateX(-50%)', 'important');
                    win.style.setProperty('top', `${initialTop + dy}px`, 'important');
                } else {
                    win.style.left = `${initialLeft + dx}px`;
                    win.style.top = `${initialTop + dy}px`;
                }
                
                // Prevenir seleccionar texto o hacer scroll nativo por accidente
                if (e.cancelable) e.preventDefault();
            };

            const endDrag = () => {
                isDragging = false;
            };

            titleBar.addEventListener('mousedown', startDrag);
            titleBar.addEventListener('touchstart', startDrag, { passive: false });

            document.addEventListener('mousemove', doDrag);
            document.addEventListener('touchmove', doDrag, { passive: false });

            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        }
    });

    // Añadir efecto visual de selección a los iconos
    const icons = document.querySelectorAll('.desktop-icon, .folder-icon');
    icons.forEach(icon => {
        icon.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            // Deseleccionar los hermanos en el mismo contenedor
            const container = icon.parentElement;
            container.querySelectorAll('.desktop-icon, .folder-icon').forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
        });
    });

    // Clic en el escritorio quita selección de todo
    document.getElementById('desktop').addEventListener('mousedown', () => {
        document.querySelectorAll('.desktop-icon, .folder-icon').forEach(i => i.classList.remove('selected'));
    });
});

// Lógica de Traducción
let currentLanguage = 'es';

const translations = {
    es: {
        icon_about: "Sobre mí",
        icon_projects: "Mis Proyectos",
        icon_contact: "Contacto",
        title_about: "Sobre mí",
        about_p1_start: "Soy estudiante de Ingeniería en Informática de séptimo semestre. Me destaco como desarrollador de software con interés particular en la ciberseguridad, cuento con certificaciones tales como ",
        about_p1_end: ", también me destaco en el desarrollo de aplicaciones y sitios web.",
        stack_legend: "Stack Tecnológico",
        stack_and_more: "y demás",
        title_projects: "Mis Proyectos",
        menu_file: "<u>A</u>rchivo",
        menu_edit: "<u>E</u>ditar",
        menu_view: "<u>V</u>er",
        menu_help: "A<u>y</u>uda",
        panel_all_folders: "Todas las Carpetas",
        panel_contents: "Contenido de 'Mis Proyectos'",
        tree_desktop: "Escritorio",
        tree_mypc: "Mi PC",
        tree_projects: "Mis Proyectos",
        status_objs: "3 objeto(s)",
        status_space: "969KB (Espacio libre en disco: 40.8MB)",
        title_movego: "MoveGo.txt - Bloc de notas",
        movego_desc: "Sistema de movilización y gestión de rutas enfocada en los estudiantes de DuocUC.",
        title_spinzone: "SpinZone.txt - Bloc de notas",
        spinzone_desc: "Sitio E-Commerce completo especializado en la venta de productos de tenis de mesa.",
        title_asistenciapp: "AsistenciApp.txt - Bloc de notas",
        asistenciapp_desc: "Aplicación centrada en el manejo de asistencia para las empresas, con funcionalidades de ingreso y salida a través de QR.",
        title_contact: "Contacto",
        contact_desc: "¿Interesado en trabajar conmigo?",
        dialog_title: "Language_Setup.exe",
        translate_msg: "¿Deseas traducir todo el contenido de la página? / Do you wish to translate the page content?",
        btn_yes: "Sí (Yes)",
        btn_no: "No",
        ad_title: "¡FELICIDADES!",
        ad_btn: "VISUALIZAR README"
    },
    en: {
        icon_about: "About me",
        icon_projects: "My Projects",
        icon_contact: "Contact",
        title_about: "About me",
        about_p1_start: "I am a seventh-semester Computer Engineering student. I stand out as a software developer with a particular interest in cybersecurity. I have certifications such as ",
        about_p1_end: ", and I also excel in developing applications and websites.",
        stack_legend: "Tech Stack",
        stack_and_more: "and more",
        title_projects: "My Projects",
        menu_file: "<u>F</u>ile",
        menu_edit: "<u>E</u>dit",
        menu_view: "<u>V</u>iew",
        menu_help: "<u>H</u>elp",
        panel_all_folders: "All Folders",
        panel_contents: "Contents of 'My Projects'",
        tree_desktop: "Desktop",
        tree_mypc: "My PC",
        tree_projects: "My Projects",
        status_objs: "3 object(s)",
        status_space: "969KB (Disk free space: 40.8MB)",
        title_movego: "MoveGo.txt - Notepad",
        movego_desc: "Routing and mobilization system focused on DuocUC students.",
        title_spinzone: "SpinZone.txt - Notepad",
        spinzone_desc: "Complete E-Commerce site specialized in the sale of table tennis products.",
        title_asistenciapp: "AsistenciApp.txt - Notepad",
        asistenciapp_desc: "Application focused on attendance management for companies, with QR code entry and exit functionalities.",
        title_contact: "Contact",
        contact_desc: "Interested in working with me?",
        dialog_title: "Language_Setup.exe",
        translate_msg: "Do you wish to translate the page content to Spanish? / ¿Deseas traducir el contenido a Español?",
        btn_yes: "Yes",
        btn_no: "No",
        ad_title: "CONGRATULATIONS!",
        ad_btn: "VIEW README"
    }
};

function toggleLanguage() {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    
    document.querySelectorAll('[data-i18n-key]').forEach(elem => {
        const key = elem.getAttribute('data-i18n-key');
        if (translations[currentLanguage][key]) {
            elem.innerHTML = translations[currentLanguage][key];
        }
    });
}
