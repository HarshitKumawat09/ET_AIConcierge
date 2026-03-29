import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Plan features configuration
export const PLAN_FEATURES = {
  basic: {
    name: 'ET Basic',
    price: 0,
    aiQueriesPerDay: 5,
    portfolioProjections: false,
    realTimeAlerts: false,
    gapAnalysis: false,
    etPrimeAccess: false,
    marketsPro: false,
    privateSummits: false,
    familyPortfolio: false,
    masterclasses: false,
    dedicatedHybrid: false
  },
  pro: {
    name: 'ET Pro',
    price: 4999,
    aiQueriesPerDay: 50,
    portfolioProjections: true,
    realTimeAlerts: true,
    gapAnalysis: true,
    etPrimeAccess: true,
    marketsPro: true,
    privateSummits: false,
    familyPortfolio: false,
    masterclasses: false,
    dedicatedHybrid: false
  },
  elite: {
    name: 'ET Elite',
    price: 14999,
    aiQueriesPerDay: -1, // unlimited
    portfolioProjections: true,
    realTimeAlerts: true,
    gapAnalysis: true,
    etPrimeAccess: true,
    marketsPro: true,
    privateSummits: true,
    familyPortfolio: true,
    masterclasses: true,
    dedicatedHybrid: true
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('basic');

  useEffect(() => {
    const storedUser = localStorage.getItem('et_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setCurrentPlan(parsedUser.subscription?.plan || 'basic');
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('et_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setCurrentPlan(foundUser.subscription?.plan || 'basic');
      localStorage.setItem('et_user', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem('et_users') || '[]');
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      subscription: {
        plan: 'basic',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: null, // basic has no end date
        paymentMethod: null,
        transactionId: null
      },
      aiUsage: {
        queriesToday: 0,
        lastQueryDate: new Date().toISOString()
      },
      portfolio: {
        totalValue: 0,
        investments: [],
        returns: 0
      }
    };

    users.push(newUser);
    localStorage.setItem('et_users', JSON.stringify(users));
    localStorage.setItem('et_user', JSON.stringify(newUser));
    
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentPlan('basic');
    return { success: true };
  };

  const updateUserProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('et_user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('et_users') || '[]');
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('et_users', JSON.stringify(updatedUsers));
  };

  const upgradePlan = (plan, paymentDetails) => {
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const subscription = {
      plan: plan,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      paymentMethod: paymentDetails.method,
      transactionId: paymentDetails.transactionId,
      amount: PLAN_FEATURES[plan].price
    };

    updateUserProfile({ subscription });
    setCurrentPlan(plan);
    return { success: true };
  };

  const hasFeature = (feature) => {
    return PLAN_FEATURES[currentPlan][feature] || false;
  };

  const canUseAI = () => {
    const plan = PLAN_FEATURES[currentPlan];
    if (plan.aiQueriesPerDay === -1) return { allowed: true, remaining: -1 };
    
    const today = new Date().toDateString();
    const lastQueryDate = new Date(user?.aiUsage?.lastQueryDate || 0).toDateString();
    
    let queriesToday = user?.aiUsage?.queriesToday || 0;
    if (today !== lastQueryDate) {
      queriesToday = 0;
    }
    
    const remaining = plan.aiQueriesPerDay - queriesToday;
    return { allowed: remaining > 0, remaining };
  };

  const incrementAIUsage = () => {
    const today = new Date().toDateString();
    const lastQueryDate = new Date(user?.aiUsage?.lastQueryDate || 0).toDateString();
    
    let queriesToday = user?.aiUsage?.queriesToday || 0;
    if (today !== lastQueryDate) {
      queriesToday = 0;
    }
    
    updateUserProfile({
      aiUsage: {
        queriesToday: queriesToday + 1,
        lastQueryDate: new Date().toISOString()
      }
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPlan('basic');
    localStorage.removeItem('et_user');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    currentPlan,
    planFeatures: PLAN_FEATURES[currentPlan],
    login,
    signup,
    logout,
    updateUserProfile,
    upgradePlan,
    hasFeature,
    canUseAI,
    incrementAIUsage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
