import { useState, useCallback } from 'react';
import type { Alert, AlertFormData } from '../types';
import { mockAlerts } from '../data/mockAlerts';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }, []);

  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addAlert = useCallback((data: AlertFormData) => {
    const newAlert: Alert = {
      id: `a${Date.now()}`,
      ...data,
      enabled: true,
      createdAt: new Date().toISOString(),
      matchCount: 0,
    };
    setAlerts((prev) => [...prev, newAlert]);
  }, []);

  const updateAlert = useCallback((id: string, data: AlertFormData) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  }, []);

  const activeCount = alerts.filter((a) => a.enabled).length;

  return {
    alerts,
    toggleAlert,
    deleteAlert,
    addAlert,
    updateAlert,
    activeCount,
  };
}
