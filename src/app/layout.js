// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ClientProviders from '@/components/providers/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Back-to-Work Angels | Find Your Dream Job',
  description: 'Back-to-Work Angels helps connect talented professionals with top employers around the world.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}