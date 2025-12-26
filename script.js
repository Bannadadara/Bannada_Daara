import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd_cart')) || [];
let activeCat = 'All';

function init() {
    render();
    updateUI();
    attachEvents();
}

function render() {
    let list = [...products];

    // Filter by Category
    if (activeCat !== 'All') list = list.filter(p => p.category === activeCat);

    // Search Filter
    const query = document.getElementById('search-bar').value.toLowerCase();
    if (query) list = list.filter(p => p.name.toLowerCase().includes(query));

    const grid = document.getElementById('product-list');
    grid.innerHTML = list.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
            <div style="margin-top:10px;">
                <p style="font-size:0.7rem; color:var(--gold); font-weight:700;">${p.category}</p>
                <h3 style="font-family:var(--heading-font); font-size:1.4rem;">${p.name}</h3>
                <p>Rs. ${p.on_request ? 'On Request' : p.price}</p>
                <button class="add-btn" onclick="addToBag(${p.id})">ADD TO BAG</button>
            </div>
        </div>
    `).join('');
}

window.addToBag = (id) => {
    const prod = products.find(p => p.id === id);
    cart.push(prod);
    localStorage.setItem('bd_cart', JSON.stringify(cart));
    updateUI();
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const body = document.getElementById('cart-items');
    body.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <span>${item.name}</span>
            <button onclick="removeItem(${index})" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

window.removeItem = (idx) => {
    cart.splice(idx, 1);
    localStorage.setItem('bd_cart', JSON.stringify(cart));
    updateUI();
};

function attachEvents() {
    document.getElementById('search-bar').oninput = render;
    
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            activeCat = btn.dataset.cat;
            render();
        };
    });

    // Modal Events
    document.getElementById('story-trigger').onclick = () => document.getElementById('story-modal').classList.add('open');
    document.getElementById('close-story').onclick = () => document.getElementById('story-modal').classList.remove('open');
    
    // Sidebar Events
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');

    document.getElementById('checkout-btn').onclick = () => {
        const text = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=New Order:%0A${text}`, '_blank');
    };
}

init();
