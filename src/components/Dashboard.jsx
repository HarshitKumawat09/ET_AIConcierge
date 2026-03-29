import React from 'react';
import { TrendingUp, ShieldCheck, Wallet, ChevronRight, Activity, PieChart, Info, Target, AlertCircle, Zap, Lock, Crown, Star, Calculator, Receipt } from 'lucide-react';
import { useAuth, PLAN_FEATURES } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div style={{ 
        background: `${color}20`, 
        color: color, 
        padding: '0.5rem', 
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} />
      </div>
      <span style={{ 
        color: change.startsWith('+') ? 'var(--success)' : 'var(--danger)', 
        fontSize: '0.85rem', 
        fontWeight: '600',
        background: change.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        padding: '0.25rem 0.5rem',
        borderRadius: '1rem'
      }}>
        {change}
      </span>
    </div>
    <h3 style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</p>
  </div>
);

const GapItem = ({ title, desc, icon: Icon, action, priority, locked }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1rem', 
    padding: '1rem', 
    background: locked ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.02)', 
    borderRadius: '0.75rem',
    border: `1px solid ${locked ? 'rgba(107, 114, 128, 0.3)' : 'var(--glass-border)'}`,
    marginBottom: '1rem',
    opacity: locked ? 0.6 : 1
  }}>
    <div style={{ 
      background: locked ? 'rgba(107, 114, 128, 0.2)' : priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass)', 
      padding: '0.5rem', 
      borderRadius: '0.5rem', 
      color: locked ? '#6b7280' : priority === 'high' ? '#ef4444' : 'var(--warning)',
      border: !locked && priority === 'high' ? '1px solid rgba(239, 68, 68, 0.3)' : 'none'
    }}>
      {locked ? <Lock size={20} /> : <Icon size={20} />}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{title}</h4>
        {priority === 'high' && !locked && (
          <span style={{ fontSize: '0.65rem', background: '#ef4444', color: 'white', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>HIGH</span>
        )}
        {locked && (
          <span style={{ fontSize: '0.65rem', background: '#6b7280', color: 'white', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>PRO</span>
        )}
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{desc}</p>
    </div>
    <Link to="/business-model" style={{ textDecoration: 'none' }}>
      <button 
        className={locked ? "btn-secondary" : "btn-secondary"} 
        style={{ 
          padding: '0.5rem 1rem', 
          fontSize: '0.85rem',
          opacity: locked ? 0.8 : 1,
          background: locked ? 'rgba(56, 189, 248, 0.2)' : undefined
        }}
      >
        {locked ? 'Upgrade' : action}
      </button>
    </Link>
  </div>
);

const Dashboard = () => {
  const { user, currentPlan, hasFeature } = useAuth();
  const planFeatures = PLAN_FEATURES[currentPlan];

  // Calculate optimization score based on profile completeness
  const calculateOptimizationScore = () => {
    let score = 50; // Base score
    if (user?.financialGoal) score += 10;
    if (user?.riskAppetite) score += 10;
    if (user?.income) score += 10;
    if (user?.portfolio?.totalValue > 0) score += 10;
    if (user?.investmentExperience) score += 10;
    return Math.min(score, 100);
  };

  const optimizationScore = calculateOptimizationScore();

  // Get personalized greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get personalized gaps based on user profile and plan tier
  const getPersonalizedGaps = () => {
    const gaps = [];
    
    // Basic users only see 1 gap with upgrade prompt for more
    if (!planFeatures.gapAnalysis) {
      gaps.push({
        title: 'Tax Savings Opportunity',
        desc: 'Unlock AI-powered gap analysis to see all your financial opportunities.',
        icon: Info,
        action: 'Explore',
        priority: 'high',
        locked: false
      });
      return gaps;
    }
    
    if (user?.financialGoal === 'tax') {
      gaps.push({
        title: 'Tax Savings Opportunity',
        desc: 'You have ₹45,000 remaining in 80C limits. Consider ELSS funds for triple benefits.',
        icon: Info,
        action: 'Explore ELSS',
        priority: 'high',
        locked: false
      });
    }
    
    if (user?.financialGoal === 'retirement') {
      gaps.push({
        title: 'Retirement Corpus Gap',
        desc: 'Based on your age and income, increase NPS contribution by ₹5,000/month.',
        icon: Target,
        action: 'Start NPS',
        priority: 'high',
        locked: false
      });
    }
    
    if (user?.riskAppetite === 'conservative' && !user?.hasInsurance) {
      gaps.push({
        title: 'Insurance Coverage Gap',
        desc: 'Your life cover should be at least 10x your annual income. Current: Underinsured.',
        icon: ShieldCheck,
        action: 'Get Quote',
        priority: 'high',
        locked: false
      });
    }
    
    if (user?.riskAppetite === 'aggressive' || user?.investmentExperience === 'expert') {
      gaps.push({
        title: 'Portfolio Diversification',
        desc: 'Add international exposure. Consider US tech funds for 15% allocation.',
        icon: PieChart,
        action: 'View Options',
        priority: 'medium',
        locked: false
      });
    }
    
    // Add locked gaps for basic users
    if (currentPlan === 'basic') {
      gaps.push({
        title: 'Emergency Fund Analysis',
        desc: 'AI-powered emergency fund recommendations. Upgrade to Pro to unlock.',
        icon: AlertCircle,
        action: 'Upgrade',
        priority: 'medium',
        locked: true
      });
    }
    
    // Default gap if no specific gaps found
    if (gaps.filter(g => !g.locked).length === 0) {
      gaps.unshift({
        title: 'Emergency Fund',
        desc: 'Build 6-month expenses reserve. Target: ₹3,00,000. Current: ₹1,20,000.',
        icon: AlertCircle,
        action: 'Set Up SIP',
        priority: 'medium',
        locked: false
      });
    }
    
    return gaps.slice(0, currentPlan === 'basic' ? 2 : 4); // Basic: max 2, others: max 4
  };

  // Get personalized ET Prime content
  const getPersonalizedContent = () => {
    const contents = {
      wealth: {
        title: 'Wealth Building Strategies',
        desc: 'Top 5 mutual funds for long-term wealth creation'
      },
      tax: {
        title: 'Tax Saving Masterclass',
        desc: 'Complete guide to Section 80C, 80D, and NPS deductions'
      },
      retirement: {
        title: 'Retirement Planning 101',
        desc: 'How to build a ₹5 crore retirement corpus'
      },
      emergency: {
        title: 'Emergency Fund Essentials',
        desc: 'Building financial resilience in uncertain times'
      }
    };
    
    return contents[user?.financialGoal] || contents.wealth;
  };

  // Get net worth estimate based on income
  const getEstimatedNetWorth = () => {
    const incomeMap = {
      '0-5': 250000,
      '5-10': 750000,
      '10-25': 2500000,
      '25+': 8000000
    };
    return user?.portfolio?.totalValue || incomeMap[user?.income] || 500000;
  };

  const personalizedGaps = getPersonalizedGaps();
  const personalizedContent = getPersonalizedContent();
  const netWorth = getEstimatedNetWorth();
  const formattedNetWorth = `₹${(netWorth / 100000).toFixed(2)}L`;

  return (
    <div className="fade-in">
      {/* Plan Upgrade Banner for Basic Users */}
      {currentPlan === 'basic' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(129, 140, 248, 0.15) 100%)',
          padding: '1rem 1.5rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          border: '1px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'var(--accent)',
              padding: '0.75rem',
              borderRadius: '0.75rem'
            }}>
              <Star size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Unlock Full Potential with ET Pro</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Get AI gap analysis, real-time alerts, and unlimited portfolio projections
              </div>
            </div>
          </div>
          <Link to="/business-model" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">
              Upgrade Now <ChevronRight size={18} />
            </button>
          </Link>
        </div>
      )}

      {/* Tax Deadline Alert */}
      {(new Date().getMonth() >= 0 && new Date().getMonth() <= 2) && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '1rem 1.5rem',
          borderRadius: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: '#ef4444',
            padding: '0.75rem',
            borderRadius: '0.75rem'
          }}>
            <Receipt size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#ef4444', marginBottom: '0.25rem' }}>
              Tax Filing Deadline: March 31, {new Date().getFullYear()}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              {Math.ceil((new Date(`${new Date().getFullYear()}-03-31`) - new Date()) / (1000 * 60 * 60 * 24))} days left to invest in 80C, 80D and file returns
            </div>
          </div>
          <Link to="/tax-planner" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ background: '#ef4444' }}>
              Plan Taxes <ChevronRight size={18} />
            </button>
          </Link>
        </div>
      )}

      {/* Goals Summary */}
      {user?.goals && user.goals.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--accent)" />
              Active Goals Progress
            </h3>
            <Link to="/goals" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {user.goals.slice(0, 3).map((goal, index) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              const colors = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
              const color = colors[index % colors.length];
              return (
                <div key={goal.id} style={{ flex: '1 1 200px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{goal.name}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ 
                    height: '6px', 
                    background: 'var(--glass)', 
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: color,
                      borderRadius: '3px'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span>₹{goal.current.toLocaleString()}</span>
                    <span>₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          {getGreeting()}, <span style={{ color: 'var(--accent)' }}>{user?.name || 'Investor'}</span>
        </h2>
        <p style={{ color: 'var(--text-dim)' }}>
          Your financial life is <span style={{ color: optimizationScore > 70 ? 'var(--success)' : 'var(--warning)' }}>{optimizationScore}% optimized</span>. 
          {optimizationScore < 80 ? "Let's close those gaps." : "You're on track!"}
          {!planFeatures.gapAnalysis && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
              (<Link to="/business-model" style={{ color: 'var(--accent)' }}>Upgrade to see AI analysis</Link>)
            </span>
          )}
        </p>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
        <StatCard 
          title="Net Worth" 
          value={formattedNetWorth} 
          change={user?.portfolio?.returns > 0 ? `+${user.portfolio.returns.toFixed(1)}%` : '+12.5%'} 
          icon={Wallet} 
          color="#38bdf8" 
        />
        <StatCard 
          title="Portfolio Health" 
          value={user?.riskAppetite ? user.riskAppetite.charAt(0).toUpperCase() + user.riskAppetite.slice(1) : 'Moderate'} 
          change={optimizationScore > 70 ? 'On Track' : 'Needs Attention'} 
          icon={Activity} 
          color={optimizationScore > 70 ? '#10b981' : '#f59e0b'} 
        />
        <StatCard 
          title="Active Goals" 
          value={user?.financialGoal ? '1 / 1' : '0 / 1'} 
          change={user?.financialGoal ? user.financialGoal.toUpperCase() : 'Set Goal'} 
          icon={Target} 
          color="#facc15" 
        />
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>
              Personalized Action Items {planFeatures.gapAnalysis && '(AI Detected)'}
            </h3>
            {currentPlan !== 'basic' ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', cursor: 'pointer' }}>
                Run Full Audit <ChevronRight size={16} />
              </span>
            ) : (
              <Link to="/business-model" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>
                Unlock Full Analysis <ChevronRight size={16} />
              </Link>
            )}
          </div>
          
          {personalizedGaps.map((gap, index) => (
            <GapItem 
              key={index}
              title={gap.title}
              desc={gap.desc}
              icon={gap.icon}
              action={gap.action}
              priority={gap.priority}
              locked={gap.locked}
            />
          ))}

          {currentPlan === 'basic' && (
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: 'rgba(56, 189, 248, 0.05)',
              borderRadius: '0.75rem',
              border: '1px dashed var(--glass-border)'
            }}>
              <Lock size={24} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                3 more AI-detected gaps hidden
              </p>
              <Link to="/business-model" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>
                  Upgrade to ET Pro
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ 
          padding: '1.5rem', 
          background: planFeatures.etPrimeAccess 
            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(0, 0, 0, 0))' 
            : 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(0, 0, 0, 0))',
          opacity: planFeatures.etPrimeAccess ? 1 : 0.8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            {planFeatures.etPrimeAccess ? (
              <Zap size={18} color="var(--accent)" />
            ) : (
              <Crown size={18} color="#fbbf24" />
            )}
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
              {planFeatures.etPrimeAccess ? 'ET Prime for You' : 'ET Prime Content'}
            </h3>
          </div>
          <div style={{ 
            borderLeft: `2px solid ${planFeatures.etPrimeAccess ? 'var(--accent)' : '#fbbf24'}`, 
            paddingLeft: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{personalizedContent.title}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{personalizedContent.desc}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            {user?.riskAppetite === 'aggressive' && planFeatures.etPrimeAccess && (
              <span style={{ fontSize: '0.7rem', background: 'rgba(56, 189, 248, 0.2)', color: 'var(--accent)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>High Growth</span>
            )}
            {user?.financialGoal === 'tax' && planFeatures.etPrimeAccess && (
              <span style={{ fontSize: '0.7rem', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>Tax Saver</span>
            )}
          </div>
          
          {planFeatures.etPrimeAccess ? (
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Read Article <ChevronRight size={16} />
            </button>
          ) : (
            <Link to="/business-model" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ 
                width: '100%', 
                justifyContent: 'center',
                background: 'rgba(251, 191, 36, 0.2)',
                borderColor: '#fbbf24'
              }}>
                <Crown size={16} style={{ marginRight: '0.5rem' }} /> Unlock ET Prime
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
