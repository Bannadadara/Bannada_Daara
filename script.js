import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];

function init() {
    renderProducts();
    setupEventListeners();
    updateUI();
}

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
                </div>
            </div>
        </div>
    `;}).join('');
}

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
        itemsDiv.innerHTML = `<p style="text-align:center; padding:40px; color:#888;">Your bag is empty.</p>`;
    } else {
        itemsDiv.innerHTML = cart.map(item => {
            const isRequest = item.on_request === true || item.price === 0;
            return `
            <div class="cart-item-row">
                <img src="${item.img}" style="width:50px; height:50px; border-radius:4px;">
                <div style="flex:1">
                    <div style="font-size:0.85rem;">${item.name}</div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div style="font-weight:600;">${isRequest ? '--' : 'Rs.' + (item.price * item.qty)}</div>
            </div>`;
        }).join('');
    }
}

function setupEventListeners() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    // Close modal
    const modal = document.getElementById('image-modal');
    document.querySelector('.close-modal').onclick = () => modal.style.display = "none";

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

    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Please add items to your bag first!");
        
        // Collect User Details
        const userName = prompt("Please enter your name:");
        if (!userName) return;
        const address = prompt("Please enter your delivery address:");
        if (!address) return;

        const cartList = cart.map(i => {
            const isRequest = i.price === 0 || i.on_request === true;
            return `• ${i.name} [x${i.qty}] ${isRequest ? '(Custom)' : '- Rs.' + (i.price * i.qty)}`;
        }).join('%0A');
        
        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        
        const message = `Hello Bannada Daara!%0A%0A*Order Details:*%0AName: ${userName}%0AAddress: ${address}%0A%0A*Items:*%0A${cartList}%0A%0A*Total: Rs.${total}*`;
        
        window.open(`https://wa.me/918105750221?text=${message}`, '_blank');
    };
}

init();
