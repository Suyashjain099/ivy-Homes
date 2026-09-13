import React, { useState, useEffect, useCallback } from 'react';
import { listingsApi } from '../api/listingsApi';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingFilterSidebar } from '../components/listings/ListingFilterSidebar';
import { ChevronLeft, ChevronRight, Home, ShieldAlert, Sparkles, Building2, MapPin } from 'lucide-react';

export const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    locality: '',
    bhk: '',
    furnishing: '',
    hideCorrupt: true
  });

  const limit = 20; // 20 per page

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listingsApi.getListings({
        offset,
        limit,
        locality: filters.locality || undefined,
        bhk: filters.bhk ? parseInt(filters.bhk, 10) : undefined,
        furnishing: filters.furnishing || undefined
      });

      if (res) {
        setListings(res.results || []);
        setTotal(res.total || (res.results || []).length);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError(err.message || 'Error fetching listings');
    } finally {
      setLoading(false);
    }
  }, [offset, filters.locality, filters.bhk, filters.furnishing]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOffset(0); // reset page on filter change
  };

  const handleResetFilters = () => {
    setFilters({ search: '', locality: '', bhk: '', furnishing: '', hideCorrupt: true });
    setOffset(0);
  };

  // Client-side filtering fallback for search keyword and hide corrupt toggle
  const filteredListings = listings.filter(item => {
    if (filters.search && !item.apartment_name?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.hideCorrupt) {
      const isCorrupt = (item.price <= 0) || (item.carpet_area <= 0) || (item.floor > item.total_floors);
      if (isCorrupt) return false;
    }
    return true;
  });

  const localities = ['wakad', 'viman nagar', 'kharadi', 'baner', 'hadapsar', 'kothrud', 'magarpatta', 'hinjewadi', 'pimple saudagar'];

  return (
    <div style={{ padding: '0 24px 48px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Luxury Hero Banner */}
      <div className="glass-panel" style={{
        marginBottom: '28px',
        overflow: 'hidden',
        position: 'relative',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 36px',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <img
          src="/assets/hero_skyline.jpg"
          alt="Pune Skyline"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.35)'
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-gold">
              <Sparkles size={12} /> Executive Real Estate
            </span>
            <span className="badge badge-verified">
              <MapPin size={12} /> Pune Metropolitan Region
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.2' }}>
            Discover Premier Residences in Pune
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '6px' }}>
            Browse verified listings across Wakad, Kharadi, Magarpatta & Baner. Filtered for data accuracy.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Sidebar Filters */}
        <ListingFilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          localities={localities}
        />

        {/* Listings Grid Container */}
        <div>
          {/* Top Bar Stats */}
          <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: '#fff' }}>{filteredListings.length}</strong> properties (Offset {offset} of {total})
            </div>
            {filters.hideCorrupt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: '600' }}>
                <ShieldAlert size={14} /> Corrupt records hidden
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔄</div>
              Loading Pune properties...
            </div>
          ) : error ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--danger)' }}>
              ⚠️ {error}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3>No listings match your filter criteria</h3>
              <button onClick={handleResetFilters} className="btn btn-secondary" style={{ marginTop: '16px' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '22px' }}>
              {filteredListings.map(listing => (
                <ListingCard key={listing.listing_id || listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '36px' }}>
            <button
              disabled={offset === 0 || loading}
              onClick={() => setOffset(prev => Math.max(0, prev - limit))}
              className="btn btn-secondary"
            >
              <ChevronLeft size={18} /> Previous Page
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Page {Math.floor(offset / limit) + 1}
            </span>
            <button
              disabled={offset + limit >= total || loading}
              onClick={() => setOffset(prev => prev + limit)}
              className="btn btn-secondary"
            >
              Next Page <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
