import React from 'react';
import { useSaved } from '../context/SavedContext';
import { ListingCard } from '../components/listings/ListingCard';
import { Heart, Trash2 } from 'lucide-react';

export const SavedListingsPage = () => {
  const { savedListings, loading, savedIds } = useSaved();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto 60px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart color="#ef4444" fill="#ef4444" /> Saved Properties
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            Listings you have bookmarked. Persisted per user via <code style={{ color: 'var(--primary)' }}>/v1/saved</code>.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#fff', fontWeight: '700' }}>
          {savedIds.size} Saved Items
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          🔄 Loading saved listings...
        </div>
      ) : savedListings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Heart size={48} color="var(--text-dim)" style={{ margin: '0 auto 16px auto' }} />
          <h3>No saved properties yet</h3>
          <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>Click the heart icon on any property card to save it to your favourites.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {savedListings.map(listing => (
            <ListingCard key={listing.listing_id || listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};
