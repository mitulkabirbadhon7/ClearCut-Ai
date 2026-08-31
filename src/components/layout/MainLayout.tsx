import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface MainLayoutProps {
  children: React.ReactNode;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeRoute,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between selection:bg-brand-purple selection:text-white">
      <Navbar activeRoute={activeRoute} onNavigate={onNavigate} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
