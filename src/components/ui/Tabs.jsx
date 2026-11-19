export default function Tabs({ items, value, onChange, label = 'Sections', className = '' }) {
  return (
    <div className={`ui-tabs ${className}`.trim()} role="tablist" aria-label={label}>
      {items.map(item => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          className={value === item.value ? 'selected' : ''}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
