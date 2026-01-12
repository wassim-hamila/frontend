const Card = ({ 
  children, 
  title, 
  className = '',
  headerAction,
  noPadding = false 
}) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '-m-6' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;