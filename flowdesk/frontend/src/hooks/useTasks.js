import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

export function useTasks(params = {}) {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore();

  useEffect(() => {
    fetchTasks(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.project, params.assignedTo, params.status]);

  return { tasks, loading, error, createTask, updateTask, deleteTask, refetch: () => fetchTasks(params) };
}