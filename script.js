import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

function renderProducts(category = 'All', searchTerm = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => {
        const matchesCategory = category === 'All' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        list.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">No treasures found.</div>`;
        return;
    }

    list.innerHTML = filtered.map((p, index) => {
        const isRequest = p.on_request === true || p.price === 0;
        return `
        <div class="product-card" style="animation-delay: ${index * 0.05}s">
            ${isRequest ? '<div class="request-badge">Custom</div>' : ''}
            <div class="img-container" onclick="window.viewImage('${p.img}', '${p.name}')" style="cursor:pointer;">
                <img src="${p.img}" alt="${p.name}" style="width:100%; aspect-ratio:1/1; object-fit:cover;">
            </div>
            <div class="product-info" style="padding:10px 0;">
                <div style="font-weight:600; height: 2.4em; overflow: hidden; font-size:0.9rem;">${p.name}</div>
                <div style="color:var(--gold); margin: 5px 0; font-weight:bold;">${isRequest ? 'Price on Request' : 'Rs. ' + p.price}</div>
                <button class="add-btn" onclick="window.addToCart(${p.id})" style="width:100%; padding:10px; background:var(--black); color:white; border:none; cursor:pointer; font-weight:600;">
                    ${isRequest ? 'INQUIRE' : 'ADD TO BAG'}
                </button>
            </div>
        </div>
    `;}).join('');
}

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    const exists = cart.find(i => i.id === id);
    exists ? exists.qty++ : cart.push({ ...p, qty: 1 });
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.changeQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveAndUpdate();
};

window.viewImage = (src, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-caption').innerText = title;
    modal.style.display = "flex";
};

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('cart-count').innerText = totalQty;
    document.getElementById('cart-total').innerText = `Rs. ${totalPrice}`;
    
    document.getElementById('cart-items').innerHTML = cart.map(item => `
        <div style="display:flex; gap:10px; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
            <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
            <div style="flex:1">
                <div style="font-size:0.8rem; font-weight:600;">${item.name}</div>
                <div style="display:flex; align-items:center; gap:10px; margin-top:5px;">
                    <button onclick="window.changeQty(${item.id}, -1)" style="color:white; background:#444; border:none; padding:2px 8px; cursor:pointer;">-</button>
                    <span style="color:var(--gold)">${item.qty}</span>
                    <button onclick="window.changeQty(${item.id}, 1)" style="color:white; background:#444; border:none; padding:2px 8px; cursor:pointer;">+</button>
                </div>
            </div>
            <div style="font-weight:bold; font-size:0.85rem;">${item.price === 0 ? '--' : 'Rs.' + (item.price * item.qty)}</div>
        </div>
    `).join('');
}

// THE CUSTOM CHECKOUT MODAL LOGIC
window.openCheckoutModal = () => {
    if (cart.length === 0) return alert("Bag is empty!");
    const modal = document.createElement('div');
    modal.className = 'modal-form-bg';
    modal.id = 'checkout-modal';
    modal.innerHTML = `
        <div class="form-card">
            <h3 style="margin-bottom:10px; font-family:'Cormorant Garamond'">Delivery Details</h3>
            <p style="font-size:0.8rem; color:#666; margin-bottom:15px;">Please provide your details to complete the WhatsApp order.</p>
            <input type="text" id="cust-name" placeholder="Full Name" required>
            <textarea id="cust-address" placeholder="Complete Delivery Address" rows="3" required></textarea>
            <button id="send-wa" class="checkout-btn">CONFIRM ORDER <i class="fab fa-whatsapp"></i></button>
            <button onclick="document.getElementById('checkout-modal').remove()" style="background:none; border:none; width:100%; margin-top:15px; cursor:pointer; color:#888; font-size:0.8rem;">Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('send-wa').onclick = () => {
        const name = document.getElementById('cust-name').value;
        const addr = document.getElementById('cust-address').value;
        if (!name || !addr) return alert("Please fill in your name and address.");

        const items = cart.map(i => `• ${i.name} [x${i.qty}]`).join('%0A');
        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const msg = `Hello Bannada Daara!%0A%0A*ORDER DETAILS*%0A*Name:* ${name}%0A*Address:* ${addr}%0A%0A*Items:*%0A${items}%0A%0A*Estimated Total: Rs.${total}*`;
        
        window.open(`https://wa.me/918105750221?text=${msg}`, '_blank');
        modal.remove();
    };
};

function setupEventListeners() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('checkout-btn').onclick = window.openCheckoutModal;
    
    document.getElementById('clear-cart').onclick = () => {
        if (confirm("Clear your bag?")) { cart = []; saveAndUpdate(); }
    };

    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, document.getElementById('search-bar').value);
        };
    });

    document.getElementById('search-bar').oninput = (e) => {
        const cat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(cat, e.target.value);
    };

    document.querySelector('.close-modal').onclick = () => document.getElementById('image-modal').style.display = "none";
    
    document.getElementById('footer-feedback-btn').onclick = () => {
        window.open('https://wa.me/918105750221?text=Hi! I have some feedback regarding Bannada Daara:', '_blank');
    };
}

init();
