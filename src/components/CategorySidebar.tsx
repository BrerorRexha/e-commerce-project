import { categories } from '../data/categories';

interface Props {
  activeCategory: string;
  onSelect: (id: string) => void;
  counts: Record<string, number>;
}

export default function CategorySidebar({ activeCategory, onSelect, counts }: Props) {
  return (
    <aside className="w-56 shrink-0">
      <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
        Categories
      </h2>
      <ul className="space-y-1">
        {categories.map((cat) => {
          const count =
            cat.id === 'all'
              ? Object.values(counts).reduce((a, b) => a + b, 0)
              : (counts[cat.id] ?? 0);
          const isActive = activeCategory === cat.id;
          return (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
