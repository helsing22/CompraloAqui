let carrito = [];
let carritoCount = document.getElementById('carrito-count');
let carritoItems = document.getElementById('carrito-items');

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
}

function actualizarCarrito() {
    carritoCount.innerText = carrito.length;

    // Limpiar el contenido actual del carrito
    carritoItems.innerHTML = '';

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p>No hay autos en el carrito.</p>';
    } else {
        carrito.forEach(auto); {
            let item = document.createElement('div');
            item.innerText = `${auto.nombre} - $${auto.precio}`;
        }
    }
}