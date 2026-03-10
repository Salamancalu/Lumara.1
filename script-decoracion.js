// LISTA DE PRODUCTOS (Aquí subes tus velas)
const misVelas = [
    {
        nombre: "Vela Burbuja XL",
        descripcion: "Cera de soja premium con aroma a lavanda y vainilla.",
        precio: "$35.000",
        imagen: "https://images.unsplash.com/photo-1602872030219-3df6381463bd?auto=format&fit=crop&q=80&w=500"
    },
    {
        nombre: "Copa Luxury Gold",
        descripcion: "Elegante envase de vidrio con detalles en pan de oro.",
        precio: "$55.000",
        imagen: "https://images.unsplash.com/photo-1603006905393-d4642682464b?auto=format&fit=crop&q=80&w=500"
    },
    {
        nombre: "Vela Escultura Atenea",
        descripcion: "Diseño arquitectónico hecho a mano para decoración.",
        precio: "$48.000",
        imagen: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&q=80&w=500"
    }
];

// Función para cargar los productos en el HTML
const container = document.getElementById('product-container');

misVelas.forEach(vela => {
    const card = document.createElement('div');
    card.className = 'product-item';
    
    card.innerHTML = `
        <div class="product-img-container">
            <img src="${vela.imagen}" alt="${vela.nombre}" class="img-vela">
        </div>
        <div class="product-info">
            <h3>${vela.nombre}</h3>
            <p>${vela.descripcion}</p>
            <span class="product-price">${vela.precio}</span>
            <a href="index.html#pedido" class="btn-buy">HACER PEDIDO</a>
        </div>
    `;
    container.appendChild(card);
});

// Lógica del Modal (Ampliar Imagen)
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("img-ampliada");
const span = document.getElementsByClassName("close-modal")[0];

document.querySelectorAll('.img-vela').forEach(img => {
    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
    }
});

span.onclick = function() { 
    modal.style.display = "none"; 
}

// Cerrar modal al hacer clic fuera de la imagen
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}