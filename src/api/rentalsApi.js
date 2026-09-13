import { request } from './apiClient';

export const rentalsApi = {
  getRentals: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.offset !== undefined) queryParams.set('offset', params.offset);
    if (params.limit !== undefined) queryParams.set('limit', Math.min(params.limit, 50));
    if (params.locality) queryParams.set('locality', params.locality);
    if (params.bhk) queryParams.set('bhk', params.bhk);
    if (params.furnishing) queryParams.set('furnishing', params.furnishing);

    const path = `/v1/rentals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await request(path);
  },

  getRentalById: async (id) => {
    // Plural /v1/rentals/{id}
    return await request(`/v1/rentals/${id}`);
  }
};
