import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../shared/config/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin ? `${API_URL}/api/v1/users/login` : `${API_URL}/api/v1/users/register`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('olive_token', data.token);
          navigate('/build');
        } else {
          setIsLogin(true);
          alert('Registration successful. Please login.');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24" style={{ background: '#050a05' }}>
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(116,156,86,0.08) 0%, transparent 70%)', animation: 'ambientGlow 6s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(116,156,86,0.05) 0%, transparent 70%)', animation: 'ambientGlow 8s ease-in-out infinite reverse' }} />

      <motion.div 
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 w-full max-w-lg p-10 md:p-14 rounded-[2.5rem] overflow-hidden mx-4"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
      >
        <div className="text-center mb-10">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-4">Secure Access</p>
          <h2 className="shimmer-text font-serif text-4xl md:text-5xl font-light tracking-tight mb-3">
            {isLogin ? 'Welcome Back' : 'Join the Atelier'}
          </h2>
          <p className="text-white/40 font-light text-sm">
            {isLogin ? 'Enter your credentials to access your formulations.' : 'Create an account to save your bespoke creations.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 gap-5"
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" name="firstName" placeholder="First Name" required={!isLogin} value={formData.firstName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-light placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors" />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" name="lastName" placeholder="Last Name" required={!isLogin} value={formData.lastName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-light placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-light placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors" />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-light placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors" />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400/80 text-xs text-center">{error}</motion.p>
          )}

          <div className="pt-4">
            <button type="submit" disabled={loading} className="group relative w-full py-4 rounded-2xl text-white font-medium text-sm tracking-wide transition-all overflow-hidden disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #496337, #749c56)', boxShadow: '0 10px 30px rgba(73,99,55,0.2)' }}>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative flex items-center justify-center space-x-2">
                <span>{loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button onClick={handleToggle} className="text-white/40 hover:text-white/80 transition-colors text-xs font-light tracking-wide">
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
