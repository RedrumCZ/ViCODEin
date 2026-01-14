import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types/project';
import { supabase } from '../lib/supabase';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!supabase) {
      console.error('Supabase not configured');
      setError('Database not configured');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('commits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refreshProjects: fetchProjects };
}
