import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Session-based authentication state
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('labeliq_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const loginConsumer = (email, password) => {
    if (!email || !password) {
      throw new Error('Please provide email and password.');
    }
    const userData = {
      role: 'consumer',
      name: email.split('@')[0],
      email: email,
      token: 'session_' + Math.random().toString(36).substring(2),
      loginTime: new Date().toISOString()
    };
    setUser(userData);
    sessionStorage.setItem('labeliq_session', JSON.stringify(userData));
    return userData;
  };

  const loginInspector = (govtId, email, password) => {
    if (!govtId || !email || !password) {
      throw new Error('Government Inspector ID, Official Email, and Password are all required.');
    }
    const userData = {
      role: 'inspector',
      name: email.split('@')[0].toUpperCase(),
      email: email,
      govtId: govtId.trim(),
      token: 'gov_session_' + Math.random().toString(36).substring(2),
      department: 'Legal Metrology Enforcement Wing',
      loginTime: new Date().toISOString()
    };
    setUser(userData);
    sessionStorage.setItem('labeliq_session', JSON.stringify(userData));
    return userData;
  };

  const loginManufacturer = (email, password) => {
    if (!email || !password) {
      throw new Error('Company Email and Password are required.');
    }
    const userData = {
      role: 'manufacturer',
      name: email.split('@')[0],
      email: email,
      company: 'Authorized Packager / Brand Entity',
      token: 'mfg_session_' + Math.random().toString(36).substring(2),
      loginTime: new Date().toISOString()
    };
    setUser(userData);
    sessionStorage.setItem('labeliq_session', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('labeliq_session');
    // Clear any residual session
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loginConsumer,
      loginInspector,
      loginManufacturer,
      logout,
      isAuthenticated: Boolean(user),
      isRole: (role) => user?.role === role
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
