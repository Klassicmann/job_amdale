'use client';
// src/app/dashboard/layout.js
import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/common/Header';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      {isLoginPage ? (
        // Don't wrap login page with ProtectedRoute
        children
      ) : (
        // Wrap all other dashboard pages with ProtectedRoute
        <>
          <Header />
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </>
      )}
    </AuthProvider>
  );
}