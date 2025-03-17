// src/services/userService.js
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import authService from './authService';

/**
 * Service for managing user profiles and operations
 */
export const userService = {
    /**
     * Get a user's profile by UID
     * @param {string} uid - User ID
     * @returns {Promise<Object|null>} - User profile data
     */
    async getUserById (uid) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
    },

    /**
     * Get a user's profile by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} - User profile data
     */
    async getUserByEmail (email) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email), where('isActive', '==', true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        return querySnapshot.docs[0].data();
    },

    /**
     * Update a user's profile
     * @param {string} uid - User ID
     * @param {Object} profileData - Profile data to update
     * @returns {Promise<void>}
     */
    async updateProfile (uid, profileData) {
        const currentUser = authService.getCurrentUser();
        const updatedBy = currentUser ? currentUser.uid : uid;

        await updateDoc(doc(db, 'users', uid), {
            ...profileData,
            updatedAt: serverTimestamp(),
            updatedBy
        });
    },

    /**
     * Update user preferences
     * @param {string} uid - User ID
     * @param {Object} preferences - User preferences
     * @returns {Promise<void>}
     */
    async updatePreferences (uid, preferences) {
        const currentUser = authService.getCurrentUser();
        const updatedBy = currentUser ? currentUser.uid : uid;

        await updateDoc(doc(db, 'users', uid), {
            preferences,
            updatedAt: serverTimestamp(),
            updatedBy
        });
    },

    /**
     * Deactivate a user account
     * @param {string} uid - User ID
     * @returns {Promise<void>}
     */
    async deactivateUser (uid) {
        const currentUser = authService.getCurrentUser();
        const updatedBy = currentUser ? currentUser.uid : uid;

        await updateDoc(doc(db, 'users', uid), {
            isActive: false,
            updatedAt: serverTimestamp(),
            updatedBy
        });
    },

    /**
     * Reactivate a user account
     * @param {string} uid - User ID
     * @returns {Promise<void>}
     */
    async reactivateUser (uid) {
        const currentUser = authService.getCurrentUser();
        const updatedBy = currentUser ? currentUser.uid : uid;

        await updateDoc(doc(db, 'users', uid), {
            isActive: true,
            updatedAt: serverTimestamp(),
            updatedBy
        });
    },

    /**
     * Check if a user is a super admin
     * @param {string} uid - User ID
     * @returns {Promise<boolean>} - Whether the user is a super admin
     */
    async isSuperAdmin (uid) {
        const userProfile = await this.getUserById(uid);
        return userProfile && userProfile.isSuperAdmin === true;
    },

    /**
     * Get all users
     * @param {boolean} includeInactive - Whether to include inactive users
     * @returns {Promise<Array>} - Array of user profiles
     */
    async getAllUsers (includeInactive = false) {
        const usersRef = collection(db, 'users');

        let q;
        if (includeInactive) {
            q = query(usersRef);
        } else {
            q = query(usersRef, where('isActive', '==', true));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    /**
     * Update user's mobile number
     * @param {string} uid - User ID
     * @param {string} mobile - New mobile number
     * @returns {Promise<void>}
     */
    async updateMobile (uid, mobile) {
        const currentUser = authService.getCurrentUser();
        const updatedBy = currentUser ? currentUser.uid : uid;

        await updateDoc(doc(db, 'users', uid), {
            mobile,
            updatedAt: serverTimestamp(),
            updatedBy
        });
    },

    /**
     * Update user's profile image
     * @param {string} uid - User ID
     * @param {string} imageUrl - New profile image URL
     * @returns {Promise<void>}
     */
    async updateProfileImage (uid, imageUrl) {
        const currentUser = authService.getCurrentUser();
        const updatedBy = currentUser ? currentUser.uid : uid;

        await updateDoc(doc(db, 'users', uid), {
            profileImageUrl: imageUrl,
            updatedAt: serverTimestamp(),
            updatedBy
        });
    }
};

export default userService;