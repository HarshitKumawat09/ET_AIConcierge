import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, ArrowRight, Zap, RefreshCw, Wallet, PieChart, Target, Globe, Lock, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, PLAN_FEATURES } from '../contexts/AuthContext';

const PlanRestrictionBanner = ({ currentPlan }) => {
  if (currentPlan !== 'basic') return null;
  
  return (
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
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Unlock Advanced Portfolio Simulator</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Upgrade to ET Pro for AI optimization, advanced projections, and real fund recommendations
          </div>
        </div>
      </div>
      <Link to="/business-model" style={{ textDecoration: 'none' }}>
        <button className="btn-primary">
          Upgrade Now <ArrowRight size={18} />
        </button>
      </Link>
    </div>
  );
};

const PortfolioSimulator = () => {
  const { user, updateUserProfile, currentPlan } = useAuth();
  const planFeatures = PLAN_FEATURES[currentPlan];
  const [risk, setRisk] = useState(50);
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [timeHorizon, setTimeHorizon] = useState(12);
  const [optimized, setOptimized] = useState(currentPlan !== 'basic'); // Basic users can't use AI optimization by default
  const [showInvestModal, setShowInvestModal] = useState(false);

  // Initialize risk from user profile
  useEffect(() => {
    if (user?.riskAppetite) {
      const riskMap = { conservative: 30, moderate: 50, aggressive: 80 };
      setRisk(riskMap[user.riskAppetite] || 50);
    }
    if (user?.portfolio?.totalValue) {
      setInvestmentAmount(user.portfolio.totalValue || 100000);
    }
    // Reset optimized state when plan changes
    setOptimized(currentPlan !== 'basic');
  }, [user, currentPlan]);

  // Calculate realistic returns based on risk and time
  const calculateProjection = () => {
    const baseReturn = 8; // Base market return
    const riskMultiplier = risk / 50; // 0.6 to 1.6
    const aiAlpha = optimized ? 3 + (risk * 0.02) : 0; // AI adds 3-4.6% based on risk
    
    const monthlyReturn = ((baseReturn + aiAlpha) * riskMultiplier) / 12 / 100;
    const monthlyData = [];
    let currentValue = investmentAmount;
    
    for (let i = 1; i <= timeHorizon; i++) {
      // Add some volatility based on risk level
      const volatility = (risk / 100) * 0.05 * (Math.random() - 0.5);
      const monthlyGrowth = monthlyReturn + volatility;
      currentValue = currentValue * (1 + monthlyGrowth);
      monthlyData.push({
        month: i,
        value: currentValue,
        optimized: optimized,
        standardValue: investmentAmount * Math.pow(1 + (baseReturn / 12 / 100), i)
      });
    }
    
    return monthlyData;
  };

  const projectionData = calculateProjection();
  const finalValue = projectionData[projectionData.length - 1]?.value || investmentAmount;
  const standardFinalValue = projectionData[projectionData.length - 1]?.standardValue || investmentAmount;
  const totalReturn = ((finalValue - investmentAmount) / investmentAmount) * 100;
  const aiAlphaValue = finalValue - standardFinalValue;
  const annualizedReturn = (Math.pow(finalValue / investmentAmount, 12 / timeHorizon) - 1) * 100;

  // Get AI insight based on user profile
  const getAIInsight = () => {
    const insights = [];
    
    if (user?.riskAppetite === 'conservative' && risk > 50) {
      insights.push({
        type: 'warning',
        message: 'Your selected risk level is higher than your profile preference. Consider reducing exposure to volatile assets.',
        action: 'Adjust to Conservative'
      });
    }
    
    if (user?.financialGoal === 'tax' && timeHorizon < 36) {
      insights.push({
        type: 'tip',
        message: 'For tax saving under 80C, consider ELSS funds with 3-year lock-in for optimal tax benefits.',
        action: 'Explore ELSS'
      });
    }
    
    if (user?.financialGoal === 'retirement' && timeHorizon < 120) {
      insights.push({
        type: 'warning',
        message: 'Retirement planning typically requires 10+ years. Consider extending your investment horizon.',
        action: 'Extend Timeline'
      });
    }
    
    if (risk > 60 && !user?.portfolio?.diversified) {
      insights.push({
        type: 'suggestion',
        message: `At ${risk}% risk, diversify with Emerging Markets (15%), Mid-cap (20%), and Debt (25%) for optimal risk-adjusted returns.`,
        action: 'View Allocation'
      });
    }
    
    return insights.length > 0 ? insights[0] : {
      type: 'success',
      message: `Your portfolio is well-aligned with your ${user?.riskAppetite || 'moderate'} risk profile. Expected annual return: ${annualizedReturn.toFixed(1)}%`,
      action: 'Apply Strategy'
    };
  };

  const aiInsight = getAIInsight();

  const handleApplyStrategy = () => {
    updateUserProfile({
      portfolio: {
        ...user?.portfolio,
        totalValue: investmentAmount,
        riskLevel: risk,
        aiOptimized: optimized,
        expectedReturn: annualizedReturn,
        lastUpdated: new Date().toISOString()
      }
    });
    setShowInvestModal(true);
  };

  const maxValue = Math.max(...projectionData.map(d => d.value));
  const chartHeight = 250;

  return (
    <div className="fade-in">
      {/* Plan Restriction Banner for Basic Users */}
      <PlanRestrictionBanner currentPlan={currentPlan} />

      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Portfolio <span style={{ color: 'var(--accent)' }}>Simulator</span>
          {currentPlan === 'elite' && <Crown size={24} color="#fbbf24" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}
        </h2>
        <p style={{ color: 'var(--text-dim)' }}>
          {planFeatures.portfolioProjections 
            ? `Personalized projections based on your ${user?.riskAppetite || 'moderate'} risk profile and ${user?.financialGoal || 'wealth'} goals.`
            : 'Basic simulator with limited projections. Upgrade to Pro for AI-powered insights and advanced analytics.'
          }
        </p>
      </header>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Inputs Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Simulation Inputs</h3>
          
          {/* Investment Amount */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                <Wallet size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Investment Amount
              </label>
              <span style={{ fontWeight: '700', color: 'var(--accent)' }}>
                ₹{investmentAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              <span>₹10K</span>
              <span>₹1Cr</span>
            </div>
          </div>

          {/* Time Horizon */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                <Target size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Time Horizon
              </label>
              <span style={{ fontWeight: '700', color: 'var(--accent)' }}>{timeHorizon} months</span>
            </div>
            <input
              type="range"
              min="6"
              max="120"
              step="6"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              <span>6 months</span>
              <span>10 years</span>
            </div>
          </div>

          {/* Risk Slider */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                <PieChart size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Risk Appetite
              </label>
              <span style={{ fontWeight: '700', color: risk > 70 ? '#ef4444' : risk > 40 ? 'var(--accent)' : '#10b981' }}>
                {risk}% - {risk < 40 ? 'Conservative' : risk < 70 ? 'Moderate' : 'Aggressive'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={risk}
              onChange={(e) => setRisk(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* AI Optimization Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
              <Zap size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
              AI Optimization
              {!planFeatures.portfolioProjections && (
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: '#fbbf24', 
                  color: 'var(--primary)', 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: '0.25rem',
                  marginLeft: '0.5rem'
                }}>
                  PRO
                </span>
              )}
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => planFeatures.portfolioProjections && setOptimized(true)}
                disabled={!planFeatures.portfolioProjections}
                className={optimized ? 'btn-primary' : 'btn-secondary'}
                style={{ 
                  flex: 1, 
                  fontSize: '0.85rem', 
                  padding: '0.75rem',
                  opacity: planFeatures.portfolioProjections ? 1 : 0.5,
                  cursor: planFeatures.portfolioProjections ? 'pointer' : 'not-allowed'
                }}
              >
                {planFeatures.portfolioProjections ? (
                  'AI Optimized'
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Lock size={14} /> AI Optimized
                  </span>
                )}
              </button>
              <button
                onClick={() => setOptimized(false)}
                className={!optimized ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, fontSize: '0.85rem', padding: '0.75rem' }}
              >
                Standard
              </button>
            </div>
            {!planFeatures.portfolioProjections && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                <Link to="/business-model" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  Upgrade to Pro to unlock AI optimization
                </Link>
              </p>
            )}
          </div>

          {/* AI Insight Box */}
          <div style={{ 
            padding: '1rem', 
            background: aiInsight.type === 'warning' ? 'rgba(239, 68, 68, 0.1)' : aiInsight.type === 'tip' ? 'rgba(250, 204, 21, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
            border: `1px solid ${aiInsight.type === 'warning' ? 'rgba(239, 68, 68, 0.3)' : aiInsight.type === 'tip' ? 'rgba(250, 204, 21, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '0.75rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <AlertTriangle size={16} color={aiInsight.type === 'warning' ? '#ef4444' : aiInsight.type === 'tip' ? '#facc15' : '#10b981'} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: aiInsight.type === 'warning' ? '#ef4444' : aiInsight.type === 'tip' ? '#facc15' : '#10b981' }}>
                AI Insight
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              {aiInsight.message}
            </p>
          </div>
        </div>

        {/* Chart Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              Performance Projection ({timeHorizon} Months)
            </h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '3px' }}></div>
                {optimized ? 'AI Optimized' : 'Current Strategy'}
              </div>
              {optimized && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--text-dim)', borderRadius: '3px', opacity: 0.3 }}></div>
                  Standard
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div style={{ flex: 1, position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'flex-end', gap: '0.5rem', paddingBottom: '2rem' }}>
            {projectionData.map((data, i) => {
              const height = (data.value / maxValue) * chartHeight;
              const standardHeight = optimized ? (data.standardValue / maxValue) * chartHeight : 0;
              const isLast = i === projectionData.length - 1;
              
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center', position: 'relative' }}>
                  {optimized && (
                    <div style={{
                      width: '60%',
                      height: `${standardHeight}px`,
                      background: 'var(--text-dim)',
                      opacity: 0.2,
                      borderRadius: '0.25rem 0.25rem 0 0'
                    }} />
                  )}
                  <div style={{
                    width: '100%',
                    height: `${height}px`,
                    background: isLast ? 'linear-gradient(to top, var(--accent), #818cf8)' : 'var(--accent)',
                    borderRadius: '0.25rem 0.25rem 0 0',
                    transition: 'height 0.3s ease-out',
                    position: 'relative'
                  }}>
                    {isLast && (
                      <div style={{
                        position: 'absolute',
                        top: '-2.5rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--success)',
                        color: 'var(--primary)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap'
                      }}>
                        +{totalReturn.toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', position: 'absolute', bottom: '-1.5rem' }}>
                    M{i + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div style={{ 
            marginTop: '1.5rem', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1.5rem',
            borderTop: '1px solid var(--glass-border)', 
            paddingTop: '1.5rem' 
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Projected Value</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)' }}>
                  ₹{Math.round(finalValue).toLocaleString()}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>(+{totalReturn.toFixed(1)}%)</span>
            </div>
            
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>AI Alpha Generated</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent)' }}>
                  ₹{Math.round(aiAlphaValue).toLocaleString()}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>extra value</span>
            </div>
            
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Annualized Return</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent)' }}>
                  {annualizedReturn.toFixed(1)}%
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>per year</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              onClick={handleApplyStrategy}
              className="btn-primary" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <RefreshCw size={18} style={{ marginRight: '0.5rem' }} />
              Apply to Portfolio
            </button>
            <button 
              onClick={() => setShowInvestModal(true)}
              className="btn-secondary" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Start Investing <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Invest Modal - Real Investment Recommendations */}
      {showInvestModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="glass-panel" style={{ 
            padding: '2rem', 
            maxWidth: '900px', 
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Recommended Investment Options
                </h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  Curated for your {user?.riskAppetite} risk profile & {user?.financialGoal} goals
                </p>
              </div>
              <button 
                onClick={() => setShowInvestModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.5rem' }}
              >
                ×
              </button>
            </div>

            {/* Asset Allocation Summary */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '1rem',
              marginBottom: '2rem',
              padding: '1rem',
              background: 'rgba(56, 189, 248, 0.05)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(56, 189, 248, 0.2)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent)' }}>
                  {risk < 40 ? '40%' : risk < 70 ? '35%' : '25%'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Large Cap</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent)' }}>
                  {risk < 40 ? '15%' : risk < 70 ? '25%' : '35%'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Mid/Small Cap</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent)' }}>
                  {risk < 40 ? '35%' : risk < 70 ? '25%' : '15%'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Debt/Bonds</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent)' }}>
                  {risk < 40 ? '10%' : risk < 70 ? '15%' : '25%'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>International</div>
              </div>
            </div>

            {/* Investment Options by Category */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              
              {/* Equity Mutual Funds */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="var(--accent)" />
                  Top Equity Mutual Funds
                  <span style={{ fontSize: '0.7rem', background: 'var(--accent)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                    SEBI Registered
                  </span>
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[
                    { name: 'SBI Bluechip Fund', type: 'Large Cap', returns: '15.2%', risk: 'Moderate', link: 'https://www.sbimf.com' },
                    { name: 'HDFC Mid-Cap Opportunities', type: 'Mid Cap', returns: '22.1%', risk: 'High', link: 'https://www.hdfcfund.com' },
                    { name: 'Axis Small Cap Fund', type: 'Small Cap', returns: '28.5%', risk: 'Very High', link: 'https://www.axismf.com' },
                    ...(user?.riskAppetite === 'aggressive' ? [{ name: 'Parag Parikh Flexi Cap', type: 'Flexi Cap', returns: '18.9%', risk: 'High', link: 'https://www.ppfas.com' }] : [])
                  ].map((fund, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '1rem', 
                      background: 'var(--glass)', 
                      borderRadius: '0.75rem',
                      border: '1px solid var(--glass-border)'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{fund.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{fund.type} • {fund.risk} Risk</div>
                      </div>
                      <div style={{ textAlign: 'right', marginRight: '1.5rem' }}>
                        <div style={{ fontWeight: '700', color: 'var(--success)' }}>{fund.returns}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>3Y Returns</div>
                      </div>
                      <a 
                        href={fund.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                      >
                        Invest
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Saver ELSS (Conditional) */}
              {user?.financialGoal === 'tax' && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="#facc15" />
                    Tax Saver ELSS Funds (80C)
                    <span style={{ fontSize: '0.7rem', background: '#facc15', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                      Tax Benefit
                    </span>
                  </h4>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {[
                      { name: 'Quant Tax Plan', returns: '32.1%', lockin: '3 Years', link: 'https://www.quantmutual.com' },
                      { name: 'Canara Robeco Equity Taxsaver', returns: '18.5%', lockin: '3 Years', link: 'https://www.canararobeco.com' },
                      { name: 'Mirae Asset Tax Saver', returns: '20.8%', lockin: '3 Years', link: 'https://www.miraeassetmf.co.in' }
                    ].map((fund, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '1rem', 
                        background: 'rgba(250, 204, 21, 0.05)', 
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(250, 204, 21, 0.2)'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{fund.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Lock-in: {fund.lockin}</div>
                        </div>
                        <div style={{ textAlign: 'right', marginRight: '1.5rem' }}>
                          <div style={{ fontWeight: '700', color: 'var(--success)' }}>{fund.returns}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>3Y Returns</div>
                        </div>
                        <a 
                          href={fund.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none', background: '#facc15', color: 'var(--primary)' }}
                        >
                          Save Tax
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Debt Funds */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wallet size={18} color="#10b981" />
                  Debt Funds for Stability
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[
                    { name: 'ICICI Prudential Corporate Bond', returns: '7.8%', category: 'Corporate Bond', link: 'https://www.icicipruamc.com' },
                    { name: 'HDFC Short Term Debt', returns: '7.2%', category: 'Short Duration', link: 'https://www.hdfcfund.com' },
                    ...(user?.riskAppetite === 'conservative' ? [{ name: 'SBI Savings Fund', returns: '6.8%', category: 'Ultra Short', link: 'https://www.sbimf.com' }] : [])
                  ].map((fund, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '1rem', 
                      background: 'rgba(16, 185, 129, 0.05)', 
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{fund.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{fund.category}</div>
                      </div>
                      <div style={{ textAlign: 'right', marginRight: '1.5rem' }}>
                        <div style={{ fontWeight: '700', color: '#10b981' }}>{fund.returns}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>3Y Returns</div>
                      </div>
                      <a 
                        href={fund.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-secondary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                      >
                        Explore
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* International Equity */}
              {risk > 50 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={18} color="#818cf8" />
                    International Diversification
                  </h4>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {[
                      { name: 'Motilal Oswal Nasdaq 100 Fund', returns: '24.5%', category: 'US Tech', link: 'https://www.motilaloswalamc.com' },
                      { name: 'SBI International Access', returns: '18.2%', category: 'Global Equity', link: 'https://www.sbimf.com' }
                    ].map((fund, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '1rem', 
                        background: 'rgba(129, 140, 248, 0.05)', 
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(129, 140, 248, 0.2)'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{fund.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{fund.category}</div>
                        </div>
                        <div style={{ textAlign: 'right', marginRight: '1.5rem' }}>
                          <div style={{ fontWeight: '700', color: '#818cf8' }}>{fund.returns}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>3Y Returns</div>
                        </div>
                        <a 
                          href={fund.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-secondary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                        >
                          Explore
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Investment Platforms */}
              <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Recommended Investment Platforms
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { name: 'Zerodha Coin', desc: 'Direct Mutual Funds', link: 'https://coin.zerodha.com', logo: 'Z' },
                    { name: 'Groww', desc: '0% Commission', link: 'https://groww.in', logo: 'G' },
                    { name: 'ETMONEY', desc: 'ET Prime Benefits', link: 'https://etmoney.com', logo: 'ET' }
                  ].map((platform, i) => (
                    <a 
                      key={i}
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        padding: '1rem', 
                        background: 'var(--glass)', 
                        borderRadius: '0.75rem',
                        border: '1px solid var(--glass-border)',
                        textDecoration: 'none',
                        color: 'white',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: 'var(--accent)', 
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.5rem',
                        fontWeight: '700',
                        color: 'var(--primary)'
                      }}>
                        {platform.logo}
                      </div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{platform.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{platform.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                <strong style={{ color: '#ef4444' }}>Disclaimer:</strong> Mutual fund investments are subject to market risks. 
                Past performance is not indicative of future returns. Please read all scheme related documents carefully. 
                These are real SEBI-registered mutual funds. Clicking invest will take you to official AMC websites.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSimulator;
