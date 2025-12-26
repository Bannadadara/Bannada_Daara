import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCartControls();
    setupFilters();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
            <h4 style="margin-top:15px; font-family: 'Cormorant Garamond', serif; font-size:1.4rem;">${p.name}</h4>
            <p style="color:#c5a059; font-weight:600; margin-bottom:15px;">Rs. ${p.price}</p>
            <button class="add-btn" style="width:100%; background:black; color:white; padding:12px; border:none; cursor:pointer;" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    cart.push(p);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeCartItem = (idx) => {
    cart.splice(idx, 1);
    updateUI();
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="window.removeCartItem(${idx})" style="border:none; background:none; cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
}

function setupFilters() {
    const searchBar = document.getElementById('search-bar');
    searchBar.oninput = () => renderProducts(document.querySelector('.cat-item.active').dataset.cat, searchBar.value);
}

init();
