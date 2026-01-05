import { Mail, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface WhatsNextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailReport: () => void;
  onEnhanceReport: () => void;
}

export default function WhatsNextModal({
  isOpen,
  onClose,
  onEmailReport,
  onEnhanceReport
}: WhatsNextModalProps) {
  const [contactInfo, setContactInfo] = useState({
    email: 'experts@esgreport.ai',
    phone: '+44 20 1234 5678'
  });

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['professional_services_email', 'contact_phone']);

      if (error) throw error;

      const settings: Record<string, string> = {};
      data?.forEach(item => {
        settings[item.key] = item.value;
      });

      setContactInfo({
        email: settings.professional_services_email || 'experts@esgreport.ai',
        phone: settings.contact_phone || '+44 20 1234 5678'
      });
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">What's Next?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Get Your Full Report</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Receive a complete copy of your AI-generated ESG report directly in your inbox.
              </p>
              <button
                onClick={() => {
                  onEmailReport();
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                Email Me My Report
              </button>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Professional Review</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Upgrade to a comprehensive, audit-ready report with expert analysis and competitor benchmarking.
              </p>
              <button
                onClick={() => {
                  onEnhanceReport();
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Enhance This Report
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-base font-bold text-blue-900 mb-2">
              Want an In-Depth Report Customised to Your Business?
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Our expert consultants can provide a comprehensive, tailored ESG report that goes beyond AI-generated content. We'll work with your team to:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Conduct detailed materiality assessments specific to your industry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Perform competitor benchmarking and gap analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Ensure full regulatory compliance with all applicable frameworks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Provide audit-ready documentation and third-party assurance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Develop actionable ESG strategies and improvement roadmaps</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Get in touch with our experts:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Mail className="w-4 h-4" />
                  {contactInfo.email}
                </a>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Close and View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
