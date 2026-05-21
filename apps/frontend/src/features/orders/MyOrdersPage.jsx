import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import { API_BASE } from '../../shared/config/api';

const STATUS_STYLES = {
  PENDING_PAYMENT: { bg: '#f59e0b20', border: '#f59e0b40', text: '#f59e0b', label: 'Pending Payment' },
  PAID:            { bg: '#22c55e20', border: '#22c55e40', text: '#22c55e', label: 'Paid' },
  PROCESSING:      { bg: '#3b82f620', border: '#3b82f640', text: '#3b82f6', label: 'Processing' },
  SHIPPED:         { bg: '#8b5cf620', border: '#8b5cf640', text: '#8b5cf6', label: 'Shipped' },
  DELIVERED:       { bg: '#10b98120', border: '#10b98140', text: '#10b981', label: 'Delivered' },
};

const TRACK_STEPS = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const s = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING_PAYMENT;
  const stepIndex = TRACK_STEPS.indexOf(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex flex-wrap items-center justify-between gap-4 p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(116,156,86,0.15)', border: '1px solid rgba(116,156,86,0.25)' }}>
            <Package className="w-4 h-4" style={{ color: '#749c56' }} />
          </div>
          <div>
            <p className="text-white/70 text-sm font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-white/30 text-xs mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            ${order.totalAmount.toFixed(2)}
          </span>
          <span className="text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-widest"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
            {s.label}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-white/05">
          {/* Tracking bar */}
          <div className="mt-6 mb-6">
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Order Tracking</p>
            <div className="flex items-center gap-0">
              {TRACK_STEPS.map((step, i) => {
                const done = i <= stepIndex;
                const label = STATUS_STYLES[step]?.label || step;
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full border-2 transition-all duration-500"
                        style={{ background: done ? '#749c56' : 'transparent', borderColor: done ? '#749c56' : 'rgba(255,255,255,0.15)' }} />
                      <p className="text-[8px] text-white/30 mt-1 max-w-[50px] text-center leading-tight capitalize"
                        style={{ color: done ? 'rgba(116,156,86,0.8)' : 'rgba(255,255,255,0.2)' }}>
                        {label}
                      </p>
                    </div>
                    {i < TRACK_STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mb-3 transition-all duration-500"
                        style={{ background: i < stepIndex ? 'linear-gradient(90deg, #749c56, #749c56)' : 'rgba(255,255,255,0.07)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Items ({order.items.length})</p>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/05 last:border-0">
                <div>
                  <p className="text-white/60 text-sm">Custom Formulation × {item.quantity}</p>
                  {item.customizations?.size && (
                    <p className="text-white/25 text-xs">Size: {item.customizations.size}</p>
                  )}
                </div>
                <p className="text-white/70 text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default function MyOrdersPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/auth'); return; }
    const token = localStorage.getItem('olive_token');
    fetch(`${API_BASE}/users/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4" style={{ background: '#050a05' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">Account</p>
          <h1 className="text-white text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            My Orders
          </h1>
          <p className="text-white/30 text-sm mt-1">Welcome back, {user?.firstName}</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[0,1,2].map(i => <div key={i} className="h-20 rounded-3xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <ShoppingBag className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/30 text-sm mb-6">You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/build')}
              className="px-8 py-3 rounded-full text-white text-sm uppercase tracking-widest"
              style={{ background: 'linear-gradient(135deg, #496337, #749c56)' }}>
              Start Building
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
