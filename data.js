// This file acts as your product database
export const products = [
    // BAGS
    {
        id: 1,
        name: "Reversible Tote Bag",
        price: 500,
        category: "Bags",
        img: "images/reversible-tote1.jpg",
        images: ["images/reversible-tote1.jpg", "images/reversible-tote2.jpg"],
        dimensions: { length: "14\"", width: "16\"" },
        description: "Experience two styles in one with our handcrafted reversible tote bag. Made from premium durable fabrics, it features double-stitched reinforcements for heavy-duty use. Whether you're heading to the market or a casual outing, this spacious tote adapts to your look seamlessly."
    },
    {
        id: 2,
        name: "Box Tote (Plain)",
        price: 350,
        category: "Bags",
        img: "images/box-plain.jpg",
        images: ["images/box-plain.jpg"],
        dimensions: { length: "12\"", width: "12\"" },
        description: "A minimalist masterpiece. This structured box tote offers a clean, sophisticated silhouette perfect for carrying books, groceries, or daily essentials. The sturdy base ensures it stands upright, while the ergonomic handles provide all-day comfort."
    },
    {
        id: 3,
        name: "Box Tote (Patch-work)",
        price: 500,
        category: "Bags",
        img: "images/box-patch.jpg",
        images: ["images/box-patch.jpg"],
        dimensions: { length: "12\"", width: "12\"" },
        description: "A vibrant expression of art and sustainability. Each patch-work box tote is a unique mosaic of colors and patterns, meticulously assembled by our artisans. It's not just a bag; it's a conversation starter that supports zero-waste fashion."
    },
    {
        id: 4,
        name: "String Sling Bag",
        price: 150,
        category: "Bags",
        img: "images/sling-reg.jpg",
        images: ["images/sling-reg.jpg"],
        dimensions: { length: "8\"", width: "6\"" },
        description: "Effortlessly chic and lightweight. Our string sling bag is designed for quick trips and light carry. The drawstring closure keeps your items secure, while the long strap allows for comfortable cross-body wear."
    },
    {
        id: 5,
        name: "Regular Sling Bag",
        price: 250,
        category: "Bags",
        img: "images/sling-reg-m.jpg",
        images: ["images/sling-reg-m.jpg"],
        dimensions: { length: "9\"", width: "7\"" },
        description: "The perfect companion for your daily adventures. This classic sling bag balances size and style, fitting your phone, wallet, and keys with ease. Crafted with high-quality fabric for longevity and distinct style."
    },
    {
        id: 6,
        name: "Medium Sling Bag",
        price: 450,
        category: "Bags",
        img: "images/sling-reg.jpg",
        images: ["images/sling-reg.jpg"],
        dimensions: { length: "10\"", width: "8\"" },
        description: "Upgrade your carry with our Medium Sling Bag. Offering a bit more room than the standard, it's ideal for those who need space for a small tablet or diary without the bulk of a large backpack."
    },
    {
        id: 7,
        name: "Sling Bag (Patch-work S)",
        price: 250,
        category: "Bags",
        img: "images/sling-patch-s.jpg",
        images: ["images/sling-patch-s.jpg"],
        dimensions: { length: "7\"", width: "6\"" },
        description: "Add a splash of color to your outfit with this petite patch-work sling. Hand-stitched from upcycled fabric scraps, each piece tells a colorful story of revival and beauty."
    },
    {
        id: 8,
        name: "Sling Bag (Patch-work L)",
        price: 550,
        category: "Bags",
        img: "images/sling-patch-l.jpg",
        images: ["images/sling-patch-l.jpg"],
        dimensions: { length: "11\"", width: "9\"" },
        description: "Bold, beautiful, and big enough for your day. This large patch-work sling combines functional storage with an artistic aesthetic, making it a favorite for those who love bohemian chic."
    },
    {
        id: 9,
        name: "Laptop Bag (50-50)",
        price: 800,
        category: "Bags",
        img: "images/pouch.jpg",
        images: ["images/pouch.jpg"],
        dimensions: { length: "15.6\"", width: "11\"" },
        description: "Protect your tech in style. Our 50-50 Laptop Bag features a striking two-tone design and padded interiors to keep your device safe from bumps and scratches. Professional yet full of personality."
    },
    {
        id: 10,
        name: "Potli",
        price: 250,
        category: "Bags",
        img: "images/potli.jpg",
        images: ["images/potli.jpg"],
        dimensions: { length: "8\"", width: "5\"" },
        description: "Embrace tradition with our exquisite Potli bag. Perfect for weddings, festivals, or as a statement accessory, it features delicate drawstrings and ample space for your essentials."
    },
    {
        id: 11,
        name: "Foldable Grocery Bag",
        price: 250,
        category: "Bags",
        img: "images/grocery.jpg",
        images: ["images/grocery.jpg"],
        dimensions: { length: "18\"", width: "14\"" },
        description: "Say goodbye to plastic with our smart Foldable Grocery Bag. It tucks away into a tiny pouch when not in use and expands into a large, sturdy shopper capable of holding heavy loads."
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
        description: "A cute and curvy utility pouch. The U-shape design allows for wide access, making it perfect for storing coins, earphones, keys, or lipstick."
    },
    {
        id: 13,
        name: "Travel Kit",
        price: 170,
        category: "Pouches",
        img: "images/travel-kit.jpg",
        images: ["images/travel-kit.jpg"],
        dimensions: { length: "9\"", width: "6\"" },
        description: "Your perfect travel companion. This compact kit organizes toiletries, cables, or makeup brushes efficiently, ensuring you travel light and organized."
    },
    {
        id: 14,
        name: "Pad-Holder",
        price: 100,
        category: "Pouches",
        img: "images/pad-holder-folded.jpg",
        images: ["images/pad-holder-folded.jpg", "images/pad-holder-open.jpg"],
        dimensions: { length: "5\"", width: "5\"" },
        description: "Discreet, hygienic, and stylish. This purpose-built pouch is designed to carry sanitary napkin pads securely, fitting easily into any handbag or school bag."
    },
    {
        id: 15,
        name: "Flat Pouch",
        price: 80,
        category: "Pouches",
        img: "images/flat-pouch.jpg",
        images: ["images/flat-pouch.jpg"],
        dimensions: { length: "7\"", width: "5\"" },
        description: "Simplicity at its best. The flat profile makes this pouch ideal for sliding into narrow spaces. Great for receipts, cash, cards, or thin stationery items."
    },
    {
        id: 16,
        name: "Box Pouch",
        price: 170,
        category: "Pouches",
        img: "images/box-pouch.jpg",
        images: ["images/box-pouch.jpg"],
        dimensions: { length: "8\"", width: "4\"" },
        description: "A structured pouch that protects its contents. The boxy shape allows it to sit on your desk, making it a great pencil case or makeup organizer."
    },
    {
        id: 17,
        name: "Trinket",
        price: 40,
        category: "Pouches",
        img: "images/TRINKET.jpg",
        images: ["images/TRINKET.jpg"],
        dimensions: { length: "3\"", width: "3\"" },
        description: "Small wonders. This tiny trinket pouch is designed for your most precious small items—rings, delicate chains, or memory cards. A perfect little gift."
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
        description: "Elevate your workspace with our handcrafted fabric A4 files. Durable, reusable, and far more stylish than plastic alternatives, they make organizing a joy."
    },
    {
        id: 19,
        name: "Pen Pouch",
        price: 100,
        category: "Stationery",
        img: "images/pouch.jpg",
        images: ["images/pouch.jpg"],
        dimensions: { length: "8\"", width: "3\"" },
        description: "Keep your writing tools in check. This classic cylindrical pen pouch is spacious enough for pens, pencils, and markers, yet compact enough for any bag."
    },
    {
        id: 20,
        name: "Book (Embroidered Cover)",
        price: 450,
        category: "Stationery",
        img: "images/book.jpg",
        images: ["images/book.jpg"],
        dimensions: { length: "8.5\"", width: "5.5\"" },
        description: "Capture your thoughts in style. This notebook features a stunning hand-embroidered fabric cover that can be removed and reused on other books once this one is full."
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
        description: "Dine sustainably anywhere. This roll-up cutlery kit includes pockets for your fork, spoon, and straw (cutlery not included), making zero-waste living easy and fashionable."
    },
    {
        id: 22,
        name: "Mask",
        price: 50,
        category: "Accessories",
        img: "images/mask.jpg",
        images: ["images/mask.jpg"],
        dimensions: { length: "7\"", width: "4\"" },
        description: "Stay safe and stylish. Our dual-layer fabric masks are breathable, washable, and available in a variety of vibrant prints to match your mood."
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
        description: "Wrap yourself in art. Each patchwork quilt is a labor of love, pieced together to create a warm, cozy, and visually stunning addition to your bedroom or living space."
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
        description: "Set the table with stories. This unique patchwork table cloth brings texture, color, and a homely charm to your dining experience, perfect for family gatherings."
    }
];
