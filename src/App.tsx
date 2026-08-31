import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DesignSystemShowcase } from '@/components/ui/DesignSystemShowcase';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('home');

  return (
    <MainLayout activeRoute={activeRoute} onNavigate={(route) => setActiveRoute(route)}>
      <DesignSystemShowcase />
    </MainLayout>
  );
}
