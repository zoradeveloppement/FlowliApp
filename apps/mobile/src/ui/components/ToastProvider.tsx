import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar } from './Snackbar';
import { SnackbarType } from '../types';

interface ToastContextType {
  showToast: (type: SnackbarType, message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{
    visible: boolean;
    type: SnackbarType;
    message: string;
  }>({
    visible: false,
    type: 'info',
    message: '',
  });

  const showToast = (type: SnackbarType, message: string) => {
    setToast({
      visible: true,
      type,
      message,
    });
  };

  const showSuccess = (message: string) => {
    showToast('success', message);
  };

  const showError = (message: string) => {
    showToast('error', message);
  };

  const showInfo = (message: string) => {
    showToast('info', message);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}
      <Snackbar
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};
