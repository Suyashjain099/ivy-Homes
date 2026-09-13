import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSaved } from '../../context/SavedContext';
import { Building2, Heart, BarChart3, LogOut, Home, MapPin, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { savedIds } = useSaved();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: '16px',
      zIndex: 100,
      maxWidth: '1400px',
      margin: '16px auto 28px auto',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <NavLink to="/listings" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="/assets/logo.jpg"
            alt="Ivy Homes Logo"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="gradient-text" style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                Ivy Homes
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                PRO
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <MapPin size={13} color="var(--primary)" />
              <span>Pune • Magarpatta</span>
            </div>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <NavLink
          to="/listings"
          className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '9px 18px', fontSize: '0.88rem' }}
        >
          <Home size={16} /> Listings
        </NavLink>

        <NavLink
          to="/rentals-projects"
          className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '9px 18px', fontSize: '0.88rem' }}
        >
          <Building2 size={16} /> Rentals & Projects
        </NavLink>

        <NavLink
          to="/saved"
          className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '9px 18px', fontSize: '0.88rem', position: 'relative' }}
        >
          <Heart size={16} color={savedIds.size > 0 ? '#ef4444' : 'currentColor'} fill={savedIds.size > 0 ? '#ef4444' : 'none'} /> Saved
          {savedIds.size > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700'
            }}>
              {savedIds.size}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/insights"
          className={({ isActive }) => `btn ${isActive ? 'btn-gold' : 'btn-secondary'}`}
          style={{ padding: '9px 18px', fontSize: '0.88rem' }}
        >
          <BarChart3 size={16} /> Insights & Findings
        </NavLink>
      </nav>

      {/* User Badge */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} color="var(--gold)" />
            <span>{user.email}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px' }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      )}
    </header>
  );
};
