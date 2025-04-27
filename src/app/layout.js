'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ClientProviders from '@/components/providers/ClientProviders';
import { usePathname } from 'next/navigation';

// Import the AuthProvider for the dashboard
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Check if the current path is dashboard
  const isDashboardPath = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {isDashboardPath ? (
            // Dashboard layout - without Header and Footer
            children
          ) : (
            // Main website layout with Header and Footer
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <ClientProviders>{children}</ClientProviders>
              </main>
              <Footer />
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}