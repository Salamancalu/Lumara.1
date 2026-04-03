
// 1. Inicialización del Carrito (Carga lo que haya en memoria o empieza vacío)
let carrito = JSON.parse(localStorage.getItem('carritoLumara')) || [];

// 2. Configuración de Aromas Disponibles (Basado en tu HTML)
const AROMAS_DISPONIBLES = [
    "Mango", "Coco", "Chocolate", "Frutos rojos", "Fresas con chocolate",
    "Sándalo", "Bambú", "Galleta", "Vainilla", "Coco vainilla",
    "Lavanda", "Jazmín", "Maracuyá", "Canela", "Baby"
];

// 3. Capturar clics en los botones de "Agregar al carrito"
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-agregar')) {
        const btn = e.target;

        // Creamos el objeto del producto extrayendo los datos de tus data-attributes
        const nuevoProducto = {
            id: btn.dataset.id + Date.now(), // ID único para permitir misma vela con diferente aroma
            nombre: btn.dataset.nombre,
            precio: parseInt(btn.dataset.precio),
            imagen: btn.dataset.imagen,
            aroma: "Mango", // Aroma inicial por defecto
            cantidad: 1
        };

        agregarAlCarrito(nuevoProducto);
    }
});

// 4. Lógica de Agregar y Abrir Sidebar
function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarEstado();
    abrirCarrito();
}

