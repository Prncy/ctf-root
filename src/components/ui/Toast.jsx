import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, onClose, variant = 'success', duration = 4500 }) {
  useEffect(() => {
    if (!message || duration <= 0) return undefined;
    const timeout = window.setTimeout(() => onClose?.(), duration);
    return () => window.clearTimeout(timeout);
  }, [message, duration]);

  if (!message) return null;
  const Icon = variant === 'error' ? AlertCircle : variant === 'info' ? Info : CheckCircle2;
  return (
    <div className={`app-toast app-toast-${variant}`} role={variant === 'error' ? 'alert' : 'status'} aria-live={variant === 'error' ? 'assertive' : 'polite'}>
      <Icon size={18} />
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification"><X size={16}/></button>
    </div>
  );
}
