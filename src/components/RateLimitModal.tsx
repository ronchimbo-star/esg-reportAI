import { X, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  detailedMessage?: string;
  minutesRemaining?: number;
}

export default function RateLimitModal({
  isOpen,
  onClose,
  message,
  detailedMessage,
  minutesRemaining
}: RateLimitModalProps) {
  const [contactEmail, setContactEmail] = useState('experts@esgreport.ai');

  useEffect(() => {
    loadContactEmail();
  }, []);

  const loadContactEmail = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'professional_services_email')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setContactEmail(data.value);
      }
    } catch (error) {
      console.error('Error loading contact email:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Rate Limit Reached</h2>
              <p className="text-amber-100 text-sm mt-1">Please wait before generating another report</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-900 font-medium">{message}</p>
                {detailedMessage && (
                  <p className="text-amber-800 text-sm mt-2 leading-relaxed">{detailedMessage}</p>
                )}
              </div>
            </div>
          </div>

          {minutesRemaining !== undefined && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mb-4">
                <Clock className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-gray-600 text-sm mb-2">Time remaining</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.floor(minutesRemaining / 60) > 0 && (
                  <span>{Math.floor(minutesRemaining / 60)}h </span>
                )}
                <span>{minutesRemaining % 60}m</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Why do we have rate limits?</h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                We limit report generation to ensure fair usage and keep our AI-powered service free for everyone.
                This prevents system abuse and maintains optimal performance.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-2">✨ Need unlimited reports?</h4>
              <p className="text-xs text-green-800 leading-relaxed mb-3">
                Contact our team for professional ESG consulting services with unlimited report generation,
                expert analysis, and audit-ready documentation.
              </p>
              <a
                href={`mailto:${contactEmail}?subject=Unlimited Report Access`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact Experts
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium shadow-md"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
