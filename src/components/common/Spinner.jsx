const Spinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner;