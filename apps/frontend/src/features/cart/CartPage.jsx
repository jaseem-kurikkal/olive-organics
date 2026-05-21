import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../shared/context/CartContext';
import { useAuth } from '../../shared/context/AuthContext';
import WaterDroplets from '../../shared/components/WaterDroplets';
import siteContent from '../../content.json';
import { api } from '../../shared/config/api';

const INGREDIENTS = siteContent.ingredients;
const FRAGRANCES = siteContent.fragrances;
const cartText = siteContent.cart;

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  const getFragranceName = (id) => FRAGRANCES.find(f => f.id === id)?.name || id;
  const getFragranceColor = (id) => FRAGRANCES.find(f => f.id === id)?.color || '#749c56';
  const getIngredientName = (id) => INGREDIENTS.find(i => i.id === id)?.name || id;

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

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // Require login before purchase
    if (!isLoggedIn) {
      sessionStorage.setItem('olive_returnTo', '/cart');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem('olive_token');
    const payload = {
      totalAmount: cartTotal,
      userId: JSON.parse(localStorage.getItem('olive_user') || 'null')?.id || null,
      items: cartItems.map(item => {
        const isCustom = !item.productId || item.productId === 'custom-atelier-build';
        return {
          productId: isCustom ? 'custom-atelier-build' : item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          customizations: isCustom ? {
            size: item.size,
            ingredients: item.ingredients,
            fragrance: item.fragrance
          } : { name: item.name }
        };
      })
    };

    try {
      const response = await fetch(api.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload)
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
            amount: Math.round(cartTotal * 100),
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
                clearCart();
                navigate('/my-orders?payment=success');
              } catch (e) {
                alert('Payment verification failed');
              }
            },
            theme: {
              color: "#749c56"
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (paymentResponse) {
            alert(paymentResponse.error.description);
          });
          rzp.open();
        } else {
          setOrderSuccessData(data);
          clearCart();
        }
      } else {
        alert('Checkout failed: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to connect to backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty Cart State
  if (cartItems.length === 0 && !orderSuccessData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#050a05' }}>
        <WaterDroplets color="#749c56" count={8} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="relative z-10 text-center max-w-md"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <ShoppingBag className="w-10 h-10 text-white/20" />
          </div>
          <h2
            className="shimmer-text mb-4 font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {cartText.emptyTitle}
          </h2>
          <p className="text-white/40 font-light mb-10 leading-relaxed">{cartText.emptySubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-full text-white/60 text-sm font-medium uppercase tracking-widest transition-colors hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {cartText.browseButtonText}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/build')}
              className="px-8 py-4 rounded-full text-white text-sm font-medium uppercase tracking-widest"
              style={{
                background: 'linear-gradient(135deg, #496337, #749c56)',
                boxShadow: '0 20px 60px rgba(73,99,55,0.3)',
              }}
            >
              {cartText.buildButtonText}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#050a05' }}>
      <WaterDroplets color="#749c56" count={10} />

      <div className="relative z-10 max-w-5xl mx-auto pt-32 pb-20 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-16"
        >
          <p className="text-white/30 text-[11px] uppercase tracking-[0.4em] mb-6">{cartText.pageSubtitle}</p>
          <h2
            className="shimmer-text font-light leading-[0.9] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            {cartText.pageTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => {
                const isCustom = !item.productId || item.productId === 'custom-atelier-build';
                const fragranceColor = isCustom ? getFragranceColor(item.fragrance) : item.themeColor || '#749c56';
                const itemName = isCustom ? `Bespoke ${getFragranceName(item.fragrance)}` : item.name;

                return (
                  <motion.div
                    key={item.cartId}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.19, 1, 0.22, 1] }}
                    className="p-6 rounded-3xl relative overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {/* Ambient glow */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                      style={{ background: `${fragranceColor}10` }}
                    />

                    <div className="relative flex gap-6">
                      {/* Mini soap preview */}
                      <div
                        className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${fragranceColor}22, rgba(0,0,0,0.3))`,
                          border: `1px solid ${fragranceColor}30`,
                        }}
                      >
                        <div
                          className="w-10 h-7 rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${fragranceColor}44, ${fragranceColor}22)`,
                            boxShadow: `0 4px 12px ${fragranceColor}20`,
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3
                              className="text-white font-light text-lg"
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              {itemName}
                            </h3>
                            {isCustom && (
                              <p className="text-white/30 text-xs mt-0.5">
                                {cartText.itemSizeLabel}: {item.size}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-white/20 hover:text-red-400 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Ingredient tags */}
                        {isCustom && item.ingredients && item.ingredients.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {item.ingredients.map(ingId => (
                              <span
                                key={ingId}
                                className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest"
                                style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  color: 'rgba(255,255,255,0.4)',
                                }}
                              >
                                {getIngredientName(ingId)}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quantity + Price */}
                        <div className="flex items-center justify-between">
                          <div
                            className="flex items-center rounded-full p-0.5"
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-white text-sm font-light">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span
                            className="text-white font-light text-xl"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            ${item.unitPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue Shopping */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/build')}
              className="mt-6 text-white/30 hover:text-white/60 text-xs uppercase tracking-[0.3em] transition-colors"
            >
              ← {cartText.continueShoppingText}
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
              className="sticky top-32 p-8 rounded-3xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
              }}
            >
              <h3
                className="text-white font-light text-2xl mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Order Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">{cartText.subtotalText} ({cartCount} items)</span>
                  <span className="text-white/70">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">{cartText.shippingText}</span>
                  <span className="text-white/50 italic">{cartText.shippingValue}</span>
                </div>
                <div className="divider-luxury" />
                <div className="flex justify-between items-end">
                  <span className="text-white/40 uppercase tracking-widest text-xs">{cartText.totalText}</span>
                  <span
                    className="text-white font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem' }}
                  >
                    ${cartTotal}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-5 rounded-full text-white text-sm font-medium uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #496337, #749c56)',
                  boxShadow: '0 20px 60px rgba(73,99,55,0.3)',
                }}
              >
                {isSubmitting ? siteContent.customization.processingText : cartText.checkoutButtonText}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </motion.div>
          </div>
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
                onClick={() => { setOrderSuccessData(null); navigate('/'); }}
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

export default CartPage;
