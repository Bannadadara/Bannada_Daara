const products = [
    { id: 1, name: "Reversible Tote Bag", price: 500, category: "Bags", img: "images/reversible-tote1.jpg" },
    { id: 2, name: "Box Tote (Plain)", price: 350, category: "Bags", img: "images/box-plain.jpg" },
    { id: 3, name: "Box Tote (Patch-work)", price: 500, category: "Bags", img: "images/box-patch.jpg" },
    { id: 4, name: "String Sling Bag", price: 150, category: "Bags", img: "images/sling-reg.jpg" },
    { id: 12, name: "U-Shape Pouch (S)", price: 100, category: "Pouches", img: "images/u-pouch.jpg" },
    { id: 18, name: "A4 Files", price: 200, category: "Stationery", img: "images/files.jpg" }
    // ... rest of your items
];

let cart = [];

function init() {
    renderProducts();

    // UI Elements
    const cartSidebar = document.getElementById('cart-sidebar');
    const addressModal = document.getElementById('address-modal');

    // Sidebar Controls
    document.getElementById('cart-toggle').onclick = () => cartSidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => cartSidebar.classList.remove('open');

    // Checkout/Order Flow
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return alert("Please add items to your cart first.");
        addressModal.classList.add('open');
    };

    document.getElementById('cancel-order').onclick = () => addressModal.classList.remove('open');

    // Confirm Order Action
    document.getElementById('confirm-order').onclick = () => {
        const address = document.getElementById('delivery-address').value;
        if (!address.trim()) return alert("Please enter a delivery address.");

        const names = cart.map(i => i.name).join(", ");
        const totalAmount = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);
        
        // 1. WhatsApp Notification
        const message = `*Bannada Daara - New Order*\n\n*Items:* ${names}\n*Total:* Rs. ${totalAmount}\n*Address:* ${address}`;
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(message)}`, '_blank');

        // 2. UPI Payment (Mobile Intent)
        const upiUrl = `upi://pay?pa=8105750221@okbizaxis&pn=Bannada%20Daara&am=${totalAmount}&cu=INR`;
        const isMobile = /iPhone|Android/i.test(navigator.userAgent);

        setTimeout(() => {
            if (isMobile) {
                window.location.href = upiUrl;
            } else {
                alert(`Desktop User: Please pay Rs. ${totalAmount} to UPI ID: 8105750221@okbizaxis`);
            }
            addressModal.classList.remove('open');
            cart = [];
            renderCart();
        }, 1200);
    };
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
    document.getElementById('cart-toggle').innerText = `Cart (${cart.length})`;
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <span>${item.name}</span>
            <button onclick="removeFromCart(${idx})" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Product'">
            <div class="card-info">
                <h3>${p.name}</h3>
                <p>Rs. ${p.price}</p>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', init);
