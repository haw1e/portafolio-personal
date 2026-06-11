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
