import { products as initialProducts } from './data.js';

// 1. STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('bd-cart')) || [];
let allProducts = [];

/**
 * Initialize the Application
 */
function init() {
    loadAllProducts();
    renderProducts();
    setupEventListeners();
    updateUI();
}

function loadAllProducts() {
    const customProducts = JSON.parse(localStorage.getItem('bd-custom-products')) || [];
    const hiddenIds = JSON.parse(localStorage.getItem('bd-hidden-products')) || [];

    // Merge static + custom
    let merged = [...initialProducts, ...customProducts];

    // Filter out hidden ones
    allProducts = merged.filter(p => !hiddenIds.includes(p.id));
}

// 2. PRODUCT DETAIL LOGIC
window.currentProduct = null;

window.openProductModal = (id) => {
    const p = allProducts.find(i => i.id === id);
    if (!p) return;

    window.currentProduct = p;
    const modal = document.getElementById('product-modal');

    // Populate Modal
    document.getElementById('p-main-img').src = p.img;
    document.getElementById('p-title').innerText = p.name;
    document.getElementById('p-desc').innerText = p.description || "Handcrafted with love.";

    // Display Dimensions if available
    const descContent = document.getElementById('p-desc');
    if (p.dimensions) {
        descContent.innerHTML = `
            <p style="margin-bottom: 15px;">${p.description}</p>
            <div class="product-dims">
                <div style="color: var(--gold); font-weight: 700; font-size: 0.85rem; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-ruler-combined"></i> PRODUCT DIMENSIONS
                </div>
                <div style="color: #eee; font-size: 0.9rem; font-weight: 500;">
                    ${p.dimensions.length} (Length) &times; ${p.dimensions.width} (Width)
                </div>
            </div>
        `;
    } else {
        descContent.innerText = p.description || "Handcrafted with love.";
    }

    document.getElementById('p-modal-price').innerText = p.on_request ? 'Price on Request' : `₹${p.price}`;

    // Reset Tabs
    window.switchTab('desc');

    // Load Reviews
    renderReviews(p.id);

    // Load Similar Products
    renderSimilarProducts(p);

    // Add Button Logic
    const addBtn = document.getElementById('p-add-btn');
    addBtn.onclick = () => window.addToCart(p.id);

    // Gallery Logic
    const gallery = document.getElementById('p-gallery');
    gallery.innerHTML = ''; // Clear previous

    if (p.images && p.images.length > 0) {
        p.images.forEach((imgSrc, index) => {
            // Thumbnails for left side
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.className = `p-thumb ${index === 0 ? 'active' : ''}`;
            thumb.onclick = () => {
                const mainImg = document.getElementById('p-main-img');
                mainImg.src = imgSrc;
                mainImg.style.transform = 'scale(1)';
                document.querySelectorAll('.p-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            };
            gallery.appendChild(thumb);
        });
    }

    // Main Image Click -> View Image
    document.getElementById('p-main-img').onclick = function () {
        window.viewImage(this.src, p.name);
    };
    document.getElementById('p-main-img').style.cursor = 'default';

    // DATA SYNC: Pre-fill review name if logged in
    if (window.Auth && window.Auth.getCurrentUser()) {
        const revNameInput = document.getElementById('rev-name');
        if (revNameInput) revNameInput.value = window.Auth.getCurrentUser().name || "";
    }

    modal.style.display = 'flex';
};

function renderSimilarProducts(currentP) {
    const similarContainer = document.getElementById('similar-products');
    if (!similarContainer) return;

    // Filter by same category, exclude current
    const similar = allProducts
        .filter(p => p.category === currentP.category && p.id !== currentP.id)
        .slice(0, 4);

    if (similar.length === 0) {
        similarContainer.innerHTML = '';
        return;
    }

    similarContainer.innerHTML = `
        <h3 style="color: var(--gold); font-size: 0.9rem; margin: 25px 0 12px 0; font-family: 'Montserrat', sans-serif; font-weight: 700; letter-spacing: 1px;">SIMILAR TREASURES</h3>
        <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none;">
            ${similar.map(p => `
                <div class="similar-item" onclick="window.openProductModal(${p.id})" style="min-width: 110px; cursor: pointer; transition: transform 0.2s;">
                    <div style="width: 110px; height: 110px; overflow: hidden; border-radius: 8px; border: 1px solid #333;">
                        <img src="${p.img}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1.0)'">
                    </div>
                    <div style="font-size: 0.7rem; color: #bbb; margin-top: 6px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
                    <div style="font-size: 0.85rem; color: var(--gold); font-weight: 800;">₹${p.price || '--'}</div>
                </div>
            `).join('')}
        </div>
    `;
}



window.closeProductModal = () => {
    document.getElementById('product-modal').style.display = 'none';
};

/**
 * Render Product Grid with Staggered Animations & Dynamic Badges
 */
function renderProducts(category = 'All', searchTerm = '') {
    const list = document.getElementById('product-list');
    if (!list) return;

    // Filtering Logic: Category + Search Term
    const filtered = allProducts.filter(p => {
        const matchesCategory = category === 'All' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle Empty State
    if (filtered.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px; color: #888;">
                <i class="fas fa-search" style="font-size: 3rem; color: #c5a059; opacity: 0.5; margin-bottom: 20px;"></i>
                <h3 style="color: #333; margin-bottom: 10px;">No Treasures Found</h3>
                <p>Try adjusting your search or category filters.</p>
            </div>`;
        return;
    }

    // Render Grid with staggered animation delays
    list.innerHTML = filtered.map((p, index) => {
        const isRequestOnly = p.on_request === true || p.price === 0;
        const priceDisplay = isRequestOnly ? "Price on Request" : `₹${p.price}`;
        const btnText = isRequestOnly ? "INQUIRE" : "ADD TO BAG";
        const btnIcon = isRequestOnly ? "fa-envelope" : "fa-plus";
        const badgeHTML = isRequestOnly ? `<div class="request-badge">Custom Order</div>` : '';

        return `
        <div class="product-card" style="animation-delay: ${index * 0.05}s">
            <div class="img-container" onclick="window.openProductModal(${p.id})">
                ${badgeHTML}
                <img src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-name" onclick="window.openProductModal(${p.id})">${p.name}</div>
                <div class="product-price" style="color: ${isRequestOnly ? 'var(--gold)' : 'var(--text-sub)'}">${priceDisplay}</div>
                <div class="card-actions">
                    <button class="add-btn" onclick="window.addToCart(${p.id})">
                        <i class="fas ${btnIcon}"></i> ${btnText}
                    </button>
                    <!-- Quick View Removed as it's redundant now with main click -->
                    <button class="icon-btn" onclick="window.shareProduct('${p.name}')" title="Share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

// Ensure Modal Closes on Outside Click
window.onclick = (event) => {
    const modal = document.getElementById('product-modal');
    if (event.target == modal) {
        window.closeProductModal();
    }
    // Handle image modal closing too
    const imgModal = document.getElementById('image-modal');
    if (event.target == imgModal) {
        imgModal.style.display = "none";
    }
};

/**
 * Product Modal Tabs & Reviews
 */
window.switchTab = (tab) => {
    document.querySelectorAll('.p-tab').forEach(t => {
        t.classList.remove('active');
        t.style.color = '#888';
    });
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`tab-${tab}`).style.color = 'var(--gold)';
    document.getElementById(`content-${tab}`).style.display = tab === 'reviews' ? 'flex' : 'block';
};

window.submitReview = () => {
    const name = document.getElementById('rev-name').value;
    const rating = document.getElementById('rev-rating').value;
    const comment = document.getElementById('rev-comment').value;

    if (!name || !comment) return alert("Please fill in your name and comment.");

    const newReview = {
        id: Date.now(),
        productId: window.currentProduct.id,
        name,
        rating: parseInt(rating),
        comment,
        date: new Date().toLocaleDateString()
    };

    const allReviews = JSON.parse(localStorage.getItem('bd-product-reviews')) || [];
    allReviews.push(newReview);
    localStorage.setItem('bd-product-reviews', JSON.stringify(allReviews));

    // Clear form
    document.getElementById('rev-name').value = '';
    document.getElementById('rev-comment').value = '';

    renderReviews(window.currentProduct.id);
};

function renderReviews(productId) {
    const allReviews = JSON.parse(localStorage.getItem('bd-product-reviews')) || [];
    const productReviews = allReviews.filter(r => r.productId === productId);

    document.getElementById('review-count').innerText = productReviews.length;

    const list = document.getElementById('reviews-list');
    if (productReviews.length === 0) {
        list.innerHTML = `<p style="color:#666; font-style:italic; padding:10px 0;">No reviews yet. Be the first to share your experience!</p>`;
        return;
    }

    list.innerHTML = productReviews.reverse().map(r => `
        <div class="review-card" style="border-bottom:1px solid #222; padding:15px 0;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span style="color:var(--gold); font-weight:600; font-size:0.9rem;">${r.name}</span>
                <span style="color:#555; font-size:0.75rem;">${r.date}</span>
            </div>
            <div style="color:var(--gold); font-size:0.8rem; margin-bottom:8px;">
                ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
            </div>
            <p style="color:#999; font-size:0.85rem; line-height:1.4;">${r.comment}</p>
        </div>
    `).join('');
}

/**
 * Global Window Functions (for HTML onclick access)
 */
window.viewImage = (src, title) => {
    // Open image in a new browser tab for a clear view
    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(`
            <html>
                <head>
                    <title>${title} - View Image</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                    <style>
                        body { margin: 0; background: #101010; display: flex; flex-direction: column; height: 100vh; overflow: hidden; font-family: sans-serif; }
                        #controls {
                            position: absolute; top: 20px; right: 20px; z-index: 100;
                            display: flex; gap: 10px;
                        }
                        .btn {
                            background: rgba(0, 0, 0, 0.6); color: white; border: 1px solid #444;
                            width: 40px; height: 40px; border-radius: 50%; display: flex;
                            justify-content: center; align-items: center; cursor: pointer;
                            transition: all 0.2s; font-size: 1.2rem;
                        }
                        .btn:hover { background: #FFD700; color: black; border-color: #FFD700; }
                        
                        #img-container {
                            flex: 1; display: flex; justify-content: center; align-items: center;
                            overflow: auto; cursor: grab;
                        }
                        img { 
                            max-width: 95%; max-height: 95%; object-fit: contain; 
                            box-shadow: 0 0 20px rgba(0,0,0,0.5); 
                            transition: transform 0.2s ease;
                        }
                    </style>
                </head>
                <body>
                    <div id="controls">
                        <div class="btn" onclick="zoom(0.2)" title="Zoom In"><i class="fas fa-plus"></i></div>
                        <div class="btn" onclick="zoom(-0.2)" title="Zoom Out"><i class="fas fa-minus"></i></div>
                        <div class="btn" onclick="window.close()" title="Close" style="background: rgba(200, 0, 0, 0.6);"><i class="fas fa-times"></i></div>
                    </div>
                    
                    <div id="img-container">
                        <img id="main-img" src="${src}" alt="${title}">
                    </div>

                    <script>
                        let scale = 1;
                        const img = document.getElementById('main-img');
                        
                        function zoom(delta) {
                            scale += delta;
                            if (scale < 0.5) scale = 0.5;
                            if (scale > 3) scale = 3;
                            img.style.transform = \`scale(\${scale})\`;
                            
                            // Enable scroll if zoomed
                            if(scale > 1) {
                                img.style.cursor = 'grab';
                            } else {
                                img.style.cursor = 'default';
                            }
                        }
                    </script>
                </body>
            </html>
        `);
        newWindow.document.close();
    }
};

window.shareProduct = (name) => {
    const text = `Check out this handcrafted ${name} from Bannada Daara!`;
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'Bannada Daara', text: text, url: url });
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert("Link copied to clipboard!");
    }
};

window.addToCart = (id) => {
    const p = allProducts.find(item => item.id === id);
    const exists = cart.find(i => i.id === id);
    if (exists) {
        exists.qty++;
    } else {
        cart.push({ ...p, qty: 1 });
    }
    saveAndUpdate();
    document.getElementById('cart-sidebar')?.classList.add('open');
};

window.changeQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveAndUpdate();
};

