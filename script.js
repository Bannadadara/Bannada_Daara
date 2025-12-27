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
            <img src="${p.img}" alt="${p.name}" onclick="window.viewImage('${p.img}')">
            <h4 style="margin:12px 0 5px;">${p.name}</h4>
            <p style="color:var(--gold); font-weight:600;">Rs. ${p.price}</p>
            <div style="display:flex; gap:5px; margin-top:10px;">
                <button class="add-btn" onclick="window.addToCart(${p.id})">Add to Bag</button>
                <button style="padding:0 10px; border:1px solid #ddd; background:none; cursor:pointer;" onclick="window.viewImage('${p.img}')"><i class="fas fa-expand"></i></button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    const exists = cart.find(item => item.id === id);
    if (exists) exists.qty++;
    else cart.push({ ...p, qty: 1 });
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.viewImage = (src) => {
    document.getElementById('full-res-image').src = src;
    document.getElementById('image-viewer').style.display = 'flex';
};

window.closeViewer = () => {
    document.getElementById('image-viewer').style.display = 'none';
};

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
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-total').innerText = `Rs. ${total}`;

    const container = document.getElementById('cart-items');
    container.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
            <div>
                <div style="font-size:0.9rem;">${item.name}</div>
                <div style="color:var(--gold);">Rs. ${item.price} x ${item.qty}</div>
            </div>
            <button onclick="window.removeItem(${idx})" style="background:none; border:none; color:#ff4444; cursor:pointer;">&times;</button>
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
    document.getElementById('clear-cart-btn').onclick = window.clearCart;
    
    document.getElementById('search-bar').oninput = (e) => renderProducts('All', e.target.value);
    
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat);
        };
    });

    document.getElementById('checkout-btn').onclick = () => {
        const msg = cart.map(i => `- ${i.name} (x${i.qty})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${msg}%0ATotal: ${document.getElementById('cart-total').innerText}`, '_blank');
    };
}

init();
