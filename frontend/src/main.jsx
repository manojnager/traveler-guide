import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "@tabler/core/dist/css/tabler.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import "./styles/global.css";

import App from "./App";
import ScrollToTop from "./ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";

import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <HelmetProvider>
        <SettingsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SettingsProvider>
      </HelmetProvider>
      <Toaster position="top-right" />
    </BrowserRouter>
  </React.StrictMode>
);