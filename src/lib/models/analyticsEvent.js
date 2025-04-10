// src/lib/models/analyticsEvent.js
export const analyticsEventModel = {
    // Event types
    eventTypes: {
        SEARCH: 'search',
        VIEW_JOB: 'view_job',
        APPLY_CLICK: 'apply_click',
        FILTER_CHANGE: 'filter_change',
        PAGE_VIEW: 'page_view'
    },

    // Create a new analytics event
    create: (sessionId, eventType, eventData) => {
        return {
            sessionId,
            eventType,
            eventData,
            timestamp: new Date().toISOString()
        };
    }
};