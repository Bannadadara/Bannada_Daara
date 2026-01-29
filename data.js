// This file acts as your product database
export const products = [
    // BAGS
    {
        id: 1,
        name: "Reversible Tote Bag",
        price: 500,
        category: "Bags",
        img: "images/reversible-tote1.jpg",
        images: ["images/reversible-tote1.jpg", "images/reversible-tote1.jpg", "images/reversible-tote1.jpg"],
        dimensions: { length: "14\"", width: "16\"" },
        description: "A versatile reversible tote bag perfect for daily errands. Handcrafted with durable fabric and premium stitching. Features a spacious interior and comfortable straps."
    },
    {
        id: 2,
        name: "Box Tote (Plain)",
        price: 350,
        category: "Bags",
        img: "images/box-plain.jpg",
        images: ["images/box-plain.jpg"],
        dimensions: { length: "12\"", width: "12\"" },
        description: "Minimalist box tote design for a sleek look. Ideal for carrying books, groceries, or essentials."
    },
    {
        id: 3,
        name: "Box Tote (Patch-work)",
        price: 500,
        category: "Bags",
        img: "images/box-patch.jpg",
        images: ["images/box-patch.jpg"],
        dimensions: { length: "12\"", width: "12\"" },
        description: "Unique patch-work design making every piece one-of-a-kind. Sturdy construction with artistic flair."
    },
    {
        id: 4,
        name: "String Sling Bag",
        price: 150,
        category: "Bags",
        img: "images/sling-reg.jpg",
        images: ["images/sling-reg.jpg"],
        dimensions: { length: "8\"", width: "6\"" },
        description: "Lightweight string sling bag for quick trips. Easy to carry and stylish."
    },
    {
        id: 5,
        name: "Regular Sling Bag",
        price: 250,
        category: "Bags",
        img: "images/sling-reg-m.jpg",
        images: ["images/sling-reg-m.jpg"],
        dimensions: { length: "9\"", width: "7\"" },
        description: "Classic sling bag design fit for all occasions. Adjustable strap and secure closure."
    },
    {
        id: 6,
        name: "Medium Sling Bag",
        price: 450,
        category: "Bags",
        img: "images/sling-reg.jpg",
        images: ["images/sling-reg.jpg"],
        dimensions: { length: "10\"", width: "8\"" },
        description: "A slightly larger sling bag for those who need a bit more space without the bulk."
    },
    {
        id: 7,
        name: "Sling Bag (Patch-work S)",
        price: 250,
        category: "Bags",
        img: "images/sling-patch-s.jpg",
        images: ["images/sling-patch-s.jpg"],
        dimensions: { length: "7\"", width: "6\"" },
        description: "Small patch-work sling bag adds a pop of color to any outfit."
    },
    {
        id: 8,
        name: "Sling Bag (Patch-work L)",
        price: 550,
        category: "Bags",
        img: "images/sling-patch-l.jpg",
        images: ["images/sling-patch-l.jpg"],
        dimensions: { length: "11\"", width: "9\"" },
        description: "Large patch-work sling bag. Bold patterns meet practical design."
    },
    {
        id: 9,
        name: "Laptop Bag (50-50)",
        price: 800,
        category: "Bags",
        img: "images/pouch.jpg",
        images: ["images/pouch.jpg"],
        dimensions: { length: "15.6\"", width: "11\"" },
        description: "Protective and stylish laptop bag with distinct 50-50 color block design."
    },
    {
        id: 10,
        name: "Potli",
        price: 250,
        category: "Bags",
        img: "images/potli.jpg",
        images: ["images/potli.jpg"],
        dimensions: { length: "8\"", width: "5\"" },
        description: "Traditional Potli bag, perfect for festive occasions or as a chic accessory."
    },
    {
        id: 11,
        name: "Foldable Grocery Bag",
        price: 250,
        category: "Bags",
        img: "images/grocery.jpg",
        images: ["images/grocery.jpg"],
        dimensions: { length: "18\"", width: "14\"" },
        description: "Eco-friendly foldable grocery bag. Compact when folded, spacious when open."
    },

    // POUCHES
    {
        id: 12,
        name: "U-Shape Pouch (S)",
        price: 100,
        category: "Pouches",
        img: "images/u-pouch.jpg",
        images: ["images/u-pouch.jpg"],
        dimensions: { length: "4\"", width: "5\"" },
        description: "Curved U-shape pouch for small essentials like coins or keys."
    },
    {
        id: 13,
        name: "Travel Kit",
        price: 170,
        category: "Pouches",
        img: "images/travel-kit.jpg",
        images: ["images/travel-kit.jpg"],
        dimensions: { length: "9\"", width: "6\"" },
        description: "Compact travel kit to organize toiletries or gadgets effectively."
    },
    {
        id: 14,
        name: "Pad-Holder",
        price: 100,
        category: "Pouches",
        img: "images/pad-holder-folded.jpg",
        images: ["images/pad-holder-folded.jpg"],
        dimensions: { length: "5\"", width: "5\"" },
        description: "Discreet and stylish pad holder for personal hygiene products."
    },
    {
        id: 15,
        name: "Flat Pouch",
        price: 80,
        category: "Pouches",
        img: "images/flat-pouch.jpg",
        images: ["images/flat-pouch.jpg"],
        dimensions: { length: "7\"", width: "5\"" },
        description: "Simple flat pouch for stationery, makeup, or receipts."
    },
    {
        id: 16,
        name: "Box Pouch",
        price: 170,
        category: "Pouches",
        img: "images/box-pouch.jpg",
        images: ["images/box-pouch.jpg"],
        dimensions: { length: "8\"", width: "4\"" },
        description: "Structured box pouch providing extra protection for its contents."
    },
    {
        id: 17,
        name: "Trinket",
        price: 40,
        category: "Pouches",
        img: "images/TRINKET.jpg",
        images: ["images/TRINKET.jpg"],
        dimensions: { length: "3\"", width: "3\"" },
        description: "Tiny trinket pouch for jewelry or small keepsakes."
    },

    // STATIONERY
    {
        id: 18,
        name: "A4 Files",
        price: 200,
        category: "Stationery",
        img: "images/files.jpg",
        images: ["images/files.jpg"],
        dimensions: { length: "12\"", width: "9\"" },
        description: "Handcrafted A4 file folders to keep your documents organized in style."
    },
    {
        id: 19,
        name: "Pen Pouch",
        price: 100,
        category: "Stationery",
        img: "images/pouch.jpg",
        images: ["images/pouch.jpg"],
        dimensions: { length: "8\"", width: "3\"" },
        description: "Cylindrical pen pouch, fits all your writing essentials."
    },
    {
        id: 20,
        name: "Book (Embroidered Cover)",
        price: 450,
        category: "Stationery",
        img: "images/book.jpg",
        images: ["images/book.jpg"],
        dimensions: { length: "8.5\"", width: "5.5\"" },
        description: "Notebook with a beautiful hand-embroidered fabric cover."
    },

    // ACCESSORIES & DECOR
    {
        id: 21,
        name: "Cutlery Kit",
        price: 260,
        category: "Accessories",
        img: "images/cutlery.jpg",
        images: ["images/cutlery.jpg"],
        dimensions: { length: "9\"", width: "3\"" },
        description: "Portable cutlery kit for sustainable dining on the go."
    },
    {
        id: 22,
        name: "Mask",
        price: 50,
        category: "Accessories",
        img: "images/mask.jpg",
        images: ["images/mask.jpg"],
        dimensions: { length: "7\"", width: "4\"" },
        description: "Comfortable and washable fabric mask with unique prints."
    },
    {
        id: 23,
        name: "Patch-work Quilt",
        price: 0,
        category: "Decor",
        img: "images/quilt.jpg",
        images: ["images/quilt.jpg"],
        on_request: true,
        dimensions: { length: "90\"", width: "60\"" },
        description: "Cozy patchwork quilt made from premium fabrics. Warm and decorative."
    },
    {
        id: 24,
        name: "Patch-work Table Cloth",
        price: 0,
        category: "Decor",
        img: "images/tcloth.jpg",
        images: ["images/tcloth.jpg"],
        on_request: true,
        dimensions: { length: "72\"", width: "48\"" },
        description: "Artistic patchwork table cloth to brighten up your dining area."
    }
];
