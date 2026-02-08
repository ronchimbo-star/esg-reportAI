import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.24.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CompanyInfo {
  name: string;
  website: string;
  industries: string[];
  jurisdictions: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface ESGData {
  environmental: string;
  social: string;
  governance: string;
}

interface ReportRequest {
  companyInfo: CompanyInfo;
  esgData: ESGData;
  selectedFrameworks: string[];
}

function buildPrompt(formData: ReportRequest): string {
  const { companyInfo, esgData, selectedFrameworks } = formData;
  const frameworksList = selectedFrameworks.join(', ');
  const currentYear = new Date().getFullYear();

  return `You are an expert ESG (Environmental, Social, and Governance) reporting consultant. Generate a comprehensive, professional ESG report for the following company.

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

[Write 2-3 paragraphs introducing the company, its ESG commitment, and the purpose of this report. Mention the company's operations in ${companyInfo.industries.join(', ')} across ${companyInfo.jurisdictions.join(', ')} and reference the frameworks: ${frameworksList}]

## Executive Summary

[Provide a comprehensive 3-4 paragraph overview covering key ESG performance highlights, achievements, significant metrics, and strategic priorities]

## Company Overview

[Include business activities, geographic footprint, key stakeholders, and ESG governance structure]

## Environmental Performance

### Climate & Emissions
[Analyze emissions data, carbon intensity, trends, and climate-related risks]

### Energy Management
[Cover energy consumption, renewable energy usage, efficiency initiatives, and targets]

### Water Stewardship
[Discuss water consumption, conservation, recycling, and impact on water-stressed regions]

### Waste Management & Circular Economy
[Detail waste generation, recycling rates, circular economy programs, and hazardous waste management]

### Environmental Certifications & Compliance
[Note certifications, audits, violations, or fines]

## Social Performance

### Labor Practices & Human Rights
[Analyze workforce data, working conditions, employee rights, and labor relations]

### Diversity, Equity & Inclusion
[Cover diversity metrics, pay equity, representation, and inclusion initiatives]

### Health & Safety
[Detail safety performance, injury rates, training programs, and wellness initiatives]

### Community Impact
[Discuss local community engagement, social investment, and community development programs]

### Supply Chain Responsibility
[Analyze supplier standards, audits, and ethical sourcing]

## Governance Performance

### Board Composition & Leadership
[Analyze board diversity, independence, expertise, and structure]

### Ethics & Compliance
[Detail code of conduct, ethics training, whistleblower mechanisms, and compliance programs]

### Risk Management
[Discuss ESG risk identification, assessment, mitigation strategies, and crisis management]

### Stakeholder Engagement
[Cover engagement approaches, materiality assessment, and responsiveness]

### Transparency & Reporting
[Detail reporting practices, assurance, and disclosure quality]

## Framework-Specific Disclosures

[For each framework in ${frameworksList}, provide specific disclosures, metrics, and alignment details]

## Key Performance Indicators (KPIs)

[Present material ESG KPIs in a structured format with historical comparisons]

## Goals & Targets

[Detail short-term and long-term ESG goals with timelines and accountability]

## Materiality Assessment

[Explain the company's material ESG topics and stakeholder priorities]

## Third-Party Verification

[Note any third-party assurance, certifications, or audits]

## Recommendations

[Provide 8-10 specific, actionable recommendations for improving ESG performance]

## Conclusion

[Summarize the overall assessment, key achievements, areas for improvement, and next steps]

IMPORTANT REQUIREMENTS:
1. Use all provided data from the environmental, social, and governance sections
2. Make specific references to the frameworks: ${frameworksList}
3. Include industry-specific metrics for ${companyInfo.industries.join(', ')}
4. Address jurisdiction-specific requirements for ${companyInfo.jurisdictions.join(', ')}
5. Use professional language and maintain objectivity
6. Provide quantitative metrics where possible
7. Include specific timeframes for recommendations
8. Highlight both achievements and areas needing improvement
9. Make this comprehensive (aim for 3000-4000 words minimum)
10. Ensure the report flows logically and tells a coherent story

Generate the complete report now:`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured on server" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const formData: ReportRequest = await req.json();

    // Validate required fields
    if (!formData.companyInfo?.name || !formData.companyInfo?.contactName || !formData.companyInfo?.contactEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required company information" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
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

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);

    let errorMessage = "Failed to generate report";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("400")) {
        errorMessage = "Bad request to Gemini API. Please check your input data.";
        statusCode = 400;
      } else if (error.message.includes("403") || error.message.includes("API_KEY_INVALID")) {
        errorMessage = "Invalid Gemini API key configured on server.";
        statusCode = 500;
      } else if (error.message.includes("429")) {
        errorMessage = "Rate limit exceeded. Please try again later.";
        statusCode = 429;
      }
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: statusCode,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
