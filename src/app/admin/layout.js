'use client';
// src/app/dashboard/layout.js
'use client';
import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar'; // Import the new Sidebar

export default function AdminLayout({ children }) { // Renamed for clarity
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      {isLoginPage ? (
        // Render only the login page content without sidebar/protection
        children
      ) : (
        // Wrap all other admin pages with ProtectedRoute and include Sidebar
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 ml-64 overflow-y-auto"> {/* Add margin-left to account for sidebar width */}
            <ProtectedRoute>
              {/* Add padding or container here if needed for content spacing */}
              <div className="p-6"> {/* Example padding */}
                {children}
              </div>
            </ProtectedRoute>
          </main>
        </div>
      )}
    </AuthProvider>
  );
}
