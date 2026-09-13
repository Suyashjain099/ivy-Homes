import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { savedApi } from '../api/savedApi';
import { useAuth } from './AuthContext';

const SavedContext = createContext(null);

export const SavedProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState(new Set());
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedIds(new Set());
      setSavedListings([]);
      return;
    }
    try {
      setLoading(true);
      const res = await savedApi.getSaved();
      if (res && res.results) {
        setSavedListings(res.results);
        const ids = new Set(res.results.map(item => item.listing_id || item.id));
        setSavedIds(ids);
      }
    } catch (err) {
      console.error('Error fetching saved listings:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const toggleSave = async (listing) => {
    const lid = listing.listing_id || listing.id;
    const isSaved = savedIds.has(lid);

    // Optimistic UI update
    setSavedIds(prev => {
      const next = new Set(prev);
      if (isSaved) next.delete(lid);
      else next.add(lid);
      return next;
    });

    if (isSaved) {
      setSavedListings(prev => prev.filter(item => (item.listing_id || item.id) !== lid));
    } else {
      setSavedListings(prev => [listing, ...prev]);
    }

    try {
      if (isSaved) {
        await savedApi.remove(lid);
      } else {
        await savedApi.save(lid);
      }
    } catch (err) {
      console.error('Failed to toggle save on server:', err);
      // Revert on failure
      fetchSaved();
    }
  };

  const isListingSaved = (id) => savedIds.has(id);

  return (
    <SavedContext.Provider value={{ savedIds, savedListings, toggleSave, isListingSaved, loading, refreshSaved: fetchSaved }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) throw new Error('useSaved must be used within SavedProvider');
  return context;
};
