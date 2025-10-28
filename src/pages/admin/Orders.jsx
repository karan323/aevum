import React, { useEffect, useState } from 'react';
import { getOrders, saveOrders } from '../../lib/storage';

export default function Orders() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const list = getOrders().map(o => ({ status: 'pending', ...o }));
    setItems(list);
  }, []);

  function updateStatus(id, status){
    const next = items.map(o => o.id === id ? { ...o, status } : o);
    setItems(next);
    saveOrders(next);
  }

  function remove(id){
    const next = items.filter(o => o.id !== id);
    setItems(next);
    saveOrders(next);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
      <div className="text-sm text-gray-600 mb-4">{items.length} orders</div>

      {items.length === 0 && <div className="text-gray-500">No orders yet.</div>}

      <div className="space-y-3">
        {items.map(o => (
          <div key={o.id} className="border rounded p-3 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{o.id}</div>
                <div className="text-sm text-gray-600">{new Date(o.date).toLocaleString()}</div>
                <div className="text-sm">{o.name} - {o.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <select className="border rounded px-2 py-1" value={o.status} onChange={e=>updateStatus(o.id, e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="canceled">Canceled</option>
                </select>
                <button className="text-red-600" onClick={()=>remove(o.id)}>Delete</button>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <div>Items:</div>
              <ul className="list-disc ml-5">
                {(o.items||[]).map((it, idx) => (
                  <li key={idx}>{it.name} x {it.qty} - ${it.price * it.qty}</li>
                ))}
              </ul>
              <div className="font-semibold mt-2">Total: ${o.total}</div>
              <div className="text-sm text-gray-600 mt-1">Ship to: {o.address}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

