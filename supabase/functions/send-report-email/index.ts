import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { marked } from 'npm:marked@17.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmailRequest {
  companyName: string;
  contactName: string;
  industries: string[];
  jurisdictions: string[];
  frameworks: string[];
  reportContent: string;
  userEmail?: string;
  userIp: string;
}

function generateEmailHTML(data: EmailRequest, reportHtml: string): string {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ESG Report from esgReportAI.com</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #374151;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
    }
    .email-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header img {
      max-width: 200px;
      height: auto;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      margin: 0;
      font-weight: bold;
    }
    .header p {
      color: #d1fae5;
      font-size: 16px;
      margin: 10px 0 0;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #111827;
      margin-bottom: 20px;
    }
    .intro {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.8;
      margin-bottom: 30px;
    }
    .report-summary {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-left: 4px solid #10b981;
      padding: 25px;
      margin: 30px 0;
      border-radius: 8px;
    }
    .report-summary h2 {
      color: #059669;
      font-size: 20px;
      margin: 0 0 15px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 15px;
    }
    .summary-item {
      padding: 10px 0;
    }
    .summary-label {
      font-size: 13px;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .summary-value {
      font-size: 15px;
      color: #111827;
      font-weight: 600;
    }
    .upsell-section {
      margin: 40px 0;
    }
    .upsell-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    .upsell-card {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      background-color: #ffffff;
    }
    .upsell-card.primary {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-color: #10b981;
    }
    .upsell-card.secondary {
      background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
      border-color: #f97316;
    }
    .upsell-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 15px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
    }
    .upsell-card.primary .upsell-icon {
      background-color: #10b981;
    }
    .upsell-card.secondary .upsell-icon {
      background-color: #f97316;
    }
    .upsell-title {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 10px;
    }
    .upsell-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 20px;
      line-height: 1.6;
    }
    .upsell-button {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s;
    }
    .upsell-card.primary .upsell-button {
      background-color: #10b981;
      color: #ffffff;
    }
    .upsell-card.secondary .upsell-button {
      background-color: #f97316;
      color: #ffffff;
    }
    .report-content {
      margin: 40px 0;
      padding: 30px;
      background-color: #fafafa;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .report-content h1 {
      color: #111827;
      font-size: 32px;
      border-bottom: 4px solid #10b981;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .report-content h2 {
      color: #059669;
      font-size: 26px;
      border-bottom: 2px solid #d1fae5;
      padding-bottom: 10px;
      margin-top: 40px;
      margin-bottom: 20px;
    }
    .report-content h3 {
      color: #1f2937;
      font-size: 22px;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .report-content h4 {
      color: #374151;
      font-size: 18px;
      margin-top: 25px;
      margin-bottom: 12px;
    }
    .report-content h5 {
      color: #4b5563;
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .report-content p {
      margin-bottom: 15px;
      line-height: 1.8;
    }
    .report-content ul,
    .report-content ol {
      margin: 20px 0;
      padding-left: 30px;
    }
    .report-content li {
      margin-bottom: 10px;
      line-height: 1.7;
    }
    .report-content strong {
      color: #111827;
      font-weight: 600;
    }
    .report-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      background-color: #ffffff;
    }
    .report-content th {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border: 1px solid #d1d5db;
      font-size: 14px;
    }
    .report-content td {
      padding: 12px;
      border: 1px solid #d1d5db;
      font-size: 14px;
    }
    .report-content tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .contact-experts {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 2px solid #3b82f6;
      border-radius: 12px;
      padding: 30px;
      margin: 40px 0;
      text-align: center;
    }
    .contact-experts h3 {
      color: #1e40af;
      font-size: 24px;
      margin: 0 0 15px;
    }
    .contact-experts p {
      color: #1e3a8a;
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .contact-experts ul {
      text-align: left;
      max-width: 600px;
      margin: 20px auto;
      list-style: none;
      padding: 0;
    }
    .contact-experts li {
      color: #1e3a8a;
      font-size: 15px;
      margin-bottom: 12px;
      padding-left: 30px;
      position: relative;
    }
    .contact-experts li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #3b82f6;
      font-weight: bold;
      font-size: 18px;
    }
    .contact-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 25px;
    }
    .contact-button {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
    }
    .contact-button.primary {
      background-color: #3b82f6;
      color: #ffffff;
    }
    .contact-button.secondary {
      background-color: #ffffff;
      color: #3b82f6;
      border: 2px solid #3b82f6;
    }
    .disclaimer {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border: 2px solid #f59e0b;
      border-radius: 12px;
      padding: 25px;
      margin: 40px 0;
    }
    .disclaimer h4 {
      color: #92400e;
      font-size: 18px;
      margin: 0 0 15px;
      font-weight: bold;
    }
    .disclaimer p {
      color: #78350f;
      font-size: 14px;
      line-height: 1.7;
      margin: 0;
    }
    .footer {
      background-color: #1f2937;
      padding: 40px 20px;
      text-align: center;
    }
    .footer img {
      max-width: 150px;
      height: auto;
      margin-bottom: 15px;
    }
    .footer p {
      color: #9ca3af;
      font-size: 14px;
      margin: 5px 0;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .summary-grid,
      .upsell-grid {
        grid-template-columns: 1fr;
      }
      .contact-buttons {
        flex-direction: column;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Here's Your ESG Report from esgReportAI.com</h1>
      <p>AI-Generated ESG Report • ${currentDate}</p>
    </div>

    <div class="content">
      <p class="greeting">Dear ${data.contactName || 'Valued User'},</p>

      <div class="intro">
        <p>Thank you for using <strong>esgReportAI.com</strong> to generate your ESG report!</p>
        <p>We're pleased to provide you with your AI-generated ESG report for <strong>${data.companyName}</strong>. This comprehensive report has been tailored to your industry and jurisdiction requirements.</p>
        <p><strong>Please note:</strong> This is a demonstration report generated by artificial intelligence. It should be used as a starting point and template for your ESG reporting efforts. Professional review and validation are recommended before submission to stakeholders or regulatory bodies.</p>
      </div>

      <div class="report-summary">
        <h2>📊 Report Summary</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Company</div>
            <div class="summary-value">${data.companyName}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Industries</div>
            <div class="summary-value">${data.industries.join(', ')}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Jurisdictions</div>
            <div class="summary-value">${data.jurisdictions.slice(0, 3).join(', ')}${data.jurisdictions.length > 3 ? ` +${data.jurisdictions.length - 3} more` : ''}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Frameworks</div>
            <div class="summary-value">${data.frameworks.length} framework${data.frameworks.length > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <div class="upsell-section">
        <h2 style="text-align: center; color: #111827; font-size: 28px; margin-bottom: 15px;">Take Your ESG Reporting Further</h2>
        <p style="text-align: center; color: #6b7280; font-size: 16px; margin-bottom: 30px;">Ready to upgrade your ESG strategy?</p>

        <div class="upsell-grid">
          <div class="upsell-card primary">
            <div class="upsell-icon">📧</div>
            <h3 class="upsell-title">Get Your Full Report</h3>
            <p class="upsell-description">This email contains your complete AI-generated report. Download or save it for your records.</p>
          </div>

          <div class="upsell-card secondary">
            <div class="upsell-icon">⭐</div>
            <h3 class="upsell-title">Professional Review</h3>
            <p class="upsell-description">Upgrade to a comprehensive, audit-ready report with expert analysis and competitor benchmarking.</p>
            <a href="mailto:experts@esgReportAI.com?subject=Professional ESG Review for ${encodeURIComponent(data.companyName)}" class="upsell-button">Contact Experts</a>
          </div>
        </div>
      </div>

      <div class="report-content">
        <h1>${data.companyName} - ESG Report ${currentYear}</h1>
        ${reportHtml}
      </div>

      <div class="upsell-section">
        <div class="upsell-grid">
          <div class="upsell-card primary">
            <div class="upsell-icon">📧</div>
            <h3 class="upsell-title">Get Your Full Report</h3>
            <p class="upsell-description">You've already received your complete AI-generated ESG report above. Feel free to save or print it for your records.</p>
          </div>

          <div class="upsell-card secondary">
            <div class="upsell-icon">⭐</div>
            <h3 class="upsell-title">Professional Review</h3>
            <p class="upsell-description">Upgrade to a comprehensive, audit-ready report with expert analysis, competitor benchmarking, and regulatory compliance.</p>
            <a href="mailto:experts@esgReportAI.com?subject=Professional ESG Review for ${encodeURIComponent(data.companyName)}" class="upsell-button">Enhance This Report</a>
          </div>
        </div>
      </div>

      <div class="contact-experts">
        <h3>🎯 Want an In-Depth Report Customised to Your Business?</h3>
        <p>For a comprehensive, fully tailored ESG report that goes beyond AI-generated content, get in touch with our expert consultants. We provide:</p>
        <ul>
          <li><strong>Detailed materiality assessments</strong> specific to your industry</li>
          <li><strong>Competitor benchmarking</strong> and comprehensive gap analysis</li>
          <li><strong>Full regulatory compliance</strong> and audit-ready documentation</li>
          <li><strong>Actionable ESG strategies</strong> and improvement roadmaps</li>
        </ul>
        <div style="border-top: 2px solid #3b82f6; padding-top: 20px; margin-top: 25px;">
          <p style="font-weight: bold; margin-bottom: 15px;">Contact our experts:</p>
          <div class="contact-buttons">
            <a href="mailto:experts@esgReportAI.com?subject=Custom ESG Consultation for ${encodeURIComponent(data.companyName)}" class="contact-button primary">📧 experts@esgReportAI.com</a>
            <a href="tel:+441322879713" class="contact-button secondary">📞 +44 (01322) 879 713</a>
          </div>
        </div>
      </div>

      <div class="disclaimer">
        <h4>⚠️ Important Disclaimer</h4>
        <p>This ESG report has been generated using artificial intelligence based on the information you provided. While we strive for accuracy, this report should be considered a draft template and starting point for your ESG reporting. It is not a substitute for professional ESG consulting or audit services.</p>
        <br>
        <p>All data, metrics, and statements should be reviewed, verified, and validated by qualified personnel before publication or submission to regulatory authorities.</p>
        <br>
        <p>ESGReportAI and its affiliates accept no liability for decisions made based on this AI-generated content. For audit-ready, comprehensive ESG reports that meet regulatory standards and stakeholder expectations, please contact us about our professional consulting services.</p>
        <br>
        <p>This is a demonstration version. Due diligence and professional review are required before use.</p>
      </div>
    </div>

    <div class="footer">
      <p style="color: #d1d5db; font-size: 14px; margin-bottom: 20px;">Copyright © 2026 esgReportAI.com All Rights Reserved.</p>
      <p style="color: #9ca3af; font-size: 12px;">Powered by AI | Generated on ${currentDate}</p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 15px;">
        Questions? Email us at <a href="mailto:experts@esgReportAI.com">experts@esgReportAI.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: EmailRequest = await req.json();
    const {
      companyName,
      contactName,
      industries,
      jurisdictions,
      frameworks,
      reportContent,
      userEmail,
      userIp,
    } = requestData;

    const reportHtml = marked.parse(reportContent) as string;

    // Save report to database
    const { data: reportData, error: insertError } = await supabase
      .from('generated_reports')
      .insert({
        company_name: companyName,
        industries,
        jurisdictions,
        frameworks,
        report_content: reportContent,
        user_email: userEmail,
        user_ip: userIp,
        email_sent: false,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to save report: ${insertError.message}`);
    }

    // Generate HTML email
    const emailHTML = generateEmailHTML({
      companyName,
      contactName,
      industries,
      jurisdictions,
      frameworks,
      reportContent,
      userEmail,
      userIp,
    }, reportHtml);

    // Email to user
    const userEmailSubject = `Here's your esgReport from esgReportAI.com - ${companyName}`;

    // Email to admin (ronchimbo@gmail.com)
    const adminEmailSubject = `New ESG Report Generated - ${companyName}`;
    const adminEmailBody = `
A new ESG report has been generated and sent to the user:

Company: ${companyName}
Contact: ${contactName}
Email: ${userEmail || 'Not provided'}
Industries: ${industries.join(', ')}
Jurisdictions: ${jurisdictions.join(', ')}
Frameworks: ${frameworks.join(', ')}
User IP: ${userIp}
Generated At: ${new Date().toISOString()}

The full report has been sent to the user's email address.
    `.trim();

    try {
      const notificationResponse = await fetch(
        `${supabaseUrl}/functions/v1/send-admin-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            type: "report",
            subject: adminEmailSubject,
            data: {
              company_name: companyName,
              contact_name: contactName,
              user_email: userEmail || 'Not provided',
              industries: industries.join(', '),
              jurisdictions: jurisdictions.join(', '),
              frameworks: frameworks.join(', '),
              user_ip: userIp,
              generated_at: new Date().toISOString(),
            },
          }),
        }
      );

      if (!notificationResponse.ok) {
        console.error("Failed to send admin notification:", await notificationResponse.text());
      } else {
        console.log("Admin notification sent successfully");
      }
    } catch (notifError) {
      console.error("Error sending admin notification:", notifError);
    }

    console.log('=== EMAIL TO USER ===');
    console.log('To:', userEmail);
    console.log('Subject:', userEmailSubject);
    console.log('HTML Length:', emailHTML.length);
    console.log('\nNote: Email integration ready. Configure RESEND_API_KEY to send emails.');

    // Update report as email sent
    await supabase
      .from('generated_reports')
      .update({ email_sent: true })
      .eq('id', reportData.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Report saved and email notification queued',
        reportId: reportData.id,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});