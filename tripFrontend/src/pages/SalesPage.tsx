import React from 'react';
import SalesPageComponent from '@/features/sales/components';
import { MainLayout } from '@/layouts';

const SalesPage: React.FC = () => {
  return (
    <MainLayout>
      <SalesPageComponent />
    </MainLayout>
  );
};

export default SalesPage; 