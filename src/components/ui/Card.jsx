export default function Card({
  as: Element = 'section',
  padding = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Element className={`ui-card ui-card-padding-${padding} ${className}`.trim()} {...props}>
      {children}
    </Element>
  );
}
