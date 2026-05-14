/**
 * CartPage.jsx — Shopping Cart & WhatsApp Checkout
 * 
 * Displays all cart items with quantity controls,
 * order summary, and WhatsApp checkout button.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../features/cart/useCartStore';
import useToastStore from '../features/notifications/store/useToastStore';
import Breadcrumb from '../components/ui/Breadcrumb';
import { CATEGORIES } from '../data/products';

const EASE_LUXURY = [0.16, 1, 0.3, 1];

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems, getWhatsAppMessage } = useCartStore();
  const addToast = useToastStore((state) => state.addToast);
  const [confirmClear, setConfirmClear] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingFree = totalPrice >= 999;
  const shippingCost = shippingFree ? 0 : (totalItems > 0 ? 49 : 0);
  const grandTotal = totalPrice + shippingCost;

  const handleWhatsAppCheckout = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const message = getWhatsAppMessage();
    if (!phoneNumber) {
      // Fallback: copy order to clipboard so user can share via email/WhatsApp manually
      navigator.clipboard.writeText(message).then(() => {
        addToast('Order details copied to clipboard! Share via WhatsApp or email to complete your order.', 'success', 6000);
      }).catch(() => {
        addToast('WhatsApp ordering is currently unavailable. Please email hello@codedclothing.com', 'error', 5000);
      });
      return;
    }
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleClearCart = () => {
    clearCart();
    setConfirmClear(false);
    addToast('Cart cleared', 'info');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Cart' },
      ]} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="mb-12"
      >
        <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-4">Your Cart</span>
        <h1 className="text-4xl md:text-6xl font-black text-obsidian-900 tracking-tighter leading-[0.9] mb-4">
          Shopping <span className="gradient-text-gold">Bag</span>
        </h1>
        <p className="text-sm text-obsidian-400 font-medium">
          {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your bag`}
        </p>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white rounded-[2rem] border border-obsidian-100/50 shadow-soft"
        >
          <span className="text-6xl block mb-6">🛍️</span>
          <h3 className="text-xl font-black text-obsidian-900 mb-3">Your bag is empty</h3>
          <p className="text-sm text-obsidian-400 mb-8 max-w-sm mx-auto">
            Explore our collection of premium Egyptian cotton tees and find your perfect fit.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-obsidian-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-obsidian-800 transition-all duration-500 shadow-luxury btn-liquid"
          >
            Explore Collection →
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex gap-5 p-5 md:p-6 bg-white rounded-2xl border border-obsidian-100/50 shadow-soft group hover:shadow-luxury transition-shadow duration-500"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                    <div className="w-20 h-24 md:w-24 md:h-28 rounded-xl bg-obsidian-50 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.color}
                        className="w-full h-full object-contain mix-blend-multiply p-2"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/product/${item.productId}`} className="hover:text-gold-600 transition-colors">
                          <h3 className="text-sm font-bold text-obsidian-900 tracking-tight">{CATEGORIES.find(c => c.slug === item.category)?.label || 'Premium Cotton Tee'}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3.5 h-3.5 rounded-full ring-1 ring-obsidian-200" style={{ backgroundColor: item.hex }} />
                          <span className="text-xs text-obsidian-400 font-medium">{item.color}</span>
                          <span className="text-obsidian-200">•</span>
                          <span className="text-xs text-obsidian-400 font-medium">Size {item.size}</span>
                        </div>
                        {item.hasCustomDesign && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-gold-50 text-gold-700 text-2xs font-bold rounded-md uppercase tracking-wider">
                            🎨 Custom Design
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.id);
                          addToast('Item removed from cart', 'info');
                        }}
                        className="text-obsidian-300 hover:text-red-500 transition-colors p-1"
                        aria-label={`Remove ${item.color} from cart`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeItem(item.id);
                              addToast('Item removed from cart', 'info');
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-lg border border-obsidian-100 flex items-center justify-center text-obsidian-400 hover:border-gold-400 hover:text-gold-600 transition-all text-sm font-bold"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-black text-obsidian-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-obsidian-100 flex items-center justify-center text-obsidian-400 hover:border-gold-400 hover:text-gold-600 transition-all text-sm font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-base font-black text-obsidian-900">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <div className="flex justify-end pt-2">
              {confirmClear ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-obsidian-400 font-medium">Clear all items?</span>
                  <button onClick={handleClearCart} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider">Yes, Clear</button>
                  <button onClick={() => setConfirmClear(false)} className="text-xs font-bold text-obsidian-400 hover:text-obsidian-600 uppercase tracking-wider">Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-xs font-bold text-obsidian-300 hover:text-red-500 uppercase tracking-wider transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-8 rounded-[2rem] border border-obsidian-100/50 shadow-luxury space-y-6">
              <h3 className="text-xs font-black text-obsidian-900 uppercase tracking-[0.2em]">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-obsidian-400">Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-obsidian-900">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian-400">Shipping</span>
                  <span className={`font-bold ${shippingFree ? 'text-green-600' : 'text-obsidian-900'}`}>
                    {shippingFree ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                {!shippingFree && totalPrice > 0 && (
                  <div className="bg-gold-50/50 px-3 py-2 rounded-lg">
                    <p className="text-2xs text-gold-700 font-medium">
                      Add ₹{999 - totalPrice} more for free shipping
                    </p>
                    <div className="mt-1.5 h-1.5 bg-gold-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (totalPrice / 999) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="h-px bg-obsidian-100" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-obsidian-900">Total</span>
                  <span className="font-black text-lg gradient-text-gold">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppCheckout}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-black text-sm uppercase tracking-[0.15em] shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] transition-all duration-500 relative overflow-hidden group flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="relative z-10">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="relative z-10">Checkout via WhatsApp</span>
              </motion.button>

              <p className="text-2xs text-obsidian-300 text-center leading-relaxed">
                You'll be redirected to WhatsApp to confirm your order. Payment details will be shared there.
              </p>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                {['🔒 Secure', '🚚 Fast Ship', '🔄 7-Day Returns'].map((badge) => (
                  <span key={badge} className="text-2xs font-bold text-obsidian-300 uppercase tracking-wider">{badge}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
