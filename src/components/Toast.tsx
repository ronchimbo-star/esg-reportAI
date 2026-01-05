import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgClass: 'bg-green-50 border-green-200',
      iconClass: 'text-green-600',
      textClass: 'text-green-900',
      progressClass: 'bg-green-600',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgClass: 'bg-red-50 border-red-200',
      iconClass: 'text-red-600',
      textClass: 'text-red-900',
      progressClass: 'bg-red-600',
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgClass: 'bg-amber-50 border-amber-200',
      iconClass: 'text-amber-600',
      textClass: 'text-amber-900',
      progressClass: 'bg-amber-600',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-900',
      progressClass: 'bg-blue-600',
    },
  };

  const { icon, bgClass, iconClass, textClass } = config[type];

  return (
    <div className="animate-slide-in-right">
      <div
        className={`${bgClass} border rounded-xl shadow-lg p-4 min-w-[320px] max-w-md flex items-start gap-3 backdrop-blur-sm`}
        role="alert"
      >
        <div className={`flex-shrink-0 ${iconClass}`}>{icon}</div>
        <div className={`flex-1 ${textClass} text-sm font-medium leading-relaxed`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${textClass} hover:opacity-70 transition-opacity p-1 rounded-lg hover:bg-black/5`}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
