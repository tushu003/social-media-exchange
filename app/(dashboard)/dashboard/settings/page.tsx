"use client";

import { useEffect, useState } from "react";
import LoginSecurity from "./login-security/page";

type PlatformSettings = {
  platformName: string;
  defaultTimeZone: string;
  defaultLanguage: string;
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: "",
    defaultTimeZone: "",
    defaultLanguage: "",
  });

  // Simulate fetching data from backend
  useEffect(() => {
    // TODO: Replace with real API call
    const fetchSettings = async () => {
      const dataFromServer = {
        platformName: "Ollivu",
        defaultTimeZone: "USD",
        defaultLanguage: "English",
      };
      setSettings(dataFromServer);
    };

    fetchSettings();
  }, []);

  const handleChange = (field: keyof PlatformSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      
      <LoginSecurity />
    </>
  );
};

export default SettingsPage;
