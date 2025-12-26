import { products } from './data.js';
let cart = [];

function init() {
    renderProducts(); setupCartControls(); setupFilters();
    setupImageViewer(); setupAboutInteraction(); setupFeedback();
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
                <button onclick="window.shareProduct('${p.name}')" style="padding:10px; cursor:pointer; border:none; background:#f0f0f0;">📤</button>
            </div>
        </div>
    `).join('');
}

window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    if (navigator.share) { navigator.share({ title: 'Bannada Daara', text: text, url: window.location.href }); }
    else { alert("Link copied to clipboard!"); }
};

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

// ... include window.openViewer, addToCart, setupCartControls, setupFilters, setupAboutInteraction from original script.js ...

init();
