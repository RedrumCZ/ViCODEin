import { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, XCircle, Eye, Trash2, Edit, Filter } from 'lucide-react';
import { getAdminLogs, type AdminLog } from '../services/adminService';

interface AdminActivityLogProps {
  adminKey: string;
}

export function AdminActivityLog({ adminKey }: AdminActivityLogProps) {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminLogs(adminKey, 100, filter === 'all' ? undefined : filter);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [adminKey, filter]);

  const getActionIcon = (actionType: string) => {
    if (actionType.includes('success')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (actionType.includes('failure')) return <XCircle className="w-4 h-4 text-red-500" />;
    if (actionType.includes('view')) return <Eye className="w-4 h-4 text-blue-500" />;
    if (actionType.includes('delete')) return <Trash2 className="w-4 h-4 text-red-500" />;
    if (actionType.includes('update')) return <Edit className="w-4 h-4 text-yellow-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getActionColor = (actionType: string) => {
    if (actionType.includes('success')) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (actionType.includes('failure')) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (actionType.includes('view')) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (actionType.includes('delete')) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (actionType.includes('update')) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-gray-100">Activity Log</h3>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-600/50 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Actions</option>
            <option value="update_success">Updates</option>
            <option value="delete_success">Deletions</option>
            <option value="update_failure">Failed Updates</option>
            <option value="delete_failure">Failed Deletions</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading activity logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No activity logs found</div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-lg border ${getActionColor(log.action_type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getActionIcon(log.action_type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {log.action_type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(log.created_at)}
                    </span>
                  </div>

                  {log.project_name && (
                    <div className="text-sm mb-1">
                      Project: <span className="font-medium">{log.project_name}</span>
                    </div>
                  )}

                  {log.ip_address && (
                    <div className="text-xs text-gray-500">
                      IP: {log.ip_address}
                    </div>
                  )}

                  {log.details && Object.keys(log.details).length > 0 && (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                        View details
                      </summary>
                      <pre className="mt-2 p-2 bg-slate-900/50 rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
