/*
  # Insert Remaining ESG Templates

  This migration adds 3 additional ESG report templates:
  - Financial Services (SASB & TCFD)
  - Retail & Consumer Goods (GRI)
  - Energy & Utilities (TCFD & CDP)
*/

-- Insert Financial Services Template
INSERT INTO esg_templates (
  slug,
  title,
  description,
  featured_image,
  industries,
  frameworks,
  jurisdictions,
  category,
  content,
  is_published,
  meta_description,
  meta_keywords
)
VALUES (
  'financial-services-sasb-tcfd-template',
  'Financial Services ESG Report Template - SASB & TCFD',
  'Comprehensive ESG template for banks, investment firms, and financial institutions following SASB standards and TCFD climate disclosure recommendations.',
  '/esgreport logo-light-back.png',
  ARRAY['Financial Services', 'Banking', 'Asset Management', 'Insurance'],
  ARRAY['SASB', 'TCFD', 'GRI'],
  ARRAY['USA', 'Global'],
  'Financial Services',
  '<div class="max-w-4xl mx-auto px-6 py-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Financial Services Sustainability Report</h1>
    <p class="text-lg text-gray-600 mb-6">SASB & TCFD Framework</p>
    
    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
      <p class="text-gray-700 leading-relaxed">
        This sustainability report addresses the material ESG issues identified by the Sustainability Accounting Standards Board (SASB) for the financial services sector, along with climate-related financial disclosures recommended by the Task Force on Climate-related Financial Disclosures (TCFD).
      </p>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">1. Responsible Financing & Investment (SASB)</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">ESG Integration in Investment Decisions</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Assets Under Management with ESG Integration:</strong> $[X] ([X]% of total AUM)</li>
            <li><strong>ESG Screening:</strong> [X]% of portfolio screened for ESG risks</li>
            <li><strong>Impact Investments:</strong> $[X] in impact/sustainable investments</li>
            <li><strong>Climate Solutions Financing:</strong> $[X] committed</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Financed Emissions</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Scope 3 Category 15:</strong> [X] MtCO2e financed emissions</li>
            <li><strong>Carbon Intensity of Portfolio:</strong> [X] tCO2e per $M invested</li>
            <li><strong>High-Carbon Sector Exposure:</strong> [X]% of portfolio</li>
            <li><strong>Net-Zero Commitment:</strong> [Target year and interim milestones]</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Client Engagement on ESG</h3>
          <p class="leading-relaxed">
            We actively engage portfolio companies and borrowers on ESG performance through [X] engagement meetings, [X] shareholder proposals supported, and integration of ESG covenants in lending agreements.
          </p>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">2. Financial Inclusion & Community Development</h2>
      <div class="space-y-6 text-gray-700">
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Community Development Lending:</strong> $[X]</li>
          <li><strong>Underserved Community Branches:</strong> [X] branches in low-income areas</li>
          <li><strong>Affordable Housing Finance:</strong> $[X]</li>
          <li><strong>Small Business Lending:</strong> $[X] to minority-owned businesses</li>
          <li><strong>Financial Literacy Programs:</strong> [X] participants reached</li>
        </ul>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">3. Climate Risk Management (TCFD)</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Governance</h3>
          <p class="leading-relaxed">
            Our Board Risk Committee oversees climate-related risks quarterly. Chief Risk Officer integrates climate risk into enterprise risk management framework.
          </p>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Strategy & Scenario Analysis</h3>
          <p class="leading-relaxed mb-4">
            We conducted climate scenario analysis across our loan and investment portfolios, evaluating impacts under 1.5°C, 2°C, and >3°C warming scenarios through 2050.
          </p>
          <div class="bg-blue-50 p-6 rounded-lg">
            <h4 class="text-lg font-bold text-gray-900 mb-3">Key Findings</h4>
            <ul class="list-disc list-inside space-y-2">
              <li><strong>Highest Risk Sectors:</strong> [Sectors with material climate transition/physical risks]</li>
              <li><strong>Portfolio Exposure:</strong> [X]% of assets in high climate risk sectors</li>
              <li><strong>Expected Credit Losses:</strong> [Range] under different scenarios</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Risk Management</h3>
          <p class="leading-relaxed">
            Climate risk assessment integrated into credit underwriting for corporate/commercial lending. ESG risk scores incorporated into investment research. Stress testing includes climate scenarios.
          </p>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">4. Operational Sustainability</h2>
      <div class="space-y-6 text-gray-700">
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Own Operations Emissions:</strong> [X] tCO2e (Scope 1+2)</li>
          <li><strong>Renewable Energy:</strong> [X]% of electricity</li>
          <li><strong>Green Buildings:</strong> [X]% of office space LEED/equivalent certified</li>
          <li><strong>Sustainable Procurement:</strong> [X]% suppliers with ESG assessments</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 class="text-3xl font-bold text-gray-900 mb-6">5. Workforce & Diversity</h2>
      <div class="space-y-6 text-gray-700">
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Women in Workforce:</strong> [X]%</li>
          <li><strong>Women in Senior Management:</strong> [X]%</li>
          <li><strong>Racial/Ethnic Diversity:</strong> [X]% underrepresented groups</li>
          <li><strong>Pay Equity:</strong> [Median gender pay gap]</li>
          <li><strong>Employee Engagement Score:</strong> [X]%</li>
        </ul>
      </div>
    </section>
  </div>',
  true,
  'Financial services ESG template aligned with SASB standards and TCFD framework. Covers responsible financing, financed emissions, climate risk management, and financial inclusion.',
  ARRAY['SASB', 'TCFD', 'financial services', 'responsible investment', 'financed emissions', 'climate risk']
);

