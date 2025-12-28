import { Check, Zap, Shield, Download } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate comprehensive ESG reports in minutes with our AI-powered platform
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl font-bold text-green-600">1</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Enter Company Information</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Provide basic details about your company, including industry, jurisdiction, and key operational information. This helps our AI understand your specific context.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>Company name and industry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>Operating jurisdictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>Reporting frameworks you need</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl font-bold text-blue-600">2</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Frameworks</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Choose from global ESG frameworks including EU CSRD, GRI, TCFD, SASB, and more. Our system supports all major standards and can combine multiple frameworks.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <span>20+ supported frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <span>Multi-framework reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <span>Industry-specific guidance</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    {['EU CSRD', 'GRI', 'TCFD', 'SASB', 'CDP', 'UN SDGs'].map((fw) => (
                      <div key={fw} className="p-3 bg-green-50 rounded-lg text-center font-medium text-green-700 border-2 border-green-200">
                        {fw}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Generates Your Report</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our advanced AI analyzes your information and generates a comprehensive, compliant ESG report tailored to your selected frameworks and industry.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <span>Framework-aligned structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <span>Industry best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <span>Actionable recommendations</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-lg p-8 border-2 border-purple-200">
                  <div className="flex items-center justify-center">
                    <Zap className="w-24 h-24 text-purple-600 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Download className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Download & Use</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Review your report, download it in multiple formats, and use it for stakeholder communications, regulatory compliance, or as a foundation for deeper reporting.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>Multiple export formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>Professional formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>Ready for stakeholders</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <Download className="w-16 h-16 text-green-600" />
                    </div>
                    <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold">
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Free & Secure</h2>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
              Our tool is completely free to use. We never store sensitive data, and your reports are yours to keep. For ongoing tracking and advanced features, check out our full platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Try It Now
              </Link>
              <a
                href="https://esgreport.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold"
              >
                View Full Platform
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
