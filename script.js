// Variables para manejar la ventana más al frente
let highestZIndex = 10;

function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.add('active');
        // Traer al frente
        highestZIndex++;
        win.style.zIndex = highestZIndex;
        
        // Quitar la selección del resto de iconos
        document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.remove('active');
    }
}

// Lógica para que las ventanas se puedan arrastrar desde la barra de título
document.addEventListener('DOMContentLoaded', () => {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(win => {
        const titleBar = win.querySelector('.title-bar');
        
        // Enfocar ventana al hacer clic
        win.addEventListener('mousedown', () => {
            highestZIndex++;
            win.style.zIndex = highestZIndex;
        });

        if (titleBar) {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            titleBar.addEventListener('mousedown', (e) => {
                // No arrastrar si se hizo clic en los controles (la 'X')
                if (e.target.closest('.title-bar-controls')) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                
                // Obtener posiciones iniciales (transformar los que tienen translate a px absolutos)
                const rect = win.getBoundingClientRect();
                
                // Si la ventana está centrada con transform
                if (win.style.transform !== 'none' && win.style.transform !== '') {
                    win.style.transform = 'none';
                    win.style.left = rect.left + 'px';
                    win.style.top = rect.top + 'px';
                }
                
                initialLeft = win.offsetLeft;
                initialTop = win.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                win.style.left = `${initialLeft + dx}px`;
                win.style.top = `${initialTop + dy}px`;
                
                // Prevenir seleccionar texto mientras se arrastra
                e.preventDefault();
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }
    });

    // Añadir efecto visual de selección a los iconos
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
        icon.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            icons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
        });
    });

    // Clic en el escritorio quita selección
    document.getElementById('desktop').addEventListener('mousedown', () => {
        icons.forEach(i => i.classList.remove('selected'));
    });
});
