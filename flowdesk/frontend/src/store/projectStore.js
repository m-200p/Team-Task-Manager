import { create } from 'zustand';
import api from '../services/api';

export const useProjectStore = create((set) => ({
  projects: [],
  activeProject: null,
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/projects');
      set({ projects: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createProject: async (payload) => {
    const { data } = await api.post('/projects', payload);
    set(s => ({ projects: [data, ...s.projects] }));
    return data;
  },

  setActiveProject: (project) => set({ activeProject: project }),

  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`);
    set(s => ({ projects: s.projects.filter(p => p._id !== id) }));
  },

  addMember: async (projectId, userId, role) => {
    const { data } = await api.post(`/projects/${projectId}/members`, { userId, role });
    set(s => ({
      projects: s.projects.map(p => p._id === projectId ? data : p)
    }));
    return data;
  }
}));