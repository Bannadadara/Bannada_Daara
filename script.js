import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bannada_cart')) || [];

function init() {
    renderProducts();
    setupCartControls();
    setupUIInteractions();
    updateCartDisplay();
}

// 1. RESOLVE NaN & DISPLAY PRICE LOGIC
function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => {
        // Fix: If value is 0 or NaN, label as "As per order request"
        const isRequest = !p.price || p.price <= 0 || isNaN(p.price);
        const priceTag = isRequest ? "As per order request" : `Rs. ${p.price}`;

        return `
        <div class="product-card">
            <div style="position:relative;">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <button class="view-btn" onclick="window.viewImage('${p.img}')">VIEW PRODUCT</button>
            </div>
            <h4 style="font-family:'Cormorant Garamond'; font-size:1.3rem; margin:15px 0 5px;">${p.name}</h4>
            <p style="color:#D4AF37; font-weight:700; margin-bottom:15px;">${priceTag}</p>
            <div style="display:flex; gap:8px; margin-top:auto;">
                <button class="add-btn" onclick="window.addToCart(${p.id})"><i class="fas fa-plus"></i> BAG</button>
                <button class="share-btn" onclick="window.shareProduct('${p.name}')"><i class="fas fa-share-alt"></i></button>
            </div>
        </div>
    `}).join('');
}

// 2. ADVANCED CART CALCULATOR
function updateCartDisplay() {
    const count = document.getElementById('cart-count');
    const itemsDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    
    count.innerText = cart.length;
    itemsDiv.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:15px 0;">
            <div>
                <p style="font-weight:600; font-size:0.9rem;">${item.name}</p>
                <p style="color:#D4AF37; font-size:0.8rem;">${item.price > 0 ? 'Rs.' + item.price : 'On Request'}</p>
            </div>
            <button onclick="window.removeFromCart(${idx})" style="background:none; border:none; color:red; cursor:pointer;">&times;</button>
        </div>
    `).join('');

    // Automatic total (NaN-Safe)
    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    totalDiv.innerText = `Rs. ${total}`;
}

window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    cart.push({...p});
    syncCart();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeFromCart = (idx) => {
    cart.splice(idx, 1);
    syncCart();
};

function syncCart() {
    localStorage.setItem('bannada_cart', JSON.stringify(cart));
    updateCartDisplay();
}

// 3. UI ACTIONS (LEGACY POPUP & SHARE)
function setupUIInteractions() {
    // Legacy Popup
    const modal = document.getElementById('legacy-modal');
    document.getElementById('legacy-open-btn').onclick = () => modal.style.display = 'flex';
    document.getElementById('legacy-close').onclick = () => modal.style.display = 'none';

    // Share Product
    window.shareProduct = (name) => {
        const text = `Check out this handcrafted ${name} from Bannada Daara!`;
        if (navigator.share) {
            navigator.share({ title: name, text: text, url: window.location.href });
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
        }
    };

    // Feedback
    document.getElementById('feedback-whatsapp').onclick = () => {
        window.open(`https://wa.me/918105750221?text=Feedback regarding Bannada Daara:`, '_blank');
    };
}

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    // Remove All Button
    document.getElementById('remove-all-cart').onclick = () => {
        if(confirm("Empty your bag?")) {
            cart = [];
            syncCart();
        }
    };

    // WhatsApp Order
    document.getElementById('whatsapp-order').onclick = () => {
        if(cart.length === 0) return alert("Bag is empty!");
        const items = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${items}`, '_blank');
    };
}

window.viewImage = (src) => {
    const viewer = document.getElementById('image-viewer');
    document.getElementById('full-img').src = src;
    viewer.style.display = 'flex';
};

document.querySelector('.close-viewer').onclick = () => document.getElementById('image-viewer').style.display = 'none';

init();
