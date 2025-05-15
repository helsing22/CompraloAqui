// Función para generar el HTML de cada producto
function crearProductoHTML(producto) {
  // Crea un contenedor para el producto
  const contenedor = document.createElement('div');
  contenedor.className = 'producto';
  // Agrega la imagen del producto
  const img = document.createElement('img');
  img.src = producto.imagen; // La propiedad 'imagen' debe contener la ruta o URL de la imagen
  img.alt = producto.nombre;
  contenedor.appendChild(img);
  // Agrega el nombre del producto
  const nombre = document.createElement('h3');
  nombre.textContent = producto.nombre;
  contenedor.appendChild(nombre);
  // Agrega la descripción del producto
  const descripcion = document.createElement('p');
  descripcion.textContent = producto.descripcion;
  contenedor.appendChild(descripcion);
  // Agrega el precio del producto
  const precio = document.createElement('p');
  precio.textContent = `Precio: $${producto.precio}`;
  contenedor.appendChild(precio);
  // Agrega el botón de comprar
  const boton = document.createElement('button');
  boton.textContent = 'Comprar';
  contenedor.appendChild(boton);
  return contenedor;
}
// Función para cargar los productos desde el archivo JSON
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
// Llama a la función cargarProductos una vez que el DOM se haya cargado
document.addEventListener('DOMContentLoaded', cargarProductos);