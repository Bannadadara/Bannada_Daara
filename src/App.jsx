import { useState } from 'react';
import products from './data/products';

import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ProductModal from './components/ProductModal';

import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen">
      <Header
        setCurrentPage={setCurrentPage}
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        setShowCart={setShowCart}
      />

      {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
      {currentPage === 'shop' && (
        <Shop
          products={products}
          setSelectedProduct={setSelectedProduct}
        />
      )}
      {currentPage === 'about' && <About />}
      {currentPage === 'contact' && <Contact />}

      <CartSidebar
        cart={cart}
        setCart={setCart}
        showCart={showCart}
        setShowCart={setShowCart}
      />

      <ProductModal
        product={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      <Footer />
    </div>
  );
};

export default App;
