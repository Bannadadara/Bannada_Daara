// Full product data from the 2024 Catalogue
const products = [
    { id: 1, name: "Reversible Tote Bag", price: 500, category: "Bags", img: "images/tote-rev.jpg" },
    { id: 2, name: "Box Tote (Plain)", price: 350, category: "Bags", img: "images/box-plain.jpg" },
    { id: 3, name: "Laptop Bag (50-50)", price: 800, category: "Bags", img: "images/laptop.jpg" },
    { id: 4, name: "Regular Sling Bag", price: 250, category: "Bags", img: "images/sling-reg.jpg" },
    { id: 5, name: "Travel Kit", price: 170, category: "Pouches", img: "images/travel.jpg" },
    { id: 6, name: "Book (Embroidered Cover)", price: 450, category: "Stationery", img: "images/book.jpg" }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');

    // Render Products
    list.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Bannada+Daara'">
            <div class="card-info">
                <span class="tag">${p.category}</span>
                <h3>${p.name}</h3>
                <p class="price">Rs. ${p.price}/-</p>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Cart Controls
    cartToggle.onclick = () => cartSidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => cartSidebar.classList.remove('open');

    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        cart.push(product);
        updateCart();
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        updateCart();
    };

    function updateCart() {
        cartToggle.innerText = `Cart (${cart.length})`;
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>Rs. ${item.price} <button class="remove-btn" onclick="removeItem(${index})">x</button></span>
            </div>
        `).join('');
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.innerText = `Rs. ${total}`;
    }

    // Checkout: WhatsApp Message
    document.getElementById('checkout-btn').onclick = () => {
        const message = "Hi Lavanya, I'd like to order: " + cart.map(i => i.name).join(", ");
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(message)}`);
    };
});
