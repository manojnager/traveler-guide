import { createContext, useContext, useEffect, useState } from "react";
import { getPublicSettings } from "../services/settingsService";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    currency: "USD",
    site_name: "TravelerGuide",
    default_cancellation_policy: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: ""
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPublicSettings();
        setSettings((prev) => ({ ...prev, ...data }));
      } catch {
        // Fall back to defaults silently — not worth blocking the site over this
      } finally {
        setLoaded(true);
      }
    };

    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider.");
  return context;
}