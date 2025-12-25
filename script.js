import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCart();
    setupFeedback();
    setupScrollReveal();

    document.getElementById('search-bar').oninput = (e) => renderProducts('All', e.target.value);
    document.getElementById('category-filter').onchange = (e) => renderProducts(e.target.value);

    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Bag is empty!");
        const items = cart.map(i => `- ${i.name} (${i.on_request ? "Price on Request" : "Rs. " + i.price})`).join('\n');
        const total = document.getElementById('cart-total').innerText;
        const msg = `*Order:* \n${items}\n\n*Total:* ${total}`;
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
        document.getElementById('thank-you-overlay').style.display = "block";
        cart = []; updateUI();
        document.getElementById('cart-sidebar').classList.remove('open');
    };

    document.getElementById('close-success').onclick = () => document.getElementById('thank-you-overlay').style.display = "none";
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(search.toLowerCase()));

    list.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'">
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
        const t = document.getElementById("toast");
        t.className = "toast-notification show";
        setTimeout(() => t.className = "toast-notification", 3000);
    });
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-items').innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="window.removeItem(${idx})" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
    document.getElementById('request-notice').style.display = cart.some(i => i.on_request) ? 'block' : 'none';
}

window.removeItem = (idx) => { cart.splice(idx, 1); updateUI(); };

function setupScrollReveal() {
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
        const val = document.getElementById('feedback-text').value;
        if(val) window.open(`https://wa.me/918105750221?text=${encodeURIComponent(val)}`, '_blank');
        m.style.display = "none";
    };
}

document.addEventListener('DOMContentLoaded', init);
