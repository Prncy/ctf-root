import Card from './Card.jsx';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <Card className={`ui-empty-state ${className}`.trim()}>
      {Icon && <span className="ui-empty-state-icon"><Icon size={24} aria-hidden="true" /></span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action && <div className="ui-empty-state-action">{action}</div>}
    </Card>
  );
}
