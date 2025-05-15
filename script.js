// Cargar los electrodomésticos cuando la página se carga
document.addEventListener('DOMContentLoaded', loadAppliances);
let cart = []; // Array para almacenar los electrodomésticos en el carrito
let isAddressValid = false; // Variable para verificar si la dirección es válida

// Función para cargar los electrodomésticos desde inventory.json
function loadAppliances() {
    fetch('inventory.json')
        .then(response => response.json())
        .then(data => displayAppliances(data))
        .catch(error => console.error('Error al cargar los electrodomésticos:', error));
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
    showCartNotification(applianceName);
}

function showCartNotification(itemName) {
    let notification = document.querySelector('.cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'cart-notification hide';
        document.body.appendChild(notification);
    }
    
    notification.textContent = `¡${itemName} agregado al carrito!`;
    notification.classList.remove('hide');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 3000);
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
    
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    let address = '';
    
    if (deliveryMethod === 'delivery') {
        if (!isAddressValid) {
            alert('Por favor, valida tu dirección antes de enviar el mensaje.');
            return;
        }
        const street = document.getElementById('street')?.value?.trim();
        const homeNumber = document.getElementById('homeNumber')?.value?.trim();
        const city = document.getElementById('city')?.value?.trim();
        address = `\nDirección de entrega: ${street} ${homeNumber}, ${city}`;
    }
    
    let message = 'Hola, estoy interesado en los siguientes productos:\n\n';
    cart.forEach(item => {
        message += `${item.name} - Precio: ${item.price}\n`;
    });
    
    message += `\nMét