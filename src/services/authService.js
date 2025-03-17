// src/services/authService.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Service for handling authentication operations
 */
export const authService = {
    /**
     * Register a new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} firstName - User first name
     * @param {string} lastName - User last name
     * @returns {Promise<UserCredential>} - Firebase user credential
     */
    async register (email, password, firstName, lastName) {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`
        });

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uniqueId: user.uid,
            firstName,
            lastName,
            email,
            isSuperAdmin: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: user.uid,
            updatedBy: user.uid,
            isActive: true
        });

        return userCredential;
    },

    /**
     * Log in an existing user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<UserCredential>} - Firebase user credential
     */
    async login (email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    },

    /**
     * Log out the current user
     * @returns {Promise<void>}
     */
    async logout () {
        return signOut(auth);
    },

    /**
     * Send a password reset email
     * @param {string} email - User email
     * @returns {Promise<void>}
     */
    async resetPassword (email) {
        return sendPasswordResetEmail(auth, email);
    },

    /**
     * Get the current authenticated user
     * @returns {User|null} - Firebase user or null if not authenticated
     */
    getCurrentUser () {
        return auth.currentUser;
    },

    /**
     * Get a user's profile from Firestore
     * @param {string} uid - User ID
     * @returns {Promise<Object|null>} - User profile data or null if not found
     */
    async getUserProfile (uid) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
    },

    /**
     * Update a user's profile
     * @param {string} uid - User ID
     * @param {Object} profileData - Profile data to update
     * @returns {Promise<void>}
     */
    async updateUserProfile (uid, profileData) {
        const user = this.getCurrentUser();

        // Update auth profile if needed
        if (profileData.firstName && profileData.lastName) {
            await updateProfile(user, {
                displayName: `${profileData.firstName} ${profileData.lastName}`
            });
        }

        // Update Firestore profile
        await updateDoc(doc(db, 'users', uid), {
            ...profileData,
            updatedAt: serverTimestamp(),
            updatedBy: uid
        });
    },

    /**
     * Update a user's email
     * @param {string} newEmail - New email address
     * @returns {Promise<void>}
     */
    async updateUserEmail (newEmail) {
        const user = this.getCurrentUser();
        await updateEmail(user, newEmail);

        // Also update email in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
            email: newEmail,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid
        });
    },

    /**
     * Update a user's password
     * @param {string} newPassword - New password
     * @returns {Promise<void>}
     */
    async updateUserPassword (newPassword) {
        const user = this.getCurrentUser();
        return updatePassword(user, newPassword);
    },

    /**
     * Reauthenticate the user (required before sensitive operations)
     * @param {string} password - Current password
     * @returns {Promise<UserCredential>}
     */
    async reauthenticate (password) {
        const user = this.getCurrentUser();
        const credential = EmailAuthProvider.credential(user.email, password);
        return reauthenticateWithCredential(user, credential);
    }
};

export default authService;