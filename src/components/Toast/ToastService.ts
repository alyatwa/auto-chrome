/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from "react";

const ToastContext = createContext({
  open: (_component: React.ReactNode, _timeout?: number) => {},
  close: (_id: number) => {},
});

export const useToast = () => useContext(ToastContext);

export default ToastContext;
