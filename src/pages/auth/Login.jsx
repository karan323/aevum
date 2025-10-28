import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUsers } from "../../lib/storage";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    const users = getUsers();
    const user = users.find((u) => (u.email || "").toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      setError("Invalid email or password");
      return;
    }
    localStorage.setItem("aevum_auth", "true");
    localStorage.setItem("aevum_user", JSON.stringify(user));
    try { window.dispatchEvent(new Event('aevum_auth_changed')); } catch {}
    navigate("/");
  }

  return (
    <div className="w-full flex justify-center py-10">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login to Aevum
        </h2>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email ID</label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black ${error ? 'border-red-500' : 'border-gray-300'}`}
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black ${error ? 'border-red-500' : 'border-gray-300'}`}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-all"
          >
            Login
          </button>
          {error && (<p className="text-sm text-red-600 mt-2">{error}</p>)}
        </form>

        <div className="text-right mt-3">
          <Link to="/forgot" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Streamline checkout and register today for free!
          </p>
          <p className="text-sm text-gray-600">
            Create an account and get a coupon
          </p>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-700">Don't have an account?</p>
          <Link
            to="/signup"
            className="inline-block mt-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
