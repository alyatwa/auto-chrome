import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ToastProvider from "./components/Toast/ToastProvider.tsx";
import { GlobalContextProvider } from "./store/chromeStore.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <GlobalContextProvider>
        <App />
      </GlobalContextProvider>
    </ToastProvider>
  </React.StrictMode>
);
