document.addEventListener('DOMContentLoaded', () => {
    // 1. LEER la "maleta" del localStorage
    const jsonCarrito = localStorage.getItem('carritoLumara');
    const carrito = JSON.parse(jsonCarrito) || [];

    const contenedor = document.getElementById('resumen-productos');
    const subtotalTxt = document.getElementById('resumen-subtotal');
    const totalTxt = document.getElementById('resumen-total');

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay velas en tu pedido.</p>";
        return;
    }

    let subtotalCalculado = 0;
    let html = "";

    // 2. CONSTRUIR la lista visual
    carrito.forEach((item) => {
        const itemTotal = item.precio * item.cantidad;
        subtotalCalculado += itemTotal;

        html += `
            <div class="checkout-item" style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <img src="${item.imagen}" style="width:50px; border-radius:5px;">
                <div style="flex:1; margin-left:15px;">
                    <strong style="display:block;">${item.nombre}</strong>
                    <small>Aroma: ${item.aroma || 'No elegido'}</small> <br>
                    <small>Cant: ${item.cantidad}</small>
                </div>
                <strong>$ ${itemTotal.toLocaleString('es-CO')}</strong>
            </div>
        `;
    });

    // 3. INYECTAR los datos
    contenedor.innerHTML = html;
    subtotalTxt.innerText = `$ ${subtotalCalculado.toLocaleString('es-CO')}`;

    // Sumar envío (ejemplo $10.000)
    const envio = 10000;
    totalTxt.innerText = `$ ${(subtotalCalculado + envio).toLocaleString('es-CO')}`;
});

// 4. ADICIÓN: Capturar el envío del formulario y mandarlo a WhatsApp
document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que la página se recargue

    // A. OBTENER los datos del formulario (Datos Personales y de Entrega)
    const formData = new FormData(this);
    const nombre = formData.get('nombre') + " " + formData.get('apellido');
    const telefono = formData.get('tel1');
    const email = formData.get('email');
    const radioFactura = document.querySelector('input[name="factura"]:checked');
    const factura = radioFactura ? (radioFactura.value === 'si' ? 'Sí, con factura' : 'No, sin factura') : 'No especificado';
    const depto = formData.get('departamento');
    const municipio = formData.get('municipio');
    const direccion = formData.get('direccion');
    const barrio = formData.get('barrio');
    const observaciones = formData.get('observaciones') || 'Ninguna';

    // Obtener el valor del envío seleccionado (Bogotá u Otro)
    const costoEnvio = parseInt(formData.get('envio')) || 0;
    const metodoEnvio = costoEnvio > 0 ? 'Estándar Bogotá' : 'Contra entrega (Fuera de Bogotá)';

    // B. LEER el carrito nuevamente para tener los productos actualizados
    const jsonCarrito = localStorage.getItem('carritoLumara');
    const carrito = JSON.parse(jsonCarrito) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // C. CONSTRUIR el mensaje de WhatsApp
    let mensaje = ` *NUEVO PEDIDO - LUMARA Colombia* \n\n`;
    mensaje += `*--- Datos Personales ---*\n`;
    mensaje += ` Nombre: ${nombre}\n`;
    mensaje += ` Teléfono: ${telefono}\n`;
    mensaje += ` Email: ${email}\n\n`;
    mensaje += `*--- Datos de Entrega ---*\n`;
    mensaje += ` Ubicación: ${municipio}, ${depto}\n`;
    mensaje += ` Dirección: ${direccion}\n`;
    mensaje += ` Barrio: ${barrio}\n`;
    mensaje += ` Método: ${metodoEnvio}\n`;
    mensaje += ` Obs: ${observaciones}\n\n`;
    mensaje += `*Factura: ${factura}*\n\n`;

    mensaje += `*--- Detalle del Pedido ---*\n`;

    let subtotal = 0;
    carrito.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;
        mensaje += `${index + 1}. ${item.nombre} (x${item.cantidad})\n`;
        mensaje += `  Aroma: ${item.aroma || 'Default'}\n`;
        mensaje += `  $ ${itemTotal.toLocaleString('es-CO')}\n`;
    });

    const totalFinal = subtotal + costoEnvio;

    mensaje += `\n*-------------------------*\n`;
    mensaje += `Subtotal: $ ${subtotal.toLocaleString('es-CO')}\n`;
    mensaje += `Envío: $ ${costoEnvio.toLocaleString('es-CO')}\n`;
    mensaje += `*TOTAL A PAGAR: $ ${totalFinal.toLocaleString('es-CO')} `;

    // D. ENVIAR el mensaje a WhatsApp
    // Reemplaza con tu número de teléfono de Lumara (ejemplo: 573001234567)
    const numeroWhatsApp = '573114916142';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // Opcional: Vaciar el carrito después de enviar
    localStorage.removeItem('carritoLumara');

    // Abre WhatsApp en una nueva pestaña
    window.open(url, '_blank').focus();
});

