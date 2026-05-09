/**
 * Footer — Site-wide footer with brand info, navigation links, social, and newsletter.
 * Memoized — content is static and doesn't need re-renders.
 */

import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SOCIAL_LINKS = [
  { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/coded_clothing__?igsh=MTYxeHl1b2thYXYzZw==',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
];
const FOOTER_ATELIER_LINKS = [
  { label: 'Our Story', to: '/about' },
  { label: 'The Collection', to: '/collection' },
  { label: 'Contact Us', to: '/contact' },
];
const FOOTER_SUPPORT_LINKS = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Shipping & Delivery', to: '/shipping' },
  { label: 'Returns & Refunds', to: '/returns' },
];
const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
];

/** Newsletter email capture */
function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // In production, send to your email service. For now, open WhatsApp.
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (phoneNumber) {
      const text = `*Newsletter Signup*\nEmail: ${email}`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    }
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h4 className="text-xs font-black text-obsidian-900 uppercase tracking-[0.3em] mb-1">Stay in the Loop</h4>
        <p className="text-xs text-obsidian-400">New drops, exclusive offers, and style inspiration via WhatsApp.</p>
      </div>
      {submitted ? (
        <p className="text-sm font-bold text-gold-600">Thanks for subscribing! ✓</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 md:w-64 px-4 py-3 rounded-xl border border-obsidian-100 bg-obsidian-50/50 text-sm font-medium text-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all"
            aria-label="Email for newsletter"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="px-6 py-3 bg-obsidian-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-obsidian-800 transition-all shadow-lg"
          >
            Subscribe
          </motion.button>
        </form>
      )}
    </div>
  );
}

const Footer = memo(function Footer() {
  return (
    <footer className="relative mt-32 border-t border-obsidian-100/50 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
      
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-gold-200/12 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                <img src="/images/codedclothinglogo.jpg" alt="Coded Clothing Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-sm font-bold text-obsidian-900 block">CODED CLOTHING</span>
                <span className="text-2xs font-medium text-obsidian-400 tracking-[0.3em] uppercase">Premium Atelier Est. 2024</span>
              </div>
            </div>
            <p className="text-sm text-obsidian-400 leading-relaxed max-w-sm mb-8">
              Crafting premium custom apparel with precision engineering and artistic vision. 
              Where technology meets craftsmanship. Every thread tells a story.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <motion.a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-xl bg-obsidian-50 flex items-center justify-center text-obsidian-400 hover:bg-obsidian-900 hover:text-gold-500 transition-all duration-300 border border-obsidian-100 hover:border-obsidian-800 hover:shadow-lg hover:shadow-obsidian-900/20"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Atelier Links */}
          <div>
            <h4 className="text-xs font-black text-obsidian-900 uppercase tracking-[0.3em] mb-5">Atelier</h4>
            <ul className="space-y-3">
              {FOOTER_ATELIER_LINKS.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-obsidian-400 hover:text-gold-600 transition-colors duration-300 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-black text-obsidian-900 uppercase tracking-[0.3em] mb-5">Legal</h4>
            <ul className="space-y-3">
              {FOOTER_LEGAL_LINKS.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-obsidian-400 hover:text-gold-600 transition-colors duration-300 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-black text-obsidian-900 uppercase tracking-[0.3em] mb-5">Support</h4>
            <ul className="space-y-3">
              {FOOTER_SUPPORT_LINKS.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-obsidian-400 hover:text-gold-600 transition-colors duration-300 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="section-divider-animated mt-16 mb-8" />

        {/* Newsletter Signup */}
        <NewsletterSignup />

        <div className="section-divider-animated mt-8 mb-8" />
        
        {/* Copyright Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs tracking-[0.2em] text-obsidian-300 uppercase">
            &copy; {new Date().getFullYear()} Coded Clothing. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-gold-400" />
            <p className="text-xs tracking-[0.15em] text-obsidian-300 uppercase">
              Handcrafted with precision & passion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
