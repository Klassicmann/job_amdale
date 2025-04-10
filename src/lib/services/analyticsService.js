// src/lib/services/analyticsService.js
import { addDocument, queryDocuments } from './firestore';
import { analyticsEventModel } from '@/lib/models/analyticsEvent';

const COLLECTION_NAME = 'analytics';

// Track an event
export const trackEvent = async (sessionId, eventType, eventData) => {
    const event = analyticsEventModel.create(sessionId, eventType, eventData);
    return addDocument(COLLECTION_NAME, event);
};

// Get events by session ID
export const getEventsBySession = async (sessionId) => {
    const conditions = [
        { field: 'sessionId', operator: '==', value: sessionId }
    ];

    return queryDocuments(COLLECTION_NAME, conditions, { field: 'timestamp', direction: 'asc' });
};

// Get events by type
export const getEventsByType = async (eventType, limit = 100) => {
    const conditions = [
        { field: 'eventType', operator: '==', value: eventType }
    ];

    return queryDocuments(COLLECTION_NAME, conditions, { field: 'timestamp', direction: 'desc' }, limit);
};

// Get event counts by type
export const getEventCounts = async (timeframe = 'day') => {
    // In a real app, you would use Firestore aggregation or create a Cloud Function
    // This is a simplified version
    const startDate = new Date();

    if (timeframe === 'day') {
        startDate.setDate(startDate.getDate() - 1);
    } else if (timeframe === 'week') {
        startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const conditions = [
        { field: 'timestamp', operator: '>=', value: startDate.toISOString() }
    ];

    const events = await queryDocuments(COLLECTION_NAME, conditions);

    // Group by event type
    return events.reduce((acc, event) => {
        const { eventType } = event;
        acc[eventType] = (acc[eventType] || 0) + 1;
        return acc;
    }, {});
};