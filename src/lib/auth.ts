'use client';

import { User } from '@/types';

export const saveUserToStorage = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('namasteLogin', JSON.stringify(user));
  }
};

export const getUserFromStorage = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('namasteLogin');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const removeUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('namasteLogin');
  }
};

export const isAuthenticated = (): boolean => {
  return getUserFromStorage() !== null;
};

export const getDashboardUrl = (user: User): string => {
  return user.providerType === 'hospital' 
    ? '/hospital-dashboard' 
    : '/insurance-dashboard';
};
