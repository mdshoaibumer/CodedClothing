import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/error/ErrorBoundary';
import ToastContainer from './features/notifications/components/ToastContainer';

// Lazy load pages for code splitting
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CustomizePage = lazy(() => import('./pages/CustomizePage'));

const Header = () => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
      <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">
        Coded Clothing
      </Link>

      <span className="text-sm text-gray-500 hidden md:block">
        Premium Custom T-Shirts
      </span>
    </div>
  </header>
);

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Header />
          <main className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<CollectionPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/customize/:id" element={<CustomizePage />} />
                <Route path="*" element={
                  <div className="text-center py-20">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">404</h2>
                    <p className="text-gray-500 mb-6">Page not found</p>
                    <Link to="/" className="text-blue-600 hover:underline font-bold uppercase tracking-widest text-xs">
                      Return to Collection
                    </Link>
                  </div>
                } />
              </Routes>
            </Suspense>
          </main>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
