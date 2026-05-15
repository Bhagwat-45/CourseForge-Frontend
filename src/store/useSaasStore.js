import { create } from 'zustand';
import api from '../lib/api';

export const useSaasStore = create((set, get) => ({
  generation_count: 0,
  cycle_end_date: null,
  limit: 5,
  isLoading: false,
  
  fetchUsage: async () => {
    if (!localStorage.getItem('courseforge_token')) return;
    set({ isLoading: true });
    try {
      const response = await api.get('/api/saas/usage');
      set({ 
        generation_count: response.data.generation_count,
        cycle_end_date: response.data.cycle_end_date,
        limit: response.data.limit || 5,
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch usage:", error);
      set({ isLoading: false });
    }
  },

  canGenerate: () => {
    const state = get();
    return state.generation_count < state.limit;
  },
  
  canDownload: () => {
    return true; // All users can download in the free model
  }
}));
