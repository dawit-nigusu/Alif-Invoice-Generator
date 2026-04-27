import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import type { Invoice } from '@/types/invoice';

// Helper function to convert Firestore timestamps to ISO strings
const convertTimestamp = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return new Date().toISOString();
};

// Firebase configuration
const requiredFirebaseEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

const getRequiredEnvVar = (key: (typeof requiredFirebaseEnvVars)[number]): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required Firebase environment variable: ${key}`);
  }
  return value;
};

const firebaseConfig = {
  apiKey: getRequiredEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getRequiredEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getRequiredEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnvVar('VITE_FIREBASE_APP_ID'),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Test Firestore connection (for debugging)
if (import.meta.env.DEV) {
  console.log('🔥 Firebase initialized:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

// Collection name
const INVOICES_COLLECTION = 'invoices';

// Invoice API functions
export const invoiceService = {
  // Get all invoices
  async getAllInvoices() {
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
    const invoicesRef = collection(db, INVOICES_COLLECTION);
    
    try {
      // Try to order by created_at (requires index)
      const q = query(invoicesRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          created_at: convertTimestamp(data.created_at),
          updated_at: convertTimestamp(data.updated_at),
        };
      }) as Invoice[];
    } catch (error: any) {
      // If index doesn't exist, get all and sort in memory
      if (error?.code === 'failed-precondition') {
        const querySnapshot = await getDocs(invoicesRef);
        const invoices = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at: convertTimestamp(data.created_at),
            updated_at: convertTimestamp(data.updated_at),
          };
        }) as Invoice[];
        
        // Sort by created_at descending
        return invoices.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
      }
      throw error;
    }
  },

  // Get single invoice by ID
  async getInvoiceById(id: string) {
    const { doc, getDoc } = await import('firebase/firestore');
    const invoiceRef = doc(db, INVOICES_COLLECTION, id);
    const invoiceSnap = await getDoc(invoiceRef);
    
    if (!invoiceSnap.exists()) {
      throw new Error('Invoice not found');
    }
    
    const data = invoiceSnap.data();
    return {
      id: invoiceSnap.id,
      ...data,
      created_at: convertTimestamp(data.created_at),
      updated_at: convertTimestamp(data.updated_at),
    } as Invoice;
  },

  // Create new invoice
  async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const invoicesRef = collection(db, INVOICES_COLLECTION);
    
    const invoiceData = {
      ...invoice,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    
    const docRef = await addDoc(invoicesRef, invoiceData);
    
    return {
      id: docRef.id,
      ...invoiceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Invoice;
  },

  // Update existing invoice
  async updateInvoice(id: string, invoice: Partial<Invoice>) {
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    const invoiceRef = doc(db, INVOICES_COLLECTION, id);
    
    const updateData = {
      ...invoice,
      updated_at: serverTimestamp(),
    };
    
    // Remove id from update data if present
    delete (updateData as any).id;
    
    await updateDoc(invoiceRef, updateData);
    
    // Return updated invoice
    return this.getInvoiceById(id);
  },

  // Delete invoice
  async deleteInvoice(id: string) {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const invoiceRef = doc(db, INVOICES_COLLECTION, id);
    await deleteDoc(invoiceRef);
  },
};
