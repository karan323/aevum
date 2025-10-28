import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts } from '../lib/storage'

export default function Wishlist(){
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('aevum_user') || 'null') } catch { return null }
  }, [])
  const email = (user?.email || '').toLowerCase()
  const key = email ? `aevum_wishlist_${email}` : 'aevum_wishlist'

  useEffect(() => {
    if (!user) return;
    try {
      const wl = JSON.parse(localStorage.getItem(key) || '[]')
      setItems(Array.isArray(wl) ? wl : [])
    } catch { setItems([]) }
  }, [key, user])

  function removeItem(rem){
    try {
      const wl = JSON.parse(localStorage.getItem(key) || '[]')
      const next = wl.filter(it => !(it.id === rem.id && (('size' in rem) ? it.size === rem.size : true)))
      localStorage.setItem(key, JSON.stringify(next))
      setItems(next)
    } catch {}
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <p className="text-gray-700">Please log in to view your wishlist.</p>
        <Link to="/login" className="inline-block mt-3 px-4 py-2 bg-black text-white rounded">Login</Link>
      </div>
    )
  }

  const products = getProducts()
  const fullItems = items.map(it => ({...it, product: products.find(p=>p.id===it.id)}))

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Your Wishlist</h2>
      {fullItems.length===0 ? (
        <p className="mt-4 text-gray-600">No items yet. Explore the shop and add some favorites.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {fullItems.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between border rounded p-3">
              <div className="flex items-center gap-3">
                <img src={it.product?.img} alt={it.name} className="w-16 h-16 object-contain" />
                <div>
                  <div className="font-semibold">{it.name}</div>
                  {it.size && <div className="text-sm text-gray-500">Size: {it.size}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/product/${it.id}`} className="px-3 py-1 border rounded">View</Link>
                <button onClick={() => removeItem(it)} className="px-3 py-1 border rounded text-red-600 hover:bg-red-50">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
