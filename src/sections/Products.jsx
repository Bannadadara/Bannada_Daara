import products from "../data/products";

export default function Products() {
  return (
    <section id="products">
      <h2>Our Products</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
        Explore our handcrafted collection of eco-friendly products
      </p>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-price">
              {typeof product.price === "number" 
                ? `₹${product.price}` 
                : product.price}
            </p>

            <a
              href={`https://wa.me/918105750221?text=Hi! I'm interested in ordering ${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="product-order-btn"
              aria-label={`Order ${product.name} on WhatsApp`}
            >
              💬 Order on WhatsApp
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
