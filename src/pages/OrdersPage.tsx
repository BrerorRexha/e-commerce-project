import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockOrders } from '../data/orders';
import ProductImage from '../components/ProductImage';

const STATUS_STYLES: Record<string, string> = {
  processing: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  shipped:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  delivered:  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  cancelled:  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const STATUS_ICONS: Record<string, string> = {
  processing: '⏳',
  shipped:    '🚚',
  delivered:  '✅',
  cancelled:  '❌',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sign in to view your orders</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Your order history will appear here</p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const userOrders = mockOrders.filter((o) => o.userId === user.id);

  if (userOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No orders yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Your orders will appear here</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Orders</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">{userOrders.length} orders</span>
      </div>

      <div className="space-y-5">
        {userOrders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap gap-6 text-sm">
                  {[
                    { label: 'Order', value: order.id },
                    { label: 'Placed', value: formatDate(order.createdAt) },
                    { label: 'Est. delivery', value: formatDate(order.estimatedDelivery) },
                    { label: 'Total', value: `$${order.total.toFixed(2)}`, bold: true },
                  ].map(({ label, value, bold }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-0.5">
                        {label}
                      </p>
                      <p className={`${bold ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-semibold text-gray-800 dark:text-gray-200'}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status]}`}>
                  <span>{STATUS_ICONS[order.status]}</span>
                  <span className="capitalize">{order.status}</span>
                </span>
              </div>

              {/* Order items */}
              <div className="px-6 py-4 divide-y divide-gray-50 dark:divide-gray-800">
                {order.items.map(({ product, quantity, priceAtPurchase }) => (
                  <div key={product.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="shrink-0 w-16 h-16 rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <ProductImage product={product} index={0} size="sm" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="font-medium text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-left"
                      >
                        {product.name}
                      </button>
                      <p className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-0.5">{product.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        ${(priceAtPurchase * quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {quantity} x ${priceAtPurchase.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping info */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {order.shippingAddress}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
