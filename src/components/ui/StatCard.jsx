import Card from './Card.jsx';

export default function StatCard({ label, value, detail, icon: Icon, className = '' }) {
  return (
    <Card className={`ui-stat-card ${className}`.trim()}>
      <div className="ui-stat-card-top">
        <span>{label}</span>
        {Icon && <span className="ui-stat-card-icon"><Icon size={17} aria-hidden="true" /></span>}
      </div>
      <strong className="ui-stat-card-value">{value}</strong>
      {detail && <span className="ui-stat-card-detail">{detail}</span>}
    </Card>
  );
}
