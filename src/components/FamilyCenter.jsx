import React, { useState } from 'react';
import { 
  Users, 
  Crown, 
  Plus, 
  X, 
  Eye, 
  EyeOff,
  TrendingUp,
  PiggyBank,
  Heart,
  GraduationCap,
  User,
  Lock,
  Unlock,
  AlertCircle,
  ArrowRight,
  Wallet,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth, PLAN_FEATURES } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MEMBER_ROLES = {
  spouse: { label: 'Spouse', icon: Users, color: '#f472b6' },
  child: { label: 'Child', icon: User, color: '#60a5fa' },
  parent: { label: 'Parent', icon: Shield, color: '#fbbf24' },
  dependent: { label: 'Dependent', icon: User, color: '#a78bfa' }
};

const FamilyCenter = () => {
  const { currentPlan, user, updateUserProfile } = useAuth();
  const planFeatures = PLAN_FEATURES[currentPlan];
  
  // Family members state (mock data + user additions)
  const [familyMembers, setFamilyMembers] = useState(user?.familyMembers || [
    {
      id: 'self',
      name: user?.name || 'You',
      role: 'self',
      age: 32,
      income: user?.income?.salary * 12 || 1200000,
      portfolio: user?.portfolio?.totalValue || 2500000,
      goals: user?.goals?.length || 3,
      isVisible: true,
      privacyLocked: false
    },
    {
      id: 'spouse-1',
      name: 'Priya Sharma',
      role: 'spouse',
      age: 30,
      income: 960000,
      portfolio: 1800000,
      goals: 2,
      isVisible: true,
      privacyLocked: false
    },
    {
      id: 'child-1',
      name: 'Aarav Sharma',
      role: 'child',
      age: 5,
      educationCorpus: 1500000,
      goals: 1,
      isVisible: true,
      privacyLocked: true
    },
    {
      id: 'parent-1',
      name: 'Ramesh Sharma',
      role: 'parent',
      age: 62,
      medicalFund: 800000,
      goals: 1,
      isVisible: false,
      privacyLocked: true
    }
  ]);

  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Calculate family totals
  const visibleMembers = familyMembers.filter(m => m.isVisible);
  const totalHouseholdIncome = visibleMembers.reduce((sum, m) => sum + (m.income || 0), 0);
  const totalPortfolio = visibleMembers.reduce((sum, m) => sum + (m.portfolio || 0), 0);
  const totalGoals = visibleMembers.reduce((sum, m) => sum + (m.goals || 0), 0);
  const totalEducationCorpus = visibleMembers.reduce((sum, m) => sum + (m.educationCorpus || 0), 0);
  const totalMedicalFund = visibleMembers.filter(m => m.role === 'parent').reduce((sum, m) => sum + (m.medicalFund || 0), 0);

  const toggleMemberVisibility = (id) => {
    setFamilyMembers(prev => prev.map(m => 
      m.id === id ? { ...m, isVisible: !m.isVisible } : m
    ));
  };

  const togglePrivacyLock = (id) => {
    setFamilyMembers(prev => prev.map(m => 
      m.id === id ? { ...m, privacyLocked: !m.privacyLocked } : m
    ));
  };

  // Check if Elite plan
  if (currentPlan !== 'elite') {
    return (
      <div className="fade-in">
        <div className="glass-panel" style={{ 
          padding: '4rem', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(251, 191, 36, 0.2)',
            padding: '2rem',
            borderRadius: '2rem',
            border: '2px solid #fbbf24'
          }}>
            <Crown size={64} color="#fbbf24" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#fbbf24' }}>
            ET Elite Exclusive
          </h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '500px', lineHeight: '1.6' }}>
            Family Financial Command Center is available exclusively for ET Elite members. 
            Manage your entire family's wealth, track education corpus for children, 
            and monitor medical funds for elderly parents - all in one dashboard.
          </p>
          <Link to="/business-model" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ 
              background: '#fbbf24', 
              color: 'var(--primary)',
              fontSize: '1rem',
              padding: '1rem 2rem'
            }}>
              Upgrade to ET Elite <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Family <span style={{ color: '#fbbf24' }}>Command Center</span>
              <Crown size={28} color="#fbbf24" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
            </h2>
            <p style={{ color: 'var(--text-dim)' }}>
              Consolidated view of your entire family's financial health
            </p>
          </div>
          <button 
            onClick={() => setShowAddMember(true)}
            className="btn-primary"
            style={{ background: '#fbbf24', color: 'var(--primary)' }}
          >
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Add Member
          </button>
        </div>
      </header>

      {/* Family Summary Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Wallet size={20} color="#fbbf24" />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Household Income</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>
            ₹{(totalHouseholdIncome / 100000).toFixed(1)}L
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Per year
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <TrendingUp size={20} color="#fbbf24" />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Family Net Worth</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>
            ₹{(totalPortfolio / 10000000).toFixed(2)}Cr
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Combined portfolio
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <GraduationCap size={20} color="#fbbf24" />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Education Corpus</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>
            ₹{(totalEducationCorpus / 100000).toFixed(1)}L
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            For children
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Heart size={20} color="#fbbf24" />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Medical Fund</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>
            ₹{(totalMedicalFund / 100000).toFixed(1)}L
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            For parents
          </div>
        </div>
      </div>

      {/* Family Members Grid */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginBottom: '2rem' }}>
        {familyMembers.map((member) => {
          const roleConfig = MEMBER_ROLES[member.role] || { label: 'Member', icon: User, color: '#6b7280' };
          const Icon = roleConfig.icon;
          
          return (
            <div key={member.id} className="glass-panel" style={{ 
              padding: '1.5rem',
              opacity: member.isVisible ? 1 : 0.5,
              border: member.isVisible ? '1px solid rgba(251, 191, 36, 0.3)' : '1px dashed var(--glass-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    background: `${roleConfig.color}20`,
                    padding: '0.75rem',
                    borderRadius: '0.75rem'
                  }}>
                    <Icon size={24} color={roleConfig.color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{member.name}</h3>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: roleConfig.color,
                      background: `${roleConfig.color}20`,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem'
                    }}>
                      {roleConfig.label} • {member.age} years
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => togglePrivacyLock(member.id)}
                    style={{
                      background: 'var(--glass)',
                      border: 'none',
                      padding: '0.4rem',
                      borderRadius: '0.4rem',
                      cursor: 'pointer'
                    }}
                    title={member.privacyLocked ? 'Unlock data' : 'Lock data'}
                  >
                    {member.privacyLocked ? <Lock size={16} color="#fbbf24" /> : <Unlock size={16} color="var(--text-dim)" />}
                  </button>
                  <button
                    onClick={() => toggleMemberVisibility(member.id)}
                    style={{
                      background: 'var(--glass)',
                      border: 'none',
                      padding: '0.4rem',
                      borderRadius: '0.4rem',
                      cursor: 'pointer'
                    }}
                    title={member.isVisible ? 'Hide from totals' : 'Include in totals'}
                  >
                    {member.isVisible ? <Eye size={16} color="#10b981" /> : <EyeOff size={16} color="var(--text-dim)" />}
                  </button>
                </div>
              </div>

              {/* Member Financial Summary */}
              {!member.privacyLocked && (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {member.income && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Annual Income</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>₹{(member.income / 100000).toFixed(1)}L</span>
                    </div>
                  )}
                  {member.portfolio && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Portfolio</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>₹{(member.portfolio / 100000).toFixed(1)}L</span>
                    </div>
                  )}
                  {member.educationCorpus && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Education Fund</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#60a5fa' }}>₹{(member.educationCorpus / 100000).toFixed(1)}L</span>
                    </div>
                  )}
                  {member.medicalFund && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Medical Fund</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ef4444' }}>₹{(member.medicalFund / 100000).toFixed(1)}L</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Active Goals</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{member.goals}</span>
                  </div>
                </div>
              )}

              {member.privacyLocked && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem', 
                  background: 'var(--glass)', 
                  borderRadius: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Lock size={24} color="#fbbf24" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Data locked for privacy</span>
                  <button 
                    onClick={() => togglePrivacyLock(member.id)}
                    style={{ 
                      fontSize: '0.75rem', 
                      color: '#fbbf24', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Unlock to view
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="#fbbf24" />
          Elite Family Features
        </h3>
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <PiggyBank size={18} style={{ marginRight: '0.5rem' }} />
            Setup Joint Goals
          </button>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Shield size={18} style={{ marginRight: '0.5rem' }} />
            Family Insurance
          </button>
          <button className="btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Target size={18} style={{ marginRight: '0.5rem' }} />
            Legacy Planning
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyCenter;
