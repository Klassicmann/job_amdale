'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const AnalyticsContext = createContext();

// Custom hook to use the analytics context
export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};

// Provider component
export const AnalyticsProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState(null);
    const [userProfile, setUserProfile] = useState({});

    // Initialize session on mount
    useEffect(() => {
        let existingSessionId = localStorage.getItem('sessionId');
        const sessionTimestamp = localStorage.getItem('sessionTimestamp');

        // Check if session is expired (24 hours) or doesn't exist
        const isSessionExpired = !sessionTimestamp ||
            (Date.now() - parseInt(sessionTimestamp, 10)) > 24 * 60 * 60 * 1000;

        if (!existingSessionId || isSessionExpired) {
            existingSessionId = uuidv4();
            localStorage.setItem('sessionId', existingSessionId);
            localStorage.setItem('sessionTimestamp', Date.now().toString());
        }

        setSessionId(existingSessionId);

        // Track session start
        trackEventInternal('session_start', {
            referrer: document.referrer || 'direct'
        });

        // Listen for page unload to track session end
        const handleUnload = () => {
            trackEventInternal('session_end', {
                duration: Date.now() - parseInt(localStorage.getItem('sessionTimestamp'), 10)
            });
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    // Function to update user profile data
    const updateUserProfile = (data) => {
        setUserProfile(prevProfile => ({
            ...prevProfile,
            ...data
        }));
    };

    // Internal track event function
    const trackEventInternal = (eventType, eventData = {}) => {
        if (!sessionId) return;

        const event = {
            sessionId,
            eventType,
            eventData: {
                ...eventData,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            }
        };

        // For now, we'll just log the events to the console
        // In a real implementation, you would send this to your backend
        console.log('Analytics Event:', event);

        // In the future, this is where you would call your backend API
        // Example:
        // fetch('/api/analytics/track', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(event)
        // });
    };

    // Public track event function
    const trackEvent = (eventType, eventData = {}) => {
        trackEventInternal(eventType, eventData);
    };

    // Create the context value
    const contextValue = {
        sessionId,
        userProfile,
        updateUserProfile,
        trackEvent
    };

    return (
        <AnalyticsContext.Provider value={contextValue}>
            {children}
        </AnalyticsContext.Provider>
    );
};