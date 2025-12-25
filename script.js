import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();

    const sidebar = document.getElementById('cart-sidebar');
    const toggle = document.getElementById('cart-toggle');
    const close = document.getElementById('close-cart');

    toggle.onclick = () => sidebar.classList.add('open');
    close.onclick = () => sidebar.classList.remove('open');

    // Search and Filter
    document.getElementById('search-bar').oninput = (e) => {
        renderProducts(document.getElementById('category-filter').value, e.target.value);
    };
    document.getElementById('category-filter').onchange = (e) => {
        renderProducts(e.target.value, document.getElementById('search-bar').value);
    };

    // Checkout Logic
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty!");
        
        const items = cart.map(i => {
            const priceText = i.on_request ? "[Price on Request]" : `Rs. ${i.price}`;
            return `- ${i.name} (${priceText})`;
        }).join('\n');
        
        const total = document.getElementById('cart-total').innerText;
        const msg = `*Order from Bannada Daara*\n\n*Items:*\n${items}\n\n*Current Subtotal:* ${total}\n\n_Please confirm the final price for custom items._`;
        
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
    };
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
                <a href="${p.img}" target="_blank" class="view-btn">View</a>
                <button class="add-btn" onclick="addToCart(${p.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsList = document.getElementById('cart-items');
    
    itemsList.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
            <p style="margin:0; font-size:0.9rem;">${item.name} ${item.on_request ? '<span style="color:#B12704;">(*)</span>' : ''}</p>
            <button onclick="cart.splice(${index}, 1); updateUI();" style="color:red; background:none; border:none; cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    const hasRequestItem = cart.some(i => i.on_request);
    
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
    document.getElementById('request-notice').style.display = hasRequestItem ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', init);
