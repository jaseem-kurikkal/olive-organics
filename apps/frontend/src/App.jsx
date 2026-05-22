import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Package, ChevronDown, Loader } from 'lucide-react';
const HeroCarousel = React.lazy(() => import('./features/products/HeroCarousel'));
const CustomizationEngine = React.lazy(() => import('./features/customization/CustomizationEngine'));
const CartPage = React.lazy(() => import('./features/cart/CartPage'));
const RitualPage = React.lazy(() => import('./features/ritual/RitualPage'));
const AuthPage = React.lazy(() => import('./features/auth/AuthPage'));
const AdminDashboard = React.lazy(() => import('./features/admin/AdminDashboard'));
const MyOrdersPage = React.lazy(() => import('./features/orders/MyOrdersPage'));
const ProductsPage = React.lazy(() => import('./features/products/ProductsPage'));
import ErrorBoundary from './shared/components/ErrorBoundary';
import { WhyUsSection, TestimonialsSection, HomeCTA, NewsletterSection, SiteFooter } from './features/home/HomeSections';
import { CartProvider, useCart } from './shared/context/CartContext';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import siteContent from './content.json';

const NavLink = ({ to, children, onClick }) => (
  <Link to={to} onClick={onClick} className="relative group text-white/50 hover:text-white transition-colors duration-500">
    <span className="text-[11px] font-medium uppercase tracking-[0.25em]">{children}</span>
    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
  </Link>
);

// ─── User Avatar Dropdown ─────────────────────────────────────────────────────
function UserMenu({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  const handleLogout = () => {
    logout();
    setOpen(false);
    onClose?.();
    navigate('/');
  };

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium tracking-wide relative"
          style={{
            background: 'linear-gradient(135deg, #496337, #749c56)',
            boxShadow: '0 0 20px rgba(73,99,55,0.4)',
          }}
        >
          {initials || user?.firstName?.[0]?.toUpperCase()}
        </div>
        <ChevronDown className={`w-3 h-3 text-white/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="absolute right-0 top-12 w-52 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(10,15,10,0.97)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            }}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/05">
              <p className="text-white text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-white/30 text-xs truncate">{user?.email}</p>
            </div>
            {/* Menu items */}
            <div className="p-2">
              <Link to="/my-orders" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/05 transition-all text-sm">
                <Package className="w-4 h-4" />
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/05 transition-all text-sm">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AppContent() {
  const [themeColor, setThemeColor] = useState('#1a0a2e');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { isLoggedIn } = useAuth();

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Floating Glass Navigation */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
          className="flex justify-between items-center px-8 py-4 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Logo */}
          <Link to="/" onClick={closeMobile} className="flex items-center space-x-3 group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-serif font-medium text-white text-sm shadow-lg group-hover:scale-110 transition-transform duration-500"
              style={{
                background: 'linear-gradient(135deg, #496337, #749c56)',
                boxShadow: '0 0 20px rgba(73,99,55,0.5)'
              }}
            >
              O
            </div>
            <div className="font-serif text-2xl tracking-widest text-white mix-blend-difference pointer-events-auto cursor-pointer" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {siteContent.navigation.brandName}
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-12">
            {siteContent.navigation.links.map((link, idx) => (
              <NavLink key={idx} to={link.url}>{link.label}</NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link to="/cart" onClick={closeMobile}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white px-7 py-3 rounded-full transition-all duration-300 cursor-pointer relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(73,99,55,0.6), rgba(116,156,86,0.3))',
                  border: '1px solid rgba(116,156,86,0.3)',
                  boxShadow: '0 4px 20px rgba(73,99,55,0.2)'
                }}
              >
                Cart [{cartCount}]
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-pulse"
                    style={{ background: 'linear-gradient(135deg, #496337, #749c56)' }}
                  >
                    {cartCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Auth: Avatar or Sign In */}
            {isLoggedIn ? (
              <UserMenu onClose={closeMobile} />
            ) : (
              <Link to="/auth" onClick={closeMobile}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 hover:text-white px-5 py-3 rounded-full transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Sign In
                </motion.div>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-white/50 hover:text-white transition-colors p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="mt-3 mx-4 p-6 rounded-3xl md:hidden"
              style={{
                background: 'rgba(10,15,10,0.95)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              <nav className="flex flex-col space-y-5">
                {siteContent.navigation.links.map((link, idx) => (
                  <NavLink key={idx} to={link.url} onClick={closeMobile}>{link.label}</NavLink>
                ))}
                {isLoggedIn && (
                  <NavLink to="/my-orders" onClick={closeMobile}>My Orders</NavLink>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Routes */}
      <AnimatePresence mode="wait">
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#050a05' }}><Loader className="w-8 h-8 text-[#749c56] animate-spin" /></div>}>
          <Routes>
            <Route path="/" element={
              <div style={{ background: '#050a05' }}>
                <HeroCarousel onThemeChange={setThemeColor} />
                <WhyUsSection />
                <TestimonialsSection />
                <HomeCTA />
                <NewsletterSection />
                <SiteFooter />
              </div>
            } />
            <Route path="/shop" element={
              <>
                <ProductsPage />
                <div style={{ background: '#050a05' }}><SiteFooter /></div>
              </>
            } />
            <Route path="/build" element={
              <div className="min-h-screen" style={{ background: '#121a12' }}>
                <div className="pt-32 pb-20 px-4 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <p className="text-white/30 text-[11px] uppercase tracking-[0.4em] mb-6">Custom Formulation</p>
                    <h2
                      className="shimmer-text mb-8 leading-[0.9] tracking-tight font-light"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(4rem, 10vw, 8rem)',
                      }}
                    >
                      The Atelier
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed text-lg">
                      Sculpt your personalized botanical formulation. Masterfully blended in our laboratory for your exact dermatological profile.
                    </p>
                  </motion.div>
                </div>
                <CustomizationEngine />
                <SiteFooter />
              </div>
            } />
            <Route path="/cart" element={
              <>
                <CartPage />
                <div style={{ background: '#050a05' }}><SiteFooter /></div>
              </>
            } />
            <Route path="/ritual" element={
              <>
                <RitualPage />
                <div style={{ background: '#050a05' }}><SiteFooter /></div>
              </>
            } />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: '#050a05' }}>
                <h1 className="text-white text-6xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>404</h1>
                <p className="text-white/40 mb-8">The page you are looking for does not exist.</p>
                <Link to="/" className="px-6 py-3 rounded-full text-white text-xs uppercase tracking-widest" style={{ background: 'linear-gradient(135deg, #496337, #749c56)' }}>
                  Return Home
                </Link>
              </div>
            } />
          </Routes>
        </React.Suspense>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
