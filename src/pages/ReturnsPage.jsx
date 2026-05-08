/**
 * ReturnsPage.jsx — Return & Refund Policy
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'Custom Products',
    content: `Since all Coded Clothing products are custom-made to your specifications (color, size, and custom logo placement), we generally cannot accept returns for change of mind. However, we stand behind the quality of our work.`
  },
  {
    title: 'Eligible for Return / Replacement',
    content: `You may request a return or replacement within 7 days of delivery if:

• **Manufacturing Defect**: Stitching defects, holes, or other production quality issues
• **Wrong Product**: You received a different color or size than what was ordered
• **Print Quality Issue**: The printed design is significantly different from what was approved in the design studio (blurred, misaligned, or color significantly off)
• **Damage in Transit**: The product arrived damaged due to shipping`
  },
  {
    title: 'Not Eligible for Return',
    content: `Returns are not accepted for:

• Change of mind or size preference (please refer to our size guide before ordering)
• Minor color variations between screen display and actual product (due to screen calibration)
• Designs that were approved by you in the customization studio
• Products that have been worn, washed, or altered after delivery`
  },
  {
    title: 'How to Request a Return',
    content: `1. Contact us via WhatsApp within 7 days of delivery
2. Share clear photos of the issue (defect, damage, or wrong product)
3. Our team will review and respond within 24 hours
4. If approved, we will arrange for pickup or provide shipping instructions
5. A replacement will be shipped within 5–7 business days of receiving the return`
  },
  {
    title: 'Refund Policy',
    content: `• **Replacement First**: We prefer to send a replacement rather than a refund, to ensure you get the product you wanted.
• **Full Refund**: If we are unable to fulfill a replacement, a full refund will be issued to your original payment method within 7–10 business days.
• **Partial Refund**: For minor issues that don't warrant a full return, we may offer a partial refund or store credit at our discretion.`
  },
  {
    title: 'Cancellation',
    content: `• Orders can be cancelled within 2 hours of placement via WhatsApp.
• After 2 hours, production may have started and cancellation is not guaranteed.
• If cancellation is approved, a full refund will be issued.`
  },
];

export default function ReturnsPage() {
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
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Policy</span>
        <h1 className="text-4xl md:text-5xl font-black text-obsidian-900 tracking-tighter mb-4">Returns & Refunds</h1>
        <p className="text-sm text-obsidian-400 font-medium">Last updated: May 2026</p>
        <p className="text-sm text-obsidian-400 leading-relaxed mt-4 max-w-xl">
          We want you to love your Coded Clothing product. If something isn&rsquo;t right, here&rsquo;s how we make it right.
        </p>
      </motion.div>

      {/* Quick summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-gold-50/50 border border-gold-200/30 mb-12 flex items-start gap-3"
      >
        <div className="w-2 h-2 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
        <p className="text-sm text-gold-800 font-medium leading-relaxed">
          <strong>Quick summary:</strong> Defective, damaged, or wrong products → full replacement or refund within 7 days. Custom designs approved by you → not eligible for return.
        </p>
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
