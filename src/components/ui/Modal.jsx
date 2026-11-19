import { X } from 'lucide-react';
import Button from './Button.jsx';

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className = '',
}) {
  if (!open) return null;

  return (
    <div className="ui-modal-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose?.();
    }}>
      <section
        className={`ui-modal ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="ui-modal-header">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog">
            <X size={17} />
          </Button>
        </header>
        <div className="ui-modal-body">{children}</div>
        {footer && <footer className="ui-modal-footer">{footer}</footer>}
      </section>
    </div>
  );
}
