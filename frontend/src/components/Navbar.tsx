import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Crown, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                🌐 Web Trends Timeline
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/timeline"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              타임라인
            </Link>
            <Link
              to="/compare"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              비교 분석
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              가격 정책
            </Link>

            {isAuthenticated ? (
              <>
                {user?.subscription_status === 'premium' && (
                  <span className="premium-badge">
                    <Crown className="w-3 h-3 mr-1" />
                    프리미엄
                  </span>
                )}
                <Link
                  to="/account"
                  className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                >
                  <User className="w-4 h-4 mr-1" />
                  {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">
                  로그인
                </Link>
                <Link to="/register" className="btn-primary">
                  시작하기
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/timeline"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              타임라인
            </Link>
            <Link
              to="/compare"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              비교 분석
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              가격 정책
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  내 계정
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-primary-600 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
