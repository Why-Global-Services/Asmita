"use client";

import React, { useState, useEffect } from "react";
import { LanguageProvider } from "../i18n/LanguageContext";
import { EnquiryProvider } from "../hooks/useEnquiry";
import Preloader from "../components/layout/Preloader";

export default function Providers({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      <EnquiryProvider>
        <Preloader visible={loading} />
        {children}
      </EnquiryProvider>
    </LanguageProvider>
  );
}
