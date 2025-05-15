// Array global para almacenar los productos del carrito y variable para el estado minimizado
const cart = [];
let cartMinimized = false;
// Función para generar el HTML de cada producto (basado en inventory.json)
function crearProductoHTML(producto) {
  const contenedor = document.createElement('div');
  contenedor.className = 'producto';
  // Imagen del producto
  const img = document.createElement('img');
  img.src = producto.image;
  img.alt = producto.name;
  contenedor.appendChild(img);
  // Nombre del producto
  const titulo = document.createElement('h3');
  titulo.textContent = producto.name;
  contenedor.appendChild(titulo);
  // Descripción del producto
  const descripcion = document.createElement('p');
  descripcion.textContent = producto.description;
  contenedor.appendChild(descripcion);
  // Precio del producto
  const precio = document.createElement('p');
  precio.textContent = `Precio: $${producto.price}`;
  contenedor.appendChild(precio);
  // Botón para agregar el producto al carrito
  const boton = document.createElement('button');
  boton.textContent = 'Agregar al Carrito';
  boton.addEventListener('click', () => agregarAlCarrito(producto));
  contenedor.appendChild(boton);
  return contenedor;
}
// Función para cargar los productos desde inventory.json
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
// Función para eliminar un producto específico del carrito
function eliminarProducto(idProducto) {
  const indice = cart.findIndex(item => item.producto.id === idProducto);
  if (indice !== -1) {
    cart.splice(indice, 1);
    actualizarCartUI();
  }
}
// Función para vaciar el carrito completo
function vaciarCarrito() {
  cart.length = 0;
  actualizarCartUI();
}
// Función para actualizar la interfaz del carrito
function actualizarCartUI() {
  const cartDiv = document.getElementById('cart');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalP = document.getElementById('cart-total');
  
  // Limpiar el contenido previo en el contenedor de items
  cartItemsDiv.innerHTML = '';
  // Si hay productos en el carrito
  if (cart.length > 0) {
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      
      // Texto con el nombre del producto y cantidad
      const textSpan = document.createElement('span');
      textSpan.textContent = `${item.producto.name} x ${item.cantidad}`;
      itemDiv.appendChild(textSpan);
      // Botón para eliminar el producto individualmente
      const delBtn = document.createElement('button');
      delBtn.textContent = "Eliminar";
      delBtn.className = "delete-btn";
      delBtn.addEventListener('click', () => eliminarProducto(item.producto.id));
      itemDiv.appendChild(delBtn);
      cartItemsDiv.appendChild(itemDiv);
    });
    // Calcular el total del carrito
    const total = cart.reduce((sum, item) => sum + (item.producto.price * item.cantidad), 0);
    cartTotalP.textContent = `Total: $${total}`;
    // Mostrar el carrito expandido solo si no está minimizado
    if (!cartMinimized) {
      cartDiv.classList.remove('hidden');
    }
  } else {
    // Si no hay productos, se oculta el carrito
    cartDiv.classList.add('hidden');
  }
}
// Función para obtener la información de despacho
function obtenerDespachoInfo() {
  const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
  if (deliveryType === 'home') {
    // Se usa el id "direccion" sin acentos
    const direccion = document.getElementById('direccion').value.trim();
    const numero = document.getElementById('numero').value.trim();
    return `Entregar en la Dirección: ${direccion}, ${numero}`;
  } else {
    return 'Recoger en la tienda';
  }
}
// Función para finalizar la compra y abrir WhatsApp con el mensaje armado
function finalizarCompra() {
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  let detalleProductos = '';
  cart.forEach(item => {
    detalleProductos += `${item.producto.name} x ${item.cantidad} - \n`;
  });
  const total = cart.reduce((sum, item) => sum + (item.producto.price * item.cantidad), 0);
  const despacho = obtenerDespachoInfo();
  const mensaje = `Pedido:%0A${detalleProductos}%0ATotal: $${total}%0ADespacho: ${despacho}`;
  const waNumber = "13057761543"; // Número de WhatsApp sin símbolos
  const url = `https://wa.me/${waNumber}?text=${mensaje}`;
  window.open(url, '_blank');
}
// Función para minimizar el carrito
function minimizeCart() {
  cartMinimized = true;
  document.getElementById('cart').classList.add('hidden');
  document.getElementById('minimized-cart').classList.remove('hidden');
}
// Función para restaurar el carrito (mostrarlo) al hacer clic en la bolita flotante
function restoreCart() {
  cartMinimized = false;
  if (cart.length > 0) {
    document.getElementById('cart').classList.remove('hidden');
  }
  document.getElementById('minimized-cart').classList.add('hidden');
}
// Función para configurar la visualización de campos de dirección según la selección
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
// Configuración de eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  configurarEnvio();
  // Configurar evento de Finalizar Compra
  document.getElementById('finalize-btn').addEventListener('click', finalizarCompra);
  // Configurar evento de Vaciar Carrito
  document.getElementById('empty-cart-btn').addEventListener('click', vaciarCarrito);
  // Configurar evento para minimizar el carrito
  document.getElementById('minimize-btn').addEventListener('click', minimizeCart);
  // Configurar evento para restaurar el carrito desde la bolita flotante
  document.getElementById('restore-btn').addEventListener('click', restoreCart);
});