// 5. Renderizar (Dibujar) el Carrito con la armonía de la imagen
function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const totalTxt = document.getElementById('total-carrito');
    const subtotalTxt = document.getElementById('subtotal-valor');

    let htmlGenerado = '';
    let sumaTotal = 0;

    carrito.forEach((item, index) => {
        sumaTotal += item.precio * item.cantidad;

        // Generamos las opciones del select dinámicamente
        const opciones = AROMAS_DISPONIBLES.map(a =>
            `<option value="${a}" ${item.aroma === a ? 'selected' : ''}>${a}</option>`
        ).join('');

        htmlGenerado += `
            <div class="item-carrito">
                <img src="${item.imagen}" class="img-carrito">
                <div class="info-item">
                    <div class="fila-superior">
                        <span class="nombre-item">${item.nombre}</span>
                        <span class="eliminar-x" onclick="eliminarItem(${index})">&times;</span>
                    </div>

                    <select class="select-aroma" onchange="cambiarAroma(${index}, this.value)">
                        ${opciones}
                    </select>

                    <div class="fila-inferior">
                        <span class="precio-vino">$ ${item.precio.toLocaleString('es-CO')}</span>
                        <div class="capsula-cantidad">
                            <button onclick="modificarCantidad(${index}, -1)">-</button>
                            <input type="text" value="${item.cantidad}" readonly>
                            <button onclick="modificarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = htmlGenerado;
    totalTxt.innerText = `$ ${sumaTotal.toLocaleString('es-CO')}`;
    subtotalTxt.innerText = `$ ${sumaTotal.toLocaleString('es-CO')}`;
}

// 6. Funciones de Control
function modificarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
        eliminarItem(index);
    } else {
        actualizarEstado();
    }
}

function cambiarAroma(index, nuevoAroma) {
    carrito[index].aroma = nuevoAroma;
    actualizarEstado();
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarEstado();
}

// 7. Persistencia y Sincronización
function actualizarEstado() {
    localStorage.setItem('carritoLumara', JSON.stringify(carrito));
    renderizarCarrito();
}

// 8. NAVEGACIÓN AL CHECKOUT (Pasa los datos a la otra hoja)
function irAlCheckout() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    // Guardamos una última vez por seguridad
    localStorage.setItem('carritoLumara', JSON.stringify(carrito));
    window.location.href = 'checkout.html';
}

// 9. Utilidades de Interfaz
function abrirCarrito() {
    document.getElementById('carrito-sidebar').classList.add('active');
}

function toggleCarrito() {
    document.getElementById('carrito-sidebar').classList.toggle('active');
}

// Ejecutar al cargar la página para mostrar lo que ya existía
document.addEventListener('DOMContentLoaded', renderizarCarrito);

// ==========================================
// BLOQUE 1: APERTURA DEL CARRITO (NAVBAR)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const botonIcono = document.getElementById('abrir-carrito');

    if (botonIcono) {
        botonIcono.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que la página salte al inicio
            abrirCarrito();
        });
    }
});

// ==========================================
// BLOQUE 2: CIERRE DEL CARRITO (X)
// ==========================================
const botonCerrar = document.getElementById('cerrar-carrito');
if (botonCerrar) {
    botonCerrar.addEventListener('click', () => {
        document.getElementById('carrito-sidebar').classList.remove('active');
    });
}

// ==========================================
// BLOQUE 3: RENDERIZAR Y ACTUALIZAR CONTADOR
// ==========================================
function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const totalTxt = document.getElementById('total-carrito');
    const subtotalTxt = document.getElementById('subtotal-valor');

    // ESTA ES LA LÍNEA CLAVE PARA LA BURBUJA DEL NAVBAR
    const contador = document.getElementById('contador-carrito');

    let htmlGenerado = '';
    let sumaTotal = 0;
    let totalUnidades = 0;

    carrito.forEach((item, index) => {
        sumaTotal += item.precio * item.cantidad;
        totalUnidades += item.cantidad; // Sumamos cada unidad

        const opciones = AROMAS_DISPONIBLES.map(a =>
            `<option value="${a}" ${item.aroma === a ? 'selected' : ''}>${a}</option>`
        ).join('');

        htmlGenerado += `
            <div class="item-carrito">
                <img src="${item.imagen}" class="img-carrito">
                <div class="info-item">
                    <div class="fila-superior">
                        <span class="nombre-item">${item.nombre}</span>
                        <span class="eliminar-x" onclick="eliminarItem(${index})">&times;</span>
                    </div>
                    <select class="select-aroma" onchange="cambiarAroma(${index}, this.value)">
                        ${opciones}
                    </select>
                    <div class="fila-inferior">
                        <span class="precio-vino">$ ${item.precio.toLocaleString('es-CO')}</span>
                        <div class="capsula-cantidad">
                            <button onclick="modificarCantidad(${index}, -1)">-</button>
                            <input type="text" value="${item.cantidad}" readonly>
                            <button onclick="modificarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    if (contenedor) contenedor.innerHTML = htmlGenerado;
    if (totalTxt) totalTxt.innerText = `$ ${sumaTotal.toLocaleString('es-CO')}`;
    if (subtotalTxt) subtotalTxt.innerText = `$ ${sumaTotal.toLocaleString('es-CO')}`;

    // ACTUALIZA EL NÚMERO EN EL ICONO (La burbuja roja/gris del navbar)
    if (contador) {
        contador.innerText = totalUnidades;
    }
}
document.querySelectorAll('.btn-ver-mas').forEach(boton => {
    boton.addEventListener('click', function() {
        // Buscamos el artículo (product-item) que es el padre de todo
        const producto = this.closest('.product-item');
        
        // Al añadir 'active' al artículo, tu CSS de .product-item.active .back-content se dispara solo
        producto.classList.toggle('active');

        // Cambiamos el texto del botón para que el usuario sepa cómo cerrar
        if (producto.classList.contains('active')) {
            this.textContent = 'Cerrar detalles';
        } else {
            this.textContent = 'Ver más';
        }
    });
});

document.getElementById('btn-whatsapp').addEventListener('click', function() {
    // 1. Capturamos el texto del área de observaciones
    const mensajeUsuario = document.getElementById('observaciones').value;
    
    // 2. Tu número de teléfono (Ingresa el tuyo con el código de país, ej: 57 para Colombia)
    const telefono = "573114916142"; 

    // 3. Verificamos que el usuario haya escrito algo antes de enviar
    if (mensajeUsuario.trim() === "") {
        alert("Por favor, escribe tus observaciones antes de enviar.");
        return;
    }

    // 4. Creamos el mensaje que llegará a WhatsApp
    const textoFinal = encodeURIComponent(`¡Hola! Quisiera un pedido personalizado con estas observaciones: ${mensajeUsuario}`);

    // 5. Generamos el enlace y abrimos la pestaña de WhatsApp
    const url = `https://wa.me/${telefono}?text=${textoFinal}`;
    
    window.open(url, '_blank');
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // 1. Función para alternar el menú
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        
        // Alternamos la clase 'active' para mostrar/ocultar en CSS
        navLinks.classList.toggle('active');
        
        // Actualizamos el atributo de accesibilidad
        hamburger.setAttribute('aria-expanded', !isExpanded);
    });

    // 2. Cerrar el menú automáticamente al hacer clic en un enlace
    // Muy útil para navegación en la misma página (como ir a "Eventos")
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // 3. Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        const isClickInside = navLinks.contains(event.target) || hamburger.contains(event.target);
        
        if (!isClickInside && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});