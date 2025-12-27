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

    list.innerHTML = filtered.length > 0 ? filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" onclick="window.openViewer('${p.img}', '${p.name}')" loading="lazy">
            <h4 style="margin:15px 0 5px; font-family:var(--heading-font); font-size:1.25rem;">${p.name}</h4>
            <p style="color:var(--gold); font-weight:600; margin-bottom:15px;">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-actions">
                <button class="add-btn" onclick="window.addToCart(${p.id})">
                    <i class="fas fa-cart-plus"></i> ADD TO BAG
                </button>
                <button class="share-btn" onclick="window.shareProduct('${p.name}', ${p.id})">
                    <i class="fas fa-share-nodes"></i>
                </button>
            </div>
        </div>
    `).join('') : `<p style="grid-column: 1/-1; text-align:center; padding: 100px; opacity:0.5;">No treasures found.</p>`;
}

window.addToCart = (id) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        const p = products.find(i => i.id === id);
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

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
    
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-total').innerText = `Rs. ${total}`;

    const itemsDiv = document.getElementById('cart-items');
    if (cart.length === 0) {
        itemsDiv.innerHTML = `<div style="text-align:center; margin-top:100px; color:#666;">
            <i class="fas fa- shopping-basket" style="font-size:3rem; margin-bottom:15px; display:block; opacity:0.2;"></i>
            Your bag is empty.
        </div>`;
    } else {
        itemsDiv.innerHTML = cart.map((item, idx) => `
            <div class="cart-item" style="display:flex; gap:15px; padding:15px 0; border-bottom:1px solid #222;">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:6px;">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:0.9rem;">${item.name}</div>
                    <div style="color:var(--gold); font-size:0.85rem; margin-bottom:8px;">${item.price === 0 ? 'Price on Request' : 'Rs. ' + item.price}</div>
                    <div class="qty-controls" style="display:flex; align-items:center; gap:12px;">
                        <button class="qty-btn" style="background:#333; border:none; color:white; width:24px; height:24px; border-radius:4px; cursor:pointer;" onclick="window.changeQty(${idx}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" style="background:#333; border:none; color:white; width:24px; height:24px; border-radius:4px; cursor:pointer;" onclick="window.changeQty(${idx}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function setupEventListeners() {
    // Search & Filter
    const searchBar = document.getElementById('search-bar');
    searchBar.oninput = () => renderProducts(document.querySelector('.cat-item.active').dataset.cat, searchBar.value);

    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, searchBar.value);
        };
    });

    // Sidebar Toggles
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    // Clear All Feature
    document.getElementById('clear-cart').onclick = () => {
        if(cart.length > 0 && confirm("Remove all items from your bag?")) {
            cart = [];
            saveAndUpdate();
        }
    };

    // WhatsApp Checkout
    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Bag is empty!");
        const msg = cart.map(i => `- ${i.name} (x${i.qty})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${msg}`, '_blank');
    };
}

init();
