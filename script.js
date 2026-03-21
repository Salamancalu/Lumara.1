// 1. CONFIGURACIÓN INICIAL
const scriptURL = 'https://script.google.com/macros/s/AKfycbyXKoO1j0jB86l4303hx8iAHmaSDSlbwB7p09s8OtyvmfCqDyS-DnFpuV3d4gm1bo3w/exec';

const fragancias = [
    "Mango", "Coco", "Chocolate", "Frutos rojos", "Fresas con chocolate", "Sándalo", "Bambú", "Galleta", "Vainilla", "Coco vainilla", "Lavanda", "Jazmín", "Maracuyá", "Canela", "Baby"
];

const catalogo = {
    "decorativa": [
        { sub: "Postres y bebidas", prods: ["Vela Ice Coffee", "Vela Postre frutos rojos", "Vela Postre con crema", "Vela Copa de helado"] },
        { sub: "Waxmelts", prods: ["Guacal rosas con pebetero (Azul)", "Guacal rosas con pebetero (Rosa)"] },
        { sub: "Bouquets", prods: ["Bouquet rosas y margaritas", "Bouquet girasoles y virgen", "Bouquet peonias"] },
        { sub: "Masajes y Aromaticas", prods: ["Velas de masaje 90g", "Velas de masaje 60g", "Vela Aromática Margarita"] },

    ],
    "eventos": [
        { sub: "Recordatorios", prods: ["Vela Margarita", "Vela Ice Coffee", "Vela Cerveza", "Vela Recordatorio Osito", "Vela Recordatorio Grado", "Vela Burbuja 3x3", "Vela Burbuja 2x2", "Vela Arcoiris", "Vela Corazón de Rosas Pequeño", "Vela Rosa REF 001", "Vela Rosa REF 002", "Vela Pequeña León", "Vela Oso de Rosas", "Vela Peonia", "Vela Tulipanes", "Vela Huellita", "Vela Corazón TE AMO", "Vela Mariposa", "Vela Perro Bull Dog"] },
        { sub: "Corporativo", prods: ["Eventos Sociales", "Eventos Corporativos", "Presencia de Marca"] }
    ],
    "temporada": [
        { sub: "Navideñas", prods: ["Velas Intenciones Onduladas X 6", "Velas Intenciones Arbolito x 6", "Combo reno y árbol", "Vela Arbolito Navideño", "Vela Pesebre Coqueto", "Vela Pesebre Mediano", "Vela Burbuja 6x6 con Hojita", "Vela Renito"] },
        { sub: "Espiritualidad", prods: ["Virgen Pequeña 6 cm", "Vela Sagrada Familia", "Virgen de Guadalupe 7 cm", "Vela Virgen María con Niño Jesús", "Vela Angelito", "Vela Sagrada Familia Huevo", "Vela Rostro Cristo", "Velón Cristo", "Vela Angelito Mini" ] }
    ]
};

// 2. INICIALIZACIÓN AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    const categoryGrid = document.getElementById('category-grid');
    const form = document.getElementById('lumara-form');

    const categoriasVisibles = [
        { id: 'decorativa', nombre: 'Decorativa y Sensorial', icon: '' },
        { id: 'eventos', nombre: 'Eventos y Momentos Especiales', icon: '' },
        { id: 'temporada', nombre: 'Fechas de Temporada y Espiritualidad', icon: '' }
    ];

    if (categoryGrid) {
        categoriasVisibles.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-option';
            card.style.cssText = "border: 1px solid #ddd; padding: 15px; border-radius: 10px; cursor: pointer; text-align: center; transition: 0.3s; background: #fff;";

            card.innerHTML = `
                <div style="font-size: 24px; margin-bottom: 5px;">${cat.icon}</div>
                <div style="font-size: 13px; font-weight: bold; color: #444;">${cat.nombre}</div>
            `;

            card.onclick = () => {
                document.querySelectorAll('.category-option').forEach(el => {
                    el.style.borderColor = "#ddd";
                    el.style.background = "#fff";
                });
                card.style.borderColor = "#b8935a";
                card.style.background = "#fdfaf5";
                showProducts(cat.id);
            };
            categoryGrid.appendChild(card);
        });
    }

    if (form) {
        form.addEventListener('submit', enviarFormulario);
    }
});