/**
 * Persistence & UI Refresh
 */
function saveAndUpdate() {
    localStorage.setItem('bd-cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const itemsDiv = document.getElementById('cart-items');

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    if (cartCount) cartCount.innerText = totalQty;
    if (cartTotal) cartTotal.innerText = `₹${totalPrice}`;

    // DATA SYNC: Update Navbar Auth Link
    const authLink = document.getElementById('nav-auth-link');
    const authText = document.getElementById('nav-auth-text');
    if (authLink && authText && window.Auth) {
        const user = window.Auth.getCurrentUser();
        if (user) {
            authLink.href = "account.html";
            authText.innerText = user.name.split(' ')[0].toUpperCase(); // Show first name
        } else {
            authLink.href = "login.html";
            authText.innerText = "LOGIN";
        }
    }

    if (!itemsDiv) return;

    if (cart.length === 0) {
        itemsDiv.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:#888;">
                <i class="fas fa-shopping-basket" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.3;"></i>
                <p>Your bag is empty.</p>
            </div>`;
    } else {
        itemsDiv.innerHTML = cart.map(item => {
            const isRequest = item.on_request === true || item.price === 0;
            return `
            <div class="cart-item-row" style="display:flex; gap:15px; padding:15px 0; border-bottom:1px solid #333; color:white;">
                <img src="${item.img}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:0.9rem; margin-bottom: 2px;">${item.name}</div>
                    <div style="color:#c5a059; font-size: 0.85rem; margin-bottom: 8px;">
                        ${isRequest ? 'Price on Request' : '₹' + item.price}
                    </div>
                    <div class="qty-controls" style="display:flex; align-items:center; gap:10px;">
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, -1)">-</button>
                        <span class="item-qty" style="color:#c5a059; font-weight:bold;">${item.qty}</span>
                        <button class="qty-btn" onclick="window.changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div style="font-weight:600; font-size:0.9rem;">
                    ${isRequest ? '--' : '₹' + (item.price * item.qty)}
                </div>
            </div>`;
        }).join('');
    }
}

/**
 * Event Listeners Logic
 */
function setupEventListeners() {
    // Cart Sidebar Toggle
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');

    // Support for both possible close button IDs
    const closeBtn = document.getElementById('close-cart') || document.getElementById('close-cart-back');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('cart-sidebar').classList.remove('open');

    // Image Modal Closing
    const imageModal = document.getElementById('image-modal');
    if (imageModal) {
        const closeMod = document.querySelector('.close-modal');
        if (closeMod) closeMod.onclick = () => imageModal.style.display = "none";
        window.addEventListener('click', (e) => { if (e.target == imageModal) imageModal.style.display = "none"; });
    }

    // Clear Cart Functionality
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (cart.length > 0 && confirm("Remove all items from your bag?")) {
                cart = [];
                saveAndUpdate();
            }
        };
    }

    // Category Filter Buttons
    document.querySelectorAll('.cat-item').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.cat-item.active').classList.remove('active');
            btn.classList.add('active');
            renderProducts(btn.dataset.cat, document.getElementById('search-bar').value);
        };
    });

    // Search Bar Input
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const activeCat = document.querySelector('.cat-item.active').dataset.cat;
            renderProducts(activeCat, e.target.value);
        });
    }

    // Footer Feedback
    const feedbackBtn = document.getElementById('footer-feedback-btn');
    if (feedbackBtn) {
        feedbackBtn.onclick = () => {
            window.open('https://wa.me/918105750221?text=Hi, I have feedback regarding Bannada Daara:', '_blank');
        };
    }

    // Checkout / Order Processing
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) return alert("Please add items to your bag first!");
            const orderModal = document.getElementById('order-modal');

            // If the Order Modal exists, open it. Otherwise, send direct WhatsApp.
            if (orderModal) {
                // DATA SYNC: Pre-fill if logged in
                if (window.Auth && window.Auth.getCurrentUser()) {
                    const user = window.Auth.getCurrentUser();
                    document.getElementById('cust-name').value = user.name || "";

                    // If they have addresses, use the last one (usually most recent)
                    if (user.addresses && user.addresses.length > 0) {
                        const lastAddr = user.addresses[user.addresses.length - 1];
                        document.getElementById('cust-address').value = `${lastAddr.street}, ${lastAddr.city}, ${lastAddr.state} - ${lastAddr.zip}`;
                    }
                }
                orderModal.style.display = 'flex';
            } else {
                sendDirectWhatsApp();
            }
        };
    }

    // Modal Closing Logic (Order Modal)
    const closeOrderBtn = document.querySelector('.close-order-modal');
    if (closeOrderBtn) {
        closeOrderBtn.onclick = () => document.getElementById('order-modal').style.display = 'none';
    }

    // Final WhatsApp Confirmation from Modal
    const confirmBtn = document.getElementById('confirm-order-btn');
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            const name = document.getElementById('cust-name').value;
            const addr = document.getElementById('cust-address').value;
            if (!name || !addr) return alert("Please fill in your delivery details.");

            const cartList = cart.map(i => {
                const isRequest = i.price === 0 || i.on_request === true;
                const priceLabel = isRequest ? "[Price on Request]" : `₹${i.price * i.qty}`;
                return `• ${i.name} [x${i.qty}] - ${priceLabel}`;
            }).join('%0A');

            const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
            const totalText = total > 0 ? `%0A%0A*Total: ₹${total}*` : '%0A%0A*Quote Requested for Custom Items*';

            const msg = `*New Order - Bannada Daara*%0A%0A*Name:* ${name}%0A*Address:* ${addr}%0A%0A*Treasures:*%0A${cartList}${totalText}`;

            // SAVE ORDER TO HISTORY (If Logged In)
            if (window.Auth && window.Auth.getCurrentUser()) {
                const newOrder = {
                    id: 'ORD-' + Date.now().toString().slice(-6),
                    date: new Date().toISOString(),
                    total: total,
                    items: cart,
                    address: addr
                };
                window.Auth.updateUserOrders(newOrder);
            }

            window.open(`https://wa.me/918105750221?text=${msg}`, '_blank');

            // Clear cart after order
            cart = [];
            saveAndUpdate();

            document.getElementById('order-modal').style.display = 'none';
        };
    }
}

// Start Application
init();
