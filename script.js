const products = [
    // BAGS
    { name: "Reversible Tote Bag", price: "Rs. 500/-", category: "Bags", img: "images/reversible-tote.jpg" },
    { name: "Box Tote (Plain)", price: "Rs. 350/-", category: "Bags", img: "images/box-plain.jpg" },
    { name: "Box Tote (Patch-work)", price: "Rs. 500/-", category: "Bags", img: "images/box-patch.jpg" },
    { name: "String Sling Bag", price: "Rs. 150/-", category: "Bags", img: "images/string-sling.jpg" },
    { name: "Regular Sling Bag", price: "Rs. 250/-", category: "Bags", img: "images/regular-sling.jpg" },
    { name: "Medium Sling Bag", price: "Rs. 450/-", category: "Bags", img: "images/medium-sling.jpg" },
    { name: "Sling Bag (Patch-work S)", price: "Rs. 200/- to 250/-", category: "Bags", img: "images/sling-s.jpg" },
    { name: "Sling Bag (Patch-work L)", price: "Rs. 550/-", category: "Bags", img: "images/sling-l.jpg" },
    { name: "Laptop Bag (50-50)", price: "Rs. 800/-", category: "Bags", img: "images/laptop.jpg" },
    { name: "Potli Bag", price: "Rs. 250/-", category: "Bags", img: "images/potli.jpg" },
    { name: "Foldable Grocery Bag", price: "Rs. 250/-", category: "Bags", img: "images/grocery.jpg" },
    
    // POUCHES
    { name: "U-Shape Pouch (S)", price: "Rs. 100/-", category: "Pouches", img: "images/u-pouch.jpg" },
    { name: "Travel Kit", price: "Rs. 170/-", category: "Pouches", img: "images/travel-kit.jpg" },
    { name: "Pad-Holder", price: "Rs. 100/-", category: "Pouches", img: "images/pad-holder.jpg" },
    { name: "Flat Pouch", price: "Rs. 80/-", category: "Pouches", img: "images/flat-pouch.jpg" },
    { name: "Box Pouch", price: "Rs. 170/-", category: "Pouches", img: "images/box-pouch.jpg" },
    { name: "Trinket", price: "Rs. 40/-", category: "Pouches", img: "images/trinket.jpg" },
    
    // STATIONERY
    { name: "A4 Files", price: "Rs. 200/-", category: "Stationery", img: "images/files.jpg" },
    { name: "Pen Pouch", price: "Rs. 100/-", category: "Stationery", img: "images/pouch.jpg" },
    { name: "Book (Embroidered Cover)", price: "Rs. 450/-", category: "Stationery", img: "images/book.jpg" },
    
    // ACCESSORIES & DECOR
    { name: "Cutlery Kit", price: "Rs. 260/-", category: "Accessories", img: "images/cutlery.jpg" },
    { name: "Cloth Mask", price: "Rs. 50/-", category: "Accessories", img: "images/mask.jpg" },
    { name: "Patch-work Quilt", price: "On Request", category: "Decor", img: "images/quilt.jpg" },
    { name: "Patch-work Table Cloth", price: "On Request", category: "Decor", img: "images/t-cloth.jpg" }
];

// This function ensures the page is ready before trying to add products
window.onload = function() {
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = products.map(item => `
            <div class="card">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
                <div class="card-info">
                    <span class="tag">${item.category}</span>
                    <h3>${item.name}</h3>
                    <p class="price">${item.price}</p>
                </div>
            </div>
        `).join('');
    } else {
        console.error("Could not find the 'product-list' element in the HTML.");
    }
};
