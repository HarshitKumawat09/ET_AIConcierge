import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  Heart,
  Home,
  PiggyBank,
  IndianRupee,
  Receipt,
  Download,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TaxSection = ({ title, icon: Icon, children, maxLimit, currentValue, color = 'var(--accent)' }) => {
  const percentage = Math.min((currentValue / maxLimit) * 100, 100);
  const remaining = Math.max(maxLimit - currentValue, 0);
  
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: `rgba(${color === 'var(--accent)' ? '56, 189, 248' : color === '#10b981' ? '16, 185, 129' : color === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.1)`,
            padding: '0.75rem',
            borderRadius: '0.75rem'
          }}>
            <Icon size={24} color={color} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Limit: ₹{maxLimit.toLocaleString()}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color }}>
            ₹{currentValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: remaining > 0 ? '#f59e0b' : '#10b981' }}>
            {remaining > 0 ? `₹${remaining.toLocaleString()} remaining` : 'Fully utilized'}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={{ 
        height: '8px', 
        background: 'var(--glass)', 
        borderRadius: '4px',
        marginBottom: '1.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
      
      {children}
    </div>
  );
};

const InvestmentCard = ({ name, invested, limit, onChange, section, rate }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '1rem', 
      background: 'var(--glass)', 
      borderRadius: '0.75rem',
      marginBottom: '0.75rem',
      border: '1px solid var(--glass-border)'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {section} • Returns: {rate}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>₹</span>
        <input
          type="number"
          value={invested || ''}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          placeholder="0"
          style={{
            width: '120px',
            background: 'var(--primary)',
            border: '1px solid var(--glass-border)',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.9rem',
            textAlign: 'right'
          }}
        />
      </div>
    </div>
  );
};

