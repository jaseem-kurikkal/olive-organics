import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../shared/context/CartContext';
import WaterDroplets from '../../shared/components/WaterDroplets';
import { api } from '../../shared/config/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(api.products)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a05]">
        <div className="text-white/50 text-sm tracking-widest uppercase animate-pulse">Loading Collections...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#050a05' }}>
      <WaterDroplets color="#749c56" count={15} />

      <div className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-16"
        >
          <p className="text-white/30 text-[11px] uppercase tracking-[0.4em] mb-4">Our Collections</p>
          <h1
            className="shimmer-text font-light tracking-tight leading-none mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}
          >
            Curated Classics
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Discover our masterfully blended standard formulations. Crafted in small batches using only the finest organic ingredients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="p-8 rounded-[2.5rem] relative overflow-hidden group flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Background Glow */}
              <div
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 transition-opacity duration-700 group-hover:opacity-40"
                style={{ background: product.themeColor }}
              />

              {/* Product Visual */}
              <div
                className="w-full h-48 rounded-[2rem] mb-8 flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${product.themeColor}15, rgba(0,0,0,0.5))`,
                  border: `1px solid ${product.themeColor}30`,
                }}
              >
                <div
                  className="w-20 h-14 rounded-xl relative transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${product.themeColor}aa, ${product.themeColor}55)`,
                    boxShadow: `0 10px 30px ${product.themeColor}40`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-xl" />
                </div>
                {product.badge && (
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase"
                    style={{
                      background: `${product.accentColor}20`,
                      color: product.dropColor,
                      border: `1px solid ${product.accentColor}40`
                    }}
                  >
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col">
                <h3
                  className="text-white font-light text-2xl mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {product.name}
                </h3>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">
                  {product.tagline}
                </p>
                <p className="text-white/50 font-light text-sm leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {product.ingredients.slice(0, 3).map((ing, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-[9px] uppercase tracking-widest rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.4)'
                      }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span
                    className="text-white text-3xl font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    ${product.basePrice}
                  </span>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart({
                        productId: product.id,
                        name: product.name,
                        themeColor: product.themeColor,
                        quantity: 1,
                        unitPrice: product.basePrice,
                        ingredients: [],
                        size: '100g',
                      });
                      navigate('/cart');
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      background: `linear-gradient(135deg, ${product.accentColor}, ${product.buttonColor})`,
                      boxShadow: `0 10px 20px ${product.accentColor}40`
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
