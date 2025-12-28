import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { AVAILABLE_FRAMEWORKS } from '../types';

interface FrameworkSelectionStepProps {
  selectedFrameworks: string[];
  onChange: (frameworks: string[]) => void;
  industries: string[];
  jurisdictions: string[];
}

export default function FrameworkSelectionStep({
  selectedFrameworks,
  onChange,
  industries,
  jurisdictions
}: FrameworkSelectionStepProps) {
  const [isRecommending, setIsRecommending] = useState(false);
  const [hasRecommended, setHasRecommended] = useState(false);

  const handleToggle = (frameworkId: string) => {
    const updated = selectedFrameworks.includes(frameworkId)
      ? selectedFrameworks.filter(id => id !== frameworkId)
      : [...selectedFrameworks, frameworkId];
    onChange(updated);
  };

  const getRecommendedFrameworks = (): string[] => {
    const recommended: string[] = [];

    AVAILABLE_FRAMEWORKS.forEach(framework => {
      if (framework.category === 'mandatory') {
        if (framework.applicableRegions) {
          const hasMatchingRegion = jurisdictions.some(j =>
            framework.applicableRegions?.includes(j)
          );
          if (hasMatchingRegion) {
            if (framework.applicableSectors) {
              const hasMatchingSector = industries.some(i =>
                framework.applicableSectors?.includes(i)
              );
              if (hasMatchingSector) {
                recommended.push(framework.id);
              }
            } else {
              recommended.push(framework.id);
            }
          }
        }
      } else if (framework.category === 'sector-specific') {
        if (framework.applicableSectors) {
          const hasMatchingSector = industries.some(i =>
            framework.applicableSectors?.includes(i)
          );
          if (hasMatchingSector) {
            recommended.push(framework.id);
          }
        }
      }
    });

    if (!recommended.includes('GRI')) {
      recommended.push('GRI');
    }
    if (!recommended.includes('TCFD')) {
      recommended.push('TCFD');
    }

    return recommended;
  };

  useEffect(() => {
    if (!hasRecommended && industries.length > 0 && jurisdictions.length > 0) {
      const recommended = getRecommendedFrameworks();
      onChange(recommended);
      setHasRecommended(true);
    }
  }, [industries, jurisdictions]);

  const handleRecommend = async () => {
    if (industries.length === 0 || jurisdictions.length === 0) {
      alert('Please complete Step 1 (Company Info) first to get recommendations.');
      return;
    }

    setIsRecommending(true);
    try {
      const recommended = getRecommendedFrameworks();
      onChange(recommended);
      setHasRecommended(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setIsRecommending(false);
    }
  };

  const mandatoryFrameworks = AVAILABLE_FRAMEWORKS.filter(f => f.category === 'mandatory');
  const voluntaryFrameworks = AVAILABLE_FRAMEWORKS.filter(f => f.category === 'voluntary');
  const sectorFrameworks = AVAILABLE_FRAMEWORKS.filter(f => f.category === 'sector-specific');

  const isRecommended = (frameworkId: string): boolean => {
    return getRecommendedFrameworks().includes(frameworkId);
  };

  const renderFramework = (framework: typeof AVAILABLE_FRAMEWORKS[0]) => {
    const isSelected = selectedFrameworks.includes(framework.id);
    const recommended = isRecommended(framework.id);

    return (
      <div
        key={framework.id}
        onClick={() => handleToggle(framework.id)}
        className={`
          relative p-4 border-2 rounded-lg cursor-pointer transition-all
          ${isSelected
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-gray-300 bg-white'
          }
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`
            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5
            ${isSelected
              ? 'border-green-500 bg-green-500'
              : 'border-gray-300'
            }
          `}>
            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-sm">
                {framework.name}
              </h3>
              {recommended && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                  <Sparkles className="w-3 h-3" />
                  Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">
              {framework.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select ESG Frameworks</h2>
        <p className="text-gray-600">Choose the reporting frameworks that apply to your organization</p>
      </div>

      {hasRecommended && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium">AI-Recommended Frameworks</p>
              <p className="text-sm text-blue-800 mt-1">
                Based on your industries ({industries.join(', ')}) and jurisdictions ({jurisdictions.slice(0, 3).join(', ')}{jurisdictions.length > 3 ? ` +${jurisdictions.length - 3} more` : ''}), we've pre-selected relevant frameworks. You can add or remove any frameworks as needed.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleRecommend}
          disabled={isRecommending || industries.length === 0 || jurisdictions.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isRecommending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {hasRecommended ? 'Refresh Recommendations' : 'Recommend for Me'}
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Mandatory Regulatory Frameworks</h3>
          <p className="text-sm text-gray-600 mb-4">
            Required frameworks based on your operating jurisdictions
          </p>
          <div className="grid gap-3">
            {mandatoryFrameworks.map(renderFramework)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Voluntary ESG Frameworks</h3>
          <p className="text-sm text-gray-600 mb-4">
            Widely recognized standards that demonstrate sustainability commitment
          </p>
          <div className="grid gap-3">
            {voluntaryFrameworks.map(renderFramework)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Sector-Specific Frameworks</h3>
          <p className="text-sm text-gray-600 mb-4">
            Industry-tailored frameworks relevant to your sectors
          </p>
          <div className="grid gap-3">
            {sectorFrameworks.map(renderFramework)}
          </div>
        </div>
      </div>

      {selectedFrameworks.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Please select at least one framework to generate your report.
          </p>
        </div>
      )}

      {selectedFrameworks.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>{selectedFrameworks.length} framework{selectedFrameworks.length > 1 ? 's' : ''} selected.</strong> Your report will align with these standards.
          </p>
        </div>
      )}
    </div>
  );
}
