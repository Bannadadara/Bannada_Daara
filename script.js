import { products } from './data.js';

// Initialize cart from LocalStorage or empty array
let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

/**
 * Initialize the Application
 */
function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

/**
 * Render Product Grid with Animations & Custom Badges
 */
function renderProducts(category = 'All', searchTerm = '') {
    const list = document.getElementById('product-list');
    
    const filtered = products.filter(p => {
        const matchesCategory = category === 'All' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px; color: #888;">
                <i class="fas fa-search" style="font-size: 3rem; color: #c5a059; opacity: 0.5; margin-bottom: 20px;"></i>
                <h3 style="color: #333; margin-bottom: 10px;">No Treasures Found</h3>
                <p>Try adjusting your search or category filters.</p>
            </div>`;
        return;
    }

    list.innerHTML = filtered.map((p, index) => {
        const isRequestOnly = p.on_request === true || p.price === 0;
        const priceDisplay = isRequestOnly ? "Price on Request" : `Rs. ${p.price}`;
        const btnText = isRequestOnly ? "INQUIRE" : "ADD TO BAG";
        const btnIcon = isRequestOnly ? "fa-envelope" : "fa-plus";
        const badgeHTML = isRequestOnly ? `<div class="request-badge">Custom Order</div>` : '';

        return `
        <div class="product-card" style="animation-delay: ${index * 0.05}s">
            <div class="img-container" onclick="window.viewImage('${p.img}', '${p.name}')">
                ${badgeHTML}
                <img src="${p.img}" alt="${p.name}" loading="lazy" style="width:100%; aspect-ratio:1/1; object-fit:cover;">
            </div>
            <div class="product-info">
                <div class="product-name" style="font-weight:600; margin-top:10px;">${p.name}</div>
                <div class="product-price" style="color: ${isRequestOnly ? 'var(--gold)' : '#B12704'}; margin: 5px 0;">${priceDisplay}</div>
                <div class="card-actions" style="display:flex; gap:10px;">
                    <button class="add-btn" onclick="window.addToCart(${p.id})" style="flex:1; padding:10px; background:var(--black); color:white; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                        <i class="fas ${btnIcon}"></i> ${btnText}
                    </button>
                    <button class="icon-btn" onclick="window.viewImage('${p.img}', '${p.name}')" title="Quick View" style="padding:10px; background:#f4f4f4; border:none; cursor:pointer;">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;}).join('');
}

/**
 * Global Window Functions
 */
window.viewImage = (src, title) => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    modalImg.src = src;
    modalCaption.innerText = title;
    modal.style.display = "flex";
};

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    const exists = cart.find(i => i.id === id);
    if (exists) {
        exists.qty++;
    } else {
        cart.push({ ...p, qty: 1 });
    }
    saveAndUpdate();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.changeQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveAndUpdate();
};

function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const itemsDiv = document.getElementById('cart-items');

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    cartCount.innerText = totalQty;
    cartTotal.innerText = `Rs. ${totalPrice}`;

    if (cart.length === 0) {
        itemsDiv.innerHTML = `<div style="text-align:center; padding:60px 20px; color:#888;"><p>Your bag is empty.</p></div>`;
    } else {
        itemsDiv.innerHTML = cart.map(item => {
            const isRequest = item.on_request === true || item.price === 0;
            return `
            <div class="cart-item-row" style="display:flex; gap:15px; padding:15px 0; border-bottom:1px solid #333; color:white;">
                <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                <div style="flex:1">
                    <div style="font-size:0.85rem; font-weight:600;">${item.name}</div>
                    <div class="qty-controls" style="display:flex; align-items:center; gap:10px; margin-top:5px;">
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, -1)" style="padding:2px 8px; cursor:pointer;">-</button>
                        <span style="color:var(--gold)">${item.qty}</span>
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, 1)" style="padding:2px 8px; cursor:pointer;">+</button>
                    </div>
                </div>
                <div style="font-weight:600; font-size:0.85rem;">${isRequest ? '--' : 'Rs.' + (item.price * item.qty)}</div>
            </div>`;
        }).join('');
    }
}

/**
 * Custom Checkout Modal Flow
 */
window.openCheckoutModal = () => {
    if (cart.length === 0) return alert("Please add items to your bag first!");
    
    const modalHTML = `
        <div id="checkout-modal" class="modal-form-bg" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:4000; display:flex; align-items:center; justify-content:center;">
            <div class="form-card" style="background:white; padding:30px; border-radius:15px; width:90%; max-width:400px; animation: fadeInUp 0.4s ease;">
                <h3 style="margin-bottom:20px; font-family:'Cormorant Garamond', serif; font-size:1.6rem; color:#111;">Order Details</h3>
                <input type="text" id="cust-name" placeholder="Full Name" style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                <textarea id="cust-address" placeholder="Delivery Address (House No, Pincode, etc.)" style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px; height:80px;"></textarea>
                <button id="confirm-wa" class="checkout-btn" style="width:100%; padding:15px; background:linear-gradient(45deg, #25D366, #128C7E); color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                    PLACE ORDER VIA WHATSAPP <i class="fab fa-whatsapp"></i>
                </button>
                <button onclick="document.getElementById('checkout-modal').remove()" style="width:100%; background:none; border:none; color:#888; margin-top:15px; cursor:pointer;">Cancel</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('confirm-wa').onclick = () => {
        const name = document.getElementById('cust-name').value;
        const addr = document.getElementById('cust-address').value;
        if (!name || !addr) return alert("Please provide your name and address.");

        const cartList = cart.map(i => `• ${i.name} [x${i.qty}]`).join('%0A');
        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const message = `Hello Bannada Daara!%0A%0A*New Order*%0AName: ${name}%0AAddress: ${addr}%0A%0A*Items:*%0A${cartList}%0A%0A*Total: Rs.${total}*`;
        
        window.open(`https://wa.me/918105750221?text=${message}`, '_blank');
        document.getElementById('checkout-modal').remove();
    };
};

function setupEventListeners() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('checkout-btn').onclick = window.openCheckoutModal;

    const imgModal = document.getElementById('image-modal');
    document.querySelector('.close-modal').onclick = () => imgModal.style.display = "none";

    document.getElementById('clear-cart').onclick = () => {
        if (cart.length > 0 && confirm("Clear your bag?")) {
            cart = [];
            saveAndUpdate();
        }
    };

    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, document.getElementById('search-bar').value);
        };
    });

    document.getElementById('search-bar').addEventListener('input', (e) => {
        const activeCat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(activeCat, e.target.value);
    });
}

init();
