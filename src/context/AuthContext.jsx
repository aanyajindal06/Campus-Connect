import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../services/storageKeys';
import { storageAdapter } from '../services/storageAdapter';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 'student' or 'admin'
  const [role, setRole] = useState(() => {
    return storageAdapter.get(STORAGE_KEYS.USER_ROLE, 'student');
  });

  const [currentUser] = useState({
    id: 'student-default',
    name: 'Alex Morgan',
    email: 'alex.morgan@campus.edu',
    roll: 'CS-2023-042',
    department: 'Computer Science'
  });

  useEffect(() => {
    storageAdapter.set(STORAGE_KEYS.USER_ROLE, role);
  }, [role]);

  const toggleRole = () => {
    setRole((prev) => (prev === 'student' ? 'admin' : 'student'));
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        isAdmin: role === 'admin',
        isStudent: role === 'student',
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
