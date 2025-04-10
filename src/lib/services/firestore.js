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
    let q = collection(db, collectionName);

    // Add where conditions
    if (conditions && conditions.length > 0) {
        conditions.forEach(condition => {
            q = query(q, where(condition.field, condition.operator, condition.value));
        });
    }

    // Add orderBy
    if (sortBy) {
        q = query(q, orderBy(sortBy.field, sortBy.direction || 'asc'));
    }

    // Add limit
    if (limitTo) {
        q = query(q, limit(limitTo));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};