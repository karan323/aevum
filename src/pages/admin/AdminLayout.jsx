import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { adminLogout } from '../../lib/storage';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  function onLogout(){
    adminLogout();
    navigate('/admin/login');
  }
  const active = (path) => location.pathname.startsWith(path) ? 'text-aevumGold' : 'text-gray-700';
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={onLogout} className="border px-3 py-1 rounded">Logout</button>
      </div>
      <nav className="flex gap-6 mb-6">
        <Link to="/admin/products" className={`hover:underline ${active('/admin/products')}`}>Products</Link>
        <Link to="/admin/categories" className={`hover:underline ${active('/admin/categories')}`}>Categories</Link>
        <Link to="/admin/orders" className={`hover:underline ${active('/admin/orders')}`}>Orders</Link>
        <Link to="/admin/users" className={`hover:underline ${active('/admin/users')}`}>Users</Link>
      </nav>
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
