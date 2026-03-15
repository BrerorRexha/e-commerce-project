import { useState, useMemo } from 'react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Reviews', value: 'reviews' },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((c) => {
      if (c.id !== 'all') counts[c.id] = products.filter((p) => p.category === c.id).length;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    let result =
      activeCategory === 'all'
        ? products
        : products.filter((p) => p.category === activeCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case 'price-asc':  return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price);
      case 'rating':     return [...result].sort((a, b) => b.rating - a.rating);
      case 'reviews':    return [...result].sort((a, b) => b.reviewCount - a.reviewCount);
      default:           return result;
    }
  }, [activeCategory, sort, search]);

  const activeCatLabel = categories.find((c) => c.id === activeCategory)?.name ?? 'Products';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 rounded-3xl p-8 mb-10 text-white">
        <div className="relative z-10">
          <p className="text-sm font-medium text-blue-200 mb-1">New arrivals</p>
          <h1 className="text-3xl font-bold mb-2">Shop Everything</h1>
          <p className="text-blue-100 text-sm max-w-md opacity-90">
            Premium products across electronics, fashion, home, sports, books and beauty.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute right-16 top-0 w-24 h-24 bg-white/5 rounded-full" />
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <CategorySidebar
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile category strip */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Search + sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{activeCatLabel}</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} products</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
