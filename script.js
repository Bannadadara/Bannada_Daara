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

function init() {
    renderProducts();
    
    // Sidebar Controls
    document.getElementById('cart-toggle').onclick = () => document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('close-cart').onclick = () => document.getElementById('cart-sidebar').classList.remove('open');

    // Order Logic
    const addressModal = document.getElementById('address-modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const confirmBtn = document.getElementById('confirm-order');

    checkoutBtn.onclick = () => {
        if (cart.length === 0) return alert("Your cart is empty!");
        addressModal.classList.add('open');
    };

    document.getElementById('cancel-order').onclick = () => addressModal.classList.remove('open');

    confirmBtn.onclick = () => {
        const address = document.getElementById('delivery-address').value;
        if (!address.trim()) return alert("Please enter delivery address.");

        const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);
        const itemNames = cart.map(i => i.name).join(", ");
        const orderText = `*New Order - Bannada Daara*\n\n*Items:* ${itemNames}\n*Total:* Rs. ${total}\n*Address:* ${address}`;

        // 1. WhatsApp Redirect
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(orderText)}`, '_blank');

        // 2. UPI Intent (For Mobile Apps)
        const upiId = "8105750221@okbizaxis";
        const upiUrl = `upi://pay?pa=${upiId}&pn=Bannada%20Daara&am=${total}&cu=INR`;

        // Check if user is on Mobile for UPI
        const isMobile = /iPhone|Android/i.test(navigator.userAgent);

        setTimeout(() => {
            if (isMobile) {
                window.location.href = upiUrl;
            } else {
                alert(`Please pay Rs. ${total} to UPI ID: ${upiId} using your phone.`);
            }
            addressModal.classList.remove('open');
            cart = [];
            renderCart();
        }, 1500);
    };
}

window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    cart.push(item);
    renderCart();
    document.getElementById('cart-sidebar').classList.add('open');
};

function renderCart() {
    document.getElementById('cart-toggle').innerText = `Cart (${cart.length})`;
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>${item.name}</span>
            <button onclick="removeFromCart(${idx})" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);
    document.getElementById('cart-total').innerText = `Rs. ${total}`;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    renderCart();
};

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}">
            <div class="card-info">
                <h3>${p.name}</h3>
                <p>${p.on_request ? "Price on Request" : "Rs. " + p.price}</p>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', init);
