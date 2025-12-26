import { products } from './data.js';
let cart = [];

function init() {
    renderProducts(); setupCartControls(); setupFilters();
    setupImageViewer(); setupFeedback(); setupAboutInteraction();
}

function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );
    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="card-image-wrapper" onclick="window.openViewer('${p.img}', '${p.name}')">
                <img src="${p.img}" alt="${p.name}">
                <button class="view-overlay-btn">VIEW IMAGE</button>
            </div>
            <h4 style="margin-top:15px; font-family: 'Cormorant Garamond', serif;">${p.name}</h4>
            <p style="color:#c5a059; font-weight:600;">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <button class="add-btn" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
                <button onclick="window.shareProduct('${p.name}')" style="padding:10px; cursor:pointer;">📤</button>
            </div>
        </div>
    `).join('');
}

window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    if (navigator.share) { navigator.share({ title: 'Bannada Daara', text: text, url: window.location.href }); }
    else { alert("Link copied to clipboard!"); }
};

function setupAboutInteraction() {
    const btn = document.getElementById('read-more-btn');
    const content = document.getElementById('about-more-content');
    btn.onclick = () => {
        content.classList.toggle('show');
        btn.innerText = content.classList.contains('show') ? "SHOW LESS" : "READ OUR FULL STORY";
    };
}

window.addToCart = (id) => {
    cart.push(products.find(i => i.id === id));
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-items').innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <span>${item.name}</span><button onclick="window.removeCartItem(${idx})">&times;</button>
        </div>`).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

window.openViewer = (imgSrc, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('full-res-image').src = imgSrc;
    document.getElementById('viewer-caption').innerText = title;
    modal.style.display = "block";
};

function setupImageViewer() {
    const modal = document.getElementById('image-modal');
    document.querySelector('.close-viewer').onclick = () => modal.style.display = "none";
}

function setupFeedback() {
    const modal = document.getElementById('feedback-modal');
    document.getElementById('footer-feedback-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-feedback').onclick = () => modal.style.display = "none";
    document.getElementById('feedback-form').onsubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(e.target.action, { method: 'POST', body: new FormData(e.target), headers: {'Accept': 'application/json'} });
        if (res.ok) { document.getElementById('form-status').innerText = "Thank you!"; e.target.reset(); }
    };
}

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('checkout-btn').onclick = () => {
        const list = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${list}`, '_blank');
    };
}

function setupFilters() {
    document.getElementById('search-bar').oninput = (e) => renderProducts(document.querySelector('.cat-item.active').dataset.cat, e.target.value);
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, document.getElementById('search-bar').value);
        };
    });
}
init();
