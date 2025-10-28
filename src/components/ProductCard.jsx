import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'

export default function ProductCard({ p }){
  const sizes = Array.isArray(p?.sizes) && p.sizes.length ? p.sizes : ['S','M','L','XL']
  const sizeRange = sizes.length > 1 ? `${sizes[0]}-${sizes[sizes.length-1]}` : sizes[0]
  const colors = Array.isArray(p?.colors) ? p.colors.slice(0,5) : []
  const rating = typeof p?.rating === 'number' ? p.rating : null
  const ratingCount = typeof p?.ratingCount === 'number' ? p.ratingCount : null

  function addToWishlist(e){
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('aevum_user') || 'null')
    const email = (user?.email || '').toLowerCase()
    const key = email ? `aevum_wishlist_${email}` : 'aevum_wishlist'
    const wl = JSON.parse(localStorage.getItem(key) || '[]')
    if (!wl.find((i) => i.id === p.id)) wl.push({ id: p.id, name: p.name })
    localStorage.setItem(key, JSON.stringify(wl))
  }

  return (
    <Link to={`/product/${p.id}`} className="group block overflow-hidden focus:outline-none focus:ring-2 focus:ring-aevumNavy/30">
      {/* Image */}
      <div className="bg-white aspect-[4/3] w-full flex items-center justify-center">
        <img src={p.img} alt={p.name} className="h-full w-full object-contain p-4 transition-transform duration-200 group-hover:scale-[1.02]" />
      </div>

      {/* Swatches + wishlist */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {colors.map((c, i) => (
            <span key={i} className="w-4 h-4 rounded-full border" style={{ backgroundColor: c }} />
          ))}
          {colors.length === 0 && <span className="w-4 h-4 rounded-full border bg-gray-200" />}
        </div>
        <button onClick={addToWishlist} aria-label="Add to wishlist" className="p-1 rounded hover:bg-gray-100">
          <Heart className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Meta */}
      <div className="px-4 pb-4">
        <div className="text-[11px] uppercase tracking-wide text-gray-500">
          {(p.category || 'Unisex')}, {sizeRange}
        </div>
        <div className="mt-1 font-semibold uppercase text-[15px] text-gray-900">
          {p.name}
        </div>
        <div className="mt-2 font-extrabold text-lg text-aevumGold">
          ${p.price}
        </div>
        {rating !== null && (
          <div className="mt-1 flex items-center gap-1 text-sm text-gray-700">
            <Star className="w-4 h-4 fill-current text-gray-800" />
            <span>{rating.toFixed(1)}</span>
            {typeof ratingCount === 'number' && <span className="text-gray-500">({ratingCount})</span>}
          </div>
        )}
      </div>
    </Link>
  )
}
