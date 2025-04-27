// src/lib/services/firestore.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Generic function to get a collection reference
export const getCollectionRef = (collectionName) => {
    return collection(db, collectionName);
};

// Generic function to get a document reference
export const getDocRef = (collectionName, id) => {
    return doc(db, collectionName, id);
};

// Add a document to a collection
export const addDocument = async (collectionName, data) => {
    const collectionRef = getCollectionRef(collectionName);
    const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
};

// Get a document by ID
export const getDocument = async (collectionName, id) => {
    const docRef = getDocRef(collectionName, id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
        return null;
    }

    return { id: docSnapshot.id, ...docSnapshot.data() };
};

// Update a document
export const updateDocument = async (collectionName, id, data) => {
    const docRef = getDocRef(collectionName, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
    return { id, ...data };
};

// Delete a document
export const deleteDocument = async (collectionName, id) => {
    const docRef = getDocRef(collectionName, id);
    await deleteDoc(docRef);
    return id;
};

// Query documents
export const queryDocuments = async (collectionName, conditions = [], sortBy = null, limitTo = null) => {
    console.log(`Executing query on collection: ${collectionName}`);
    console.log('Query conditions:', JSON.stringify(conditions, null, 2));
    
    let q = collection(db, collectionName);

    // Add where conditions
    if (conditions && conditions.length > 0) {
        try {
            // Limit to max 1 array-contains-any condition as Firestore only allows one
            let hasArrayContainsAny = false;
            
            conditions.forEach(condition => {
                console.log(`Adding condition: field=${condition.field}, operator=${condition.operator}, value=`, condition.value);
                
                // Skip additional array-contains-any conditions
                if (condition.operator === 'array-contains-any') {
                    if (hasArrayContainsAny) {
                        console.warn('Skipping additional array-contains-any condition as Firestore only allows one');
                        return;
                    }
                    hasArrayContainsAny = true;
                }
                
                q = query(q, where(condition.field, condition.operator, condition.value));
            });
        } catch (error) {
            console.error('Error adding query conditions:', error);
            throw error;
        }
    }

    // Add orderBy
    if (sortBy) {
        console.log(`Adding orderBy: ${sortBy.field} ${sortBy.direction || 'asc'}`);
        q = query(q, orderBy(sortBy.field, sortBy.direction || 'asc'));
    }

    // Add limit
    if (limitTo) {
        console.log(`Adding limit: ${limitTo}`);
        q = query(q, limit(limitTo));
    }

    try {
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Query returned ${results.length} results`);
        return results;
    } catch (error) {
        // Handle index errors with a more helpful message
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
            console.error('Firestore index error. Please create the required index:', error);
            console.log('You can create the index by visiting the URL in the error message above.');
            
            // Fallback to a simpler query
            console.log('Attempting fallback query without complex conditions...');
            try {
                // Try a simpler query with just the first condition and orderBy
                let simpleQuery = collection(db, collectionName);
                
                if (conditions && conditions.length > 0) {
                    // Just use the first condition
                    const firstCondition = conditions[0];
                    simpleQuery = query(simpleQuery, where(firstCondition.field, firstCondition.operator, firstCondition.value));
                }
                
                if (sortBy) {
                    simpleQuery = query(simpleQuery, orderBy(sortBy.field, sortBy.direction || 'asc'));
                }
                
                if (limitTo) {
                    simpleQuery = query(simpleQuery, limit(limitTo));
                }
                
                const fallbackSnapshot = await getDocs(simpleQuery);
                const fallbackResults = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log(`Fallback query returned ${fallbackResults.length} results`);
                return fallbackResults;
            } catch (fallbackError) {
                console.error('Fallback query also failed:', fallbackError);
                // Return empty array instead of throwing
                return [];
            }
        }
        
        console.error('Error executing Firestore query:', error);
        // Return empty array instead of throwing
        return [];
    }
};