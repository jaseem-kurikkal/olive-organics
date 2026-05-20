import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import HeroCarousel from './features/products/HeroCarousel';
import CustomizationEngine from './features/customization/CustomizationEngine';
import CartPage from './features/cart/CartPage';
import RitualPage from './features/ritual/RitualPage';
import AuthPage from './features/auth/AuthPage';
import ErrorBoundary from './shared/components/ErrorBoundary';
import { WhyUsSection, TestimonialsSection, HomeCTA, NewsletterSection, SiteFooter } from './features/home/HomeSections';
import { CartProvider, useCart } from './shared/context/CartContext';
import siteContent from './content.json';

const NavLink = ({ to, children, onClick }) => (
  <Link to={to} onClick={onClick} className="relative group text-white/50 hover:text-white transition-colors duration-500">
    <span className="text-[11px] font-medium uppercase tracking-[0.25em]">{children}</span>
    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
  </Link>
);

function AppContent() {
  const [themeColor, setThemeColor] = useState('#1a0a2e');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

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
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Routes */}
      <AnimatePresence mode="wait">
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
          <Route path="/build" element={
            <div className="min-h-screen" style={{ background: '#050a05' }}>
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
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