// 3. FUNCIÓN PARA MOSTRAR SUBCATEGORÍAS Y SELECTORES
function showProducts(categoriaId) {
    const form = document.getElementById('lumara-form');
    const bloqueDinamico = document.getElementById('productos-dinamicos');
    const container = document.getElementById('container-subcategorias');

    // --- LÓGICA PARA CAPTURAR LA CATEGORÍA EN EL EXCEL ---
    let catHidden = document.getElementById('cat-hidden');
    if (!catHidden) {
        catHidden = document.createElement('input');
        catHidden.type = 'hidden';
        catHidden.id = 'cat-hidden';
        catHidden.name = 'categoria_id';
        form.appendChild(catHidden);
    }
    catHidden.value = categoriaId;
    // ----------------------------------------------------

    if (!bloqueDinamico || !container) return;

    container.innerHTML = "";
    bloqueDinamico.style.display = 'block';

    const subcategorias = catalogo[categoriaId];

    if (subcategorias) {
        subcategorias.forEach((sub, index) => {
            const subDiv = document.createElement('div');
            subDiv.className = 'subcategoria-item';
            subDiv.style.cssText = "margin-bottom: 20px; padding: 15px; background: #fafafa; border-radius: 8px; border-left: 4px solid #b8935a;";

            subDiv.innerHTML = `
                <label style="display:block; font-weight: bold; color: #b8935a; margin-bottom: 10px; font-size: 14px;">
                    ${sub.sub.toUpperCase()}
                </label>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 80px; gap: 10px; align-items: center;">
                    <select name="Producto_${index}" class="select-vela" onchange="activarInputs(this)" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc; font-size: 13px;">
                        <option value="">¿Qué vela deseas?</option>
                        ${sub.prods.map(p => `<option value="${p}">${p}</option>`).join('')}
                    </select>

                    <select name="Aroma_${index}" disabled style="padding: 8px; border-radius: 5px; border: 1px solid #ccc; font-size: 13px; background: #eee;">
                        <option value="">Elegir Aroma</option>
                        ${fragancias.map(f => `<option value="${f}">${f}</option>`).join('')}
                    </select>

                    <input type="number" name="Cant_${index}" min="0" value="0" disabled style="padding: 8px; border-radius: 5px; border: 1px solid #ccc; text-align: center;">
                </div>
            `;
            container.appendChild(subDiv);
        });
        bloqueDinamico.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function activarInputs(selectElement) {
    const parent = selectElement.parentElement;
    const aromaSelect = parent.querySelector('select[name^="Aroma_"]');
    const cantInput = parent.querySelector('input[name^="Cant_"]');

    if (selectElement.value !== "") {
        aromaSelect.disabled = false;
        aromaSelect.style.background = "#fff";
        cantInput.disabled = false;
        cantInput.value = 1;
    } else {
        aromaSelect.disabled = true;
        aromaSelect.style.background = "#eee";
        aromaSelect.value = "";
        cantInput.disabled = true;
        cantInput.value = 0;
    }
}

// 4. LÓGICA DE RESUMEN (PRE-ENVÍO)
function enviarFormulario(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const resumenContenido = document.getElementById('resumen-contenido');
    const modalResumen = document.getElementById('modal-resumen');

    let productosSeleccionados = "";
    let tieneProductos = false;

    for (let i = 0; i < 20; i++) {
        const producto = formData.get(`Producto_${i}`);
        const cantidad = formData.get(`Cant_${i}`);
        const aroma = formData.get(`Aroma_${i}`);

        if (producto && parseInt(cantidad) > 0) {
            productosSeleccionados += `<p>🕯️ <strong>${producto}</strong><br>CANTIDAD: ${cantidad} | AROMA: ${aroma || 'No definido'}</p>`;
            tieneProductos = true;
        }
    }

    if (!tieneProductos) {
        alert("Por favor, selecciona al menos una vela de la lista.");
        return;
    }

    resumenContenido.innerHTML = `
        <p><strong>Cliente:</strong> ${formData.get('nombre')}</p>
        <p><strong>Dirección:</strong> ${formData.get('direccion')}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
        <div style="max-height: 250px; overflow-y: auto;">
            ${productosSeleccionados}
        </div>
        <p style="font-size: 11px; color: #888; margin-top: 15px;"><em>* Verificaremos disponibilidad y costo de envío por WhatsApp.</em></p>
    `;

    modalResumen.style.display = 'flex';
}

// 5. CONFIRMACIÓN Y ENVÍO REAL
function confirmarYEnviar() {
    const form = document.getElementById('lumara-form');
    const btnConfirmar = document.getElementById('btn-confirmar-final');
    const modalResumen = document.getElementById('modal-resumen');
    const modalExito = document.getElementById('modal-exito');

    btnConfirmar.innerText = 'Enviando...';
    btnConfirmar.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors'
    })
        .then(() => {
            modalResumen.style.display = 'none';
            btnConfirmar.innerText = 'Confirmar y Enviar';
            btnConfirmar.disabled = false;

            if (modalExito) modalExito.style.display = 'flex';

            form.reset();
            document.getElementById('productos-dinamicos').style.display = 'none';
            document.querySelectorAll('.category-option').forEach(el => {
                el.style.borderColor = "#ddd";
                el.style.background = "#fff";
            });
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Hubo un error de conexión. Intenta de nuevo.');
            btnConfirmar.innerText = 'Confirmar y Enviar';
            btnConfirmar.disabled = false;
        });
}

function cerrarResumen() {
    document.getElementById('modal-resumen').style.display = 'none';
}

function cerrarModal() {
    const modal = document.getElementById('modal-exito');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Al hacer click en la hamburguesa, alterna la clase 'active'
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Opcional: Cerrar el menú automáticamente al hacer click en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});