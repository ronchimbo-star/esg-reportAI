import { GoogleGenerativeAI } from '@google/generative-ai';
import { FormData } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

function buildPrompt(formData: FormData): string {
  const { companyInfo, esgData, selectedFrameworks } = formData;
  const frameworksList = selectedFrameworks.join(', ');
  const currentYear = new Date().getFullYear();

  let prompt = `You are an expert ESG (Environmental, Social, and Governance) reporting consultant. Generate a comprehensive, professional ESG report for the following company.

COMPANY INFORMATION:
- Company Name: ${companyInfo.name}
- Website: ${companyInfo.website || 'Not provided'}
- Industries: ${companyInfo.industries.join(', ')}
- Operating Jurisdictions: ${companyInfo.jurisdictions.join(', ')}

REPORTING FRAMEWORKS:
This report should align with the following frameworks: ${frameworksList}

ESG DATA PROVIDED:

ENVIRONMENTAL DATA:
${esgData.environmental}

SOCIAL DATA:
${esgData.social}

GOVERNANCE DATA:
${esgData.governance}

INSTRUCTIONS:
Generate a complete, audit-quality ESG report using the following structure. Use proper Markdown formatting with headers, lists, bold text, and emphasis where appropriate. Reference the actual data provided throughout the report.

# ${companyInfo.name} - Annual ESG Report ${currentYear}

## Introduction

[Write 2-3 paragraphs introducing the company, its ESG commitment, and the purpose of this report. Mention:]
- Brief overview of ${companyInfo.name} and its operations in ${companyInfo.industries.join(', ')}
- Operating presence in ${companyInfo.jurisdictions.length} jurisdiction(s)
- Commitment to sustainability and creating long-term value for stakeholders
- Reference to the frameworks used: ${frameworksList}

## Executive Summary

[Provide a comprehensive 3-4 paragraph overview covering:]
- Company's overall ESG performance highlights
- Key achievements in Environmental, Social, and Governance areas
- Most significant metrics and year-over-year improvements
- Strategic ESG priorities moving forward

## Company Overview

[Include:]
- Description of business activities in ${companyInfo.industries.join(', ')}
- Geographic footprint across ${companyInfo.jurisdictions.join(', ')}
- Key stakeholders and their importance to the business
- ESG governance structure

## Environmental Performance

### Climate & Emissions
[Analyze the emissions data provided. Include:]
- Scope 1, 2, and 3 emissions breakdown
- Carbon intensity metrics
- Year-over-year trends and comparisons
- Climate-related risks and opportunities

### Energy Management
[Cover:]
- Total energy consumption
- Renewable energy usage and percentage
- Energy efficiency initiatives and investments
- Future energy targets

### Water Stewardship
[Discuss:]
- Water consumption and conservation efforts
- Water recycling and efficiency measures
- Impact on water-stressed regions if applicable

### Waste Management & Circular Economy
[Detail:]
- Waste generation and disposal
- Recycling rates and initiatives
- Circular economy programs
- Hazardous waste management

### Environmental Certifications & Compliance
[Note any certifications, audits, violations, or fines]
`;

  if (selectedFrameworks.includes('TCFD')) {
    prompt += `
### TCFD Climate-Related Disclosures
#### Governance
[Board oversight of climate risks]

#### Strategy
[Climate risks and opportunities, scenario analysis]

#### Risk Management
[How climate risks are identified and managed]

#### Metrics & Targets
[Specific climate metrics and reduction targets]
`;
  }

  prompt += `
## Social Performance

### Workforce & Diversity
[Provide detailed analysis including:]
- Total employee count and regional distribution
- Gender diversity percentages across all levels
- Ethnic and minority representation
- Diversity in leadership positions with specific percentages
- Employee turnover rates compared to industry benchmarks
- Initiatives to improve diversity, equity, and inclusion

### Employee Well-being & Safety
[Cover:]
- Health and safety metrics (LTIFR, incidents, fatalities)
- Near-miss reporting and investigation
- Employee satisfaction and engagement scores
- Training and development programs with hours and investment
- Work-life balance initiatives
- Benefits and compensation philosophy

### Community Engagement & Impact
[Detail:]
- Community investment amounts and programs
- Employee volunteer hours and participation
- Partnerships with local organizations
- Educational and social initiatives
- Economic impact on local communities

### Human Rights & Labor Practices
[Include:]
- Supply chain labor standards and audits
- Living wage compliance
- Union representation and collective bargaining
- Human rights policies and training
- Grievance mechanisms

## Governance Performance

### Board Structure & Composition
[Analyze:]
- Board size and member profiles
- Independent director percentage
- Board diversity (gender, ethnicity, age, tenure)
- Committee structure (Audit, Risk, Sustainability)
- Board meeting frequency and attendance
- Director skills and expertise matrix

### Ethics & Compliance
[Detail:]
- Code of conduct and ethics policies
- Ethics training completion rates
- Whistleblower reports and resolution
- Anti-corruption and anti-bribery policies
- Compliance violations, fines, or sanctions
- Data protection and privacy policies

### Executive Compensation & Accountability
[Cover:]
- Executive compensation structure
- CEO-to-median employee pay ratio
- Performance-based compensation tied to ESG metrics

### Risk Management & Cybersecurity
[Include:]
- Enterprise risk management framework
- ESG risk integration
- Cybersecurity investments and incidents
- Business continuity planning

### Stakeholder Engagement & Transparency
[Discuss:]
- Stakeholder engagement processes
- Investor relations and communication
- Public reporting and transparency commitments
- External audits and assurance
`;

  if (selectedFrameworks.includes('CSRD')) {
    prompt += `
## EU CSRD Double Materiality Assessment
### Impact Materiality
[How the company impacts environment and society]

### Financial Materiality
[How ESG issues affect the company financially]
`;
  }

  if (selectedFrameworks.includes('UN_SDG')) {
    prompt += `
## UN Sustainable Development Goals Alignment
[Map company activities to relevant SDGs and explain contributions]
`;
  }

  prompt += `
## Key Performance Indicators Summary

[Create a comprehensive table or structured list of the most important ESG metrics, including:]
- Environmental KPIs (emissions, energy, water, waste)
- Social KPIs (employees, diversity, safety, training)
- Governance KPIs (board composition, ethics, compliance)
- Year-over-year comparisons where data is available

## Challenges & Areas for Improvement

[Provide an honest, balanced assessment of:]
- Data gaps and measurement limitations
- Areas where performance is below industry benchmarks
- Emerging ESG risks and challenges
- Stakeholder concerns that need addressing
- Recommendations for improving data collection and reporting

## Future Commitments & Strategic Roadmap

[Outline forward-looking commitments including:]
- Short-term targets (1-2 years)
- Medium-term goals (3-5 years)
- Long-term vision and net-zero commitments if applicable
- Planned investments in ESG initiatives
- Framework certifications or standards to pursue
- Stakeholder engagement plans

## Conclusion and Forward Outlook

[Write 2-3 paragraphs that:]
- Summarize ${companyInfo.name}'s ESG journey and progress in ${currentYear}
- Reaffirm commitment to sustainability and continuous improvement
- Reference the guiding frameworks (${frameworksList})
- Express commitment to transparency and stakeholder value creation
- Note specific priorities moving forward

---

**Report Preparation Details:**
- **Frameworks Referenced:** ${frameworksList}
- **Reporting Period:** ${currentYear}
- **Industries Covered:** ${companyInfo.industries.join(', ')}
- **Geographic Scope:** ${companyInfo.jurisdictions.join(', ')}

---

CRITICAL REQUIREMENTS FOR GENERATION:
1. Be highly specific and data-driven. Reference EVERY piece of actual data provided in the ESG data sections.
2. Use the exact numbers, percentages, and metrics from the data provided.
3. If data is incomplete or missing, acknowledge these gaps professionally and suggest what should be measured.
4. Maintain a professional, audit-ready tone throughout.
5. Include industry-specific considerations and benchmarks for the ${companyInfo.industries.join(', ')} sector(s).
6. Consider regulatory requirements and best practices for ${companyInfo.jurisdictions.join(', ')}.
7. Use ${frameworksList} as structural and content guidance - reference framework-specific requirements where applicable.
8. Format the entire response in clean, well-structured Markdown with proper headers, lists, and emphasis.
9. Make this report comprehensive (aim for 3000-4000 words minimum).
10. Ensure the report flows logically and tells a coherent story about the company's ESG performance.
`;

  return prompt;
}

