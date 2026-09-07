import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminListingsPage } from './pages/admin/AdminListingsPage';
import { AdminPropertyFormPage } from './pages/admin/AdminPropertyFormPage';

// Protected Route Wrapper Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; onNavigate: (path: string) => void }> = ({ children, onNavigate }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      onNavigate('/admin/login');
    }
  }, [isAuthenticated, loading, onNavigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#12372A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (slug: string) => {
    navigate(`/biens/${slug}`);
  };

  // Route matching logic
  const renderView = () => {
    // Detail page: /biens/:slug
    if (currentPath.startsWith('/biens/') && currentPath !== '/biens/nouveau') {
      const slug = currentPath.replace('/biens/', '');
      return <PropertyDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Admin edit page: /admin/biens/:id/modifier
    if (currentPath.startsWith('/admin/biens/') && currentPath.endsWith('/modifier')) {
      const id = currentPath.replace('/admin/biens/', '').replace('/modifier', '');
      return (
        <ProtectedRoute onNavigate={navigate}>
          <AdminPropertyFormPage propertyId={id} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} onSelectProperty={handleSelectProperty} />;
      case '/biens':
        return <ListingsPage onSelectProperty={handleSelectProperty} />;
      case '/a-propos':
        return <AboutPage onNavigate={navigate} />;
      case '/services':
        return <ServicesPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage />;
      
      // Admin Routes
      case '/admin/login':
        return <AdminLoginPage onNavigate={navigate} />;
      case '/admin':
        return (
          <ProtectedRoute onNavigate={navigate}>
            <AdminDashboardPage onNavigate={navigate} onSelectProperty={handleSelectProperty} />
          </ProtectedRoute>
        );
      case '/admin/biens':
        return (
          <ProtectedRoute onNavigate={navigate}>
            <AdminListingsPage onNavigate={navigate} onSelectProperty={handleSelectProperty} />
          </ProtectedRoute>
        );
      case '/admin/biens/nouveau':
        return (
          <ProtectedRoute onNavigate={navigate}>
            <AdminPropertyFormPage onNavigate={navigate} />
          </ProtectedRoute>
        );
      
      default:
        return <HomePage onNavigate={navigate} onSelectProperty={handleSelectProperty} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      <Footer onNavigate={navigate} />

      {/* Floating WhatsApp on all pages */}
      <FloatingWhatsApp />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
