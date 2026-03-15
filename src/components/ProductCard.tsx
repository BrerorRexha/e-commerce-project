import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import StarRating from './StarRating';
import ProductImage from './ProductImage';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200 group">
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <div className="w-full h-full group-hover:scale-105 transition-transform duration-300">
            <ProductImage product={product} index={0} size="sm" />
          </div>
        </div>
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 bg-gray-900/80 dark:bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
            Out of stock
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight mb-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={!product.inStock}
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          {product.inStock ? 'Add to cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}
