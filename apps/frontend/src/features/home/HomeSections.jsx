import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Sparkles, Hand, Star, ArrowRight, Mail, Check, MapPin, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import siteContent from '../../content.json';

const hp = siteContent.homepage;
const nl = siteContent.newsletter;
const ft = siteContent.footer;

const iconMap = {
  leaf: Leaf,
  hand: Hand,
  heart: Heart,
  sparkle: Sparkles,
};

const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
};

/* ======================================================
   WHY CHOOSE US
   ====================================================== */
export const WhyUsSection = () => (
  <section className="relative z-10 py-28 px-6 max-w-6xl mx-auto">
    <motion.div {...fadeUp} className="text-center mb-20">
      <p className="text-white/25 text-[10px] uppercase tracking-[0.4em] mb-4">{hp.whyUsTag}</p>
      <h2
        className="text-white font-light"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
      >
        {hp.whyUsTitle}
      </h2>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {hp.whyUsItems.map((item, idx) => {
        const Icon = iconMap[item.icon] || Leaf;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="p-8 rounded-3xl text-center group relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 50%, rgba(116,156,86,0.06), transparent 70%)' }}
            />

            <div className="relative z-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: 'rgba(116,156,86,0.1)',
                  border: '1px solid rgba(116,156,86,0.2)',
                }}
              >
                <Icon className="w-6 h-6 text-[#749c56]" />
              </div>

              {/* Big stat */}
              <p
                className="text-3xl font-light mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#749c56' }}
              >
                {item.stat}
              </p>
              <p className="text-white/25 text-[9px] uppercase tracking-[0.3em] mb-4">{item.statLabel}</p>

              <h3
                className="text-white font-light text-lg mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {item.title}
              </h3>
              <p className="text-white/30 text-xs leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </section>
);

/* ======================================================
   TESTIMONIALS
   ====================================================== */
export const TestimonialsSection = () => (
  <section className="relative z-10 py-28 px-6 max-w-6xl mx-auto">
    <motion.div {...fadeUp} className="text-center mb-20">
      <p className="text-white/25 text-[10px] uppercase tracking-[0.4em] mb-4">{hp.testimonialsTag}</p>
      <h2
        className="text-white font-light"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
      >
        {hp.testimonialsTitle}
      </h2>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hp.testimonials.map((t, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.19, 1, 0.22, 1] }}
          className="p-8 rounded-3xl relative group"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Quote mark */}
          <div
            className="absolute top-6 right-8 font-serif text-6xl leading-none pointer-events-none"
            style={{ color: 'rgba(116,156,86,0.08)', fontFamily: "'Cormorant Garamond', serif" }}
          >
            "
          </div>

          {/* Stars */}
          <div className="flex gap-1 mb-5 items-center">
            {[...Array(Math.round(t.rating))].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#749c56] text-[#749c56]" />
            ))}
            <span className="text-white/40 text-xs ml-1">{t.rating}</span>
          </div>

          <p className="text-white/50 text-sm leading-relaxed font-light mb-6 relative z-10">
            "{t.text}"
          </p>

          <div className="flex items-center gap-3">
            {/* Avatar placeholder */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium"
              style={{
                background: 'linear-gradient(135deg, rgba(116,156,86,0.2), rgba(73,99,55,0.3))',
                border: '1px solid rgba(116,156,86,0.3)',
                color: '#749c56',
              }}
            >
              {t.name.charAt(0)}
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium">{t.name}</p>
              <p className="text-white/25 text-[10px] uppercase tracking-widest">{t.location}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ======================================================
   HOMEPAGE CTA
   ====================================================== */
export const HomeCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="relative z-10 py-28 px-6">
      <motion.div
        {...fadeUp}
        className="max-w-4xl mx-auto text-center p-16 md:p-20 rounded-[3rem] relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 60px 120px rgba(0,0,0,0.4)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 30%, rgba(116,156,86,0.08) 0%, transparent 60%)' }}
        />

        <div className="relative z-10">
          <p className="text-white/25 text-[10px] uppercase tracking-[0.4em] mb-6">{hp.ctaTag}</p>
          <h2
            className="shimmer-text font-light mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {hp.ctaTitle}
          </h2>
          <p className="text-white/40 font-light leading-relaxed mb-12 max-w-xl mx-auto">
            {hp.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/build')}
              className="px-10 py-5 rounded-full text-white text-sm font-medium uppercase tracking-widest flex items-center justify-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #496337, #749c56)',
                boxShadow: '0 20px 60px rgba(73,99,55,0.3)',
              }}
            >
              {hp.ctaBuildButton}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="px-10 py-5 rounded-full text-white/60 hover:text-white text-sm font-medium uppercase tracking-widest transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {hp.ctaBrowseButton}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ======================================================
   NEWSLETTER
   ====================================================== */
