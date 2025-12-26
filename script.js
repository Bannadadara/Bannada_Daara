import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd_cart')) || [];
let activeCat = 'All';
let activeSort = 'default';

function init() {
    render();
    updateUI();
    attachEvents();
}

function render() {
    let list = [...products];

    // 1. Filter Category
    if (activeCat !== 'All') {
        list = list.filter(p => p.category === activeCat);
    }

    // 2. Search query
    const query = document.getElementById('main-search').value.toLowerCase();
    if (query) {
        list = list.filter(p => p.name.toLowerCase().includes(query));
    }

    // 3. Sorting
    if (activeSort === 'low') {
        list.sort((a, b) => (a.on_request ? 9999 : a.price) - (b.on_request ? 9999 : b.price));
    } else if (activeSort === 'high') {
        list.sort((a, b) => (b.on_request ? 0 : b.price) - (a.on_request ? 0 : a.price));
    }

    const grid = document.getElementById('product-list');
    grid.innerHTML = list.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
            <div class="p-category" style="font-size:0.7rem; color:var(--amazon-gold-hover); font-weight:700; text-transform:uppercase; margin-top:10px;">${p.category}</div>
            <h3>${p.name}</h3>
            <div class="card-price">${p.on_request ? 'Price on Request' : '₹' + p.price}</div>
            <button class="add-btn" onclick="addToBag(${p.id})">ADD TO BAG</button>
        </div>
    `).join('');
}

window.addToBag = (id) => {
    const prod = products.find(p => p.id === id);
    cart.push(prod);
    localStorage.setItem('bd_cart', JSON.stringify(cart));
    updateUI();
    showToast(`${prod.name} added!`);
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const body = document.getElementById('cart-items');
    
    body.innerHTML = cart.map((item, index) => `
        <div style="display:flex; gap:15px; padding-bottom:15px; border-bottom:1px solid #eee; margin-bottom:15px;">
            <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
            <div style="flex:1;">
                <p style="font-weight:600; font-size:0.9rem;">${item.name}</p>
                <p>${item.on_request ? 'On Request' : '₹' + item.price}</p>
            </div>
            <button onclick="removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.on_request ? 0 : item.price), 0);
    document.getElementById('cart-total').innerText = `₹${total}`;
}

window.removeItem = (idx) => {
    cart.splice(idx, 1);
    localStorage.setItem('bd_cart', JSON.stringify(cart));
    updateUI();
};

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function attachEvents() {
    // Search
    document.getElementById('main-search').oninput = () => render();

    // Sort
    document.getElementById('sort-select').onchange = (e) => {
        activeSort = e.target.value;
        render();
    };

    // Category Filter
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-btn.active').classList.remove('active');
            btn.classList.add('active');
            activeCat = btn.dataset.cat;
            render();
        };
    });

    // Modal & Sidebar Toggles
    document.getElementById('story-trigger').onclick = () => document.getElementById('story-modal').classList.add('open');
    document.getElementById('close-story').onclick = () => document.getElementById('story-modal').classList.remove('open');
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
}

window.checkout = () => {
    if (cart.length === 0) return alert("Bag is empty!");
    const text = cart.map(i => `- ${i.name} (${i.on_request ? 'Requesting Quote' : '₹' + i.price})`).join('%0A');
    window.open(`https://wa.me/918105750221?text=New Order Request from Bannada Daara:%0A${text}`, '_blank');
};

init();
