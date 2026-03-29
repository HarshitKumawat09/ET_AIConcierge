import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, ShoppingBag, Bell, User, LogOut, Activity, TrendingUp, Crown, Star, Zap, Calculator, Target, FileText, Users, Mic, TrendingUp as TrendingUpIcon, Newspaper, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
import { AuthProvider, useAuth, PLAN_FEATURES } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Concierge from './components/Concierge';
import Marketplace from './components/Marketplace';
import BusinessModel from './components/BusinessModel';
import TaxPlanner from './components/TaxPlanner';
import GoalTracker from './components/GoalTracker';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import FamilyCenter from './components/FamilyCenter';
import IPOCenter from './components/IPOCenter';
import ETPrimeContent from './components/ETPrimeContent';
import PortfolioSimulator from './components/PortfolioSimulator';
import Login from './components/Login';
import Signup from './components/Signup';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const Footer = () => (
  <footer style={{
    background: 'var(--primary)',
    borderTop: '1px solid var(--glass-border)',
    padding: '2rem',
    marginTop: 'auto'
  }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
            <img 
              src="/logo1.png" 
              alt="AI Concierge by The Economic Times" 
              style={{ 
                height: '48px',
                width: 'auto',
                display: 'block',
                objectFit: 'contain'
              }} 
            />
          </Link>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
            India's first AI-powered personal finance concierge, brought to you by The Economic Times.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/concierge" style={{ color: 'inherit', textDecoration: 'none' }}>AI Assistant</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/simulator" style={{ color: 'inherit', textDecoration: 'none' }}>Portfolio Simulator</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/ipo" style={{ color: 'inherit', textDecoration: 'none' }}>IPO Center</Link></li>
          </ul>
        </div>

        {/* Tools */}
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>Tools</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/tax-planner" style={{ color: 'inherit', textDecoration: 'none' }}>Tax Planner</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/goals" style={{ color: 'inherit', textDecoration: 'none' }}>Goal Tracker</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/documents" style={{ color: 'inherit', textDecoration: 'none' }}>Document Analyzer</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/marketplace" style={{ color: 'inherit', textDecoration: 'none' }}>Marketplace</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            <li style={{ marginBottom: '0.5rem' }}>Privacy Policy</li>
            <li style={{ marginBottom: '0.5rem' }}>Terms of Service</li>
            <li style={{ marginBottom: '0.5rem' }}>SEBI Disclaimer</li>
            <li style={{ marginBottom: '0.5rem' }}>Contact Support</li>
          </ul>
        </div>
      </div>

      <div style={{ 
        borderTop: '1px solid var(--glass-border)', 
        paddingTop: '1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        <div>
          © 2024 ET AI Concierge by Team AGI. Part of The Economic Times.
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>Made with ❤️ in India</span>
          <span>•</span>
          <span>Data powered by ET Markets</span>
        </div>
      </div>
    </div>
  </footer>
);

const Navbar = () => {
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user, currentPlan, logout } = useAuth();
  const location = useLocation();

  const planColors = {
    basic: { bg: '#6b7280', text: 'white' },
    pro: { bg: '#38bdf8', text: 'var(--primary)' },
    elite: { bg: '#fbbf24', text: 'var(--primary)' }
  };

  const PlanBadge = ({ plan }) => (
    <Link to="/business-model" style={{ textDecoration: 'none' }}>
      <span style={{
        background: planColors[plan].bg,
        color: planColors[plan].text,
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.7rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {plan}
      </span>
    </Link>
  );

  const NavLink = ({ to, icon: Icon, label, color }) => (
    <Link to={to} style={{ 
      color: color || (location.pathname === to ? 'var(--accent)' : 'var(--text-dim)'), 
      textDecoration: 'none', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.4rem',
      fontWeight: location.pathname === to ? '600' : '500',
      fontSize: '0.85rem',
      transition: 'var(--transition)',
      whiteSpace: 'nowrap'
    }}>
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  const DropdownMenu = ({ label, icon: Icon, isOpen, setIsOpen, children }) => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: isOpen ? 'var(--accent)' : 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontWeight: isOpen ? '600' : '500',
          fontSize: '0.85rem',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '0.5rem'
        }}
      >
        <Icon size={18} />
        <span>{label}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          background: 'var(--glass)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '0.75rem',
          padding: '0.5rem',
          minWidth: '200px',
          zIndex: 100,
          marginTop: '0.5rem'
        }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <nav style={{ 
      background: 'var(--glass)', 
      backdropFilter: 'blur(10px)',
      padding: '0.75rem 1.5rem',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
<Link to="/" style={{ textDecoration: 'none' }}>
  <img 
    src="/logo1.png" 
    alt="AI Concierge by The Economic Times" 
    style={{ 
      height: '64px',
      width: 'auto',
      display: 'block',
      objectFit: 'contain'
    }} 
  />
</Link>
      {/* Main Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>
        <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavLink to="/concierge" icon={MessageSquare} label="AI Assistant" />
        <NavLink to="/simulator" icon={Activity} label="Simulator" />
        <NavLink to="/ipo" icon={TrendingUpIcon} label="IPO" />
        
        {/* Tools Dropdown */}
        <DropdownMenu 
          label="Tools" 
          icon={Calculator} 
          isOpen={showToolsMenu} 
          setIsOpen={setShowToolsMenu}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link to="/tax-planner" style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.5rem', 
              color: location.pathname === '/tax-planner' ? 'var(--accent)' : 'white',
              textDecoration: 'none',
              fontSize: '0.85rem',
              background: location.pathname === '/tax-planner' ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
            }}>
              Tax Planner
            </Link>
            <Link to="/goals" style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.5rem', 
              color: location.pathname === '/goals' ? 'var(--accent)' : 'white',
              textDecoration: 'none',
              fontSize: '0.85rem',
              background: location.pathname === '/goals' ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
            }}>
              Goal Tracker
            </Link>
            <Link to="/documents" style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.5rem', 
              color: location.pathname === '/documents' ? 'var(--accent)' : 'white',
              textDecoration: 'none',
              fontSize: '0.85rem',
              background: location.pathname === '/documents' ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
            }}>
              Documents
            </Link>
          </div>
        </DropdownMenu>

        <NavLink to="/marketplace" icon={ShoppingBag} label="Marketplace" />
        
        {/* More Dropdown */}
        <DropdownMenu 
          label="More" 
          icon={Menu} 
          isOpen={showMoreMenu} 
          setIsOpen={setShowMoreMenu}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link to="/et-prime" style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.5rem', 
              color: '#dc2626',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Newspaper size={16} />
              ET Prime
            </Link>
            {currentPlan === 'elite' && (
              <Link to="/family" style={{ 
                padding: '0.5rem 0.75rem', 
                borderRadius: '0.5rem', 
                color: '#fbbf24',
                textDecoration: 'none',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Users size={16} />
                Family
              </Link>
            )}
            <Link to="/business-model" style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.5rem', 
              color: location.pathname === '/business-model' ? 'var(--accent)' : 'white',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <TrendingUp size={16} />
              Plans
            </Link>
          </div>
        </DropdownMenu>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <PlanBadge plan={currentPlan} />
        
        <button style={{ 
          background: 'var(--glass)', 
          padding: '0.5rem', 
          borderRadius: '50%', 
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-dim)'
        }}>
          <Bell size={18} />
        </button>

        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'var(--glass)', 
            padding: '0.25rem 0.75rem 0.25rem 0.25rem', 
            borderRadius: '2rem',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)', 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <User size={14} color="white" />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>{user?.name?.split(' ')[0] || 'User'}</span>
          </div>
        </Link>

        <button 
          onClick={logout}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--text-dim)',
            padding: '0.4rem',
            borderRadius: '0.5rem'
          }}
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: isAuthenticated ? '1rem 2rem' : 0 }}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/concierge" element={
            <ProtectedRoute>
              <Concierge />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } />
          <Route path="/simulator" element={
            <ProtectedRoute>
              <PortfolioSimulator />
            </ProtectedRoute>
          } />
          <Route path="/tax-planner" element={
            <ProtectedRoute>
              <TaxPlanner />
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <GoalTracker />
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute>
              <DocumentAnalyzer />
            </ProtectedRoute>
          } />
          <Route path="/family" element={
            <ProtectedRoute>
              <FamilyCenter />
            </ProtectedRoute>
          } />
          <Route path="/ipo" element={
            <ProtectedRoute>
              <IPOCenter />
            </ProtectedRoute>
          } />
          <Route path="/et-prime" element={
            <ProtectedRoute>
              <ETPrimeContent />
            </ProtectedRoute>
          } />
          <Route path="/business-model" element={
            <ProtectedRoute>
              <BusinessModel />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
