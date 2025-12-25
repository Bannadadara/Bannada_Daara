import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCart();
    setupFeedback();
    setupAnimations();

    // Search Interaction
    document.getElementById('search-bar').addEventListener('input', (e) => {
        renderProducts(document.getElementById('category-filter').value, e.target.value);
    });

    // Category Filter Interaction
    document.getElementById('category-filter').addEventListener('change', (e) => {
        renderProducts(e.target.value, document.getElementById('search-bar').value);
    });

    // Checkout Interaction
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty!");
        const items = cart.map(i => `- ${i.name} (${i.on_request ? "Price on Request" : "Rs. " + i.price})`).join('\n');
        const total = document.getElementById('cart-total').innerText;
        const msg = `*Order from Bannada Daara*\n\n*Shopping List:*\n${items}\n\n*Subtotal:* ${total}`;
        
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
        
        document.getElementById('thank-you-overlay').style.display = "block";
        cart = []; 
        updateUI();
        document.getElementById('cart-sidebar').classList.remove('open');
    };

    document.getElementById('close-success').onclick = () => {
        document.getElementById('thank-you-overlay').style.display = "none";
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (cat === 'All' || p.category === cat) && 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    list.innerHTML = filtered.map(p => `
        <div class="card reveal active">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300'">
            <h4>${p.name}</h4>
            <p style="color:#B12704; font-weight:bold;">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-btns">
                <button class="share-btn" onclick="copyProductLink(${p.id})">🔗</button>
                <button class="add-btn" onclick="addToCart(${p.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    cart.push(products.find(p => p.id === id));
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.copyProductLink = (id) => {
    const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
    navigator.clipboard.writeText(url).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "toast-notification show";
        setTimeout(() => toast.className = "toast-notification", 3000);
    });
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-items').innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #f0f0f0;">
            <div>
                <div style="font-weight:600;">${item.name}</div>
                <div style="font-size:0.8rem; color:#666;">${item.on_request ? 'Price on Request' : 'Rs. ' + item.price}</div>
            </div>
            <button onclick="window.removeItem(${idx})" style="color:#ff4d4d; border:none; background:none; cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
    document.getElementById('request-notice').style.display = cart.some(i => i.on_request) ? 'block' : 'none';
}

window.removeItem = (idx) => { cart.splice(idx, 1); updateUI(); };

function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupCart() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
}

function setupFeedback() {
    const m = document.getElementById('feedback-modal');
    document.getElementById('feedback-btn').onclick = () => m.style.display = "block";
    document.querySelector('.close-modal').onclick = () => m.style.display = "none";
    document.getElementById('submit-feedback-wa').onclick = () => {
        const txt = document.getElementById('feedback-text').value;
        if(txt) window.open(`https://wa.me/918105750221?text=${encodeURIComponent("*Feedback:* " + txt)}`, '_blank');
        m.style.display = "none";
    };
}

document.addEventListener('DOMContentLoaded', init);
