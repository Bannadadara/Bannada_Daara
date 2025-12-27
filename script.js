import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupCartControls();
    setupFilters();
    setupImageViewer();
    setupLegacyPopup();
    updateUI();
}

// RENDER PRODUCTS
function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    document.getElementById('items-found').innerText = `${filtered.length} Products Found`;

    list.innerHTML = filtered.map(p => {
        // Fix NaN and Zero Price Logic
        const isRequest = p.on_request || p.price <= 0;
        const displayPrice = isRequest ? "As per order request" : `Rs. ${p.price}`;
        
        return `
        <div class="product-card">
            <div class="card-image-wrapper">
                <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
                <button class="view-overlay-btn" onclick="window.openViewer('${p.img}', '${p.name}')">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
            <div class="product-info">
                <h4 class="product-name">${p.name}</h4>
                <p class="product-price">${displayPrice}</p>
                <div class="card-actions">
                    <button class="add-btn" onclick="window.addToCart(${p.id})">
                        <i class="fas fa-cart-plus"></i> ADD TO BAG
                    </button>
                    <button class="share-btn" onclick="window.shareProduct('${p.name}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// CART LOGIC
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push({...product});
    saveAndSync();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeCartItem = (index) => {
    cart.splice(index, 1);
    saveAndSync();
};

function saveAndSync() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const count = document.getElementById('cart-count');
    const itemsDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    
    count.innerText = cart.length;
    
    itemsDiv.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <div>
                <p style="font-weight:600; font-size:0.9rem;">${item.name}</p>
                <p style="color:var(--gold); font-size:0.8rem;">${item.price > 0 ? 'Rs. '+item.price : 'On Request'}</p>
            </div>
            <button onclick="window.removeCartItem(${idx})" style="color:#ff4d4d; background:none; border:none; cursor:pointer;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    totalDiv.innerText = `Rs. ${total}`;
}

// SETUP CONTROLS
function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    document.getElementById('clear-cart').onclick = () => {
        if(confirm("Are you sure you want to clear your bag?")) {
            cart = [];
            saveAndSync();
        }
    };

    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Your bag is empty!");
        const list = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=New Order Request:%0A${list}`, '_blank');
    };
}

function setupLegacyPopup() {
    const modal = document.getElementById('legacy-modal');
    document.getElementById('legacy-btn').onclick = () => modal.style.display = 'flex';
    document.getElementById('close-legacy').onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };
}

window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: name, text: text, url: url });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
    }
};

function setupFilters() {
    const searchBar = document.getElementById('search-bar');
    searchBar.oninput = () => renderProducts(document.querySelector('.cat-item.active').dataset.cat, searchBar.value);
    
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, searchBar.value);
        };
    });
}

// Feedback via WhatsApp
document.getElementById('feedback-btn').onclick = () => {
    window.open(`https://wa.me/918105750221?text=Feedback for Bannada Daara:`, '_blank');
};

// Viewer Logic
window.openViewer = (src, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('full-res-image').src = src;
    document.getElementById('viewer-caption').innerText = title;
    modal.style.display = 'block';
};

function setupImageViewer() {
    const modal = document.getElementById('image-modal');
    document.querySelector('.close-viewer').onclick = () => modal.style.display = 'none';
}

init();
