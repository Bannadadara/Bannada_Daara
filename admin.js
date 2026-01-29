import { products as initialProducts } from './data.js';

const STORAGE_KEY = 'bd-custom-products';
const HIDDEN_KEY = 'bd-hidden-products';
const AUTH_KEY = 'bd-admin-auth';

// 1. Load Logic
// 1. Load Logic
const initAdmin = () => {
    // Strict Mode: Always ask for login when launched (page refresh/load)
    sessionStorage.removeItem(AUTH_KEY);

    checkAuth();
    updateDashboard();
    setupForm();
    setupLogin();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}

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

        // Admin credentials check
        if (user === 'admin' && pass === 'admin@1243') {
            sessionStorage.setItem(AUTH_KEY, 'true');
            showDashboard();
        } else {
            alert("Incorrect Username or Password!");
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

// --- DATA HELPERS ---
function getCustomProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveCustomProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
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

    // Merge both lists
    // We add a 'type' property to distinguish handling
    const mappedCustom = custom.map(p => ({ ...p, type: 'custom' }));
    const mappedStatic = initialProducts.map(p => ({ ...p, type: 'static' }));

    let all = [...mappedCustom, ...mappedStatic];

    // Filter out already hidden static products? 
    // No, we want to show EVERYTHING in admin so we can un-hide if needed (future feature),
    // but right now the requirement is just "remove".
    // So we will just show active products to keep it simple.

    return all.filter(p => !hidden.includes(p.id));
}


// --- RENDER & ACTIONS ---
function updateDashboard() {
    const list = getAllAdminProducts();
    const tbody = document.getElementById('admin-product-list');
    const emptyMsg = document.getElementById('no-products-msg');

    tbody.innerHTML = '';

    if (list.length === 0) {
        emptyMsg.style.display = 'block';
        if (emptyMsg) emptyMsg.innerText = "No Visible Products Found.";
        return;
    }
    emptyMsg.style.display = 'none';

    // Sort: Custom first (usually newer), then static
    list.sort((a, b) => (a.type === 'custom' ? -1 : 1));

    list.forEach(p => {
        const isCustom = p.type === 'custom';
        const badge = isCustom ? '<span style="color:#25D366; font-size:0.8rem;">[Custom]</span>' : '<span style="color:#888; font-size:0.8rem;">[Static]</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.img}" alt="img" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td>
                ${p.name} <br> ${badge}
            </td>
            <td>${p.category}</td>
            <td>₹${p.price}</td>
            <td>
                <button class="delete-btn" onclick="deleteProduct(${p.id}, '${p.type}')">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Form Handling (Add Product)
function setupForm() {
    const form = document.getElementById('add-product-form');
    if (!form) return;

    // Setup image upload handlers
    setupImageUpload();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('p-name').value;
        const price = parseFloat(document.getElementById('p-price').value);
        const length = document.getElementById('p-length').value;
        const width = document.getElementById('p-width').value;
        const category = document.getElementById('p-category').value;
        const desc = document.getElementById('p-desc').value;

        // Collect all images
        const imgFront = document.getElementById('p-image-front').value;
        const imgBack = document.getElementById('p-image-back').value;
        const imgLeft = document.getElementById('p-image-left').value;
        const imgRight = document.getElementById('p-image-right').value;

        if (!name || isNaN(price) || !imgFront) {
            alert("Please fill in required fields correctly (Product Name, Price, and Front Image).");
            return;
        }

        // Filter out empty images
        const imageList = [imgFront, imgBack, imgLeft, imgRight].filter(img => img !== "");

        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            img: imgFront, // Main image
            images: imageList,
            dimensions: (length || width) ? { length: length || '--', width: width || '--' } : null,
            description: desc || "No description provided.",
            isCustom: true
        };

        const products = getCustomProducts();
        products.push(newProduct);
        saveCustomProducts(products);

        form.reset();
        clearAllImagePreviews();
        alert("Product added successfully with multiple images!");
        updateDashboard();
    });
}

// Multi-Image Upload Logic
window.handleImageFileSelect = async function (input, type) {
    const file = input.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
        alert('Invalid file type. Please select an image.');
        input.value = '';
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        input.value = '';
        return;
    }

    try {
        const base64 = await convertToBase64(file);
        document.getElementById(`p-image-${type}`).value = base64;

        // Update UI
        const previewDiv = document.getElementById(`preview-${type}`);
        previewDiv.querySelector('img').src = base64;
        previewDiv.style.display = 'block';
        document.getElementById(`btn-${type}`).style.display = 'none';

        // Show generic upload status for the action
        showUploadStatus('success', file);
    } catch (error) {
        console.error(error);
        alert('Error processing image.');
    }
};

