import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-green-600">ESG</span>
              <span className="text-gray-900">Report</span>
            </span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/templates"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              ESG Templates
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/resources"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Resources
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
