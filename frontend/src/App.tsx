import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './store/useAuthStore';

// Components (Eager-loaded - Always visible)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPrompt from './components/InstallPrompt';
import ErrorBoundary from './components/ErrorBoundary';
import OnboardingTour, { useOnboarding } from './components/OnboardingTour';
import { LoadingFallback } from './components/molecules/LoadingFallback';

// Pages (Lazy-loaded - Code splitting)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { isAuthenticated } = useAuthStore();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />

          {/* Onboarding Tour for first-time authenticated users */}
          {showOnboarding && isAuthenticated && (
            <OnboardingTour
              onComplete={completeOnboarding}
              onSkip={skipOnboarding}
            />
          )}

          <Suspense fallback={<LoadingFallback />}>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* Legal & Support Pages */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/refund" element={<RefundPolicyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Routes */}
            <Route
              path="/timeline"
              element={
                <ProtectedRoute>
                  <TimelinePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <ComparePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <BookmarksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <InsightsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccessPage />
                </ProtectedRoute>
              }
            />

              {/* 404 - Must be last */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          <Footer />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <InstallPrompt />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
