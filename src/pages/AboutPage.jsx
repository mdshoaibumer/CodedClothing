/**
 * AboutPage.jsx — Brand Story & Mission
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb';

const EASE_LUXURY = [0.16, 1, 0.3, 1];

const VALUES = [
  { icon: '◈', title: 'Premium Quality', desc: 'We source only 100% long-staple Egyptian cotton — the world\'s finest — for unmatched softness, breathability, and durability.' },
  { icon: '◇', title: 'Precision Craft', desc: 'Every garment is printed with 1200 DPI DTG technology, ensuring photo-realistic reproduction that lasts wash after wash.' },
  { icon: '△', title: 'Sustainable Practice', desc: 'Eco-conscious manufacturing with water-based inks, minimal waste cutting, and plastic-free packaging.' },
  { icon: '○', title: 'Customer First', desc: 'From our interactive design studio to express delivery, every touchpoint is engineered for delight.' },
];

const TIMELINE = [
  { year: '2024', title: 'The Spark', desc: 'Founded with a simple belief: custom apparel should feel premium, not like a novelty.' },
  { year: '2024', title: 'Studio Launch', desc: 'Our interactive design studio goes live — drag, scale, rotate your artwork with pixel precision.' },
  { year: '2025', title: 'Growing Community', desc: '50,000+ custom designs created by our community of creators, artists, and brands.' },
  { year: '2026', title: 'The Future', desc: 'Expanding our canvas — new garment types, advanced print techniques, and global shipping.' },
];

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto pb-20"
    >
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Our Story' },
      ]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-20"
      >
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Our Story</span>
        <h1 className="text-4xl md:text-6xl font-black text-obsidian-900 tracking-tighter leading-[0.9] mb-6">
          Where Code Meets <span className="gradient-text-gold">Craft</span>
        </h1>
        <p className="text-base md:text-lg text-obsidian-400 leading-relaxed max-w-2xl font-medium">
          Coded Clothing was born from the intersection of technology and textile artistry. 
          We believe that what you wear should be as unique as the code that powers your world —
          precise, intentional, and beautifully engineered.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-24 p-10 rounded-[2rem] bg-obsidian-950 relative overflow-hidden"
      >
        <div className="absolute inset-0 particles-bg opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
        <div className="relative z-10">
          <span className="text-xs font-black text-gold-400 uppercase tracking-[0.5em] block mb-4">Our Mission</span>
          <blockquote className="text-xl md:text-3xl font-bold text-white tracking-tight leading-snug">
            &ldquo;To democratize premium custom apparel — making bespoke quality accessible to every creator, 
            artist, and individual who refuses to wear ordinary.&rdquo;
          </blockquote>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-24"
      >
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">What We Stand For</span>
        <h2 className="text-3xl md:text-4xl font-black text-obsidian-900 tracking-tighter mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-8 rounded-2xl bg-white border border-obsidian-100/50 hover:border-gold-300/50 hover:shadow-luxury transition-all duration-500 group"
            >
              <span className="text-2xl text-gold-500 mb-4 inline-block">{v.icon}</span>
              <h3 className="text-lg font-bold text-obsidian-900 mb-2 group-hover:text-gold-700 transition-colors">{v.title}</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-24"
      >
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Our Journey</span>
        <h2 className="text-3xl md:text-4xl font-black text-obsidian-900 tracking-tighter mb-12">The Timeline</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold-400/40 via-gold-300/20 to-transparent" />
          <div className="space-y-10">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex gap-6 items-start"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-obsidian-900 flex items-center justify-center text-gold-500 text-xs font-black z-10 relative shadow-lg">
                    {item.year}
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-obsidian-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-obsidian-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center p-12 rounded-[2rem] bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600 relative overflow-hidden"
      >
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">Ready to Create?</h2>
        <p className="text-white/80 text-sm mb-8">Explore our collection and design your masterpiece.</p>
        <Link
          to="/collection"
          className="inline-flex items-center gap-3 px-10 py-5 bg-white text-obsidian-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500"
        >
          Explore Collection →
        </Link>
      </motion.section>
    </motion.div>
  );
}