-- Insert Retail Template
INSERT INTO esg_templates (
  slug,
  title,
  description,
  featured_image,
  industries,
  frameworks,
  jurisdictions,
  category,
  content,
  is_published,
  meta_description,
  meta_keywords
)
VALUES (
  'retail-consumer-goods-gri-template',
  'Retail & Consumer Goods ESG Report Template - GRI Standards',
  'GRI-aligned ESG template for retail and consumer goods companies covering supply chain sustainability, product responsibility, waste management, and customer engagement.',
  '/esgreport logo-light-back.png',
  ARRAY['Retail', 'Consumer Goods', 'E-commerce', 'Food & Beverage'],
  ARRAY['GRI', 'SASB'],
  ARRAY['Global', 'USA', 'EU'],
  'Retail',
  '<div class="max-w-4xl mx-auto px-6 py-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Retail & Consumer Goods Sustainability Report</h1>
    <p class="text-lg text-gray-600 mb-6">GRI Universal Standards Framework</p>
    
    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">1. Sustainable Supply Chain Management</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Supplier Sustainability</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Suppliers Assessed:</strong> [X] suppliers representing [X]% of procurement spend</li>
            <li><strong>Supplier Code of Conduct Adoption:</strong> [X]%</li>
            <li><strong>Sustainable Sourcing:</strong> [X]% of key materials from certified sustainable sources</li>
            <li><strong>Fair Trade/Certified Products:</strong> [X]% of applicable product lines</li>
            <li><strong>Supply Chain Traceability:</strong> [X]% of products with full traceability to origin</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Human Rights & Labor Practices</h3>
          <div class="bg-orange-50 p-6 rounded-lg">
            <ul class="list-disc list-inside space-y-2">
              <li><strong>Supply Chain Audits:</strong> [X] audits conducted</li>
              <li><strong>Living Wage Assessment:</strong> [X]% suppliers assessed for living wage compliance</li>
              <li><strong>Child Labor Risk:</strong> Zero tolerance policy, [X] suppliers in high-risk countries assessed</li>
              <li><strong>Forced Labor Due Diligence:</strong> [Description of processes]</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">2. Product Responsibility & Circular Economy</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Sustainable Products</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Sustainable Product Lines:</strong> [X]% of total revenue from sustainable products</li>
            <li><strong>Recycled Content:</strong> [X]% average recycled content in products</li>
            <li><strong>Product Lifespan:</strong> [Initiatives to extend product durability]</li>
            <li><strong>Product Take-Back Programs:</strong> [X] tons collected and recycled</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Packaging & Waste Reduction</h3>
          <div class="bg-green-50 p-6 rounded-lg">
            <ul class="list-disc list-inside space-y-2">
              <li><strong>Packaging Material Reduction:</strong> [X]% reduction since baseline year</li>
              <li><strong>Recyclable Packaging:</strong> [X]% of packaging recyclable/compostable</li>
              <li><strong>Plastic Reduction:</strong> [X] tons plastic eliminated</li>
              <li><strong>Reusable Packaging Systems:</strong> [Description and scale]</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Product Safety & Quality</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Product Recalls:</strong> [Number] incidents affecting [X] products</li>
            <li><strong>Quality Certifications:</strong> [List relevant certifications]</li>
            <li><strong>Customer Complaints:</strong> [X] per 10,000 products sold</li>
            <li><strong>Product Testing:</strong> [Description of safety testing protocols]</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">3. Retail Operations & Environmental Impact</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Store Energy & Emissions</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Store Energy Consumption:</strong> [X] kWh per sq ft</li>
            <li><strong>Renewable Energy:</strong> [X]% of stores powered by renewables</li>
            <li><strong>Scope 1+2 Emissions:</strong> [X] tCO2e</li>
            <li><strong>Scope 3 Emissions:</strong> [X] tCO2e (including logistics, products)</li>
            <li><strong>LED Lighting:</strong> [X]% of stores with LED</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Logistics & Transportation</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Fleet Efficiency:</strong> [X] MPG average, [X]% alternative fuel vehicles</li>
            <li><strong>Last-Mile Delivery:</strong> [X]% electric/low-emission vehicles</li>
            <li><strong>Logistics Emissions:</strong> [X] tCO2e</li>
            <li><strong>Route Optimization:</strong> [X]% reduction in miles driven</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Waste Management</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Operational Waste Generated:</strong> [X] tons</li>
            <li><strong>Waste Diversion Rate:</strong> [X]% diverted from landfill</li>
            <li><strong>Food Waste (if applicable):</strong> [X] tons, [X]% donated/composted</li>
            <li><strong>Zero Waste Stores:</strong> [Number] locations achieving zero waste</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">4. Customer Engagement & Transparency</h2>
      <div class="space-y-6 text-gray-700">
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Product Sustainability Information:</strong> [X]% products with sustainability labels</li>
          <li><strong>Customer Education:</strong> [Programs and reach]</li>
          <li><strong>Sustainable Product Sales:</strong> [X]% year-over-year growth</li>
          <li><strong>Customer Data Privacy:</strong> [X] data breaches, [X] customers affected</li>
          <li><strong>Responsible Marketing:</strong> [Policies and compliance]</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 class="text-3xl font-bold text-gray-900 mb-6">5. Community & Workforce</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Workforce</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Total Employees:</strong> [X] ([X]% full-time, [X]% part-time)</li>
            <li><strong>Living Wage:</strong> [X]% employees earning living wage or above</li>
            <li><strong>Training Hours:</strong> [X] hours per employee</li>
            <li><strong>Diversity:</strong> [X]% women, [X]% underrepresented groups</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Community Investment</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Community Giving:</strong> $[X] or [X]% of pre-tax profit</li>
            <li><strong>Local Sourcing:</strong> [X]% of products sourced locally where available</li>
            <li><strong>Volunteer Hours:</strong> [X] hours contributed by employees</li>
          </ul>
        </div>
      </div>
    </section>
  </div>',
  true,
  'Retail and consumer goods ESG template following GRI standards. Covers sustainable supply chains, product responsibility, circular economy, waste reduction, and customer engagement.',
  ARRAY['GRI', 'retail', 'consumer goods', 'supply chain', 'circular economy', 'sustainable products']
);

