import type { Project } from '../types/project';

const ADMIN_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-operations`;

export interface AdminLog {
  id: string;
  action_type: string;
  project_id?: string;
  project_name?: string;
  ip_address?: string;
  user_agent?: string;
  details?: any;
  created_at: string;
}

export async function updateProject(
  id: string,
  updates: Partial<Project>,
  adminKey: string
): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      id,
      ...updates,
      admin_key: adminKey,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update project');
  }
}

export async function deleteProject(id: string, adminKey: string): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      id,
      admin_key: adminKey,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete project');
  }
}

export async function getAdminLogs(
  adminKey: string,
  limit: number = 100,
  actionType?: string
): Promise<AdminLog[]> {
  const params = new URLSearchParams({
    admin_key: adminKey,
    limit: limit.toString(),
  });

  if (actionType) {
    params.append('action_type', actionType);
  }

  const response = await fetch(`${ADMIN_API_URL}/logs?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch admin logs');
  }

  return data.data;
}
