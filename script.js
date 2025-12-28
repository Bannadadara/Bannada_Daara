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
    if (!list) return;

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
 * Global Window Functions for HTML Access
 */
window.viewImage = (src, title) => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    modalImg.src = src;
    modalCaption.innerText = title;
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
 * Persistence & UI Update
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

    if (cartCount) cartCount.innerText = totalQty;
    if (cartTotal) cartTotal.innerText = `Rs. ${totalPrice}`;

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
                    <div class="qty-controls" style="display:flex; align-items:center; gap:10px;">
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
 * Event Listeners
 */
function setupEventListeners() {
    // Sidebar Controls
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart-btn').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    // Empty Cart
    document.getElementById('clear-cart').onclick = () => {
        if (cart.length > 0 && confirm("Remove all items from your bag?")) {
            cart = [];
            saveAndUpdate();
        }
    };

    // Category Filtering
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, document.getElementById('search-bar').value);
        };
    });

    // Search Bar
    document.getElementById('search-bar').addEventListener('input', (e) => {
        const activeCat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(activeCat, e.target.value);
    });

    // Feedback
    document.getElementById('footer-feedback-btn').onclick = () => {
        window.open('https://wa.me/918105750221?text=Hi, I have feedback regarding Bannada Daara:', '_blank');
    };

    // --- Order Popup Logic ---
    const addressModal = document.getElementById('address-modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const confirmWhatsapp = document.getElementById('confirm-whatsapp');
    const cancelPopup = document.getElementById('cancel-popup');

    checkoutBtn.onclick = () => {
        if (cart.length === 0) return alert("Please add items to your bag first!");
        addressModal.style.display = 'flex'; // Changed to flex for center centering
    };

    cancelPopup.onclick = () => {
        addressModal.style.display = 'none';
    };

    confirmWhatsapp.onclick = () => {
        const name = document.getElementById('cust-name').value.trim();
        const address = document.getElementById('cust-address').value.trim();

        if (!name || !address) {
            alert("Please fill in your name and delivery address.");
            return;
        }

        let message = `*NEW ORDER - BANNADA DAARA*%0A%0A`;
        message += `*Customer:* ${name}%0A`;
        message += `*Address:* ${address}%0A%0A`;
        message += `*Items:*%0A`;

        cart.forEach(i => {
            const isRequest = i.price === 0 || i.on_request === true;
            const priceLabel = isRequest ? "[Custom Quote]" : `Rs.${i.price * i.qty}`;
            message += `• ${i.name} [x${i.qty}] - ${priceLabel}%0A`;
        });

        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        message += `%0A*Total Amount: Rs.${total}*`;

        const phoneNumber = "918105750221"; 
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        
        addressModal.style.display = 'none';
        cart = []; // Optional: clear cart after ordering
        saveAndUpdate();
    };

    // Image Modal Close
    const imgModal = document.getElementById('image-modal');
    document.querySelector('.close-modal').onclick = () => imgModal.style.display = "none";
    window.onclick = (e) => { 
        if (e.target == imgModal) imgModal.style.display = "none"; 
        if (e.target == addressModal) addressModal.style.display = "none";
    };
}

// Run Application
init();
