import { Product } from '../types';

interface VisualConfig {
  emojis: string[];
  lightFrom: string;
  lightTo: string;
  darkFrom: string;
  darkTo: string;
}

const VISUALS: Record<string, VisualConfig> = {
  p1:  { emojis: ['🎧','🎵','🔊','📻'], lightFrom: '#EFF6FF', lightTo: '#BFDBFE', darkFrom: '#0f1f3d', darkTo: '#1e3a8a' },
  p2:  { emojis: ['💻','⌨️','🖥️','🖱️'], lightFrom: '#F0F9FF', lightTo: '#BAE6FD', darkFrom: '#0a1929', darkTo: '#075985' },
  p3:  { emojis: ['⌚','📊','💓','🏃'], lightFrom: '#F5F3FF', lightTo: '#DDD6FE', darkFrom: '#1a1535', darkTo: '#3730a3' },
  p4:  { emojis: ['📷','🏔️','🌊','🎬'], lightFrom: '#FFFBEB', lightTo: '#FDE68A', darkFrom: '#1a1000', darkTo: '#78350f' },
  p5:  { emojis: ['🧥','👔','🪡','✂️'], lightFrom: '#EEF2FF', lightTo: '#C7D2FE', darkFrom: '#1a1535', darkTo: '#312e81' },
  p6:  { emojis: ['🧶','🧵','❄️','🌿'], lightFrom: '#FDF4FF', lightTo: '#F5D0FE', darkFrom: '#1e0a2e', darkTo: '#6b21a8' },
  p7:  { emojis: ['👟','🏃','🌬️','⚡'], lightFrom: '#F0FDF4', lightTo: '#BBF7D0', darkFrom: '#021a0a', darkTo: '#166534' },
  p8:  { emojis: ['👖','🌾','☀️','🍃'], lightFrom: '#FAFAF9', lightTo: '#E7E5E4', darkFrom: '#1c1917', darkTo: '#44403c' },
  p9:  { emojis: ['🪑','🌿','📐','🏡'], lightFrom: '#FFFBEB', lightTo: '#FDE68A', darkFrom: '#1c1100', darkTo: '#92400e' },
  p10: { emojis: ['🍽️','☕','🥣','🫖'], lightFrom: '#FFF7ED', lightTo: '#FED7AA', darkFrom: '#1a0f00', darkTo: '#9a3412' },
  p11: { emojis: ['🛏️','🌙','💤','🌸'], lightFrom: '#F0FDFA', lightTo: '#99F6E4', darkFrom: '#021a18', darkTo: '#134e4a' },
  p12: { emojis: ['🧘','🌅','🌿','✨'], lightFrom: '#FAF5FF', lightTo: '#E9D5FF', darkFrom: '#1a0a2e', darkTo: '#6d28d9' },
  p13: { emojis: ['🏋️','💪','🔥','⚙️'], lightFrom: '#FFF1F2', lightTo: '#FECDD3', darkFrom: '#2a0010', darkTo: '#9f1239' },
  p14: { emojis: ['🪖','🚵','⛰️','🛡️'], lightFrom: '#FFF7ED', lightTo: '#FDBA74', darkFrom: '#1a0900', darkTo: '#c2410c' },
  p15: { emojis: ['📚','💡','🌱','🔖'], lightFrom: '#FEFCE8', lightTo: '#FEF08A', darkFrom: '#1a1000', darkTo: '#854d0e' },
  p16: { emojis: ['📐','✏️','💭','🎨'], lightFrom: '#F0FDFA', lightTo: '#99F6E4', darkFrom: '#001a17', darkTo: '#0f766e' },
  p17: { emojis: ['✨','🍊','💊','🌟'], lightFrom: '#FFF1F2', lightTo: '#FECDD3', darkFrom: '#2a001a', darkTo: '#be185d' },
  p18: { emojis: ['💧','🌸','🫧','🌊'], lightFrom: '#FDF4FF', lightTo: '#F5D0FE', darkFrom: '#1a002e', darkTo: '#a21caf' },
};

const CATEGORY_FALLBACK: Record<string, VisualConfig> = {
  electronics: { emojis: ['📱','💡','🔌','📡'], lightFrom: '#EFF6FF', lightTo: '#BFDBFE', darkFrom: '#0f1f3d', darkTo: '#1e3a8a' },
  clothing:    { emojis: ['👕','👗','🧣','👒'], lightFrom: '#F5F3FF', lightTo: '#DDD6FE', darkFrom: '#1a1535', darkTo: '#3730a3' },
  home:        { emojis: ['🏠','🪴','🕯️','🛋️'], lightFrom: '#FFFBEB', lightTo: '#FDE68A', darkFrom: '#1c1100', darkTo: '#78350f' },
  sports:      { emojis: ['⚽','🏆','🎯','🏅'], lightFrom: '#F0FDF4', lightTo: '#BBF7D0', darkFrom: '#021a0a', darkTo: '#166534' },
  books:       { emojis: ['📖','🔍','💬','🌐'], lightFrom: '#FEFCE8', lightTo: '#FEF08A', darkFrom: '#1a1000', darkTo: '#854d0e' },
  beauty:      { emojis: ['💄','🌺','💅','🪞'], lightFrom: '#FDF4FF', lightTo: '#F5D0FE', darkFrom: '#1e0a2e', darkTo: '#7c3aed' },
};

const ANGLES = [135, 45, 225, 315];

interface Props {
  product: Product;
  index?: number;
  size?: 'sm' | 'lg';
}

export default function ProductImage({ product, index = 0, size = 'sm' }: Props) {
  const v = VISUALS[product.id] ?? CATEGORY_FALLBACK[product.category];
  const angle = ANGLES[index % 4];
  const emoji = v.emojis[index % v.emojis.length];
  const emojiSize = size === 'lg' ? 'text-[72px]' : 'text-[48px]';

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Light mode gradient */}
      <div
        className="absolute inset-0 dark:opacity-0 transition-opacity duration-300"
        style={{ background: `linear-gradient(${angle}deg, ${v.lightFrom} 0%, ${v.lightTo} 100%)` }}
      />
      {/* Dark mode gradient */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(${angle}deg, ${v.darkFrom} 0%, ${v.darkTo} 100%)` }}
      />
      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      {/* Emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`${emojiSize} select-none leading-none`}
          role="img"
          aria-label={product.name}
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}
        >
          {emoji}
        </span>
      </div>
    </div>
  );
}
