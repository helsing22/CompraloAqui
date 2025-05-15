let cart = []; // Array para almacenar los coches en el carrito
let isAddressValid = false; // Variable para verificar si la dirección es válida
function addToCart(carName, carPrice) {
    // Agrega el coche al carrito
    cart.push({ name: carName, price: carPrice });
    updateCartDisplay(); // Actualiza la visualización del carrito
}
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (!cartItemsList || !totalPriceElement) return; // Validación de elementos
    
    // Limpia la lista de artículos en el carrito
    cartItemsList.innerHTML = '';
    // Calcula el precio total
    let totalPrice = 0;
    
    // Agrega cada artículo del carrito a la lista
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Precio: $${item.price}`;
        cartItemsList.appendChild(listItem);
        totalPrice += item.price; // Suma el precio al total
    });
    
    // Actualiza el precio total en la interfaz
    totalPriceElement.textContent = `Precio Total: ${totalPrice}`;
}
function sendMessage() {
    const phoneNumber = '13057761543';
    // Verifica si hay coches en el carrito
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega coches antes de enviar un mensaje.');
        return;
    }
    // Verifica si la dirección ha sido validada
    if (!isAddressValid) {
        alert('Por favor, valida tu dirección antes de enviar el mensaje.');
        return;
    }
    
    // Obtiene los elementos de la dirección
    const street = document.getElementById('street').value;
    const homeNumber = document.getElementById('homeNumber').value;
    const city = document.getElementById('city').value;
    const fullAddress = `${street} ${homeNumber}, ${city}`;
    
    // Construye el mensaje con los coches en el carrito
    let message = 'Hola, estoy interesado en los siguientes coches:\n';
    cart.forEach(item => {
        message += `${item.name} - Precio: ${item.price}\n`;
    });
    message += `Mi dirección es: ${fullAddress}.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
function validateAddress() {
    const street = document.getElementById('street').value;
    const homeNumber = document.getElementById('homeNumber').value;
    const city = document.getElementById('city').value;
    const validationMessage = document.getElementById('validationMessage');
    // Verifica que los campos no estén vacíos
    if (!street || !homeNumber || !city) {
        validationMessage.textContent = 'Por favor, completa todos los campos.';
        isAddressValid = false; // La dirección no es válida
        return;
    }
    // Construye la dirección completa
    const fullAddress = `${street} ${homeNumber}, ${city}`;
    // Llama a la API de Geocode.xyz para validar la dirección
    const apiUrl = `https://geocode.xyz/${encodeURIComponent(fullAddress)}?json=1`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                validationMessage.textContent = 'La dirección no es válida. Intenta de nuevo.';
                validationMessage.style.color = 'red';
                isAddressValid = false; // La dirección no es válida
            } else {
                validationMessage.textContent = 'La dirección es válida.';
                validationMessage.style.color = 'green';
                isAddressValid = true; // La dirección es válida
            }
        })
        .catch(error => {
            validationMessage.textContent = 'Error al validar la dirección. Intenta más tarde.';
            validationMessage.style.color = 'red';
            isAddressValid = false; // La dirección no es válida
        });
}