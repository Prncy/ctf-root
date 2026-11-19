const tones = ['neutral', 'info', 'success', 'warning', 'danger', 'premium'];

export default function Badge({ tone = 'neutral', className = '', children, ...props }) {
  const safeTone = tones.includes(tone) ? tone : 'neutral';

  return (
    <span className={`ui-badge ui-badge-${safeTone} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
