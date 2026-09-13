import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsApi } from '../api/listingsApi';
import { useSaved } from '../context/SavedContext';
import { formatPrice } from '../components/listings/ListingCard';
import { ArrowLeft, Heart, MapPin, Bed, Bath, Layers, Maximize2, ShieldCheck, Phone, User, Calendar, AlertTriangle, Building } from 'lucide-react';

export const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isListingSaved, toggleSave } = useSaved();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // Correct path /v1/listings/{id}
        const data = await listingsApi.getListingById(id);
        setListing(data);
      } catch (err) {
        console.error('Failed to load listing detail:', err);
        setError(err.message || 'Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔄</div>
        Loading property details for {id}...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '36px', textAlign: 'center' }} className="glass-panel">
        <AlertTriangle size={48} color="var(--danger)" style={{ margin: '0 auto 16px auto' }} />
        <h2>Property Listing Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{error || 'Unable to retrieve listing details'}</p>
        <button onClick={() => navigate('/listings')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          <ArrowLeft size={18} /> Back to Listings
        </button>
      </div>
    );
  }

  const isSaved = isListingSaved(id);
  const pricePerSqft = (listing.price && listing.carpet_area && listing.carpet_area > 0)
    ? Math.round(listing.price / listing.carpet_area)
    : null;

  const isCorrupt = (listing.price <= 0) || (listing.carpet_area <= 0) || (listing.floor > listing.total_floors);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto 60px auto', padding: '0 24px' }}>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero Banner Container */}
      <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{
          height: '280px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.2) 100%), #111827',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative'
        }}>
          {/* Top Badges */}
          <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '8px' }}>
            {listing.is_verified && (
              <span className="badge badge-verified"><ShieldCheck size={14} /> Verified Listing</span>
            )}
            {isCorrupt && (
              <span className="badge badge-corrupt"><AlertTriangle size={14} /> Corrupt Data Flagged</span>
            )}
            <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              {listing.property_type || 'Apartment'}
            </span>
          </div>

          <button
            onClick={() => toggleSave(listing)}
            className="btn btn-secondary"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              borderRadius: '30px',
              padding: '8px 18px',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Heart size={18} color={isSaved ? '#ef4444' : '#fff'} fill={isSaved ? '#ef4444' : 'none'} />
            {isSaved ? 'Saved' : 'Save Property'}
          </button>

          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff' }}>
            {listing.apartment_name || 'Property Detail'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>
            <MapPin size={16} color="var(--primary)" />
            <span style={{ textTransform: 'capitalize' }}>{listing.locality}, Pune</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>Listing ID: {listing.listing_id}</span>
          </div>
        </div>

        {/* Specs Overview Bar */}
        <div style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
              {formatPrice(listing.price)}
            </div>
            {pricePerSqft && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹ {pricePerSqft.toLocaleString('en-IN')} / sqft</div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configuration</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bed size={18} color="var(--accent)" /> {listing.bedroom || 0} BHK / {listing.bathroom || 0} Bath
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Carpet Area</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Maximize2 size={18} color="var(--accent)" /> {listing.carpet_area || 0} sqft
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Floor Level</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent)" /> Floor {listing.floor || 0} of {listing.total_floors || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Description & Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '14px' }}>
              Description
            </h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {listing.description || 'No description available for this property listing.'}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '18px' }}>
              Detailed Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Furnishing:</span>
                <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{listing.furnishing || 'Unspecified'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Facing Direction:</span>
                <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{listing.facing_direction || 'N/A'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Super Built-up Area:</span>
                <strong style={{ color: '#fff' }}>{listing.super_built_up_area || 'N/A'} sqft</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Covered Parking:</span>
                <strong style={{ color: '#fff' }}>{listing.covered_parking || 0} Slots</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Balconies:</span>
                <strong style={{ color: '#fff' }}>{listing.balcony || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Posted Date:</span>
                <strong style={{ color: '#fff' }}>{listing.posted_at ? new Date(listing.posted_at).toLocaleDateString() : 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Map Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--primary)" /> Seller Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ color: '#fff', fontWeight: '600' }}>
                {listing.posted_by_name || 'Agent'} ({listing.posted_by || 'Agent'})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '1rem' }}>
                <Phone size={16} /> {listing.posted_by_contact || 'Contact Unspecified'}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--accent)" /> Location Coordinates
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Latitude: <strong style={{ color: '#fff' }}>{listing.latitude}</strong><br />
              Longitude: <strong style={{ color: '#fff' }}>{listing.longitude}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
