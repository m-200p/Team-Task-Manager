import { create } from 'zustand';
import api from '../services/api';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/tasks', { params });
      set({ tasks: data, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  createTask: async (payload) => {
    const { data } = await api.post('/tasks', payload);
    set(s => ({ tasks: [data, ...s.tasks] }));
    return data;
  },

  updateTask: async (id, payload) => {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    set(s => ({ tasks: s.tasks.map(t => t._id === id ? data : t) }));
    return data;
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set(s => ({ tasks: s.tasks.filter(t => t._id !== id) }));
  },

  // Derived selectors
  byStatus: (status) => get().tasks.filter(t => t.status === status),
  overdueTasks: () => get().tasks.filter(t => t.isOverdue)
}));