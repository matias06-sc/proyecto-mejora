import { ArrowRight, Zap } from 'lucide-react';
import { categoryColors } from '@/lib/catalog';
import type { Category } from '@/lib/types';

type CategoryStripProps = {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
};

export function CategoryStrip({ categories, onSelectCategory }: CategoryStripProps) {
  return (
    <section className="category-strip" id="soluciones"><div className="section-kicker">Explora por solución</div><div className="category-grid">{categories.slice(0, 4).map((category, index) => <button key={category.id} className="category-tile" onClick={() => onSelectCategory(category.id)}><span className={`category-icon ${categoryColors[index % categoryColors.length]}`}><Zap size={19} /></span><span>{category.name}</span><ArrowRight size={16} /></button>)}</div></section>
  );
}
