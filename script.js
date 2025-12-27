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
        <div class="product-card">
            <div class="img-container" onclick="window.viewImage('${p.img}', '${p.name}')">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">Rs. ${p.price}</div>
                <div class="card-actions">
                    <button class="add-btn" onclick="window.addToCart(${p.id})">
                        <i class="fas fa-plus"></i> ADD
                    </button>
                    <button class="icon-btn" onclick="window.viewImage('${p.img}', '${p.name}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn" onclick="window.shareProduct('${p.name}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Image Modal Logic
window.viewImage = (src, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-caption').innerText = title;
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
};

// Share Logic
window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    navigator.clipboard.writeText(`${text} ${window.location.href}`);
    alert("Link copied to clipboard!");
};

// Cart Logic
window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    const exists = cart.find(i => i.id === id);
    if (exists) exists.qty++; else cart.push({ ...p, qty: 1 });
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
    itemsDiv.innerHTML = cart.length === 0 ? '<p style="text-align:center; padding:20px;">Your bag is empty.</p>' : cart.map(item => `
        <div style="display:flex; gap:10px; padding:15px; border-bottom:1px solid #333; color:white;">
            <img src="${item.img}" style="width:40px; height:40px; object-fit:cover;">
            <div style="flex:1"><div>${item.name}</div><div style="color:var(--gold);">Rs. ${item.price}</div></div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.querySelector('.close-modal').onclick = () => document.getElementById('image-modal').style.display = "none";
    document.getElementById('clear-cart').onclick = () => { if(confirm("Empty bag?")) { cart = []; saveAndUpdate(); } };

    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat);
        };
    });

    document.getElementById('footer-feedback-btn').onclick = () => {
        window.open('https://wa.me/918105750221?text=Hi, I have feedback regarding Bannada Daara:', '_blank');
    };

    document.getElementById('checkout-btn').onclick = () => {
        const msg = cart.map(i => `${i.name} (x${i.qty})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${msg}`, '_blank');
    };
}

init();
