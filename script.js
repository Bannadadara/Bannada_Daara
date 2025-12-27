import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        (p.name.toLowerCase().includes(search.toLowerCase()))
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <h4 style="font-family:var(--header-font); font-size:1.4rem; margin:15px 0 5px;">${p.name}</h4>
            <p style="color:var(--accent); font-weight:600;">Rs. ${p.price}</p>
            <button class="add-btn" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) { existing.qty++; } 
    else { cart.push({ ...item, qty: 1 }); }
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-total').innerText = `Rs. ${total}`;

    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map((item, idx) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:20px; border-bottom:1px solid #222; padding-bottom:10px;">
            <div>
                <p style="font-weight:600;">${item.name}</p>
                <p style="color:var(--gold); font-size:0.8rem;">Rs. ${item.price} x ${item.qty}</p>
            </div>
            <button onclick="window.removeItem(${idx})" style="background:none; border:none; color:red; cursor:pointer;">&times;</button>
        </div>
    `).join('');
}

window.removeItem = (idx) => {
    cart.splice(idx, 1);
    saveAndUpdate();
};

function setupEventListeners() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    document.getElementById('clear-all-btn').onclick = () => {
        cart = [];
        saveAndUpdate();
    };

    document.getElementById('search-bar').oninput = (e) => renderProducts('All', e.target.value);

    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat);
        };
    });

    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Bag is empty!");
        const msg = cart.map(i => `${i.name} (x${i.qty})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order:%0A${msg}`, '_blank');
    };
}

init();
