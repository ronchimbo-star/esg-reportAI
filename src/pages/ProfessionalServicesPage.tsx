import { Link } from 'react-router-dom';
import { Shield, TrendingUp, CheckCircle, FileText, Calculator, Download, Users, Upload, Lock, Building, Droplet, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfessionalServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Professional ESG Reporting
              <br />
              <span className="text-green-400">Made Simple</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed">
              Sector-specific data collection that automatically populates your global ESG reports. Complete
              Construction, Water, and Energy frameworks with intelligent cross-framework mapping.
            </p>
            <Link
              to="/pricing"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
            >
              Sign Up
            </Link>

            <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">1,000+</div>
                <div className="text-blue-200">Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-blue-200">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">25+</div>
                <div className="text-blue-200">Frameworks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
              Comprehensive ESG Framework Coverage
            </h2>
            <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto mb-16">
              Support for 25+ international frameworks including mandatory regulatory requirements,
              emerging standards, and voluntary reporting guidelines.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <Shield className="w-10 h-10 text-red-600" />
                  <span className="px-4 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                    Mandatory
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Regulatory Frameworks</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  CSRD, EU Taxonomy, UK SDS, California Climate, SEC Climate
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Corporate Sustainability Reporting Directive (CSRD)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>EU Taxonomy Regulation</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>UK Sustainability Disclosure Standards</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <TrendingUp className="w-10 h-10 text-yellow-600" />
                  <span className="px-4 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                    Emerging
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Emerging Standards</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  IFRS S1/S2, TNFD, SDGs
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>IFRS S1 & S2 (ISSB Standards)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>Taskforce on Nature-related Disclosures (TNFD)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>UN Sustainable Development Goals (SDGs)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                  <span className="px-4 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                    Voluntary
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Voluntary Frameworks</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  GRI, TCFD, SASB, CDP, UN Global Compact
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Global Reporting Initiative (GRI)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Task Force on Climate-related Disclosures (TCFD)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Sustainability Accounting Standards Board (SASB)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
              Intelligent ESG Platform Features
            </h2>
            <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto mb-16">
              Sector-specific data collection with automatic cross-framework mapping to global ESG standards.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <FileText className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Data Collection</h3>
                <p className="text-gray-600 mb-4">
                  Step-by-step forms with contextual tooltips and validation rules
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Framework-specific questions adapt based on your sector selection.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Contextual help tooltips</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Real-time validation</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Auto-save drafts</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <Calculator className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Calculations</h3>
                <p className="text-gray-600 mb-4">
                  Convert fuel consumption to CO2e using GHG Protocol formulas
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Industry benchmarking included.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>GHG Protocol compliance</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Industry benchmarking</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Scope 1, 2, 3 calculations</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <Download className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Output Formats</h3>
                <p className="text-gray-600 mb-4">
                  Generate branded PDF reports, Excel workbooks with pivot tables
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Shareable online versions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Branded PDF templates</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Excel with pivot tables</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Shareable online links</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <Users className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Stakeholder-Specific Views</h3>
                <p className="text-gray-600 mb-4">
                  Toggle between investor, regulator, and employee views
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Relevant metrics for each audience.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Investor focus (TCFD risks)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Regulatory compliance</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Employee engagement</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <Upload className="w-12 h-12 text-teal-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk Data Import</h3>
                <p className="text-gray-600 mb-4">
                  Upload data from existing systems via Excel templates
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Automatic data validation and error checking.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Excel template downloads</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Data validation</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Error reporting</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <Lock className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Access Control</h3>
                <p className="text-gray-600 mb-4">
                  Super Admin, Admin, and User roles with appropriate permissions
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Organization management.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Organization hierarchy</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Permission controls</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Audit logging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white text-center mb-4">
              Sector-Specific Toolkits
            </h2>
            <p className="text-xl text-blue-100 text-center max-w-4xl mx-auto mb-16">
              Specialized modules for Construction, Water, and Energy sectors with industry-specific
              frameworks and certifications.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <Building className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Construction & Infrastructure</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• BREEAM UK 2018</li>
                  <li>• LEED v4.1 BD+C</li>
                  <li>• CEEQUAL Version 6</li>
                  <li>• WELL Building Standard</li>
                  <li>• Life Cycle Assessment (LCA)</li>
                  <li>• Whole Life Carbon (WLC)</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <Droplet className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Water & Utilities</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• AWS Standard v2.0</li>
                  <li>• GRI 303: Water & Effluents</li>
                  <li>• TCFD Water Risks</li>
                  <li>• Water footprint analysis</li>
                  <li>• Consumption tracking</li>
                  <li>• Quality monitoring</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <Zap className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Energy Sector</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• GRI GRID</li>
                  <li>• SBTi Energy</li>
                  <li>• RE100 Commitments</li>
                  <li>• Net Zero frameworks</li>
                  <li>• Renewable energy tracking</li>
                  <li>• Carbon accounting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your ESG Reporting?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 1,000+ organizations using our platform for comprehensive, compliant ESG reporting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-lg shadow-lg"
              >
                View Pricing
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-bold text-lg"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
