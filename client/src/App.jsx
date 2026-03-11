import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/UI/ErrorBoundary';
import Toast from './components/UI/Toast';
import SiteLayout from './components/Layout/SiteLayout';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import SafetyTipsPage from './pages/SafetyTipsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import CommunityPage from './pages/CommunityPage';
import { Show } from '@clerk/react';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';

function BodyClassHandler() {
  const location = useLocation();
  const isMap = location.pathname === '/map';

  useEffect(() => {
    document.body.classList.toggle('map-active', isMap);
    document.body.classList.toggle('site-scroll', !isMap);
  }, [isMap]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <BodyClassHandler />
        <Toast />
        <Routes>
          <Route path="/" element={
            <SiteLayout>
              <LandingPage />
            </SiteLayout>
          } />
          <Route path="/map" element={
            <Show when="signed-in">
              <MapPage />
            </Show>
          } />
          <Route path="/about" element={<SiteLayout><AboutPage /></SiteLayout>} />
          <Route path="/safety-tips" element={<SiteLayout><SafetyTipsPage /></SiteLayout>} />
          <Route path="/community" element={<SiteLayout><CommunityPage /></SiteLayout>} />
          <Route path="/how-it-works" element={<SiteLayout><HowItWorksPage /></SiteLayout>} />
          <Route path="/contact" element={<SiteLayout><ContactPage /></SiteLayout>} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/404" element={<SiteLayout><NotFoundPage /></SiteLayout>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
