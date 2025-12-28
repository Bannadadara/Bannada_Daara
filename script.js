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
 * Render Product Grid
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
                <img src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price" style="color: ${isRequestOnly ? 'var(--gold)' : '#B12704'}">${priceDisplay}</div>
                <div class="card-actions">
                    <button class="add-btn" onclick="window.addToCart(${p.id})">
                        <i class="fas ${btnIcon}"></i> ${btnText}
                    </button>
                    <button class="icon-btn" onclick="window.viewImage('${p.img}', '${p.name}')" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn" onclick="window.shareProduct('${p.name}')" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

/**
 * Global UI Helpers (Available in HTML)
 */
window.viewImage = (src, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-caption').innerText = title;
    modal.style.display = "flex";
};

window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'Bannada Daara', text: text, url: url });
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert("Link copied to clipboard!");
    }
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

/**
 * Persistence Logic
 */
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
        itemsDiv.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:#888;">
                <i class="fas fa-shopping-basket" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.3;"></i>
                <p>Your bag is empty.</p>
            </div>`;
    } else {
        itemsDiv.innerHTML = cart.map(item => {
            const isRequest = item.on_request === true || item.price === 0;
            return `
            <div class="cart-item-row" style="display:flex; gap:15px; padding:15px 0; border-bottom:1px solid #333; color:white;">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:0.9rem; margin-bottom: 2px;">${item.name}</div>
                    <div style="color:#c5a059; font-size: 0.85rem; margin-bottom: 8px;">
                        ${isRequest ? 'Price on Request' : 'Rs. ' + item.price}
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, -1)">-</button>
                        <span class="item-qty" style="color:#c5a059; font-weight:bold;">${item.qty}</span>
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div style="font-weight:600; font-size:0.9rem;">
                    ${isRequest ? '--' : 'Rs. ' + (item.price * item.qty)}
                </div>
            </div>`;
        }).join('');
    }
}

/**
 * Core Event Listeners
 */
function setupEventListeners() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const orderModal = document.getElementById('order-modal');

    // Sidebar Toggles
    document.getElementById('cart-toggle').onclick = () => cartSidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => cartSidebar.classList.remove('open');
    
    // Back Button (New Button)
    const backBtn = document.getElementById('close-cart-back');
    if (backBtn) backBtn.onclick = () => cartSidebar.classList.remove('open');

    // Image Modal Toggle
    const imgModal = document.getElementById('image-modal');
    document.querySelector('.close-modal').onclick = () => imgModal.style.display = "none";

    // Clear Cart
    document.getElementById('clear-cart').onclick = () => {
        if (cart.length > 0 && confirm("Remove all items from your bag?")) {
            cart = [];
            saveAndUpdate();
        }
    };

    // Filters
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

    // --- Order Checkout Logic ---
    
    // 1. Open Order Details Modal
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Please add items to your bag first!");
        orderModal.style.display = "flex";
    };

    // 2. Close Modal Logic
    document.querySelector('.close-order-modal').onclick = () => orderModal.style.display = "none";
    
    // 3. Confirm & Send to WhatsApp
    document.getElementById('confirm-order-btn').onclick = () => {
        const name = document.getElementById('cust-name').value.trim();
        const address = document.getElementById('cust-address').value.trim();

        if (!name || !address) {
            return alert("Please fill in your name and address to proceed.");
        }

        // Generate Item List for WhatsApp
        const cartText = cart.map(item => {
            const isRequest = item.price === 0 || item.on_request;
            const priceInfo = isRequest ? "[Price on Request]" : `Rs.${item.price * item.qty}`;
            return `• ${item.name} (x${item.qty}) - ${priceInfo}`;
        }).join('%0A');

        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        
        // Final WhatsApp Template
        const waMsg = `*New Order - Bannada Daara*%0A%0A` +
                      `*Customer Details*%0A` +
                      `*Name:* ${name}%0A` +
                      `*Address:* ${address}%0A%0A` +
                      `*Order Items:*%0A${cartText}%0A%0A` +
                      `*Total Estimated:* Rs. ${total}%0A%0A` +
                      `_Please confirm availability and delivery time._`;
        
        window.open(`https://wa.me/918105750221?text=${waMsg}`, '_blank');
        
        // Finalize: Hide modal and hide sidebar
        orderModal.style.display = "none";
        cartSidebar.classList.remove('open');
    };

    // Global click-away listeners
    window.onclick = (event) => {
        if (event.target == imgModal) imgModal.style.display = "none";
        if (event.target == orderModal) orderModal.style.display = "none";
    };
}

// Run Application
init();
