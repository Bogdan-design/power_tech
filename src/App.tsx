import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/components/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import PowerTechPage from '@/pages/PowerTechPage';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PowerTechPage />} />
        </Routes>
        <Toaster />
      </LanguageProvider>
    </Router>
  );
}

export default App;