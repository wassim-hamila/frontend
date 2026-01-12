import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div className={`${bgColor} ${borderColor} ${textColor} border rounded-lg p-4 mb-4 flex items-start animate-fadeIn`}>
      <Icon className={`${iconColor} mr-3 flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className={`ml-3 flex-shrink-0 ${iconColor} hover:opacity-75`}>
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Alert;