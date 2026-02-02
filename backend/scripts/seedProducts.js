const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import Product model
const Product = require('../models/Product');

// Product data from data.js
const productsData = [
    // BAGS
    {
        name: "Reversible Tote Bag",
        price: 500,
        category: "Bags",
        images: [
            { url: "images/reversible-tote1.jpg", alt: "Reversible Tote Bag - Front" },
            { url: "images/reversible-tote2.jpg", alt: "Reversible Tote Bag - Back" }
        ],
        dimensions: "14\" x 16\"",
        description: "Experience two styles in one with our handcrafted reversible tote bag. Made from premium durable fabrics, it features double-stitched reinforcements for heavy-duty use. Whether you're heading to the market or a casual outing, this spacious tote adapts to your look seamlessly.",
        stock: 10,
        featured: true
    },
    {
        name: "Box Tote (Plain)",
        price: 350,
        category: "Bags",
        images: [{ url: "images/box-plain.jpg", alt: "Box Tote Plain" }],
        dimensions: "12\" x 12\"",
        description: "A minimalist masterpiece. This structured box tote offers a clean, sophisticated silhouette perfect for carrying books, groceries, or daily essentials. The sturdy base ensures it stands upright, while the ergonomic handles provide all-day comfort.",
        stock: 15
    },
    {
        name: "Box Tote (Patch-work)",
        price: 500,
        category: "Bags",
        images: [{ url: "images/box-patch.jpg", alt: "Box Tote Patchwork" }],
        dimensions: "12\" x 12\"",
        description: "A vibrant expression of art and sustainability. Each patch-work box tote is a unique mosaic of colors and patterns, meticulously assembled by our artisans. It's not just a bag; it's a conversation starter that supports zero-waste fashion.",
        stock: 8
    },
    {
        name: "String Sling Bag",
        price: 150,
        category: "Bags",
        images: [{ url: "images/sling-reg.jpg", alt: "String Sling Bag" }],
        dimensions: "8\" x 6\"",
        description: "Effortlessly chic and lightweight. Our string sling bag is designed for quick trips and light carry. The drawstring closure keeps your items secure, while the long strap allows for comfortable cross-body wear.",
        stock: 20
    },
    {
        name: "Regular Sling Bag",
        price: 250,
        category: "Bags",
        images: [{ url: "images/sling-reg-m.jpg", alt: "Regular Sling Bag" }],
        dimensions: "9\" x 7\"",
        description: "The perfect companion for your daily adventures. This classic sling bag balances size and style, fitting your phone, wallet, and keys with ease. Crafted with high-quality fabric for longevity and distinct style.",
        stock: 18
    },
    {
        name: "Medium Sling Bag",
        price: 450,
        category: "Bags",
        images: [{ url: "images/sling-reg.jpg", alt: "Medium Sling Bag" }],
        dimensions: "10\" x 8\"",
        description: "Upgrade your carry with our Medium Sling Bag. Offering a bit more room than the standard, it's ideal for those who need space for a small tablet or diary without the bulk of a large backpack.",
        stock: 12
    },
    {
        name: "Sling Bag (Patch-work S)",
        price: 250,
        category: "Bags",
        images: [{ url: "images/sling-patch-s.jpg", alt: "Small Patchwork Sling Bag" }],
        dimensions: "7\" x 6\"",
        description: "Add a splash of color to your outfit with this petite patch-work sling. Hand-stitched from upcycled fabric scraps, each piece tells a colorful story of revival and beauty.",
        stock: 10
    },
    {
        name: "Sling Bag (Patch-work L)",
        price: 550,
        category: "Bags",
        images: [{ url: "images/sling-patch-l.jpg", alt: "Large Patchwork Sling Bag" }],
        dimensions: "11\" x 9\"",
        description: "Bold, beautiful, and big enough for your day. This large patch-work sling combines functional storage with an artistic aesthetic, making it a favorite for those who love bohemian chic.",
        stock: 7
    },
    {
        name: "Laptop Bag (50-50)",
        price: 800,
        category: "Bags",
        images: [{ url: "images/pouch.jpg", alt: "Laptop Bag 50-50" }],
        dimensions: "15.6\" x 11\"",
        description: "Protect your tech in style. Our 50-50 Laptop Bag features a striking two-tone design and padded interiors to keep your device safe from bumps and scratches. Professional yet full of personality.",
        stock: 5
    },
    {
        name: "Potli",
        price: 250,
        category: "Bags",
        images: [{ url: "images/potli.jpg", alt: "Potli Bag" }],
        dimensions: "8\" x 5\"",
        description: "Embrace tradition with our exquisite Potli bag. Perfect for weddings, festivals, or as a statement accessory, it features delicate drawstrings and ample space for your essentials.",
        stock: 15
    },
    {
        name: "Foldable Grocery Bag",
        price: 250,
        category: "Bags",
        images: [{ url: "images/grocery.jpg", alt: "Foldable Grocery Bag" }],
        dimensions: "18\" x 14\"",
        description: "Say goodbye to plastic with our smart Foldable Grocery Bag. It tucks away into a tiny pouch when not in use and expands into a large, sturdy shopper capable of holding heavy loads.",
        stock: 25
    },

    // POUCHES
    {
        name: "U-Shape Pouch (S)",
        price: 100,
        category: "Accessories",
        images: [{ url: "images/u-pouch.jpg", alt: "U-Shape Pouch Small" }],
        dimensions: "4\" x 5\"",
        description: "A cute and curvy utility pouch. The U-shape design allows for wide access, making it perfect for storing coins, earphones, keys, or lipstick.",
        stock: 30
    },
    {
        name: "Travel Kit",
        price: 170,
        category: "Accessories",
        images: [{ url: "images/travel-kit.jpg", alt: "Travel Kit" }],
        dimensions: "9\" x 6\"",
        description: "Your perfect travel companion. This compact kit organizes toiletries, cables, or makeup brushes efficiently, ensuring you travel light and organized.",
        stock: 20
    },
    {
        name: "Pad-Holder",
        price: 100,
        category: "Accessories",
        images: [
            { url: "images/pad-holder-folded.jpg", alt: "Pad Holder Folded" },
            { url: "images/pad-holder-open.jpg", alt: "Pad Holder Open" }
        ],
        dimensions: "5\" x 5\"",
        description: "Discreet, hygienic, and stylish. This purpose-built pouch is designed to carry sanitary napkin pads securely, fitting easily into any handbag or school bag.",
        stock: 25
    },
    {
        name: "Flat Pouch",
        price: 80,
        category: "Accessories",
        images: [{ url: "images/flat-pouch.jpg", alt: "Flat Pouch" }],
        dimensions: "7\" x 5\"",
        description: "Simplicity at its best. The flat profile makes this pouch ideal for sliding into narrow spaces. Great for receipts, cash, cards, or thin stationery items.",
        stock: 35
    },
    {
        name: "Box Pouch",
        price: 170,
        category: "Accessories",
        images: [{ url: "images/box-pouch.jpg", alt: "Box Pouch" }],
        dimensions: "8\" x 4\"",
        description: "A structured pouch that protects its contents. The boxy shape allows it to sit on your desk, making it a great pencil case or makeup organizer.",
        stock: 22
    },
    {
        name: "Trinket",
        price: 40,
        category: "Accessories",
        images: [{ url: "images/TRINKET.jpg", alt: "Trinket Pouch" }],
        dimensions: "3\" x 3\"",
        description: "Small wonders. This tiny trinket pouch is designed for your most precious small items—rings, delicate chains, or memory cards. A perfect little gift.",
        stock: 40
    },

    // STATIONERY
    {
        name: "A4 Files",
        price: 200,
        category: "Accessories",
        images: [{ url: "images/files.jpg", alt: "A4 Files" }],
        dimensions: "12\" x 9\"",
        description: "Elevate your workspace with our handcrafted fabric A4 files. Durable, reusable, and far more stylish than plastic alternatives, they make organizing a joy.",
        stock: 18
    },
    {
        name: "Pen Pouch",
        price: 100,
        category: "Accessories",
        images: [{ url: "images/pouch.jpg", alt: "Pen Pouch" }],
        dimensions: "8\" x 3\"",
        description: "Keep your writing tools in check. This classic cylindrical pen pouch is spacious enough for pens, pencils, and markers, yet compact enough for any bag.",
        stock: 28
    },
    {
        name: "Book (Embroidered Cover)",
        price: 450,
        category: "Accessories",
        images: [{ url: "images/book.jpg", alt: "Embroidered Book Cover" }],
        dimensions: "8.5\" x 5.5\"",
        description: "Capture your thoughts in style. This notebook features a stunning hand-embroidered fabric cover that can be removed and reused on other books once this one is full.",
        stock: 12
    },

    // ACCESSORIES & DECOR
    {
        name: "Cutlery Kit",
        price: 260,
        category: "Accessories",
        images: [{ url: "images/cutlery.jpg", alt: "Cutlery Kit" }],
        dimensions: "9\" x 3\"",
        description: "Dine sustainably anywhere. This roll-up cutlery kit includes pockets for your fork, spoon, and straw (cutlery not included), making zero-waste living easy and fashionable.",
        stock: 15
    },
    {
        name: "Mask",
        price: 50,
        category: "Accessories",
        images: [{ url: "images/mask.jpg", alt: "Fabric Mask" }],
        dimensions: "7\" x 4\"",
        description: "Stay safe and stylish. Our dual-layer fabric masks are breathable, washable, and available in a variety of vibrant prints to match your mood.",
        stock: 50
    },
    {
        name: "Patch-work Quilt",
        price: 0,
        category: "Home Decor",
        images: [{ url: "images/quilt.jpg", alt: "Patchwork Quilt" }],
        onRequest: true,
        dimensions: "90\" x 60\"",
        description: "Wrap yourself in art. Each patchwork quilt is a labor of love, pieced together to create a warm, cozy, and visually stunning addition to your bedroom or living space.",
        stock: 0
    },
    {
        name: "Patch-work Table Cloth",
        price: 0,
        category: "Home Decor",
        images: [{ url: "images/tcloth.jpg", alt: "Patchwork Table Cloth" }],
        onRequest: true,
        dimensions: "72\" x 48\"",
        description: "Set the table with stories. This unique patchwork table cloth brings texture, color, and a homely charm to your dining experience, perfect for family gatherings.",
        stock: 0
    }
];

// Connect to MongoDB and seed products
async function seedProducts() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected Successfully\n');

        // Clear existing products (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});
        console.log('✅ Existing products cleared\n');

        // Insert new products
        console.log('📦 Inserting products into database...');
        const insertedProducts = await Product.insertMany(productsData);
        console.log(`✅ Successfully inserted ${insertedProducts.length} products!\n`);

        // Display summary
        console.log('📊 Product Summary:');
        const categories = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        categories.forEach(cat => {
            console.log(`   - ${cat._id}: ${cat.count} products`);
        });

        console.log('\n✨ Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        console.error(error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the seed function
seedProducts();
