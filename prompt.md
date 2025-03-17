# Medication Management App Implementation Plan "תרופתי"

This document provides a comprehensive plan for building a medication management application using React, Firebase, and Material UI. The app will be responsive for both mobile and desktop use, with offline support and push notifications.

## Project Overview

- **Framework**: React with Vite (JSX)
- **UI Library**: Material UI
- **State Management**: React Context API + Hooks
- **Database & Backend**: Firebase (Firestore, Authentication, Cloud Messaging)
- **Deployment**: GitHub Pages
- **Languages**: Hebrew (RTL) default with i18n support for additional languages
- **Target Platforms**: Mobile web, desktop web

## Implementation Steps

### 1. Project Setup

1. Initialize a new Vite React project:
   ```bash
   npm create vite@latest medication-manager -- --template react
   cd medication-manager
   npm install
   ```

2. Install core dependencies:
   ```bash
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
   npm install firebase react-router-dom i18next react-i18next
   npm install workbox-window workbox-webpack-plugin
   npm install date-fns react-hook-form
   ```

3. Set up GitHub repository for the project and connect to local repository.

### 2. Firebase Configuration

1. Create a new Firebase project in the Firebase console.
2. Set up Firestore database with the collections designed in your database model.
3. Configure Firebase Authentication with email/password provider.
4. Set up Firebase Cloud Messaging for notifications.
5. Create a `firebase.js` configuration file:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   import { getAuth } from 'firebase/auth';
   import { getMessaging } from 'firebase/messaging';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);
   const auth = getAuth(app);
   const messaging = getMessaging(app);

   export { app, db, auth, messaging };
   ```

### 3. Create Firebase Service Layer (Serverless API)

Create a service directory with modules for each of these functions:

1. Authentication Service:
   - User registration
   - Login/logout
   - Password reset
   - Get current user

2. User Service:
   - Create/update user profiles
   - Get user details
   - Update user preferences

3. Family Service:
   - Create/update families
   - Add/remove members
   - Manage user permissions

4. Medication Service:
   - Create/update medications
   - Get medication list
   - Manage prescriptions

5. Logs Service:
   - Record medication administration
   - Get logs by family member
   - Filter logs by date range

6. Notification Service:
   - Register for push notifications
   - Schedule reminders
   - Send notifications

7. Offline Service:
   - Cache important data
   - Queue changes when offline
   - Sync when back online

### 4. PWA Configuration

1. Create a service worker for offline support:
   ```javascript
   // src/service-worker.js
   import { precacheAndRoute } from 'workbox-precaching';
   import { registerRoute } from 'workbox-routing';
   import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
   import { ExpirationPlugin } from 'workbox-expiration';

   precacheAndRoute(self.__WB_MANIFEST);

   // Cache Firebase API requests
   registerRoute(
     ({ url }) => url.origin.includes('firebaseio.com'),
     new StaleWhileRevalidate({
       cacheName: 'firebase-data',
     })
   );

   // Cache static assets
   registerRoute(
     ({ request }) => request.destination === 'image',
     new CacheFirst({
       cacheName: 'images',
       plugins: [
         new ExpirationPlugin({
           maxEntries: 60,
           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
         }),
       ],
     })
   );
   ```

2. Configure the web app manifest for PWA support.

### 5. Internationalization (i18n) Setup

1. Set up i18next with Hebrew as default and support for RTL:
   ```javascript
   // src/i18n.js
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';

   const resources = {
     he: {
       translation: {
         // Hebrew translations
       }
     },
     en: {
       translation: {
         // English translations
       }
     }
   };

   i18n
     .use(initReactI18next)
     .init({
       resources,
       lng: 'he',
       fallbackLng: 'he',
       interpolation: {
         escapeValue: false
       }
     });

   export default i18n;
   ```

2. Create separate translation files for different sections of the app.

### 6. Context API Setup

1. Create an authentication context:
   ```javascript
   // src/contexts/AuthContext.js
   import React, { createContext, useState, useEffect, useContext } from 'react';
   import { auth } from '../firebase';

   const AuthContext = createContext();

   export function useAuth() {
     return useContext(AuthContext);
   }

   export function AuthProvider({ children }) {
     const [currentUser, setCurrentUser] = useState(null);
     const [loading, setLoading] = useState(true);

     function signup(email, password) {
       // Implementation
     }

     function login(email, password) {
       // Implementation
     }

     function logout() {
       // Implementation
     }

     // More auth functions...

     useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged(user => {
         setCurrentUser(user);
         setLoading(false);
       });

       return unsubscribe;
     }, []);

     const value = {
       currentUser,
       signup,
       login,
       logout
       // More functions...
     };

     return (
       <AuthContext.Provider value={value}>
         {!loading && children}
       </AuthContext.Provider>
     );
   }
   ```

2. Create similar contexts for family data, medications, notifications, etc.

### 7. Component Structure

1. Create a component hierarchy:
   - Layouts (Admin, User)
   - Authentication components
   - Family management
   - Member management
   - Medication management
   - Medication logs
   - Reminders and notifications
   - Settings and profile

2. Implement responsive layouts for both mobile and desktop.

### 8. Data Seeding Script

Create a script to seed initial data for development and testing:

```javascript
// scripts/seedData.js
import { db, auth } from '../src/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

