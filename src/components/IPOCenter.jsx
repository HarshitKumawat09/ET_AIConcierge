import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Sparkles,
  Percent,
  Smartphone,
  Building2,
  Target,
  Shield,
  ChevronRight,
  Download,
  BarChart3,
  Wallet,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock IPO Data - In real app, this would come from an API
const UPCOMING_IPOS = [
  {
    id: 1,
    name: "TechVision Analytics",
    company: "TechVision Analytics Ltd",
    sector: "Technology",
    priceBand: "₹450 - ₹475",
    lotSize: 31,
    issueSize: "₹1,250 Cr",
    gmp: "₹125",
    gmpPercent: 26.3,
    subscription: {
      retail: 8.5,
      nii: 12.3,
      qib: 4.2,
      overall: 7.8
    },
    openDate: "2026-03-30",
    closeDate: "2026-04-01",
    allotmentDate: "2026-04-06",
    listingDate: "2026-04-10",
    listingAt: "NSE & BSE",
    recommendation: "Subscribe",
    confidence: 92,
    risk: "Moderate",
    analystView: "Strong fundamentals in AI/ML space. Revenue growth of 45% YoY. High subscription expected."
  },
  {
    id: 2,
    name: "GreenEnergy Solutions",
    company: "GreenEnergy Solutions Ltd",
    sector: "Renewable Energy",
    priceBand: "₹280 - ₹295",
    lotSize: 50,
    issueSize: "₹850 Cr",
    gmp: "₹45",
    gmpPercent: 15.3,
    subscription: {
      retail: 4.2,
      nii: 6.8,
      qib: 2.1,
      overall: 4.1
    },
    openDate: "2026-04-05",
    closeDate: "2026-04-09",
    allotmentDate: "2026-04-12",
    listingDate: "2026-04-18",
    listingAt: "NSE & BSE",
    recommendation: "Subscribe for Long Term",
    confidence: 78,
    risk: "Moderate-High",
    analystView: "Good play on India's green energy push. Government contracts visible. Long term hold recommended."
  },
  {
    id: 3,
    name: "HealthPlus Pharma",
    company: "HealthPlus Pharmaceuticals Ltd",
    sector: "Healthcare",
    priceBand: "₹650 - ₹685",
    lotSize: 21,
    issueSize: "₹2,100 Cr",
    gmp: "₹-15",
    gmpPercent: -2.2,
    subscription: {
      retail: 1.2,
      nii: 0.8,
      qib: 0.5,
      overall: 0.9
    },
    openDate: "2026-03-25",
    closeDate: "2026-03-28",
    allotmentDate: "2026-04-02",
    listingDate: "2026-04-07",
    listingAt: "NSE & BSE",
    recommendation: "Avoid",
    confidence: 45,
    risk: "High",
    analystView: "Negative GMP indicates weak demand. Expensive valuation at 45x PE. Skip this IPO."
  }
];

const PAST_IPOS = [
  {
    id: 101,
    name: "Apex Technologies",
    issuePrice: "₹450",
    listingPrice: "₹625",
    currentPrice: "₹720",
    listingGain: 38.9,
    overallReturn: 60.0,
    date: "2026-02-15"
  },
  {
    id: 102,
    name: "Metro Retail",
    issuePrice: "₹280",
    listingPrice: "₹245",
    currentPrice: "₹320",
    listingGain: -12.5,
    overallReturn: 14.3,
    date: "2026-01-20"
  },
  {
    id: 103,
    name: "FinServe Digital",
    issuePrice: "₹550",
    listingPrice: "₹710",
    currentPrice: "₹890",
    listingGain: 29.1,
    overallReturn: 61.8,
    date: "2026-01-05"
  }
];

