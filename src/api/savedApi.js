import { request } from './apiClient';

export const savedApi = {
  getSaved: async () => {
    // Working endpoint is /v1/saved
    return await request('/v1/saved');
  },

  save: async (id) => {
    // Note: Server requires body key to be listing_id (not id)
    return await request('/v1/saved', {
      method: 'POST',
      body: { listing_id: id }
    });
  },

  remove: async (id) => {
    return await request(`/v1/saved/${id}`, {
      method: 'DELETE'
    });
  }
};
