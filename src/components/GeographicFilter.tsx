import { motion } from 'framer-motion';
import { GeographicCategory } from '../types/project';

interface GeographicFilterProps {
  activeCategory: GeographicCategory;
  onCategoryChange: (category: GeographicCategory) => void;
}

export function GeographicFilter({ activeCategory, onCategoryChange }: GeographicFilterProps) {
  const categories: GeographicCategory[] = ['All', 'CZ_SK', 'ROW'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap justify-center gap-3 mb-8"
    >
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${
            activeCategory === category
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
              : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-gray-300 border border-slate-700/50'
          }`}
        >
          {category}
        </button>
      ))}
    </motion.div>
  );
}