const IPOCenter = () => {
  const { user, currentPlan } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedIPO, setSelectedIPO] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [lotSize, setLotSize] = useState(1);
  const [upiId, setUpiId] = useState('');
  const [applicationStep, setApplicationStep] = useState('details'); // details -> confirm -> success

  // Allotment probability calculator
  const calculateAllotmentProbability = (ipo) => {
    if (ipo.subscription.retail < 1) return 100;
    if (ipo.subscription.retail < 3) return 85;
    if (ipo.subscription.retail < 7) return 60;
    if (ipo.subscription.retail < 15) return 35;
    return 15;
  };

  // Expected listing gain calculator
  const calculateExpectedGain = (ipo, lots) => {
    const gmpValue = parseInt(ipo.gmp.replace('₹', ''));
    const totalShares = lots * ipo.lotSize;
    const gainPerShare = gmpValue;
    return totalShares * gainPerShare;
  };

  const handleApply = (ipo) => {
    setSelectedIPO(ipo);
    setShowApplyModal(true);
    setApplicationStep('details');
    setLotSize(1);
  };

  const submitApplication = () => {
    setApplicationStep('confirm');
    setTimeout(() => {
      setApplicationStep('success');
    }, 2000);
  };

  const getRecommendationColor = (recommendation) => {
    if (recommendation.includes('Subscribe')) return '#10b981';
    if (recommendation.includes('Avoid')) return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              IPO <span style={{ color: 'var(--accent)' }}>Command Center</span>
              <TrendingUp size={28} color="var(--accent)" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
            </h2>
            <p style={{ color: 'var(--text-dim)' }}>
              Track upcoming IPOs, Grey Market Premium, subscription status & apply via UPI
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}
            >
              <Calendar size={18} style={{ marginRight: '0.5rem' }} />
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={activeTab === 'past' ? 'btn-primary' : 'btn-secondary'}
            >
              <BarChart3 size={18} style={{ marginRight: '0.5rem' }} />
              Performance
            </button>
          </div>
        </div>
      </header>

      {/* IPO Market Pulse Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        padding: '1.5rem',
        borderRadius: '1rem',
        marginBottom: '2rem',
        border: '1px solid var(--accent)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Active IPOs</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>3</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Total Issue Size</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>₹4,200 Cr</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Avg GMP</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>+13.1%</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
          <Sparkles size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>IPO Market is Hot!</span>
        </div>
      </div>

      {activeTab === 'upcoming' && (
        <>
          {/* Upcoming IPOs Grid */}
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
            {UPCOMING_IPOS.map((ipo) => (
              <div key={ipo.id} className="glass-panel" style={{ 
                padding: '1.5rem',
                border: ipo.gmpPercent > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                {/* IPO Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{ipo.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{ipo.sector}</span>
                  </div>
                  <div style={{
                    background: `${getRecommendationColor(ipo.recommendation)}20`,
                    color: getRecommendationColor(ipo.recommendation),
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {ipo.recommendation}
                  </div>
                </div>

                {/* GMP Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: ipo.gmpPercent > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: ipo.gmpPercent > 0 ? '#10b981' : '#ef4444',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <TrendingUp size={16} />
                  <span style={{ fontWeight: '700' }}>GMP: {ipo.gmp}</span>
                  <span style={{ fontSize: '0.8rem' }}>({ipo.gmpPercent > 0 ? '+' : ''}{ipo.gmpPercent}%)</span>
                </div>

                {/* Key Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Price Band</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{ipo.priceBand}</div>
                  </div>
                  <div style={{ padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Lot Size</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{ipo.lotSize} shares</div>
                  </div>
                  <div style={{ padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Issue Size</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{ipo.issueSize}</div>
                  </div>
                  <div style={{ padding: '0.5rem', background: 'var(--glass)', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Closes</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{ipo.closeDate}</div>
                  </div>
                </div>

                {/* Subscription Status */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Subscription Status</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: ipo.subscription.overall > 5 ? '#10b981' : 'var(--accent)' }}>
                      {ipo.subscription.overall}x
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {['Retail', 'NII', 'QIB'].map((category) => (
                      <div key={category} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>{category}</div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          color: ipo.subscription[category.toLowerCase()] > 3 ? '#10b981' : 'var(--accent)'
                        }}>
                          {ipo.subscription[category.toLowerCase()]}x
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allotment Probability */}
                <div style={{ 
                  background: 'var(--glass)', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>Allotment Probability</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: calculateAllotmentProbability(ipo) > 50 ? '#10b981' : '#f59e0b' }}>
                      {calculateAllotmentProbability(ipo)}%
                    </span>
                  </div>
                  <div style={{ 
                    height: '4px', 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '2px' 
                  }}>
                    <div style={{
                      width: `${calculateAllotmentProbability(ipo)}%`,
                      height: '100%',
                      background: calculateAllotmentProbability(ipo) > 50 ? '#10b981' : '#f59e0b',
                      borderRadius: '2px'
                    }} />
                  </div>
                </div>

                {/* AI Analysis */}
                {currentPlan !== 'basic' && (
                  <div style={{ 
                    background: 'rgba(56, 189, 248, 0.1)', 
                    padding: '0.75rem', 
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Sparkles size={14} color="var(--accent)" />
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent)' }}>AI Analysis</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                      {ipo.analystView}
                    </p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', background: 'var(--glass)', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>
                        Confidence: {ipo.confidence}%
                      </span>
                      <span style={{ fontSize: '0.7rem', background: 'var(--glass)', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>
                        Risk: {ipo.risk}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button 
                  onClick={() => handleApply(ipo)}
                  className={ipo.recommendation.includes('Avoid') ? 'btn-secondary' : 'btn-primary'}
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={ipo.recommendation.includes('Avoid')}
                >
                  {ipo.recommendation.includes('Avoid') ? (
                    <>
                      <AlertTriangle size={18} style={{ marginRight: '0.5rem' }} />
                      Not Recommended
                    </>
                  ) : (
                    <>
                      <Smartphone size={18} style={{ marginRight: '0.5rem' }} />
                      Apply via UPI
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* IPO Calendar */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--accent)" />
              IPO Calendar 2026
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {UPCOMING_IPOS.map((ipo) => (
                <div key={ipo.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'var(--glass)',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{ipo.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {ipo.openDate} → {ipo.listingDate}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-dim)' }}>Open</div>
                      <div style={{ fontWeight: '500' }}>{ipo.openDate.split('-')[2]}</div>
                    </div>
                    <ChevronRight size={16} color="var(--text-dim)" />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-dim)' }}>Close</div>
                      <div style={{ fontWeight: '500' }}>{ipo.closeDate.split('-')[2]}</div>
                    </div>
                    <ChevronRight size={16} color="var(--text-dim)" />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-dim)' }}>Allotment</div>
                      <div style={{ fontWeight: '500' }}>{ipo.allotmentDate.split('-')[2]}</div>
                    </div>
                    <ChevronRight size={16} color="var(--text-dim)" />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-dim)' }}>Listing</div>
                      <div style={{ fontWeight: '500', color: '#10b981' }}>{ipo.listingDate.split('-')[2]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'past' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} color="var(--accent)" />
            Recent IPO Performance
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {PAST_IPOS.map((ipo) => (
              <div key={ipo.id} style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '1.25rem',
                background: 'var(--glass)',
                borderRadius: '0.75rem',
                gap: '1.5rem'
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{ipo.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Listed: {ipo.date}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Issue Price</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{ipo.issuePrice}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Listing Price</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{ipo.listingPrice}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Listing Gain</div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '600',
                      color: ipo.listingGain > 0 ? '#10b981' : '#ef4444'
                    }}>
                      {ipo.listingGain > 0 ? '+' : ''}{ipo.listingGain}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Current Return</div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '600',
                      color: ipo.overallReturn > 0 ? '#10b981' : '#ef4444'
                    }}>
                      {ipo.overallReturn > 0 ? '+' : ''}{ipo.overallReturn}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div style={{ 
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>IPO Market Performance (2026)</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981', marginTop: '0.25rem' }}>
                  +45.4% Average Listing Gain
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Success Rate</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent)' }}>
                  67%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedIPO && (
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
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '2rem'
          }}>
            {applicationStep === 'success' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <CheckCircle2 size={40} color="white" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Application Submitted!
                </h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                  Your IPO application for {selectedIPO.name} has been submitted successfully via UPI.
                </p>
                <div style={{
                  background: 'var(--glass)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Application Number</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: '600' }}>
                    IPO{Date.now().toString().slice(-8)}
                  </div>
                </div>
                <button onClick={() => setShowApplyModal(false)} className="btn-primary" style={{ width: '100%' }}>
                  Done
                </button>
              </div>
            ) : applicationStep === 'confirm' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid var(--glass-border)',
                  borderTop: '4px solid var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Processing UPI Payment...</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  Blocked ₹{(parseInt(selectedIPO.priceBand.split(' - ')[1].replace('₹', '')) * lotSize * selectedIPO.lotSize).toLocaleString()} in your account
                </p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Apply for IPO</h3>
                  <button 
                    onClick={() => setShowApplyModal(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{selectedIPO.name}</h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    Price: {selectedIPO.priceBand} • Lot: {selectedIPO.lotSize} shares
                  </div>
                </div>

                {/* Lot Size Selector */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    Number of Lots
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={lotSize}
                      onChange={(e) => setLotSize(parseInt(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: '1.2rem', fontWeight: '700', minWidth: '3rem', textAlign: 'center' }}>
                      {lotSize}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                    Total Shares: {lotSize * selectedIPO.lotSize}
                  </div>
                </div>

                {/* Investment Summary */}
                <div style={{
                  background: 'var(--glass)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Investment Amount</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      ₹{(parseInt(selectedIPO.priceBand.split(' - ')[1].replace('₹', '')) * lotSize * selectedIPO.lotSize).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Expected Gain (GMP)</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#10b981' }}>
                      +₹{calculateExpectedGain(selectedIPO, lotSize).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Allotment Probability</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      {calculateAllotmentProbability(selectedIPO)}%
                    </span>
                  </div>
                </div>

                {/* UPI Input */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    UPI ID for ASBA
                  </label>
                  <input
                    type="text"
                    placeholder="name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'var(--glass)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                    Amount will be blocked in your account. Unblocked if shares not allotted.
                  </p>
                </div>

                <button 
                  onClick={submitApplication}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={!upiId}
                >
                  <Smartphone size={18} style={{ marginRight: '0.5rem' }} />
                  Apply via UPI
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IPOCenter;
