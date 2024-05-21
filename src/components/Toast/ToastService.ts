/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from "react";

const ToastContext = createContext({
  open: (component: React.ReactNode, timeout?: number) => {},
  close: (id: number) => {},
});

export const useToast = () => useContext(ToastContext);

export default ToastContext;
