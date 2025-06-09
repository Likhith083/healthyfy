"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/types';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '@/lib/localStorage';
import { findUserByEmail, addUser as addDataUser, addPatientData, findUserById } from '@/lib/dataService';

const CURRENT_USER_KEY = 'healthMatchDirectCurrentUser';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_unsafe: string) => Promise<User | null>;
  signup: (name: string, email: string, password_unsafe: string, role: UserRole) => Promise<User | null>;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getLocalStorageItem<User | null>(CURRENT_USER_KEY, null);
    if (storedUser) {
      // Re-validate user from "DB" in case it was deleted or changed
      const validatedUser = findUserById(storedUser.id);
      if (validatedUser && validatedUser.role === storedUser.role) {
         setUser(validatedUser);
      } else {
        // Stored user is invalid, clear it
        removeLocalStorageItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password_unsafe: string): Promise<User | null> => {
    setIsLoading(true);
    console.log('Attempting login with:', { email });
    const foundUser = findUserByEmail(email);
    console.log('Found user:', foundUser);
    
    if (foundUser && foundUser.password === password_unsafe) { // Password check (unsafe, for demo only)
      console.log('Password match successful');
      const userToStore = { ...foundUser };
      delete userToStore.password; // Don't store password in state or client-side localStorage
      setUser(userToStore);
      setLocalStorageItem<User>(CURRENT_USER_KEY, userToStore);
      setIsLoading(false);
      router.push(`/${foundUser.role}/dashboard`);
      return userToStore;
    }
    console.log('Login failed - user not found or password mismatch');
    setIsLoading(false);
    return null;
  }, [router]);

  const signup = useCallback(async (name: string, email: string, password_unsafe: string, role: UserRole): Promise<User | null> => {
    setIsLoading(true);
    if (findUserByEmail(email)) {
      setIsLoading(false);
      return null; // User already exists
    }

    const newUser = addDataUser({ name, email, password: password_unsafe, role });
    if (role === 'patient') {
      addPatientData({ userId: newUser.id, symptomsLog: [], assignedDoctorId: undefined });
    }
    // For doctor role, an admin would typically complete their profile setup.
    // Here we are simplifying. If a doctor signs up, they'd need a profile created by admin or a separate flow.

    const userToStore = { ...newUser };
    delete userToStore.password;
    setUser(userToStore);
    setLocalStorageItem<User>(CURRENT_USER_KEY, userToStore);
    setIsLoading(false);
    router.push(`/${newUser.role}/dashboard`);
    return userToStore;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    removeLocalStorageItem(CURRENT_USER_KEY);
    router.push('/');
  }, [router]);

  return { user, isLoading, login, signup, logout };
}
