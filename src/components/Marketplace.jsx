import React from 'react';
import { CreditCard, Landmark, Shield, GraduationCap, ArrowRight, Zap, Lock, Crown, Users, Crown as CrownIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, PLAN_FEATURES } from '../contexts/AuthContext';

const ProductCard = ({ title, desc, icon: Icon, features, tag, link, locked }) => (
  <div className="glass-panel" style={{ 
    padding: '1.5rem', 
    display: 'flex', 
    flexDirection: 'column',
    opacity: locked ? 0.7 : 1,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {locked && (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{
          background: 'var(--primary)',
          padding: '1rem 1.5rem',
          borderRadius: '1rem',
          textAlign: 'center',
          border: '1px solid #fbbf24'
        }}>
          <CrownIcon size={32} color="#fbbf24" style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fbbf24', marginBottom: '0.5rem' }}>ET Elite Exclusive</p>
          <Link to="/business-model" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              Upgrade to Elite
            </button>
          </Link>
        </div>
      </div>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div style={{ background: 'var(--glass)', padding: '0.75rem', borderRadius: '1rem', color: 'var(--accent)' }}>
        <Icon size={28} />
      </div>
      {tag && (
        <span style={{ 
          fontSize: '0.7rem', 
          fontWeight: '700', 
          background: locked ? '#fbbf24' : 'var(--accent)', 
          color: locked ? 'var(--primary)' : 'var(--primary)', 
          padding: '0.2rem 0.6rem', 
          borderRadius: '0.5rem',
          textTransform: 'uppercase'
        }}>
          {tag}
        </span>
      )}
    </div>
    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>{desc}</p>
    
    <div style={{ flex: 1, marginBottom: '1.5rem' }}>
      {features.map((f, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <Zap size={14} color="var(--warning)" /> {f}
        </div>
      ))}
    </div>
    
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="btn-primary" 
      style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'flex' }}
    >
      Learn More <ArrowRight size={16} />
    </a>
  </div>
);

const Marketplace = () => {
  const { currentPlan, hasFeature } = useAuth();
  const planFeatures = PLAN_FEATURES[currentPlan];
  
  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          ET Services <span style={{ color: 'var(--accent)' }}>Marketplace</span>
          {currentPlan === 'elite' && <Crown size={24} color="#fbbf24" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}
        </h2>
        <p style={{ color: 'var(--text-dim)' }}>
          {planFeatures.privateSummits 
            ? 'Exclusive financial services and partner products curated for high net worth individuals.'
            : 'Curated financial services and partner products based on your profile.'
          }
        </p>
      </header>

      <div style={{ 
        background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.1) 0%, rgba(129, 140, 248, 0.1) 100%)', 
        padding: '2rem', 
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--accent)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {planFeatures.etPrimeAccess ? 'Your ET Prime Benefits Active' : 'Unlock the Full Power of ET'}
          </h3>
          <p style={{ color: 'var(--text-dim)' }}>
            {planFeatures.etPrimeAccess 
              ? `Enjoying ${currentPlan === 'elite' ? 'Elite' : 'Pro'} benefits including exclusive market insights.`
              : 'Join 2 Million+ smart investors with ET Prime Subscription.'
            }
          </p>
        </div>
        {!planFeatures.etPrimeAccess ? (
          <Link to="/business-model" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ background: 'var(--warning)', color: 'black' }}>
              Upgrade to Prime
            </button>
          </Link>
        ) : (
          <div style={{
            background: currentPlan === 'elite' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(56, 189, 248, 0.2)',
            padding: '0.75rem 1.25rem',
            borderRadius: '2rem',
            border: `1px solid ${currentPlan === 'elite' ? '#fbbf24' : 'var(--accent)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {currentPlan === 'elite' ? <Crown size={16} color="#fbbf24" /> : <Zap size={16} color="var(--accent)" />}
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: currentPlan === 'elite' ? '#fbbf24' : 'var(--accent)' }}>
              {currentPlan === 'elite' ? 'ET Elite Active' : 'ET Pro Active'}
            </span>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <ProductCard 
          title="ET Markets Pro" 
          desc="Real-time data, technical charts, and expert stock analysis." 
          icon={Landmark}
          tag="Popular"
          features={["Real-time Alerts", "Expert Portfolios", "Derivative Analysis"]}
          link="https://economictimes.indiatimes.com/markets"
        />
        <ProductCard 
          title="ET Insurance Partner" 
          desc="Term and Health insurance plans curated for your family size." 
          icon={Shield}
          features={["Paperless Process", "Instant Quote", "Tax Benefits"]}
          link="https://economictimes.indiatimes.com/wealth/insure"
        />
        <ProductCard 
          title="Wealth Summits" 
          desc="Exclusive masterclasses with India's top equity investors." 
          icon={GraduationCap}
          features={["Live Interaction", "Strategy PDFs", "Networking"]}
          link="https://economictimes.indiatimes.com/wealth"
          locked={!planFeatures.privateSummits}
        />
        <ProductCard 
          title="ET Credit Cards" 
          desc="Co-branded cards with cashback on financial products." 
          icon={CreditCard}
          tag="New"
          features={["Zero Annual Fee", "10x Points on ET", "Lounge Access"]}
          link="https://economictimes.indiatimes.com/wealth/spend"
        />
      </div>

      {/* Elite-only Services Section - Show only if user doesn't have privateSummits feature */}
      {!planFeatures.privateSummits && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
            borderRadius: '1rem',
            border: '1px dashed #fbbf24'
          }}>
            <Lock size={20} color="#fbbf24" />
            <span style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '600' }}>
              ET Elite Exclusive Services - Upgrade to unlock
            </span>
          </div>
          
          <div className="dashboard-grid" style={{ opacity: 0.6 }}>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                background: 'var(--primary)',
                padding: '1rem',
                borderRadius: '1rem',
                border: '1px solid #fbbf24',
                textAlign: 'center',
                zIndex: 10
              }}>
                <CrownIcon size={24} color="#fbbf24" />
                <p style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>Elite Only</p>
              </div>
              <div style={{ background: 'var(--glass)', padding: '0.75rem', borderRadius: '1rem', color: '#fbbf24', width: 'fit-content', marginBottom: '1rem' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Private Wealth Summits</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Invitation-only events with India's top 1% investors</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                background: 'var(--primary)',
                padding: '1rem',
                borderRadius: '1rem',
                border: '1px solid #fbbf24',
                textAlign: 'center',
                zIndex: 10
              }}>
                <CrownIcon size={24} color="#fbbf24" />
                <p style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>Elite Only</p>
              </div>
              <div style={{ background: 'var(--glass)', padding: '0.75rem', borderRadius: '1rem', color: '#fbbf24', width: 'fit-content', marginBottom: '1rem' }}>
                <GraduationCap size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Exclusive Masterclasses</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>1-on-1 sessions with legendary investors</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
