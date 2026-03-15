import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import StarRating from '../components/StarRating';
import ProductImage from '../components/ProductImage';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const product = products.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Product not found</p>
        <button onClick={() => navigate('/')} className="text-blue-500 hover:underline text-sm">
          Back to shop
        </button>
      </div>
    );
  }

  const cartItem = items.find((i) => i.product.id === product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors">
          Shop
        </button>
        <span>/</span>
        <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors capitalize">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-200 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image carousel */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="aspect-square rounded-2xl overflow-hidden">
            <ProductImage product={product} index={activeImage} size="lg" />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === i
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <ProductImage product={product} index={i} size="sm" />
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 pt-1">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`rounded-full transition-all duration-200 ${
                  activeImage === i
                    ? 'w-6 h-2 bg-blue-500'
                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 leading-tight">
              {product.name}
            </h1>
            {!product.inStock && (
              <span className="shrink-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold px-3 py-1 rounded-full">
                Out of stock
              </span>
            )}
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

          <div className="flex items-baseline gap-3 mt-4 mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-bold px-2 py-0.5 rounded-lg">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {product.inStock && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-lg font-medium transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-sm font-semibold min-w-[3rem] text-center text-gray-900 dark:text-gray-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-lg font-medium transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                }`}
              >
                {added
                  ? 'Added to cart!'
                  : cartItem
                  ? `Add more (${cartItem.quantity} in cart)`
                  : 'Add to cart'}
              </button>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 space-y-2.5 text-sm text-gray-600 dark:text-gray-400 mt-auto">
            {[
              'Free shipping on orders over $50',
              '30-day returns',
              'Secure checkout',
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <button
                key={p.id}
                onClick={() => { navigate(`/products/${p.id}`); window.scrollTo(0, 0); }}
                className="text-left bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-square overflow-hidden">
                  <div className="w-full h-full group-hover:scale-105 transition-transform duration-300">
                    <ProductImage product={p} index={0} size="sm" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</p>
                  <p className="text-sm text-blue-500 font-bold mt-1">${p.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
