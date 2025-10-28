// Simple localStorage-backed storage utilities for demo admin, products, and orders

// Default admin credentials (can be overridden via localStorage)
const DEFAULT_ADMIN = { email: 'admin@aevum.local', password: 'admin123' };

export function getAdminCreds() {
  try {
    const raw = localStorage.getItem('aevum_admin_creds');
    if (!raw) return DEFAULT_ADMIN;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ADMIN, ...parsed };
  } catch {
    return DEFAULT_ADMIN;
  }
}

export function setAdminCreds(creds) {
  localStorage.setItem('aevum_admin_creds', JSON.stringify(creds));
}

export function adminIsAuthed() {
  return localStorage.getItem('aevum_admin') === 'true';
}

export function adminLogin(email, password) {
  const creds = getAdminCreds();
  const ok = creds.email === email && creds.password === password;
  if (ok) localStorage.setItem('aevum_admin', 'true');
  return ok;
}

export function adminLogout() {
  localStorage.removeItem('aevum_admin');
}

// Products
import defaultProducts from '../data/products';

export function getProducts() {
  try {
    const raw = localStorage.getItem('aevum_products');
    if (!raw) return defaultProducts;
    const parsed = JSON.parse(raw);
    // Ensure array and id present
    if (Array.isArray(parsed)) {
      // Normalize historical paths typo: *_product.png -> *_produt.png
      return parsed.map(p => {
        if (p && typeof p.img === 'string' && p.img.includes('_product.png')) {
          return { ...p, img: p.img.replace('_product.png', '_produt.png') };
        }
        // Ensure quantity field exists
        if (p && typeof p.qty !== 'number') {
          return { ...p, qty: 0 };
        }
        return p;
      });
    }
    return defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export function saveProducts(list) {
  localStorage.setItem('aevum_products', JSON.stringify(list));
}

// Orders
export function getOrders() {
  try {
    const raw = localStorage.getItem('aevum_orders') || '[]';
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrders(list) {
  localStorage.setItem('aevum_orders', JSON.stringify(list));
}

// Categories (for admin-managed canonical categories and subcategories)
const DEFAULT_CATEGORIES = [
  { name: 'Casual T-Shirts', subs: ['Crew Neck','V-Neck','Henley','Polo','Oversized','Graphics'] },
  { name: 'Shirts', subs: ['Casual','Linen','Flannel'] },
  { name: 'Tanks', subs: [] },
  { name: 'Hoodies', subs: ['Pull Over','Zip-Up','Oversized'] },
  { name: 'Sweatshirts', subs: ['Crewneck','V-Neck','Cardigan','Mock Neck','Turtleneck'] },
  { name: 'Activewear T-Shirts', subs: [] },
];

export function getCategories() {
  try {
    const raw = localStorage.getItem('aevum_categories');
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(list) {
  localStorage.setItem('aevum_categories', JSON.stringify(list));
}

// Users (simple localStorage-backed accounts for demo purposes)
export function getUsers() {
  try {
    const raw = localStorage.getItem('aevum_users') || '[]';
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUsers(list) {
  localStorage.setItem('aevum_users', JSON.stringify(list));
}
