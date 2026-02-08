import { FormData } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Report generation is now handled securely via Supabase Edge Function
// The API key is stored server-side and never exposed to the browser

export async function generateReport(
  formData: FormData,
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/generate-report`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body received from server');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let hasReceivedContent = false;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        hasReceivedContent = true;
        onChunk(chunk);
      }
    }

    if (!hasReceivedContent) {
      throw new Error('No content was generated. Please try again.');
    }
  } catch (error) {
    console.error('Error generating report:', error);

    if (error instanceof Error) {
      if (error.message.includes('400')) {
        throw new Error('Bad request. Please check your input and try again.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message.includes('500') || error.message.includes('503')) {
        throw new Error('Service temporarily unavailable. Please try again in a moment.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }

    throw new Error('Failed to generate report. Please try again.');
  }
}

// Framework recommendations - this could also be moved to an edge function in the future
// For now, returning static recommendations based on common patterns
export async function recommendFrameworks(
  industry: string,
  jurisdictions: string[]
): Promise<string[]> {
  const recommendations: string[] = [];

  // EU jurisdictions should always include CSRD for large companies
  const euCountries = ['European Union', 'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus',
    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland',
    'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'];

  const hasEUJurisdiction = jurisdictions.some(j => euCountries.includes(j));

  if (hasEUJurisdiction) {
    recommendations.push('EU_CSRD');
  }

  // UK jurisdiction
  if (jurisdictions.includes('United Kingdom')) {
    recommendations.push('UK_SDS');
  }

  // US jurisdiction
  if (jurisdictions.includes('United States')) {
    recommendations.push('SEC_CLIMATE');
  }

  // Financial services should include SFDR if in EU
  const financialSectors = ['Banking', 'Asset Management', 'Insurance', 'Investment Banking'];
  if (hasEUJurisdiction && financialSectors.includes(industry)) {
    recommendations.push('SFDR');
  }

  // Universal frameworks everyone should consider
  recommendations.push('GRI', 'TCFD', 'SASB');

  // Sector-specific recommendations
  if (industry.includes('Construction') || industry.includes('Real Estate')) {
    recommendations.push('BREEAM', 'LEED');
  }

  if (industry.includes('Water')) {
    recommendations.push('AWS');
  }

  if (industry.includes('Electric') || industry.includes('Energy') || industry.includes('Utilities')) {
    recommendations.push('RE100', 'SBTI_ENERGY');
  }

  if (industry.includes('Real Estate') || industry === 'REITs') {
    recommendations.push('GRESB');
  }

  if (financialSectors.includes(industry)) {
    recommendations.push('PRI');
  }

  return [...new Set(recommendations)]; // Remove duplicates
}

export async function generateESGDataTemplate(
  industries: string[],
  jurisdictions: string[]
): Promise<{ environmental: string; social: string; governance: string }> {
  // Generate helpful templates based on industries and jurisdictions
  const industryText = industries.join(', ');
  const jurisdictionText = jurisdictions.join(', ');

  return {
    environmental: `Please provide environmental data for your ${industryText} operations in ${jurisdictionText}:

**Climate & Emissions:**
- Scope 1 emissions (direct): [Enter total in tCO2e]
- Scope 2 emissions (electricity): [Enter total in tCO2e]
- Scope 3 emissions (value chain): [Enter total in tCO2e if available]
- Carbon intensity: [Enter emissions per unit of revenue or production]

**Energy:**
- Total energy consumption: [Enter in MWh or GJ]
- Renewable energy percentage: [Enter %]
- Energy efficiency initiatives: [Describe key programs]

**Water:**
- Total water withdrawal: [Enter in m³ or gallons]
- Water recycling rate: [Enter %]
- Operations in water-stressed regions: [Yes/No and describe]

**Waste:**
- Total waste generated: [Enter in tonnes]
- Waste recycled/recovered: [Enter % or tonnes]
- Hazardous waste: [Enter tonnes and disposal method]`,

    social: `Please provide social performance data for your ${industryText} operations in ${jurisdictionText}:

**Workforce:**
- Total employees: [Enter number]
- Employee turnover rate: [Enter %]
- Gender diversity: [Enter % women overall and in leadership]
- Ethnic/minority representation: [Enter %]

**Health & Safety:**
- Lost Time Injury Frequency Rate (LTIFR): [Enter rate]
- Fatalities: [Enter number]
- Safety training hours: [Enter total hours]
- Health and safety incidents: [Enter number]

**Community:**
- Community investment: [Enter amount in local currency]
- Volunteer hours: [Enter total hours]
- Local employment: [Enter % of local hires]
- Community programs: [Describe key initiatives]

**Labor Practices:**
- Living wage compliance: [Yes/No]
- Collective bargaining coverage: [Enter %]
- Human rights training: [Enter % of employees trained]`,

    governance: `Please provide governance data for your ${industryText} operations in ${jurisdictionText}:

**Board Composition:**
- Board size: [Enter number of directors]
- Independent directors: [Enter number and %]
- Women on board: [Enter number and %]
- Board diversity: [Describe ethnic, age, skills diversity]
- Board meeting frequency: [Enter number per year]

**Ethics & Compliance:**
- Code of conduct: [Yes/No]
- Ethics training completion: [Enter %]
- Whistleblower mechanism: [Yes/No]
- Reported ethics violations: [Enter number]
- Fines or sanctions: [Enter amount if any]
- Anti-corruption policy: [Yes/No]

**Risk Management:**
- Enterprise risk management framework: [Describe]
- ESG risks identified: [List key ESG risks]
- Cybersecurity incidents: [Enter number]
- Data breaches: [Enter number]

**Transparency:**
- External ESG audits: [Yes/No and which standards]
- Sustainability report published: [Yes/No and frequency]
- Stakeholder engagement: [Describe approach]
- Executive compensation linked to ESG: [Yes/No and %]`
  };
}
