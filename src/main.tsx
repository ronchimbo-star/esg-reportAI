import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import RootWrapper from './components/RootWrapper';

const App = lazy(() => import('./App.tsx'));
const AdminApp = lazy(() => import('./AdminApp.tsx'));
const CMSPage = lazy(() => import('./pages/CMSPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const ESGTemplatesPage = lazy(() => import('./pages/ESGTemplatesPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProfessionalServicesPage = lazy(() => import('./pages/ProfessionalServicesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

if (!rootElement.hasChildNodes()) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <RootWrapper>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="/professional-services" element={<ProfessionalServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/esg-templates" element={<ESGTemplatesPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<CMSPage />} />
              <Route path="/template/:slug" element={<CMSPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<CMSPage />} />
              <Route path="/privacy-policy" element={<CMSPage />} />
              <Route path="/terms-of-service" element={<CMSPage />} />
              <Route path="/cookie-policy" element={<CMSPage />} />
            </Routes>
          </Suspense>
        </RootWrapper>
      </BrowserRouter>
    </StrictMode>
  );
}
