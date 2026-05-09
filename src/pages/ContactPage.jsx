/**
 * ContactPage.jsx — Contact Information & Form
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb';

const EASE_LUXURY = [0.16, 1, 0.3, 1];

const CONTACT_METHODS = [
  { icon: '✉', label: 'Email', value: 'hello@codedclothing.com', href: 'mailto:hello@codedclothing.com' },
  { icon: '◈', label: 'WhatsApp', value: 'Chat with us', href: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ''}` },
  { icon: '◇', label: 'Instagram', value: '@coded_clothing__', href: 'https://www.instagram.com/coded_clothing__?igsh=MTYxeHl1b2thYXYzZw==' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build WhatsApp message from form
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const text = `*Contact Form — Coded Clothing*\n\n` +
      `*Name:* ${form.name}\n` +
      `*Email:* ${form.email}\n` +
      `*Subject:* ${form.subject}\n` +
      `*Message:* ${form.message}`;
    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto pb-20"
    >
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Contact' },
      ]} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-16"
      >
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Get In Touch</span>
        <h1 className="text-4xl md:text-6xl font-black text-obsidian-900 tracking-tighter leading-[0.9] mb-6">
          Let&rsquo;s <span className="gradient-text-gold">Talk</span>
        </h1>
        <p className="text-base text-obsidian-400 leading-relaxed max-w-xl font-medium">
          Have a question about an order, need bulk pricing, or want to collaborate? We&rsquo;d love to hear from you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {CONTACT_METHODS.map((method, i) => (
          <motion.a
            key={method.label}
            href={method.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="p-8 rounded-2xl bg-white border border-obsidian-100/50 hover:border-gold-300/50 hover:shadow-luxury transition-all duration-500 group text-center block"
          >
            <span className="text-3xl text-gold-500 block mb-3">{method.icon}</span>
            <h3 className="text-sm font-bold text-obsidian-900 mb-1 group-hover:text-gold-700 transition-colors">{method.label}</h3>
            <p className="text-xs text-obsidian-400">{method.value}</p>
          </motion.a>
        ))}
      </div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 md:p-12 rounded-[2rem] bg-white border border-obsidian-100/50 shadow-luxury"
      >
        {submitted ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">✓</span>
            <h3 className="text-2xl font-black text-obsidian-900 mb-2">Message Sent!</h3>
            <p className="text-sm text-obsidian-400 mb-6">We&rsquo;ll get back to you within 24 hours.</p>
            <button onClick={() => setSubmitted(false)} className="text-gold-600 font-bold text-xs uppercase tracking-widest hover:text-gold-700">
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-black text-obsidian-400 uppercase tracking-[0.2em] mb-2">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-obsidian-100 bg-obsidian-50/50 text-sm font-medium text-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-black text-obsidian-400 uppercase tracking-[0.2em] mb-2">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-obsidian-100 bg-obsidian-50/50 text-sm font-medium text-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-xs font-black text-obsidian-400 uppercase tracking-[0.2em] mb-2">Subject</label>
              <input
                id="contact-subject"
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-obsidian-100 bg-obsidian-50/50 text-sm font-medium text-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-xs font-black text-obsidian-400 uppercase tracking-[0.2em] mb-2">Message</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-obsidian-100 bg-obsidian-50/50 text-sm font-medium text-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-12 py-5 bg-obsidian-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-obsidian-800 transition-all duration-500 shadow-luxury hover:shadow-luxury-hover btn-liquid relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-600/0 via-gold-600/20 to-gold-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10">Send Message</span>
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
