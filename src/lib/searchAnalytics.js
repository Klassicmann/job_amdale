// src/lib/searchAnalytics.js
import { db } from './firebase';
import {
    collection,
    doc,
    increment,
    setDoc,
    updateDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';

const SEARCH_ANALYTICS_COLLECTION = 'searchAnalytics';

/**
 * Track a search term by incrementing its counter in Firestore
 * @param {string} searchTerm - The search term entered by the user
 */
export async function trackSearchTerm(searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
        return;
    }

    // Normalize the search term (lowercase, trim)
    const normalizedTerm = searchTerm.toLowerCase().trim();

    try {
        // Create a document ID based on the search term
        const docRef = doc(db, SEARCH_ANALYTICS_COLLECTION, normalizedTerm);

        try {
            // Try to update the counter if the document exists
            await updateDoc(docRef, {
                count: increment(1),
                lastSearched: serverTimestamp()
            });
        } catch (error) {
            // If document doesn't exist, create it with count = 1
            await setDoc(docRef, {
                term: normalizedTerm,
                count: 1,
                firstSearched: serverTimestamp(),
                lastSearched: serverTimestamp()
            });
        }

        console.log(`Search term tracked: ${normalizedTerm}`);
    } catch (error) {
        console.error('Error tracking search term:', error);
    }
}

/**
 * Get the most popular search terms
 * @param {number} limitCount - Maximum number of terms to return
 * @returns {Array} Array of search terms with their counts
 */
export async function getPopularSearchTerms(limitCount = 10) {
    try {
        const q = query(
            collection(db, SEARCH_ANALYTICS_COLLECTION),
            orderBy('count', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            term: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting popular search terms:', error);
        return [];
    }
}