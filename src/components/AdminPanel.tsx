import { useState } from 'react';
import { Lock, X, Pencil, Trash2, Save } from 'lucide-react';
import type { Project } from '../types/project';
import { AdminActivityLog } from './AdminActivityLog';

interface AdminPanelProps {
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function AdminPanel({ projects, onUpdate, onDelete }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});

  const handleLogin = () => {
    const correctKey = import.meta.env.VITE_ADMIN_KEY;
    if (!correctKey) {
      setError('Admin key not configured');
      return;
    }
    if (adminKey === correctKey) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin key');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm({
      project_name: project.project_name,
      demo_url: project.demo_url,
      repo_url: project.repo_url,
      tech_stack: project.tech_stack,
      mvp_time: project.mvp_time,
      vibe_score: project.vibe_score,
      wtf_moment: project.wtf_moment,
      author_info: project.author_info,
      image_url: project.image_url,
      region: project.region,
      li_post_url: project.li_post_url,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await onUpdate(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await onDelete(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete');
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        aria-label="Open admin panel"
      >
        <Lock size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsAuthenticated(false);
              setAdminKey('');
              setEditingId(null);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="p-6">
            <div className="max-w-md mx-auto">
              <label htmlFor="admin-key" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Key
              </label>
              <input
                id="admin-key"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter admin key"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <button
                onClick={handleLogin}
                className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <div className="mb-6 p-6 bg-slate-900 rounded-xl border border-emerald-500/20">
              <AdminActivityLog adminKey={adminKey} />
            </div>

            <div className="border-t border-gray-200 pt-6 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Manage Projects</h3>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingId === project.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                        <input
                          type="text"
                          value={editForm.project_name || ''}
                          onChange={(e) => setEditForm({ ...editForm, project_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="Project Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Info *</label>
                        <input
                          type="text"
                          value={editForm.author_info || ''}
                          onChange={(e) => setEditForm({ ...editForm, author_info: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="Author Info"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                        <input
                          type="url"
                          value={editForm.demo_url || ''}
                          onChange={(e) => setEditForm({ ...editForm, demo_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repo URL</label>
                        <input
                          type="url"
                          value={editForm.repo_url || ''}
                          onChange={(e) => setEditForm({ ...editForm, repo_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                        <input
                          type="text"
                          value={editForm.tech_stack || ''}
                          onChange={(e) => setEditForm({ ...editForm, tech_stack: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="React, TypeScript, Tailwind..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">MVP Time</label>
                        <input
                          type="text"
                          value={editForm.mvp_time || ''}
                          onChange={(e) => setEditForm({ ...editForm, mvp_time: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="2 hours"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vibe Score (1-10)</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={editForm.vibe_score || ''}
                          onChange={(e) => setEditForm({ ...editForm, vibe_score: e.target.value ? parseInt(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="8"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WTF Moment</label>
                        <textarea
                          value={editForm.wtf_moment || ''}
                          onChange={(e) => setEditForm({ ...editForm, wtf_moment: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="Describe the most surprising moment..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          type="url"
                          value={editForm.image_url || ''}
                          onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Post URL</label>
                        <input
                          type="url"
                          value={editForm.li_post_url || ''}
                          onChange={(e) => setEditForm({ ...editForm, li_post_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                          placeholder="https://linkedin.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                        <select
                          value={editForm.region || ''}
                          onChange={(e) => setEditForm({ ...editForm, region: e.target.value as 'CZ_SK' | 'ROW' || undefined })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="">No Region</option>
                          <option value="CZ_SK">CZ/SK</option>
                          <option value="ROW">Rest of World</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save size={16} />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditForm({});
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{project.project_name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{project.author_info}</p>

                          {project.demo_url && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-500">Demo:</span>{' '}
                              <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {project.demo_url}
                              </a>
                            </div>
                          )}

                          {project.repo_url && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-500">Repo:</span>{' '}
                              <a
                                href={project.repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {project.repo_url}
                              </a>
                            </div>
                          )}

                          {project.tech_stack && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-500">Tech:</span> {project.tech_stack}
                            </div>
                          )}

                          {project.mvp_time && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-500">MVP Time:</span> {project.mvp_time}
                            </div>
                          )}

                          {project.vibe_score && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-500">Vibe Score:</span> {project.vibe_score}/10
                            </div>
                          )}

                          {project.wtf_moment && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-500">WTF Moment:</span> {project.wtf_moment}
                            </div>
                          )}

                          {project.image_url && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-500">Image:</span>{' '}
                              <a
                                href={project.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Image
                              </a>
                            </div>
                          )}

                          {project.li_post_url && (
                            <div className="text-sm mb-1">
                              <span className="text-gray-500">LinkedIn:</span>{' '}
                              <a
                                href={project.li_post_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Post
                              </a>
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-2">
                            {project.region && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                {project.region === 'CZ_SK' ? 'CZ/SK' : 'ROW'}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {new Date(project.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="Edit project"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete project"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
