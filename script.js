import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCartControls();
    setupFeedback();
    handleSharedProduct();

    // Search and Filter Logic
    document.getElementById('search-bar').oninput = (e) => {
        renderProducts(document.getElementById('category-filter').value, e.target.value);
    };
    document.getElementById('category-filter').onchange = (e) => {
        renderProducts(e.target.value, document.getElementById('search-bar').value);
    };

    // Checkout via WhatsApp
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty!");
        const items = cart.map(i => `- ${i.name} (${i.on_request ? "Price on Request" : "Rs. " + i.price})`).join('\n');
        const total = document.getElementById('cart-total').innerText;
        const msg = `*New Order: Bannada Daara*\n\n*Items:*\n${items}\n\n*Total:* ${total}`;
        
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
        
        // Show Success Message
        document.getElementById('thank-you-overlay').style.display = "block";
        cart = []; // Clear cart after order
        updateUI();
        document.getElementById('cart-sidebar').classList.remove('open');
    };

    document.getElementById('close-success').onclick = () => {
        document.getElementById('thank-you-overlay').style.display = "none";
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(search.toLowerCase()));

    list.innerHTML = filtered.map(p => `
        <div class="card" id="product-${p.id}">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h4>${p.name}</h4>
            <p style="color:#B12704; font-weight:bold;">${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}</p>
            <div class="card-btns">
                <button class="share-btn" onclick="copyProductLink(${p.id})">🔗</button>
                <a href="${p.img}" target="_blank" class="view-btn">View</a>
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
        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee;">
            <span>${item.name} ${item.on_request ? '<small>(*)</small>' : ''}</span>
            <button onclick="window.removeItem(${idx})" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
    document.getElementById('request-notice').style.display = cart.some(i => i.on_request) ? 'block' : 'none';
}

window.removeItem = (idx) => { cart.splice(idx, 1); updateUI(); };

function setupCartControls() {
    const sidebar = document.getElementById('cart-sidebar');
    document.getElementById('cart-toggle').onclick = () => sidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => sidebar.classList.remove('open');
}

function setupFeedback() {
    const modal = document.getElementById('feedback-modal');
    document.getElementById('feedback-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-modal').onclick = () => modal.style.display = "none";
    document.getElementById('submit-feedback-wa').onclick = () => {
        const txt = document.getElementById('feedback-text').value;
        if(!txt) return alert("Please type your feedback.");
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent("*Site Feedback:* " + txt)}`, '_blank');
        modal.style.display = "none";
    };
}

function handleSharedProduct() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) setTimeout(() => {
        const el = document.getElementById(`product-${id}`);
        if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.style.border = "2px solid #fb641b"; }
    }, 600);
}

document.addEventListener('DOMContentLoaded', init);
