import React, { useState } from 'react';
import { 
  Newspaper, 
  Video, 
  Lock, 
  Crown, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Bookmark,
  Share2,
  PlayCircle,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth, PLAN_FEATURES } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Mock ET Prime Content
const ET_PRIME_ARTICLES = [
  {
    id: 1,
    title: "Why HDFC Bank's Q3 Results Signal a Strong 2024 for Banking Stocks",
    summary: "The bank's net profit rose 33% YoY, beating Street estimates. Deposit growth remains robust at 18%. Here's what it means for investors...",
    category: "Markets",
    author: "Sneha Kulkarni",
    readTime: "6 min read",
    publishedAt: "2 hours ago",
    isPremium: true,
    relatedToPortfolio: true,
    stockMentioned: "HDFC Bank",
    thumbnail: "📈",
    views: "45.2K"
  },
  {
    id: 2,
    title: "The Smallcap Rally: Time to Book Profits or Stay Invested?",
    summary: "With the Nifty Smallcap 100 up 45% in 2023, experts weigh in on whether this momentum can sustain into 2024...",
    category: "Investment Strategy",
    author: "Rahul Oberoi",
    readTime: "8 min read",
    publishedAt: "5 hours ago",
    isPremium: true,
    relatedToPortfolio: false,
    thumbnail: "🎯",
    views: "32.8K"
  },
  {
    id: 3,
    title: "Budget 2024: Top Tax-Saving Investment Options for Salaried Professionals",
    summary: "From ELSS to NPS, we break down the most effective tax-saving instruments and how to optimize your 80C investments...",
    category: "Personal Finance",
    author: "Priya Sharma",
    readTime: "10 min read",
    publishedAt: "Yesterday",
    isPremium: false,
    relatedToPortfolio: true,
    thumbnail: "💰",
    views: "89.1K"
  },
  {
    id: 4,
    title: "Global Markets Watch: Fed's Rate Cut Timeline and Impact on Indian Equities",
    summary: "With inflation cooling in the US, markets are pricing in 3 rate cuts in 2024. Here's how it affects FII flows into India...",
    category: "Global Markets",
    author: "ET Bureau",
    readTime: "7 min read",
    publishedAt: "Yesterday",
    isPremium: true,
    relatedToPortfolio: false,
    thumbnail: "🌍",
    views: "28.5K"
  },
  {
    id: 5,
    title: "Real Estate vs Equity: Where Should You Invest in 2024?",
    summary: "With commercial real estate yields at 8-9% and equity valuations at premium, we analyze the risk-reward for both asset classes...",
    category: "Alternative Investment",
    author: "Vivek Kaul",
    readTime: "12 min read",
    publishedAt: "2 days ago",
    isPremium: true,
    relatedToPortfolio: false,
    thumbnail: "🏢",
    views: "41.3K"
  }
];

const ET_NOW_VIDEOS = [
  {
    id: 1,
    title: "Market Masterclass: Understanding RSI & MACD Indicators",
    duration: "18:45",
    expert: "Ashwani Gujral",
    thumbnail: "📊",
    isPremium: true,
    views: "125K"
  },
  {
    id: 2,
    title: "Budget Special: Decoding FM's Tax Proposals for Investors",
    duration: "24:30",
    expert: "ET Now Team",
    thumbnail: "📺",
    isPremium: true,
    views: "89K"
  },
  {
    id: 3,
    title: "IPO Mania: How to Pick Winning Public Issues",
    duration: "15:20",
    expert: "Nilesh Shah",
    thumbnail: "🚀",
    isPremium: false,
    views: "67K"
  }
];

const MARKET_NEWS = [
  {
    id: 1,
    headline: "Sensex crosses 73,000 for first time, Nifty at record high",
    source: "Markets",
    time: "10 mins ago",
    sentiment: "positive",
    relatedStock: "Nifty 50"
  },
  {
    id: 2,
    headline: "RBI keeps repo rate unchanged at 6.5%, maintains stance",
    source: "Economy",
    time: "1 hour ago",
    sentiment: "neutral",
    relatedStock: "Banking Index"
  },
  {
    id: 3,
    headline: "Tesla India entry: EV stocks surge on partnership rumors",
    source: "Auto",
    time: "2 hours ago",
    sentiment: "positive",
    relatedStock: "Tata Motors"
  },
  {
    id: 4,
    headline: "Crude oil jumps 3% on Red Sea shipping concerns",
    source: "Commodities",
    time: "3 hours ago",
    sentiment: "negative",
    relatedStock: "ONGC"
  }
];

