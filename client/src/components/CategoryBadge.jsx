import { CATEGORY_COLORS } from '../utils';

export default function CategoryBadge({ category }) {
  const cls = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['기타'];
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${cls}`}>
      {category}
    </span>
  );
}
