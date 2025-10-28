import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, saveUsers } from "../../lib/storage";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    email2: "",
    password: "",
    referral: "",
    addr1: "",
    addr2: "",
    city: "",
    province: "",
    country: "",
    postal: "",
    newsletter: false,
    ads: false,
    policy: false,
    hvInput: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Simple unique human verification code
  const [hvCode, setHvCode] = useState("");
  useEffect(() => {
    regenerateHV();
  }, []);
  function regenerateHV() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
    setHvCode(s);
  }

  const passRules = useMemo(() => {
    const p = form.password || "";
    return {
      length: p.length >= 8,
      lower: /[a-z]/.test(p),
      upper: /[A-Z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
    };
  }, [form.password]);

  const passValid = useMemo(() => Object.values(passRules).every(Boolean), [passRules]);

  const onChange = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  function validate() {
    const err = {};
    const required = [
      ["firstName", "First Name is required"],
      ["lastName", "Last Name is required"],
      ["gender", "Gender is required"],
      ["phone", "Phone Number is required"],
      ["email", "Email is required"],
      ["email2", "Please re-enter your email"],
      ["password", "Password is required"],
      ["addr1", "Address Line 1 is required"],
      ["city", "City is required"],
      ["province", "Province is required"],
      ["country", "Country is required"],
      ["postal", "Postal Code is required"],
    ];
    for (const [k, msg] of required) {
      if (!String(form[k] || "").trim()) err[k] = msg;
    }
    if (form.email && form.email2 && form.email.trim() !== form.email2.trim()) {
      err.email2 = "Emails do not match";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Enter a valid email";
    }
    if (!passValid) {
      err.password = "Password does not meet requirements";
    }
    const users = getUsers();
    if (users.find((u) => (u.email || "").toLowerCase() === (form.email || "").toLowerCase())) {
      err.email = "An account with this email already exists";
    }
    if (form.hvInput.trim().toUpperCase() !== hvCode) {
      err.hvInput = "Human verification does not match";
    }
    if (!form.policy) {
      err.policy = "You must accept the Privacy Policy and Terms";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    const users = getUsers();
    const user = {
      id: Date.now(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      phone: form.phone.trim(),
      email: form.email.trim(),
      password: form.password, // stored in localStorage for demo only
      referral: form.referral.trim(),
      address: {
        addr1: form.addr1.trim(),
        addr2: form.addr2.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        country: form.country.trim(),
        postal: form.postal.trim(),
      },
      newsletter: form.newsletter,
      ads: form.ads,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, user]);
    localStorage.setItem("aevum_auth", "true");
    localStorage.setItem("aevum_user", JSON.stringify(user));
    try { window.dispatchEvent(new Event('aevum_auth_changed')); } catch {}
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Aevum Account
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit} noValidate>
          {/* First and Last Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              First Name*
            </label>
            <input
              type="text"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.firstName && submitted ? 'border-red-500' : 'border-gray-300'}`}
              value={form.firstName}
              onChange={onChange('firstName')}
              required
            />
            {submitted && errors.firstName && (<p className="text-sm text-red-600 mt-1">{errors.firstName}</p>)}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Last Name*
            </label>
            <input
              type="text"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.lastName && submitted ? 'border-red-500' : 'border-gray-300'}`}
              value={form.lastName}
              onChange={onChange('lastName')}
              required
            />
            {submitted && errors.lastName && (<p className="text-sm text-red-600 mt-1">{errors.lastName}</p>)}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Gender (M/F/O)*
            </label>
            <select className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.gender && submitted ? 'border-red-500' : 'border-gray-300'}`} value={form.gender} onChange={onChange('gender')} required>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {submitted && errors.gender && (<p className="text-sm text-red-600 mt-1">{errors.gender}</p>)}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.phone && submitted ? 'border-red-500' : 'border-gray-300'}`}
              value={form.phone}
              onChange={onChange('phone')}
              required
            />
            {submitted && errors.phone && (<p className="text-sm text-red-600 mt-1">{errors.phone}</p>)}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email*
            </label>
            <input
              type="email"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.email && submitted ? 'border-red-500' : 'border-gray-300'}`}
              value={form.email}
              onChange={onChange('email')}
              required
            />
            {submitted && errors.email && (<p className="text-sm text-red-600 mt-1">{errors.email}</p>)}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Re-enter Email*
            </label>
            <input
              type="email"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.email2 && submitted ? 'border-red-500' : 'border-gray-300'}`}
              value={form.email2}
              onChange={onChange('email2')}
              required
            />
            {submitted && errors.email2 && (<p className="text-sm text-red-600 mt-1">{errors.email2}</p>)}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password*
            </label>
            <input
              type="password"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.password && submitted ? 'border-red-500' : 'border-gray-300'}`}
              value={form.password}
              onChange={onChange('password')}
              required
            />
            {/* Password requirements */}
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
            {submitted && errors.password && (<p className="text-sm text-red-600 mt-1">{errors.password}</p>)}
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Referral Code
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black"
              value={form.referral}
              onChange={onChange('referral')}
            />
          </div>

          {/* Address Section */}
          <div className="md:col-span-2 mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Home Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Address Line 1*"
                className={`border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.addr1 && submitted ? 'border-red-500' : 'border-gray-300'}`}
                value={form.addr1}
                onChange={onChange('addr1')}
                required
              />
              <input
                type="text"
                placeholder="Address Line 2"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black"
                value={form.addr2}
                onChange={onChange('addr2')}
              />
              <input
                type="text"
                placeholder="City*"
                className={`border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.city && submitted ? 'border-red-500' : 'border-gray-300'}`}
                value={form.city}
                onChange={onChange('city')}
                required
              />
              <input
                type="text"
                placeholder="Province*"
                className={`border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.province && submitted ? 'border-red-500' : 'border-gray-300'}`}
                value={form.province}
                onChange={onChange('province')}
                required
              />
              <input
                type="text"
                placeholder="Country*"
                className={`border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.country && submitted ? 'border-red-500' : 'border-gray-300'}`}
                value={form.country}
                onChange={onChange('country')}
                required
              />
              <input
                type="text"
                placeholder="Postal Code*"
                className={`border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.postal && submitted ? 'border-red-500' : 'border-gray-300'}`}
                value={form.postal}
                onChange={onChange('postal')}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {submitted && errors.addr1 && (<p className="text-sm text-red-600">{errors.addr1}</p>)}
              <div></div>
              {submitted && errors.city && (<p className="text-sm text-red-600">{errors.city}</p>)}
              {submitted && errors.province && (<p className="text-sm text-red-600">{errors.province}</p>)}
              {submitted && errors.country && (<p className="text-sm text-red-600">{errors.country}</p>)}
              {submitted && errors.postal && (<p className="text-sm text-red-600">{errors.postal}</p>)}
            </div>
          </div>

          {/* Checkbox options */}
          <div className="md:col-span-2 mt-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" checked={form.newsletter} onChange={onChange('newsletter')} />
              <span>Subscribe to our Newsletter</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" className="w-4 h-4" checked={form.ads} onChange={onChange('ads')} />
              <span>Receive Personalized Advertisements</span>
            </label>
            <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" required className={`w-4 h-4 ${errors.policy && submitted ? 'ring-2 ring-red-500' : ''}`} checked={form.policy} onChange={onChange('policy')} />
              <span>
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </a>
              </span>
            </label>
            {submitted && errors.policy && (<p className="text-sm text-red-600 mt-1">{errors.policy}</p>)}
          </div>

          {/* Human Verification */}
          <div className="md:col-span-2 mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Human Verification</h3>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded bg-gray-900 text-white tracking-[0.25em] select-none font-mono text-lg">
                {hvCode}
              </div>
              <button type="button" onClick={regenerateHV} className="text-sm text-blue-600 hover:underline">Refresh</button>
            </div>
            <label className="block text-gray-700 font-semibold mt-3 mb-1">Type the code shown*</label>
            <input
              type="text"
              value={form.hvInput}
              onChange={onChange('hvInput')}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black ${errors.hvInput && submitted ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter the 5-character code"
              required
            />
            {submitted && errors.hvInput && (<p className="text-sm text-red-600 mt-1">{errors.hvInput}</p>)}
            <p className="text-xs text-gray-500 mt-1">This step helps keep signups human and unique to your session.</p>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-all"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          All personal information is secure with encryption technology.
        </p>
      </div>
    </div>
  );
};

export default Signup;
