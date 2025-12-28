import { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import CompanyInfoStep from './components/CompanyInfoStep';
import DataInputStep from './components/DataInputStep';
import FrameworkSelectionStep from './components/FrameworkSelectionStep';
import ReportDisplay from './components/ReportDisplay';
import UpsellModal from './components/UpsellModal';
import WhatsNextModal from './components/WhatsNextModal';
import RateLimitModal from './components/RateLimitModal';
import Header from './components/Header';
import Footer from './components/Footer';
import { FormData, CompanyInfo, ESGData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateReport } from './services/geminiService';

const INITIAL_COMPANY_INFO: CompanyInfo = {
  name: '',
  website: '',
  industries: [],
  jurisdictions: [],
  contactName: '',
  contactEmail: '',
  contactPhone: ''
};

const INITIAL_ESG_DATA: ESGData = {
  environmental: '',
  social: '',
  governance: ''
};

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useLocalStorage<FormData>('esg-form-data', {
    companyInfo: INITIAL_COMPANY_INFO,
    esgData: INITIAL_ESG_DATA,
    selectedFrameworks: []
  });
  const [reportMarkdown, setReportMarkdown] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showWhatsNextModal, setShowWhatsNextModal] = useState(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [rateLimitData, setRateLimitData] = useState<{
    message: string;
    detailedMessage?: string;
    minutesRemaining?: number;
  }>({ message: '' });

  const handleCompanyInfoChange = (data: CompanyInfo) => {
    setFormData({ ...formData, companyInfo: data });
  };

  const handleESGDataChange = (data: ESGData) => {
    setFormData({ ...formData, esgData: data });
  };

  const handleFrameworksChange = (frameworks: string[]) => {
    setFormData({ ...formData, selectedFrameworks: frameworks });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.companyInfo.name &&
          formData.companyInfo.industries.length > 0 &&
          formData.companyInfo.jurisdictions.length > 0 &&
          formData.companyInfo.contactName &&
          formData.companyInfo.contactEmail
        );
      case 2:
        return !!(
          formData.esgData.environmental &&
          formData.esgData.social &&
          formData.esgData.governance
        );
      case 3:
        return formData.selectedFrameworks.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleGenerateReport = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Please complete all required fields before generating the report.');
      return;
    }

    // Check rate limit before generating
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const rateLimitResponse = await fetch(`${supabaseUrl}/functions/v1/check-rate-limit`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const rateLimitResult = await rateLimitResponse.json();

      if (!rateLimitResult.allowed) {
        setRateLimitData({
          message: rateLimitResult.message || 'Rate limit exceeded. Please try again later.',
          detailedMessage: rateLimitResult.detailedMessage,
          minutesRemaining: rateLimitResult.minutesRemaining
        });
        setShowRateLimitModal(true);
        return;
      }
    } catch (error) {
      console.error('Error checking rate limit:', error);
    }

    setIsGenerating(true);
    setReportMarkdown('');
    setShowWhatsNextModal(true);

    let generatedReport = '';

    try {
      await generateReport(formData, (chunk) => {
        generatedReport += chunk;
        setReportMarkdown((prev) => prev + chunk);
      });

      // After successful report generation, record rate limit and send email
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        // Record rate limit
        await fetch(`${supabaseUrl}/functions/v1/check-rate-limit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Send email notification with report details
        await fetch(`${supabaseUrl}/functions/v1/send-report-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey,
          },
          body: JSON.stringify({
            companyName: formData.companyInfo.name,
            contactName: formData.companyInfo.contactName,
            industries: formData.companyInfo.industries,
            jurisdictions: formData.companyInfo.jurisdictions,
            frameworks: formData.selectedFrameworks,
            reportContent: generatedReport,
            userEmail: formData.companyInfo.contactEmail,
            userIp: 'client-request',
          }),
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setShowWhatsNextModal(false);
      alert('Failed to generate report.\n\nREQUIRED: Google Gemini API Key\n\n1. Get your free API key at: https://makersuite.google.com/app/apikey\n2. Add it to the .env file: VITE_GEMINI_API_KEY=your_key_here\n3. Restart the dev server\n\nSee API_KEY_SETUP.md for detailed instructions.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailReport = async () => {
    if (!reportMarkdown) {
      alert('No report to send. Please generate a report first.');
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/functions/v1/send-report-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          companyName: formData.companyInfo.name,
          contactName: formData.companyInfo.contactName,
          industries: formData.companyInfo.industries,
          jurisdictions: formData.companyInfo.jurisdictions,
          frameworks: formData.selectedFrameworks,
          reportContent: reportMarkdown,
          userEmail: formData.companyInfo.contactEmail,
          userIp: 'client-request',
        }),
      });

      alert(`Report has been sent to ${formData.companyInfo.contactEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const handleEnhanceReport = () => {
    setShowUpsellModal(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <header className="text-center mb-8 sm:mb-12">
          <div className="mb-4">
            <img
              src="/esgreport-icon.png"
              alt="ESG Report Logo"
              className="h-16 sm:h-20 md:h-24 mx-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 px-2">
            AI ESG Report Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Generate professional ESG reports aligned with global standards
          </p>
        </header>

        {!reportMarkdown && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-sm sm:text-base
                      ${currentStep >= step
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`
                        w-8 sm:w-12 md:w-16 h-1 mx-1 sm:mx-2 transition-all
                        ${currentStep > step ? 'bg-green-600' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs sm:text-sm font-medium text-gray-600 px-2">
              <span className={currentStep === 1 ? 'text-green-600' : ''}>Company Info</span>
              <span className={currentStep === 2 ? 'text-green-600' : ''}>Data Input</span>
              <span className={currentStep === 3 ? 'text-green-600' : ''}>Frameworks</span>
            </div>
          </div>
        )}

        {!reportMarkdown && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          {currentStep === 1 && (
            <CompanyInfoStep
              data={formData.companyInfo}
              onChange={handleCompanyInfoChange}
            />
          )}

          {currentStep === 2 && (
            <DataInputStep
              data={formData.esgData}
              onChange={handleESGDataChange}
              industries={formData.companyInfo.industries}
              jurisdictions={formData.companyInfo.jurisdictions}
            />
          )}

          {currentStep === 3 && (
            <FrameworkSelectionStep
              selectedFrameworks={formData.selectedFrameworks}
              onChange={handleFrameworksChange}
              industries={formData.companyInfo.industries}
              jurisdictions={formData.companyInfo.jurisdictions}
            />
          )}

          <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}

            <div className="sm:ml-auto flex gap-2 sm:gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg text-sm sm:text-base"
                >
                  <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </button>
              )}
            </div>
          </div>
        </div>
        )}

        <ReportDisplay
          reportMarkdown={reportMarkdown}
          isGenerating={isGenerating}
          onEmailReport={handleEmailReport}
          onEnhanceReport={handleEnhanceReport}
          companyName={formData.companyInfo.name}
          industries={formData.companyInfo.industries}
          jurisdictions={formData.companyInfo.jurisdictions}
          frameworks={formData.selectedFrameworks}
        />

        </div>
      </div>

      <Footer />

      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
      />

      <WhatsNextModal
        isOpen={showWhatsNextModal}
        onClose={() => setShowWhatsNextModal(false)}
        onEmailReport={handleEmailReport}
        onEnhanceReport={handleEnhanceReport}
      />

      <RateLimitModal
        isOpen={showRateLimitModal}
        onClose={() => setShowRateLimitModal(false)}
        message={rateLimitData.message}
        detailedMessage={rateLimitData.detailedMessage}
        minutesRemaining={rateLimitData.minutesRemaining}
      />
    </>
  );
}

export default App;
