/**
 * HomePage.jsx — Cinematic Landing Page
 * 
 * The brand's front door. Features:
 * - Full-screen hero with animated headline
 * - Featured products showcase
 * - Brand values strip
 * - Social proof counters
 * - CTA to collection
 */

import { memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { tshirts } from '../data/tshirts';
import {
  RevealOnScroll,
  Marquee,
  AnimatedCounter,
  StaggerText,
} from '../components/effects/AnimationEffects';

const EASE_LUXURY = [0.16, 1, 0.3, 1];

/** Featured products — pick first 3 labeled items or fallback to first 3 */
const FEATURED = tshirts.filter((t) => t.label).slice(0, 3);
if (FEATURED.length < 3) FEATURED.push(...tshirts.slice(0, 3 - FEATURED.length));

const STATS = [
  { value: 50000, suffix: '+', label: 'Designs Created' },
  { value: 100, suffix: '%', label: 'Premium Cotton' },
  { value: 48, suffix: 'hr', label: 'Express Delivery' },
  { value: 4.9, suffix: '★', label: 'Average Rating' },
];

const VALUES = [
  { icon: '◈', title: 'Egyptian Cotton', desc: '100% long-staple fibers for unmatched softness' },
  { icon: '◇', title: '1200 DPI Print', desc: 'Photo-realistic DTG reproduction that lasts' },
  { icon: '△', title: 'Tailored Fit', desc: 'Ergonomic patterns designed for modern silhouettes' },
  { icon: '○', title: 'WhatsApp Orders', desc: 'Simple ordering — chat, confirm, delivered' },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** ScrollProgress bar at top of page */
const ScrollProgress = memo(function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 z-[100]"
    />
  );
});

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="-mx-6 md:-mx-10 lg:-mx-16 -mt-10">
      <ScrollProgress />

      {/* ─── Hero Section ─── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-obsidian-950">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-obsidian-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08),transparent_70%)]" />

        {/* Floating words background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['PREMIUM', 'BESPOKE', 'CRAFTED'].map((word, i) => (
            <span
              key={word}
              className="absolute text-[8rem] md:text-[14rem] font-black text-white/[0.015] select-none whitespace-nowrap aurora-float"
              style={{ top: `${15 + i * 30}%`, left: `${-10 + i * 20}%`, animationDuration: `${25 + i * 5}s` }}
            >
              {word}
            </span>
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block text-xs font-black text-gold-400 uppercase tracking-[0.6em] mb-6 md:mb-8"
          >
            Premium Custom Apparel
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: EASE_LUXURY }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6"
          >
            Wear Your <br />
            <span className="gradient-text-gold">Identity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base md:text-lg text-obsidian-300 max-w-xl mx-auto mb-10 font-medium leading-relaxed"
          >
            Luxury custom t-shirts crafted from 100% Egyptian cotton.
            Design your masterpiece in our interactive studio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/collection"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-obsidian-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] transition-all duration-500 group"
            >
              <span>Explore Collection</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-5 border-2 border-white/20 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:border-gold-400/50 hover:text-gold-400 transition-all duration-500"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-obsidian-400"
            >
              <span className="text-2xs uppercase tracking-[0.3em] font-bold">Scroll</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Marquee Strip ─── */}
      <Marquee speed={40} className="bg-obsidian-900 py-4 border-y border-gold-500/10">
        {['PREMIUM EGYPTIAN COTTON', '◈', 'DTG 1200 DPI', '◇', 'FREE SHIPPING ₹999+', '△', 'WHATSAPP ORDERS', '○', 'CUSTOM DESIGN STUDIO', '◈'].map(
          (text, i) => (
            <span key={i} className="text-xs font-black text-gold-400/60 uppercase tracking-[0.4em] mx-8">
              {text}
            </span>
          )
        )}
      </Marquee>

      {/* ─── Featured Products ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-24">
        <RevealOnScroll direction="up">
          <div className="text-center mb-16">
            <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Curated Selection</span>
            <h2 className="text-3xl md:text-5xl font-black text-obsidian-900 tracking-tighter mb-4">
              Featured <span className="gradient-text-gold">Pieces</span>
            </h2>
            <p className="text-sm text-obsidian-400 max-w-md mx-auto font-medium">
              Handpicked from our collection — the most loved styles by our community.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: EASE_LUXURY }}
            >
              <Link
                to={`/product/${product.id}`}
                className="group block bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-luxury transition-all duration-500 border border-obsidian-100/50"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-obsidian-50 to-obsidian-100/30 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.color}
                    className="w-full h-full object-contain mix-blend-multiply p-6 group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {product.label && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-black px-3 py-1.5 rounded-full text-obsidian-800 shadow-md uppercase tracking-widest">
                      {product.label}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <span className="px-6 py-3 bg-obsidian-900/90 backdrop-blur-sm rounded-2xl text-xs font-black uppercase tracking-widest text-white whitespace-nowrap">
                      View Details →
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full shadow-inner ring-2 ring-obsidian-100" style={{ backgroundColor: product.hex }} />
                    <h3 className="text-sm font-bold text-obsidian-900 group-hover:text-gold-700 transition-colors">{product.color}</h3>
                  </div>
                  <p className="text-xs text-obsidian-400 mb-3 line-clamp-2">{product.description}</p>
                  <p className="text-obsidian-900 font-black text-base">₹{product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/collection"
            className="inline-flex items-center gap-3 px-10 py-5 bg-obsidian-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-luxury hover:bg-obsidian-800 transition-all duration-500 btn-liquid group"
          >
            <span>View Full Collection</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* ─── Values Strip ─── */}
      <section className="bg-obsidian-950 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.06),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative z-10">
          <RevealOnScroll direction="up">
            <div className="text-center mb-16">
              <span className="text-xs font-black text-gold-400 uppercase tracking-[0.5em] block mb-4">Why Coded Clothing</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                Built <span className="gradient-text-gold">Different</span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center p-6 rounded-2xl border border-white/5 hover:border-gold-500/20 transition-all duration-500 group"
              >
                <span className="text-3xl text-gold-500 block mb-4">{v.icon}</span>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">{v.title}</h3>
                <p className="text-xs text-obsidian-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Counter ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <RevealOnScroll key={stat.label} direction="up" delay={i * 0.1}>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-obsidian-900 tracking-tight">
                  <AnimatedCounter target={stat.value} />{stat.suffix}
                </div>
                <p className="text-xs font-bold text-obsidian-400 uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center p-12 md:p-20 rounded-[2rem] bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Ready to Create?</h2>
            <p className="text-white/80 text-sm md:text-base mb-8 max-w-md mx-auto">
              Pick your canvas, upload your design, and order directly via WhatsApp. It's that simple.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/collection"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-obsidian-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500"
              >
                Start Designing →
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
