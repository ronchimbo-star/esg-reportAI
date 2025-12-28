import { X, CheckCircle2, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProfessionalServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfessionalServicesModal({ isOpen, onClose }: ProfessionalServicesModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative p-8 md:p-12">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/esgreport logo-dark-back.png"
                alt="esgReport"
                className="h-16 md:h-20 w-auto"
              />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
              Need Professional ESG Reporting?
            </h2>

            <p className="text-blue-100 text-center text-base md:text-lg mb-8 leading-relaxed">
              While our AI tool provides a great starting point, our expert consultants can deliver comprehensive, audit-ready ESG reports tailored specifically to your business needs.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
                <h3 className="text-white font-semibold mb-1">Expert Consultation</h3>
                <p className="text-blue-100 text-sm">Work directly with certified ESG professionals</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
                <h3 className="text-white font-semibold mb-1">Audit-Ready Reports</h3>
                <p className="text-blue-100 text-sm">Comprehensive documentation meeting all compliance standards</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
                <h3 className="text-white font-semibold mb-1">Custom Frameworks</h3>
                <p className="text-blue-100 text-sm">Tailored to your industry and jurisdictions</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
                <h3 className="text-white font-semibold mb-1">Ongoing Support</h3>
                <p className="text-blue-100 text-sm">Continuous guidance throughout your ESG journey</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-6 text-center">
              <p className="text-white font-semibold text-lg mb-2">
                Transform Your ESG Strategy
              </p>
              <p className="text-white/90 text-sm">
                Join hundreds of companies who trust esgReport for their sustainability reporting
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://esgreport.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-blue-900 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Visit esgReport.co.uk
                <ExternalLink className="w-5 h-5" />
              </a>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/30"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-blue-200 text-xs text-center mt-6">
              Free consultation available for qualifying organizations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
