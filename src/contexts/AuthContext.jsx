// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component to wrap the app and provide auth context
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to register a new user
  async function signup(email, password, firstName, lastName) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
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
        isActive: true,
      });

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Function to log in a user
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Function to log out a user
  async function logout() {
    setError('');
    return signOut(auth);
  }

  // Function to reset password
  async function resetPassword(email) {
    setError('');
    return sendPasswordResetEmail(auth, email);
  }

  // Function to get user profile from Firestore
  async function getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get the user profile from Firestore
          const userProfile = await getUserProfile(user.uid);
          // Combine auth user and Firestore profile
          setCurrentUser({ ...user, profile: userProfile });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Object containing auth functions and state to be provided to context
  const value = {
    currentUser,
    error,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    getUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
