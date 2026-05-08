/**
 * Breadcrumb.jsx — Navigation breadcrumb trail.
 */

import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-xs font-bold text-obsidian-400 uppercase tracking-wider flex-wrap">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-obsidian-200">/</span>}
            {item.to ? (
              <Link to={item.to} className="hover:text-gold-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-obsidian-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
