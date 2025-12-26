import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bd_cart')) || [];
let currentCategory = 'All';

function init() {
    renderProducts();
    setupCart();
    setupFeedback();
    setupFilters();
    updateCartUI();
}

function renderProducts() {
    const list = document.getElementById('product-list');
    const searchVal = document.getElementById('search-bar').value.toLowerCase();
    
    const filtered = products.filter(p => 
        (currentCategory === 'All' || p.category === currentCategory) &&
        (p.name.toLowerCase().includes(searchVal))
    );

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="image-box">
                <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=Handmade'">
                <button class="view-btn" onclick="window.viewImg('${p.img}', '${p.name}')"><i class="fa-solid fa-expand"></i> VIEW</button>
                <button class="share-btn" onclick="window.shareItem('${p.name}')"><i class="fa-solid fa-share-nodes"></i></button>
            </div>
            <h3 style="margin-top:20px; font-family: 'Cormorant Garamond', serif; font-size:1.5rem;">${p.name}</h3>
            <p style="color:#c5a059; font-weight:700; margin-bottom:15px;">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <button class="submit-feedback" style="background:#0a0a0a; border-radius:4px;" onclick="window.addToCart(${p.id})">ADD TO BAG</button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = products.find(item => item.id === id);
    cart.push(p);
    localStorage.setItem('bd_cart', JSON.stringify(cart));
    updateCartUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartBody = document.getElementById('cart-items');
    cartBody.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="window.removeFromCart(${idx})" style="border:none; background:none; color:red; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

window.removeFromCart = (idx) => {
    cart.splice(idx, 1);
    localStorage.setItem('bd_cart', JSON.stringify(cart));
    updateCartUI();
};

window.viewImg = (src, name) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('full-res-image').src = src;
    document.getElementById('viewer-caption').innerText = name;
    modal.style.display = "block";
};

window.shareItem = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    if (navigator.share) {
        navigator.share({ title: 'Bannada Daara', text: text, url: window.location.href });
    } else {
        alert("Copied to clipboard: " + text);
    }
};

function setupCart() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    document.querySelector('.close-viewer').onclick = () => document.getElementById('image-modal').style.display = "none";
    
    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Bag is empty");
        const list = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=New Order Request:%0A${list}`, '_blank');
    };
}

function setupFilters() {
    document.getElementById('search-bar').oninput = renderProducts;
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            renderProducts();
        };
    });
}

function setupFeedback() {
    const modal = document.getElementById('feedback-modal');
    document.getElementById('footer-feedback-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-feedback').onclick = () => modal.style.display = "none";
    
    document.getElementById('feedback-form').onsubmit = async (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        status.innerHTML = "Sending...";
        const res = await fetch(e.target.action, { method: 'POST', body: new FormData(e.target), headers: {'Accept': 'application/json'} });
        if(res.ok) {
            status.innerHTML = "Thank you! We've received your feedback.";
            e.target.reset();
            setTimeout(() => { modal.style.display = "none"; status.innerHTML = ""; }, 3000);
        }
    };
}

init();
