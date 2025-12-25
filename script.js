import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();

    // Sidebar Window Logic
    const sidebar = document.getElementById('cart-sidebar');
    const toggle = document.getElementById('cart-toggle');
    const close = document.getElementById('close-cart');

    toggle.onclick = () => sidebar.classList.add('open');
    close.onclick = () => sidebar.classList.remove('open');

    // Filtering logic
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    const filterProducts = () => {
        renderProducts(categoryFilter.value, searchBar.value);
    };

    searchBar.oninput = filterProducts;
    categoryFilter.onchange = filterProducts;

    // Feedback Button
    document.getElementById('send-feedback-btn').onclick = () => {
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent("Hi! I have some feedback about Bannada Daara:")}`, '_blank');
    };

    // Checkout
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty!");
        const items = cart.map(i => `- ${i.name}`).join("\n");
        const total = document.getElementById('cart-total').innerText;
        const msg = `*New Order - Bannada Daara*\n\n*Items:*\n${items}\n\n*Total:* ${total}`;
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => {
        const matchesCat = cat === 'All' || p.category === cat;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    list.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300'">
            <div class="card-info">
                <h3>${p.name}</h3>
                <p style="color:var(--primary); font-weight:bold">${p.on_request ? "Price on Request" : "Rs. " + p.price + "/-"}</p>
                <button class="cart-btn" onclick="addToCart(${p.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateBagUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeFromBag = (index) => {
    cart.splice(index, 1);
    updateBagUI();
};

function updateBagUI() {
    // Update Button Label
    document.getElementById('cart-toggle').innerText = `My Shopping Bag (${cart.length})`;
    
    // Update Sidebar List
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <button onclick="removeFromBag(${index})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold">&times;</button>
        </div>
    `).join('');

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

document.addEventListener('DOMContentLoaded', init);
