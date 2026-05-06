import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import ProductGallery from '../features/product/ProductGallery';
import { RevealOnScroll, Marquee, AnimatedCounter, StaggerText, MorphingBlob, ScaleReveal, SpotlightCard, NumberTicker, TextLineReveal, RotatingTextRing } from '../components/effects/AnimationEffects';

// Scroll progress indicator component
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div 
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 z-[100]"
    />
  );
}

// Floating words in background
function FloatingWords() {
  const words = ['PREMIUM', 'CRAFTED', 'BESPOKE', 'LUXURY', 'DESIGN', 'ATELIER', 'COUTURE', 'ARTISAN'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {words.map((word, i) => (
        <motion.span
          key={word}
          animate={{ 
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.015, 0.04, 0.015],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 }}
          className="absolute text-[8rem] md:text-[14rem] font-black text-obsidian-900/[0.02] select-none whitespace-nowrap"
          style={{ 
            top: `${10 + i * 11}%`, 
            left: `${-10 + i * 10}%`,
            transform: `rotate(${-5 + i * 1.5}deg)`,
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export default function CollectionPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });
  const heroRotateX = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 5]);

  return (
    <div className="relative cinematic-grain">
      {/* Scroll progress bar */}
      <ScrollProgress />
      
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative mb-20 md:mb-32 overflow-hidden">
        {/* Floating background words */}
        <FloatingWords />
        
        {/* Animated decorative blobs - enhanced */}
        <motion.div
          animate={{ 
            x: [0, 40, -30, 20, 0], 
            y: [0, -30, 40, -20, 0],
            scale: [1, 1.3, 0.85, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-radial from-gold-200/20 via-gold-300/8 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -50, 30, -20, 0], 
            y: [0, 30, -40, 20, 0],
            scale: [1, 0.7, 1.2, 0.9, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-gradient-radial from-gold-300/15 via-gold-100/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, 30, -40, 0], 
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.8, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-gradient-radial from-gold-400/8 to-transparent rounded-full blur-3xl"
        />
        
        {/* Floating geometric shapes - more */}
        <motion.div
          animate={{ rotate: 360, y: [0, -25, 0] }}
          transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute top-20 right-[20%] w-20 h-20 border border-gold-300/20 rounded-xl"
        />
        <motion.div
          animate={{ rotate: -360, y: [0, 20, 0] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute top-40 right-[10%] w-10 h-10 bg-gold-400/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: 180, scale: [1, 1.3, 1] }}
          transition={{ rotate: { duration: 18, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute bottom-20 right-[30%] w-28 h-28 border border-gold-200/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -90, y: [0, -15, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 4, repeat: Infinity } }}
          className="absolute top-[60%] left-[5%] w-12 h-12 border border-gold-400/15"
          style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
        />
        <motion.div
          animate={{ rotate: 360, scale: [1, 0.8, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] left-[8%] w-6 h-6 bg-gold-500/10 rounded-full"
        />
        
        {/* Decorative dots pattern */}
        <div className="absolute top-32 right-[5%] grid grid-cols-5 gap-3 opacity-20">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-gold-400"
            />
          ))}
        </div>
        
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: smoothHeroY, rotateX: heroRotateX, filter: useTransform(heroBlur, v => `blur(${v}px)`) }} className="relative pt-10 md:pt-20 pb-12" >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            {/* Eyebrow with animated line */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-px w-16 bg-gradient-to-r from-gold-500 to-transparent origin-left" 
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-[10px] font-black text-gold-600 uppercase tracking-[0.5em]"
              >
                The Collection — 2026
              </motion.span>
            </motion.div>

            {/* Main heading with stagger effect */}
            <div className="text-5xl md:text-7xl lg:text-[6rem] font-black text-obsidian-900 tracking-tighter leading-[0.85] mb-8">
              <StaggerText text="Wear Your" className="block" />
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
              className="flex gap-4 mt-10"
            >
              <motion.a
                href="#gallery"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-10 py-5 bg-obsidian-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-luxury hover:shadow-luxury-hover transition-shadow duration-500 btn-liquid overflow-hidden group"
              >
                <span className="relative z-10">Explore Collection</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </motion.a>
              <motion.a
                href="#gallery"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-10 py-5 bg-white text-obsidian-900 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] border border-obsidian-100 hover:border-gold-400 transition-all duration-500 shadow-soft hover:shadow-gold neon-border overflow-hidden group"
              >
                <span className="relative z-10">Custom Design</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-1 bg-gradient-conic from-gold-400/20 via-transparent to-gold-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Floating stats with animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex gap-8 md:gap-16 mt-16 pt-10 border-t border-obsidian-100/50"
          >
            {[
              { value: 100, suffix: '%', label: 'Premium Cotton' },
              { value: 7, suffix: '', label: 'Signature Colors' },
              { value: 50000, suffix: '+', label: 'Designs Created', prefix: '' },
            ].map((stat, i) => (
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
                <div className="text-[9px] font-bold text-obsidian-400 uppercase tracking-[0.25em] mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Premium Marquee Banner - enhanced */}
      <RevealOnScroll direction="up" className="mb-16">
        <div className="py-8 border-y border-obsidian-100/50 overflow-hidden relative">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/5 to-transparent pointer-events-none"
          />
          <Marquee speed={35} className="text-obsidian-200">
            <span className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-8">
              <span className="hover:text-gold-500 transition-colors duration-300">Premium Egyptian Cotton</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span className="hover:text-gold-500 transition-colors duration-300">Bespoke Design Studio</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span className="hover:text-gold-500 transition-colors duration-300">Handcrafted Quality</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span className="hover:text-gold-500 transition-colors duration-300">Free Express Shipping</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span className="hover:text-gold-500 transition-colors duration-300">Lifetime Color Guarantee</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
              <span className="hover:text-gold-500 transition-colors duration-300">Sustainable Materials</span>
              <span className="w-2 h-2 rounded-full bg-gold-400 orb-glow" />
            </span>
          </Marquee>
        </div>
      </RevealOnScroll>

      {/* Gallery Section */}
      <div id="gallery">
        <ProductGallery />
      </div>

      {/* Premium Process Section - enhanced */}
      <RevealOnScroll direction="up" className="mt-32 mb-20">
        <section className="relative py-20 px-8 rounded-[3rem] bg-gradient-to-br from-obsidian-50 to-white overflow-hidden border border-obsidian-100/50 holographic-card">
          <MorphingBlob className="w-[500px] h-[500px] -top-20 -right-20 opacity-60" color="rgba(201, 169, 110, 0.08)" />
          <MorphingBlob className="w-[350px] h-[350px] -bottom-10 -left-10 opacity-50" color="rgba(201, 169, 110, 0.06)" />
          <MorphingBlob className="w-[250px] h-[250px] top-1/2 left-1/2 opacity-30" color="rgba(232, 213, 163, 0.05)" />
          
          {/* Animated connecting line between steps */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[55%] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent origin-left hidden md:block z-0"
          />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <TextLineReveal>
              <span className="text-[10px] font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Our Process</span>
              <h2 className="text-3xl md:text-5xl font-black text-obsidian-900 tracking-tight">
                From Concept to <span className="gradient-text-gold">Masterpiece</span>
              </h2>
            </TextLineReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
              {[
                { num: '01', title: 'Select', desc: 'Choose your premium canvas from our curated collection', icon: '◈' },
                { num: '02', title: 'Design', desc: 'Upload your artwork with our precision placement tools', icon: '◇' },
                { num: '03', title: 'Craft', desc: 'Each piece is individually printed with DTG technology', icon: '△' },
                { num: '04', title: 'Deliver', desc: 'Express shipped in premium packaging to your door', icon: '○' },
              ].map((step, i) => (
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
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute inset-0 rounded-2xl border border-gold-400/30"
                      />
                    </motion.div>
                    <span className="text-[10px] font-black text-gold-500 tracking-[0.3em]">{step.num}</span>
                    <h3 className="text-obsidian-900 font-bold mt-2 mb-2 text-lg group-hover:text-gold-700 transition-colors duration-300">{step.title}</h3>
                    <p className="text-obsidian-400 text-xs leading-relaxed relative z-10">{step.desc}</p>
                    {/* Bottom accent */}
                    <motion.div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-gold-400 via-gold-300 to-transparent mt-4 transition-all duration-700" />
                  </SpotlightCard>
                </ScaleReveal>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Stats Marquee Band */}
      <RevealOnScroll direction="up" className="my-16">
        <div className="py-10 bg-obsidian-950 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 particles-bg opacity-20" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <div className="flex justify-center gap-16 md:gap-24 relative z-10">
            {[
              { value: 50000, suffix: '+', label: 'Happy Customers' },
              { value: 100, suffix: '%', label: 'Premium Cotton' },
              { value: 48, suffix: 'hr', label: 'Express Delivery' },
              { value: 4.9, suffix: '★', label: 'Average Rating' },
            ].map((stat, i) => (
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
                <div className="text-[9px] font-bold text-gold-400/80 uppercase tracking-[0.25em] mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {/* Premium Features Section - ultra enhanced */}
      <RevealOnScroll direction="up" className="mt-16">
        <section className="relative py-28 px-8 md:px-16 rounded-[3rem] bg-obsidian-950 overflow-hidden line-scan">
          {/* Background effects - significantly enhanced */}
          <div className="absolute inset-0 particles-bg opacity-40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-gold-500/12 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-gold-400/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-[300px] h-[600px] bg-gradient-radial from-gold-500/5 to-transparent rounded-full blur-3xl" />
          
          {/* Animated line decorations - more */}
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1], height: ['100px', '200px', '100px'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-8 w-px bg-gradient-to-b from-transparent via-gold-500/40 to-transparent"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1], height: ['80px', '160px', '80px'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-16 right-8 w-px bg-gradient-to-b from-transparent via-gold-500/40 to-transparent"
          />
          <motion.div
            animate={{ opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 left-16 w-32 h-px bg-gradient-to-r from-gold-500/30 to-transparent"
          />

          {/* Rotating text ring decoration */}
          <div className="absolute top-10 right-10 opacity-40 hidden lg:block">
            <RotatingTextRing text="  PREMIUM • QUALITY • CRAFTED • LUXURY • " radius={60} />
          </div>
          <div className="absolute bottom-10 left-10 opacity-20 hidden lg:block">
            <RotatingTextRing text="  CODED • CLOTHING • BESPOKE • DESIGN • " radius={45} />
          </div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] font-black text-gold-400 uppercase tracking-[0.5em]">Why Premium</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6 tracking-tight">
                Crafted for <span className="gradient-text-gold">Perfection</span>
              </h2>
              <p className="text-obsidian-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Every stitch tells a story. Our garments are manufactured with precision engineering 
                and the finest materials sourced from around the world.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {[
                { icon: '◈', title: 'Egyptian Cotton', desc: '100% long-staple fibers for unmatched softness and durability' },
                { icon: '◇', title: 'Precision Print', desc: 'DTG technology with 1200 DPI for photo-realistic reproduction' },
                { icon: '△', title: 'Tailored Fit', desc: 'Ergonomic patterns designed for modern silhouettes' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-gold-500/40 transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-400/0 group-hover:from-gold-500/10 group-hover:to-gold-400/5 transition-all duration-700 rounded-3xl"
                  />
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.span 
                    className="text-4xl text-gold-400 inline-block relative z-10"
                    whileHover={{ scale: 1.4, rotate: 20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <h3 className="text-white font-bold mt-5 mb-3 text-lg relative z-10 group-hover:text-gold-300 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-obsidian-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>
                  {/* Bottom accent line - animated */}
                  <motion.div 
                    className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-gold-500/50 via-gold-400/80 to-transparent mt-6 transition-all duration-700"
                  />
                  {/* Sparkle on hover */}
                  <motion.div
                    animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                    className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold-400/50 group-hover:bg-gold-400 transition-colors duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Testimonial / Social proof section - enhanced */}
      <RevealOnScroll direction="up" className="mt-32 mb-16">
        <section className="text-center max-w-4xl mx-auto px-8 relative">
          {/* Decorative quotes */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute -top-8 left-10 text-[10rem] font-display text-gold-400 leading-none select-none"
          >
            &ldquo;
          </motion.span>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] font-black text-gold-600 uppercase tracking-[0.5em] block mb-6">Testimonials</span>
            <blockquote className="text-2xl md:text-4xl font-bold text-obsidian-900 tracking-tight leading-tight mb-8">
              &ldquo;The quality is unlike anything I&rsquo;ve seen. Each piece feels like it was made just for me.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-gold-500/30">
                AK
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-obsidian-900">Arjun K.</p>
                <p className="text-xs text-obsidian-400">Verified Customer</p>
              </div>
            </div>
            {/* Star rating */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {[1,2,3,4,5].map((star) => (
                <motion.span
                  key={star}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: star * 0.1, type: 'spring', stiffness: 300 }}
                  className="text-gold-500 text-lg"
                >
                  ★
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>
      </RevealOnScroll>

      {/* Premium Call-to-Action Band */}
      <RevealOnScroll direction="scale" className="mt-16 mb-20">
        <section className="relative py-20 px-8 rounded-[3rem] bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600 overflow-hidden">
          {/* Animated background patterns */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -right-1/2 w-full h-full opacity-10"
          >
            <div className="w-full h-full border-[40px] border-white/20 rounded-full" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/2 -left-1/4 w-3/4 h-full opacity-10"
          >
            <div className="w-full h-full border-[30px] border-white/20 rounded-full" />
          </motion.div>
          
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
          
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
              <motion.span 
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-200/40 to-transparent"
              />
            </motion.a>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
