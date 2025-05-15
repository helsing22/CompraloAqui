// Array global para almacenar los productos del carrito
const cart = [];
// Función para generar el HTML de cada producto
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
  const itemExistente = cart.find(item => item.producto.id === producto.id);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    cart.push({ producto: producto, cantidad: 1 });
  }
  actualizarCartUI();
}
// Función para eliminar un producto específico del carrito
function eliminarProducto(idProducto) {
  const indice = cart.findIndex(item => item.producto.id === idProducto);
  if (indice !== -1) {
    cart.splice(indice, 1);
    actualizarCartUI();
  }
}
// Función para vaciar el carrito
function vaciarCarrito() {
  cart.length = 0;
  actualizarCartUI();
}
// Función para actualizar la interfaz del carrito
function actualizarCartUI() {
  const cartDiv = document.getElementById('cart');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalP = document.getElementById('cart-total');
  // Limpiar contenido previo
  cartItemsDiv.innerHTML = '';
  if (cart.length > 0) {
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      
      // Texto con el nombre y cantidad
      const textSpan = document.createElement('span');
      textSpan.textContent = `${item.producto.name} x ${item.cantidad}`;
      itemDiv.appendChild(textSpan);
      // Botón para eliminar este producto
      const delBtn = document.createElement('button');
      delBtn.textContent = "Eliminar";
      delBtn.className = "delete-btn";
      delBtn.addEventListener('click', () => eliminarProducto(item.producto.id));
      itemDiv.appendChild(delBtn);
      cartItemsDiv.appendChild(itemDiv);
    });
    const total = cart.reduce((sum, item) => sum + (item.producto.price * item.cantidad), 0);
    cartTotalP.textContent = `Total: $${total}`;
    cartDiv.classList.remove('hidden');
  } else {
    cartDiv.classList.add('hidden');
  }
}
// Función para obtener la información de despacho (ya definida en versiones anteriores)
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
  let detalleProductos = '';
  cart.forEach(item => {
    detalleProductos += `${item.producto.name} x ${item.cantidad}\n`;
  });
  const total = cart.reduce((sum, item) => sum + (item.producto.price * item.cantidad), 0);
  const despacho = obtenerDespachoInfo();
  const mensaje = `Pedido:%0A${detalleProductos}%0ATotal: $${total}%0ADespacho: ${despacho}`;
  const waNumber = "13057761543";
  const url = `https://wa.me/${waNumber}?text=${mensaje}`;
  window.open(url, '_blank');
}
// Funciones para minimizar y restaurar el carrito
function minimizeCart() {
  // Ocultar el carrito completo y mostrar el botón minimizado
  document.getElementById('cart').classList.add('hidden');
  document.getElementById('minimized-cart').classList.remove('hidden');
}
function restoreCart() {
  // Mostrar nuevamente el carrito completo y ocultar el botón minimizado
  if (cart.length > 0) {
    document.getElementById('cart').classList.remove('hidden');
  }
  document.getElementById('minimized-cart').classList.add('hidden');
}
// Configurar evento para los botones de minimizar/restaurar
document.getElementById('minimize-btn').addEventListener('click', minimizeCart);
document.getElementById('restore-btn').addEventListener('click', restoreCart);
// Configurar evento del botón "Finalizar Compra"
document.getElementById('finalize-btn').addEventListener('click', finalizarCompra);
// Configurar evento del botón "Vaciar Carrito"
document.getElementById('empty-cart-btn').addEventListener('click', vaciarCarrito);
// Configurar envío (ya definido en versiones anteriores)
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
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  configurarEnvio();
});