// Full product data from the official 2024 Catalogue
const products = [
    // BAGS [cite: 5, 7, 8, 9]
    { id: 1, name: "Reversible Tote Bag", price: 500, category: "Bags", img: "images/tote-rev.jpg" },
    { id: 2, name: "Box Tote (Plain)", price: 350, category: "Bags", img: "images/tote-plain.jpg" },
    { id: 3, name: "Box Tote (Patch-work)", price: 500, category: "Bags", img: "images/tote-patch.jpg" },
    { id: 4, name: "String Sling Bag", price: 150, category: "Bags", img: "images/sling-string.jpg" },
    { id: 5, name: "Regular Sling Bag", price: 250, category: "Bags", img: "images/sling-reg.jpg" },
    { id: 6, name: "Medium Sling Bag", price: 450, category: "Bags", img: "images/sling-med.jpg" },
    { id: 7, name: "Sling Bag (Patch-work S)", price: 250, category: "Bags", img: "images/sling-s.jpg" },
    { id: 8, name: "Sling Bag (Patch-work L)", price: 550, category: "Bags", img: "images/sling-l.jpg" },
    { id: 9, name: "Laptop Bag (50-50)", price: 800, category: "Bags", img: "images/laptop.jpg" },
    { id: 10, name: "Potli", price: 250, category: "Bags", img: "images/potli.jpg" },
    { id: 11, name: "Foldable Grocery Bag", price: 250, category: "Bags", img: "images/grocery.jpg" },

    // POUCHES [cite: 9, 10, 11]
    { id: 12, name: "U-Shape Pouch (S)", price: 100, category: "Pouches", img: "images/u-pouch.jpg" },
    { id: 13, name: "Travel Kit", price: 170, category: "Pouches", img: "images/travel.jpg" },
    { id: 14, name: "Pad-Holder", price: 100, category: "Pouches", img: "images/pad-holder.jpg" },
    { id: 15, name: "Flat Pouch", price: 80, category: "Pouches", img: "images/flat.jpg" },
    { id: 16, name: "Box Pouch", price: 170, category: "Pouches", img: "images/box-pouch.jpg" },
    { id: 17, name: "Trinket", price: 40, category: "Pouches", img: "images/trinket.jpg" },

    // STATIONERY [cite: 11, 12]
    { id: 18, name: "A4 Files", price: 200, category: "Stationery", img: "images/files.jpg" },
    { id: 19, name: "Pen Pouch", price: 100, category: "Stationery", img: "images/pen-pouch.jpg" },
    { id: 20, name: "Book (Embroidered Cover)", price: 450, category: "Stationery", img: "images/book.jpg" },

    // ACCESSORIES & DECOR [cite: 12, 13]
    { id: 21, name: "Cutlery Kit", price: 260, category: "Accessories", img: "images/cutlery.jpg" },
    { id: 22, name: "Mask", price: 50, category: "Accessories", img: "images/mask.jpg" },
    { id: 23, name: "Patch-work Quilt", price: 0, category: "Decor", img: "images/quilt.jpg", on_request: true },
    { id: 24, name: "Patch-work Table Cloth", price: 0, category: "Decor", img: "images/tablecloth.jpg", on_request: true }
];

let cart = [];

// Wait for the HTML to be fully loaded before running
document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');

    if (!list) {
        console.error("The element 'product-list' was not found. Please check your HTML.");
        return;
    }

    // Render Products
    list.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Bannada+Daara'">
            <div class="card-info">
                <span class="tag">${p.category}</span>
                <h3>${p.name}</h3>
                <p class="price">${p.on_request ? "Price on Request" : "Rs. " + p.price + "/-"}</p>
                <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Sidebar Controls
    cartToggle.onclick = () => cartSidebar.classList.add('open');
    document.getElementById('close-cart').onclick = () => cartSidebar.classList.remove('open');

    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        cart.push(product);
        updateCart();
        cartSidebar.classList.add('open');
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        updateCart();
    };

    function updateCart() {
        cartToggle.innerText = `Cart (${cart.length})`;
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.on_request ? "On Request" : "Rs. " + item.price}</small>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">&times;</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
        cartTotal.innerText = `Rs. ${total}`;
    }

    document.getElementById('checkout-btn').onclick = () => {
        if(cart.length === 0) return alert("Your cart is empty!");
        const itemsList = cart.map(i => i.name).join(", ");
        const message = `Hi Lavanya, I'd like to order from Bannada Daara: ${itemsList}. Total: ${cartTotal.innerText}`;
        window.open(`https://wa.me/918105750221?text=${encodeURIComponent(message)}`);
    };
});
