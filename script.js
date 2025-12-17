const products = [
    // BAGS
    { name: "Reversible Tote Bag", price: "Rs. 500/-", category: "Bags", img: "images/reversible-tote.jpg" },
    { name: "Box Tote (Plain)", price: "Rs. 350/-", category: "Bags", img: "images/box-plain.jpg" },
    { name: "Box Tote (Patch-work)", price: "Rs. 500/-", category: "Bags", img: "images/box-patch.jpg" },
    { name: "Laptop Bag (50-50)", price: "Rs. 800/-", category: "Bags", img: "images/laptop.jpg" },
    { name: "Sling Bag (Regular)", price: "Rs. 250/-", category: "Bags", img: "images/sling-reg.jpg" },
    { name: "Sling Bag (Patch-work L)", price: "Rs. 550/-", category: "Bags", img: "images/sling-patch-l.jpg" },
    { name: "Potli Bag", price: "Rs. 250/-", category: "Bags", img: "images/potli.jpg" },
    { name: "Foldable Grocery Bag", price: "Rs. 250/-", category: "Bags", img: "images/grocery.jpg" },
    
    // POUCHES
    { name: "Travel Kit", price: "Rs. 170/-", category: "Pouches", img: "images/travel-kit.jpg" },
    { name: "Pad-Holder", price: "Rs. 100/-", category: "Pouches", img: "images/pad-holder.jpg" },
    { name: "Box Pouch", price: "Rs. 170/-", category: "Pouches", img: "images/box-pouch.jpg" },
    { name: "Flat Pouch", price: "Rs. 80/-", category: "Pouches", img: "images/flat-pouch.jpg" },
    
    // STATIONERY
    { name: "A4 Files", price: "Rs. 200/-", category: "Stationery", img: "images/files.jpg" },
    { name: "Book (Embroidered Cover)", price: "Rs. 450/-", category: "Stationery", img: "images/book.jpg" },
    
    // ACCESSORIES & DECOR
    { name: "Cutlery Kit", price: "Rs. 260/-", category: "Accessories", img: "images/cutlery.jpg" },
    { name: "Cloth Mask", price: "Rs. 50/-", category: "Accessories", img: "images/mask.jpg" },
    { name: "Patch-work Quilt", price: "On Request", category: "Decor", img: "images/quilt.jpg" }
];

const productList = document.getElementById('product-list');

products.forEach(item => {
    productList.innerHTML += `
        <div class="card">
            <img src="${item.img}" alt="${item.name}">
            <div class="card-info">
                <span class="tag">${item.category}</span>
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
            </div>
        </div>
    `;
});
