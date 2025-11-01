import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({ toasts: [], showToast: () => {}, removeToast: () => {} });

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, variant = 'info', duration = 3500 }) => {
      const id = ++idCounter;
      const toast = { id, title, description, variant };
      setToasts((list) => [...list, toast]);
      if (duration) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({ toasts, showToast, removeToast }),
    [toasts, showToast, removeToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return useContext(ToastContext);
}
