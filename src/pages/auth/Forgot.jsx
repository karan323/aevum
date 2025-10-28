import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, saveUsers } from "../../lib/storage";

export default function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passRules = useMemo(() => {
    const p = password || "";
    return {
      length: p.length >= 8,
      lower: /[a-z]/.test(p),
      upper: /[A-Z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
    };
  }, [password]);
  const passValid = useMemo(() => Object.values(passRules).every(Boolean), [passRules]);

  function onSubmit(e){
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (!passValid) {
      setError("Password does not meet requirements");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    const users = getUsers();
    const idx = users.findIndex(u => (u.email||"").toLowerCase() === email.trim().toLowerCase());
    if (idx === -1) {
      setError("No account found with that email");
      return;
    }
    users[idx] = { ...users[idx], password };
    saveUsers(users);
    // If current session is this user, clear it to force re-login
    try {
      const current = JSON.parse(localStorage.getItem('aevum_user') || 'null');
      if (current && (current.email||"").toLowerCase() === email.trim().toLowerCase()) {
        localStorage.removeItem('aevum_auth');
        localStorage.removeItem('aevum_user');
        try { window.dispatchEvent(new Event('aevum_auth_changed')); } catch {}
      }
    } catch {}
    setSuccess("Password updated. You can now log in.");
    setTimeout(() => navigate('/login'), 900);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your account email"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black ${error && !success ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black ${error && !success ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            <div className="mt-2 text-sm">
              <p className="text-gray-700 font-medium">Password must include:</p>
              <ul className="mt-1 space-y-1">
                <li className={`${passRules.length ? 'text-green-700' : 'text-gray-600'}`}>• At least 8 characters</li>
                <li className={`${passRules.upper ? 'text-green-700' : 'text-gray-600'}`}>• An uppercase letter (A-Z)</li>
                <li className={`${passRules.lower ? 'text-green-700' : 'text-gray-600'}`}>• A lowercase letter (a-z)</li>
                <li className={`${passRules.number ? 'text-green-700' : 'text-gray-600'}`}>• A number (0-9)</li>
                <li className={`${passRules.special ? 'text-green-700' : 'text-gray-600'}`}>• A special character (!@#$%^&*, etc.)</li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black ${error && !success ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
          </div>

          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-all">
            Update Password
          </button>
          {error && !success && (<p className="text-sm text-red-600">{error}</p>)}
          {success && (<p className="text-sm text-green-700">{success}</p>)}
        </form>
      </div>
    </div>
  );
}

