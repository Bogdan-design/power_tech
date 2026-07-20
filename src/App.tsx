import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/components/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import PowerTechPage from '@/pages/PowerTechPage';
import ScrollToTop from '@/components/ScrollToTop';

// Candidate form is a standalone page; lazy-load it so it never touches the
// main marketing-site bundle.
const CandidatePage = lazy(() => import('@/pages/CandidatePage'));

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
          <Routes>
            <Route path="/" element={<PowerTechPage />} />
            <Route path="/candidate" element={<CandidatePage />} />
          </Routes>
        </Suspense>
        <Toaster />
      </LanguageProvider>
    </Router>
  );
}

export default App;