const TaxPlanner = () => {
  const { user, updateUserProfile } = useAuth();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const isTaxSeason = currentMonth >= 0 && currentMonth <= 3; // Jan-April
  const daysToDeadline = Math.ceil((new Date(`${currentYear}-03-31`) - new Date()) / (1000 * 60 * 60 * 24));
  
  // Tax data state
  const [taxData, setTaxData] = useState({
    // 80C Section (₹1,50,000 limit)
    section80C: {
      ppf: user?.taxData?.section80C?.ppf || 0,
      elss: user?.taxData?.section80C?.elss || 0,
      nps: user?.taxData?.section80C?.nps || 0,
      lic: user?.taxData?.section80C?.lic || 0,
      fd: user?.taxData?.section80C?.fd || 0,
      tuition: user?.taxData?.section80C?.tuition || 0,
      homeLoanPrincipal: user?.taxData?.section80C?.homeLoanPrincipal || 0,
      epf: (user?.income?.salary || 0) * 0.12 * 12, // Auto-calculate EPF
    },
    // 80D Section (Health Insurance)
    section80D: {
      self: user?.taxData?.section80D?.self || 0,
      parents: user?.taxData?.section80D?.parents || 0,
      parentsSenior: user?.taxData?.section80D?.parentsSenior || 0,
    },
    // HRA Exemption
    hra: {
      basicSalary: (user?.income?.salary || 0) / 2,
      hraReceived: user?.taxData?.hra?.hraReceived || 0,
      rentPaid: user?.taxData?.hra?.rentPaid || 0,
      isMetro: user?.taxData?.hra?.isMetro !== false, // Default true for metro
    },
    // Capital Gains
    capitalGains: {
      stcgEquity: user?.taxData?.capitalGains?.stcgEquity || 0,
      ltcgEquity: user?.taxData?.capitalGains?.ltcgEquity || 0,
      ltcgDebt: user?.taxData?.capitalGains?.ltcgDebt || 0,
    },
    // Other Deductions
    section80E: user?.taxData?.section80E || 0, // Education loan interest
    section80G: user?.taxData?.section80G || 0, // Donations
    section80TTA: Math.min(user?.taxData?.section80TTA || 0, 10000), // Savings interest (max 10k)
  });

  // Calculate totals
  const calculate80C = () => {
    const total = Object.values(taxData.section80C).reduce((a, b) => a + b, 0);
    return Math.min(total, 150000);
  };

  const calculate80D = () => {
    const selfLimit = 25000;
    const parentsLimit = taxData.section80D.parentsSenior ? 50000 : 25000;
    const self = Math.min(taxData.section80D.self, selfLimit);
    const parents = Math.min(taxData.section80D.parents, parentsLimit);
    return self + parents;
  };

  const calculateHRA = () => {
    const { basicSalary, hraReceived, rentPaid, isMetro } = taxData.hra;
    const rentExcess = Math.max(0, rentPaid - (0.1 * basicSalary * 12));
    const metroFactor = isMetro ? 0.5 : 0.4;
    const basicExemption = basicSalary * 12 * metroFactor;
    return Math.min(hraReceived * 12, rentExcess, basicExemption);
  };

  const calculateCapitalGainsTax = () => {
    const { stcgEquity, ltcgEquity, ltcgDebt } = taxData.capitalGains;
    const stcgTax = stcgEquity * 0.15; // 15% STT paid
    const ltcgTaxable = Math.max(0, ltcgEquity - 100000); // 1L exemption
    const ltcgTax = ltcgTaxable * 0.10;
    const ltcgDebtTax = ltcgDebt * 0.20; // With indexation benefit usually
    return stcgTax + ltcgTax + ltcgDebtTax;
  };

  const totalDeductions = calculate80C() + calculate80D() + calculateHRA() + 
    taxData.section80E + taxData.section80G + taxData.section80TTA;
  
  const taxableIncome = Math.max(0, (user?.income?.salary || 0) * 12 - totalDeductions);
  
  // Tax calculation as per old regime
  const calculateIncomeTax = () => {
    let tax = 0;
    const income = taxableIncome;
    
    if (income <= 250000) return 0;
    if (income <= 500000) tax = (income - 250000) * 0.05;
    else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.20;
    else tax = 112500 + (income - 1000000) * 0.30;
    
    // Add 4% cess
    return tax * 1.04;
  };

  const totalTax = calculateIncomeTax() + calculateCapitalGainsTax();
  const taxSaved = (user?.income?.salary || 0) * 12 * 0.30 * (totalDeductions / 150000); // Approximate

  const updateSection80C = (key, value) => {
    setTaxData(prev => ({
      ...prev,
      section80C: { ...prev.section80C, [key]: value }
    }));
  };

  const updateSection80D = (key, value) => {
    setTaxData(prev => ({
      ...prev,
      section80D: { ...prev.section80D, [key]: value }
    }));
  };

  const updateHRA = (key, value) => {
    setTaxData(prev => ({
      ...prev,
      hra: { ...prev.hra, [key]: value }
    }));
  };

  const updateCapitalGains = (key, value) => {
    setTaxData(prev => ({
      ...prev,
      capitalGains: { ...prev.capitalGains, [key]: value }
    }));
  };

  // Save tax data to user profile
  const saveTaxData = () => {
    updateUserProfile({ taxData });
  };

  useEffect(() => {
    saveTaxData();
  }, [taxData]);

  const generateITRSummary = () => {
    const summary = {
      assessmentYear: `${currentYear}-${(currentYear + 1).toString().slice(2)}`,
      totalIncome: (user?.income?.salary || 0) * 12,
      deductions: {
        section80C: calculate80C(),
        section80D: calculate80D(),
        hra: calculateHRA(),
        section80E: taxData.section80E,
        section80G: taxData.section80G,
        section80TTA: taxData.section80TTA,
        total: totalDeductions
      },
      taxableIncome,
      taxPayable: totalTax,
      tds: user?.income?.tds || 0,
      balanceTax: Math.max(0, totalTax - (user?.income?.tds || 0))
    };
    
    const dataStr = JSON.stringify(summary, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ITR_Summary_AY_${summary.assessmentYear}.json`;
    link.click();
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>
            Tax <span style={{ color: 'var(--accent)' }}>Planner</span>
          </h2>
          <button 
            onClick={generateITRSummary}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={18} />
            Export ITR Summary
          </button>
        </div>
        <p style={{ color: 'var(--text-dim)' }}>
          FY {currentYear}-{currentYear + 1} • Optimize your tax savings with AI recommendations
        </p>
      </header>

      {/* Tax Season Alert */}
      {isTaxSeason && daysToDeadline > 0 && (
        <div style={{
          background: daysToDeadline < 30 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${daysToDeadline < 30 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          borderRadius: '1rem',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <AlertTriangle size={24} color={daysToDeadline < 30 ? '#ef4444' : '#f59e0b'} />
          <div>
            <div style={{ fontWeight: '600', color: daysToDeadline < 30 ? '#ef4444' : '#f59e0b' }}>
              {daysToDeadline < 30 ? 'URGENT: Tax Filing Deadline Approaching!' : 'Tax Season is Here'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Only {daysToDeadline} days left to invest and file returns for FY {currentYear - 1}-{currentYear}
            </div>
          </div>
        </div>
      )}

      {/* Tax Summary Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <IndianRupee size={24} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Total Income</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{((user?.income?.salary || 0) * 12).toLocaleString()}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Receipt size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Total Deductions</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>₹{totalDeductions.toLocaleString()}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Calculator size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Taxable Income</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>₹{taxableIncome.toLocaleString()}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <TrendingUp size={24} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Tax Payable</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>₹{Math.round(totalTax).toLocaleString()}</div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left Column - Deductions */}
        <div>
          {/* Section 80C */}
          <TaxSection 
            title="Section 80C - Investments" 
            icon={PiggyBank} 
            maxLimit={150000} 
            currentValue={calculate80C()}
            color="#3b82f6"
          >
            <InvestmentCard 
              name="Public Provident Fund (PPF)"
              section="80C"
              rate="7.1% p.a. (Tax-free)"
              invested={taxData.section80C.ppf}
              onChange={(val) => updateSection80C('ppf', val)}
            />
            <InvestmentCard 
              name="ELSS Mutual Funds"
              section="80C"
              rate="12-15% p.a. (3yr lock)"
              invested={taxData.section80C.elss}
              onChange={(val) => updateSection80C('elss', val)}
            />
            <InvestmentCard 
              name="NPS Tier 1"
              section="80C + 80CCD(1B)"
              rate="9-11% p.a."
              invested={taxData.section80C.nps}
              onChange={(val) => updateSection80C('nps', val)}
            />
            <InvestmentCard 
              name="Life Insurance Premium (LIC)"
              section="80C"
              rate="Guaranteed returns"
              invested={taxData.section80C.lic}
              onChange={(val) => updateSection80C('lic', val)}
            />
            <InvestmentCard 
              name="Tax Saver FD (5 years)"
              section="80C"
              rate="7-8% p.a."
              invested={taxData.section80C.fd}
              onChange={(val) => updateSection80C('fd', val)}
            />
            <InvestmentCard 
              name="Children's Tuition Fees"
              section="80C"
              rate="Education expense"
              invested={taxData.section80C.tuition}
              onChange={(val) => updateSection80C('tuition', val)}
            />
            <InvestmentCard 
              name="Home Loan Principal"
              section="80C"
              rate="Housing benefit"
              invested={taxData.section80C.homeLoanPrincipal}
              onChange={(val) => updateSection80C('homeLoanPrincipal', val)}
            />
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span style={{ fontSize: '0.85rem', color: '#10b981' }}>
                EPF Contribution (Auto): ₹{taxData.section80C.epf.toLocaleString()}/year
              </span>
            </div>
          </TaxSection>

          {/* Section 80D - Health Insurance */}
          <TaxSection 
            title="Section 80D - Health Insurance" 
            icon={Heart} 
            maxLimit={75000} 
            currentValue={calculate80D()}
            color="#ef4444"
          >
            <InvestmentCard 
              name="Self & Family Health Insurance"
              section="80D"
              rate="₹25,000 limit"
              invested={taxData.section80D.self}
              onChange={(val) => updateSection80D('self', val)}
            />
            <InvestmentCard 
              name="Parents Health Insurance"
              section="80D"
              rate="₹25,000 limit (₹50k if senior)"
              invested={taxData.section80D.parents}
              onChange={(val) => updateSection80D('parents', val)}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <input 
                type="checkbox" 
                checked={taxData.section80D.parentsSenior}
                onChange={(e) => updateSection80D('parentsSenior', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.85rem' }}>Parents are Senior Citizens (60+ years)</span>
            </div>
          </TaxSection>

          {/* HRA Section */}
          <TaxSection 
            title="HRA Exemption" 
            icon={Building2} 
            maxLimit={taxData.hra.hraReceived * 12} 
            currentValue={calculateHRA()}
            color="#f59e0b"
          >
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '150px', fontSize: '0.9rem' }}>Basic Salary (Monthly):</span>
                <input
                  type="number"
                  value={taxData.hra.basicSalary}
                  onChange={(e) => updateHRA('basicSalary', parseInt(e.target.value) || 0)}
                  style={{
                    flex: 1,
                    background: 'var(--primary)',
                    border: '1px solid var(--glass-border)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '150px', fontSize: '0.9rem' }}>HRA Received (Monthly):</span>
                <input
                  type="number"
                  value={taxData.hra.hraReceived || ''}
                  onChange={(e) => updateHRA('hraReceived', parseInt(e.target.value) || 0)}
                  style={{
                    flex: 1,
                    background: 'var(--primary)',
                    border: '1px solid var(--glass-border)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '150px', fontSize: '0.9rem' }}>Rent Paid (Monthly):</span>
                <input
                  type="number"
                  value={taxData.hra.rentPaid || ''}
                  onChange={(e) => updateHRA('rentPaid', parseInt(e.target.value) || 0)}
                  style={{
                    flex: 1,
                    background: 'var(--primary)',
                    border: '1px solid var(--glass-border)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={taxData.hra.isMetro}
                  onChange={(e) => updateHRA('isMetro', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.85rem' }}>Living in Metro City (Delhi, Mumbai, Chennai, Kolkata)</span>
                <Info size={16} color="var(--text-dim)" style={{ marginLeft: '0.25rem' }} title="50% exemption for metro, 40% for non-metro" />
              </div>
            </div>
          </TaxSection>

          {/* Capital Gains */}
          <TaxSection 
            title="Capital Gains Tax" 
            icon={TrendingUp} 
            maxLimit={0} 
            currentValue={calculateCapitalGainsTax()}
            color="#8b5cf6"
          >
            <InvestmentCard 
              name="STCG Equity (Held < 1 year)"
              section="111A"
              rate="15% tax"
              invested={taxData.capitalGains.stcgEquity}
              onChange={(val) => updateCapitalGains('stcgEquity', val)}
            />
            <InvestmentCard 
              name="LTCG Equity (Held > 1 year)"
              section="112A"
              rate="10% above ₹1L"
              invested={taxData.capitalGains.ltcgEquity}
              onChange={(val) => updateCapitalGains('ltcgEquity', val)}
            />
            <InvestmentCard 
              name="LTCG Debt/Other (Held > 3 years)"
              section="112"
              rate="20% with indexation"
              invested={taxData.capitalGains.ltcgDebt}
              onChange={(val) => updateCapitalGains('ltcgDebt', val)}
            />
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(139, 92, 246, 0.1)', 
              borderRadius: '0.5rem',
              marginTop: '0.75rem'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#8b5cf6' }}>
                <Info size={14} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                LTCG Equity has ₹1,00,000 annual exemption. Debt funds benefit from indexation.
              </div>
            </div>
          </TaxSection>
        </div>

        {/* Right Column - AI Recommendations */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} color="var(--accent)" />
              AI Tax Recommendations
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {calculate80C() < 150000 && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(245, 158, 11, 0.1)', 
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  <div style={{ fontWeight: '600', color: '#f59e0b', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Save ₹{Math.round((150000 - calculate80C()) * 0.3).toLocaleString()} more!
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                    You have ₹{(150000 - calculate80C()).toLocaleString()} remaining in 80C. 
                    Invest in ELSS for triple benefits: Tax saving + Wealth creation + 3yr liquidity.
                  </p>
                  <Link to="/marketplace" style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)', cursor: 'pointer' }}>
                      Explore ELSS Funds →
                    </span>
                  </Link>
                </div>
              )}

              {calculate80D() < 25000 && taxData.section80D.self === 0 && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  <div style={{ fontWeight: '600', color: '#ef4444', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    No Health Insurance?
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                    Missing ₹25,000 deduction + financial risk. Get covered before March 31.
                  </p>
                </div>
              )}

              {taxData.hra.rentPaid > 0 && calculateHRA() < taxData.hra.hraReceived * 12 * 0.5 && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ fontWeight: '600', color: '#10b981', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    HRA Optimization Tip
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Pay rent via bank transfer and get receipts. You can claim ₹{Math.round(calculateHRA()).toLocaleString()} exemption.
                  </p>
                </div>
              )}

              {taxData.capitalGains.stcgEquity > 50000 && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(139, 92, 246, 0.1)', 
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <div style={{ fontWeight: '600', color: '#8b5cf6', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    High STCG Tax!
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    You owe ₹{Math.round(taxData.capitalGains.stcgEquity * 0.15).toLocaleString()} in STCG. Hold equity {'>'} 1 year to save 15% tax.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href="https://www.incometax.gov.in/iec/foportal/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ justifyContent: 'center', textDecoration: 'none', display: 'flex' }}
              >
                <FileText size={18} style={{ marginRight: '0.5rem' }} />
                File ITR on Portal
              </a>
              <button className="btn-secondary" style={{ justifyContent: 'center' }}>
                <Download size={18} style={{ marginRight: '0.5rem' }} />
                Download Form 16
              </button>
              <Link to="/concierge" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <ArrowRight size={18} style={{ marginRight: '0.5rem' }} />
                  Ask Tax Expert
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxPlanner;
