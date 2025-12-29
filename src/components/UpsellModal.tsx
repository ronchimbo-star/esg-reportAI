import { useState, useEffect } from 'react';
import { X, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpsellModal({ isOpen, onClose }: UpsellModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContactUs = () => {
    console.log('Lead captured: User interested in professional service');
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={showSuccess ? undefined : onClose}
        ></div>

        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8 transform transition-all animate-slideUp">
          <button
            onClick={showSuccess ? handleCloseSuccess : onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {showSuccess ? (
            <div className="text-center py-8 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 animate-bounce-gentle">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You for Your Interest!
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                Our ESG consulting team has received your request and will contact you within 24 hours to discuss your specific needs.
              </p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8 max-w-lg mx-auto">
                <div className="flex items-start gap-3 text-left">
                  <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-1">
                      What happens next?
                    </p>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• We'll review your ESG reporting requirements</li>
                      <li>• Discuss compliance and audit needs</li>
                      <li>• Provide a customized service proposal</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseSuccess}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-lg"
              >
                Got it, thanks!
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Upgrade to Professional ESG Reporting
            </h2>
            <p className="text-gray-600">
              Transform your AI draft into an audit-ready, investor-grade report
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                  AI
                </span>
                Free AI Draft
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>AI-generated content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Basic framework alignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Markdown download</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Self-review required</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-500">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  PRO
                </span>
                Professional Service
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Expert review & refinement</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Data verification & validation</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Audit-ready formatting</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Professional PDF design</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Compliance check</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Stakeholder presentation support</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Why upgrade?</strong> Our ESG consultants will work with you to ensure accuracy, compliance, and stakeholder confidence. Perfect for investor presentations, regulatory filings, and stakeholder communications.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handleContactUs}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-lg"
            >
              Get Professional Help
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Our team will contact you within 24 hours to discuss your needs
          </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
