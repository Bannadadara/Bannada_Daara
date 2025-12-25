const products = [
    { id: 1, name: "Reversible Tote Bag", price: 500, category: "Bags", img: "images/reversible-tote1.jpg" },
    { id: 2, name: "Box Tote (Plain)", price: 350, category: "Bags", img: "images/box-plain.jpg" },
    { id: 3, name: "Box Tote (Patch-work)", price: 500, category: "Bags", img: "images/box-patch.jpg" },
    { id: 4, name: "String Sling Bag", price: 150, category: "Bags", img: "images/sling-reg.jpg" },
    { id: 5, name: "Regular Sling Bag", price: 250, category: "Bags", img: "images/sling-reg-m.jpg" },
    { id: 6, name: "Medium Sling Bag", price: 450, category: "Bags", img: "images/sling-reg.jpg" },
    { id: 7, name: "Sling Bag (Patch-work S)", price: 250, category: "Bags", img: "images/sling-patch-s.jpg" },
    { id: 8, name: "Sling Bag (Patch-work L)", price: 550, category: "Bags", img: "images/sling-patch-l.jpg" },
    { id: 9, name: "Laptop Bag (50-50)", price: 800, category: "Bags", img: "images/pouch.jpg" }, 
    { id: 10, name: "Potli", price: 250, category: "Bags", img: "images/potli.jpg" },
    { id: 11, name: "Foldable Grocery Bag", price: 250, category: "Bags", img: "images/grocery.jpg" },
    { id: 12, name: "U-Shape Pouch (S)", price: 100, category: "Pouches", img: "images/u-pouch.jpg" },
    { id: 13, name: "Travel Kit", price: 170, category: "Pouches", img: "images/travel-kit.jpg" },
    { id: 14, name: "Pad-Holder", price: 100, category: "Pouches", img: "images/pad-holder-folded.jpg" },
    { id: 15, name: "Flat Pouch", price: 80, category: "Pouches", img: "images/flat-pouch.jpg" },
    { id: 16, name: "Box Pouch", price: 170, category: "Pouches", img: "images/box-pouch.jpg" },
    { id: 17, name: "Trinket", price: 40, category: "Pouches", img: "images/TRINKET.jpg" },
    { id: 18, name: "A4 Files", price: 200, category: "Stationery", img: "images/files.jpg" },
    { id: 19, name: "Pen Pouch", price: 100, category: "Stationery", img: "images/pouch.jpg" },
    { id: 20, name: "Book (Embroidered Cover)", price: 450, category: "Stationery", img: "images/book.jpg" },
    { id: 21, name: "Cutlery Kit", price: 260, category: "Accessories", img: "images/cutlery.jpg" },
    { id: 22, name: "Mask", price: 50, category: "Accessories", img: "images/mask.jpg" },
    { id: 23, name: "Patch-work Quilt", price: 0, category: "Decor", img: "images/quilt.jpg", on_request: true },
    { id: 24, name: "Patch-work Table Cloth", price: 0, category: "Decor", img: "images/tcloth.jpg", on_request: true }
];

let cart = [];

function renderProducts(filterCategory = 'All', searchTerm = '') {
    const list = document.getElementById('product-list');
    if (!list) return;
    const filtered = products.filter(p => {
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    list.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Product'">
            <div class="card-info">
                <span class="tag">${p.category}</span>
                <h3>${p.name}</h3>
                <p class="price">${p.on_request ? "Price on Request" : "Rs. " + p.price + "/-"}</p>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function init() {
    renderProducts();
    
    // Cart logic
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        document.getElementById('cart-toggle').onclick = () => sidebar.classList.add('open');
        document.getElementById('close-cart').onclick = () => sidebar.classList.remove('open');
    }

    // Modal logic
    const addressModal = document.getElementById('address-modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const confirmOrderBtn = document.getElementById('confirm-order');
    const cancelOrderBtn = document.getElementById('cancel-order');

    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) return alert("Your cart is empty!");
            addressModal.classList.add('open');
        };
    }

    if (cancelOrderBtn) {
        cancelOrderBtn.onclick = () => addressModal.classList.remove('open');
    }

    if (confirmOrderBtn) {
        confirmOrderBtn.onclick = () => {
            const address = document.getElementById('delivery-address').value;
            if (!address.trim()) return alert("Please enter your address.");

            const itemNames = cart.map(i => i.name).join(", ");
            const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);

            // 1. Send Order to WhatsApp
            const message = `*Bannada Daara - New Order*\n\n*Items:* ${itemNames}\n*Total:* Rs. ${total}\n*Delivery Address:* ${address}`;
            window.open(`https://wa.me/918105750221?text=${encodeURIComponent(message)}`, '_blank');

            // 2. Open UPI App (GPay/PhonePe/Paytm)
            // pa = your UPI ID, pn = Business Name
            const upiUrl = `upi://pay?pa=8105750221@okbizaxis&pn=Bannada%20Daara&am=${total}&cu=INR`;
            
            setTimeout(() => {
                window.location.href = upiUrl;
                addressModal.classList.remove('open');
                cart = [];
                renderCart();
            }, 1000);
        };
    }
}

window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    cart.push(item);
    renderCart();
    document.getElementById('cart-sidebar').classList.add('open');
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    renderCart();
};

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) cartToggle.innerText = `Cart (${cart.length})`;
    if (cartItems) {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.name}</span>
                <button class="remove-btn" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `).join('');
    }
    const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerText = `Rs. ${total}`;
}

document.addEventListener('DOMContentLoaded', init);
