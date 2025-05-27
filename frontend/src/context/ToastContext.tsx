import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Toast, { ToastProps, ToastVariant } from '../components/ui/Toast';

export type ToastOptions = Omit<ToastProps, 'id' | 'isOpen' | 'onClose' | 'message'> & {
  id?: string;
  duration?: number;
};

type ToastType = ToastProps & {
  id: string;
  isOpen: boolean;
};

type ToastContextType = {
  toasts: ToastType[];
  addToast: (message: React.ReactNode, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  success: (message: React.ReactNode, options?: Omit<ToastOptions, 'variant'>) => string;
  error: (message: React.ReactNode, options?: Omit<ToastOptions, 'variant'>) => string;
  warning: (message: React.ReactNode, options?: Omit<ToastOptions, 'variant'>) => string;
  info: (message: React.ReactNode, options?: Omit<ToastOptions, 'variant'>) => string;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const toastRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    delete toastRefs.current[id];
  }, []);

  const addToast = useCallback((message: React.ReactNode, options: ToastOptions = {}) => {
    const id = options.id || uuidv4();
    const duration = options.duration ?? 5000;

    setToasts((currentToasts) => {
      // Check if a toast with the same ID already exists
      const existingToastIndex = currentToasts.findIndex((t) => t.id === id);
      
      if (existingToastIndex >= 0) {
        // Update existing toast
        const updatedToasts = [...currentToasts];
        updatedToasts[existingToastIndex] = {
          ...updatedToasts[existingToastIndex],
          ...options,
          message,
          duration,
          isOpen: true,
        };
        return updatedToasts;
      }
      
      // Add new toast
      return [
        ...currentToasts,
        {
          id,
          message,
          isOpen: true,
          duration,
          ...options,
        },
      ];
    });

    return id;
  }, []);

  // Helper methods for common toast types
  const success = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'variant'> = {}) => {
      return addToast(message, { ...options, variant: 'success' });
    },
    [addToast]
  );

  const error = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'variant'> = {}) => {
      return addToast(message, { ...options, variant: 'error' });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'variant'> = {}) => {
      return addToast(message, { ...options, variant: 'warning' });
    },
    [addToast]
  );

  const info = useCallback(
    (message: React.ReactNode, options: Omit<ToastOptions, 'variant'> = {}) => {
      return addToast(message, { ...options, variant: 'info' });
    },
    [addToast]
  );

  // Auto-remove toasts when they're closed
  const handleClose = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast]
  );

  // Clean up all toasts when the component unmounts
  React.useEffect(() => {
    return () => {
      Object.keys(toastRefs.current).forEach(removeToast);
    };
  }, [removeToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <div className="fixed z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            ref={(el) => {
              toastRefs.current[toast.id] = el;
            }}
          >
            <Toast
              {...toast}
              isOpen={toast.isOpen}
              onClose={() => handleClose(toast.id)}
              duration={toast.duration}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