export async function generateReport(
  formData: FormData,
  onChunk: (chunk: string) => void
): Promise<void> {
  if (!API_KEY) {
    throw new Error('API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

    const prompt = buildPrompt(formData);
    const result = await model.generateContentStream(prompt);

    let hasReceivedContent = false;
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        hasReceivedContent = true;
        onChunk(chunkText);
      }
    }

    if (!hasReceivedContent) {
      throw new Error('No content was generated. Please try again.');
    }
  } catch (error) {
    console.error('Error generating report:', error);

    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('403')) {
        throw new Error('Invalid API key. Please check your Google Gemini API key in the .env file.');
      } else if (error.message.includes('400')) {
        throw new Error('Bad Request: Please ensure billing is enabled on your Google Cloud project. Visit https://console.cloud.google.com/billing to enable billing.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message.includes('500') || error.message.includes('503')) {
        throw new Error('Google Gemini service is temporarily unavailable. Please try again in a moment.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }

    throw new Error('Failed to generate report. Please try again or check your API key configuration.');
  }
}

export async function recommendFrameworks(
  industry: string,
  jurisdictions: string[]
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      }
    });

    const prompt = `You are an ESG reporting expert. Based on the following company profile, recommend the most relevant ESG reporting frameworks.

Industry: ${industry}
Operating Jurisdictions: ${jurisdictions.join(', ')}

Available frameworks:
- GRI (Global Reporting Initiative)
- TCFD (Task Force on Climate-related Financial Disclosures)
- SASB (Sustainability Accounting Standards Board)
- CSRD (EU Corporate Sustainability Reporting Directive)
- CDP (Carbon Disclosure Project)
- UN_SDG (UN Sustainable Development Goals)

INSTRUCTIONS:
Return ONLY a comma-separated list of framework IDs (e.g., "GRI,TCFD,SASB").
Choose 2-4 frameworks that are most relevant based on:
1. Regulatory requirements in the jurisdictions
2. Industry best practices
3. Global standards applicability

Response format: FRAMEWORK1,FRAMEWORK2,FRAMEWORK3`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    const recommendedIds = response.split(',').map(id => id.trim());
    return recommendedIds;
  } catch (error) {
    console.error('Error recommending frameworks:', error);
    return ['GRI', 'TCFD'];
  }
}

