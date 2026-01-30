import { products as initialProducts } from './data.js';

const STORAGE_KEY = 'bd-custom-products';
const HIDDEN_KEY = 'bd-hidden-products';
const AUTH_KEY = 'bd-admin-auth';

// 1. Initialization
const initAdmin = () => {
    // Initialise EmailJS
    const config = getEmailJSConfig();
    if (window.emailjs && config.publicKey) {
        emailjs.init(config.publicKey);
    }

    checkAuth();
    setupLogin();
    setupTabs();
    setupForm();
    setupSettings();
    setupSearchFilter();
    updateDashboard(); // Initial render
};

// Executed at the bottom of the file to ensure all window functions are registered first.

// --- AUTHENTICATION ---
function checkAuth() {
    const isAuth = sessionStorage.getItem(AUTH_KEY);
    if (isAuth === 'true') {
        showDashboard();
    } else {
        showLogin();
    }
}

function setupLogin() {
    const loginForm = document.getElementById('admin-login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('admin-user').value;
        const pass = document.getElementById('admin-pass').value;

        if (user === 'admin' && pass === 'admin@1243') {
            sessionStorage.setItem(AUTH_KEY, 'true');
            showDashboard();
            showToast("Logged in successfully", "success");
        } else {
            showToast("Incorrect Username or Password!", "error");
        }
    });
}

function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    updateDashboard();
}

function showLogin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('dashboard-section').style.display = 'none';
}

// --- TAB NAVIGATION ---
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to current
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Specific Tab Actions
            if (tabId === 'tab-community') {
                renderSubscribers();
            } else if (tabId === 'tab-analytics') {
                renderAnalytics();
            } else if (tabId === 'tab-settings') {
                loadSettings();
            }
        });
    });
}

// --- DATA HELPERS ---
function getCustomProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveCustomProducts(products) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
        showToast("Storage Full! Could not save products.", "error");
    }
}

function getHiddenIds() {
    return JSON.parse(localStorage.getItem(HIDDEN_KEY)) || [];
}

function saveHiddenIds(ids) {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(ids));
}

function getAllAdminProducts() {
    const custom = getCustomProducts();
    const hidden = getHiddenIds();

    const mappedCustom = custom.map(p => ({ ...p, type: 'custom' }));
    const mappedStatic = initialProducts.map(p => ({ ...p, type: 'static' }));

    let all = [...mappedCustom, ...mappedStatic];
    return all.filter(p => !hidden.includes(p.id));
}

// --- RENDER & STATS ---
function updateDashboard() {
    const list = getAllAdminProducts();
    updateStats(list);
    renderProductList(list);
    renderSubscribers();
    renderAnalytics();
}

function updateStats(list) {
    document.getElementById('stat-total-products').innerText = list.length;

    const categories = new Set(list.map(p => p.category));
    document.getElementById('stat-categories').innerText = categories.size;

    const customCount = list.filter(p => p.type === 'custom').length;
    document.getElementById('stat-custom-count').innerText = customCount;
}

