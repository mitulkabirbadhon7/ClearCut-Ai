import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LandingPage } from '@/pages/LandingPage';
import { FeaturesPage } from '@/pages/FeaturesPage';
import { PricingPage } from '@/pages/PricingPage';
import { ApiPage } from '@/pages/ApiPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { AuthPage } from '@/pages/AuthPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AdminPage } from '@/pages/AdminPage';
import { PaymentCallbackPage } from '@/pages/PaymentCallbackPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<string>('home');
  const { activeModal, setActiveModal } = useAppStore();
  const { initializeAuth } = useAuthStore();

  // Initialize Supabase Auth session on app launch
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Synchronize route with URL hash for clean address bar state and bookmarking
  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#', '') || 'home';
      const cleanRoute = fullHash.split('?')[0] || 'home';
      setActiveRoute(cleanRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    setActiveRoute(route);
    window.location.hash = route === 'home' ? '' : route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (activeRoute) {
      case 'features':
        return <FeaturesPage onNavigate={navigateTo} />;
      case 'pricing':
        return <PricingPage onNavigate={navigateTo} />;
      case 'api':
        return <ApiPage onNavigate={navigateTo} />;
      case 'terms':
        return <TermsPage onNavigate={navigateTo} />;
      case 'privacy':
        return <PrivacyPage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactPage onNavigate={navigateTo} />;
      case 'reset-password':
        return <ResetPasswordPage onNavigate={navigateTo} />;
      case 'auth':
      case 'login':
      case 'register':
        return <AuthPage onNavigate={navigateTo} />;
      case 'payment-callback':
        return <PaymentCallbackPage onNavigate={navigateTo} />;
      case 'admin':
        return (
          <ProtectedRoute onNavigate={navigateTo}>
            <AdminPage onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'dashboard':
        return (
          <ProtectedRoute onNavigate={navigateTo}>
            <DashboardPage onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'home':
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <MainLayout activeRoute={activeRoute} onNavigate={navigateTo}>
      {renderActivePage()}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={activeModal === 'auth'}
        onClose={() => setActiveModal(null)}
        onSuccess={() => navigateTo('dashboard')}
      />
    </MainLayout>
  );
}