const ETPrimeContent = () => {
  const { user, currentPlan } = useAuth();
  const planFeatures = PLAN_FEATURES[currentPlan];
  const [activeTab, setActiveTab] = useState('news');
  const [bookmarked, setBookmarked] = useState([]);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const toggleBookmark = (id) => {
    setBookmarked(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleContentClick = (content) => {
    if (content.isPremium && currentPlan === 'basic') {
      setShowPaywall(true);
      setSelectedContent(content);
      return;
    }
    // Open content (in real app, would navigate to full article)
    window.open(`https://economictimes.indiatimes.com/prime/${content.id}`, '_blank');
  };

  // Check if user has premium access
  const hasPremiumAccess = currentPlan !== 'basic';

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              <span style={{ color: '#dc2626' }}>ET</span> Prime
              {hasPremiumAccess && <Crown size={24} color="#fbbf24" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />}
            </h2>
            <p style={{ color: 'var(--text-dim)' }}>
              Premium insights, market analysis & exclusive content from India's leading financial newsroom
            </p>
          </div>
          
          {!hasPremiumAccess && (
            <Link to="/business-model" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ background: '#dc2626' }}>
                <Crown size={18} style={{ marginRight: '0.5rem' }} />
                Unlock ET Prime
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Membership Status Banner */}
      {hasPremiumAccess ? (
        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          padding: '1rem 1.5rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: '#fbbf24',
            padding: '0.75rem',
            borderRadius: '0.75rem'
          }}>
            <Crown size={24} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#fbbf24' }}>
              ET Prime Active - {currentPlan === 'elite' ? 'Elite Access' : 'Pro Access'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Unlimited access to premium articles, videos & expert opinions
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          padding: '1rem 1.5rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.75rem'
          }}>
            <Lock size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600' }}>
              3 Premium Articles Locked
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Upgrade to Pro or Elite to unlock exclusive content
            </div>
          </div>
          <Link to="/business-model" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ background: '#dc2626', fontSize: '0.85rem' }}>
              Upgrade Now
            </button>
          </Link>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('news')}
          className={activeTab === 'news' ? 'btn-primary' : 'btn-secondary'}
        >
          <Newspaper size={18} style={{ marginRight: '0.5rem' }} />
          Editor's Picks
        </button>
        <button 
          onClick={() => setActiveTab('videos')}
          className={activeTab === 'videos' ? 'btn-primary' : 'btn-secondary'}
        >
          <Video size={18} style={{ marginRight: '0.5rem' }} />
          ET Now Videos
        </button>
        <button 
          onClick={() => setActiveTab('markets')}
          className={activeTab === 'markets' ? 'btn-primary' : 'btn-secondary'}
        >
          <TrendingUp size={18} style={{ marginRight: '0.5rem' }} />
          Live Markets
        </button>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'news' && (
        <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Main Articles Feed */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--accent)" />
              Personalized For You
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ET_PRIME_ARTICLES.map((article) => (
                <div 
                  key={article.id} 
                  onClick={() => handleContentClick(article)}
                  className="glass-panel" 
                  style={{ 
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {article.isPremium && !hasPremiumAccess && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(220, 38, 38, 0.2)',
                      color: '#dc2626',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Lock size={12} />
                      ET PRIME
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>{article.thumbnail}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          background: 'var(--glass)', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '0.25rem',
                          color: 'var(--accent)'
                        }}>
                          {article.category}
                        </span>
                        {article.relatedToPortfolio && (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            background: 'rgba(16, 185, 129, 0.2)', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '0.25rem',
                            color: '#10b981'
                          }}>
                            Related to Your Portfolio
                          </span>
                        )}
                      </div>
                      
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                        {article.title}
                      </h4>
                      
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                        {article.summary}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          By {article.author} • {article.readTime} • {article.publishedAt}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(article.id);
                            }}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              color: bookmarked.includes(article.id) ? '#fbbf24' : 'var(--text-dim)'
                            }}
                          >
                            <Bookmark size={16} fill={bookmarked.includes(article.id) ? '#fbbf24' : 'none'} />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Trending Topics */}
          <div>
            <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Trending Topics</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Budget 2024', 'Smallcap Rally', 'Banking Stocks', 'EV Revolution', 'IPO Market', 'Global Markets'].map((topic) => (
                  <span key={topic} style={{
                    fontSize: '0.75rem',
                    background: 'var(--glass)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '2rem',
                    color: 'var(--text-dim)'
                  }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Your Reading Stats</h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Articles Read</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>24 this month</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Watchlist Hits</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>8 articles</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Saved For Later</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{bookmarked.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video size={18} color="var(--accent)" />
            ET Now Market Analysis
          </h3>
          
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {ET_NOW_VIDEOS.map((video) => (
              <div 
                key={video.id}
                onClick={() => handleContentClick(video)}
                className="glass-panel"
                style={{ 
                  padding: '1.25rem',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {video.isPremium && !hasPremiumAccess && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(220, 38, 38, 0.9)',
                    padding: '0.5rem',
                    borderRadius: '0.5rem'
                  }}>
                    <Lock size={16} color="white" />
                  </div>
                )}
                
                <div style={{ 
                  height: '160px', 
                  background: 'var(--glass)', 
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  {video.thumbnail}
                  <div style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {video.duration}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <PlayCircle size={48} color="white" style={{ opacity: 0.9 }} />
                  </div>
                </div>
                
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {video.title}
                </h4>
                
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <div style={{ marginBottom: '0.25rem' }}>Expert: {video.expert}</div>
                  <div>{video.views} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'markets' && (
        <div>
          <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--accent)" />
              Live Market Updates
            </h3>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {MARKET_NEWS.map((news) => (
                <div key={news.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'var(--glass)',
                  borderRadius: '0.75rem',
                  borderLeft: `3px solid ${
                    news.sentiment === 'positive' ? '#10b981' : 
                    news.sentiment === 'negative' ? '#ef4444' : '#f59e0b'
                  }`
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      {news.headline}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {news.source} • {news.time}
                      {news.relatedStock && (
                        <span style={{ color: 'var(--accent)', marginLeft: '0.5rem' }}>
                          📈 {news.relatedStock}
                        </span>
                      )}
                    </div>
                  </div>
                  {news.sentiment === 'positive' ? (
                    <TrendingUp size={20} color="#10b981" />
                  ) : news.sentiment === 'negative' ? (
                    <TrendingDown size={20} color="#ef4444" />
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Market Summary */}
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { name: "Nifty 50", value: "22,456.30", change: "+1.2%", positive: true },
              { name: "Sensex", value: "73,745.60", change: "+1.1%", positive: true },
              { name: "Bank Nifty", value: "47,123.80", change: "-0.3%", positive: false },
              { name: "India VIX", value: "14.25", change: "-2.1%", positive: true }
            ].map((index) => (
              <div key={index.name} className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>{index.name}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{index.value}</div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: index.positive ? '#10b981' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}>
                  {index.positive ? '▲' : '▼'} {index.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywall && (
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
            maxWidth: '450px',
            width: '100%',
            padding: '2.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'rgba(220, 38, 38, 0.2)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Lock size={40} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              ET Prime Member Exclusive
            </h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Unlock access to premium articles, expert analysis, and exclusive market insights from India's leading financial journalists.
            </p>
            <div style={{ 
              background: 'var(--glass)', 
              padding: '1rem', 
              borderRadius: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>What you get with ET Prime</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', fontSize: '0.85rem' }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Unlimited premium articles
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> ET Now video library access
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Personalized news feed
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Portfolio-related alerts
                </li>
              </ul>
            </div>
            <Link to="/business-model" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', background: '#dc2626', marginBottom: '0.75rem' }}>
                <Crown size={18} style={{ marginRight: '0.5rem' }} />
                Unlock ET Prime
              </button>
            </Link>
            <button 
              onClick={() => setShowPaywall(false)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-dim)', 
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ETPrimeContent;
