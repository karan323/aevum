import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../lib/storage';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@aevum.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    const ok = adminLogin(email.trim(), password);
    if (ok) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-black text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}

