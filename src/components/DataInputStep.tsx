import { useState, useEffect } from 'react';
import { Copy, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { ESGData } from '../types';
import { generateESGDataTemplate } from '../services/geminiService';

interface DataInputStepProps {
  data: ESGData;
  onChange: (data: ESGData) => void;
  industries?: string[];
  jurisdictions?: string[];
}

export default function DataInputStep({ data, onChange, industries = [], jurisdictions = [] }: DataInputStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    environmental: false,
    social: false,
    governance: false
  });

  const handleChange = (field: keyof ESGData, value: string) => {
    onChange({ ...data, [field]: value });
    setErrors({ ...errors, [field]: false });
  };

  const handleCopy = async (field: keyof ESGData) => {
    const text = data[field];
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleGenerateTemplate = async () => {
    if (industries.length === 0 || jurisdictions.length === 0) {
      alert('Please complete Step 1 (Company Info) first to generate AI-powered templates.');
      return;
    }

    setIsGenerating(true);
    try {
      const template = await generateESGDataTemplate(industries, jurisdictions);
      onChange({
        environmental: template.environmental,
        social: template.social,
        governance: template.governance
      });
      setHasGenerated(true);
      setErrors({
        environmental: false,
        social: false,
        governance: false
      });
    } catch (error) {
      console.error('Error generating template:', error);
      alert('Failed to generate template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!data.environmental && !data.social && !data.governance && industries.length > 0 && jurisdictions.length > 0 && !hasGenerated) {
      handleGenerateTemplate();
    }
  }, [industries, jurisdictions]);

  const validateField = (field: keyof ESGData): boolean => {
    return !data[field] || data[field].trim().length < 20;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ESG Data Input</h2>
        <p className="text-gray-600">Provide your ESG metrics and information</p>
      </div>

      {hasGenerated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium">AI-Generated Templates</p>
              <p className="text-sm text-blue-800 mt-1">
                We've pre-filled these fields with industry-specific sample data based on <strong>{industries.join(', ')}</strong> operating in <strong>{jurisdictions.slice(0, 3).join(', ')}{jurisdictions.length > 3 ? ` and ${jurisdictions.length - 3} more` : ''}</strong>. You can edit this data directly or copy it to modify elsewhere before pasting back.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleGenerateTemplate}
          disabled={isGenerating || industries.length === 0 || jurisdictions.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Templates...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {hasGenerated ? 'Regenerate Templates' : 'Generate AI Templates'}
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Environmental Data *
            </label>
            <button
              onClick={() => handleCopy('environmental')}
              disabled={!data.environmental}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedField === 'environmental' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Include: emissions, energy use, water consumption, waste, recycling, renewable energy, carbon footprint, environmental initiatives
          </p>
          <textarea
            value={data.environmental}
            onChange={(e) => handleChange('environmental', e.target.value)}
            onBlur={() => {
              if (validateField('environmental')) {
                setErrors({ ...errors, environmental: true });
              }
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[150px] transition-colors ${
              errors.environmental && validateField('environmental')
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="Example:&#10;- Annual CO2 emissions: 1,500 tons&#10;- Renewable energy: 40% of total consumption&#10;- Water usage: 50,000 cubic meters&#10;- Waste recycling rate: 65%&#10;- Solar panels installed on 3 facilities"
            required
          />
          {errors.environmental && validateField('environmental') && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Please provide detailed environmental data (minimum 20 characters)</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Social Data *
            </label>
            <button
              onClick={() => handleCopy('social')}
              disabled={!data.social}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedField === 'social' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Include: employee demographics, diversity stats, health & safety records, training hours, community programs, labor practices
          </p>
          <textarea
            value={data.social}
            onChange={(e) => handleChange('social', e.target.value)}
            onBlur={() => {
              if (validateField('social')) {
                setErrors({ ...errors, social: true });
              }
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[150px] transition-colors ${
              errors.social && validateField('social')
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="Example:&#10;- Total employees: 500&#10;- Women in leadership: 35%&#10;- Employee satisfaction: 82%&#10;- Zero workplace fatalities&#10;- 40 hours average training per employee&#10;- Partnered with 3 local charities"
            required
          />
          {errors.social && validateField('social') && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Please provide detailed social data (minimum 20 characters)</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Governance Data *
            </label>
            <button
              onClick={() => handleCopy('governance')}
              disabled={!data.governance}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedField === 'governance' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Include: board composition, independence, ethics policies, compliance programs, risk management, stakeholder engagement
          </p>
          <textarea
            value={data.governance}
            onChange={(e) => handleChange('governance', e.target.value)}
            onBlur={() => {
              if (validateField('governance')) {
                setErrors({ ...errors, governance: true });
              }
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[150px] transition-colors ${
              errors.governance && validateField('governance')
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="Example:&#10;- Board: 8 members, 4 independent directors&#10;- Board diversity: 3 women, 2 minorities&#10;- Code of conduct signed by 100% of employees&#10;- Annual ethics training mandatory&#10;- Whistleblower hotline established&#10;- Quarterly stakeholder meetings"
            required
          />
          {errors.governance && validateField('governance') && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Please provide detailed governance data (minimum 20 characters)</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Tip:</strong> The more specific and quantitative your data, the better your report will be. Include actual numbers, percentages, and timeframes when possible.
        </p>
      </div>
    </div>
  );
}
