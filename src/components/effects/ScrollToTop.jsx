/**
 * ScrollToTop.jsx — Automatic scroll restoration on route changes
 *
 * Ensures the page scrolls to the top whenever the route changes.
 * This is essential for single-page applications to provide expected navigation behavior.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}