window.removeDetailImage = function (type) {
    document.getElementById(`p-image-${type}`).value = '';
    document.getElementById(`preview-${type}`).style.display = 'none';
    document.getElementById(`btn-${type}`).style.display = 'block';
    document.getElementById(`p-image-file-${type}`).value = '';
};

function clearAllImagePreviews() {
    ['front', 'back', 'left', 'right'].forEach(type => {
        removeDetailImage(type);
    });
    const statusSection = document.getElementById('upload-status-section');
    if (statusSection) statusSection.style.display = 'none';
}

function setupImageUpload() {
    // Legacy function placeholder - multi-upload handles selection via handleImageFileSelect
}


// Show upload status with visual feedback
function showUploadStatus(status, file, errorMessage = '') {
    const statusSection = document.getElementById('upload-status-section');
    const statusContent = document.getElementById('upload-status-content');

    statusSection.style.display = 'block';

    const fileSize = (file.size / 1024).toFixed(2); // KB
    const fileName = file.name;

    let statusHTML = '';

    if (status === 'processing') {
        statusHTML = `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                <div style="width: 60px; height: 60px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--gold);"></i>
                </div>
                <div style="flex: 1;">
                    <div style="color: var(--gold); font-weight: 600; margin-bottom: 5px;">${fileName}</div>
                    <div style="color: #999; font-size: 0.85rem;">Size: ${fileSize} KB</div>
                    <div style="color: var(--gold); font-size: 0.85rem; margin-top: 5px;">
                        <i class="fas fa-circle-notch fa-spin"></i> Processing...
                    </div>
                </div>
            </div>
        `;
    } else if (status === 'success') {
        statusHTML = `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(0, 200, 0, 0.05); border-radius: 8px; border: 1px solid rgba(0, 200, 0, 0.3);">
                <div style="width: 60px; height: 60px; background: rgba(0, 200, 0, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-check-circle" style="font-size: 1.5rem; color: #00C853;"></i>
                </div>
                <div style="flex: 1;">
                    <div style="color: #00C853; font-weight: 600; margin-bottom: 5px;">
                        <i class="fas fa-check"></i> ${fileName}
                    </div>
                    <div style="color: #999; font-size: 0.85rem;">Size: ${fileSize} KB</div>
                    <div style="color: #00C853; font-size: 0.85rem; margin-top: 5px;">
                        ✓ Upload completed successfully
                    </div>
                </div>
                <div style="color: #00C853; font-size: 2rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
            </div>
        `;
    } else if (status === 'error') {
        statusHTML = `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(200, 0, 0, 0.05); border-radius: 8px; border: 1px solid rgba(200, 0, 0, 0.3);">
                <div style="width: 60px; height: 60px; background: rgba(200, 0, 0, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-exclamation-circle" style="font-size: 1.5rem; color: #D32F2F;"></i>
                </div>
                <div style="flex: 1;">
                    <div style="color: #D32F2F; font-weight: 600; margin-bottom: 5px;">
                        <i class="fas fa-times"></i> ${fileName}
                    </div>
                    <div style="color: #999; font-size: 0.85rem;">Size: ${fileSize} KB</div>
                    <div style="color: #D32F2F; font-size: 0.85rem; margin-top: 5px;">
                        ✗ ${errorMessage}
                    </div>
                </div>
                <div style="color: #D32F2F; font-size: 2rem;">
                    <i class="fas fa-times-circle"></i>
                </div>
            </div>
        `;
    }

    statusContent.innerHTML = statusHTML;
}

// Convert image file to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Show image preview
function showImagePreview(base64, filename) {
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview');
    const filenameDisplay = document.getElementById('image-filename');

    previewImg.src = base64;
    filenameDisplay.textContent = filename;
    previewContainer.style.display = 'block';
}

// Clear image upload
window.clearImageUpload = function () {
    const fileInput = document.getElementById('p-image-file');
    const previewContainer = document.getElementById('image-preview-container');
    const hiddenInput = document.getElementById('p-image');
    const statusSection = document.getElementById('upload-status-section');

    if (fileInput) fileInput.value = '';
    if (previewContainer) previewContainer.style.display = 'none';
    if (hiddenInput) hiddenInput.value = '';
    if (statusSection) statusSection.style.display = 'none';
}


// 4. Global Delete Function
window.deleteProduct = (id, type) => {
    if (!confirm(`Are you sure you want to DELETE this product from the shop?`)) return;

    if (type === 'custom') {
        // Remove from Custom Array
        let products = getCustomProducts();
        products = products.filter(p => p.id !== id);
        saveCustomProducts(products);
    } else {
        // Add to Hidden Array
        const hidden = getHiddenIds();
        if (!hidden.includes(id)) {
            hidden.push(id);
            saveHiddenIds(hidden);
        }
    }

    updateDashboard();
};
