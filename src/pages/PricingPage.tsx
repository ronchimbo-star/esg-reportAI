import { useState } from 'react';
import { Check, X, Send, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PricingPage() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setShowContactModal(true);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `Pricing Inquiry - ${selectedPlan} Plan`,
          message: `Plan: ${selectedPlan}\n\n${formData.message}`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', company: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your organization's ESG reporting needs
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter Package</h3>
                <p className="text-gray-600 mb-6">Perfect for small businesses getting started with ESG</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">£299</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
                <p className="text-sm font-semibold text-green-600">Clear roadmap to compliance</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Quick-Start Audit (2-3 hours)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">60-minute consultation (Zoom)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Current compliance assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">3-page action plan</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 5 users</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Max 2 ESG frameworks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic Reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Standard data import</span>
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect('Starter Package')}
                className="w-full py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-xl border-2 border-blue-500 p-8 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Package</h3>
                <p className="text-gray-600 mb-6">Ideal for growing companies with complex needs</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">£899</span>
                </div>
                <p className="text-sm font-semibold text-blue-600">Complete compliance strategy</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Full ESG Roadmap</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Comprehensive audit (6-12 hours)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Gap analysis vs. UK regulations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">12-month implementation plan</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Quarterly check-in calls (4 total)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Priority email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Up to 20 users</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Max 5 ESG Frameworks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">AI-assisted reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Advanced Analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Multi-site management</span>
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect('Professional Package')}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-semibold shadow-lg"
              >
                Get Started
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Package</h3>
                <p className="text-gray-600 mb-6">For large organizations with custom requirements</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">Peace of mind + continuous compliance</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Full ESG Roadmap</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Comprehensive audit</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Gap analysis vs. UK regulations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">12-36 month implementation plan</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated ESG Reporting Manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom Integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Regulatory updates & alerts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Annual roadmap refresh</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">SLA guarantees</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">On premise deployment option</span>
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect('Enterprise Package')}
                className="w-full py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Contact Sales
              </button>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 rounded-2xl shadow-2xl border-2 border-green-500 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src="/green-registry-icon1.png"
                    alt="Green Registry Badge"
                    className="w-32 h-32 md:w-40 md:h-40"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-sm">Verification & Certification</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    ESG Sustainability Verification
                  </h3>
                  <p className="text-xl text-green-50 mb-6">
                    Trust signal for customers
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-2">£250</div>
                      <div className="text-green-50 font-medium mb-4">One-Time Verification</div>
                      <ul className="space-y-3 text-left">
                        <li className="flex items-start gap-2 text-white">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Official compliance verification</span>
                        </li>
                        <li className="flex items-start gap-2 text-white">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Digital certification badge</span>
                        </li>
                        <li className="flex items-start gap-2 text-white">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Public verification profile on GreenRegistry</span>
                        </li>
                        <li className="flex items-start gap-2 text-white">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Marketing assets (badge, certificate)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-2">£150<span className="text-lg">/year</span></div>
                      <div className="text-green-50 font-medium mb-4">Annual Recertification</div>
                      <ul className="space-y-3 text-left">
                        <li className="flex items-start gap-2 text-white">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Ongoing verification maintenance</span>
                        </li>
                        <li className="flex items-start gap-2 text-white">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Updated compliance check</span>
                        </li>
                        <li className="flex items-start gap-2 text-white">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Renewed certification</span>
                        </li>
                        <li className="flex items-start gap-2 text-white">
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Maintained public profile</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button
                      onClick={() => handlePlanSelect('ESG Verification')}
                      className="px-8 py-4 bg-white text-green-700 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-xl"
                    >
                      Get Verified
                    </button>
                    <a
                      href="https://greenregistry.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-lg hover:bg-white/30 transition-colors font-bold text-lg text-center"
                    >
                      View Sample Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-blue-50 border-2 border-blue-200 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              All Plans Include
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Automated Calculations</p>
                  <p className="text-sm text-gray-600">GHG Protocol-compliant carbon calculations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Data Security</p>
                  <p className="text-sm text-gray-600">Enterprise-grade encryption & compliance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Regular Updates</p>
                  <p className="text-sm text-gray-600">Framework updates as regulations change</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Audit Trail</p>
                  <p className="text-sm text-gray-600">Complete history of changes and approvals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showContactModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => !submitted && setShowContactModal(false)}
            ></div>

            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 transform transition-all animate-slideUp">
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 animate-bounce-gentle">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Thank You for Your Interest!
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Our sales team will contact you within 24 hours to discuss the {selectedPlan} plan
                    and answer any questions you may have.
                  </p>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-lg"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Started with {selectedPlan}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Fill out the form below and our team will reach out to you shortly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        id="company"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Any specific requirements or questions..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Request
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
