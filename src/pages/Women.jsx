import React from 'react';
import { getProducts } from '../lib/storage';
import ProductCard from '../components/ProductCard';

export default function Women(){
  const items = getProducts().filter(p => (p.category||'').toLowerCase() === 'women');
  return (
    <div>
      <h1 className="text-2xl font-bold text-aevumNavy">Women</h1>
      <p className="text-gray-600 mt-2">Explore Women’s collection.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}