-- Insert Energy & Utilities Template
INSERT INTO esg_templates (
  slug,
  title,
  description,
  featured_image,
  industries,
  frameworks,
  jurisdictions,
  category,
  content,
  is_published,
  meta_description,
  meta_keywords
)
VALUES (
  'energy-utilities-tcfd-cdp-template',
  'Energy & Utilities ESG Report Template - TCFD & CDP',
  'Climate-focused ESG template for energy and utilities sector aligned with TCFD recommendations and CDP disclosure requirements. Covers emissions, renewable transition, and grid resilience.',
  '/esgReport-traffic lights-bars.png',
  ARRAY['Energy', 'Utilities', 'Renewable Energy', 'Oil & Gas'],
  ARRAY['TCFD', 'CDP', 'GRI', 'SASB'],
  ARRAY['Global', 'USA', 'EU', 'UK'],
  'Energy',
  '<div class="max-w-4xl mx-auto px-6 py-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Energy & Utilities Sustainability Report</h1>
    <p class="text-lg text-gray-600 mb-6">TCFD & CDP Framework</p>
    
    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">1. Energy Transition Strategy</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Generation Portfolio</h3>
          <div class="bg-blue-50 p-6 rounded-lg">
            <table class="w-full text-sm">
              <thead class="bg-blue-100">
                <tr>
                  <th class="text-left p-2">Source</th>
                  <th class="text-right p-2">Capacity (MW)</th>
                  <th class="text-right p-2">% of Total</th>
                  <th class="text-right p-2">Generation (GWh)</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-blue-200">
                  <td class="p-2">Coal</td>
                  <td class="text-right p-2">[X]</td>
                  <td class="text-right p-2">[X]%</td>
                  <td class="text-right p-2">[X]</td>
                </tr>
                <tr class="border-t border-blue-200">
                  <td class="p-2">Natural Gas</td>
                  <td class="text-right p-2">[X]</td>
                  <td class="text-right p-2">[X]%</td>
                  <td class="text-right p-2">[X]</td>
                </tr>
                <tr class="border-t border-blue-200">
                  <td class="p-2">Nuclear</td>
                  <td class="text-right p-2">[X]</td>
                  <td class="text-right p-2">[X]%</td>
                  <td class="text-right p-2">[X]</td>
                </tr>
                <tr class="border-t border-blue-200">
                  <td class="p-2">Solar</td>
                  <td class="text-right p-2">[X]</td>
                  <td class="text-right p-2">[X]%</td>
                  <td class="text-right p-2">[X]</td>
                </tr>
                <tr class="border-t border-blue-200">
                  <td class="p-2">Wind</td>
                  <td class="text-right p-2">[X]</td>
                  <td class="text-right p-2">[X]%</td>
                  <td class="text-right p-2">[X]</td>
                </tr>
                <tr class="border-t border-blue-200">
                  <td class="p-2">Hydro</td>
                  <td class="text-right p-2">[X]</td>
                  <td class="text-right p-2">[X]%</td>
                  <td class="text-right p-2">[X]</td>
                </tr>
                <tr class="border-t-2 border-blue-300 font-bold">
                  <td class="p-2">Total</td>
                  <td class="text-right p-2">[X]</td>
                  <td class="text-right p-2">100%</td>
                  <td class="text-right p-2">[X]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Transition Targets & Investments</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Renewable Energy Target:</strong> [X]% of generation by [Year]</li>
            <li><strong>Coal Phase-Out:</strong> Complete by [Year]</li>
            <li><strong>Renewable CapEx:</strong> $[X] committed over next [X] years</li>
            <li><strong>Energy Storage:</strong> [X] MWh capacity planned by [Year]</li>
            <li><strong>Green Hydrogen:</strong> [X] MW electrolyzer capacity by [Year]</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">2. Greenhouse Gas Emissions (CDP Format)</h2>
      <div class="space-y-6 text-gray-700">
        <div class="bg-green-50 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Direct Emissions (Scope 1)</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Total Scope 1:</strong> [X] MtCO2e</li>
            <li><strong>Power Generation:</strong> [X] MtCO2e</li>
            <li><strong>Fugitive Emissions:</strong> [X] MtCO2e</li>
            <li><strong>Fleet & Facilities:</strong> [X] MtCO2e</li>
            <li><strong>Emission Intensity:</strong> [X] kgCO2e per MWh</li>
          </ul>
        </div>

        <div class="bg-green-50 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Indirect Emissions (Scope 2 & 3)</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Scope 2 (Purchased Energy):</strong> [X] ktCO2e</li>
            <li><strong>Scope 3 (Fuel Extraction & Transport):</strong> [X] MtCO2e</li>
            <li><strong>Scope 3 (Product Use):</strong> [X] MtCO2e (if applicable for oil & gas)</li>
            <li><strong>Scope 3 (Capital Goods):</strong> [X] ktCO2e</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Emissions Reduction Targets</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Near-Term Target:</strong> [X]% reduction by [Year] (baseline [Year])</li>
            <li><strong>Long-Term Target:</strong> [X]% reduction by [Year]</li>
            <li><strong>Net Zero Commitment:</strong> [Year]</li>
            <li><strong>Science-Based Target:</strong> [Committed/Approved/Validated]</li>
            <li><strong>Carbon Pricing:</strong> Internal price $[X] per tCO2e</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">3. Climate Risk & Resilience (TCFD)</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Physical Climate Risks</h3>
          <div class="bg-orange-50 p-6 rounded-lg">
            <ul class="list-disc list-inside space-y-2">
              <li><strong>Extreme Weather:</strong> [X]% of generation assets in high physical risk areas</li>
              <li><strong>Water Stress:</strong> [X]% of thermal generation in water-stressed regions</li>
              <li><strong>Sea Level Rise:</strong> [X] coastal facilities at risk</li>
              <li><strong>Wildfire Risk:</strong> [X] km of transmission lines in high fire risk zones</li>
              <li><strong>Grid Resilience Investments:</strong> $[X] in hardening and adaptive infrastructure</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Transition Risks & Opportunities</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Policy Risk:</strong> Exposure to carbon pricing, renewable mandates</li>
            <li><strong>Technology Risk:</strong> Stranded asset risk for [X] GW fossil fuel capacity</li>
            <li><strong>Market Opportunities:</strong> Growing demand for renewable energy, EV charging infrastructure</li>
            <li><strong>Scenario Analysis:</strong> Conducted under IEA Net Zero, Stated Policies, Delayed Transition scenarios</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">4. Grid Reliability & Customer Service</h2>
      <div class="space-y-6 text-gray-700">
        <ul class="list-disc list-inside space-y-2">
          <li><strong>System Average Interruption Duration Index (SAIDI):</strong> [X] minutes</li>
          <li><strong>System Average Interruption Frequency Index (SAIFI):</strong> [X] interruptions</li>
          <li><strong>Grid Modernization Investment:</strong> $[X] in smart grid technology</li>
          <li><strong>Energy Storage Deployed:</strong> [X] MWh</li>
          <li><strong>Distributed Energy Resources:</strong> [X] MW customer solar/storage connected</li>
        </ul>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">5. Environmental Performance</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Water Management</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Water Withdrawal:</strong> [X] million cubic meters</li>
            <li><strong>Water Consumption:</strong> [X] million cubic meters</li>
            <li><strong>Water Intensity:</strong> [X] m³ per MWh</li>
            <li><strong>Cooling Water Discharge:</strong> [Temperature and volume]</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Waste & Materials</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Coal Ash Generated:</strong> [X] tons ([X]% beneficially used)</li>
            <li><strong>Hazardous Waste:</strong> [X] tons</li>
            <li><strong>Non-Hazardous Waste:</strong> [X] tons</li>
            <li><strong>SF6 Emissions:</strong> [X] kg (from switchgear)</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Biodiversity</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Facilities in Protected Areas:</strong> [Number and description]</li>
            <li><strong>Land Conservation:</strong> [X] hectares under conservation management</li>
            <li><strong>Bird/Wildlife Protection:</strong> [Programs at wind/transmission facilities]</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-3xl font-bold text-gray-900 mb-6">6. Social Performance</h2>
      <div class="space-y-6 text-gray-700">
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Workforce Safety</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Total Recordable Incident Rate:</strong> [X] per 200,000 hours</li>
            <li><strong>Lost Time Injury Frequency:</strong> [X]</li>
            <li><strong>Fatalities:</strong> [Number] employees, [Number] contractors</li>
            <li><strong>Safety Training:</strong> [X] hours per employee</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Energy Affordability & Access</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Average Residential Rate:</strong> $[X] per kWh</li>
            <li><strong>Customer Assistance Programs:</strong> [X] customers served, $[X] support provided</li>
            <li><strong>Disconnections:</strong> [X] customers ([policies and protections])</li>
            <li><strong>Energy Efficiency Programs:</strong> [X] GWh saved, [X] customers participating</li>
          </ul>
        </div>

        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Just Transition</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>Workforce Transition Support:</strong> [Programs for workers affected by fossil fuel phase-out]</li>
            <li><strong>Community Economic Development:</strong> [Support for fossil fuel-dependent communities]</li>
            <li><strong>Reskilling Investment:</strong> $[X] in employee training for clean energy jobs</li>
          </ul>
        </div>
      </div>
    </section>
  </div>',
  true,
  'Energy and utilities ESG template aligned with TCFD and CDP frameworks. Covers energy transition, emissions, climate risks, grid reliability, and environmental performance.',
  ARRAY['TCFD', 'CDP', 'energy', 'utilities', 'renewable energy', 'emissions', 'climate risk', 'grid resilience']
);
