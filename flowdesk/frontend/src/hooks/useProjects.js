import { useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';

export function useProjects() {
  const store = useProjectStore();

  useEffect(() => {
    store.fetchProjects();
  }, []);

  return store;
}