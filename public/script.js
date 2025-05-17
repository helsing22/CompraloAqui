// Variables globales
const cart = [];
let cartMinimized = false;
let inventory = []; // Array de productos cargado desde inventory.json
let isAdmin = false;
let isClient = false;
// ----------------------------
// Funciones de Autenticación
// ----------------------------
// Función para iniciar sesión como Administrador
function loginAdmin() {
  const username = prompt('Ingrese usuario de administrador:');
  const password = prompt('Ingrese contraseña:');
  // Credenciales por defecto (debe ser reemplazado por un sistema real)
  if (username === 'Helsing22' && password === 'helsing22060170568899223') {
    isAdmin = true;
    alert('¡Ingreso de administrador exitoso!');
    enableAdminFeatures();
  } else {
    alert('Credenciales incorrectas para administrador.');
  }
}
// Función para iniciar sesión como Cliente
function loginCliente() {
  const nombre = prompt('Ingrese su nombre:');
  const email = prompt('Ingrese su email:');
  if (nombre && email) {
    isClient = true;
    alert(`Bienvenido, ${nombre}. Tus datos se actualizarán automáticamente en la base de datos.`);
    // Aquí se simula la actualización a través de Git a un archivo de base de datos
    // La integración real requiere backend y configuración de repositorio.
  } else {
    alert('Datos incompletos para el ingreso de cliente.');
  }
}
// ----------------------------
// Panel de Administración
// ----------------------------
function enableAdminFeatures() {
  const adminControls = document.createElement('div');
  adminControls.id = 'admin-controls';
  adminControls.innerHTML = `
    <h3>Panel de Administración</h3>
    <button onclick="updateInventory()">Actualizar Inventario</button>
    <button onclick="exportToExcel()">Exportar a Excel</button>
  `;
  document.body.insertBefore(adminControls, document.querySelector('main'));
}
// ----------------------------
// Funciones de Inventario y Productos
// ----------------------------
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
  // Información de Disponibilidad
  const disponibilidad = document.createElement('p');
  disponibilidad.textContent = `Disponibles: ${producto.quantity}`;
  disponibilidad.className = (producto.quantity > 0) ? 'in-stock' : 'out-of-stock';
  contenedor.appendChild(disponibilidad);
  // Botón para agregar el producto al carrito
  const boton = document.createElement('button');
  boton.textContent = 'Agregar al Carrito';
  // Si no hay stock, deshabilitar el botón
  if (producto.quantity === 0) {
    boton.disabled = true;
  }
  boton.addEventListener('click', () => agregarAlCarrito(producto));
  contenedor.appendChild(boton);
  return contenedor;
}
// Función para actualizar la vista de productos (actualiza el listado en la UI)
function actualizarVistaProductos() {
  const listaProductos = document.getElementById('lista-productos');
  listaProductos.innerHTML = "";
  inventory.forEach(producto => {
    const productoHTML = crearProductoHTML(producto);
    listaProductos.appendChild(productoHTML);
  });
}
// Función para cargar los productos desde inventory.json
function cargarProductos() {
  fetch('inventory.json')
    .then(response => {
      if (!response.ok) { throw new Error('Error al cargar el archivo JSON'); }
      return response.json();
    })
    .then(data => {
      inventory = data;
      actualizarVistaProductos();
    })
    .catch(error => console.error('Error:', error));
}
// ----------------------------
// Funciones del Carrito de Compras
// ----------------------------
// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
  // Verificar si hay stock disponible
  if (producto.quantity === 0) {
    alert('Producto agotado.');
    return;
  }
  // Disminuye la cantidad en inventario cuando se agrega
  producto.quantity = producto.quantity - 1;
  
  // Buscar si el producto ya existe en el carrito
  const itemExistente = cart.find(item => item.producto.id === producto.id);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    cart.push({ producto: producto, cantidad: 1 });
  }
  actualizarCartUI();
  actualizarVistaProductos();
}
// Función para eliminar un producto específico del carrito
function eliminarProducto(idProducto) {
  const indice = cart.findIndex(item => item.producto.id === idProducto);
  if (indice !== -1) {
    // Cuando eliminamos del carrito, se devuelve la cantidad al inventario
    const producto = cart[indice].producto;
    producto.quantity = producto.quantity + cart[indice].cantidad;
    cart.splice(indice, 1);
    actualizarCartUI();
    actualizarVistaProductos();
  }
}
// Función para vaciar el carrito completo
function vaciarCarrito() {
  // Regresar la cantidad de cada producto al inventario
  cart.forEach(item => {
    item.producto.quantity = item.producto.quantity + item.cantidad;
  });
  cart.length = 0;
  actualizarCartUI();
  actualizarVistaProductos();
}
// Función para actualizar la interfaz del carrito
function actualizarCartUI() {
  const cartDiv = document.getElementById('cart');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalP = document.getElementById('cart-total');
  // Limpiar el contenido previo en el contenedor de items
  cartItemsDiv.innerHTML = '';
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
    cartDiv.classList.add('hidden');
  }
}
// ----------------------------
// Funciones para Finalizar Compra y Envío
// ----------------------------
// Función para obtener la información de despacho
function obtenerDespachoInfo() {
  const deliveryInput = document.querySelector('input[name="delivery"]:checked');
  if (!deliveryInput) return 'Sin información de despacho';
  if (deliveryInput.value === 'home') {
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
// ----------------------------
// Funciones de Vista del Carrito (Minimizar/Restaurar)
// ----------------------------
function minimizeCart() {
  cartMinimized = true;
  document.getElementById('cart').classList.add('hidden');
  document.getElementById('minimized-cart').classList.remove('hidden');
}
function restoreCart() {
  cartMinimized = false;
  if (cart.length > 0) {
    document.getElementById('cart').classList.remove('hidden');
  }
  document.getElementById('minimized-cart').classList.add('hidden');
}
// ----------------------------
// Función para configurar la visualización de campos de dirección según la selección
// ----------------------------
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
// ----------------------------
// Funciones de Administración de Inventario
// ----------------------------
// Permite actualizar manualmente la cantidad de cada producto (solo para administradores)
function updateInventory() {
  if (!isAdmin) return;
  inventory.forEach(producto => {
    const nuevaCantidad = prompt(`Nueva cantidad para ${producto.name}:`, producto.quantity);
    if (nuevaCantidad !== null) {
      producto.quantity = parseInt(nuevaCantidad);
      producto.status = (producto.quantity > 0) ? 'available' : 'out_of_stock';
    }
  });
  actualizarVistaProductos();
  actualizarCartUI();
}
// Exporta la información del inventario a Excel (requiere la librería XLSX incluida en la página)
function exportToExcel() {
  if (!isAdmin) return;
  const data = inventory.map(item => ({
    ID: item.id,
    Nombre: item.name,
    Precio: item.price,
    Cantidad: item.quantity,
    Estado: (item.quantity > 0) ? 'available' : 'out_of_stock'
  }));
  // La librería XLSX debe estar incluida en el HTML para que esto funcione:
  // <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
  XLSX.writeFile(workbook, "inventario.xlsx");
}
// ----------------------------
// Configuración de Eventos cuando el DOM esté cargado
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  configurarEnvio();
  // Eventos para el carrito
  document.getElementById('finalize-btn').addEventListener('click', finalizarCompra);
  document.getElementById('empty-cart-btn').addEventListener('click', vaciarCarrito);
  document.getElementById('minimize-btn').addEventListener('click', minimizeCart);
  document.getElementById('restore-btn').addEventListener('click', restoreCart);
  // Ejemplo de botones para login (se pueden ubicar donde se requiera en la interfaz)
  document.getElementById('admin-login-btn').addEventListener('click', loginAdmin);
  document.getElementById('client-login-btn').addEventListener('click', loginCliente);
});