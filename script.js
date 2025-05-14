function sendMessage(carName) {
    const phoneNumber = '13057761543'; // Reemplaza con el número de teléfono deseado
    const message = `Hola, estoy interesado en ${carName}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}