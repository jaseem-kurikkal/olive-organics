import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Sparkles, Hand, Droplets, FlaskConical, Wind, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WaterDroplets from '../../shared/components/WaterDroplets';
import siteContent from '../../content.json';

const r = siteContent.ritual;

const iconMap = {
  leaf: Leaf,
  hand: Hand,
  heart: Heart,
  sparkle: Sparkles,
  soap: Droplets,
  shampoo: FlaskConical,
  oil: Wind,
  custom: Palette,
};

const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
};

const RitualPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative" style={{ background: '#050a05' }}>
      <WaterDroplets color="#749c56" count={8} />

      {/* ===================== HERO ===================== */}
      <section className="relative z-10 pt-40 pb-32 px-6 text-center max-w-4xl mx-auto">
        <motion.div {...fadeUp}>
          <p className="text-white/30 text-[11px] uppercase tracking-[0.4em] mb-6">{r.heroTag}</p>
          <h1
            className="shimmer-text font-light leading-[0.9] tracking-tight mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(4rem, 10vw, 8rem)' }}
          >
            {r.heroTitle}
          </h1>
          <p className="text-white/45 font-light leading-relaxed text-lg max-w-2xl mx-auto">
            {r.heroDescription}
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="mt-20 h-px mx-auto"
          style={{ maxWidth: '200px', background: 'linear-gradient(90deg, transparent, rgba(116,156,86,0.4), transparent)' }}
        />
      </section>

      {/* ===================== ORIGIN STORY ===================== */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp}>
            <p className="text-white/25 text-[10px] uppercase tracking-[0.4em] mb-4">Since 2021</p>
            <h2
              className="text-white font-light mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              {r.originTitle}
            </h2>
            <p className="text-white/40 font-light leading-relaxed mb-6">{r.originText}</p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="p-10 rounded-[2.5rem] relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
            }}
          >
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'rgba(116,156,86,0.08)' }}
            />
            <h3
              className="text-white font-light mb-4 relative z-10"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem' }}
            >
              {r.philosophyTitle}
            </h3>
            <p className="text-white/35 font-light leading-relaxed relative z-10">{r.philosophyText}</p>
          </motion.div>
        </div>
      </section>

      {/* ===================== PRODUCTS ===================== */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-white/25 text-[10px] uppercase tracking-[0.4em] mb-4">Our Range</p>
          <h2
            className="text-white font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            {r.productsTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {r.products.map((product, idx) => {
            const Icon = iconMap[product.icon] || Droplets;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="p-8 rounded-3xl relative overflow-hidden group"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: `${product.color}15` }}
                />

                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: `${product.color}15`,
                      border: `1px solid ${product.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: product.color }} />
                  </div>
                  <h3
                    className="text-white font-light text-xl mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-white/35 font-light text-sm leading-relaxed">{product.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== TIMELINE ===================== */}
      <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-20">
          <p className="text-white/25 text-[10px] uppercase tracking-[0.4em] mb-4">Milestones</p>
          <h2
            className="text-white font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            {r.timelineTitle}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(116,156,86,0.3), transparent)' }}
          />

          {r.timeline.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className={`relative flex items-start mb-16 last:mb-0 ${
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Dot */}
              <div
                className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10"
                style={{
                  background: 'linear-gradient(135deg, #496337, #749c56)',
                  boxShadow: '0 0 20px rgba(116,156,86,0.4)',
                }}
              />

              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-[45%] ${idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                <span
                  className="text-2xl font-light block mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: '#749c56' }}
                >
                  {event.year}
                </span>
                <h3
                  className="text-white font-light text-lg mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {event.title}
                </h3>
                <p className="text-white/35 font-light text-sm leading-relaxed">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== VALUES ===================== */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-white/25 text-[10px] uppercase tracking-[0.4em] mb-4">Our Promise</p>
          <h2
            className="text-white font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            {r.valuesTitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {r.values.map((value, idx) => {
            const Icon = iconMap[value.icon] || Sparkles;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="text-center p-6"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(116,156,86,0.1)',
                    border: '1px solid rgba(116,156,86,0.2)',
                  }}
                >
                  <Icon className="w-5 h-5 text-[#749c56]" />
                </div>
                <h4
                  className="text-white font-light text-sm mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}
                >
                  {value.title}
                </h4>
                <p className="text-white/30 text-xs leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="relative z-10 py-32 px-6">
        <motion.div
          {...fadeUp}
          className="max-w-3xl mx-auto text-center p-16 rounded-[3rem] relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 60px 120px rgba(0,0,0,0.4)',
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(116,156,86,0.06) 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            <h2
              className="shimmer-text font-light mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              {r.ctaTitle}
            </h2>
            <p className="text-white/40 font-light leading-relaxed mb-10 max-w-xl mx-auto">
              {r.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/build')}
                className="px-10 py-5 rounded-full text-white text-sm font-medium uppercase tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, #496337, #749c56)',
                  boxShadow: '0 20px 60px rgba(73,99,55,0.3)',
                }}
              >
                {r.ctaBuildButton}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
                className="px-10 py-5 rounded-full text-white/60 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {r.ctaBrowseButton}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default RitualPage;
