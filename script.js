let cart = []; // Array para almacenar los coches en el carrito

function addToCart(carName, carPrice) {
    // Agrega el coche al carrito
    cart.push({ name: carName, price: carPrice });
    alert(`${carName} ha sido agregado al carrito.`);
}

function sendMessage() {
    const phoneNumber = '13057761543'; // Número de teléfono para enviar el mensaje
    const address = document.getElementById('address').value;
    // Verifica si hay coches en el carrito
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega coches antes de enviar un mensaje.');
        return;
    }
    // Construye el mensaje con los coches en el carrito
    let message = 'Hola, estoy interesado en los siguientes coches:\n';
    cart.forEach(item => {
        message += `${item.name} - Precio: $${item.price}\n`;
    });
    message += `Mi dirección es: ${address}.`;
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
        return;
    }

    // Aquí se puede usar una API externa para validar la dirección
    const apiUrl = `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(street + ' ' + homeNumber)}&city=${encodeURIComponent(city)}&country=Cuba&format=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                validationMessage.textContent = 'La dirección es válida.';
                validationMessage.style.color = 'green';
            } else {
                validationMessage.textContent = 'La dirección no es válida. Intenta de nuevo.';
                validationMessage.style.color = 'red';
            }
        })
        .catch(error => {
            validationMessage.textContent = 'Error al validar la dirección. Intenta más tarde.';
            validationMessage.style.color = 'red';
        });
}