export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="relative z-10 py-20 px-6 max-w-3xl mx-auto text-center">
      <motion.div {...fadeUp}>
        <h3
          className="text-white font-light mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
        >
          {nl.title}
        </h3>
        <p className="text-white/35 font-light text-sm mb-8 max-w-md mx-auto">{nl.description}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={nl.placeholder}
            className="flex-1 px-6 py-4 rounded-full text-white text-sm font-light outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="px-8 py-4 rounded-full text-white text-sm font-medium uppercase tracking-widest flex items-center justify-center gap-2"
            style={{
              background: subscribed
                ? 'rgba(73,99,55,0.3)'
                : 'linear-gradient(135deg, #496337, #749c56)',
              border: subscribed ? '1px solid rgba(73,99,55,0.5)' : 'none',
              boxShadow: subscribed ? 'none' : '0 10px 30px rgba(73,99,55,0.2)',
            }}
          >
            {subscribed ? (
              <>
                <Check className="w-4 h-4" />
                {nl.successMessage}
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                {nl.buttonText}
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

/* ======================================================
   FOOTER
   ====================================================== */
export const SiteFooter = () => (
  <footer className="relative z-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
    <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Brand */}
        <div className="md:col-span-4">
          <Link to="/" className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-serif font-medium text-white text-sm"
              style={{
                background: 'linear-gradient(135deg, #496337, #749c56)',
                boxShadow: '0 0 20px rgba(73,99,55,0.4)',
              }}
            >
              O
            </div>
            <span
              className="text-white font-light text-xl tracking-widest"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {siteContent.navigation.brandName}
            </span>
          </Link>
          <p className="text-white/30 text-sm leading-relaxed font-light max-w-xs">
            {ft.brandDescription}
          </p>

          {/* Social */}
          <div className="flex gap-3 mt-6">
            {ft.socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 transition-colors text-xs font-medium uppercase"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {social.platform.charAt(0)}
              </a>
            ))}
          </div>

          {/* Contact */}
          {ft.contact && (
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-white/20 mt-0.5 flex-shrink-0" />
                <p className="text-white/25 text-xs leading-relaxed">{ft.contact.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                <a href={`tel:${ft.contact.phone}`} className="text-white/25 hover:text-white/50 text-xs transition-colors">{ft.contact.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                <a href={`mailto:${ft.contact.email}`} className="text-white/25 hover:text-white/50 text-xs transition-colors">{ft.contact.email}</a>
              </div>
            </div>
          )}
        </div>

        {/* Link columns */}
        {ft.sections.map((section, idx) => (
          <div key={idx} className="md:col-span-2">
            <h4 className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-5">{section.title}</h4>
            <ul className="space-y-3">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <Link
                    to={link.url}
                    className="text-white/25 hover:text-white/60 text-sm font-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-white/20 text-xs">{ft.copyright}</p>
        <div className="flex gap-6">
          {ft.bottomLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              className="text-white/20 hover:text-white/40 text-xs transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
