// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// PayPal client ID
const CLIENT_ID = "AeR1Lb5gdCtQfg_6YW3fzK57h4xK-aOlLLaVK4AYScutG3zZ82xkMw0ZC06HHezF-WaSdEYl454IPhBg";

// إنشاء الرووت مرّة واحدة بس
const root = ReactDOM.createRoot(document.getElementById("root"));

// تشغيل التطبيق داخل PayPalScriptProvider
root.render(
  <React.StrictMode>
    <PayPalScriptProvider options={{ "client-id": CLIENT_ID }}>
      <App />
    </PayPalScriptProvider>
  </React.StrictMode>
);
