import React from 'react';
import { Filter, RefreshCw, Search, ShieldCheck } from 'lucide-react';

export const ListingFilterSidebar = ({ filters, onFilterChange, onReset, localities = [] }) => {
  return (
    <aside className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '1.05rem', color: '#fff' }}>
          <Filter size={18} color="var(--primary)" /> Filters
        </div>
        <button onClick={onReset} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
          Property Name Search
        </label>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '36px' }}
            placeholder="Search apartment name..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Locality Filter */}
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
          Locality
        </label>
        <select
          className="input-field"
          value={filters.locality || ''}
          onChange={(e) => onFilterChange('locality', e.target.value)}
          style={{ cursor: 'pointer' }}
        >
          <option value="">All Localities in Pune</option>
          {localities.map(loc => (
            <option key={loc} value={loc} style={{ background: '#111827' }}>
              {loc.charAt(0).toUpperCase() + loc.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms (BHK) Filter */}
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
          Bedrooms (BHK)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {['', '1', '2', '3', '4'].map(bhk => (
            <button
              key={bhk || 'all'}
              className={`btn ${filters.bhk === bhk ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 0', fontSize: '0.82rem' }}
              onClick={() => onFilterChange('bhk', bhk)}
            >
              {bhk ? `${bhk} BHK` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Furnishing Filter */}
      <div>
        <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
          Furnishing
        </label>
        <select
          className="input-field"
          value={filters.furnishing || ''}
          onChange={(e) => onFilterChange('furnishing', e.target.value)}
          style={{ cursor: 'pointer' }}
        >
          <option value="">Any Furnishing</option>
          <option value="unfurnished" style={{ background: '#111827' }}>Unfurnished</option>
          <option value="semi-furnished" style={{ background: '#111827' }}>Semi-furnished</option>
          <option value="fully-furnished" style={{ background: '#111827' }}>Fully-furnished</option>
        </select>
      </div>

      {/* Hide Corrupt Data Toggle */}
      <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: '#d1d5db' }}>
          <input
            type="checkbox"
            checked={filters.hideCorrupt || false}
            onChange={(e) => onFilterChange('hideCorrupt', e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--primary)" /> Hide Corrupt Records
          </span>
        </label>
      </div>
    </aside>
  );
};