function renderProductList(list) {
    const tbody = document.getElementById('admin-product-list');
    const emptyMsg = document.getElementById('no-products-msg');
    const searchQuery = document.getElementById('admin-search').value.toLowerCase();
    const catFilter = document.getElementById('admin-filter-category').value;

    tbody.innerHTML = '';

    // Apply Filter & Search
    const filtered = list.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery);
        const matchesCat = catFilter === 'all' || p.category === catFilter;
        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    emptyMsg.style.display = 'none';

    // Sort: Custom first
    filtered.sort((a, b) => (a.type === 'custom' ? -1 : 1));

    filtered.forEach(p => {
        const isCustom = p.type === 'custom';
        const badge = isCustom ? '<span style="color:#25D366; font-size:0.75rem;">[Custom]</span>' : '<span style="color:#888; font-size:0.75rem;">[Static]</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.img}" alt="img" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td>${p.name} <br> ${badge}</td>
            <td>${p.category}</td>
            <td>₹${p.price}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editProduct(${p.id}, '${p.type}')"><i class="fas fa-edit"></i>Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${p.id}, '${p.type}')"><i class="fas fa-trash"></i>Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- SEARCH & FILTER ---
function setupSearchFilter() {
    const search = document.getElementById('admin-search');
    const filter = document.getElementById('admin-filter-category');

    search.addEventListener('input', () => renderProductList(getAllAdminProducts()));
    filter.addEventListener('change', () => renderProductList(getAllAdminProducts()));
}

// --- FORM HANDLING ---
function setupForm() {
    const form = document.getElementById('add-product-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('p-name').value;
        const price = parseFloat(document.getElementById('p-price').value);
        const length = document.getElementById('p-length').value;
        const width = document.getElementById('p-width').value;
        const category = document.getElementById('p-category').value;
        const desc = document.getElementById('p-desc').value;

        const imgFront = document.getElementById('p-image-front').value;
        const imgBack = document.getElementById('p-image-back').value;
        const imgLeft = document.getElementById('p-image-left').value;
        const imgRight = document.getElementById('p-image-right').value;

        if (!name || isNaN(price) || !imgFront) {
            showToast("Please fill in Name, Price, and Front Image", "error");
            return;
        }

        const imageList = [imgFront, imgBack, imgLeft, imgRight].filter(img => img !== "");

        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            img: imgFront,
            images: imageList,
            dimensions: (length || width) ? { length: length || '--', width: width || '--' } : null,
            description: desc || "No description provided.",
            isCustom: true
        };

        const products = getCustomProducts();
        products.push(newProduct);
        saveCustomProducts(products);

        // Check for Community Notification
        const shouldNotify = document.getElementById('notify-community').checked;
        if (shouldNotify) {
            notifySubscribers(newProduct);
        }

        form.reset();
        clearAllImagePreviews();
        showToast("Product added successfully!", "success");
        updateDashboard();

        // Switch to product list to show new item
        document.querySelector('[data-tab="tab-products"]').click();
    });

    // Edit Product Form
    const editForm = document.getElementById('edit-product-form');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('edit-p-id').value);
            const type = document.getElementById('edit-p-type').value;

            const name = document.getElementById('edit-p-name').value;
            const price = parseFloat(document.getElementById('edit-p-price').value);
            const length = document.getElementById('edit-p-length').value;
            const width = document.getElementById('edit-p-width').value;
            const category = document.getElementById('edit-p-category').value;
            const desc = document.getElementById('edit-p-desc').value;

            const imgFront = document.getElementById('edit-img-front').value;
            const imgBack = document.getElementById('edit-img-back').value;
            const imgLeft = document.getElementById('edit-img-left').value;
            const imgRight = document.getElementById('edit-img-right').value;

            const imageList = [imgFront, imgBack, imgLeft, imgRight].filter(img => img && img !== "");

            const updatedProduct = {
                id: id,
                name,
                price,
                category,
                img: imgFront,
                images: imageList,
                dimensions: (length || width) ? { length: length || '--', width: width || '--' } : null,
                description: desc || "No description provided.",
                isCustom: true
            };

            if (type === 'static') {
                const hidden = getHiddenIds();
                if (!hidden.includes(id)) {
                    hidden.push(id);
                    saveHiddenIds(hidden);
                }
                updatedProduct.id = Date.now();
                const customs = getCustomProducts();
                customs.push(updatedProduct);
                saveCustomProducts(customs);
            } else {
                let customs = getCustomProducts();
                const index = customs.findIndex(p => p.id === id);
                if (index !== -1) {
                    customs[index] = updatedProduct;
                    saveCustomProducts(customs);
                }
            }

            document.getElementById('edit-modal').style.display = 'none';
            showToast("Product updated successfully!", "success");
            updateDashboard();
        });
    }
}

// --- IMAGE UPLOAD LOGIC ---
// --- IMAGE UPLOAD LOGIC ---
window.handleImageFileSelect = async function (input, type) {
    const file = input.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast("Invalid file type", "error");
        input.value = '';
        return;
    }

    // Increased limit because we compress now, but still good to guard
    if (file.size > 5 * 1024 * 1024) {
        showToast("File size too large (>5MB)", "error");
        input.value = '';
        return;
    }

    try {
        // Compress Image before saving
        const base64 = await compressImage(file, 800, 0.7);
        document.getElementById(`p-image-${type}`).value = base64;

        const previewDiv = document.getElementById(`preview-${type}`);
        previewDiv.querySelector('img').src = base64;
        previewDiv.style.display = 'block';
        document.getElementById(`btn-${type}`).style.display = 'none';
    } catch (error) {
        console.error(error);
        showToast("Error processing/compressing image", "error");
    }
};

window.handleEditFileSelect = async function (input, type) {
    const file = input.files[0];
    if (!file) return;

    try {
        const base64 = await compressImage(file, 800, 0.7);
        document.getElementById(`edit-img-${type}`).value = base64;
        document.getElementById(`edit-preview-${type}`).src = base64;
    } catch (error) {
        console.error(error);
        showToast("Error processing/compressing image", "error");
    }
};

window.removeDetailImage = function (type) {
    document.getElementById(`p-image-${type}`).value = '';
    document.getElementById(`preview-${type}`).style.display = 'none';
    document.getElementById(`btn-${type}`).style.display = 'block';
    document.getElementById(`p-image-file-${type}`).value = '';
};

function clearAllImagePreviews() {
    ['front', 'back', 'left', 'right'].forEach(type => removeDetailImage(type));
}

