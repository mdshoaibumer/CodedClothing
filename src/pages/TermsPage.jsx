/**
 * TermsPage.jsx — Terms of Service
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using the Coded Clothing website (codedclothing.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.`
  },
  {
    title: '2. Products & Pricing',
    content: `• All products are custom-made to order. Prices are listed in Indian Rupees (INR) and include GST where applicable.
• Customization (logo placement) is included in the listed price.
• We reserve the right to update pricing at any time. The price at the time of order placement will be honored.
• Product colors may vary slightly from what appears on screen due to monitor calibration differences.`
  },
  {
    title: '3. Orders & Payment',
    content: `• Orders are placed via WhatsApp. Once you confirm your order through WhatsApp, it is considered placed.
• Payment details will be shared via WhatsApp at the time of order confirmation.
• We reserve the right to refuse or cancel any order for any reason, including suspected fraud.`
  },
  {
    title: '4. Custom Design Policy',
    content: `• You retain ownership of any logos or artwork you upload to our design studio.
• By uploading content, you confirm that you have the legal right to use it and that it does not infringe on any third-party intellectual property.
• We reserve the right to refuse to print designs that contain offensive, illegal, or copyrighted material.
• Uploaded images are processed temporarily and are not stored permanently without your consent.`
  },
  {
    title: '5. Shipping & Delivery',
    content: `• We offer express shipping across India. Typical delivery times are 3–7 business days.
• Shipping charges, if applicable, will be communicated at the time of order.
• Risk of loss passes to you upon delivery to the carrier.
• We are not responsible for delays caused by the shipping carrier or customs.`
  },
  {
    title: '6. Intellectual Property',
    content: `• The Coded Clothing brand, logo, website design, and all original content are our intellectual property.
• You may not reproduce, distribute, or create derivative works from our content without written permission.
• User-generated designs remain the property of their creators.`
  },
  {
    title: '7. Limitation of Liability',
    content: `• Coded Clothing is provided "as is." We make no warranties, express or implied, regarding the website or products.
• Our liability is limited to the purchase price of the product in question.
• We are not liable for indirect, incidental, or consequential damages.`
  },
  {
    title: '8. Contact',
    content: `For questions about these terms, contact us at hello@codedclothing.com or reach out via WhatsApp.`
  },
];

export default function TermsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto pb-20"
    >
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-obsidian-400 hover:text-obsidian-900 transition-colors mb-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Collection
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12">
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Legal</span>
        <h1 className="text-4xl md:text-5xl font-black text-obsidian-900 tracking-tighter mb-4">Terms of Service</h1>
        <p className="text-sm text-obsidian-400 font-medium">Last updated: May 2026</p>
      </motion.div>

      <div className="space-y-10">
        {SECTIONS.map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <h2 className="text-lg font-bold text-obsidian-900 mb-3">{section.title}</h2>
            <div className="text-sm text-obsidian-500 leading-relaxed whitespace-pre-line">{section.content}</div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}
