/**
 * CollectionPage.jsx — Main Landing / Collection Page
 * 
 * Showcases the brand's premium t-shirt collection with:
 * - Parallax hero section with animated counters
 * - Scrolling marquee banner for brand messaging
 * - Product gallery grid
 * - Process steps with spotlight cards
 * - Social proof / testimonials
 * - Call-to-action section
 * 
 * Performance Notes:
 * - Decorative shapes use CSS animations (GPU-composited) over JS-driven motion
 * - Heavy effects are viewport-gated with `once: true`
 * - Static data is declared outside the component to avoid re-creation
 */

import { memo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import ProductGallery from '../features/product/ProductGallery';
import {
  RevealOnScroll,
  Marquee,
  AnimatedCounter,
  StaggerText,
  MorphingBlob,
  ScaleReveal,
  SpotlightCard,
  NumberTicker,
  TextLineReveal,
  RotatingTextRing,
} from '../components/effects/AnimationEffects';

/* ─── Constants ─── */
const EASE_LUXURY = [0.16, 1, 0.3, 1];

/** Hero statistics displayed below the headline */
const HERO_STATS = [
  { value: 100, suffix: '%', label: 'Premium Fabric' },
  { value: 7, suffix: '', label: 'Product Categories' },
  { value: 50000, suffix: '+', label: 'Designs Created', prefix: '' },
];

/** Process steps shown in the "How It Works" section */
const PROCESS_STEPS = [
  { num: '01', title: 'Select', desc: 'Choose your premium canvas from our curated collection', icon: '◈' },
  { num: '02', title: 'Design', desc: 'Upload your artwork with our precision placement tools', icon: '◇' },
  { num: '03', title: 'Craft', desc: 'Each piece is individually printed with DTG technology', icon: '△' },
  { num: '04', title: 'Deliver', desc: 'Express shipped in premium packaging to your door', icon: '○' },
];

/** Band statistics for the dark stats section */
const BAND_STATS = [
  { value: 50000, suffix: '+', label: 'Happy Customers' },
  { value: 100, suffix: '%', label: 'Premium Cotton' },
  { value: 48, suffix: 'hr', label: 'Express Delivery' },
  { value: 4.9, suffix: '★', label: 'Average Rating' },
];

/** Feature cards data */
const FEATURES = [
  { icon: '◈', title: 'Egyptian Cotton', desc: '100% long-staple fibers for unmatched softness and durability' },
  { icon: '◇', title: 'Precision Print', desc: 'DTG technology with 1200 DPI for photo-realistic reproduction' },
  { icon: '△', title: 'Tailored Fit', desc: 'Ergonomic patterns designed for modern silhouettes' },
];

/** Testimonials data */
const TESTIMONIALS = [
  { initials: 'AK', name: 'Arjun K.', role: 'Verified Customer', stars: 5, quote: 'The quality is unlike anything I\'ve seen. Each piece feels like it was made just for me.' },
  { initials: 'PS', name: 'Priya S.', role: 'Fashion Blogger', stars: 5, quote: 'I ordered custom tees for my brand — the print quality and fabric feel exceeded all expectations. My followers love them.' },
  { initials: 'RV', name: 'Rahul V.', role: 'Verified Customer', stars: 5, quote: 'Gifted these to my team. The design studio is incredibly intuitive and the final product is premium in every sense.' },
  { initials: 'NM', name: 'Neha M.', role: 'Studio Owner', stars: 4, quote: 'We use Coded Clothing for our studio merchandise. Consistent quality, fast delivery, and the customization tools are a game-changer.' },
  { initials: 'DK', name: 'Dev K.', role: 'Verified Customer', stars: 5, quote: 'From the packaging to the fabric, everything screams quality. Worth every rupee. Already ordered my third one.' },
  { initials: 'SA', name: 'Sneha A.', role: 'Graphic Designer', stars: 5, quote: 'As a designer, I\'m picky about print accuracy. These tees reproduce my artwork perfectly — colors are vibrant and true.' },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * ScrollProgress — Fixed progress bar at the top of the viewport.
 * Uses spring physics for buttery-smooth scrollbar tracking.
 */
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

/**
 * FloatingWords — Large watermark words in the hero background.
 * Uses pure CSS animation for GPU-composited performance.
 */
function FloatingWords() {
  const words = ['PREMIUM', 'CRAFTED', 'BESPOKE', 'LUXURY'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {words.map((word, i) => (
        <span
          key={word}
          className="absolute text-[8rem] md:text-[12rem] font-black text-obsidian-900/[0.02] select-none whitespace-nowrap aurora-float"
          style={{
            top: `${10 + i * 22}%`,
            left: `${-10 + i * 15}%`,
            transform: `rotate(${-3 + i * 1.5}deg)`,
            animationDuration: `${20 + i * 5}s`,
            animationDelay: `${i * 2}s`,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * TestimonialsSection — Auto-advancing testimonial carousel with manual controls.
 */
function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = TESTIMONIALS[activeIndex];

  return (
    <RevealOnScroll direction="up" className="mt-32 mb-16">
      <section className="text-center max-w-4xl mx-auto px-8 relative">
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          viewport={{ once: true }}
          className="absolute -top-8 left-10 text-[10rem] font-display text-gold-400 leading-none select-none"
        >
          &ldquo;
        </motion.span>

        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-6">Testimonials</span>

        <div className="relative min-h-[220px] md:min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: EASE_LUXURY }}
            >
              <blockquote className="text-xl md:text-3xl font-bold text-obsidian-900 tracking-tight leading-tight mb-8">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-gold-500/30">
                  {testimonial.initials}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-obsidian-900">{testimonial.name}</p>
                  <p className="text-xs text-obsidian-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < testimonial.stars ? 'text-gold-500' : 'text-obsidian-200'}`}>★</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View testimonial ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'bg-gold-500 scale-125 shadow-lg shadow-gold-500/30'
                  : 'bg-obsidian-200 hover:bg-obsidian-300'
              }`}
            />
          ))}
        </div>

        {/* Prev/Next arrows */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full border border-obsidian-100 flex items-center justify-center text-obsidian-400 hover:border-gold-400 hover:text-gold-600 transition-all"
          >
            ←
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-full border border-obsidian-100 flex items-center justify-center text-obsidian-400 hover:border-gold-400 hover:text-gold-600 transition-all"
          >
            →
          </button>
        </div>
      </section>
    </RevealOnScroll>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * NewsletterSection — Email capture with WhatsApp fallback.
 */
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // In production, this would hit an API. For now, open WhatsApp.
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (phoneNumber) {
      const text = `*Newsletter Signup — Coded Clothing*\n\nEmail: ${email}`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    }
    setSubscribed(true);
  };

  return (
    <RevealOnScroll direction="up" className="mt-16 mb-16">
      <section className="relative py-16 px-8 md:px-16 rounded-[3rem] bg-obsidian-50 border border-obsidian-100/50 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-gradient-radial from-gold-200/20 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Stay Updated</span>
          <h2 className="text-2xl md:text-3xl font-black text-obsidian-900 tracking-tighter mb-3">
            Join the <span className="gradient-text-gold">Inner Circle</span>
          </h2>
          <p className="text-sm text-obsidian-400 mb-8 leading-relaxed">
            Be the first to know about new drops, exclusive designs, and members-only offers.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8"
            >
              <span className="text-4xl block mb-3">✓</span>
              <p className="text-sm font-bold text-obsidian-900">You&rsquo;re in! Welcome to the club.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-5 py-4 rounded-xl border border-obsidian-100 bg-white text-sm font-medium text-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-obsidian-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] hover:bg-obsidian-800 transition-all shadow-luxury btn-liquid relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold-600/0 via-gold-600/20 to-gold-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">Subscribe</span>
              </button>
            </form>
          )}

          <p className="text-2xs text-obsidian-300 mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </RevealOnScroll>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * CollectionPage — Primary landing page component.
 */
export default function CollectionPage() {
  const { category } = useParams();
  const heroRef = useRef(null);

  /* Parallax transforms tied to hero scroll position */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });

  return (
    <div className="relative cinematic-grain">
      <ScrollProgress />

      {/* ════════════════════════════════════════════════════════════════════════
          HERO SECTION — Parallax headline with animated stats
         ════════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative mb-20 md:mb-32 overflow-hidden">
        <FloatingWords />

        {/* Decorative blobs — CSS animated for GPU compositing */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-radial from-gold-200/15 via-gold-300/5 to-transparent rounded-full blur-3xl aurora-float" style={{ animationDuration: '25s' }} />
        <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-gradient-radial from-gold-300/10 via-gold-100/5 to-transparent rounded-full blur-3xl aurora-float" style={{ animationDuration: '30s', animationDelay: '5s' }} />

        {/* Geometric decorations — static, no infinite rotation */}
        <div
          className="absolute top-20 right-[20%] w-20 h-20 border border-gold-300/20 rounded-xl hidden md:block"
        />
        <div
          className="absolute top-40 right-[10%] w-10 h-10 bg-gold-400/10 rounded-full hidden md:block"
        />
        <div
          className="absolute bottom-20 right-[30%] w-28 h-28 border border-gold-200/10 rounded-full hidden md:block"
        />

        {/* Hero content with parallax scroll */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: smoothHeroY,
          }}
          className="relative pt-10 md:pt-20 pb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXURY }}
            className="max-w-4xl"
          >
            {/* Eyebrow label */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: EASE_LUXURY }}
                className="h-px w-16 bg-gradient-to-r from-gold-500 to-transparent origin-left"
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs font-black text-gold-600 uppercase tracking-[0.5em]"
              >
                The Collection — 2026
              </motion.span>
            </motion.div>

            {/* Headline */}
            <div className="text-5xl md:text-7xl lg:text-[6rem] font-black text-obsidian-900 tracking-tighter leading-[0.85] mb-8">
              <StaggerText text="Wear Your" className="block" />
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: EASE_LUXURY }}
                className="block text-iridescent"
              >
                Identity
              </motion.span>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-base md:text-lg text-obsidian-400 max-w-lg leading-relaxed font-medium"
            >
              Premium cotton canvases, engineered for your creative expression.
              Select your base. Design your masterpiece. Crafted with obsessive attention to detail.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <motion.a
                href="#gallery"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-10 py-5 bg-obsidian-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-luxury hover:shadow-luxury-hover transition-shadow duration-500 btn-liquid overflow-hidden group"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.a>
              <motion.a
                href="#process"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-10 py-5 bg-white text-obsidian-900 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] border border-obsidian-100 hover:border-gold-400 transition-all duration-500 shadow-soft hover:shadow-gold neon-border overflow-hidden group"
              >
                <span className="relative z-10">Custom Design →</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Hero Product Showcase — visual product presence above the fold */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: EASE_LUXURY }}
            className="absolute right-0 top-10 hidden lg:flex items-center justify-center"
            style={{ width: '40%' }}
          >
            <div className="relative">
              <motion.img
                src="/images/tshirts/black_front_side.png"
                alt="Premium Cotton Tee"
                className="w-[320px] h-auto drop-shadow-2xl mix-blend-multiply"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-luxury border border-gold-200/30 text-center"
              >
                <span className="text-xs font-black text-obsidian-900 uppercase tracking-wider">From ₹449</span>
                <span className="block text-2xs text-obsidian-400 mt-0.5">Premium Egyptian Cotton</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Animated Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex gap-8 md:gap-16 mt-16 pt-10 border-t border-obsidian-100/50"
          >
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.15, duration: 0.5 }}
                className="group"
              >
                <div className="text-3xl md:text-4xl font-black text-obsidian-900 group-hover:gradient-text-gold transition-all duration-500">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix} duration={2 + i * 0.3} />
                </div>
                <div className="text-xs font-bold text-obsidian-400 uppercase tracking-[0.25em] mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          MARQUEE BANNER — Brand messaging infinite scroll
         ════════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" className="mb-16">
        <div className="py-8 border-y border-obsidian-100/50 overflow-hidden relative">
          <Marquee speed={35} className="text-obsidian-200">
            <span className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-8">
              <span>Premium Egyptian Cotton</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span>Bespoke Design Studio</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span>Handcrafted Quality</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span>Free Express Shipping</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span>Lifetime Color Guarantee</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span>Sustainable Materials</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
            </span>
          </Marquee>
        </div>
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════════
          PRODUCT GALLERY — Grid of T-Shirt cards
         ════════════════════════════════════════════════════════════════════════ */}
      <div id="gallery">
        <ProductGallery category={category || 'all'} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          PROCESS SECTION — How it works (4 steps)
         ════════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" className="mt-32 mb-20">
        <section id="process" className="relative py-20 px-8 rounded-[3rem] bg-gradient-to-br from-obsidian-50 to-white overflow-hidden border border-obsidian-100/50 holographic-card scroll-mt-24">
          <MorphingBlob className="w-[500px] h-[500px] -top-20 -right-20 opacity-60" color="rgba(201, 169, 110, 0.08)" />
          <MorphingBlob className="w-[350px] h-[350px] -bottom-10 -left-10 opacity-50" color="rgba(201, 169, 110, 0.06)" />

          {/* Connecting line between steps */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: EASE_LUXURY }}
            className="absolute top-[55%] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent origin-left hidden md:block z-0"
          />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <TextLineReveal>
              <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Our Process</span>
              <h2 className="text-3xl md:text-5xl font-black text-obsidian-900 tracking-tight">
                From Concept to <span className="gradient-text-gold">Masterpiece</span>
              </h2>
            </TextLineReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
              {PROCESS_STEPS.map((step) => (
                <ScaleReveal key={step.num}>
                  <SpotlightCard className="p-8 rounded-2xl bg-white border border-obsidian-100/50 hover:border-gold-300/50 transition-all duration-700 group h-full shadow-soft hover:shadow-luxury hover-magnify relative overflow-hidden">
                    {/* Step number watermark */}
                    <span className="absolute -top-4 -right-2 text-[5rem] font-black text-obsidian-50 group-hover:text-gold-100/30 transition-colors duration-700 select-none">
                      {step.num}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200/50 flex items-center justify-center mb-5 group-hover:shadow-gold transition-shadow duration-500 relative"
                    >
                      <span className="text-2xl text-gold-600">{step.icon}</span>
                    </motion.div>
                    <span className="text-xs font-black text-gold-500 tracking-[0.3em]">{step.num}</span>
                    <h3 className="text-obsidian-900 font-bold mt-2 mb-2 text-lg group-hover:text-gold-700 transition-colors duration-300">{step.title}</h3>
                    <p className="text-obsidian-400 text-xs leading-relaxed relative z-10">{step.desc}</p>
                    <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-gold-400 via-gold-300 to-transparent mt-4 transition-all duration-700" />
                  </SpotlightCard>
                </ScaleReveal>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════════
          STATS BAND — Dark background with animated number tickers
         ════════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" className="my-16">
        <div className="py-10 bg-obsidian-950 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 particles-bg opacity-20" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 relative z-10 px-6">
            {BAND_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-2xl md:text-4xl font-black text-white">
                  <NumberTicker value={stat.value} suffix={stat.suffix} duration={2 + i * 0.3} />
                </div>
                <div className="text-xs font-bold text-gold-400/80 uppercase tracking-[0.25em] mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════════
          FEATURES SECTION — Why Premium (dark bg)
         ════════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="up" className="mt-16">
        <section className="relative py-28 px-8 md:px-16 rounded-[3rem] bg-obsidian-950 overflow-hidden line-scan">
          {/* Ambient backgrounds */}
          <div className="absolute inset-0 particles-bg opacity-40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-gold-500/12 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-gold-400/8 to-transparent rounded-full blur-3xl" />

          {/* Decorative rotating text rings (desktop only) */}
          <div className="absolute top-10 right-10 opacity-40 hidden lg:block">
            <RotatingTextRing text="  PREMIUM • QUALITY • CRAFTED • LUXURY • " radius={60} />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-black text-gold-400 uppercase tracking-[0.5em]">Why Premium</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6 tracking-tight">
                Crafted for <span className="gradient-text-gold">Perfection</span>
              </h2>
              <p className="text-obsidian-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Every stitch tells a story. Our garments are manufactured with precision engineering
                and the finest materials sourced from around the world.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-gold-500/40 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-400/0 group-hover:from-gold-500/10 group-hover:to-gold-400/5 transition-all duration-700 rounded-3xl" />
                  <motion.span
                    className="text-4xl text-gold-400 inline-block relative z-10"
                    whileHover={{ scale: 1.4, rotate: 20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <h3 className="text-white font-bold mt-5 mb-3 text-lg relative z-10 group-hover:text-gold-300 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-obsidian-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>
                  <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-gold-500/50 via-gold-400/80 to-transparent mt-6 transition-all duration-700" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* ════════════════════════════════════════════════════════════════════════
          TESTIMONIALS — Social proof carousel
         ════════════════════════════════════════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ════════════════════════════════════════════════════════════════════════
          NEWSLETTER — Email capture
         ════════════════════════════════════════════════════════════════════════ */}
      <NewsletterSection />

      {/* ════════════════════════════════════════════════════════════════════════
          CTA BAND — Final call-to-action
         ════════════════════════════════════════════════════════════════════════ */}
      <RevealOnScroll direction="scale" className="mt-16 mb-20">
        <section className="relative py-20 px-8 rounded-[3rem] bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600 overflow-hidden">
          {/* Static background circle */}
          <div
            className="absolute -top-1/2 -right-1/2 w-full h-full opacity-10"
          >
            <div className="w-full h-full border-[40px] border-white/20 rounded-full" />
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4"
            >
              Ready to Create?
            </motion.h2>
            <p className="text-white/80 text-sm md:text-base mb-8">
              Design your masterpiece with our premium customization studio.
            </p>
            <motion.a
              href="#gallery"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-12 py-5 bg-white text-obsidian-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500 relative overflow-hidden group"
            >
              <span className="relative z-10">Start Designing</span>
              <span className="relative z-10">→</span>
            </motion.a>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
