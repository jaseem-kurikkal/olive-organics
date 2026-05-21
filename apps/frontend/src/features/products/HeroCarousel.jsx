import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Droplets, Sparkles, Wind, Leaf, Flame, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../shared/context/CartContext';
import WaterDroplets from '../../shared/components/WaterDroplets';
import { api } from '../../shared/config/api';

const HeroCarousel = ({ onThemeChange }) => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch Dynamic Products from Database
  useEffect(() => {
    fetch(api.products)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products.length > 0) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products:", err);
        setLoading(false);
      });
  }, []);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [-300, 300], [12, -12]);
  const rotateY = useTransform(springX, [-300, 300], [-12, 12]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovering(false);
  }

  const getOffset = (index) => {
    let offset = index - currentIndex;
    const length = products.length;
    if (offset < -products.length / 2) offset += length;
    if (offset > products.length / 2) offset -= length;
    return offset;
  };

  const goTo = (idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(idx);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      if (!isHovering) {
        goTo((currentIndex + 1) % products.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, isHovering, products.length]);

  useEffect(() => {
    if (products.length > 0) {
      onThemeChange(products[currentIndex]?.themeColor || '#1a0a2e');
    }
  }, [currentIndex, onThemeChange, products]);

  if (loading || products.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Atelier...</div>;
  }

  const currentProduct = products[currentIndex];

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${currentProduct?.bgGradient?.split(' ')?.find(c => c.startsWith('from-'))?.replace('from-[', '')?.replace(']', '') || '#1a0a2e'} 0%, #050a05 100%)` }}
    >
      {/* Animated background gradient blob */}
      <motion.div
        key={`bg-${currentIndex}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full blur-[180px]"
          style={{
            background: `radial-gradient(circle, ${currentProduct.accentColor}22 0%, transparent 70%)`,
            animation: 'ambientGlow 4s ease-in-out infinite'
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{
            background: `radial-gradient(circle, ${currentProduct.dropColor}18 0%, transparent 70%)`,
            animation: 'ambientGlow 6s ease-in-out infinite reverse'
          }}
        />
        {/* Scan line effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)',
          }}
        />
      </motion.div>

      {/* Water Droplets */}
      <WaterDroplets color={currentProduct.dropColor} count={18} />

      {/* MAIN CONTENT */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-screen py-32">

        {/* LEFT: TEXT CONTENT */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(20px)' }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                className="flex items-center space-x-4"
              >
                <div
                  className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase"
                  style={{
                    background: `${currentProduct.accentColor}20`,
                    border: `1px solid ${currentProduct.accentColor}40`,
                    color: currentProduct.dropColor
                  }}
                >
                  {currentProduct.badge}
                </div>
                <div className="flex items-center space-x-2 text-white/40 text-xs font-medium tracking-widest uppercase">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: currentProduct.accentColor }}
                  />
                  <span>Available Now</span>
                </div>
              </motion.div>

              {/* Product Name */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-100%' }}
                  transition={{ delay: 0.2, duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
                  className="shimmer-text font-serif leading-[0.85] tracking-tight"
                  style={{
                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300
                  }}
                >
                  {currentProduct.name}
                </motion.h1>
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                className="text-white/50 uppercase tracking-[0.4em] text-[11px] font-medium"
              >
                — {currentProduct.tagline}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="text-white/65 leading-relaxed font-light max-w-md"
                style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)' }}
              >
                {currentProduct.description}
              </motion.p>

              {/* Ingredients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="flex flex-wrap gap-2"
              >
                {currentProduct.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-[10px] font-medium tracking-widest uppercase rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)'
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </motion.div>

              {/* Divider */}
              <div className="divider-luxury" />

              {/* CTA Row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="flex items-center space-x-6"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    addToCart({
                      productId: currentProduct.id,
                      name: currentProduct.name,
                      themeColor: currentProduct.themeColor,
                      quantity: 1,
                      unitPrice: currentProduct.basePrice,
                      ingredients: [],
                      size: '100g', // default size
                    });
                    navigate('/cart');
                  }}
                  className="group relative px-10 py-5 overflow-hidden rounded-full text-white font-semibold tracking-wide text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${currentProduct.accentColor}, ${currentProduct.buttonColor})`,
                    boxShadow: `0 20px 60px ${currentProduct.accentColor}40`
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
                  <span className="relative flex items-center space-x-3">
                    <span>Add to Cart — ${currentProduct.basePrice}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                </motion.button>

                <div className="flex flex-col">
                  <span className="text-white/30 text-[10px] uppercase tracking-widest">From</span>
                  <span className="text-white font-serif text-2xl font-light">${currentProduct.basePrice}</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: 3D SOAP CAROUSEL */}
        <div
          ref={containerRef}
          className="hidden lg:flex lg:col-span-7 justify-center items-center h-[700px] relative"
          onMouseMove={handleMouse}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHovering(true)}
          style={{ perspective: '2000px' }}
        >
          {products.map((product, idx) => {
            const offset = getOffset(idx);
            if (Math.abs(offset) > 3) return null;

            const isActive = offset === 0;
            const translateX = offset * 240;
            const translateZ = isActive ? 150 : -300 - Math.abs(offset) * 60;
            const rotateYBase = offset * -28;
            const scale = isActive ? 1.05 : 0.78 - Math.abs(offset) * 0.04;
            const opacity = isActive ? 1 : Math.max(0, 0.35 - Math.abs(offset) * 0.08);
            const zIndex = 30 - Math.abs(offset) * 10;
            const blur = isActive ? 0 : 10 + Math.abs(offset) * 3;

            return (
              <motion.div
                key={product.id}
                style={{
                  zIndex,
                  rotateX: isActive ? rotateX : 0,
                  rotateY: isActive ? rotateY : rotateYBase,
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  x: translateX,
                  z: translateZ,
                  scale,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="absolute w-80 aspect-[3/4] cursor-pointer"
                onClick={() => goTo(idx)}
              >
                {/* Ground shadow */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-10 blur-3xl rounded-full"
                    style={{ background: `${currentProduct.accentColor}40` }}
                  />
                )}

                {/* Card */}
                <div
                  className="relative w-full h-full rounded-3xl overflow-hidden"
                  style={{
                    background: isActive
                      ? `linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`
                      : 'rgba(255,255,255,0.03)',
                    border: isActive
                      ? `1px solid ${product.accentColor}30`
                      : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: isActive
                      ? `0 60px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 80px ${product.accentColor}20`
                      : 'none',
                  }}
                >
                  {/* Image Rendering: Standard Image OR 3D Sprite */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${isActive ? 1.08 : 1})`,
                          transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)',
                        }}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src="/soaps.jpg"
                          alt={product.name}
                          className="absolute w-[500%] h-[200%] max-w-none"
                          style={{
                            left: `-${product.spriteCol * 100}%`,
                            top: `-${product.spriteRow * 100}%`,
                            transform: `scale(${isActive ? 1.08 : 1})`,
                            transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)',
                            mixBlendMode: 'multiply',
                            filter: `contrast(1.15) saturate(${isActive ? 1.25 : 1.1}) brightness(${isActive ? 1.05 : 0.9})`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Liquid overlay on active card */}
                  {isActive && (
                    <>
                      <div
                        className="absolute top-4 right-4 w-24 h-24 rounded-full blur-2xl"
                        style={{
                          background: `radial-gradient(circle, ${product.accentColor}30, transparent)`,
                          animation: 'liquidPulse 4s ease-in-out infinite'
                        }}
                      />
                      {/* Glass reflection streak */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)',
                        }}
                      />
                      {/* Bottom info strip */}
                      <div
                        className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-xl"
                        style={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                        }}
                      >
                        <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-1">{product.tagline}</p>
                        <p className="text-white font-serif text-xl font-light">{product.name}</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PROGRESS NAV */}
      <div className="absolute bottom-10 left-0 right-0 z-50 flex justify-center items-center space-x-6 px-4">
        <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-medium">
          {String(currentIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
        </span>
        <div className="flex space-x-2">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className="relative overflow-hidden rounded-full transition-all duration-500"
              style={{
                width: idx === currentIndex ? '32px' : '6px',
                height: '6px',
                background: idx === currentIndex
                  ? currentProduct.accentColor
                  : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
        <button
          onClick={() => goTo((currentIndex + 1) % products.length)}
          className="text-white/20 hover:text-white/60 transition-colors text-[10px] uppercase tracking-[0.3em] font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
