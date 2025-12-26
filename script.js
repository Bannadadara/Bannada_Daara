import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();
    setupCartControls();
    setupSearch();
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
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
            <h4 style="margin: 10px 0 5px 0; font-size: 1rem;">${p.name}</h4>
            <div style="color: #B12704; font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">
                ${p.on_request ? 'Price on Request' : 'Rs. ' + p.price}
            </div>
            <button class="amazon-btn" onclick="window.addToCart(${p.id})">Add to Cart</button>
            <button onclick="window.shareProduct('${p.name}')" style="background:none; border:none; color:#007185; cursor:pointer; margin-top:10px; font-size:0.8rem;">Share Item</button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const p = products.find(i => i.id === id);
    cart.push(p);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeCartItem = (index) => {
    cart.splice(index, 1);
    updateUI();
};

function updateUI() {
    const count = cart.length;
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-count-inner').innerText = count;
    
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <div>
                <div style="font-weight:bold;">${item.name}</div>
                <button onclick="window.removeCartItem(${index})" style="background:none; border:none; color:#007185; cursor:pointer; padding:0;">Delete</button>
            </div>
            <div style="font-weight:bold;">Rs. ${item.price || 0}</div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Your cart is empty!");
        const list = cart.map(i => `- ${i.name}`).join('%0A');
        window.open(`https://wa.me/918105750221?text=Amazon-Style Order:%0A${list}`, '_blank');
    };
}

function setupSearch() {
    const bar = document.getElementById('search-bar');
    bar.oninput = () => renderProducts('All', bar.value);
}

function setupFeedback() {
    const modal = document.getElementById('feedback-modal');
    document.getElementById('feedback-trigger').onclick = () => modal.style.display = 'flex';
    document.getElementById('close-feedback').onclick = () => modal.style.display = 'none';
}

init();
