import type { CardProps } from '../../types/index.js';

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
}) => {
  const baseClasses = 'card';
  const hoverClasses = hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  
  const classes = `
    ${baseClasses}
    ${hoverClasses}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
