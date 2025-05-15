let cart = []; // Array para almacenar los electrodomésticos en el carrito
let isAddressValid = false; // Variable para verificar si la dirección es válida
// Función para cargar los electrodomésticos desde inventory.json
async function loadAppliances() {
    try {
        const response = await fetch('./inventory.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || !data.appliances || !Array.isArray(data.appliances)) {
            throw new Error('Formato de datos inválido en inventory.json');
        }
        displayAppliances(data.appliances);
    } catch (error) {
        console.error('Error cargando los electrodomésticos:', error);
        document.querySelector('.car-list').innerHTML = '<p>Error al cargar los productos. Por favor, intente más tarde.</p>';
    }
}
// Función para mostrar los electrodomésticos en la página
function displayAppliances(appliances) {
    const carList = document.querySelector('.car-list');
    carList.innerHTML = '';
    
    appliances.forEach(appliance => {
        const applianceDiv = document.createElement('div');
        applianceDiv.className = 'car-item';
        applianceDiv.innerHTML = `
            <img src="${appliance.image}" alt="${appliance.name}">
            <h2>${appliance.name}</h2>
            <p>${appliance.description}</p>
            <p>Precio: <span class="car-price" data-price="${appliance.price}">${appliance.price}</span></p>
            <button onclick="addToCart('${appliance.name}', ${appliance.price})">Agregar al carrito</button>
        `;
        carList.appendChild(applianceDiv);
    });
}
function addToCart(applianceName, appliancePrice) {
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
function validateAddress() {
    const street = document.getElementById('street')?.value?.trim();
    const homeNumber = document.getElementById('homeNumber')?.value?.trim();
    const city = document.getElementById('city')?.value?.trim();
    
    if (!street || !homeNumber || !city) {
        alert('Por favor, completa todos los campos de la dirección.');
        isAddressValid = false;
        return;
    }
    
    isAddressValid = true;
    alert('Dirección validada correctamente.');
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
    
    const fullAddress = `${street} ${homeNumber}, ${city}`;
    
    let message = 'Hola, estoy interesado en los siguientes electrodomésticos:\n';
    cart.forEach(item => {
        message += `${item.name} - Precio: ${item.price}\n`;
    });
    message += `Mi dirección es: ${fullAddress}`;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
// Cargar los electrodomésticos cuando la página se carga
document.addEventListener('DOMContentLoaded', loadAppliances);