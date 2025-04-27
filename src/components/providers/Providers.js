'use client';

import { AnalyticsProvider } from '@/contexts/AnalyticsContext';

export default function Providers({ children }) {
  return (
    <AnalyticsProvider>
      {children}
    </AnalyticsProvider>
  );
}
