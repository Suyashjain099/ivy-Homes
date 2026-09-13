import { request } from './apiClient';

export const listingsApi = {
  getListings: async (params = {}) => {
    // API uses offset & limit capped at 50 max (Lie #5 & Lie #6)
    const queryParams = new URLSearchParams();
    
    if (params.offset !== undefined) queryParams.set('offset', params.offset);
    if (params.limit !== undefined) queryParams.set('limit', Math.min(params.limit, 50));
    if (params.locality) queryParams.set('locality', params.locality);
    if (params.bhk) queryParams.set('bhk', params.bhk);
    if (params.furnishing) queryParams.set('furnishing', params.furnishing);
    if (params.min_price) queryParams.set('min_price', params.min_price);
    if (params.max_price) queryParams.set('max_price', params.max_price);

    const path = `/v1/listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await request(path);
  },

  getListingById: async (id) => {
    // Correct endpoint is plural /v1/listings/{id} (Lie #6)
    return await request(`/v1/listings/${id}`);
  }
};
