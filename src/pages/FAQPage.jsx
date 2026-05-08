/**
 * FAQPage.jsx — Frequently Asked Questions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb';

const EASE_LUXURY = [0.16, 1, 0.3, 1];

const FAQ_SECTIONS = [
  {
    title: 'Orders & Shipping',
    items: [
      { q: 'How do I place an order?', a: 'Select your product, choose your size and quantity, then click "Order on WhatsApp." You\'ll be redirected to WhatsApp where our team will confirm your order and share payment details.' },
      { q: 'What are the delivery timelines?', a: 'Standard delivery takes 3–5 business days. Express delivery (48 hours) is available in select metro cities. You\'ll receive a tracking link once your order ships.' },
      { q: 'Do you offer free shipping?', a: 'Yes! We offer free shipping on all orders above ₹999. For orders below that, a flat ₹49 shipping fee applies.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once your order ships, you\'ll receive a tracking link via WhatsApp. You can track your package in real-time through our logistics partner.' },
    ],
  },
  {
    title: 'Products & Quality',
    items: [
      { q: 'What material are the t-shirts made of?', a: 'All our tees are crafted from 100% long-staple Egyptian cotton (180 GSM bio-washed). This provides exceptional softness, breathability, and durability.' },
      { q: 'Are the t-shirts pre-shrunk?', a: 'Yes. All garments undergo a pre-shrink bio-wash process, so they maintain their fit wash after wash.' },
      { q: 'How do I choose the right size?', a: 'Use the Size Guide available on each product page. Measurements are in inches. For an oversized look, we recommend ordering one size up from your standard fit.' },
      { q: 'What printing technology do you use?', a: 'We use DTG (Direct-to-Garment) printing with 1200 DPI resolution. This ensures photo-realistic, vibrant prints that are durable and feel soft to the touch — no cracking or peeling.' },
    ],
  },
  {
    title: 'Customization',
    items: [
      { q: 'What file formats do you accept for logos?', a: 'We accept PNG (recommended for best quality), JPG, and SVG files. For best results, use images with a minimum resolution of 300 DPI or at least 1000×1000 pixels.' },
      { q: 'Can I place a logo on both front and back?', a: 'Yes! Our design studio lets you upload separate logos for the front and back of the t-shirt. You can independently position, scale, and rotate each logo.' },
      { q: 'Is there a maximum logo size?', a: 'Logo uploads are limited to 5MB per image. The printable area covers approximately 80% of the chest/back area of the tee.' },
      { q: 'Can I preview my design before ordering?', a: 'Yes. Our interactive design studio shows you a real-time preview of your logo placement on the actual t-shirt. You can also export a preview image before ordering.' },
    ],
  },
  {
    title: 'Returns & Care',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for unprinted/plain tees. Custom-printed items are non-returnable unless there is a manufacturing defect. See our Returns & Refunds page for full details.' },
      { q: 'How should I wash my t-shirt?', a: 'Machine wash cold (30°C) inside-out. Use mild detergent. Avoid bleach. Tumble dry low or hang dry. Iron inside-out on low heat. Do not dry clean.' },
      { q: 'Will the print fade over time?', a: 'Our DTG prints are engineered for longevity. With proper care (cold wash, inside-out), prints maintain their vibrancy for 50+ washes. We back this with our Lifetime Color Guarantee.' },
    ],
  },
];

function FAQItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-obsidian-100/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gold-300/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-bold text-obsidian-900 pr-4 group-hover:text-gold-700 transition-colors">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-obsidian-400 text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_LUXURY }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm text-obsidian-400 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto pb-20"
    >
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'FAQ' },
      ]} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-16"
      >
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Support</span>
        <h1 className="text-4xl md:text-6xl font-black text-obsidian-900 tracking-tighter leading-[0.9] mb-6">
          Frequently Asked <span className="gradient-text-gold">Questions</span>
        </h1>
        <p className="text-base text-obsidian-400 leading-relaxed max-w-xl font-medium">
          Everything you need to know about our products, ordering, customization, and more.
        </p>
      </motion.div>

      <div className="space-y-12">
        {FAQ_SECTIONS.map((section, si) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.1, duration: 0.6 }}
          >
            <h2 className="text-lg font-black text-obsidian-900 mb-6 tracking-tight">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <FAQItem key={item.q} item={item} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Still have questions CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-10 rounded-[2rem] bg-obsidian-50 border border-obsidian-100/50 text-center"
      >
        <h3 className="text-xl font-black text-obsidian-900 mb-3">Still have questions?</h3>
        <p className="text-sm text-obsidian-400 mb-6">Our team is happy to help. Reach out anytime.</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-obsidian-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-obsidian-800 transition-all duration-500 shadow-luxury btn-liquid"
        >
          Contact Us →
        </Link>
      </motion.div>
    </motion.div>
  );
}
