import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

function renderProducts(category = 'All') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => category === 'All' || p.category === category);

    list.innerHTML = filtered.map(p => `
        <div class="product-card" style="background:#fff; padding:15px; border-radius:10px; border:1px solid #eee;">
            <img src="${p.img}" style="width:100%; height:280px; object-fit:cover; border-radius:8px;" loading="lazy">
            <h4 style="margin:15px 0 5px; font-family:'Cormorant Garamond'; font-size:1.3rem;">${p.name}</h4>
            <p style="color:var(--gold); font-weight:600; margin-bottom:15px;">Rs. ${p.price}</p>
            <button class="add-btn" onclick="window.addToCart(${p.id})" style="width:100%; background:var(--gold); border:none; color:#fff; padding:12px; border-radius:5px; cursor:pointer;">
                <i class="fas fa-plus"></i> ADD TO BAG
            </button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    const exists = cart.find(i => i.id === id);
    if (exists) exists.qty++;
    else cart.push({ ...p, qty: 1 });
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('cart-total').innerText = `Rs. ${cart.reduce((sum, i) => sum + (i.price * i.qty), 0)}`;
    
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.length === 0 ? '<p style="text-align:center; padding:50px;">Bag is empty</p>' : cart.map((item, idx) => `
        <div style="display:flex; gap:15px; padding:15px; border-bottom:1px solid #222;">
            <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
            <div style="flex:1">
                <div style="font-size:0.9rem; font-weight:600;">${item.name}</div>
                <div style="color:var(--gold);">Rs. ${item.price}</div>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    document.getElementById('clear-cart').onclick = () => {
        if(confirm("Empty your bag?")) { cart = []; saveAndUpdate(); }
    };

    document.getElementById('footer-feedback-btn').onclick = () => {
        window.open('https://wa.me/918105750221?text=Hi, I have feedback regarding Bannada Daara:', '_blank');
    };

    document.getElementById('checkout-btn').onclick = () => {
        const text = cart.map(i => `${i.name} x${i.qty}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${text}`, '_blank');
    };
}

init();
