import { useState } from "react";
import ToastContext from "./ToastService";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<
    { id: number; component: React.ReactNode }[]
  >([]);

  const open = (component: React.ReactNode, timeout = 5000) => {
    const id = Date.now();

    setToasts(() => [{ id, component }]);

    setTimeout(() => close(id), timeout);
  };
  const close = (id: number) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ open, close }}>
      {children}
      {toasts.length > 0 && (
        <div className="animate-slide space-y-2 w-full flex justify-center absolute bottom-4 z-50 ">
          {toasts.map(({ id, component }) => (
            <div
              key={id}
              className="text-xs relative w-auto px-6 py-2 rounded-full bg-[#333a4c]"
            >
              {component}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
