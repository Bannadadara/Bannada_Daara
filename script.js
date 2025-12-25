import { products } from './data.js';

let cart = [];

function init() {
    renderProducts();

    // Sidebar Window Controls
    const sidebar = document.getElementById('cart-sidebar');
    document.getElementById('cart-toggle').onclick = () => sidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => sidebar.classList.remove('open');

    // Search and Filter logic
    document.getElementById('search-bar').oninput = (e) => {
        renderProducts(document.getElementById('category-filter').value, e.target.value);
    };
    
    document.getElementById('category-filter').onchange = (e) => {
        renderProducts(e.target.value, document.getElementById('search-bar').value);
    };

    // WhatsApp Integration
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your shopping bag is empty!");
        const itemsList = cart.map(i => `- ${i.name} (Rs. ${i.price})`).join('\n');
        const total = document.getElementById('cart-total').innerText;
        const msg = `*Order from Bannada Daara*\n\n*Products:*\n${itemsList}\n\n*Total:* ${total}`;
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(msg)}`, '_blank');
    };
}

function renderProducts(cat = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => {
        const matchCat = cat === 'All' || p.category === cat;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    list.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${p.name}</h3>
            <div class="pricing">
                <span class="curr-price">Rs. ${p.price}</span>
                ${p.oldPrice ? `<span class="old-price">Rs. ${p.oldPrice}</span>` : ''}
            </div>
            <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeFromBag = (index) => {
    cart.splice(index, 1);
    updateUI();
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <span>${item.name}</span>
            <button onclick="removeFromBag(${index})" style="background:none; border:none; color:red; cursor:pointer;">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

document.addEventListener('DOMContentLoaded', init);
