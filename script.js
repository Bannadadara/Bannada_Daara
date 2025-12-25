import { products } from './data.js';
let cart = [];

function init() {
    renderProducts();
    const sidebar = document.getElementById('cart-sidebar');
    document.getElementById('cart-toggle').onclick = () => sidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => sidebar.classList.remove('open');

    document.getElementById('search-bar').oninput = (e) => renderProducts('All', e.target.value);
    document.getElementById('category-filter').onchange = (e) => renderProducts(e.target.value, '');

    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty!");
        const items = cart.map(i => i.name).join(", ");
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent("Order for: " + items)}`, '_blank');
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(search.toLowerCase()));
    list.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/250'">
            <h4>${p.name}</h4>
            <p><strong>Rs. ${p.price}</strong></p>
            <div class="card-buttons">
                <a href="${p.img}" target="_blank" class="btn view-btn">View</a>
                <button class="btn" onclick="addToCart(${p.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    cart.push(products.find(p => p.id === id));
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

function updateUI() {
    document.getElementById('cart-toggle').innerText = `My Shopping Bag (${cart.length})`;
    document.getElementById('cart-items').innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="cart.splice(${index}, 1); updateUI();" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    document.getElementById('cart-total').innerText = `Rs. ${cart.reduce((s, i) => s + (i.price || 0), 0)}`;
}

document.addEventListener('DOMContentLoaded', init);
