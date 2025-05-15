let cart = []; // Array para almacenar los electrodomésticos en el carrito
let isAddressValid = false; // Variable para verificar si la dirección es válida
function addToCart(applianceName, appliancePrice) {
    // Agrega el electrodoméstico al carrito
    cart.push({ name: applianceName, price: appliancePrice });
    updateCartDisplay();
}
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (!cartItemsList || !totalPriceElement) return;
    
    cartItemsList.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Precio: ${item.price}`;
        cartItemsList.appendChild(listItem);
        totalPrice += item.price;
    });
    
    totalPriceElement.textContent = `Precio Total: ${totalPrice}`;
}
function sendMessage() {
    const phoneNumber = '13057761543'.replace(/\D/g, '');
    const formattedPhone = phoneNumber.startsWith('1') ? phoneNumber : `1${phoneNumber}`;
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega electrodomésticos antes de enviar un mensaje.');
        return;
    }
    if (!isAddressValid) {
        alert('Por favor, valida tu dirección antes de enviar el mensaje.');
        return;
    }
    
    const street = document.getElementById('street')?.value?.trim();
    const homeNumber = document.getElementById('homeNumber')?.value?.trim();
    const city = document.getElementById('city')?.value?.trim();
    
    if (!street || !homeNumber || !city) {
        alert('Por favor, completa todos los campos de la dirección.');
        return;
    }
    
    const fullAddress = `${street} ${homeNumber}, ${city}`;
    
    let message = 'Hola, estoy interesado en los siguientes electrodomésticos:\n';
    cart.forEach(item => {
        message += `${item.name} - Precio: ${item.price}\n`;
    });
    message += `Mi dirección es: ${fullAddress}`;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
