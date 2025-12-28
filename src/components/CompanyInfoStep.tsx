import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { CompanyInfo, INDUSTRIES, JURISDICTIONS } from '../types';

interface CompanyInfoStepProps {
  data: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
}

export default function CompanyInfoStep({ data, onChange }: CompanyInfoStepProps) {
  const [industrySearch, setIndustrySearch] = useState('');
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false);
  const [showJurisdictionSuggestions, setShowJurisdictionSuggestions] = useState(false);

  const handleChange = (field: keyof CompanyInfo, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone: string) => {
    if (!phone) {
      setPhoneError('');
      return true;
    }
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (phone && !phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setPhoneError('Phone number must be at least 10 digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleIndustryAdd = (industry: string) => {
    const current = data.industries || [];
    if (!current.includes(industry)) {
      handleChange('industries', [...current, industry]);
    }
    setIndustrySearch('');
    setShowIndustrySuggestions(false);
  };

  const handleCustomIndustryAdd = () => {
    const trimmed = industrySearch.trim();
    if (trimmed && !(data.industries || []).includes(trimmed)) {
      handleChange('industries', [...(data.industries || []), trimmed]);
      setIndustrySearch('');
      setShowIndustrySuggestions(false);
    }
  };

  const handleIndustryRemove = (industry: string) => {
    const current = data.industries || [];
    handleChange('industries', current.filter(i => i !== industry));
  };

  const handleJurisdictionAdd = (jurisdiction: string) => {
    const current = data.jurisdictions || [];
    if (!current.includes(jurisdiction)) {
      handleChange('jurisdictions', [...current, jurisdiction]);
    }
    setJurisdictionSearch('');
    setShowJurisdictionSuggestions(false);
  };

  const handleJurisdictionRemove = (jurisdiction: string) => {
    const current = data.jurisdictions || [];
    handleChange('jurisdictions', current.filter(j => j !== jurisdiction));
  };

  const filteredIndustries = INDUSTRIES.filter(industry =>
    industry.toLowerCase().includes(industrySearch.toLowerCase()) &&
    !(data.industries || []).includes(industry)
  );

  const filteredJurisdictions = JURISDICTIONS.filter(jurisdiction =>
    jurisdiction.toLowerCase().includes(jurisdictionSearch.toLowerCase()) &&
    !(data.jurisdictions || []).includes(jurisdiction)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
        <p className="text-gray-600">Tell us about your organization</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter company name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={data.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industries * <span className="text-xs text-gray-500 font-normal">(Start typing or select from suggestions)</span>
          </label>
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={industrySearch}
                onChange={(e) => {
                  setIndustrySearch(e.target.value);
                  setShowIndustrySuggestions(true);
                }}
                onFocus={() => setShowIndustrySuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredIndustries.length > 0) {
                      handleIndustryAdd(filteredIndustries[0]);
                    } else if (industrySearch.trim()) {
                      handleCustomIndustryAdd();
                    }
                  }
                }}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Type your industry (e.g., Software & Technology, Manufacturing)..."
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            </div>
            {showIndustrySuggestions && (industrySearch.trim() || filteredIndustries.length > 0) && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                {filteredIndustries.length > 0 ? (
                  filteredIndustries.slice(0, 8).map(industry => (
                    <div
                      key={industry}
                      onClick={() => handleIndustryAdd(industry)}
                      className="px-4 py-2.5 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      {industry}
                    </div>
                  ))
                ) : industrySearch.trim() ? (
                  <div
                    onClick={handleCustomIndustryAdd}
                    className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <span className="text-gray-900">Add custom: <strong>{industrySearch}</strong></span>
                    </div>
                  </div>
                ) : null}
                {filteredIndustries.length > 8 && (
                  <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
                    {filteredIndustries.length - 8} more results... Keep typing to narrow down
                  </div>
                )}
              </div>
            )}
          </div>
          {data.industries && data.industries.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.industries.map(industry => (
                <span
                  key={industry}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => handleIndustryRemove(industry)}
                    className="hover:text-green-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operating Jurisdictions * <span className="text-xs text-gray-500 font-normal">(Countries where you operate or your audience is based)</span>
          </label>
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={jurisdictionSearch}
                onChange={(e) => {
                  setJurisdictionSearch(e.target.value);
                  setShowJurisdictionSuggestions(true);
                }}
                onFocus={() => setShowJurisdictionSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredJurisdictions.length > 0) {
                    e.preventDefault();
                    handleJurisdictionAdd(filteredJurisdictions[0]);
                  }
                }}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Type to search countries (e.g., United Kingdom, United States)..."
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            </div>
            {showJurisdictionSuggestions && jurisdictionSearch && filteredJurisdictions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                {filteredJurisdictions.slice(0, 10).map(jurisdiction => (
                  <div
                    key={jurisdiction}
                    onClick={() => handleJurisdictionAdd(jurisdiction)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    {jurisdiction}
                  </div>
                ))}
                {filteredJurisdictions.length > 10 && (
                  <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
                    {filteredJurisdictions.length - 10} more countries... Keep typing to narrow down
                  </div>
                )}
              </div>
            )}
          </div>
          {data.jurisdictions && data.jurisdictions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.jurisdictions.map(jurisdiction => (
                <span
                  key={jurisdiction}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {jurisdiction}
                  <button
                    type="button"
                    onClick={() => handleJurisdictionRemove(jurisdiction)}
                    className="hover:text-blue-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary ESG Contact Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={data.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={data.contactEmail}
                onChange={(e) => {
                  handleChange('contactEmail', e.target.value);
                  validateEmail(e.target.value);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
                required
              />
              {emailError && (
                <p className="text-sm text-red-600 mt-1">{emailError}</p>
              )}
              <p className="text-xs text-blue-600 mt-1">
                ⓘ Your ESG report will be sent to this email address. Please ensure it is correct.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={data.contactPhone}
                onChange={(e) => {
                  handleChange('contactPhone', e.target.value);
                  validatePhone(e.target.value);
                }}
                onBlur={(e) => validatePhone(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  phoneError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {phoneError && (
                <p className="text-sm text-red-600 mt-1">{phoneError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
