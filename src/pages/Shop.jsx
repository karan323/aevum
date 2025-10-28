import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getProducts } from '../lib/storage'
import ProductCard from '../components/ProductCard'

export default function Shop(){ 
  const { search } = useLocation()
  const q = useMemo(() => new URLSearchParams(search).get('q')?.trim() || '', [search])

  const items = useMemo(() => {
    const list = getProducts()
    if (!q) return list
    const term = q.toLowerCase()
    return list.filter(p => `${p.name} ${p.category} ${p.sub}`.toLowerCase().includes(term))
  }, [q])

  return (
    <div>
      <h1 className="text-2xl font-bold text-aevumNavy">Shop</h1>
      <p className="text-gray-600 mt-2">
        {q ? `Results for: "${q}"` : 'Browse our collection.'}
      </p>

      {items.length === 0 ? (
        <div className="mt-10 text-gray-600">No products found. Try a different search.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  )
}
