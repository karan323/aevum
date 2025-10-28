import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Heart, ShoppingCart, Search, Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [menOpen, setMenOpen] = useState(false);
  const [menMobileOpen, setMenMobileOpen] = useState(false);
  const [menPinned, setMenPinned] = useState(false);
  const headerRef = useRef(null);
  const menRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [userInitial, setUserInitial] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const mainMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const setHeaderVar = () => {
      const h = headerRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setHeaderVar();
    window.addEventListener("resize", setHeaderVar);
    return () => window.removeEventListener("resize", setHeaderVar);
  }, []);

  const handleFavorite = () => {
    const isLoggedIn = localStorage.getItem("aevum_auth") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/wishlist");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    setShowSearch(false);
    if (q && String(q).trim()) {
      navigate(`/shop?q=${encodeURIComponent(String(q).trim())}`);
    } else {
      navigate("/shop");
    }
  };

  // Close search with Escape and lock background scroll while open
  useEffect(() => {
    if (!showSearch) return;
    const onKey = (ev) => {
      if (ev.key === "Escape") setShowSearch(false);
    };
    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [showSearch]);

  // Close search when clicking anywhere outside the search container
  useEffect(() => {
    if (!showSearch) return;
    const onDown = (ev) => {
      const el = searchContainerRef.current;
      if (el && !el.contains(ev.target)) {
        setShowSearch(false);
      }
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [showSearch]);

  // Close Men menu when clicking outside or pressing Escape
  useEffect(() => {
    const onDown = (ev) => {
      const el = menRef.current;
      if (!el) return;
      if (!el.contains(ev.target)) {
        setMenOpen(false);
        setMenPinned(false);
      }
    };
    const onKey = (ev) => {
      if (ev.key === 'Escape') {
        setMenOpen(false);
        setMenPinned(false);
      }
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Cart badge: read from localStorage and update on change
  useEffect(() => {
    const read = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('aevum_cart') || '[]');
        const count = Array.isArray(cart) ? cart.reduce((s, i) => s + (Number(i.qty) || 0), 0) : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    read();
    const onStorage = (e) => { if (e.key === 'aevum_cart') read(); };
    const onCustom = () => read();
    window.addEventListener('storage', onStorage);
    window.addEventListener('aevum_cart_changed', onCustom);
    document.addEventListener('visibilitychange', read);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('aevum_cart_changed', onCustom);
      document.removeEventListener('visibilitychange', read);
    };
  }, []);

  // Auth indicator: read user initial from localStorage and update on change
  useEffect(() => {
    const readAuth = () => {
      try {
        const authed = localStorage.getItem('aevum_auth') === 'true';
        if (!authed) { setUserInitial(null); return; }
        const user = JSON.parse(localStorage.getItem('aevum_user') || 'null');
        const email = (user?.email || '').trim();
        const initial = email ? email[0].toUpperCase() : (user?.firstName?.[0]?.toUpperCase() || null);
        setUserInitial(initial);
      } catch { setUserInitial(null); }
    };
    readAuth();
    const onStorage = () => readAuth();
    const onCustom = () => readAuth();
    window.addEventListener('storage', onStorage);
    window.addEventListener('aevum_auth_changed', onCustom);
    document.addEventListener('visibilitychange', readAuth);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('aevum_auth_changed', onCustom);
      document.removeEventListener('visibilitychange', readAuth);
    };
  }, []);

  // Close user menu on outside click or Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (ev) => {
      const el = userMenuRef.current;
      if (el && !el.contains(ev.target)) setUserMenuOpen(false);
    };
    const onKey = (ev) => { if (ev.key === 'Escape') setUserMenuOpen(false); };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  // Close desktop main menu on outside click or Escape
  useEffect(() => {
    if (!mainMenuOpen) return;
    const onDown = (ev) => {
      const el = mainMenuRef.current;
      if (el && !el.contains(ev.target)) setMainMenuOpen(false);
    };
    const onKey = (ev) => { if (ev.key === 'Escape') setMainMenuOpen(false); };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [mainMenuOpen]);

  // (no main menu dropdown)

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/40 via-white/20 to-transparent backdrop-blur-[2px]"
    >
      <div className="w-full px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/aevum_logo.png"
            alt="Aevum"
            className="w-20 h-20 object-contain"
          />
          <div>
            <div className="text-xl font-bold text-black">AEVUM</div>
            <div className="text-sm text-black">Timeless apparel</div>
          </div>
        </Link>

        {/* Center navigation (desktop) */}

        {/* Navigation Links */}
        <nav className="hidden md:flex flex-1 justify-center gap-10 items-center text-base md:text-xl lg:text-2xl font-semibold subpixel-antialiased tracking-tight text-aevumNavy relative">
          <Link to="/" className="hover:text-aevumGold transition-colors duration-200">Home</Link>

          <div
            className="relative"
            ref={menRef}
            onMouseEnter={() => setMenOpen(true)}
            onMouseLeave={() => { if (!menPinned) setMenOpen(false); }}
          >
            <button
              type="button"
              className={`relative transition-colors duration-200 hover:text-aevumGold ${menOpen ? 'text-aevumGold' : ''}`}
              aria-haspopup="true"
              aria-expanded={menOpen ? 'true' : 'false'}
              onClick={() => { setMenPinned((p) => !p); setMenOpen(true); }}
            >
              Men
              </button>

            {menOpen && (
              <div
                className="fixed inset-x-0 top-[calc(var(--header-h)+0.5rem)] z-[60] px-4"
                role="menu"
                onMouseEnter={() => setMenOpen(true)}
                onMouseLeave={() => { if (!menPinned) setMenOpen(false); }}
              >
                <div className="mx-auto w-[min(95vw,64rem)] rounded-2xl shadow-2xl border border-gray-200 bg-white p-6 md:p-8 text-aevumNavy">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    <div>
                      <div className="text-xl md:text-2xl font-semibold mb-3">Casual T-Shirts</div>
                      <ul className="list-none pl-0 space-y-1.5 text-lg">
                        {['Crew Neck','V-Neck','Henley','Polo','Oversized','Graphics'].map((label) => (
                          <li key={label}>
                            <button
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors"
                              onClick={() => {
                                setMenOpen(false);
                                setMenPinned(false);
                                navigate(`/men?cat=Casual%20T-Shirts&sub=${encodeURIComponent(label)}`);
                              }}
                            >
                              <span>{label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xl md:text-2xl font-semibold mb-3">Shirts</div>
                      <ul className="list-none pl-0 space-y-1.5 text-lg">
                        {['Casual','Linen','Flannel'].map((label) => (
                          <li key={label}>
                            <button
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors"
                              onClick={() => {
                                setMenOpen(false);
                                setMenPinned(false);
                                navigate(`/men?cat=Shirts&sub=${encodeURIComponent(label)}`);
                              }}
                            >
                              <span>{label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xl md:text-2xl font-semibold mb-3">Tanks</div>
                      <button
                        className="text-left hover:text-aevumGold transition-colors text-lg px-2 py-1.5 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          setMenOpen(false);
                          setMenPinned(false);
                          navigate(`/men?cat=Tanks`);
                        }}
                      >
                        View All
                      </button>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-semibold mb-3">Hoodies</div>
                      <ul className="list-none pl-0 space-y-1.5 text-lg">
                        {['Pull Over','Zip-Up','Oversized'].map((label) => (
                          <li key={label}>
                            <button
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors"
                              onClick={() => {
                                setMenOpen(false);
                                setMenPinned(false);
                                navigate(`/men?cat=Hoodies&sub=${encodeURIComponent(label)}`);
                              }}
                            >
                              <span>{label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-semibold mb-3">Sweatshirts</div>
                      <ul className="list-none pl-0 space-y-1.5 text-lg">
                        {['Crewneck','V-Neck','Cardigan','Mock Neck','Turtleneck'].map((label) => (
                          <li key={label}>
                            <button
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors"
                              onClick={() => {
                                setMenOpen(false);
                                setMenPinned(false);
                                navigate(`/men?cat=Sweatshirts&sub=${encodeURIComponent(label)}`);
                              }}
                            >
                              <span>{label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-semibold mb-3">Activewear T-Shirts</div>
                      <button
                        className="text-left hover:text-aevumGold transition-colors text-lg px-2 py-1.5 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          setMenOpen(false);
                          setMenPinned(false);
                          navigate(`/men?cat=Activewear%20T-Shirts`);
                        }}
                      >
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/women" className="hover:text-aevumGold transition-colors duration-200">Women</Link>
        </nav>

        {/* Actions: search, favorite, cart, login, menu */}
        <div className="flex items-center gap-2 md:gap-3 relative shrink-0">
          {/* Search toggle */}
          <button
            className="icon-glow p-2 rounded-md transition-transform duration-200 hover:scale-110 hover:text-aevumGold"
            aria-label="Search"
            onClick={() => setShowSearch((v) => !v)}
          >
            <Search className="w-6 h-6 text-aevumNavy" />
          </button>

          {/* Favorite (outline heart) */}
          <button
            className="icon-glow p-2 rounded-md transition-transform duration-200 hover:scale-110 hover:text-aevumGold"
            aria-label="Favorites"
            onClick={handleFavorite}
          >
            <Heart className="w-6 h-6 text-aevumNavy" />
          </button>

          {/* Cart */}
          <Link to="/checkout" className="icon-glow relative inline-block p-2 rounded-md transition-transform duration-200 hover:scale-110" aria-label="Cart">
            <ShoppingCart className="w-6 h-6 text-aevumNavy" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-aevumGold text-white text-[10px] leading-[1.1rem] text-center font-semibold">
                {Math.min(cartCount, 99)}
              </span>
            )}
          </Link>

          {/* Login or user indicator */}
          {userInitial ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                className="icon-glow p-2 rounded-md"
                aria-haspopup="true"
                aria-expanded={userMenuOpen ? 'true' : 'false'}
                onClick={() => setUserMenuOpen((v) => !v)}
              >
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                  {userInitial}
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 z-[70]">
                  <div className="rounded-2xl shadow-2xl border border-gray-200 bg-white p-2 text-aevumNavy text-base md:text-lg">
                    <button
                      className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors font-semibold"
                      onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors font-semibold"
                      onClick={() => { setUserMenuOpen(false); navigate('/wishlist'); }}
                    >
                      Wishlist
                    </button>
                    <button
                      className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors font-semibold"
                      onClick={() => { setUserMenuOpen(false); navigate('/checkout'); }}
                    >
                      Checkout
                    </button>
                    <div className="my-1 border-t" />
                    <button
                      className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors font-semibold"
                      onClick={() => {
                        setUserMenuOpen(false);
                        localStorage.removeItem('aevum_auth');
                        localStorage.removeItem('aevum_user');
                        try { window.dispatchEvent(new Event('aevum_auth_changed')); } catch {}
                        navigate('/');
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon-glow p-2 rounded-md transition-transform duration-200 hover:scale-110" aria-label="Login">
              <LogIn className="w-6 h-6 text-aevumNavy" />
            </Link>
          )}


          {/* Desktop: small dropdown menu styled like other menus */}
          <div className="relative hidden md:block" ref={mainMenuRef}>
            <button
              type="button"
              className="icon-glow p-2 rounded-md transition-transform duration-200 hover:scale-110 hover:text-aevumGold"
              aria-label="Menu"
              aria-haspopup="true"
              aria-expanded={mainMenuOpen ? 'true' : 'false'}
              onClick={() => setMainMenuOpen(v => !v)}
            >
              <Menu className="w-6 h-6 text-aevumNavy" />
            </button>
            {mainMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 z-[70]">
                <div className="rounded-2xl shadow-2xl border border-gray-200 bg-white p-2 text-aevumNavy text-base md:text-lg">
                  <button
                    className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors font-semibold"
                    onClick={() => { setMainMenuOpen(false); navigate('/'); }}
                  >
                    Home
                  </button>
                  <button
                    className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors font-semibold"
                    onClick={() => { setMainMenuOpen(false); navigate('/men'); }}
                  >
                    Men
                  </button>
                  <button
                    className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors font-semibold"
                    onClick={() => { setMainMenuOpen(false); navigate('/women'); }}
                  >
                    Women
                  </button>
                  <button
                    className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 hover:text-aevumGold transition-colors font-semibold"
                    onClick={() => { setMainMenuOpen(false); navigate('/shop'); }}
                  >
                    Shop
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile: keep existing full dropdown */}
          <button
            className="icon-glow p-2 rounded-md transition-transform duration-200 hover:scale-110 hover:text-aevumGold md:hidden"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <Menu className="w-6 h-6 text-aevumNavy" />
          </button>
        </div>
      </div>
      {/* Header now has a subtle white-to-transparent fade background for a soft blend over content */}

      {/* Search full-screen menu (outside faded row so it stays full opacity) */}
      {showSearch && (
        <div
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[60] bg-black/40 backdrop-blur-sm"
        >
          <div
            ref={searchContainerRef}
            className="mx-auto w-full max-w-2xl px-4 pt-[calc(var(--header-h)+2rem)]"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center rounded-2xl glass-card focus-within:ring-2 focus-within:ring-aevumNavy/30"
            >
              <Search className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                autoFocus
                type="text"
                name="q"
                placeholder="Search products, categories, or collections"
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-transparent focus:outline-none focus:ring-0 text-aevumNavy font-semibold tracking-tight subpixel-antialiased placeholder:text-gray-600"
              />
              <button
                type="button"
                aria-label="Close search"
                className="absolute right-2 p-2 rounded-md hover:bg-white/30"
                onClick={() => setShowSearch(false)}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </form>

            {/* Optional: quick filters */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['T-Shirts','Hoodies','Women','Men','New Arrivals','Sale'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setShowSearch(false);
                    navigate(`/shop?q=${encodeURIComponent(tag)}`);
                  }}
                  className="glass-pill px-3 py-1 text-sm text-aevumNavy font-semibold tracking-tight subpixel-antialiased"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile dropdown menu */}
      {open && (
        <div className="bg-white py-3 flex flex-col items-center space-y-3 text-aevumNavy font-medium">
          <Link to="/" onClick={() => setOpen(false)} className="hover:text-aevumGold">
            Home
          </Link>
          {/* Mobile Men expandable */}
          <div className="w-full px-6">
            <button
              className="w-full flex justify-between items-center py-2 hover:text-aevumGold"
              onClick={() => setMenMobileOpen((v) => !v)}
              aria-expanded={menMobileOpen ? 'true' : 'false'}
            >
              <span>Men</span>
              <span className="text-sm text-gray-500">{menMobileOpen ? '-' : '+'}</span>
            </button>
            {menMobileOpen && (
              <div className="pl-3 pb-2 text-base space-y-2">
                <button onClick={() => { setMenMobileOpen(false); setOpen(false); navigate('/men'); }} className="block text-left hover:text-aevumGold">All Men</button>
                <div>
                  <div className="font-semibold mt-2">Casual T-Shirts</div>
                  {['Crew Neck','V-Neck','Henley','Polo','Oversized','Graphics'].map((s) => (
                    <button key={s} onClick={() => { setMenMobileOpen(false); setOpen(false); navigate(`/men?cat=Casual%20T-Shirts&sub=${encodeURIComponent(s)}`) }} className="block text-left text-sm text-gray-700 hover:text-aevumGold">{s}</button>
                  ))}
                </div>
                <div>
                  <div className="font-semibold mt-2">Shirts</div>
                  {['Casual','Linen','Flannel'].map((s) => (
                    <button key={s} onClick={() => { setMenMobileOpen(false); setOpen(false); navigate(`/men?cat=Shirts&sub=${encodeURIComponent(s)}`) }} className="block text-left text-sm text-gray-700 hover:text-aevumGold">{s}</button>
                  ))}
                </div>
                <div>
                  <div className="font-semibold mt-2">Tanks</div>
                  <button onClick={() => { setMenMobileOpen(false); setOpen(false); navigate('/men?cat=Tanks') }} className="block text-left text-sm text-gray-700 hover:text-aevumGold">View All</button>
                </div>
                <div>
                  <div className="font-semibold mt-2">Hoodies</div>
                  {['Pull Over','Zip-Up','Oversized'].map((s) => (
                    <button key={s} onClick={() => { setMenMobileOpen(false); setOpen(false); navigate(`/men?cat=Hoodies&sub=${encodeURIComponent(s)}`) }} className="block text-left text-sm text-gray-700 hover:text-aevumGold">{s}</button>
                  ))}
                </div>
                <div>
                  <div className="font-semibold mt-2">Sweatshirts</div>
                  {['Crewneck','V-Neck','Cardigan','Mock Neck','Turtleneck'].map((s) => (
                    <button key={s} onClick={() => { setMenMobileOpen(false); setOpen(false); navigate(`/men?cat=Sweatshirts&sub=${encodeURIComponent(s)}`) }} className="block text-left text-sm text-gray-700 hover:text-aevumGold">{s}</button>
                  ))}
                </div>
                <div>
                  <div className="font-semibold mt-2">Activewear T-Shirts</div>
                  <button onClick={() => { setMenMobileOpen(false); setOpen(false); navigate('/men?cat=Activewear%20T-Shirts') }} className="block text-left text-sm text-gray-700 hover:text-aevumGold">View All</button>
                </div>
              </div>
            )}
          </div>
          <Link to="/women" onClick={() => setOpen(false)} className="hover:text-aevumGold">
            Women
          </Link>
          <Link to="/login" onClick={() => setOpen(false)} className="hover:text-aevumGold flex items-center gap-2">
            <LogIn className="w-5 h-5" /> Login
          </Link>
        </div>
      )}
    </header>
  );
}
