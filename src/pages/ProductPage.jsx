import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducts } from '../lib/storage'
import { Heart, Share2 } from 'lucide-react'

export default function ProductPage(){
  const { id } = useParams()
  const product = getProducts().find(p => p.id === id)
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const sizes = useMemo(() => (product?.sizes && product.sizes.length ? product.sizes : ['S','M','L','XL']), [product])
  const [size, setSize] = useState(sizes[0])

  if(!product) return <div>Product not found</div>

  function addToCartDemo(){
    // for demo: store in localStorage
    const cart = JSON.parse(localStorage.getItem('aevum_cart') || '[]')
    cart.push({ id: product.id, name: product.name, price: product.price, qty, size })
    localStorage.setItem('aevum_cart', JSON.stringify(cart))
    // notify listeners (same-tab) that cart changed
    try { window.dispatchEvent(new Event('aevum_cart_changed')) } catch {}
    navigate('/checkout')
  }

  function addToWishlist(){
    const user = JSON.parse(localStorage.getItem('aevum_user') || 'null')
    const email = (user?.email || '').toLowerCase()
    const key = email ? `aevum_wishlist_${email}` : 'aevum_wishlist'
    const wl = JSON.parse(localStorage.getItem(key) || '[]')
    if (!wl.find((i) => i.id === product.id && i.size === size)) wl.push({ id: product.id, name: product.name, size })
    localStorage.setItem(key, JSON.stringify(wl))
    alert('Added to wishlist')
  }

  async function shareProduct(){
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        alert('Link copied')
      }
    } catch {}
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Large image */}
      <div className="bg-gray-50 rounded-lg flex items-center justify-center md:sticky md:top-[var(--header-h)] md:h-[70vh]">
        <img src={product.img} alt={product.name} className="max-h-[65vh] w-auto object-contain"/>
      </div>

      {/* Right: Details */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
        <div className="text-sm text-gray-500 mt-1">{product.category} - {product.sub}</div>
        <div className="mt-4 text-aevumGold font-extrabold text-2xl">${product.price}</div>
        <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

        {/* Size selection */}
        <div className="mt-6">
          <div className="text-sm text-gray-600 mb-2">Select size</div>
          <div className="flex gap-3 flex-wrap">
            {sizes.map(s => (
              <button
                key={s}
                onClick={()=>setSize(s)}
                className={`px-4 py-2 text-sm md:text-base rounded-lg border-2 ${size===s? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-50'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <a href={product.sizeGuide || '#'} className="text-sm text-gray-600 underline">Size Guide</a>
          </div>
        </div>

        {/* Quantity pill */}
        <div className="mt-6">
          <div className="inline-flex items-center rounded-full border overflow-hidden">
            <button
              className="px-4 py-2 hover:bg-gray-50"
              aria-label="Decrease quantity"
              onClick={()=> setQty(q => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="px-5 text-sm font-medium select-none">Qty {qty}</span>
            <button
              className="px-4 py-2 hover:bg-gray-50"
              aria-label="Increase quantity"
              onClick={()=> setQty(q => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart on its own line */}
        <div className="mt-6">
          <button onClick={addToCartDemo} className="w-full md:w-auto bg-aevumGold text-white px-6 py-3 rounded-md font-semibold">Add to cart</button>
        </div>

        {/* Share and Wishlist aligned left */}
        <div className="mt-4 flex items-center justify-start gap-3">
          <button onClick={shareProduct} className="flex items-center gap-2 px-4 py-2 border rounded" aria-label="Share">
            <Share2 className="w-5 h-5" /> Share
          </button>
          <button onClick={addToWishlist} className="px-4 py-2 border rounded" aria-label="Add to wishlist">
            {product.wishlistLabel || 'Add to wishlist'}
          </button>
        </div>

        {/* Back button last line */}
        <div className="mt-6">
          <button onClick={() => navigate('/shop')} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    </div>
  )
}
