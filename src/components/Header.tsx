import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, memo, useCallback } from 'react';

function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const navLinkClass = (path: string) => `
    px-4 py-2 rounded-lg transition-colors font-medium
    ${isActive(path)
      ? 'bg-green-600 text-white'
      : 'text-gray-700 hover:bg-gray-100'
    }
  `;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/esgreport logo-light-back copy.png" alt="ESG Report AI" className="h-12" />
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/esg-templates" className={navLinkClass('/esg-templates')}>
              ESG Templates
            </Link>
            <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>
              How It Works
            </Link>
            <Link to="/resources" className={navLinkClass('/resources')}>
              Resources
            </Link>
            <Link
              to="/admin/login"
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Login
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/esg-templates"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              ESG Templates
            </Link>
            <Link
              to="/how-it-works"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/resources"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/admin/login"
              className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default memo(Header);
