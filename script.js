async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        const productsContainer = document.getElementById('products');
        
        if (products.length > 0) {
            productsContainer.innerHTML = products.map(product => `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <img class="w-full h-40 object-cover rounded-md" src="${product.image}" alt="${product.title}">
                    <h3 class="text-lg font-bold text-gray-700 mt-4">${product.title}</h3>
                    <p class="text-sm text-gray-600">${product.description.slice(0, 100)}...</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-green-600 font-bold">R$ ${product.price.toFixed(2)}</span>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg add-to-cart" data-id="${product.id}">Adicionar</button>
                    </div>
                </div>
            `).join('');
        } else {
            productsContainer.innerHTML = '<p class="text-red-500">Nenhum produto encontrado.</p>';
        }
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}

let cart = [];

function addToCart(productId) {
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const productInCart = cart.find(item => item.id === product.id);
            if (productInCart) {
                productInCart.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
        });
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex justify-between mb-2">
            <span>${item.title} (x${item.quantity})</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('totalPrice').innerText = `R$ ${totalPrice.toFixed(2)}`;
}

document.getElementById('products').addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
        addToCart(e.target.dataset.id);
    }
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    alert('Compra finalizada!');
});

fetchProducts();

// AfterShip