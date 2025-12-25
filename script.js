import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCartControls();
    setupFilters();
    setupAboutInteraction();
    setupFeedbackModal();
    setupScrollAnimations();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card reveal active">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
            <h4 class="product-name">${p.name}</h4>
            <p class="product-price">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-actions">
                <button class="add-btn" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
                <button class="share-btn" onclick="window.shareProduct('${p.name}')">📤</button>
            </div>
        </div>
    `).join('');
}

// Global Shop Functions
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeCartItem = (idx) => {
    cart.splice(idx, 1);
    updateCartUI();
};

window.shareProduct = async (name) => {
    const shareText = `Check out this beautiful ${name} from Bannada Daara!`;
    if (navigator.share) {
        try { await navigator.share({ title: 'Bannada Daara', text: shareText, url: window.location.href }); } catch (err) {}
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`);
    }
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    
    itemsContainer.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <div>
                <strong>${item.name}</strong><br>
                <span style="color:var(--gold)">${item.on_request ? 'Req Price' : 'Rs.' + item.price}</span>
            </div>
            <button onclick="window.removeCartItem(${idx})" style="border:none; background:none; color:#ccc; cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

function setupAboutInteraction() {
    const btn = document.getElementById('read-more-btn');
    const content = document.getElementById('about-more-content');
    btn.onclick = () => {
        content.classList.toggle('show');
        btn.innerText = content.classList.contains('show') ? "SHOW LESS" : "READ OUR FULL STORY";
    };
}

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

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Select items first!");
        const orderList = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${orderList}`, '_blank');
    };
}

function setupFeedbackModal() {
    const overlay = document.getElementById('feedback-overlay');
    document.getElementById('footer-feedback-btn').onclick = () => overlay.style.display = 'flex';
    document.getElementById('close-feedback').onclick = () => overlay.style.display = 'none';
    
    document.getElementById('send-feedback-wa').onclick = () => {
        const val = document.getElementById('feedback-text').value;
        if (val) window.open(`https://wa.me/918105750221?text=Feedback: ${encodeURIComponent(val)}`);
        overlay.style.display = 'none';
    };
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

init();
