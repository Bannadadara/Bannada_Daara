import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    
    // Performance optimization: Filter logic
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        (p.name.toLowerCase().includes(search.toLowerCase()))
    );

    list.innerHTML = filtered.length > 0 ? filtered.map(p => `
        <div class="product-card">
            <div class="img-container">
                <img src="${p.img}" alt="${p.name}" onclick="window.openViewer('${p.img}', '${p.name}')" loading="lazy">
            </div>
            <h4 class="stylish-title" style="font-size:1.2rem; margin:15px 0 5px;">${p.name}</h4>
            <p class="gold-text">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-actions" style="display:flex; gap:10px; margin-top:15px;">
                <button class="add-btn" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
                <button class="share-btn" style="padding:10px; background:#f0f0f0; border:none; border-radius:4px; cursor:pointer;" onclick="window.shareProduct('${p.name}')"><i class="fas fa-share-alt"></i></button>
            </div>
        </div>
    `).join('') : `<div style="grid-column: 1/-1; text-align:center; padding:50px;">Nothing found in this treasure chest.</div>`;
}

window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        const cleanPrice = (p.on_request || !p.price) ? 0 : Number(p.price);
        cart.push({ ...p, price: cleanPrice, qty: 1 });
    }
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.changeQty = (index, delta) => {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveAndUpdate();
};

// "Remove All" Button Logic
window.clearCart = () => {
    if(confirm("Empty your selection?")) {
        cart = [];
        saveAndUpdate();
    }
};

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    // Automated Total Calculation
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-total').innerText = `Rs. ${total}`;

    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.length === 0 ? `<div style="text-align:center; margin-top:50px; color:#666;">Your bag is empty.</div>` : 
        cart.map((item, idx) => `
            <div class="cart-item" style="display:flex; gap:15px; margin-bottom:20px; border-bottom:1px solid #222; padding-bottom:15px;">
                <img src="${item.img}" style="width:70px; height:70px; object-fit:cover; border-radius:4px;">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:0.9rem;">${item.name}</div>
                    <div class="gold-text" style="font-size:0.85rem;">${item.price === 0 ? 'Price on Request' : 'Rs. ' + item.price}</div>
                    <div class="qty-ctrl" style="margin-top:8px; display:flex; align-items:center; gap:10px;">
                        <button onclick="window.changeQty(${idx}, -1)" style="background:#333; color:white; border:none; width:25px; cursor:pointer;">-</button>
                        <span>${item.qty}</span>
                        <button onclick="window.changeQty(${idx}, 1)" style="background:#333; color:white; border:none; width:25px; cursor:pointer;">+</button>
                    </div>
                </div>
            </div>
        `).join('');
}

function setupEventListeners() {
    // Search & Filters
    document.getElementById('search-bar').oninput = (e) => {
        const activeCat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(activeCat, e.target.value);
    };

    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, document.getElementById('search-bar').value);
        };
    });

    // Sidebar Toggles
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('menu-toggle').onclick = () => document.getElementById('nav-menu').classList.add('open');
    document.getElementById('close-nav').onclick = () => document.getElementById('nav-menu').classList.remove('open');
    document.getElementById('clear-all-btn').onclick = window.clearCart;

    // Checkout
    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Bag is empty!");
        const total = document.getElementById('cart-total').innerText;
        const msg = cart.map(i => `- ${i.name} (x${i.qty})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${msg}%0A%0ATotal: ${total}`, '_blank');
    };
}

init();
