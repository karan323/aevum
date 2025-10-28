import React from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../lib/storage';
import ProductCard from '../components/ProductCard';

export default function Men() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const cat = params.get('cat');
  const sub = params.get('sub');

  const items = getProducts().filter((p) => (p.category || '').toLowerCase() === 'men');

  const heading = `Men${cat ? ` — ${cat}` : ''}${sub ? ` / ${sub}` : ''}`;
  const subheading = `Explore Men's collection${sub ? ` — ${sub}` : cat ? ` — ${cat}` : ''}.`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-aevumNavy">{heading}</h1>
      <p className="text-gray-600 mt-2">{subheading}</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