// COMPRESSION UTILITY
function compressImage(file, maxWidth, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

function convertToBase64(file) {
    // Fallback if needed, but we use compressImage now
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// --- DATA BACKUP ---
window.downloadBackup = () => {
    const custom = getCustomProducts();
    const hidden = getHiddenIds();

    // Create a downloadable object
    const backup = {
        customProducts: custom,
        hiddenProducts: hidden,
        timestamp: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bannadadara_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

// --- ACTIONS & TOAST ---
window.deleteProduct = (id, type) => {
    if (!confirm(`Are you sure you want to delete this product?`)) return;

    if (type === 'custom') {
        let products = getCustomProducts();
        products = products.filter(p => p.id !== id);
        saveCustomProducts(products);
    } else {
        const hidden = getHiddenIds();
        if (!hidden.includes(id)) {
            hidden.push(id);
            saveHiddenIds(hidden);
        }
    }

    showToast("Product deleted successfully", "info");
    updateDashboard();
};

window.editProduct = (id, type) => {
    let p;
    if (type === 'custom') {
        p = getCustomProducts().find(item => item.id === id);
    } else {
        p = initialProducts.find(item => item.id === id);
    }

    if (!p) return showToast("Product not found!", "error");

    document.getElementById('edit-p-id').value = p.id;
    document.getElementById('edit-p-type').value = type;
    document.getElementById('edit-p-name').value = p.name;
    document.getElementById('edit-p-price').value = p.price;
    document.getElementById('edit-p-category').value = p.category;
    document.getElementById('edit-p-length').value = p.dimensions?.length || '';
    document.getElementById('edit-p-width').value = p.dimensions?.width || '';
    document.getElementById('edit-p-desc').value = p.description || '';

    const imgs = p.images || [p.img];
    document.getElementById('edit-img-front').value = p.img || '';
    document.getElementById('edit-preview-front').src = p.img || '';

    const back = imgs[1] || '';
    const left = imgs[2] || '';
    const right = imgs[3] || '';

    document.getElementById('edit-img-back').value = back;
    document.getElementById('edit-preview-back').src = back || 'https://via.placeholder.com/80?text=No+Image';

    document.getElementById('edit-img-left').value = left;
    document.getElementById('edit-preview-left').src = left || 'https://via.placeholder.com/80?text=No+Image';

    document.getElementById('edit-img-right').value = right;
    document.getElementById('edit-preview-right').src = right || 'https://via.placeholder.com/80?text=No+Image';

    document.getElementById('edit-modal').style.display = 'flex';
};

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';

    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- COMMUNITY MANAGEMENT ---
function getSubscribers() {
    return JSON.parse(localStorage.getItem('bd-subscribers')) || [];
}

window.renderSubscribers = () => {
    const tbody = document.getElementById('admin-subscriber-list');
    const emptyMsg = document.getElementById('no-subscribers-msg');
    const subscribers = getSubscribers();

    if (!tbody) return;
    tbody.innerHTML = '';

    if (subscribers.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    emptyMsg.style.display = 'none';

    subscribers.forEach((email) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${email}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>
                <button class="delete-btn" onclick="window.deleteSubscriber('${email}')" style="padding: 5px 12px; font-size: 0.8rem;">
                    <i class="fas fa-user-minus"></i> Remove
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

window.deleteSubscriber = (email) => {
    if (!confirm(`Remove ${email} from the community?`)) return;
    let subs = getSubscribers();
    subs = subs.filter(s => s !== email);
    localStorage.setItem('bd-subscribers', JSON.stringify(subs));
    renderSubscribers();
    showToast("Subscriber removed", "info");
};

window.exportSubscribers = () => {
    const subs = getSubscribers();
    if (subs.length === 0) return showToast("No subscribers to export", "error");

    const csvContent = "data:text/csv;charset=utf-8,Email Address\n" + subs.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bannadadara_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

async function notifySubscribers(product) {
    const subscribers = getSubscribers();
    if (subscribers.length === 0) return;

    const config = getEmailJSConfig();
    if (!config.serviceId || !config.productTemplate) {
        return showToast("Notification failed: EmailJS not configured. Go to Settings.", "error");
    }

    showToast(`Notifying ${subscribers.length} community members...`, "info");

    try {
        if (window.emailjs) {
            const templateParams = {
                product_name: product.name,
                product_price: product.price,
                recipient_count: subscribers.length,
                to_email: 'bannada.dara@gmail.com'
            };

            await emailjs.send(config.serviceId, config.productTemplate, templateParams);
        }
        showToast("Community members notified!", "success");
    } catch (error) {
        console.error("Notification Error:", error);
        showToast("Notification failed (Check Settings & Template)", "error");
    }
}

// --- ANALYTICS LOGIC ---
window.renderAnalytics = () => {
    if (!window.Auth) return;
    const users = window.Auth.getUsers();
    const allOrders = users.flatMap(u => (u.orders || []).map(o => ({ ...o, userEmail: u.email })));

    // 1. Core Metrics
    const totalRevenue = allOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    const totalUsers = users.length;
    const activeCustomers = users.filter(u => u.orders && u.orders.length > 0).length;

    document.getElementById('ana-total-revenue').innerText = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('ana-total-users').innerText = totalUsers;
    document.getElementById('ana-active-customers').innerText = activeCustomers;

    // 2. Sales Breakdown (Monthly/Yearly)
    renderSalesBreakdown(allOrders);

    // 3. Best Sellers
    renderBestSellers(allOrders);

    // 4. User Directory
    renderUserDirectory(users);
};

function renderSalesBreakdown(orders) {
    const tbody = document.getElementById('ana-sales-breakdown');
    if (!tbody) return;

    const breakdown = {};
    orders.forEach(o => {
        const date = new Date(o.date);
        const key = `${date.getFullYear()} - ${date.toLocaleString('default', { month: 'short' })}`;
        if (!breakdown[key]) breakdown[key] = { count: 0, revenue: 0 };
        breakdown[key].count++;
        breakdown[key].revenue += (parseFloat(o.total) || 0);
    });

    tbody.innerHTML = Object.entries(breakdown)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([period, data]) => `
            <tr>
                <td>${period}</td>
                <td>${data.count} orders</td>
                <td>₹${data.revenue.toLocaleString()}</td>
            </tr>
        `).join('');
}

function renderBestSellers(orders) {
    const tbody = document.getElementById('ana-top-products');
    if (!tbody) return;

    const products = {};
    orders.forEach(o => {
        o.items.forEach(item => {
            if (!products[item.name]) products[item.name] = { qty: 0, revenue: 0 };
            products[item.name].qty += item.qty;
            products[item.name].revenue += (parseFloat(item.price) * item.qty);
        });
    });

    tbody.innerHTML = Object.entries(products)
        .sort((a, b) => b[1].qty - a[1].qty)
        .slice(0, 10)
        .map(([name, data]) => `
            <tr>
                <td>${name}</td>
                <td>${data.qty}</td>
                <td>₹${data.revenue.toLocaleString()}</td>
            </tr>
        `).join('');
}

function renderUserDirectory(users) {
    const tbody = document.getElementById('ana-user-list');
    if (!tbody) return;

    tbody.innerHTML = users.map(u => {
        const orderCount = u.orders ? u.orders.length : 0;
        const totalSpent = u.orders ? u.orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) : 0;
        const status = orderCount > 0 ? '<span style="color:#25D366;">Customer</span>' : '<span style="color:#888;">Lead</span>';
        const joinedDate = u.joined ? new Date(u.joined).toLocaleDateString() : 'N/A';

        return `
            <tr>
                <td>${u.email}</td>
                <td>${joinedDate}</td>
                <td>${orderCount}</td>
                <td>₹${totalSpent.toLocaleString()}</td>
                <td>${status}</td>
            </tr>
        `;
    }).join('');
}

window.exportAnalytics = () => {
    const users = window.Auth.getUsers();
    let csv = "User Email,Joined Date,Total Orders,Total Spent,Status\n";

    users.forEach(u => {
        const orderCount = u.orders ? u.orders.length : 0;
        const totalSpent = u.orders ? u.orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) : 0;
        const status = orderCount > 0 ? 'Customer' : 'Lead';
        const joined = u.joined ? new Date(u.joined).toLocaleDateString() : 'N/A';

        csv += `${u.email},${joined},${orderCount},${totalSpent},${status}\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bannadadara_analytics.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// --- SETTINGS MANAGEMENT ---
function getEmailJSConfig() {
    return JSON.parse(localStorage.getItem('bd-emailjs-config')) || {
        publicKey: '',
        serviceId: '',
        joinTemplate: '',
        productTemplate: ''
    };
}

function setupSettings() {
    const form = document.getElementById('emailjs-config-form');
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
        const config = {
            publicKey: document.getElementById('config-public-key').value,
            serviceId: document.getElementById('config-service-id').value,
            joinTemplate: document.getElementById('config-join-template').value,
            productTemplate: document.getElementById('config-product-template').value
        };
        localStorage.setItem('bd-emailjs-config', JSON.stringify(config));
        showToast("Settings saved successfully!", "success");

        // Re-init EmailJS with new public key
        if (window.emailjs && config.publicKey) emailjs.init(config.publicKey);
    };
}

window.loadSettings = () => {
    const config = getEmailJSConfig();
    document.getElementById('config-public-key').value = config.publicKey;
    document.getElementById('config-service-id').value = config.serviceId;
    document.getElementById('config-join-template').value = config.joinTemplate;
    document.getElementById('config-product-template').value = config.productTemplate;
};


// --- START APPLICATION ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}

