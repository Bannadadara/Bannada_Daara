import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];
let currentCategory = 'All';
let currentSort = 'default';

function init() {
    render();
    updateCartUI();
    setupCoreLogic();
    setupStoryModal();
}

function render() {
    let filtered = [...products];

    // Category Filter
    if (currentCategory !== 'All') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Search Filter
    const query = document.getElementById('main-search').value.toLowerCase();
    if (query) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    }

    // Sorting
    if (currentSort === 'low') filtered.sort((a, b) => a.price - b.price);
    if (currentSort === 'high') filtered.sort((a, b) => b.price - a.price);

    const list = document.getElementById('product-list');
    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
            <div style="padding-top:15px;">
                <p style="font-size:0.7rem; color:var(--gold); font-weight:700;">${p.category}</p>
                <h3 style="font-family:'Playfair Display', serif; margin:5px 0;">${p.name}</h3>
                <div style="font-size:1.3rem; font-weight:700;">₹${p.price}</div>
                <button class="add-to-bag" onclick="addToCart(${p.id})">ADD TO BAG</button>
                <button onclick="shareItem('${p.name}')" style="background:none; border:none; color:#007185; font-size:0.8rem; cursor:pointer; margin-top:10px;">
                    <i class="fa-solid fa-share-nodes"></i> Share
                </button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    cart.push(p);
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateCartUI();
    showToast(`${p.name} added!`);
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsEl = document.getElementById('cart-items');
    itemsEl.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; gap:15px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <img src="${item.img}" style="width:50px; height:50px; border-radius:4px; object-fit:cover;">
            <div style="flex:1;">
                <p style="font-weight:600; font-size:0.9rem;">${item.name}</p>
                <p>₹${item.price}</p>
            </div>
            <button onclick="removeFromCart(${idx})" style="border:none; color:red; background:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    document.getElementById('cart-total').innerText = `₹${total}`;
}

window.removeFromCart = (idx) => {
    cart.splice(idx, 1);
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateCartUI();
};

function showToast(msg) {
    const t = document.getElementById('toast-notify');
    t.innerText = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function setupCoreLogic() {
    document.getElementById('main-search').oninput = () => render();
    document.getElementById('price-sort').onchange = (e) => { currentSort = e.target.value; render(); };
    
    document.querySelectorAll('.filter-link').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-link.active').classList.remove('active');
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            render();
        };
    });

    document.getElementById('cart-trigger').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Bag is empty");
        const list = cart.map(i => `- ${i.name} (₹${i.price})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=New Order Request:%0A${list}`, '_blank');
    };
}

function setupStoryModal() {
    const modal = document.getElementById('story-modal');
    document.getElementById('story-trigger').onclick = () => modal.classList.add('open');
    document.getElementById('close-story').onclick = () => modal.classList.remove('open');
}

window.shareItem = (name) => {
    if (navigator.share) {
        navigator.share({ title: 'Bannada Daara', text: `Check out this ${name}`, url: window.location.href });
    } else {
        showToast("Link copied!");
    }
}

init();