export async function generateESGDataTemplate(
  industries: string[],
  jurisdictions: string[]
): Promise<{ environmental: string; social: string; governance: string }> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      }
    });

    const prompt = `You are an ESG reporting expert. Generate comprehensive, realistic ESG data for a company with the following profile:

Industries: ${industries.join(', ')}
Operating Jurisdictions: ${jurisdictions.join(', ')}

CRITICAL REQUIREMENTS:
1. Generate ACTUAL realistic numbers, percentages, and metrics (not placeholders like [Enter data])
2. Use specific, quantitative data that would be typical for a medium-to-large company in these industries
3. Include year-over-year comparisons where appropriate
4. Make the data detailed and comprehensive enough to generate a full ESG report
5. Ensure numbers are internally consistent and realistic for the industry

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "environmental": "comprehensive bullet point list with actual numbers",
  "social": "comprehensive bullet point list with actual numbers",
  "governance": "comprehensive bullet point list with actual numbers"
}

ENVIRONMENTAL DATA - Include 15-20 detailed metrics with ACTUAL NUMBERS:
- Total GHG emissions in tons CO2e (Scope 1, 2, 3)
- Energy consumption in MWh and percentage from renewable sources
- Water consumption in cubic meters
- Waste generated and recycling rates with specific tonnage
- Carbon intensity ratios
- Environmental investments and targets with specific dollar amounts
- Pollution incidents, fines, environmental certifications
- Climate risk assessments and adaptation measures
- Biodiversity impacts and conservation efforts
- Circular economy initiatives

SOCIAL DATA - Include 15-20 detailed metrics with ACTUAL NUMBERS:
- Total employees by region, gender breakdown with percentages
- Employee turnover rate
- Diversity in leadership positions (women, minorities) with percentages
- Average training hours per employee
- Health and safety: Lost Time Injury Frequency Rate (LTIFR), fatalities, near-misses
- Employee satisfaction score
- Community investment in dollars
- Supply chain labor audits
- Human rights policies and training
- Living wage compliance rates
- Customer satisfaction metrics
- Data privacy and security incidents

GOVERNANCE DATA - Include 15-20 detailed metrics with ACTUAL NUMBERS:
- Board size and composition (independent directors, committees)
- Board diversity statistics (gender, age ranges, tenure)
- Executive compensation ratios
- Ethics training completion rates
- Whistleblower reports and resolution rates
- Compliance violations and fines
- Anti-corruption policies and audits
- Risk management framework details
- Cybersecurity investments
- Stakeholder engagement frequency
- Transparency scores
- Political contributions and lobbying expenses
- Tax transparency metrics

Make all data specific to ${industries.join(', ')} and realistic for ${jurisdictions.slice(0, 5).join(', ')} operations. Include industry-specific KPIs.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    let jsonResponse = response;
    if (response.includes('```json')) {
      jsonResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (response.includes('```')) {
      jsonResponse = response.replace(/```\n?/g, '').trim();
    }

    const parsed = JSON.parse(jsonResponse);
    return {
      environmental: parsed.environmental || '',
      social: parsed.social || '',
      governance: parsed.governance || ''
    };
  } catch (error) {
    console.error('Error generating ESG data template:', error);
    return {
      environmental: '- Annual CO2 emissions: 15,430 tons CO2e (Scope 1: 3,200, Scope 2: 8,500, Scope 3: 3,730)\n- Energy consumption: 42,000 MWh (35% from renewable sources)\n- Renewable energy: Solar panels on 8 facilities generating 14,700 MWh annually\n- Water consumption: 125,000 cubic meters (5% reduction from 2024)\n- Waste generated: 2,450 tons (recycling rate: 68%, up from 62% in 2024)\n- Hazardous waste: 185 tons, all properly disposed through certified facilities\n- Carbon intensity: 12.5 tons CO2e per $1M revenue\n- Environmental investments: $2.3M in energy efficiency projects\n- Zero environmental fines or violations in 2025\n- ISO 14001 certified at 12 locations\n- Water recycling: 18% of water reused in operations\n- Fleet emissions: 450 vehicles, 15% electric/hybrid\n- Climate risk assessment completed with TCFD framework\n- Biodiversity: Zero operations in protected areas\n- Circular economy: 22% of materials from recycled sources',
      social: '- Total employees: 2,450 (52% female, 48% male)\n- Regional distribution: 65% North America, 25% Europe, 10% Asia-Pacific\n- Women in leadership: 42% (up from 38% in 2024)\n- Ethnic minority representation: 31% of workforce\n- Employee turnover rate: 11.2% (industry average: 14%)\n- Average training hours: 38 hours per employee annually\n- Training investment: $4.2M ($1,714 per employee)\n- Lost Time Injury Frequency Rate (LTIFR): 0.8 per million hours worked\n- Zero workplace fatalities in 2025\n- Near-miss incidents: 45 reported and investigated\n- Employee satisfaction score: 78% (industry benchmark: 72%)\n- Employee engagement survey participation: 89%\n- Community investment: $850,000 in local programs\n- Volunteer hours: 5,200 hours donated by employees\n- Supply chain audits: 95% of suppliers audited for labor practices\n- Living wage compliance: 100% of direct employees\n- Union representation: 28% of workforce\n- Parental leave: Average 14 weeks paid leave\n- Customer satisfaction (NPS): 67\n- Data privacy incidents: 2 minor incidents, zero breaches',
      governance: '- Board size: 9 members (6 independent directors, 67% independence)\n- Board diversity: 44% women, 22% ethnic minorities\n- Average board tenure: 4.2 years\n- Board age range: 45-68 years (median 58)\n- Board meetings: 12 per year with 97% average attendance\n- Audit committee: 4 meetings, 100% attendance\n- Risk committee: 6 meetings annually\n- CEO-to-median employee pay ratio: 85:1\n- Executive compensation: 65% performance-based\n- Ethics training: 100% completion rate (2,450/2,450 employees)\n- Code of conduct: Updated annually, signed by all employees\n- Whistleblower reports: 14 received, 100% investigated, 12 closed\n- Whistleblower protection: Zero retaliation cases\n- Zero material compliance violations in 2025\n- Regulatory fines: $0\n- Anti-corruption policy: Signed by 100% of employees and contractors\n- Third-party anti-corruption audits: 3 conducted\n- Cybersecurity investment: $1.8M annually (4% of IT budget)\n- Security incidents: 12 detected, 100% resolved, zero breaches\n- Data protection officer: Dedicated role established\n- Quarterly stakeholder meetings with investors\n- Annual general meeting: 78% shareholder participation\n- Tax effective rate: 22.5% (statutory rate: 21%)\n- Political contributions: $0 (policy of no political donations)\n- Lobbying expenses: $150,000 disclosed publicly\n- Supplier code of conduct: Required for 100% of suppliers'
    };
  }
}
