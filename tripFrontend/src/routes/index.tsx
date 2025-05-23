import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load các component
const AccountPage = lazy(() => import('../pages/AccountPage'));
// ... các import khác

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <Routes>
        {/* ... các route khác */}
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 