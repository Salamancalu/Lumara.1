// 1. CONFIGURACIÓN DE LA URL (TU WEB APP DE GOOGLE)
const scriptURL = 'https://script.google.com/macros/s/AKfycbx1d44pzc7KyawzvHtVER8MfPm99BJiaOLAhlZBDmTTecFoL5KiZZFDI8wu2aAopssW0g/exec';

// Seleccionamos los elementos del DOM
const form = document.getElementById('lumara-form');
const btn = document.querySelector('.btn-submit');

/**
 * FUNCIÓN: showProducts
 * Muestra las listas de productos según la categoría seleccionada
 */
function showProducts(category) {
    const container = document.getElementById('productos-dinamicos');
    
    // Si la categoría es "personalizada", ocultamos el bloque de selección de velas
    if (category === 'personalizada') {
        container.style.display = 'none';
    } else {
        container.style.display = 'block';
    }

    // Ocultamos todas las listas primero
    const lists = ['list-decoracion', 'list-eventos', 'list-regalos'];
    lists.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Mostramos solo la lista que corresponde a la categoría
    const target = document.getElementById('list-' + category);
    if (target) {
        target.style.display = 'block';
    }
}

/**
 * EVENTO: submit
 * Procesa el envío de datos a Google Sheets y Correo
 */
form.addEventListener('submit', e => {
    e.preventDefault(); // Evita que la página se refresque al enviar
    
    // Bloqueamos el botón para evitar múltiples clics
    btn.disabled = true;
    btn.innerText = 'Enviando pedido...';

    // Construimos el resumen del pedido revisando los inputs de número
    let resumenPedido = "";
    const inputsCantidades = form.querySelectorAll('input[type="number"]');
    
    inputsCantidades.forEach(input => {
        const cantidad = parseInt(input.value);
        if (cantidad > 0) {
            // Obtenemos el nombre del producto desde el <span> hermano
            let nombreProducto = input.previousElementSibling.innerText;
            resumenPedido += `${nombreProducto}: ${cantidad} und | `;
        }
    });

    // Preparamos los datos del formulario
    const formData = new FormData(form);
    
    // Agregamos manualmente el resumen del pedido a los datos que enviaremos
    formData.append('resumen_pedido', resumenPedido);

    // Envío de datos mediante Fetch API
    fetch(scriptURL, { 
        method: 'POST', 
        body: formData,
        mode: 'no-cors' // Google Script requiere este modo para evitar bloqueos de seguridad
    })
    .then(() => {
        // Al usar no-cors, asumimos éxito si la promesa se resuelve
        alert('¡Excelente! Tu pedido ha sido registrado en el Excel de Lumara y enviado por correo.');
        
        // Limpiamos el formulario y reseteamos la vista
        form.reset();
        document.getElementById('productos-dinamicos').style.display = 'none';
        
        btn.disabled = false;
        btn.innerText = 'Enviar Pedido';
    })
    .catch(error => {
        console.error('Error en el envío:', error);
        alert('Hubo un error técnico. Por favor, intenta de nuevo o contáctanos por WhatsApp.');
        
        btn.disabled = false;
        btn.innerText = 'Reintentar Envío';
    });
});