// src/lib/jobFilterAnalytics.js
import { db } from './firebase';
import { collection, doc, increment, setDoc, updateDoc, getDoc, getDocs } from 'firebase/firestore';

const FILTERS_COLLECTION = 'filterAnalytics';

/**
 * Increment filter counters in Firestore for each selected filter value.
 * @param {Object} selectedFilters - e.g. { location: 'NY', type: 'Full-time', ... }
 */
export async function incrementFilterCounts(selectedFilters) {
  if (!selectedFilters || typeof selectedFilters !== 'object') return;

  const batchUpdates = [];
  for (const [filterName, filterValue] of Object.entries(selectedFilters)) {
    if (!filterValue) continue;
    const docRef = doc(collection(db, FILTERS_COLLECTION), `${filterName}_${filterValue}`);
    batchUpdates.push(
      updateDoc(docRef, { count: increment(1) }).catch(async () => {
        // If doc doesn't exist, create it with count = 1
        await setDoc(docRef, { count: 1 });
      })
    );
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
