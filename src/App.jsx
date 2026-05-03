import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/error/ErrorBoundary';
import ToastContainer from './features/notifications/components/ToastContainer';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomizePage from './pages/CustomizePage';

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
            <Routes>
              <Route path="/" element={<CollectionPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/customize/:id" element={<CustomizePage />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
