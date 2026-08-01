interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
  description?: string;
}

export default function ToggleSwitch({
  enabled,
  onToggle,
  label,
  description,
}: ToggleSwitchProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 cursor-pointer"
      onClick={onToggle}
    >
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <p className="text-sm font-medium text-text-primary">{label}</p>
          )}
          {description && (
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          )}
        </div>
      )}
      <div className={`toggle-track ${enabled ? 'active' : ''}`}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}