async function seedData() {
  try {
    // Create admin user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@example.com', 
      'Aa123456'
    );
    
    const adminUid = userCredential.user.uid;
    
    // Add admin user to Firestore
    await addDoc(collection(db, 'users'), {
      uniqueId: adminUid,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      isSuperAdmin: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: adminUid,
      updatedBy: adminUid,
      isActive: true
    });
    
    // Add sample family
    const familyRef = await addDoc(collection(db, 'families'), {
      uniqueId: 'family1',
      name: 'משפחת ישראלי',
      description: 'משפחה לדוגמה',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: adminUid,
      updatedBy: adminUid,
      isActive: true
    });
    
    // Add sample family member
    await addDoc(collection(db, 'familyMembers'), {
      uniqueId: 'member1',
      familyId: familyRef.id,
      name: 'ישראל ישראלי',
      birthDate: new Date('1980-01-01'),
      weight: 70,
      height: 175,
      gender: 'male',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: adminUid,
      updatedBy: adminUid,
      isActive: true
    });
    
    // Add sample medications
    // Add sample prescriptions
    // Add sample logs
    
    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run with: node -r esm scripts/seedData.js
seedData();
```

### 9. Create a Cleanup Script

Create a script to clean the database during development:

```javascript
// scripts/cleanData.js
import { db } from '../src/firebase';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';

async function cleanData() {
  try {
    const collections = [
      'users', 
      'families', 
      'familyMembers', 
      'familyUsers', 
      'medications', 
      'prescriptions', 
      'medicationLogs', 
      'inventory', 
      'invitations', 
      'auditTrail'
    ];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
        console.log(`Deleted document ${doc.id} from ${collectionName}`);
      }
    }
    
    console.log('All data cleaned successfully');
  } catch (error) {
    console.error('Error cleaning data:', error);
  }
}

