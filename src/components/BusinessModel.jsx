import React, { useState, useEffect } from 'react';
import { Target, Users, Zap, Check, ArrowRight, DollarSign, CreditCard, Shield, Sparkles, X, Smartphone, QrCode, Loader2, AlertCircle, Lock, IndianRupee } from 'lucide-react';
import { useAuth, PLAN_FEATURES } from '../contexts/AuthContext';

const PricingCard = ({ tier, price, features, highlighted, target, current, selected, onSelect, planId }) => {
  const isCurrentPlan = current === planId;
  const isUpgrade = !isCurrentPlan && selected === planId;

  return (
    <div className={`glass-panel ${highlighted ? 'glow-border' : ''}`} style={{
      padding: '2rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      border: isCurrentPlan ? '2px solid var(--success)' : highlighted ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
      opacity: isCurrentPlan ? 1 : 0.9
    }}>
      {highlighted && !isCurrentPlan && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '-1rem',
          background: 'var(--accent)',
          color: 'var(--primary)',
          padding: '0.25rem 2rem',
          transform: 'rotate(45deg)',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          MOST POPULAR
        </div>
      )}

      {isCurrentPlan && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '-2rem',
          background: 'var(--success)',
          color: 'var(--primary)',
          padding: '0.25rem 2.5rem',
          transform: 'rotate(45deg)',
          fontSize: '0.7rem',
          fontWeight: '700'
        }}>
          CURRENT PLAN
        </div>
      )}

      <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{tier}</h3>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{target}</p>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: '900' }}>{price}</span>
        {price !== 'Free' && <span style={{ color: 'var(--text-dim)' }}> / year</span>}
      </div>

      <div style={{ flex: 1, marginBottom: '2rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <div style={{ color: isCurrentPlan ? 'var(--success)' : 'var(--accent)' }}>
              <Check size={18} />
            </div>
            {f}
          </div>
        ))}
      </div>

      {isCurrentPlan ? (
        <button
          disabled
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed' }}
        >
          <Check size={18} /> Current Plan
        </button>
      ) : (
        <button
          onClick={() => onSelect(planId)}
          className={isUpgrade || highlighted ? 'btn-primary' : 'btn-secondary'}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {price === 'Free' ? 'Downgrade' : 'Choose Plan'} <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
};

const PaymentModal = ({ plan, price, onClose, onConfirm }) => {
  const [step, setStep] = useState('details'); // details -> processing -> otp -> success/failed
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [processingMessage, setProcessingMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' or 'failed'

  // Detect card type
  const getCardType = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    if (/^6/.test(clean)) return 'rupay';
    return 'unknown';
  };

  const cardType = getCardType(cardNumber);

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 16) newErrors.cardNumber = 'Enter valid 16-digit card number';
      if (cardName.length < 3) newErrors.cardName = 'Enter cardholder name';
      if (!expiry.match(/^\d{2}\/\d{2}$/)) newErrors.expiry = 'Enter MM/YY format';
      if (cvv.length < 3) newErrors.cvv = 'Enter 3-digit CVV';
    } else {
      if (!upiId.match(/^\w+@\w+$/)) newErrors.upiId = 'Enter valid UPI ID (name@bank)';
      if (!selectedUpiApp) newErrors.upiApp = 'Select a UPI app';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (!validateForm()) return;
    
    setStep('processing');
    setProcessingMessage('Initializing secure payment...');
    
    // Simulate payment processing steps
    const steps = [
      { message: 'Connecting to bank...', delay: 800 },
      { message: 'Verifying card details...', delay: 1500 },
      { message: 'Sending OTP...', delay: 2200 },
    ];
    
    steps.forEach(({ message, delay }) => {
      setTimeout(() => setProcessingMessage(message), delay);
    });
    
    setTimeout(() => {
      setStep('otp');
    }, 2800);
  };

  const handleOtpSubmit = () => {
    if (otp.length !== 6) {
      setErrors({ otp: 'Enter 6-digit OTP' });
      return;
    }
    
    setStep('processing');
    setProcessingMessage('Verifying OTP...');
    
    setTimeout(() => {
      setProcessingMessage('Completing transaction...');
    }, 1500);
    
    setTimeout(() => {
      // 95% success rate simulation
      const isSuccess = Math.random() > 0.05;
      setPaymentStatus(isSuccess ? 'success' : 'failed');
      setStep(isSuccess ? 'success' : 'failed');
      
      if (isSuccess) {
        const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
        onConfirm({
          method: paymentMethod,
          transactionId,
          timestamp: new Date().toISOString(),
          amount: price,
          cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
          upiId: paymentMethod === 'upi' ? upiId : null
        });
      }
    }, 3000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  if (step === 'success') {
    return (
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
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            animation: 'scaleIn 0.3s ease'
          }}>
            <Check size={40} color="white" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Payment Successful!
          </h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
            Your {PLAN_FEATURES[plan].name} subscription is now active
          </p>
          
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Amount Paid</span>
              <span style={{ fontSize: '1rem', fontWeight: '700' }}>₹{price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Transaction ID</span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{'TXN' + Date.now()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Valid Until</span>
              <span style={{ fontSize: '0.85rem' }}>{new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Start Exploring <Sparkles size={18} />
          </button>
        </div>
        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (step === 'failed') {
    return (
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
          padding: '3rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <X size={40} color="white" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#ef4444' }}>
            Payment Failed
          </h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
            Transaction declined by bank. Please try again or use a different payment method.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setStep('details')} className="btn-secondary" style={{ flex: 1 }}>
              Try Again
            </button>
            <button onClick={onClose} className="btn-primary" style={{ flex: 1 }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
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
        zIndex: 1000
      }}>
        <div className="glass-panel" style={{
          padding: '3rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid var(--glass-border)',
            borderTop: '4px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            {processingMessage}
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Please do not refresh or close this window
          </p>
          <div style={{
            marginTop: '1.5rem',
            padding: '0.75rem',
            background: 'rgba(56, 189, 248, 0.1)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Lock size={14} color="var(--accent)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>256-bit SSL Encrypted</span>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
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
          padding: '2.5rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'var(--accent)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Smartphone size={28} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Enter OTP
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            We've sent a 6-digit OTP to your registered mobile number ending in ******89
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--glass)',
                border: `1px solid ${errors.otp ? '#ef4444' : 'var(--glass-border)'}`,
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '1.5rem',
                textAlign: 'center',
                letterSpacing: '0.5rem',
                fontFamily: 'monospace'
              }}
            />
            {errors.otp && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{errors.otp}</p>
            )}
          </div>
          
          <button
            onClick={handleOtpSubmit}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
          >
            Verify & Pay ₹{price}
          </button>
          
          <button
            onClick={() => setStep('details')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Change Payment Method
          </button>
        </div>
      </div>
    );
  }

  return (
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
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Complete Payment</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{
          background: 'rgba(56, 189, 248, 0.1)',
          padding: '1.5rem',
          borderRadius: '1rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--accent)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Plan</span>
            <span style={{ fontWeight: '600' }}>{PLAN_FEATURES[plan].name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-dim)' }}>Amount</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent)' }}>₹{price}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: '600' }}>
            Payment Method
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setPaymentMethod('card')}
              style={{
                flex: 1,
                padding: '1rem',
                background: paymentMethod === 'card' ? 'var(--accent)' : 'var(--glass)',
                color: paymentMethod === 'card' ? 'var(--primary)' : 'white',
                border: `1px solid ${paymentMethod === 'card' ? 'var(--accent)' : 'var(--glass-border)'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CreditCard size={24} />
              <span style={{ fontSize: '0.8rem' }}>Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('upi')}
              style={{
                flex: 1,
                padding: '1rem',
                background: paymentMethod === 'upi' ? 'var(--accent)' : 'var(--glass)',
                color: paymentMethod === 'upi' ? 'var(--primary)' : 'white',
                border: `1px solid ${paymentMethod === 'upi' ? 'var(--accent)' : 'var(--glass-border)'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>UPI</div>
              <span style={{ fontSize: '0.8rem' }}>Google Pay/PhonePe</span>
            </button>
          </div>
        </div>

        {/* Card Payment Form */}
        {paymentMethod === 'card' && (
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
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
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
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
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
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
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  maxLength={3}
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
              </div>
            </div>
          </div>
        )}

  {/* UPI Payment Form */}
        {paymentMethod === 'upi' && (
          <div style={{ marginBottom: '1.5rem' }}>
            {/* UPI Apps Selection */}
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: '600' }}>
              Select UPI App
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                { id: 'gpay', name: 'Google Pay', color: '#4285f4' },
                { id: 'phonepe', name: 'PhonePe', color: '#5f259f' },
                { id: 'paytm', name: 'Paytm', color: '#00baf2' },
              ].map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedUpiApp(app.id)}
                  style={{
                    padding: '1rem 0.5rem',
                    background: selectedUpiApp === app.id ? `${app.color}20` : 'var(--glass)',
                    border: `2px solid ${selectedUpiApp === app.id ? app.color : 'var(--glass-border)'}`,
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: app.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    {app.name[0]}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: selectedUpiApp === app.id ? '600' : '400' }}>
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
            {errors.upiApp && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{errors.upiApp}</p>
            )}

            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              UPI ID
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
                border: `1px solid ${errors.upiId ? '#ef4444' : 'var(--glass-border)'}`,
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            {errors.upiId && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{errors.upiId}</p>
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              Example: yourname@oksbi, yourname@okaxis, yourname@paytm
            </p>
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.05)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <Shield size={18} color="#10b981" />
          <span style={{ fontSize: '0.8rem', color: '#10b981' }}>
            Payments are 100% secure & PCI-DSS compliant
          </span>
        </div>

        <button
          onClick={handleProceed}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
        >
          <Lock size={18} style={{ marginRight: '0.5rem' }} />
          Pay ₹{price} Securely
        </button>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {['VISA', 'MASTERCARD', 'RuPay', 'UPI'].map((brand) => (
              <span key={brand} style={{
                fontSize: '0.65rem',
                background: 'var(--glass)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                color: 'var(--text-dim)'
              }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RevenueStream = ({ title, value, icon: Icon, desc }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    background: 'var(--glass)',
    borderRadius: '1rem',
    border: '1px solid var(--glass-border)'
  }}>
    <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '1rem' }}>
      <Icon size={32} />
    </div>
    <div>
      <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{title}</h4>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{desc}</p>
    </div>
    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Growth Target</div>
    </div>
  </div>
);

