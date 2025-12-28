import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import TemplatesPage from './pages/TemplatesPage';
import TemplateDetailPage from './pages/TemplateDetailPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TemplatesPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/template/:slug" element={<TemplateDetailPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
