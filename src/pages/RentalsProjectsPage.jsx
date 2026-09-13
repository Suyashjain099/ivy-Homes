import React, { useState, useEffect } from 'react';
import { rentalsApi } from '../api/rentalsApi';
import { projectsApi } from '../api/projectsApi';
import { formatPrice } from '../components/listings/ListingCard';
import { Building2, Key, MapPin, Calendar, Layers, ShieldCheck, Tag } from 'lucide-react';

export const RentalsProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('rentals');
  const [rentals, setRentals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'rentals') {
          const res = await rentalsApi.getRentals({ limit: 50 });
          setRentals(res.results || []);
        } else {
          const res = await projectsApi.getProjects({ limit: 50 });
          setProjects(res.results || []);
        }
      } catch (err) {
        console.error(`Error loading ${activeTab}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto 60px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>
            {activeTab === 'rentals' ? '🔑 Rental Properties' : '🏗️ Builder Projects'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            {activeTab === 'rentals'
              ? 'Browse verified rental accommodations in Pune with monthly rent & deposit details.'
              : 'Explore new launches & under-construction projects with normalized INR prices.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="glass-panel" style={{ padding: '6px', display: 'flex', gap: '6px' }}>
          <button
            className={`btn ${activeTab === 'rentals' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('rentals')}
            style={{ padding: '8px 20px' }}
          >
            <Key size={16} /> Rentals
          </button>
          <button
            className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('projects')}
            style={{ padding: '8px 20px' }}
          >
            <Building2 size={16} /> Projects
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
          🔄 Loading {activeTab}...
        </div>
      ) : activeTab === 'rentals' ? (
        /* Rentals Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {rentals.map(r => (
            <div key={r.listing_id || r.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '700' }}>{r.apartment_name || r.title}</h3>
                <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{r.furnishing}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <MapPin size={14} color="var(--primary)" />
                <span style={{ textTransform: 'capitalize' }}>{r.locality}, Pune</span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>
                    ₹ {r.price ? r.price.toLocaleString('en-IN') : 'N/A'} / mo
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deposit</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>
                    ₹ {r.deposit ? r.deposit.toLocaleString('en-IN') : 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-dim)', paddingTop: '6px' }}>
                <span>Bedrooms: <strong>{r.bedroom || 0} BHK</strong></span>
                <span>Area: <strong>{r.carpet_area || 0} sqft</strong></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Projects Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {projects.map(p => (
            <div key={p.project_id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '700' }}>{p.apartment_name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600', marginTop: '2px' }}>
                    By {p.developer_name}
                  </div>
                </div>
                <span className="badge" style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--accent)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  {p.project_status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <MapPin size={14} color="var(--primary)" />
                <span style={{ textTransform: 'capitalize' }}>{p.locality}, Pune</span>
              </div>

              {/* Price Range */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Project Price Range (Normalized INR)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {formatPrice(p.price_min_inr)} - {formatPrice(p.price_max_inr)}
                </div>
              </div>

              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Total Units</div>
                  <strong>{p.total_units || 'N/A'}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Towers</div>
                  <strong>{p.total_towers || 'N/A'}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Possession</div>
                  <strong>{p.possession_date || 'N/A'}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
