import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCartControls();
    setupFilters();
    setupImageViewer();
    setupFeedback();
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
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
                <button class="view-overlay-btn">VIEW IMAGE</button>
            </div>
            <h4 class="product-name" style="margin-top:15px; font-family: 'Cormorant Garamond', serif; font-size:1.4rem;">${p.name}</h4>
            <p style="color:#c5a059; font-weight:600; margin-bottom:15px;">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div style="display:flex; gap:10px;">
                <button class="add-btn" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
                <button class="share-btn" onclick="window.shareProduct('${p.name}')">📤</button>
            </div>
        </div>
    `).join('');
}

// SHARE PRODUCT
window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    if (navigator.share) {
        navigator.share({ title: 'Bannada Daara', text: text, url: window.location.href });
    } else {
        alert("Copied to clipboard: " + text);
    }
};

// IMAGE VIEWER
window.openViewer = (imgSrc, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('full-res-image').src = imgSrc;
    document.getElementById('viewer-caption').innerText = title;
    modal.style.display = "block";
};

function setupImageViewer() {
    const modal = document.getElementById('image-modal');
    document.querySelector('.close-viewer').onclick = () => modal.style.display = "none";
    window.addEventListener('click', (e) => { if (e.target == modal) modal.style.display = "none"; });
}

// FEEDBACK FORM
function setupFeedback() {
    const modal = document.getElementById('feedback-modal');
    const status = document.getElementById('form-status');
    document.getElementById('footer-feedback-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-feedback').onclick = () => modal.style.display = "none";

    document.getElementById('feedback-form').onsubmit = async (e) => {
        e.preventDefault();
        status.innerHTML = "Sending...";
        const response = await fetch(e.target.action, {
            method: 'POST',
            body: new FormData(e.target),
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            status.style.color = "green";
            status.innerHTML = "Thank you for your feedback!";
            e.target.reset();
            setTimeout(() => { modal.style.display = "none"; status.innerHTML = ""; }, 3000);
        }
    };
}

// CART LOGIC
window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    cart.push(p);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="window.removeCartItem(${idx})" style="border:none; background:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

window.removeCartItem = (idx) => {
    cart.splice(idx, 1);
    updateUI();
};

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('checkout-btn').onclick = () => {
        const list = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Order Request:%0A${list}`, '_blank');
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

init();
