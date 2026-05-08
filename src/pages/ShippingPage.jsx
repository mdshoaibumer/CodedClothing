/**
 * ShippingPage.jsx — Shipping & Delivery Information
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb';

const EASE_LUXURY = [0.16, 1, 0.3, 1];

const SHIPPING_OPTIONS = [
  {
    title: 'Standard Delivery',
    time: '3–5 Business Days',
    price: '₹49',
    desc: 'Available across India. Free on orders above ₹999.',
    icon: '📦',
  },
  {
    title: 'Express Delivery',
    time: '24–48 Hours',
    price: '₹149',
    desc: 'Available in select metro cities — Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune.',
    icon: '⚡',
  },
  {
    title: 'Bulk Orders (10+)',
    time: '5–7 Business Days',
    price: 'Free',
    desc: 'Free priority shipping on all bulk and corporate orders. Contact us for custom timelines.',
    icon: '🏢',
  },
];

const TRACKING_STEPS = [
  { step: '01', title: 'Order Confirmed', desc: 'You\'ll receive a WhatsApp confirmation with your order details.' },
  { step: '02', title: 'In Production', desc: 'Your custom tee is being printed and quality-checked.' },
  { step: '03', title: 'Shipped', desc: 'You\'ll receive a tracking link via WhatsApp once dispatched.' },
  { step: '04', title: 'Delivered', desc: 'Arrives at your doorstep in premium, eco-friendly packaging.' },
];

export default function ShippingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto pb-20"
    >
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Shipping & Delivery' },
      ]} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-16"
      >
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Logistics</span>
        <h1 className="text-4xl md:text-6xl font-black text-obsidian-900 tracking-tighter leading-[0.9] mb-6">
          Shipping & <span className="gradient-text-gold">Delivery</span>
        </h1>
        <p className="text-base text-obsidian-400 leading-relaxed max-w-xl font-medium">
          We partner with India&rsquo;s leading logistics providers to ensure your order arrives safely, quickly, and in premium condition.
        </p>
      </motion.div>

      {/* Shipping Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {SHIPPING_OPTIONS.map((option, i) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
            className="p-8 rounded-2xl bg-white border border-obsidian-100/50 hover:border-gold-300/50 hover:shadow-luxury transition-all duration-500 group"
          >
            <span className="text-3xl block mb-4">{option.icon}</span>
            <h3 className="text-sm font-bold text-obsidian-900 mb-1 group-hover:text-gold-700 transition-colors">{option.title}</h3>
            <p className="text-xs text-gold-600 font-black uppercase tracking-wider mb-3">{option.time} — {option.price}</p>
            <p className="text-xs text-obsidian-400 leading-relaxed">{option.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Tracking Steps */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-20"
      >
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Order Lifecycle</span>
        <h2 className="text-3xl md:text-4xl font-black text-obsidian-900 tracking-tighter mb-12">How It Works</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold-400/40 via-gold-300/20 to-transparent" />
          <div className="space-y-8">
            {TRACKING_STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex gap-6 items-start"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-obsidian-900 flex items-center justify-center text-gold-500 text-xs font-black z-10 relative shadow-lg">
                    {item.step}
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

      {/* Packaging */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-10 rounded-[2rem] bg-obsidian-950 relative overflow-hidden mb-16"
      >
        <div className="absolute inset-0 particles-bg opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
        <div className="relative z-10">
          <span className="text-xs font-black text-gold-400 uppercase tracking-[0.5em] block mb-4">Packaging</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-4">
            Premium, Eco-Friendly Packaging
          </h2>
          <p className="text-sm text-obsidian-300 leading-relaxed max-w-lg">
            Every order is packed in our signature matte-black, plastic-free packaging. Tissue-wrapped and sealed with care — because the unboxing experience matters.
          </p>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-sm text-obsidian-400 mb-4">Have questions about shipping?</p>
        <Link
          to="/faq"
          className="inline-flex items-center gap-2 px-8 py-4 bg-obsidian-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-obsidian-800 transition-all duration-500 shadow-luxury btn-liquid"
        >
          View FAQ →
        </Link>
      </motion.div>
    </motion.div>
  );
}