// Run with: node -r esm scripts/cleanData.js
cleanData();
```

### 10. GitHub Pages Deployment

1. Install the gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/medication-manager",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Configure Vite for base path in vite.config.js:
   ```javascript
   export default {
     base: '/medication-manager/',
     // other config
   }
   ```

## Development Roadmap

1. **Phase 1: Authentication & User Management**
   - Set up Firebase Authentication
   - Create login/signup screens
   - Implement user profile management
   - Build super admin dashboard

2. **Phase 2: Family & Member Management**
   - Create family CRUD operations
   - Implement family member management
   - Build permissions system
   - Add invitation system

3. **Phase 3: Medication Management**
   - Create medication database
   - Implement prescription system
   - Build medication scheduling

4. **Phase 4: Medication Logs & Monitoring**
   - Create medication administration logging
   - Build reporting and monitoring
   - Implement inventory tracking

5. **Phase 5: Notifications & Offline Support**
   - Set up push notifications
   - Implement reminder system
   - Add offline capabilities
   - Build sync mechanisms

6. **Phase 6: Internationalization & Polishing**
   - Complete Hebrew translations
   - Add language switching
   - RTL layout optimization
   - Performance optimizations

7. **Phase 7: Testing & Deployment**
   - Write tests
   - Fix bugs
   - Deploy to GitHub Pages
   - Create documentation

## DB schema

/**
 * FIRESTORE DATABASE MODEL FOR MEDICATION MANAGEMENT APPLICATION
 * 
 * This document outlines the collection structure, fields, and relationships
 * for a medication management application built on Firestore.
 */

// Base fields included in all documents
const baseFields = {
  uniqueId: 'string',         // Unique identifier (can be Firestore document ID)
  createdBy: 'string',        // User ID of the creator
  updatedBy: 'string',        // User ID of the updater
  createdAt: 'timestamp',     // When the document was created
  updatedAt: 'timestamp',     // When the document was last updated
  isActive: 'boolean'         // Whether the record is active or archived
};

/**
 * 1. USERS COLLECTION
 * Stores user accounts and their global information
 */
const userCollection = {
  ...baseFields,
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  mobile: 'string',
  isSuperAdmin: 'boolean',    // Whether user has super admin privileges
  profileImageUrl: 'string',  // URL to profile image (optional)
  preferences: {
    notificationPreferences: {
      email: 'boolean',
      push: 'boolean',
      sms: 'boolean'
    },
    timezone: 'string',
    language: 'string'
  }
};

/**
 * 2. FAMILIES COLLECTION
 * Stores family units that group members, medications, and logs
 */
const familyCollection = {
  ...baseFields,
  name: 'string',             // Family name
  description: 'string',      // Optional description of the family
  imageUrl: 'string'          // Optional family photo
  // References to family members and users are stored in separate collections
};

/**
 * 3. FAMILY MEMBERS COLLECTION
 * Stores individuals whose medications are being tracked
 */
const familyMemberCollection = {
  ...baseFields,
  familyId: 'string',         // Reference to the family
  name: 'string',
  birthDate: 'timestamp',
  weight: 'number',           // In kg
  height: 'number',           // In cm
  gender: 'string',           // Optional: 'male', 'female', 'other'
  imageUrl: 'string',         // URL to member image (optional)
  allergies: ['string'],      // Array of known allergies
  medicalConditions: ['string'], // Array of medical conditions
  notes: 'string'             // Any additional notes
};

/**
 * 4. FAMILY USERS COLLECTION
 * Maps users to families with specific roles and permissions
 */
const familyUserCollection = {
  ...baseFields,
  familyId: 'string',         // Reference to the family
  userId: 'string',           // Reference to the user
  role: 'string',             // 'admin', 'editor', 'viewer'
  permissions: {
    canAddMember: 'boolean',
    canEditMember: 'boolean',
    canDeleteMember: 'boolean',
    canAddMedication: 'boolean',
    canEditMedication: 'boolean',
    canDeleteMedication: 'boolean',
    canRecordAdministration: 'boolean',
    canInviteUsers: 'boolean'
  },
  invitedBy: 'string',        // User ID who invited this user
  invitedAt: 'timestamp',     // When the user was invited
  joinedAt: 'timestamp'       // When the user accepted the invitation
};

/**
 * 5. MEDICATIONS COLLECTION
 * Stores medication details that can be reused across prescriptions
 */
const medicationCollection = {
  ...baseFields,
  name: 'string',             // Medication name
  type: 'string',             // 'tablet', 'capsule', 'liquid', 'injection', etc.
  dosageForm: 'string',       // 'mg', 'ml', 'g', etc.
  instructions: 'string',     // Recommended instructions/usage
  foodRequirements: 'string', // 'withFood', 'beforeFood', 'afterFood', 'noRequirement'
  imageUrl: 'string',         // URL to medication image (optional)
  sideEffects: ['string'],    // Array of possible side effects
  contradictions: ['string'], // Array of contradictions
  notes: 'string',            // Any additional notes
  isGeneric: 'boolean',       // Whether this is a generic template medication or specific to a family
  familyId: 'string'          // If not generic, which family created this medication
};

/**
 * 6. PRESCRIPTIONS COLLECTION
 * Links medications to family members with dosage and schedule
 */
const prescriptionCollection = {
  ...baseFields,
  familyId: 'string',         // Reference to the family
  familyMemberId: 'string',   // Reference to the family member
  medicationId: 'string',     // Reference to the medication
  dosage: {
    value: 'number',          // Dosage amount
    unit: 'string'            // 'mg', 'ml', 'pills', etc.
  },
  startDate: 'timestamp',     // When to start the medication
  endDate: 'timestamp',       // When to end the medication (optional)
  schedule: {
    frequency: 'string',      // 'once', 'daily', 'twice', 'thrice', 'weekly', 'asNeeded'
    times: ['string'],        // Array of times in 'HH:MM' format
    daysOfWeek: ['string'],   // For weekly: ['monday', 'wednesday', 'friday']
    interval: 'number',       // For 'every X days' frequency
    asNeededInstructions: 'string' // Instructions for 'asNeeded' frequency
  },
  reminderEnabled: 'boolean', // Whether reminders are enabled
  reminderSettings: {
    reminderBefore: 'number', // Minutes before scheduled time
    reminderType: ['string']  // ['push', 'email', 'sms']
  },
  notes: 'string',            // Any additional notes
  prescribedBy: 'string',     // Doctor who prescribed (optional)
  prescriptionImageUrl: 'string' // Image of the actual prescription (optional)
};

/**
 * 7. MEDICATION LOGS COLLECTION
 * Records each instance of medication administration
 */
const medicationLogCollection = {
  ...baseFields,
  familyId: 'string',         // Reference to the family
  familyMemberId: 'string',   // Reference to the family member
  prescriptionId: 'string',   // Reference to the prescription
  medicationId: 'string',     // Reference to the medication
  administeredAt: 'timestamp', // When the medication was administered
  administeredBy: 'string',   // User who administered the medication
  administeredDosage: {
    value: 'number',
    unit: 'string'
  },
  feverAtAdministration: 'number', // Optional temperature record
  symptoms: ['string'],       // Array of symptoms noted
  sideEffectsObserved: ['string'], // Side effects observed
  notes: 'string',            // Any additional notes
  skipped: 'boolean',         // Whether dose was skipped
  skipReason: 'string',       // Reason if dose was skipped
  imageUrl: 'string'          // Optional image (e.g., of pill taken)
};

/**
 * 8. INVENTORY COLLECTION
 * Tracks medication inventory for each family
 */
const inventoryCollection = {
  ...baseFields,
  familyId: 'string',         // Reference to the family
  medicationId: 'string',     // Reference to the medication
  currentQuantity: 'number',  // Current quantity available
  unit: 'string',             // 'pills', 'bottles', etc.
  expirationDate: 'timestamp', // When the medication expires
  batchNumber: 'string',      // Batch or lot number (optional)
  purchasedAt: 'timestamp',   // When the medication was purchased
  purchaseLocation: 'string', // Where the medication was purchased
  lowStockThreshold: 'number', // Threshold for low stock alert
  notes: 'string'             // Any additional notes
};

/**
 * 9. INVITATIONS COLLECTION
 * Tracks pending invitations to families
 */
const invitationCollection = {
  ...baseFields,
  familyId: 'string',         // Reference to the family
  email: 'string',            // Email address of the invitee
  role: 'string',             // Intended role: 'admin', 'editor', 'viewer'
  invitedBy: 'string',        // User ID who sent the invitation
  status: 'string',           // 'pending', 'accepted', 'rejected', 'expired'
  expiresAt: 'timestamp',     // When the invitation expires
  token: 'string'             // Unique token for accepting invitation
};

/**
 * 10. AUDIT TRAIL COLLECTION
 * More detailed audit trail for medical compliance
 */
const auditTrailCollection = {
  timestamp: 'timestamp',     // When the action occurred
  userId: 'string',           // User who performed the action
  action: 'string',           // 'create', 'update', 'delete', 'view'
  resourceType: 'string',     // 'medication', 'familyMember', 'prescription', 'log'
  resourceId: 'string',       // ID of the affected resource
  familyId: 'string',         // Reference to the family
  details: 'object',          // Specific details of the change
  ipAddress: 'string',        // IP address of the user
  userAgent: 'string'         // Browser/device information
};

/**
 * SECURITY RULES DESIGN
 * 
 * Firestore security rules should enforce:
 * 1. Users can only access data for families they belong to
 * 2. Within families, users respect their role permissions
 * 3. Super admins have global access
 */
const securityRules = `
service cloud.firestore {
  match /databases/{database}/documents {
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is a super admin
    function isSuperAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isSuperAdmin == true;
    }
    
    // Check if user belongs to a family
    function belongsToFamily(familyId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/familyUsers/$(request.auth.uid + '_' + familyId));
    }
    
    // Get user's role in a family
    function getRoleInFamily(familyId) {
      return get(/databases/$(database)/documents/familyUsers/$(request.auth.uid + '_' + familyId)).data.role;
    }
    
    // Check if user has specific permission in family
    function hasPermission(familyId, permission) {
      let familyUser = get(/databases/$(database)/documents/familyUsers/$(request.auth.uid + '_' + familyId)).data;
      return familyUser.permissions[permission] == true;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isSuperAdmin());
      allow write: if isAuthenticated() && (request.auth.uid == userId || isSuperAdmin());
    }
    
    // Families collection
    match /families/{familyId} {
      allow read: if isAuthenticated() && (belongsToFamily(familyId) || isSuperAdmin());
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        (getRoleInFamily(familyId) == 'admin' || isSuperAdmin());
    }
    
    // Family members collection
    match /familyMembers/{memberId} {
      allow read: if isAuthenticated() && 
        (belongsToFamily(resource.data.familyId) || isSuperAdmin());
      allow create: if isAuthenticated() && 
        (belongsToFamily(request.resource.data.familyId) && 
         hasPermission(request.resource.data.familyId, 'canAddMember') || isSuperAdmin());
      allow update: if isAuthenticated() && 
        (belongsToFamily(resource.data.familyId) && 
         hasPermission(resource.data.familyId, 'canEditMember') || isSuperAdmin());
      allow delete: if isAuthenticated() && 
        (belongsToFamily(resource.data.familyId) && 
         hasPermission(resource.data.familyId, 'canDeleteMember') || isSuperAdmin());
    }
    
    // Remaining security rules follow the same pattern for other collections...
  }
}
`;

// Export collections (for reference in implementation)
const collections = {
  users: userCollection,
  families: familyCollection,
  familyMembers: familyMemberCollection,
  familyUsers: familyUserCollection,
  medications: medicationCollection,
  prescriptions: prescriptionCollection,
  medicationLogs: medicationLogCollection,
  inventory: inventoryCollection,
  invitations: invitationCollection,
  auditTrail: auditTrailCollection
};

i would like to begin implementing the medication management app based on this plan.
include any bash command for installation, folder/files creation etc
<!-- please start with initialization of the project and Phase 1 -->
please continue with Phase 2
if you need any existing code or existing files names let me know and i'll share it with you.

