export interface CompanyInfo {
  name: string;
  website: string;
  industries: string[];
  jurisdictions: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface ESGData {
  environmental: string;
  social: string;
  governance: string;
}

export interface FormData {
  companyInfo: CompanyInfo;
  esgData: ESGData;
  selectedFrameworks: string[];
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  category: 'mandatory' | 'voluntary' | 'sector-specific';
  applicableRegions?: string[];
  applicableSectors?: string[];
}

export const AVAILABLE_FRAMEWORKS: Framework[] = [
  {
    id: 'EU_CSRD',
    name: 'EU CSRD - Corporate Sustainability Reporting Directive',
    description: 'Mandatory EU sustainability reporting for large companies and listed SMEs',
    category: 'mandatory',
    applicableRegions: ['European Union', 'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden']
  },
  {
    id: 'EU_TAXONOMY',
    name: 'EU Taxonomy',
    description: 'Classification system for environmentally sustainable economic activities',
    category: 'mandatory',
    applicableRegions: ['European Union', 'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden']
  },
  {
    id: 'UK_SDS',
    name: 'UK SDS - UK Sustainability Disclosure Standards',
    description: 'UK mandatory sustainability disclosure requirements',
    category: 'mandatory',
    applicableRegions: ['United Kingdom']
  },
  {
    id: 'SEC_CLIMATE',
    name: 'SEC Climate Disclosure Rules',
    description: 'US SEC climate-related disclosure requirements for public companies',
    category: 'mandatory',
    applicableRegions: ['United States']
  },
  {
    id: 'SFDR',
    name: 'SFDR - Sustainable Finance Disclosure Regulation',
    description: 'EU regulation for financial market participants on sustainability',
    category: 'mandatory',
    applicableRegions: ['European Union', 'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'],
    applicableSectors: ['Banking', 'Asset Management', 'Insurance', 'Investment Banking', 'Private Equity', 'Venture Capital']
  },
  {
    id: 'GRI',
    name: 'GRI - Global Reporting Initiative',
    description: 'The most widely used sustainability reporting standard globally',
    category: 'voluntary'
  },
  {
    id: 'TCFD',
    name: 'TCFD - Task Force on Climate-related Financial Disclosures',
    description: 'Framework for climate-related financial risk disclosures',
    category: 'voluntary'
  },
  {
    id: 'SASB',
    name: 'SASB - Sustainability Accounting Standards Board',
    description: 'Industry-specific sustainability accounting standards',
    category: 'voluntary'
  },
  {
    id: 'CDP',
    name: 'CDP - Carbon Disclosure Project',
    description: 'Global disclosure system for environmental impacts',
    category: 'voluntary'
  },
  {
    id: 'ISSB',
    name: 'ISSB - International Sustainability Standards Board',
    description: 'Global baseline of sustainability disclosures (IFRS S1 & S2)',
    category: 'voluntary'
  },
  {
    id: 'UN_SDG',
    name: 'UN SDGs - Sustainable Development Goals',
    description: 'United Nations framework for sustainable development',
    category: 'voluntary'
  },
  {
    id: 'UN_GLOBAL_COMPACT',
    name: 'UN Global Compact',
    description: 'Ten principles covering human rights, labor, environment, and anti-corruption',
    category: 'voluntary'
  },
  {
    id: 'ISO_14001',
    name: 'ISO 14001 - Environmental Management',
    description: 'International standard for environmental management systems',
    category: 'voluntary'
  },
  {
    id: 'BREEAM',
    name: 'BREEAM UK 2018',
    description: 'Leading sustainability assessment method for buildings',
    category: 'sector-specific',
    applicableSectors: ['Construction', 'Real Estate Development', 'Property Management', 'Commercial Real Estate', 'Residential Construction']
  },
  {
    id: 'CEEQUAL',
    name: 'CEEQUAL Version 6',
    description: 'Sustainability assessment for civil engineering and infrastructure',
    category: 'sector-specific',
    applicableSectors: ['Construction', 'Civil Engineering', 'Infrastructure Development']
  },
  {
    id: 'LEED',
    name: 'LEED v4.1 BD+C',
    description: 'Leadership in Energy and Environmental Design for buildings',
    category: 'sector-specific',
    applicableSectors: ['Construction', 'Real Estate Development', 'Property Management', 'Architecture']
  },
  {
    id: 'AWS',
    name: 'AWS Standard v2.0',
    description: 'Alliance for Water Stewardship standard for water management',
    category: 'sector-specific',
    applicableSectors: ['Water Utilities', 'Beverage Manufacturing', 'Food Processing', 'Agriculture', 'Mining']
  },
  {
    id: 'TCFD_WATER',
    name: 'TCFD Water',
    description: 'Water-related financial disclosures framework',
    category: 'sector-specific',
    applicableSectors: ['Water Utilities', 'Agriculture', 'Beverage Manufacturing']
  },
  {
    id: 'GRI_303',
    name: 'GRI 303 - Water and Effluents',
    description: 'Specific standard for water and effluents reporting',
    category: 'sector-specific',
    applicableSectors: ['Water Utilities', 'Manufacturing', 'Chemical Manufacturing']
  },
  {
    id: 'GRI_GRID',
    name: 'GRI GRID',
    description: 'GRI sector standard for electric utilities',
    category: 'sector-specific',
    applicableSectors: ['Electric Utilities', 'Renewable Energy', 'Energy Distribution']
  },
  {
    id: 'RE100',
    name: 'RE100',
    description: 'Corporate renewable energy initiative for 100% renewable electricity',
    category: 'sector-specific',
    applicableSectors: ['Electric Utilities', 'Renewable Energy', 'Energy Distribution', 'Oil & Gas']
  },
  {
    id: 'SBTI_ENERGY',
    name: 'SBTi Energy',
    description: 'Science Based Targets initiative for energy sector',
    category: 'sector-specific',
    applicableSectors: ['Electric Utilities', 'Renewable Energy', 'Oil & Gas', 'Energy Distribution']
  },
  {
    id: 'GRESB',
    name: 'GRESB - Real Estate Benchmark',
    description: 'ESG benchmark for real estate and infrastructure',
    category: 'sector-specific',
    applicableSectors: ['Real Estate Development', 'Property Management', 'Commercial Real Estate', 'REITs']
  },
  {
    id: 'EPRA_SBPR',
    name: 'EPRA sBPR - Sustainability Reporting',
    description: 'European Public Real Estate sustainability reporting guidelines',
    category: 'sector-specific',
    applicableSectors: ['Real Estate Development', 'Property Management', 'Commercial Real Estate', 'REITs']
  },
  {
    id: 'PRI',
    name: 'PRI - Principles for Responsible Investment',
    description: 'UN-supported framework for responsible investment',
    category: 'sector-specific',
    applicableSectors: ['Asset Management', 'Investment Banking', 'Private Equity', 'Pension Funds', 'Venture Capital']
  },
  {
    id: 'EQUATOR_PRINCIPLES',
    name: 'Equator Principles',
    description: 'Risk management framework for project finance',
    category: 'sector-specific',
    applicableSectors: ['Banking', 'Investment Banking', 'Project Finance']
  }
];

export const INDUSTRIES = [
  'Accounting Services',
  'Advertising & Marketing',
  'Aerospace & Defense',
  'Agriculture',
  'Airlines',
  'Architecture',
  'Asset Management',
  'Automotive Manufacturing',
  'Banking',
  'Beverage Manufacturing',
  'Biotechnology',
  'Chemical Manufacturing',
  'Civil Engineering',
  'Commercial Real Estate',
  'Construction',
  'Consulting Services',
  'Data Centers',
  'E-commerce',
  'Education Services',
  'Electric Utilities',
  'Energy Distribution',
  'Entertainment',
  'Fashion & Apparel',
  'Food Processing',
  'Food Service',
  'Forestry',
  'Healthcare Services',
  'Hospitality & Hotels',
  'Infrastructure Development',
  'Insurance',
  'Investment Banking',
  'Legal Services',
  'Logistics & Supply Chain',
  'Manufacturing - Electronics',
  'Manufacturing - Industrial',
  'Media & Publishing',
  'Medical Devices',
  'Mining',
  'Oil & Gas',
  'Pension Funds',
  'Pharmaceuticals',
  'Private Equity',
  'Professional Services',
  'Property Management',
  'Public Sector',
  'Rail Transportation',
  'Real Estate Development',
  'REITs',
  'Renewable Energy',
  'Restaurants',
  'Retail - Fashion',
  'Retail - Food & Beverage',
  'Retail - General Merchandise',
  'Road Transportation',
  'Shipping & Maritime',
  'Software & Technology',
  'Steel Manufacturing',
  'Telecommunications',
  'Textiles',
  'Tourism',
  'Venture Capital',
  'Waste Management',
  'Water Utilities',
  'Other'
];

export const JURISDICTIONS = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
  'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'European Union', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];
