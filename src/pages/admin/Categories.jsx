import React, { useMemo, useState } from 'react';
import { getCategories, saveCategories } from '../../lib/storage';

export default function Categories() {
  const [list, setList] = useState(() => getCategories());
  const [filter, setFilter] = useState('');
  const [catName, setCatName] = useState('');
  const [subName, setSubName] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const view = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return list;
    return list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.subs||[]).some(s => s.toLowerCase().includes(q))
    );
  }, [list, filter]);

  function addCategory(e) {
    e.preventDefault();
    const name = catName.trim();
    if (!name) return;
    if (list.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setCatName('');
      return;
    }
    const next = [...list, { name, subs: [] }];
    setList(next);
    saveCategories(next);
    setCatName('');
  }

  function removeCategory(name) {
    const next = list.filter(c => c.name !== name);
    setList(next);
    saveCategories(next);
    if (selectedCat === name) setSelectedCat('');
  }

  function addSub(e) {
    e.preventDefault();
    const cat = list.find(c => c.name === selectedCat);
    if (!cat) return;
    const s = subName.trim();
    if (!s) return;
    if ((cat.subs||[]).some(x => x.toLowerCase() === s.toLowerCase())) {
      setSubName('');
      return;
    }
    const next = list.map(c => c.name === selectedCat ? { ...c, subs: [...(c.subs||[]), s] } : c);
    setList(next);
    saveCategories(next);
    setSubName('');
  }

  function removeSub(cat, sub) {
    const next = list.map(c => c.name === cat ? { ...c, subs: (c.subs||[]).filter(s => s !== sub) } : c);
    setList(next);
    saveCategories(next);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

      <div className="flex flex-col md:flex-row gap-4 md:items-end mb-6">
        <form onSubmit={addCategory} className="flex gap-2">
          <input className="border rounded px-3 py-2" placeholder="New category name" value={catName} onChange={e=>setCatName(e.target.value)} />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">Add Category</button>
        </form>
        <div className="flex gap-2">
          <select className="border rounded px-3 py-2" value={selectedCat} onChange={e=>setSelectedCat(e.target.value)}>
            <option value="">Select category</option>
            {list.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <form onSubmit={addSub} className="flex gap-2">
            <input className="border rounded px-3 py-2" placeholder="New subcategory" value={subName} onChange={e=>setSubName(e.target.value)} disabled={!selectedCat} />
            <button type="submit" className="border px-4 py-2 rounded" disabled={!selectedCat}>Add Sub</button>
          </form>
        </div>
        <div className="ml-auto">
          <input className="border rounded px-3 py-2" placeholder="Search..." value={filter} onChange={e=>setFilter(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {view.map(c => (
          <div key={c.name} className="border rounded p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">{c.name}</div>
              <button className="text-red-600" onClick={()=>removeCategory(c.name)}>Delete</button>
            </div>
            {(c.subs||[]).length === 0 && <div className="text-sm text-gray-500">No subcategories</div>}
            <ul className="list-none pl-0 space-y-1">
              {(c.subs||[]).map(s => (
                <li key={s} className="flex items-center justify-between">
                  <span>{s}</span>
                  <button className="text-red-600" onClick={()=>removeSub(c.name, s)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

