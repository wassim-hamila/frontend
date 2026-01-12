const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  icon,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition duration-200 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white disabled:bg-gray-400 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100',
    success: 'bg-success hover:bg-green-600 text-white shadow-sm',
    danger: 'bg-danger hover:bg-red-600 text-white shadow-sm',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 bg-white'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} disabled:cursor-not-allowed disabled:opacity-50`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
    