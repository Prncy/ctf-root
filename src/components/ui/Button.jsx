const variants = {
  primary: 'primary-button',
  secondary: 'secondary-button',
  ghost: 'text-button',
  danger: 'ui-button-danger',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`ui-button ${variants[variant] || variants.primary} ui-button-${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
