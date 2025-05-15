// Función para generar el HTML de cada producto utilizando las propiedades del JSON
function crearProductoHTML(producto) {
  // Crear un contenedor para el producto
  const contenedor = document.createElement('div');
  contenedor.className = 'producto';
  // Agrega la imagen del producto
  const img = document.createElement('img');
  img.src = producto.image; // se usa la propiedad "image"
  img.alt = producto.name;  // se usa la propiedad "name"
  contenedor.appendChild(img);
  // Agrega el nombre del producto
  const titulo = document.createElement('h3');
  titulo.textContent = producto.name;
  contenedor.appendChild(titulo);
  // Agrega la descripción del producto
  const descripcion = document.createElement('p');
  descripcion.textContent = producto.description;
  contenedor.appendChild(descripcion);
  // Agrega el precio del producto
  const precio = document.createElement('p');
  precio.textContent = `Precio: $${producto.price}`;
  contenedor.appendChild(precio);
  // Agrega el botón de compra
  const boton = document.createElement('button');
  boton.textContent = 'Comprar';
  contenedor.appendChild(boton);
  return contenedor;
}
// Función para cargar los productos desde el archivo inventory.json
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
// Ejecuta la función una vez que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', cargarProductos);