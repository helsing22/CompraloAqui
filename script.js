function calculateTotal(carName, carPrice) {
    const deliveryCost = 500; // Costo de entrega
    const totalPrice = carPrice + deliveryCost;
    // Muestra el precio total en un alert
    alert(`El precio total de ${carName} con entrega es: $${totalPrice}`);
    // Habilita el botón para enviar mensaje
    document.getElementById('sendMessageButton').onclick = function() {
        sendMessage(carName, totalPrice);
    };
}
function sendMessage(carName, totalPrice) {
    const phoneNumber = '13057761543'; // Reemplaza con el número de teléfono deseado
    const address = document.getElementById('address').value;
    const message = `Hola, estoy interesado en ${carName}. Precio total: $${totalPrice}. Mi dirección es: ${address}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

