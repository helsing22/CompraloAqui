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