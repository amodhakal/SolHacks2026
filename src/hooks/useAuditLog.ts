import { useCallback } from 'react';

export interface UseAuditLogOptions {
  actor?: string;
}

export function useAuditLog(options: UseAuditLogOptions = {}) {
  const actor = options.actor || 'system-user';

  const logAction = useCallback(async (action: string, resource: string, details?: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor, action, resource, details }),
      });
      if (!response.ok) {
        console.error('Failed to record audit log');
      }
      return await response.json();
    } catch (err) {
      console.error('Audit log error:', err);
    }
  }, [actor]);

  return { logAction };
}
