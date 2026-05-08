/**
 * PrivacyPage.jsx — Privacy Policy
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb';

const SECTIONS = [
  {
    title: 'Information We Collect',
    content: `When you use Coded Clothing, we may collect the following information:
    
• **Personal Information**: Name, email address, phone number, and shipping address when you place an order via WhatsApp.
• **Design Data**: Logos and images you upload to our design studio are temporarily processed for preview purposes. We do not permanently store your uploaded designs on our servers unless you explicitly request it.
• **Usage Data**: We collect anonymized analytics data including pages visited, time spent, and device type to improve our website experience.
• **Cookies**: We use essential cookies to remember your session and design preferences. No third-party advertising cookies are used.`
  },
  {
    title: 'How We Use Your Information',
    content: `Your information is used exclusively for:

• Processing and fulfilling your orders
• Communicating about your order status
• Improving our website and design studio
• Sending promotional emails (only with your explicit consent)

We never sell, rent, or trade your personal information to third parties.`
  },
  {
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your data:

• All data transmission is encrypted via SSL/TLS
• Uploaded images are processed client-side where possible
• Payment information is never stored on our servers (orders are processed via WhatsApp)
• We regularly audit our systems for vulnerabilities`
  },
  {
    title: 'Your Rights',
    content: `You have the right to:

• **Access**: Request a copy of the personal data we hold about you
• **Correction**: Ask us to correct any inaccurate data
• **Deletion**: Request that we delete your personal data
• **Opt-out**: Unsubscribe from marketing communications at any time

To exercise any of these rights, contact us at hello@codedclothing.com.`
  },
  {
    title: 'Third-Party Services',
    content: `We use the following third-party services:

• **Cloudinary**: For image processing and optimization (logos uploaded to the design studio)
• **WhatsApp (Meta)**: For order communication
• **Google Fonts**: For typography (subject to Google's privacy policy)

Each service has its own privacy policy governing how they handle data.`
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the new policy.`
  },
];

export default function PrivacyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto pb-20"
    >
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Privacy Policy' },
      ]} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12">
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Legal</span>
        <h1 className="text-4xl md:text-5xl font-black text-obsidian-900 tracking-tighter mb-4">Privacy Policy</h1>
        <p className="text-sm text-obsidian-400 font-medium">Last updated: May 2026</p>
        <p className="text-sm text-obsidian-400 leading-relaxed mt-4 max-w-xl">
          At Coded Clothing, your privacy matters. This policy explains what data we collect, how we use it, and your rights.
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
