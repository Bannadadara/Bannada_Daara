import { ShoppingCart, Menu, X, Heart } from 'lucide-react';

const Header = ({
  setCurrentPage,
  cartCount,
  wishlistCount,
  showMobileMenu,
  setShowMobileMenu,
  setShowCart
}) => {
  return (
    <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <div className="text-3xl">🌈</div>
            <div>
              <h1 className="text-2xl font-bold">Bannada Daara</h1>
              <p className="text-xs opacity-90">Adding color to your life</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-6">
            {['home', 'shop', 'about', 'contact'].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="hover:underline capitalize"
              >
                {page}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2">
              <Heart className={wishlistCount ? 'fill-red-500 text-red-500' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button onClick={() => setShowCart(true)} className="relative p-2">
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden">
              {showMobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
