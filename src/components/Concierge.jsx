import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle2, Loader2, Lock, Zap, AlertTriangle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGroqChatCompletion, parseInsights, cleanResponse } from '../utils/groqService';
import { useAuth, PLAN_FEATURES } from '../contexts/AuthContext';

const Message = ({ text, sender, options, onOptionClick }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: sender === 'ai' ? 'row' : 'row-reverse', 
    gap: '1rem', 
    marginBottom: '1.5rem',
    alignItems: 'flex-end',
    animation: 'fadeIn 0.3s ease-out'
  }}>
    <div style={{ 
      width: '32px', 
      height: '32px', 
      borderRadius: '50%', 
      background: sender === 'ai' ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'var(--glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: sender === 'ai' ? 'none' : '1px solid var(--glass-border)'
    }}>
      {sender === 'ai' ? <Bot size={18} color="white" /> : <User size={18} color="var(--text-dim)" />}
    </div>
    <div style={{ maxWidth: '70%' }}>
      <div style={{ 
        background: sender === 'ai' ? 'var(--glass)' : 'var(--accent)', 
        color: sender === 'ai' ? 'var(--text-main)' : 'var(--primary)',
        padding: '0.75rem 1.25rem', 
        borderRadius: sender === 'ai' ? '1rem 1rem 1rem 0' : '1rem 1rem 0 1rem',
        border: sender === 'ai' ? '1px solid var(--glass-border)' : 'none',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        fontWeight: sender === 'ai' ? '400' : '500'
      }}>
        {text}
      </div>
      {options && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
          {options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => onOptionClick(opt)}
              className="btn-secondary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Waveform = () => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        style={{ 
          width: '3px', 
          height: '100%', 
          background: 'var(--accent)', 
          borderRadius: '2px',
          animation: `wave 1s ease-in-out infinite ${i * 0.1}s`
        }} 
      />
    ))}
  </div>
);

