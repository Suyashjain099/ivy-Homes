import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState('bfad006ee2');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/listings');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('bfad006ee2');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Hero Background Imagery */}
      <img
        src="/assets/hero_skyline.jpg"
        alt="Background"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.2) blur(4px)'
        }}
      />

      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(24px)'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/assets/logo.jpg"
            alt="Ivy Homes Logo"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              objectFit: 'cover',
              margin: '0 auto 16px auto',
              border: '2px solid rgba(245, 158, 11, 0.5)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
            }}
          />
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800' }}>
            Ivy Homes
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Executive Real Estate & Analytics Portal — Pune
          </p>
        </div>

        {/* Demo Preset Quick-Fill */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> Select Demo User Account:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['demo1@ivy.homes', 'demo2@ivy.homes', 'demo3@ivy.homes'].map(acc => (
              <button
                key={acc}
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '7px 0', fontSize: '0.78rem', fontWeight: '600' }}
                onClick={() => setDemoAccount(acc)}
              >
                {acc.split('@')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              color: 'var(--danger)',
              fontSize: '0.85rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '42px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                className="input-field"
                style={{ paddingLeft: '42px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '6px', fontSize: '1rem', fontWeight: '700' }}
          >
            {isSubmitting ? 'Authenticating...' : <>Access Portal <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '24px' }}>
          🔒 Session resilience: Auto-refreshes tokens in background every 12 mins.
        </p>
      </div>
    </div>
  );
};
