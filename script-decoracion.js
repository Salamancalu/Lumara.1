/* ==========================================================================
   LUMARA - SCRIPT INTEGRADO (CARRUSEL + FORMULARIO + MODAL)
   ========================================================================== */

const scriptURL = 'https://script.google.com/macros/s/AKfycbyXKoO1j0jB86l4303hx8iAHmaSDSlbwB7p09s8OtyvmfCqDyS-DnFpuV3d4gm1bo3w/exec';
const form = document.getElementById('lumara-form');
const modalExito = document.getElementById('modal-exito');

// --- 1. MOVIMIENTO AUTOMÁTICO DE CARRUSELES ---
document.addEventListener('DOMContentLoaded', () => {
    const carruseles = document.querySelectorAll('.lumara-carousel');

    carruseles.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const imagenes = track.querySelectorAll('img');
        let indiceActual = 0;

        function moverSiguiente() {
            indiceActual++;
            if (indiceActual >= imagenes.length) {
                indiceActual = 0;
            }
            const desplazamiento = -(indiceActual * 100);
            track.style.transform = `translateX(${desplazamiento}%)`;
        }

        // Cambia la imagen cada 3.5 segundos automáticamente
        setInterval(moverSiguiente, 2000);
    });
});

// --- 2. LÓGICA DEL FORMULARIO Y ENVÍO ---
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault(); // Evita que la página se recargue
        
        // Feedback visual en el botón
        const btn = document.getElementById('submit-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Enviando...';
        btn.disabled = true;

        fetch(scriptURL, { 
            method: 'POST', 
            body: new FormData(form),
            mode: 'no-cors' // Necesario para Google Apps Script
        })
        .then(() => {
            // Éxito: Restaurar botón, limpiar y mostrar ventana emergente
            btn.innerText = originalText;
            btn.disabled = false;
            form.reset(); 
            modalExito.style.display = 'flex'; // Muestra la ventana de Pedido Recibido
            
            // Ocultar sección de productos dinámica después del reset
            document.getElementById('productos-dinamicos').style.display = 'none';
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Hubo un error al enviar el pedido. Por favor, intenta de nuevo.');
            btn.innerText = originalText;
            btn.disabled = false;
        });
    });
}

// --- 3. FUNCIONES GLOBALES (CATEGORÍAS Y MODAL) ---

// Función para cerrar la ventana emergente
function cerrarModal() {
    modalExito.style.display = 'none';
}

// Función para mostrar productos según la categoría seleccionada
function showProducts(categoria) {
    const contenedorDinamico = document.getElementById('productos-dinamicos');
    
    // Si la categoría es válida, mostrar el contenedor
    if (categoria !== 'personalizada') {
        contenedorDinamico.style.display = 'block';
    } else {
        contenedorDinamico.style.display = 'none';
    }

    // Ocultar todas las listas de cantidades
    document.getElementById('list-decoracion').style.display = 'none';
    document.getElementById('list-eventos').style.display = 'none';
    document.getElementById('list-regalos').style.display = 'none';
    
    // Mostrar solo la lista que corresponde a la categoría
    const listId = 'list-' + categoria;
    const targetList = document.getElementById(listId);
    if (targetList) {
        targetList.style.display = 'block';
    }
}