import { X, Trash2 } from 'lucide-react';

export default function CartSidebar({ cart, setCart, showCart }) {
  if (!showCart) return null;

  const removeItem = (id) =>
    setCart(cart.filter(item => item.id !== id));

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg z-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold">Cart</h2>
        <X className="cursor-pointer" onClick={() => setCart([])} />
      </div>

      <div className="p-4 space-y-4">
        {cart.length === 0 && <p>Your cart is empty</p>}
        {cart.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
            <Trash2
              className="cursor-pointer text-red-500"
              onClick={() => removeItem(item.id)}
            />
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t">
          <p className="font-bold">Total: ₹{total}</p>
          <button className="w-full mt-2 bg-purple-600 text-white py-2 rounded">
            Checkout (WhatsApp)
          </button>
        </div>
      )}
    </div>
  );
}
