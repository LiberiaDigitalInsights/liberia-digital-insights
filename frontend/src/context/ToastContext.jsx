import React, { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({ toasts: [], showToast: () => {}, removeToast: () => {} });

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => setToasts((list) => list.filter((t) => t.id !== id));
  const showToast = ({ title, description, variant = 'info', duration = 3500 }) => {
    const id = ++idCounter;
    const toast = { id, title, description, variant };
    setToasts((list) => [...list, toast]);
    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const value = useMemo(() => ({ toasts, showToast, removeToast }), [toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}
