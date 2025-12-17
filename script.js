const products = [
    // BAGS
    { name: "Reversible Tote Bag", price: "Rs. 500/-", category: "Bags", img: "images/reversible-tote1.jpg" },
    { name: "Reversible Tote Bag", price: "Rs. 500/-", category: "Bags", img: "images/reversible-tote2.jpg" },
    { name: "Box Tote (Plain)", price: "Rs. 350/-", category: "Bags", img: "images/box-plain.jpg" },
    { name: "Box Tote (Patch-work)", price: "Rs. 500/-", category: "Bags", img: "images/box-patch.jpg" },
   - { name: "Laptop Bag (50-50)", price: "Rs. 800/-", category: "Bags", img: "images/laptop.jpg" },
    { name: "Sling Bag (Regular)", price: "Rs. 250/-", category: "Bags", img: "images/sling-reg.jpg" },
    { name: "Sling Bag (Medium)", price: "Rs. 450/-", category: "Bags", img: "images/sling-reg-m.jpg" },
    { name: "Sling Bag (Patch-work L)", price: "Rs. 550/-", category: "Bags", img: "images/sling-patch-l.jpg" },
    { name: "Sling Bag (Patch-work S)", price: "Rs. 250/-, Rs 200/-", category: "Bags", img: "images/sling-patch-s.jpg" },
    { name: "Potli Bag", price: "Rs. 250/-", category: "Bags", img: "images/potli.jpg" },
    { name: "Foldable Grocery Bag", price: "Rs. 250/-", category: "Bags", img: "images/grocery.jpg" },
    
    // POUCHES
    { name: "Travel Kit", price: "Rs. 170/-", category: "Pouches", img: "images/travel-kit.jpg" },
    { name: "U Shape Pouch", price: "Rs. 100/-", category: "Pouches", img: "images/u-pouch.jpg" },
    { name: "Pad-Holder (open)", price: "Rs. 100/-", category: "Pouches", img: "images/pad-holder-open.jpg" },
    { name: "Pad-Holder (folded)", price: "Rs. 100/-", category: "Pouches", img: "images/pad-holder-folded.jpg" },
    { name: "Box Pouch", price: "Rs. 170/-", category: "Pouches", img: "images/box-pouch.jpg" },
    { name: "Flat Pouch", price: "Rs. 80/-", category: "Pouches", img: "images/flat-pouch.jpg" },
    { name: "TRINKET", price: "Rs. 40/-", category: "Pouches", img: "images/TRINKET.jpg" }
    
    // STATIONERY
    { name: "A4 Files", price: "Rs. 200/-", category: "Stationery", img: "images/files.jpg" },
    { name: "Book (Embroidered Cover)", price: "Rs. 450/-", category: "Stationery", img: "images/book.jpg" },
    { name: "pen pouch", price: "Rs. 100/-", category: "Stationery", img: "images/pouch.jpg" }
    
    // ACCESSORIES & DECOR
    { name: "Cutlery Kit", price: "Rs. 260/-", category: "Accessories", img: "images/cutlery.jpg" },
    { name: "Cloth Mask", price: "Rs. 50/-", category: "Accessories", img: "images/mask.jpg" },
    { name: "Patch-work Quilt", price: "On Request", category: "Decor", img: "images/quilt.jpg" }
    { name: "Patch-work Table cloth", price: "On Request", category: "Decor", img: "images/tcloth.jpg" }
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
