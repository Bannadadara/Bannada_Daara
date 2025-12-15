import { ShoppingCart } from 'lucide-react';

export default function Header({ setPage, setShowCart }) {
  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => setPage('home')}
        >
          🌈 Bannada Daara
        </h1>
        <nav className="flex gap-6">
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('shop')}>Shop</button>
          <button onClick={() => setPage('about')}>About</button>
          <button onClick={() => setPage('contact')}>Contact</button>
          <button onClick={() => setShowCart(true)}>
            <ShoppingCart />
          </button>
        </nav>
      </div>
    </header>
  );
}
