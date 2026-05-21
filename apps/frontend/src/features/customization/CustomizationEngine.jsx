import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus, ShoppingBag, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../shared/context/CartContext';
import { useAuth } from '../../shared/context/AuthContext';
import WaterDroplets from '../../shared/components/WaterDroplets';
import siteContent from '../../content.json';
import { api } from '../../shared/config/api';

const CustomizationEngine = () => {
  const [sizes, setSizes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [fragrances, setFragrances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [size, setSize] = useState('100g');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [fragrance, setFragrance] = useState('oudh');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(`${api.products}/custom-options`);
        const data = await res.json();
        if (data.success) {
          setSizes(data.options.sizes);
          setIngredients(data.options.ingredients);
          setFragrances(data.options.fragrances);
          if (data.options.sizes.length > 0) setSize(data.options.sizes[0].id);
          if (data.options.fragrances.length > 0) setFragrance(data.options.fragrances[0].id);
        }
      } catch (error) {
        console.error('Failed to load custom options', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="w-8 h-8 text-[#749c56] animate-spin" />
      </div>
    );
  }

  const activeFragrance = fragrances.find(f => f.id === fragrance) || fragrances[0];
  const fragrancePrice = activeFragrance ? activeFragrance.price : 0;

  const activeSize = sizes.find(s => s.id === size) || sizes[0];
  const basePrice = activeSize ? activeSize.price : 60;

  const ingredientsPrice = selectedIngredients.reduce((total, id) => {
    const item = ingredients.find(i => i.id === id);
    return total + (item ? item.price : 0);
  }, 0);
  const unitPrice = basePrice + ingredientsPrice + fragrancePrice;
  const totalPrice = unitPrice * quantity;

  const toggleIngredient = (id) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const buildCartItem = () => ({
    size,
    ingredients: [...selectedIngredients],
    fragrance,
    quantity,
    unitPrice,
  });

  const handleAddToCart = () => {
    addToCart(buildCartItem());
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      sessionStorage.setItem('olive_returnTo', '/build');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('olive_token');
    const customPayload = {
      totalAmount: totalPrice,
      userId: JSON.parse(localStorage.getItem('olive_user') || 'null')?.id || null,
      items: [{
        productId: "custom-atelier-build",
        quantity,
        unitPrice,
        customizations: { size, ingredients: selectedIngredients, fragrance }
      }]
    };
    try {
      const response = await fetch(api.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(customPayload)
      });
      const data = await response.json();
      if (response.ok) {
        if (data.razorpayOrderId) {
          const res = await loadRazorpayScript();
          if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setIsSubmitting(false);
            return;
          }

          const options = {
            key: data.razorpayKeyId,
            amount: Math.round(totalPrice * 100),
            currency: "USD",
            name: "Olive Organics",
            description: "Custom Formulation Checkout",
            order_id: data.razorpayOrderId,
            handler: async function (paymentResponse) {
              try {
                await fetch(`${api.orders}/verify`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...paymentResponse, orderId: data.order.id })
                });
                navigate('/my-orders?payment=success');
              } catch (e) {
                alert('Payment verification failed');
              }
            },
            theme: { color: activeFragrance?.color || "#749c56" }
          };
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (paymentResponse) {
            alert(paymentResponse.error.description);
          });
          rzp.open();
        } else {
          setOrderSuccessData(data);
        }
      } else {
        alert("Checkout failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: '#050a05' }}>
      <WaterDroplets color={activeFragrance?.color || '#749c56'} count={12} />

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* LEFT: Preview */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          {/* 3D Soap Preview */}
          <motion.div
            layout
            className="relative w-full aspect-square rounded-[3rem] overflow-hidden flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: `0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${activeFragrance?.color || '#749c56'}15 0%, transparent 70%)`,
                animation: 'ambientGlow 4s ease-in-out infinite'
              }}
            />

            {/* Animated Soap Bar */}
            <motion.div
              animate={{
                scale: size === '100g' ? 1.1 : 0.9,
                backgroundColor: activeFragrance?.color + '44' || '#749c5622',
              }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="w-52 h-36 rounded-3xl flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${activeFragrance?.color || '#749c56'}33, rgba(0,0,0,0.4))`,
                border: `1px solid ${activeFragrance?.color || '#749c56'}40`,
                boxShadow: `0 20px 60px ${activeFragrance?.color || '#749c56'}25, inset 0 1px 0 rgba(255,255,255,0.1)`,
                animation: 'float3D 6s ease-in-out infinite',
              }}
            >
              {/* Soap label */}
              <div className="text-center">
                <p
                  className="font-serif font-light tracking-[0.15em] uppercase"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                    fontFamily: "'Cormorant Garamond', serif"
                  }}
                >
                  Olive Organics
                </p>
                <p
                  className="font-serif font-medium mt-1"
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '22px',
                    fontFamily: "'Cormorant Garamond', serif"
                  }}
                >
                  {size}
                </p>
              </div>
            </motion.div>

            {/* Bottom reflection */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
              }}
            />
          </motion.div>

          {/* Price card */}
          <div
            className="p-8 rounded-3xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h3 className="text-white/40 text-[10px] uppercase tracking-[0.4em] mb-2">{siteContent.customization.previewSubtitle}</h3>
            <p className="text-white/30 text-sm mb-6 font-light">{siteContent.customization.previewDescription}</p>
            <div className="flex justify-between items-end">
              <span className="text-white/30 uppercase tracking-widest text-xs">{siteContent.customization.totalText}</span>
              <motion.span
                key={totalPrice}
                initial={{ scale: 1.3, color: activeFragrance?.color }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.5 }}
                className="font-serif font-light"
                style={{ fontSize: '3rem', fontFamily: "'Cormorant Garamond', serif" }}
              >
                ₹{totalPrice}
              </motion.span>
            </div>
          </div>
        </div>

        {/* RIGHT: Controls */}
        <div className="lg:col-span-7 space-y-12">

          {/* Size */}
          <section>
            <h4 className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-6">{siteContent.customization.step1Title}</h4>
            <div className="grid grid-cols-2 gap-4">
              {sizes.map(s => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSize(s.id)}
                  className="p-6 rounded-2xl text-left transition-all duration-500"
                  style={{
                    background: size === s.id
                      ? `${activeFragrance?.color || '#749c56'}15`
                      : 'rgba(255,255,255,0.03)',
                    border: size === s.id
                      ? `1px solid ${activeFragrance?.color || '#749c56'}40`
                      : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.name} Bar</span>
                    {size === s.id && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: activeFragrance?.color || '#749c56' }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-white/30 text-xs">₹{s.price} base</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Ingredients */}
          <section>
            <h4 className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-6">{siteContent.customization.step2Title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ingredients.map(item => {
                const isSelected = selectedIngredients.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleIngredient(item.id)}
                    className="p-5 rounded-2xl text-left transition-all duration-400"
                    style={{
                      background: isSelected ? `${item.color}12` : 'rgba(255,255,255,0.03)',
                      border: isSelected ? `1px solid ${item.color}40` : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-white/80 font-medium text-sm">{item.name}</span>
                      <span className="text-[11px] font-bold" style={{ color: item.color }}>+₹{item.price}</span>
                    </div>
                    <p className="text-white/25 text-xs">{item.desc}</p>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Fragrance */}
          <section>
            <h4 className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-6">{siteContent.customization.step3Title}</h4>
            <div className="flex flex-wrap gap-3">
              {fragrances.map(f => (
                <motion.button
                  key={f.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFragrance(f.id)}
                  className="px-5 py-2.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-400"
                  style={{
                    background: fragrance === f.id ? `${f.color}25` : 'rgba(255,255,255,0.05)',
                    border: fragrance === f.id ? `1px solid ${f.color}60` : '1px solid rgba(255,255,255,0.08)',
                    color: fragrance === f.id ? f.color : 'rgba(255,255,255,0.4)',
                    boxShadow: fragrance === f.id ? `0 0 20px ${f.color}20` : 'none',
                  }}
                >
                  {f.name} {f.price > 0 ? `— ₹${f.price}` : ''}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="divider-luxury" />


          {/* Qty + Buttons */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Quantity */}
              <div
                className="flex items-center rounded-full p-1"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/60"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-serif text-xl text-white font-light">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/60"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 w-full font-medium py-5 px-8 rounded-full transition-all duration-500 text-sm tracking-wide flex items-center justify-center gap-3"
                style={{
                  background: addedToCart ? 'rgba(73,99,55,0.3)' : 'rgba(255,255,255,0.05)',
                  border: addedToCart ? '1px solid rgba(73,99,55,0.5)' : '1px solid rgba(255,255,255,0.15)',
                  color: addedToCart ? '#8bc34a' : 'rgba(255,255,255,0.7)',
                }}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    {siteContent.customization.addedToCartMessage}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {siteContent.customization.addToCartText} — ₹{totalPrice}
                  </>
                )}
              </motion.button>
            </div>

            {/* Buy Now */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={isSubmitting}
              className="w-full font-medium py-5 px-8 rounded-full transition-all duration-500 text-white text-sm tracking-wide disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${activeFragrance?.color || '#749c56'}, ${activeFragrance?.color || '#496337'}aa)`,
                boxShadow: `0 20px 60px ${activeFragrance?.color || '#749c56'}30`,
              }}
            >
              {isSubmitting ? siteContent.customization.processingText : `${siteContent.customization.buyNowText} — ₹${totalPrice}`}
            </motion.button>
          </section>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {orderSuccessData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-sm w-full p-10 rounded-[2.5rem] text-center relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 60px 120px rgba(0,0,0,0.8)',
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #496337, #749c56)', boxShadow: '0 0 40px rgba(73,99,55,0.5)' }}
              >
                <Check className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-serif text-white font-light text-3xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {siteContent.customization.successTitle}
              </h3>
              <p className="text-white/40 text-sm mb-8 font-light">{siteContent.customization.successSubtitle}</p>
              <div className="bg-white p-4 rounded-2xl inline-block mb-6">
                <img src={orderSuccessData.paymentQrCodeUrl} alt="Payment QR" className="w-44 h-44" />
              </div>
              <p className="text-white/25 text-xs tracking-widest uppercase mb-8 font-mono">
                Order #{orderSuccessData.order.id.split('-')[0].toUpperCase()}
              </p>
              <button
                onClick={() => setOrderSuccessData(null)}
                className="w-full py-4 rounded-full text-white/60 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {siteContent.customization.returnButtonText}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomizationEngine;