const QueryLimitBanner = ({ remaining, plan, totalAllowed }) => {
  const isLow = remaining <= 2 && remaining > 0;
  const isEmpty = remaining === 0;
  
  if (plan === 'elite') {
    return (
      <div style={{
        padding: '0.75rem 1rem',
        background: 'rgba(251, 191, 36, 0.1)',
        borderBottom: '1px solid rgba(251, 191, 36, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <Zap size={16} color="#fbbf24" />
        <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>Unlimited AI Queries (ET Elite)</span>
      </div>
    );
  }
  
  return (
    <div style={{
      padding: '0.75rem 1rem',
      background: isEmpty ? 'rgba(239, 68, 68, 0.1)' : isLow ? 'rgba(250, 204, 21, 0.1)' : 'rgba(56, 189, 248, 0.05)',
      borderBottom: `1px solid ${isEmpty ? 'rgba(239, 68, 68, 0.3)' : isLow ? 'rgba(250, 204, 21, 0.3)' : 'var(--glass-border)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    }}>
      {isEmpty ? <Lock size={16} color="#ef4444" /> : isLow ? <AlertTriangle size={16} color="#facc15" /> : <Sparkles size={16} color="var(--accent)" />}
      <span style={{ 
        fontSize: '0.8rem', 
        color: isEmpty ? '#ef4444' : isLow ? '#facc15' : 'var(--text-dim)'
      }}>
        {isEmpty 
          ? 'Daily limit reached. Upgrade for more queries.' 
          : `${remaining} of ${totalAllowed} AI queries remaining today`
        }
      </span>
      {(isLow || isEmpty) && (
        <Link to="/business-model" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginLeft: '0.5rem', cursor: 'pointer' }}>
            Upgrade
          </span>
        </Link>
      )}
    </div>
  );
};

const IntelligenceSidebar = ({ insights, planFeatures }) => (
  <div className="glass-panel" style={{ width: '300px', padding: '1.5rem', height: '100%' }}>
    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Sparkles size={18} color="var(--accent)" /> AI Reflection
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {insights.map((ins, i) => (
        <div key={i} className="fade-in" style={{ 
          padding: '1rem', 
          background: 'rgba(56, 189, 248, 0.05)', 
          border: '1px solid rgba(56, 189, 248, 0.1)', 
          borderRadius: '0.75rem' 
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: '700', marginBottom: '0.25rem' }}>{ins.tag}</div>
          <div style={{ fontSize: '0.85rem', color: 'white' }}>{ins.value}</div>
        </div>
      ))}
      {insights.length === 0 && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '2rem' }}>
          Interrogating your needs to build a financial persona...
        </p>
      )}
      
      {!planFeatures.realTimeAlerts && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(107, 114, 128, 0.1)',
          borderRadius: '0.75rem',
          border: '1px dashed var(--glass-border)',
          textAlign: 'center'
        }}>
          <Lock size={20} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
            Upgrade to Pro for real-time AI alerts and deeper insights
          </p>
          <Link to="/business-model" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', cursor: 'pointer' }}>
              Learn More →
            </span>
          </Link>
        </div>
      )}
    </div>
  </div>
);

const Concierge = () => {
  const [messages, setMessages] = useState([]);
  const [apiHistory, setApiHistory] = useState([]);
  const [insights, setInsights] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Voice-related state
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);
  
  const { currentPlan, canUseAI, incrementAIUsage, user } = useAuth();
  const planFeatures = PLAN_FEATURES[currentPlan];
  const aiUsage = canUseAI();

  // Check for speech support
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if (!speechSupported) return null;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Indian English
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setInputValue(transcript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    return recognition;
  }, [speechSupported]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const recognition = initSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      }
    }
  };

  // Text-to-speech for AI responses
  const speakText = useCallback((text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Initial Greeting
  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      const initialGreeting = await getGroqChatCompletion([]);
      const newInsights = parseInsights(initialGreeting);
      const text = cleanResponse(initialGreeting);
      
      setMessages([{ sender: 'ai', text }]);
      setApiHistory([{ role: 'assistant', content: initialGreeting }]);
      if (newInsights.length > 0) setInsights(newInsights);
      setLoading(false);
      
      // Speak initial greeting if voice enabled
      if (voiceEnabled) {
        speakText(text);
      }
    };
    initChat();
  }, []);

  const handleSend = async (text = inputValue) => {
    if (!text.trim() || loading) return;
    
    // Stop any ongoing speech when user sends message
    stopSpeaking();
    
    // Check if user can use AI
    if (!aiUsage.allowed) {
      const limitMessage = "You've reached your daily AI query limit. Upgrade to ET Pro for 50 queries/day or ET Elite for unlimited access!";
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: limitMessage 
      }]);
      if (voiceEnabled) speakText(limitMessage);
      return;
    }
    
    // Increment usage
    incrementAIUsage();
    
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    const updatedHistory = [...apiHistory, { role: 'user', content: text }];
    setApiHistory(updatedHistory);

    const aiResponse = await getGroqChatCompletion(updatedHistory);
    const newInsights = parseInsights(aiResponse);
    const cleanedText = cleanResponse(aiResponse);
    
    setMessages(prev => [...prev, { sender: 'ai', text: cleanedText }]);
    setApiHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    
    if (newInsights.length > 0) {
      setInsights(prev => {
        // Merge or replace based on tags
        const existingTags = new Set(prev.map(i => i.tag));
        const filteredNew = newInsights.filter(i => !existingTags.has(i.tag));
        return [...prev, ...filteredNew];
      });
    }
    
    // Speak AI response if voice enabled
    if (voiceEnabled) {
      speakText(cleanedText);
    }
    
    setLoading(false);
  };

  const isLimitReached = !aiUsage.allowed;

  return (
    <div className="fade-in" style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 12rem)', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--glass-border)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>ET Concierge Onboarding</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Waveform />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <CheckCircle2 size={16} color="var(--success)" /> Profile {insights.length * 20 + 20}% Complete
            </div>
          </div>
        </div>

        {/* Query Limit Banner */}
        <QueryLimitBanner 
          remaining={aiUsage.remaining} 
          plan={currentPlan}
          totalAllowed={planFeatures.aiQueriesPerDay}
        />

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {messages.map((msg, i) => (
            <Message key={i} {...msg} onOptionClick={handleSend} />
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.6, animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'var(--glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--glass-border)'
              }}>
                <Bot size={18} color="var(--text-dim)" />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={16} className="animate-spin" /> ET Concierge is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ 
          padding: '1.5rem', 
          borderTop: '1px solid var(--glass-border)',
          background: isListening ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
          transition: 'background 0.3s ease'
        }}>
          {/* Voice Status Indicator */}
          {isListening && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '2rem',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#ef4444',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: '500' }}>
                Listening... Speak now
              </span>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
              `}</style>
            </div>
          )}

          {isSpeaking && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '2rem',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <Volume2 size={14} color="#10b981" />
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '500' }}>
                Speaking...
              </span>
              <button 
                onClick={stopSpeaking}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  marginLeft: '0.5rem'
                }}
              >
                <X size={14} color="#10b981" />
              </button>
            </div>
          )}

          {isLimitReached ? (
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '1rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              textAlign: 'center'
            }}>
              <Lock size={20} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: '0.75rem' }}>
                Daily AI query limit reached
              </p>
              <Link to="/business-model" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>
                  Upgrade to ET Pro
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {/* Voice Input Button */}
              {speechSupported && (
                <button
                  onClick={toggleListening}
                  style={{
                    background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'var(--glass)',
                    border: `1px solid ${isListening ? '#ef4444' : 'var(--glass-border)'}`,
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                >
                  {isListening ? <MicOff size={20} color="#ef4444" /> : <Mic size={20} color="var(--accent)" />}
                </button>
              )}

              {/* Text Input */}
              <div style={{ position: 'relative', flex: 1 }}>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? 'Listening...' : `Ask anything... (${aiUsage.remaining} queries left today)`}
                  disabled={isListening}
                  style={{ 
                    width: '100%', 
                    background: 'var(--glass)', 
                    border: '1px solid var(--glass-border)', 
                    padding: '1rem 3rem 1rem 1.5rem', 
                    borderRadius: '2rem', 
                    color: 'white',
                    fontSize: '1rem',
                    opacity: isListening ? 0.7 : 1
                  }}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isListening}
                  style={{ 
                    position: 'absolute', 
                    right: '0.5rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    background: inputValue.trim() && !isListening ? 'var(--accent)' : 'var(--glass)',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() && !isListening ? 'pointer' : 'not-allowed',
                    opacity: inputValue.trim() && !isListening ? 1 : 0.5
                  }}
                >
                  <Send size={18} color="var(--primary)" />
                </button>
              </div>

              {/* Voice Output Toggle */}
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled) stopSpeaking();
                }}
                style={{
                  background: voiceEnabled ? 'rgba(16, 185, 129, 0.2)' : 'var(--glass)',
                  border: `1px solid ${voiceEnabled ? '#10b981' : 'var(--glass-border)'}`,
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
              >
                {voiceEnabled ? <Volume2 size={20} color="#10b981" /> : <VolumeX size={20} color="var(--text-dim)" />}
              </button>
            </div>
          )}
        </div>
      </div>
      <IntelligenceSidebar insights={insights} planFeatures={planFeatures} />
    </div>
  );
};

export default Concierge;