const BusinessModel = () => {
  const { currentPlan, upgradePlan, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handlePlanSelect = (plan) => {
    if (plan === 'basic') {
      // Downgrade to basic - no payment needed
      upgradePlan('basic', { method: 'none', transactionId: 'DOWNGRADE_' + Date.now() });
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentConfirm = (paymentDetails) => {
    upgradePlan(selectedPlan, paymentDetails);
    // Modal will show success state, then close
  };

  const plans = [
    {
      id: 'basic',
      tier: 'ET Basic',
      price: 'Free',
      target: 'Casual Readers',
      features: ['Daily News & Insights', 'Basic AI Concierge (5 queries/day)', 'Newsletter Access', 'Limited Portfolio View']
    },
    {
      id: 'pro',
      tier: 'ET Pro',
      price: '4,999',
      target: 'Active Investors',
      highlighted: true,
      features: ['ET Markets Pro Features', 'Full Portfolio Gap Analysis', 'Real-time AI Alerts (50 queries/day)', 'ET Prime Membership', 'Advanced Portfolio Simulator']
    },
    {
      id: 'elite',
      tier: 'ET Elite',
      price: '14,999',
      target: 'High Net Worth Individuals',
      features: ['Dedicated Human-AI Hybrid', 'Private Wealth Summits', 'Exclusive Masterclasses', 'Family Portfolio Support', 'Unlimited AI Queries', 'Priority Support']
    }
  ];

  return (
    <div className="fade-in">
      {/* Current Plan Status Banner */}
      {currentPlan && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
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
              color: 'var(--primary)',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}>
              {PLAN_FEATURES[currentPlan].name}
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Your Current Plan</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {currentPlan === 'basic' ? 'Free forever' : `Valid until ${new Date(user?.subscription?.endDate || Date.now()).toLocaleDateString()}`}
              </div>
            </div>
          </div>
          {currentPlan !== 'elite' && (
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
              Upgrade to unlock more features
            </div>
          )}
        </div>
      )}

      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Ecosystem <span className="glow-text" style={{ color: 'var(--accent)' }}>Economics</span></h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: '700px', margin: '0 auto' }}>
          Sustainable revenue growth through personalized engagement, multi-tier subscriptions, and high-intent partner lead generation.
        </p>
      </header>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '5rem' }}>
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            {...plan}
            current={currentPlan}
            selected={selectedPlan}
            onSelect={handlePlanSelect}
            planId={plan.id}
          />
        ))}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          price={PLAN_FEATURES[selectedPlan].price}
          onClose={() => setShowPayment(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}

      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2.5rem', textAlign: 'center' }}>Strategic Revenue Channels</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RevenueStream
            title="Subscription Velocity"
            value="+42%"
            icon={Zap}
            desc="AI Concierge increases conversion from 'Basic' to 'Pro' by highlighting personalized portfolio gaps."
          />
          <RevenueStream
            title="Partner Lead Gen"
            value="+₹25Cr"
            icon={Target}
            desc="High-intent referrals for Insurance, Credit Cards, and Loans via Marketplace integrations."
          />
          <RevenueStream
            title="LTV Augmentation"
            value="3.5x"
            icon={Users}
            desc="Predictive cross-selling and retention nudges significantly increase the average customer lifetime value."
          />
          <RevenueStream
            title="Ad-Yield Optimization"
            value="+18%"
            icon={DollarSign}
            desc="Deep profiling allows for hyper-targeted, high-CPM advertising in the free tier."
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessModel;
