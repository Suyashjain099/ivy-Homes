import { request } from './apiClient';

export const projectsApi = {
  getProjects: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.offset !== undefined) queryParams.set('offset', params.offset);
    if (params.limit !== undefined) queryParams.set('limit', Math.min(params.limit, 50));
    if (params.locality) queryParams.set('locality', params.locality);

    const path = `/v1/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const data = await request(path);

    // Normalize unit discrepancy (Lie #8):
    // price_min and price_max are given in Lakhs / Crores, convert to INR for display consistency
    if (data && data.results) {
      data.results = data.results.map(p => {
        const rawMin = p.price_min || 0;
        const rawMax = p.price_max || 0;
        
        const minInr = rawMin < 100 ? rawMin * 10000000 : (rawMin < 10000 ? rawMin * 100000 : rawMin);
        const maxInr = rawMax < 100 ? rawMax * 10000000 : (rawMax < 10000 ? rawMax * 100000 : rawMax);

        return {
          ...p,
          price_min_inr: Math.round(minInr),
          price_max_inr: Math.round(maxInr)
        };
      });
    }

    return data;
  },

  getProjectById: async (id) => {
    const p = await request(`/v1/projects/${id}`);
    if (p) {
      const rawMin = p.price_min || 0;
      const rawMax = p.price_max || 0;
      p.price_min_inr = Math.round(rawMin < 100 ? rawMin * 10000000 : (rawMin < 10000 ? rawMin * 100000 : rawMin));
      p.price_max_inr = Math.round(rawMax < 100 ? rawMax * 10000000 : (rawMax < 10000 ? rawMax * 100000 : rawMax));
    }
    return p;
  }
};
