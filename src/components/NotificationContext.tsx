import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';

interface ToastOptions {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface NotificationContextType {
  showToast: (options: ToastOptions) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastOptions & { id: number }>>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...options, id }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, options.duration || 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast({ message, type: 'success' });
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast({ message, type: 'error' });
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast({ message, type: 'warning' });
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast({ message, type: 'info' });
  }, [showToast]);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirmDialog({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirmClose = useCallback((confirmed: boolean) => {
    if (confirmDialog) {
      confirmDialog.resolve(confirmed);
      setConfirmDialog(null);
    }
  }, [confirmDialog]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showToast,
        showConfirm,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}

      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>

      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.options.title}
          message={confirmDialog.options.message}
          confirmText={confirmDialog.options.confirmText}
          cancelText={confirmDialog.options.cancelText}
          variant={confirmDialog.options.variant}
          onConfirm={() => handleConfirmClose(true)}
          onCancel={() => handleConfirmClose(false)}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
