import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ChevronRight, ChevronLeft, Wallet, TrendingUp, Shield, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    income: '',
    financialGoal: '',
    riskAppetite: '',
    investmentExperience: '',
    currentInvestments: [],
    hasInsurance: false,
    taxBracket: ''
  });

  const financialGoals = [
    { id: 'wealth', label: 'Wealth Creation', icon: TrendingUp },
    { id: 'retirement', label: 'Retirement Planning', icon: Target },
    { id: 'tax', label: 'Tax Saving', icon: Shield },
    { id: 'emergency', label: 'Emergency Fund', icon: Wallet }
  ];

  const riskLevels = [
    { id: 'conservative', label: 'Conservative', desc: 'I prefer safety over returns' },
    { id: 'moderate', label: 'Moderate', desc: 'I want balanced growth' },
    { id: 'aggressive', label: 'Aggressive', desc: 'I can handle market volatility' }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', desc: 'New to investing' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
    { id: 'expert', label: 'Expert', desc: 'Experienced investor' }
  ];

  const incomeRanges = [
    { id: '0-5', label: 'Below ₹5 Lakhs' },
    { id: '5-10', label: '₹5 - 10 Lakhs' },
    { id: '10-25', label: '₹10 - 25 Lakhs' },
    { id: '25+', label: 'Above ₹25 Lakhs' }
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = signup(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const renderStep1 = () => (
    <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
        Create Your Account
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.75rem',
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.75rem',
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              style={{
                width: '100%',
                padding: '0.875rem 2.75rem 0.875rem 2.75rem',
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button onClick={handleNext} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>
        Your Financial Profile
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        This helps us personalize your experience
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-dim)' }}>
            What is your primary financial goal?
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {financialGoals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setFormData({ ...formData, financialGoal: goal.id })}
                style={{
                  padding: '1rem',
                  background: formData.financialGoal === goal.id ? 'var(--accent)' : 'var(--glass)',
                  border: `1px solid ${formData.financialGoal === goal.id ? 'var(--accent)' : 'var(--glass-border)'}`,
                  borderRadius: '0.75rem',
                  color: formData.financialGoal === goal.id ? 'var(--primary)' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <goal.icon size={24} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{goal.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-dim)' }}>
            Annual Income Range
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {incomeRanges.map((range) => (
              <button
                key={range.id}
                type="button"
                onClick={() => setFormData({ ...formData, income: range.id })}
                style={{
                  padding: '0.875rem 1rem',
                  background: formData.income === range.id ? 'rgba(56, 189, 248, 0.2)' : 'var(--glass)',
                  border: `1px solid ${formData.income === range.id ? 'var(--accent)' : 'var(--glass-border)'}`,
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem'
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleBack} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            <ChevronLeft size={18} /> Back
          </button>
          <button 
            onClick={handleNext} 
            className="btn-primary" 
            style={{ flex: 1, justifyContent: 'center' }}
            disabled={!formData.financialGoal || !formData.income}
          >
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>
        Investment Preferences
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        How do you approach investing?
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-dim)' }}>
            What is your risk appetite?
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {riskLevels.map((risk) => (
              <button
                key={risk.id}
                type="button"
                onClick={() => setFormData({ ...formData, riskAppetite: risk.id })}
                style={{
                  padding: '1rem',
                  background: formData.riskAppetite === risk.id ? 'rgba(56, 189, 248, 0.2)' : 'var(--glass)',
                  border: `1px solid ${formData.riskAppetite === risk.id ? 'var(--accent)' : 'var(--glass-border)'}`,
                  borderRadius: '0.75rem',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{risk.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{risk.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-dim)' }}>
            Investment Experience
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {experienceLevels.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setFormData({ ...formData, investmentExperience: exp.id })}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: formData.investmentExperience === exp.id ? 'var(--accent)' : 'var(--glass)',
                  border: `1px solid ${formData.investmentExperience === exp.id ? 'var(--accent)' : 'var(--glass-border)'}`,
                  borderRadius: '0.75rem',
                  color: formData.investmentExperience === exp.id ? 'var(--primary)' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{exp.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" onClick={handleBack} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            <ChevronLeft size={18} /> Back
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ flex: 1, justifyContent: 'center' }}
            disabled={!formData.riskAppetite || !formData.investmentExperience || loading}
          >
            {loading ? 'Creating Account...' : 'Complete Setup'}
          </button>
        </div>
      </form>
    </>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderRadius: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <img 
              src="/logo1.png" 
              alt="AI Concierge by The Economic Times" 
              style={{ 
                height: '56px',
                width: 'auto',
                display: 'block',
                objectFit: 'contain'
              }} 
            />
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: i === step ? '2rem' : '0.5rem',
                height: '0.5rem',
                background: i <= step ? 'var(--accent)' : 'var(--glass-border)',
                borderRadius: '0.25rem',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
