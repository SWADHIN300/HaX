import { useState, useEffect } from 'react';
import type { Alert, AlertFormData } from '../types';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import Modal from '../components/ui/Modal';
import BottomSheet from '../components/ui/BottomSheet';
import AlertForm from './AlertForm';

interface AlertsScreenProps {
  alerts: Alert[];
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  addAlert: (data: AlertFormData) => void;
  updateAlert: (id: string, data: AlertFormData) => void;
}

export default function AlertsScreen({
  alerts,
  toggleAlert,
  deleteAlert,
  addAlert,
  updateAlert,
}: AlertsScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Simple responsive check
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleSave = (data: AlertFormData) => {
    if (editingAlert) {
      updateAlert(editingAlert.id, data);
    } else {
      addAlert(data);
    }
    setShowForm(false);
    setEditingAlert(null);
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingAlert(null);
  };

  const formContent = (
    <AlertForm
      initialData={
        editingAlert
          ? {
              name: editingAlert.name,
              domains: editingAlert.domains,
              locationPreference: editingAlert.locationPreference,
              specificCountry: editingAlert.specificCountry,
              minPrize: editingAlert.minPrize,
              dateRange: editingAlert.dateRange,
            }
          : undefined
      }
      onSave={handleSave}
      onCancel={handleClose}
    />
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 desktop:px-6 pt-5 desktop:pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl desktop:text-2xl font-bold tracking-tighter text-text-primary">
            Alerts
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {alerts.filter((a) => a.enabled).length} active alert
            {alerts.filter((a) => a.enabled).length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-gradient text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Alert
        </button>
      </div>

      {/* Alert List */}
      <div className="px-4 desktop:px-6 space-y-3 pb-6">
        {alerts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-card border border-base-border flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555D68" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="text-text-secondary font-medium">No alerts yet</p>
            <p className="text-sm text-text-muted mt-1">
              Create an alert to get notified about new hackathons
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="card p-4 flex items-start gap-4"
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary truncate">
                    {alert.name}
                  </h3>
                  {alert.matchCount > 0 && (
                    <span className="flex-shrink-0 text-[10px] font-bold text-accent-sage bg-accent-sage/10 px-1.5 py-0.5 rounded">
                      {alert.matchCount} match{alert.matchCount !== 1 ? 'es' : ''}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {alert.domains.map((d) => (
                    <span key={d} className="domain-pill text-[10px]">
                      {d}
                    </span>
                  ))}
                  <span className="domain-pill text-[10px]">
                    {alert.locationPreference === 'anywhere'
                      ? '🌍 Anywhere'
                      : alert.locationPreference === 'online'
                      ? '💻 Online Only'
                      : `📍 ${alert.specificCountry}`}
                  </span>
                  {alert.minPrize > 0 && (
                    <span className="domain-pill text-[10px]">
                      ≥ ${alert.minPrize.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(alert)}
                    className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-xs text-text-muted hover:text-accent-coral transition-colors flex items-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              {/* Toggle */}
              <ToggleSwitch
                enabled={alert.enabled}
                onToggle={() => toggleAlert(alert.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* Form: Bottom sheet on mobile, Modal on desktop */}
      {isMobile ? (
        <BottomSheet
          isOpen={showForm}
          onClose={handleClose}
          title={editingAlert ? 'Edit Alert' : 'New Alert'}
        >
          {formContent}
        </BottomSheet>
      ) : (
        <Modal
          isOpen={showForm}
          onClose={handleClose}
          title={editingAlert ? 'Edit Alert' : 'New Alert'}
          fullScreenMobile={false}
        >
          <div className="p-6">{formContent}</div>
        </Modal>
      )}
    </div>
  );
}
