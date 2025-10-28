import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Checkout(){
  const [cart, setCart] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState(null)

  useEffect(()=>{
    setCart(JSON.parse(localStorage.getItem('aevum_cart') || '[]'))
    // Prefill from account if available
    try {
      const user = JSON.parse(localStorage.getItem('aevum_user') || 'null')
      if (user) {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
        const addr = user.address || {}
        const addrText = [addr.addr1, addr.addr2, `${addr.city}, ${addr.province}`, `${addr.country} ${addr.postal}`]
          .filter(Boolean).join('\n')
        setName(fullName)
        setEmail(user.email || '')
        setAddress(addrText)
      }
    } catch {}
  },[])

  const total = cart.reduce((s,i) => s + i.price * i.qty, 0)

  function placeOrderDemo(e){
    e.preventDefault()
    // Demo payment flow: confirm order locally and clear cart
    const order = {
      id: 'ORD' + Date.now(),
      date: new Date().toISOString(),
      name, email, address, items: cart, total
    }
    // For demo we store in localStorage and show confirmation
    const orders = JSON.parse(localStorage.getItem('aevum_orders') || '[]')
    orders.push(order)
    localStorage.setItem('aevum_orders', JSON.stringify(orders))
    localStorage.removeItem('aevum_cart')
    setCart([])
    setStatus({ ok: true, orderId: order.id })
  }

  if(status && status.ok){
    return (
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold">Order Confirmed</h2>
        <p className="mt-4">Order ID: <span className="font-mono">{status.orderId}</span></p>
        <p className="mt-4">This is a demo confirmation only. Payment gateway is in demo mode.</p>
        <div className="mt-6">
          <Link to="/" className="text-aevumGold font-semibold">Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold">Your Cart</h2>
        <div className="mt-4 space-y-4">
          {cart.length===0 && <div className="text-gray-500">Your cart is empty. <Link to="/shop" className="text-aevumGold">Shop now</Link></div>}
          {cart.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-gray-500">Qty: {it.qty}</div>
              </div>
              <div className="font-bold">${it.price * it.qty}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right font-bold">Total: ${total}</div>
      </div>

      <div>
        <h2 className="text-xl font-bold">Billing & Demo Payment</h2>
        <form onSubmit={placeOrderDemo} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm">Full name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="w-full border rounded px-3 py-2"/>
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border rounded px-3 py-2"/>
          </div>
          <div>
            <label className="block text-sm">Address</label>
            <textarea value={address} onChange={e=>setAddress(e.target.value)} required className="w-full border rounded px-3 py-2"/>
          </div>

          <div className="p-4 bg-yellow-50 rounded border">
            <div className="font-semibold">Demo Payment</div>
            <div className="text-sm text-gray-600 mt-1">This demo does not use a real payment gateway. Replace this with Stripe/PayPal integration when ready.</div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={cart.length===0} className="bg-aevumGold text-white px-4 py-2 rounded font-semibold">Place order (Demo)</button>
            <Link to="/shop" className="px-4 py-2 border rounded">Continue shopping</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
