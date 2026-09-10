import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { EnquiryProvider } from './hooks/useEnquiry';
import { LanguageProvider } from './i18n/LanguageContext';
import Preloader from './components/layout/Preloader';

export default function App() {
  // True on first mount; becomes false after approximately 2 seconds.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      <EnquiryProvider>
        <Preloader visible={loading} />
        <AppRoutes />
      </EnquiryProvider>
    </LanguageProvider>
  );
}
