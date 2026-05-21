import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, Clock, LogOut, Eye, EyeOff } from 'lucide-react';
import { API_BASE } from '../../shared/config/api';

const ADMIN_SECRET = 'olive_admin_2025';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.19, 1, 0.22, 1] }}
    className="relative rounded-3xl p-6 overflow-hidden"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
    }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-white text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</p>
      </div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}60, transparent)` }} />
  </motion.div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, onChange }) => {
  const colors = {
    PENDING_PAYMENT: { bg: '#f59e0b20', border: '#f59e0b40', text: '#f59e0b' },
    PAID: { bg: '#22c55e20', border: '#22c55e40', text: '#22c55e' },
    PROCESSING: { bg: '#3b82f620', border: '#3b82f640', text: '#3b82f6' },
    SHIPPED: { bg: '#8b5cf620', border: '#8b5cf640', text: '#8b5cf6' },
    DELIVERED: { bg: '#10b98120', border: '#10b98140', text: '#10b981' },
  };
  const c = colors[status] || colors.PENDING_PAYMENT;
  
  if (onChange) {
    return (
      <select
        value={status}
        onChange={e => onChange(e.target.value)}
        className="text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-widest outline-none cursor-pointer appearance-none"
        style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
      >
        {Object.keys(colors).map(key => (
          <option key={key} value={key} className="bg-[#050a05] text-white">
            {key.replace('_', ' ')}
          </option>
        ))}
      </select>
    );
  }

  return (
    <span className="text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-widest"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {status.replace('_', ' ')}
    </span>
  );
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
const AdminLogin = ({ onLogin }) => {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === ADMIN_SECRET) {
      onLogin();
    } else {
      setError('Invalid admin password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050a05' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-sm mx-4 p-8 rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(40px)',
        }}
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center font-serif text-white text-lg"
            style={{ background: 'linear-gradient(135deg, #496337, #749c56)', boxShadow: '0 0 30px rgba(73,99,55,0.4)' }}>
            O
          </div>
          <h1 className="text-white text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Admin Portal</h1>
          <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Olive Organics</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(''); }}
              placeholder="Admin Password"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm outline-none pr-10"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-3 top-3 text-white/30 hover:text-white/60">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 rounded-xl text-white text-sm font-medium tracking-widest uppercase"
            style={{ background: 'linear-gradient(135deg, #496337, #749c56)' }}
          >
            Enter Dashboard
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('olive_admin') === 'true');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogin = () => {
    sessionStorage.setItem('olive_admin', 'true');
    setAuthed(true);
  };
  const handleLogout = () => {
    sessionStorage.removeItem('olive_admin');
    setAuthed(false);
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch(`${API_BASE}/admin/stats`, {
      headers: { 'x-admin-secret': ADMIN_SECRET }
    })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [authed]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        // Update local state
        setData(prev => ({
          ...prev,
          orders: prev.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        }));
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      alert('Error updating status');
    }
  };

  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8" style={{ background: '#050a05' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10">
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-1">Admin Portal</p>
            <h1 className="text-white text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Dashboard
            </h1>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white/50 hover:text-white text-xs uppercase tracking-widest transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <LogOut className="w-3.5 h-3.5" /> Logout
          </motion.button>
        </motion.div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-32 rounded-3xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : data?.success ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <StatCard icon={ShoppingBag} label="Total Orders" value={data.stats.totalOrders} color="#749c56" delay={0.1} />
            <StatCard icon={Users} label="Registered Users" value={data.stats.totalUsers} color="#9b72cf" delay={0.2} />
            <StatCard icon={DollarSign} label="Total Revenue" value={`$${data.stats.totalRevenue.toFixed(2)}`} color="#f59e0b" delay={0.3} />
          </div>
        ) : (
          <div className="text-center text-white/30 py-10">
            {data?.error || 'Failed to load data. Check your Render backend.'}
          </div>
        )}

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex gap-2 mb-6">
          {['orders', 'users'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300"
              style={{
                background: activeTab === tab ? 'linear-gradient(135deg, #496337, #749c56)' : 'rgba(255,255,255,0.04)',
                color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.4)',
                border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.07)',
              }}>
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Orders Table */}
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="p-6 border-b border-white/5">
                <h2 className="text-white/70 text-sm uppercase tracking-widest flex items-center gap-2">
                  <Package className="w-4 h-4" /> Recent Orders
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left text-white/30 text-[10px] uppercase tracking-widest px-6 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.orders?.length === 0 ? (
                      <tr><td colSpan={6} className="text-center text-white/20 py-12 text-sm">No orders yet.</td></tr>
                    ) : data?.orders?.map((order, i) => (
                      <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white/40 text-xs font-mono">{order.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 text-white/70 text-sm">
                          {order.user ? `${order.user.firstName} ${order.user.lastName}` : <span className="text-white/25 italic">Guest</span>}
                        </td>
                        <td className="px-6 py-4 text-white/50 text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                        <td className="px-6 py-4 text-white text-sm">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <StatusBadge 
                            status={order.status} 
                            onChange={newStatus => handleStatusChange(order.id, newStatus)} 
                          />
                        </td>
                        <td className="px-6 py-4 text-white/30 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Users Table */}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="p-6 border-b border-white/5">
                <h2 className="text-white/70 text-sm uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4" /> Registered Users
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Name', 'Email', 'Joined'].map(h => (
                        <th key={h} className="text-left text-white/30 text-[10px] uppercase tracking-widest px-6 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentUsers?.length === 0 ? (
                      <tr><td colSpan={3} className="text-center text-white/20 py-12 text-sm">No users yet.</td></tr>
                    ) : data?.recentUsers?.map((user, i) => (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white/80 text-sm">{user.firstName} {user.lastName}</td>
                        <td className="px-6 py-4 text-white/50 text-sm">{user.email}</td>
                        <td className="px-6 py-4 text-white/30 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
