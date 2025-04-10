// src/components/providers/ClientProviders.js
'use client';

import { AnalyticsProvider } from '@/contexts/AnalyticsContext';

export default function ClientProviders({ children }) {
    return (
        <AnalyticsProvider>
            {children}
        </AnalyticsProvider>
    );
}