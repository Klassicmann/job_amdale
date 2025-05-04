// src/lib/jobFilterAnalytics.js
import { db } from './firebase';
import { 
  collection, 
  doc, 
  increment, 
  setDoc, 
  updateDoc, 
  getDocs, 
  deleteDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';

const FILTERS_COLLECTION = 'filterAnalytics';
const FILTER_CATEGORIES_COLLECTION = 'filterCategories';

/**
 * Increment filter counters in Firestore for each selected filter value.
 * @param {Object} selectedFilters - e.g. { location: 'NY', type: 'Full-time', ... }
 */
export async function incrementFilterCounts(selectedFilters) {
  if (!selectedFilters || typeof selectedFilters !== 'object') return;

  const batchUpdates = [];
  for (const [filterName, filterValue] of Object.entries(selectedFilters)) {
    if (!filterValue) continue;
    
    // Handle arrays (for multi-select filters)
    if (Array.isArray(filterValue)) {
      for (const value of filterValue) {
        if (!value) continue;
        const docRef = doc(collection(db, FILTERS_COLLECTION), `${filterName}_${value}`);
        batchUpdates.push(
          updateDoc(docRef, { 
            count: increment(1),
            category: filterName,
            value: value,
            updatedAt: new Date().toISOString()
          }).catch(async () => {
            // If doc doesn't exist, create it with count = 1
            await setDoc(docRef, { 
              count: 1,
              category: filterName,
              value: value, 
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          })
        );
      }
    } else {
      // Handle single value
      const docRef = doc(collection(db, FILTERS_COLLECTION), `${filterName}_${filterValue}`);
      batchUpdates.push(
        updateDoc(docRef, { 
          count: increment(1),
          category: filterName,
          value: filterValue,
          updatedAt: new Date().toISOString()
        }).catch(async () => {
          // If doc doesn't exist, create it with count = 1
          await setDoc(docRef, { 
            count: 1,
            category: filterName,
            value: filterValue,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        })
      );
    }
  }
  await Promise.all(batchUpdates);
}

/**
 * Get analytics for all filters (for admin dashboard)
 */
export async function getAllFilterAnalytics() {
  const snapshot = await getDocs(collection(db, FILTERS_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get analytics for filters by category
 * @param {string} category - The filter category
 */
export async function getFilterAnalyticsByCategory(category) {
  const q = query(
    collection(db, FILTERS_COLLECTION),
    where("category", "==", category),
    orderBy("count", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get all filter categories
 */
export async function getFilterCategories() {
  const snapshot = await getDocs(collection(db, FILTER_CATEGORIES_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Add a new filter category
 * @param {string} categoryId - The unique identifier for the category
 * @param {string} displayName - The human-readable display name
 * @param {boolean} isMultiSelect - Whether this filter allows multiple selections
 */
export async function addFilterCategory(categoryId, displayName, isMultiSelect = false) {
  const docRef = doc(collection(db, FILTER_CATEGORIES_COLLECTION), categoryId);
  return setDoc(docRef, {
    displayName,
    isMultiSelect,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

/**
 * Update a filter category
 * @param {string} categoryId - The unique identifier for the category
 * @param {object} categoryData - The data to update
 */
export async function updateFilterCategory(categoryId, categoryData) {
  const docRef = doc(collection(db, FILTER_CATEGORIES_COLLECTION), categoryId);
  return updateDoc(docRef, {
    ...categoryData,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Delete a filter category
 * @param {string} categoryId - The unique identifier for the category
 */
export async function deleteFilterCategory(categoryId) {
  const docRef = doc(collection(db, FILTER_CATEGORIES_COLLECTION), categoryId);
  return deleteDoc(docRef);
}

/**
 * Add a new filter value to a category
 * @param {string} categoryId - The filter category id
 * @param {string} valueId - The unique identifier for the value
 * @param {string} displayLabel - The human-readable display label
 */
export async function addFilterValue(categoryId, valueId, displayLabel) {
  const docId = `${categoryId}_${valueId}`;
  const docRef = doc(collection(db, FILTERS_COLLECTION), docId);
  return setDoc(docRef, {
    category: categoryId,
    value: valueId,
    displayLabel,
    count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

/**
 * Delete a filter value
 * @param {string} categoryId - The filter category id
 * @param {string} valueId - The value id to delete
 */
export async function deleteFilterValue(categoryId, valueId) {
  const docId = `${categoryId}_${valueId}`;
  const docRef = doc(collection(db, FILTERS_COLLECTION), docId);
  return deleteDoc(docRef);
}

/**
 * Get all filter values for a category
 * @param {string} categoryId - The filter category id
 */
export async function getFilterValuesByCategory(categoryId) {
  const q = query(
    collection(db, FILTERS_COLLECTION),
    where("category", "==", categoryId),
    orderBy("count", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
