import { products } from './data.js';

let cart = JSON.parse(localStorage.getItem('bannada_cart')) || [];

function init() {
    renderProducts();
    setupCartControls();
    setupFilters();
    setupImageViewer();
    setupAboutInteraction();
    updateUI(); // Load existing cart
}

// Render products with "Price on Request" logic
function renderProducts(category = 'All', search = '') {
    const list = document.getElementById('product-list');
    const filtered = products.filter(p => 
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    document.getElementById('results-count').innerText = `Showing ${filtered.length} products`;

    list.innerHTML = filtered.map(p => {
        const displayPrice = (p.on_request || p.price === 0) 
            ? "Price as per order request" 
            : `Rs. ${p.price}`;

        return `
        <div class="product-card">
            <div class="card-image-wrapper">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Handmade'">
                <button class="view-btn-overlay" onclick="window.openViewer('${p.img}', '${p.name}')">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
            <div class="product-info">
                <h4 class="product-name">${p.name}</h4>
                <p class="product-price">${displayPrice}</p>
                <div class="card-actions">
                    <button class="add-btn" onclick="window.addToCart(${p.id})">
                        <i class="fas fa-plus"></i> ADD TO BAG
                    </button>
                    <button class="share-btn" onclick="window.shareProduct('${p.name}')" title="Share Product">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Image Viewer
window.openViewer = (imgSrc, title) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('full-res-image').src = imgSrc;
    document.getElementById('viewer-caption').innerText = title;
    modal.style.display = "block";
};

function setupImageViewer() {
    const modal = document.getElementById('image-modal');
    document.querySelector('.close-viewer').onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
}

// Cart Logic
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateUI();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeCartItem = (index) => {
    cart.splice(index, 1);
    updateUI();
};

function updateUI() {
    localStorage.setItem('bannada_cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    
    const itemsDiv = document.getElementById('cart-items');
    if (cart.length === 0) {
        itemsDiv.innerHTML = `<div style="text-align:center; padding:50px 20px; color:#666;">
            <i class="fas fa-shopping-bag" style="font-size:3rem; margin-bottom:15px; display:block;"></i>
            Your bag is empty.
        </div>`;
    } else {
        itemsDiv.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${(item.on_request || item.price === 0) ? 'Custom Order' : 'Rs. ' + item.price}</p>
                </div>
                <button onclick="window.removeCartItem(${idx})" style="margin-left:auto; color:#ff4444; background:none; border:none; cursor:pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Auto Total Calculator (Fixes NaN by treating "Request" as 0)
    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

function setupCartControls() {
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
    
    // Remove All Button
    document.getElementById('clear-cart-btn').onclick = () => {
        if(confirm("Empty your bag?")) {
            cart = [];
            updateUI();
        }
    };

    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Your bag is empty!");
        const list = cart.map(i => `- ${i.name} (${i.price === 0 ? 'Request' : 'Rs.'+i.price})`).join('%0A');
        window.open(`https://wa.me/918105750221?text=New Order Request from Website:%0A${list}`, '_blank');
    };

    // Feedback Button
    document.getElementById('footer-feedback-btn').onclick = () => {
        window.open(`https://wa.me/918105750221?text=Feedback: I love your collection!`, '_blank');
    };
}

// Share Product Function
window.shareProduct = (name) => {
    const text = `Check out this beautiful ${name} from Bannada Daara!`;
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: name, text: text, url: url });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
    }
};

function setupFilters() {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', () => {
        const activeCat = document.querySelector('.cat-item.active').dataset.cat;
        renderProducts(activeCat, searchBar.value);
    });

    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, searchBar.value);
        };
    });
}

function setupAboutInteraction() {
    const btn = document.getElementById('read-more-btn');
    const content = document.getElementById('about-more-content');
    btn.onclick = () => {
        content.classList.toggle('show');
        btn.innerHTML = content.classList.contains('show') 
            ? `SHOW LESS <i class="fas fa-chevron-up"></i>` 
            : `READ OUR FULL STORY <i class="fas fa-chevron-down"></i>`;
    };
}

init();
