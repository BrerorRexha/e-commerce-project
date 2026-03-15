interface Props {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

const PATH =
  'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.372 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z';

export default function StarRating({ rating, reviewCount, size = 'sm' }: Props) {
  // Round to nearest 0.5  →  4.4 becomes 4.5,  3.2 becomes 3.0, etc.
  const rounded = Math.round(rating * 2) / 2;
  const dim = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const full = i + 1 <= rounded;
          const half = !full && i + 0.5 === rounded;

          if (half) {
            return (
              <span key={i} className={`relative inline-block ${dim}`}>
                {/* empty star behind */}
                <svg
                  className={`${dim} text-gray-300 dark:text-gray-600`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d={PATH} />
                </svg>
                {/* filled star clipped to left 50% */}
                <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <svg
                    className={`${dim} text-amber-400`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d={PATH} />
                  </svg>
                </span>
              </span>
            );
          }

          return (
            <svg
              key={i}
              className={`${dim} ${full ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d={PATH} />
            </svg>
          );
        })}
      </div>

      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-0.5">
          {rating.toFixed(1)} ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
