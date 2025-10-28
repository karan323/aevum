import React, { useMemo, useState } from 'react';
import { getProducts, saveProducts, getCategories } from '../../lib/storage';

export default function Products() {
  const [items, setItems] = useState(() => getProducts());
  const [form, setForm] = useState({ id: '', name: '', category: '', sub: '', price: '', qty: '', img: '/aevum_logo.png', description: '', sizes: 'S,M,L,XL', sizeGuide: '', wishlistLabel: 'Add to wishlist' });
  const [filter, setFilter] = useState('');
  const categories = getCategories();

  function addOrUpdate(e){
    e.preventDefault();
    const price = Number(form.price || 0);
    if (!form.id || !form.name) return;
    const next = [...items];
    const idx = next.findIndex(p => p.id === form.id);
    const sizes = String(form.sizes||'').split(',').map(s=>s.trim()).filter(Boolean);
    const qty = Number(form.qty || 0);
    const data = { id: form.id, name: form.name, category: form.category || 'Misc', sub: form.sub || '', price, qty, img: form.img || '/aevum_logo.png', description: form.description || '', sizes: sizes.length? sizes : ['S','M','L','XL'], sizeGuide: form.sizeGuide || '', wishlistLabel: form.wishlistLabel || 'Add to wishlist' };
    if (idx >= 0) next[idx] = data; else next.unshift(data);
    setItems(next);
    saveProducts(next);
    setForm({ id: '', name: '', category: '', sub: '', price: '', qty: '', img: '/aevum_logo.png', description: '', sizes: 'S,M,L,XL', sizeGuide: '', wishlistLabel: 'Add to wishlist' });
  }

  function remove(id){
    const next = items.filter(p => p.id !== id);
    setItems(next);
    saveProducts(next);
  }

  const view = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(p => `${p.id} ${p.name} ${p.category} ${p.sub}`.toLowerCase().includes(q));
  }, [items, filter]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Products</h2>

      <form onSubmit={addOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <input className="border rounded px-3 py-2" placeholder="ID (unique)" value={form.id} onChange={e=>setForm(v=>({...v,id:e.target.value}))} required />
        <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))} required />
        <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm(v=>({...v,category:e.target.value}))} />
        <input className="border rounded px-3 py-2" placeholder="Subcategory" value={form.sub} onChange={e=>setForm(v=>({...v,sub:e.target.value}))} />
        <div className="flex gap-2">
          <select className="border rounded px-3 py-2 flex-1" value={form.category} onChange={e=>setForm(v=>({...v,category:e.target.value, sub: ''}))}>
            <option value="">Choose category…</option>
            {categories.map(c => (<option key={c.name} value={c.name}>{c.name}</option>))}
          </select>
          <select className="border rounded px-3 py-2 flex-1" value={form.sub} onChange={e=>setForm(v=>({...v,sub:e.target.value}))} disabled={!form.category}>
            <option value="">Choose sub…</option>
            {(categories.find(c => c.name === form.category)?.subs || []).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <input className="border rounded px-3 py-2" type="number" step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm(v=>({...v,price:e.target.value}))} />
        <input className="border rounded px-3 py-2" type="number" step="1" placeholder="Available Quantity" value={form.qty} onChange={e=>setForm(v=>({...v,qty:e.target.value}))} />
        <input className="border rounded px-3 py-2" placeholder="Sizes (comma-separated)" value={form.sizes} onChange={e=>setForm(v=>({...v,sizes:e.target.value}))} />
        <input className="border rounded px-3 py-2" placeholder="Size Guide (URL or note)" value={form.sizeGuide} onChange={e=>setForm(v=>({...v,sizeGuide:e.target.value}))} />
        <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Image URL" value={form.img} onChange={e=>setForm(v=>({...v,img:e.target.value}))} />
        <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm(v=>({...v,description:e.target.value}))} />
        <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Wishlist Label" value={form.wishlistLabel} onChange={e=>setForm(v=>({...v,wishlistLabel:e.target.value}))} />
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save</button>
          <button type="button" className="border px-4 py-2 rounded" onClick={()=>setForm({ id: '', name: '', category: '', sub: '', price: '', qty: '', img: '/aevum_logo.png', description: '', sizes: 'S,M,L,XL', sizeGuide: '', wishlistLabel: 'Add to wishlist' })}>Clear</button>
      </div>
      </form>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">{items.length} products</div>
        <input className="border rounded px-3 py-1" placeholder="Search..." value={filter} onChange={e=>setFilter(e.target.value)} />
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Sizes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {view.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-mono">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category}{p.sub ? ` / ${p.sub}`: ''}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{typeof p.qty === 'number' ? p.qty : 0}</td>
                <td className="p-2">{(p.sizes||[]).join(', ')}</td>
                <td className="p-2">
                  <button className="text-blue-600 mr-3" onClick={()=>setForm({ ...p, price: String(p.price), qty: String(p.qty ?? 0), sizes: (p.sizes||['S','M','L','XL']).join(',') })}>Edit</button>
                  <button className="text-red-600" onClick={()=>remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
