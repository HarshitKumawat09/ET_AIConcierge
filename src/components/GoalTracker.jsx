import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  PiggyBank, 
  Home, 
  GraduationCap, 
  Plane, 
  Heart,
  Car,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GOAL_ICONS = {
  retirement: Target,
  home: Home,
  education: GraduationCap,
  travel: Plane,
  emergency: Heart,
  car: Car,
  wealth: PiggyBank,
  other: Target
};

const GOAL_COLORS = {
  retirement: '#8b5cf6',
  home: '#f59e0b',
  education: '#3b82f6',
  travel: '#06b6d4',
  emergency: '#ef4444',
  car: '#10b981',
  wealth: '#84cc16',
  other: '#6b7280'
};

const GoalCard = ({ goal, onEdit, onDelete, monthlySIP }) => {
  const Icon = GOAL_ICONS[goal.type] || Target;
  const color = GOAL_COLORS[goal.type] || '#6b7280';
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const remaining = goal.target - goal.current;
  const isOnTrack = goal.monthlyContribution >= monthlySIP;
  
  // Calculate time to reach goal
  const monthsToGoal = remaining > 0 && goal.monthlyContribution > 0 
    ? Math.ceil(remaining / goal.monthlyContribution)
    : Infinity;
  const yearsToGoal = Math.ceil(monthsToGoal / 12);
  
  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Progress Background */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'var(--glass)'
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: color,
          transition: 'width 0.5s ease'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: `rgba(${color.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.1)`,
            padding: '0.75rem',
            borderRadius: '0.75rem'
          }}>
            <Icon size={24} color={color} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{goal.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Target: {new Date(goal.targetDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onEdit(goal)}
            style={{ 
              background: 'var(--glass)', 
              border: 'none', 
              padding: '0.5rem', 
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Edit2 size={16} color="var(--text-dim)" />
          </button>
          <button 
            onClick={() => onDelete(goal.id)}
            style={{ 
              background: 'var(--glass)', 
              border: 'none', 
              padding: '0.5rem', 
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={16} color="#ef4444" />
          </button>
        </div>
      </div>

      {/* Progress Circle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="var(--glass)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{Math.round(progress)}%</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Current</span>
            <span style={{ fontSize: '1rem', fontWeight: '600' }}>₹{goal.current.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Target</span>
            <span style={{ fontSize: '1rem', fontWeight: '600' }}>₹{goal.target.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Remaining</span>
            <span style={{ fontSize: '1rem', fontWeight: '600', color }}>₹{remaining.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Monthly Contribution */}
      <div style={{ 
        padding: '1rem', 
        background: 'var(--glass)', 
        borderRadius: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Monthly SIP</span>
          <span style={{ fontSize: '1rem', fontWeight: '600' }}>₹{goal.monthlyContribution.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Required SIP</span>
          <span style={{ fontSize: '1rem', fontWeight: '600', color: isOnTrack ? '#10b981' : '#ef4444' }}>
            ₹{Math.round(monthlySIP).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isOnTrack ? (
          <>
            <CheckCircle2 size={16} color="#10b981" />
            <span style={{ fontSize: '0.85rem', color: '#10b981' }}>
              On track • {yearsToGoal === 0 ? 'Less than a year' : `${yearsToGoal} year${yearsToGoal > 1 ? 's' : ''}`} to goal
            </span>
          </>
        ) : (
          <>
            <AlertCircle size={16} color="#ef4444" />
            <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>
              Increase SIP by ₹{Math.round(monthlySIP - goal.monthlyContribution).toLocaleString()}/month to reach on time
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const GoalModal = ({ isOpen, onClose, onSave, goal, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'retirement',
    target: '',
    current: '',
    targetDate: '',
    monthlyContribution: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        type: goal.type,
        target: goal.target,
        current: goal.current,
        targetDate: goal.targetDate,
        monthlyContribution: goal.monthlyContribution
      });
    } else {
      setFormData({
        name: '',
        type: 'retirement',
        target: '',
        current: '',
        targetDate: '',
        monthlyContribution: ''
      });
    }
  }, [goal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: goal?.id || Date.now(),
      target: parseInt(formData.target),
      current: parseInt(formData.current),
      monthlyContribution: parseInt(formData.monthlyContribution)
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{ 
        padding: '2rem', 
        maxWidth: '500px', 
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          {goal ? 'Edit Goal' : 'Add New Goal'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
              Goal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Dream Home, Child's Education"
              required
              style={{
                width: '100%',
                background: 'var(--primary)',
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
              Goal Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{
                width: '100%',
                background: 'var(--primary)',
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="retirement">Retirement</option>
              <option value="home">Buy Home</option>
              <option value="education">Child Education</option>
              <option value="travel">Travel/Vacation</option>
              <option value="emergency">Emergency Fund</option>
              <option value="car">Buy Car</option>
              <option value="wealth">Wealth Building</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                Target Amount (₹)
              </label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="5000000"
                required
                style={{
                  width: '100%',
                  background: 'var(--primary)',
                  border: '1px solid var(--glass-border)',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                Current Savings (₹)
              </label>
              <input
                type="number"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                placeholder="0"
                style={{
                  width: '100%',
                  background: 'var(--primary)',
                  border: '1px solid var(--glass-border)',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
              Target Date
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              required
              style={{
                width: '100%',
                background: 'var(--primary)',
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
              Monthly SIP Contribution (₹)
            </label>
            <input
              type="number"
              value={formData.monthlyContribution}
              onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
              placeholder="10000"
              required
              style={{
                width: '100%',
                background: 'var(--primary)',
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GoalTracker = () => {
  const { user, updateUserProfile } = useAuth();
  const [goals, setGoals] = useState(user?.goals || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Save goals to user profile
  useEffect(() => {
    updateUserProfile({ goals });
  }, [goals]);

  const handleAddGoal = (goalData) => {
    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? goalData : g));
    } else {
      setGoals([...goals, goalData]);
    }
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  // Calculate monthly SIP needed for each goal
  const calculateRequiredSIP = (goal) => {
    const remaining = goal.target - goal.current;
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const monthsRemaining = Math.max(1, Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24 * 30)));
    return remaining / monthsRemaining;
  };

  // Summary stats
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
  const totalMonthlySIP = goals.reduce((sum, g) => sum + g.monthlyContribution, 0);
  const totalRequiredSIP = goals.reduce((sum, g) => sum + calculateRequiredSIP(g), 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>
            Goal <span style={{ color: 'var(--accent)' }}>Tracker</span>
          </h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            Add Goal
          </button>
        </div>
        <p style={{ color: 'var(--text-dim)' }}>
          Track your financial goals and stay on course to achieve your dreams
        </p>
      </header>

      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Target size={24} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Total Goals</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{goals.length}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <TrendingUp size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Overall Progress</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{Math.round(overallProgress)}%</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <PiggyBank size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Total Saved</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>₹{totalCurrent.toLocaleString()}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Calculator size={24} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Monthly SIP</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>₹{totalMonthlySIP.toLocaleString()}</div>
        </div>
      </div>

      {/* SIP Status Alert */}
      {totalMonthlySIP < totalRequiredSIP && goals.length > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '1rem',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <AlertCircle size={24} color="#f59e0b" />
          <div>
            <div style={{ fontWeight: '600', color: '#f59e0b' }}>
              Increase your monthly investments
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              You're investing ₹{totalMonthlySIP.toLocaleString()} but need ₹{Math.round(totalRequiredSIP).toLocaleString()}/month 
              to reach all goals on time. Shortfall: ₹{Math.round(totalRequiredSIP - totalMonthlySIP).toLocaleString()}/month
            </div>
          </div>
          <Link to="/simulator" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '0.85rem' }}>
              Optimize <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="glass-panel" style={{ 
          padding: '3rem', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: 'var(--glass)',
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <Sparkles size={48} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Start Your Financial Journey</h3>
          <p style={{ color: 'var(--text-dim)', maxWidth: '400px' }}>
            Create your first financial goal - whether it's buying a home, planning for retirement, 
            or building an emergency fund. We'll help you track and achieve it!
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
            style={{ marginTop: '1rem' }}
          >
            <Plus size={18} style={{ marginRight: '0.5rem' }} />
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              monthlySIP={calculateRequiredSIP(goal)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddGoal}
        goal={editingGoal}
        user={user}
      />
    </div>
  );
};

export default GoalTracker;
