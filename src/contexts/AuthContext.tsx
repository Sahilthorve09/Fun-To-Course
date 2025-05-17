import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { createUserProfile, updateUserProfile } from '../services/database'
import { Timestamp } from 'firebase/firestore'

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserData: (data: { displayName?: string; photoURL?: string }) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const clearError = () => {
    setError(null)
  }

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // Create user profile in Firestore
      await createUserProfile(userCredential.user.uid, email)
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create account')
      throw err
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error('Signin error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      await firebaseSignOut(auth)
    } catch (err) {
      console.error('Signout error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign out')
      throw err
    }
  }

  const updateUserData = async (data: { displayName?: string; photoURL?: string }) => {
    try {
      setError(null)
      if (!currentUser) {
        throw new Error('No user is currently signed in')
      }

      // Validate input data
      if (data.displayName && data.displayName.trim().length === 0) {
        throw new Error('Display name cannot be empty')
      }

      if (data.photoURL && !data.photoURL.match(/^https?:\/\/.+/)) {
        throw new Error('Invalid photo URL format')
      }

      // Update Firebase Auth profile
      await updateProfile(currentUser, data)

      // Update Firestore profile with retry mechanism
      let retries = 3
      while (retries > 0) {
        try {
          await updateUserProfile(currentUser.uid, {
            ...data,
            updatedAt: Timestamp.now()
          })
          break
        } catch (err) {
          retries--
          if (retries === 0) throw err
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1s before retry
        }
      }

      // Force refresh the current user to get updated data
      await currentUser.reload()
      setCurrentUser({ ...currentUser, ...data })
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateUserData,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthProvider 