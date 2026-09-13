import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaved } from '../../context/SavedContext';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Heart, CheckCircle2, AlertTriangle, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';

export const formatPrice = (price) => {
  if (!price || price <= 0) return 'Price N/A';
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} Lakh`;
  return `₹ ${price.toLocaleString('en-IN')}`;
};

export const ListingCard = ({ listing, className }) => {
  const navigate = useNavigate();
  const { isListingSaved, toggleSave } = useSaved();

  const lid = listing.listing_id || listing.id;
  const isSaved = isListingSaved(lid);

  const pricePerSqft = (listing.price && listing.carpet_area && listing.carpet_area > 0)
    ? Math.round(listing.price / listing.carpet_area)
    : null;

  const isCorrupt = (listing.price <= 0) || (listing.carpet_area <= 0) || (listing.floor > listing.total_floors);

  let bgImage = '/assets/hero_apartment.jpg';
  if (listing.property_type?.toLowerCase().includes('villa')) {
    bgImage = '/assets/hero_villa.jpg';
  } else if (listing.property_type?.toLowerCase().includes('house') || listing.property_type?.toLowerCase().includes('plot')) {
    bgImage = '/assets/hero_skyline.jpg';
  }

  return (
    <Card
      className={cn("group flex flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01]", className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={() => navigate(`/listings/${lid}`)}
    >
      {/* Thumbnail Container */}
      <div style={{
        height: '200px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}>
        <img
          src={bgImage}
          alt={listing.apartment_name || 'Property'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        
        {/* Dark Gradient Content Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(11, 17, 32, 0.95) 0%, rgba(11, 17, 32, 0.2) 60%, rgba(0,0,0,0.4) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '14px'
        }}>
          {/* Top Badges & Save Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {listing.is_verified && (
                <Badge variant="verified">
                  <CheckCircle2 size={12} /> Verified
                </Badge>
              )}
              {isCorrupt && (
                <Badge variant="corrupt">
                  <AlertTriangle size={12} /> Corrupt Data
                </Badge>
              )}
              <Badge variant="secondary">
                {listing.property_type || 'Apartment'}
              </Badge>
            </div>

            <Button
              size="icon"
              variant="ghost"
              style={{
                height: '36px',
                width: '36px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(listing);
              }}
            >
              <Heart size={18} color={isSaved ? '#ef4444' : '#ffffff'} fill={isSaved ? '#ef4444' : 'none'} />
            </Button>
          </div>

          {/* Title & Locality Overlay */}
          <div>
            <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.7)', lineHeight: '1.3' }}>
              {listing.apartment_name || 'Property Listing'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', fontSize: '0.82rem', marginTop: '4px' }}>
              <MapPin size={13} color="var(--primary)" />
              <span style={{ textTransform: 'capitalize' }}>{listing.locality}, Pune</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {/* Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '12px', fontSize: '0.82rem', color: '#cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bed size={15} color="var(--accent)" />
            <span>{listing.bedroom || 0} BHK</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bath size={15} color="var(--accent)" />
            <span>{listing.bathroom || 0} Bath</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Maximize2 size={15} color="var(--accent)" />
            <span>{listing.carpet_area || 0} sqft</span>
          </div>
        </div>

        {/* Price & Rate Footer */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)' }}>
              {formatPrice(listing.price)}
            </div>
            {pricePerSqft && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ₹ {pricePerSqft.toLocaleString('en-IN')} / sqft
              </div>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Floor {listing.floor || 0}/{listing.total_floors || 0}
          </div>
        </div>
      </div>
    </Card>
  );
};
