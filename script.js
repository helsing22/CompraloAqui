// Array para almacenar los productos del carrito (cada entrada tendrá: producto y cantidad)
const cart = [];
// Función para generar el HTML de cada producto (basado en inventory.json)
function crearProductoHTML(producto) {
  const contenedor = document.createElement('div');
  contenedor.className = 'producto';
  // Imagen
  const img = document.createElement('img');
  img.src = producto.image;
  img.alt = producto.name;
  contenedor.appendChild(img);
  // Nombre del producto
  const titulo = document.createElement('h3');
  titulo.textContent = producto.name;
  contenedor.appendChild(titulo);
  // Descripción
  const descripcion = document.createElement('p');
  descripcion.textContent = producto.description;
  contenedor.appendChild(descripcion);
  // Precio
  const precio = document.createElement('p');
  precio.textContent = `Precio: $${producto.price}`;
  contenedor.appendChild(precio);
  // Botón para agregar al carrito
  const boton = document.createElement('button');
  boton.textContent = 'Agregar al Carrito';
  boton.addEventListener('click', () => agregarAlCarrito(producto));
  contenedor.appendChild(boton);
  return contenedor;
}
// Función para cargar productos desde inventory.json
function cargarProductos() {
  fetch('inventory.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar el archivo JSON');
      }
      return response.json();
    })
    .then(data => {
      const listaProductos = document.getElementById('lista-productos');
      data.forEach(producto => {
        const productoHTML = crearProductoHTML(producto);
        listaProductos.appendChild(productoHTML);
      });
    })
    .catch(error => console.error('Error:', error));
}
// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
  // Buscar si el producto ya existe en el carrito
  const itemExistente = cart.find(item => item.producto.id === producto.id);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    cart.push({ producto: producto, cantidad: 1 });
  }
  actualizarCartUI();
}
// Función para actualizar la interfaz del carrito
function actualizarCartUI() {
  const cartDiv = document.getElementById('cart');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalP = document.getElementById('cart-total');
  // Vaciar contenido previo
  cartItemsDiv.innerHTML = '';
  // Si el carrito tiene ítems, mostrarlos
  if (cart.length > 0) {
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.textContent = `${item.producto.name} x ${item.cantidad}`;
      cartItemsDiv.appendChild(itemDiv);
    });
    // Calcular precio total
    const total = cart.reduce((sum, item) => sum + (item.producto.price * item.cantidad), 0);
    cartTotalP.textContent = `Total: $${total}`;
    cartDiv.classList.remove('hidden');
  } else {
    cartDiv.classList.add('hidden');
  }
}
// Función para vaciar el carrito
function vaciarCarrito() {
  cart.length = 0; // Limpia el array
  actualizarCartUI();
}
// Función para obtener la información de despacho
function obtenerDespachoInfo() {
  const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
  if (deliveryType === 'home') {
    const calle = document.getElementById('calle').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const numero = document.getElementById('numero').value.trim();
    return `Entregar en el hogar: ${calle}, ${ciudad}, ${numero}`;
  } else {
    return 'Recoger en la tienda';
  }
}
// Función para finalizar la compra y abrir WhatsApp
function finalizarCompra() {
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  // Armar detalle de productos (nombre y cantidad)
  let detalleProductos = '';
  cart.forEach(item => {
    detalleProductos += `${item.producto.name} x ${item.cantidad}\n`;
  });
  // Calcular precio total
  const total = cart.reduce((sum, item) => sum + (item.producto.price * item.cantidad), 0);
  
  // Obtener información de despacho
  const despacho = obtenerDespachoInfo();
  // Armar mensaje para WhatsApp
  let mensaje = `Pedido:%0A${detalleProductos}%0ATotal: $${total}%0ADespacho: ${despacho}`;
  // URL para WhatsApp (asegúrate de formatear el número apropiadamente)
  const waNumber = "13057761543";
  const url = `https://wa.me/${waNumber}?text=${mensaje}`;
  // Abrir enlace en una nueva ventana o pestaña
  window.open(url, '_blank');
}
// Configurar evento del botón "Finalizar Compra" en el carrito
document.getElementById('finalize-btn').addEventListener('click', finalizarCompra);
// Configurar evento del botón "Vaciar Carrito"
document.getElementById('empty-cart-btn').addEventListener('click', vaciarCarrito);
// Mostrar/ocultar campos de dirección según la selección de entrega
function configurarEnvio() {
  const radioButtons = document.querySelectorAll('input[name="delivery"]');
  radioButtons.forEach(rb => {
    rb.addEventListener('change', () => {
      const homeAddressDiv = document.getElementById('home-address');
      if (rb.value === 'home' && rb.checked) {
        homeAddressDiv.classList.remove('hidden');
      } else if (rb.value === 'store' && rb.checked) {
        homeAddressDiv.classList.add('hidden');
      }
    });
  });
}
// Inicialización una vez que el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  configurarEnvio();
});