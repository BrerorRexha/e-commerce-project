import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductImage from '../components/ProductImage';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Add some products to get started</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm"
            >
              <Link to={`/products/${product.id}`} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                <ProductImage product={product} index={0} size="sm" />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/products/${product.id}`}
                      className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-0.5">{product.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold min-w-[2rem] text-center text-gray-900 dark:text-gray-100">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link to="/" className="text-sm text-blue-500 hover:underline font-medium">
              Continue shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-500 font-medium">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Proceed to checkout
              </button>
            ) : (
              <div className="mt-6 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Sign in to checkout
                </Link>
                <p className="text-xs text-gray-400 text-center">You need an account to place an order</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
