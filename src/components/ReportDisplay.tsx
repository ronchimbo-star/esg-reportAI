import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import { Download, Mail, Sparkles, Loader2, Phone } from 'lucide-react';
import ProfessionalServicesModal from './ProfessionalServicesModal';

interface ReportDisplayProps {
  reportMarkdown: string;
  isGenerating: boolean;
  onEmailReport: () => void;
  onEnhanceReport: () => void;
  companyName?: string;
  industries?: string[];
  jurisdictions?: string[];
  frameworks?: string[];
}

export default function ReportDisplay({
  reportMarkdown,
  isGenerating,
  onEmailReport,
  onEnhanceReport,
  companyName,
  industries,
  jurisdictions,
  frameworks
}: ReportDisplayProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [hasScrolledHalfway, setHasScrolledHalfway] = useState(false);
  const [hasShownScrollModal, setHasShownScrollModal] = useState(false);

  useEffect(() => {
    if (reportMarkdown) {
      const html = marked.parse(reportMarkdown) as string;
      setHtmlContent(html);
    }
  }, [reportMarkdown]);

  useEffect(() => {
    if (isGenerating && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isGenerating]);

  useEffect(() => {
    if (!reportMarkdown || isGenerating) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const halfwayPoint = documentHeight * 0.5;

      if (scrollPosition >= halfwayPoint && !hasScrolledHalfway) {
        setHasScrolledHalfway(true);
        if (!hasShownScrollModal) {
          setTimeout(() => {
            setShowProfessionalModal(true);
            setHasShownScrollModal(true);
          }, 500);
        }
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showProfessionalModal && hasScrolledHalfway) {
        setShowProfessionalModal(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reportMarkdown, isGenerating, hasScrolledHalfway, hasShownScrollModal, showProfessionalModal]);

  const handleDownload = () => {
    const { firstHalf: firstSection, secondHalf: secondSection } = splitContentForUpsell(htmlContent);
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const downloadContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${companyName || 'Company'} - ESG Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #374151;
      background-color: #ffffff;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 40px;
    }
    .logo-header {
      text-align: center;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 3px solid #10b981;
    }
    .logo-header img {
      height: 80px;
      margin-bottom: 20px;
    }
    .logo-header p {
      color: #6b7280;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 10px;
    }
    h1 {
      color: #111827 !important;
      font-size: 3em !important;
      font-weight: 800 !important;
      margin: 50px 0 30px 0 !important;
      padding-bottom: 20px !important;
      border-bottom: 4px solid #10b981 !important;
      line-height: 1.2 !important;
    }
    h2 {
      color: #059669 !important;
      font-size: 2.2em !important;
      font-weight: 700 !important;
      margin-top: 60px !important;
      margin-bottom: 30px !important;
      padding-bottom: 15px !important;
      border-bottom: 2px solid #d1fae5 !important;
    }
    h3 {
      color: #1f2937 !important;
      font-size: 1.8em !important;
      font-weight: 600 !important;
      margin-top: 45px !important;
      margin-bottom: 20px !important;
    }
    h4 {
      color: #374151 !important;
      font-size: 1.4em !important;
      font-weight: 600 !important;
      margin-top: 35px !important;
      margin-bottom: 15px !important;
    }
    h5 {
      color: #4b5563 !important;
      font-size: 1.2em !important;
      font-weight: 500 !important;
      margin-top: 30px !important;
      margin-bottom: 12px !important;
    }
    p {
      color: #374151;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 25px !important;
      margin-top: 0 !important;
    }
    ul, ol {
      margin: 25px 0 !important;
      padding-left: 40px !important;
    }
    li {
      color: #374151;
      font-size: 16px;
      line-height: 1.8;
      margin-bottom: 12px !important;
      padding-left: 8px !important;
    }
    .table-wrapper {
      width: 100%;
      overflow-x: auto;
      margin: 40px 0 !important;
      -webkit-overflow-scrolling: touch;
    }
    table {
      width: 100%;
      min-width: 600px;
      border-collapse: collapse;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    thead {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    }
    th {
      padding: 12px;
      text-align: left;
      font-weight: 700;
      color: #111827;
      border: 1px solid #d1d5db;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    td {
      padding: 12px;
      border: 1px solid #d1d5db;
      color: #374151;
      font-size: 14px;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    @media (max-width: 640px) {
      th {
        padding: 10px;
        font-size: 11px;
      }
      td {
        padding: 10px;
        font-size: 13px;
      }
      table {
        min-width: 500px;
      }
    }
    strong {
      color: #111827;
      font-weight: 600;
    }
    blockquote {
      border-left: 4px solid #10b981;
      padding: 20px 25px;
      margin: 35px 0 !important;
      background: #f0fdf4;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #059669;
    }
    .upsell-section {
      margin: 60px 0;
      padding: 40px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #10b981;
      border-radius: 12px;
    }
    .upsell-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin-top: 30px;
    }
    .upsell-card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .upsell-card h3 {
      color: #111827 !important;
      font-size: 1.5em !important;
      margin-top: 0 !important;
      margin-bottom: 15px !important;
      border: none !important;
      padding: 0 !important;
    }
    .upsell-card p {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 20px !important;
    }
    .contact-section {
      margin: 60px 0;
      padding: 40px;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 2px solid #3b82f6;
      border-radius: 12px;
      text-align: center;
    }
    .contact-section h3 {
      color: #1e40af !important;
      font-size: 2em !important;
      margin-top: 0 !important;
      margin-bottom: 20px !important;
      border: none !important;
      padding: 0 !important;
    }
    .contact-section ul {
      text-align: left;
      max-width: 600px;
      margin: 25px auto !important;
      list-style: none;
      padding: 0 !important;
    }
    .contact-section li {
      color: #1e3a8a;
      margin-bottom: 15px !important;
      padding-left: 30px !important;
      position: relative;
    }
    .contact-section li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #3b82f6;
      font-weight: bold;
      font-size: 18px;
    }
    .contact-info {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 2px solid #3b82f6;
      font-size: 18px;
      color: #1e40af;
      font-weight: 600;
    }
    .disclaimer {
      margin: 60px 0;
      padding: 40px;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border: 2px solid #f59e0b;
      border-radius: 12px;
    }
    .disclaimer h4 {
      color: #92400e !important;
      font-size: 1.4em !important;
      margin-top: 0 !important;
      margin-bottom: 20px !important;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .disclaimer p {
      color: #78350f;
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 15px !important;
    }
    .footer {
      margin-top: 80px;
      padding-top: 40px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    .footer img {
      height: 60px;
      margin-bottom: 15px;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0 !important;
    }
    @media print {
      .upsell-section, .contact-section { page-break-inside: avoid; }
      h1, h2, h3, h4, h5 { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-header">
      <p>AI-Generated ESG Report</p>
      <p>Generated on ${currentDate}</p>
    </div>

    ${firstSection}

    <div class="upsell-section">
      <h2 style="text-align: center; border: none !important; padding: 0 !important; margin: 0 0 15px 0 !important;">Take Your ESG Reporting Further</h2>
      <p style="text-align: center; color: #059669; font-size: 16px;">Ready to upgrade your ESG strategy?</p>
      <div class="upsell-grid">
        <div class="upsell-card">
          <h3>📧 Get Your Full Report</h3>
          <p>Receive a complete copy of your AI-generated ESG report directly in your inbox.</p>
          <p style="color: #10b981; font-weight: 600;">Email: <a href="mailto:experts@esgReportAI.com" style="color: #10b981;">experts@esgReportAI.com</a></p>
        </div>
        <div class="upsell-card">
          <h3>⭐ Professional Review</h3>
          <p>Upgrade to a comprehensive, audit-ready report with expert analysis and competitor benchmarking.</p>
          <p style="color: #f97316; font-weight: 600;">Email: <a href="mailto:experts@esgReportAI.com" style="color: #f97316;">experts@esgReportAI.com</a></p>
        </div>
      </div>
    </div>

    ${secondSection}

    <div class="contact-section">
      <h3>🎯 Want an In-Depth Report Customised to Your Business?</h3>
      <p style="color: #1e3a8a; font-size: 16px;">For a comprehensive, fully tailored ESG report that goes beyond AI-generated content, get in touch with our expert consultants. We provide:</p>
      <ul>
        <li><strong>Detailed materiality assessments</strong> specific to your industry</li>
        <li><strong>Competitor benchmarking</strong> and comprehensive gap analysis</li>
        <li><strong>Full regulatory compliance</strong> and audit-ready documentation</li>
        <li><strong>Actionable ESG strategies</strong> and improvement roadmaps</li>
      </ul>
      <div class="contact-info">
        <p style="margin-bottom: 15px !important;">Contact our experts:</p>
        <p>📧 <a href="mailto:experts@esgReportAI.com" style="color: #1e40af;">experts@esgReportAI.com</a></p>
        <p>📞 <a href="tel:+441322879713" style="color: #1e40af;">+44 (01322) 879 713</a></p>
      </div>
    </div>

    <div class="disclaimer">
      <h4>⚠️ Important Disclaimer</h4>
      <p>This ESG report has been generated using artificial intelligence based on the information you provided. While we strive for accuracy, this report should be considered a draft template and starting point for your ESG reporting. It is not a substitute for professional ESG consulting or audit services.</p>
      <p>All data, metrics, and statements should be reviewed, verified, and validated by qualified personnel before publication or submission to regulatory authorities.</p>
      <p>ESGReportAI and its affiliates accept no liability for decisions made based on this AI-generated content. For audit-ready, comprehensive ESG reports that meet regulatory standards and stakeholder expectations, please contact us about our professional consulting services.</p>
      <p>This is a demonstration version. Due diligence and professional review are required before use.</p>
    </div>

    <div class="footer">
      <p style="color: #374151; font-size: 14px; margin-bottom: 20px !important;">Copyright © 2026 esgReportAI.com All Rights Reserved.</p>
      <p style="font-size: 12px;">Powered by AI | Generated on ${currentDate}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([downloadContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${companyName || 'company'}-esg-report.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const UpsellCard = () => (
    <div className="grid md:grid-cols-2 gap-6 my-12">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div className="flex items-start gap-3 mb-4 flex-grow">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Get Your Full Report</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Receive a complete copy of your AI-generated ESG report directly in your inbox.
            </p>
          </div>
        </div>
        <button
          onClick={onEmailReport}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm mt-auto"
        >
          <Mail className="w-5 h-5" />
          Email Me My Report
        </button>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div className="flex items-start gap-3 mb-4 flex-grow">
          <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Professional Review</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Upgrade to a comprehensive, audit-ready report with expert analysis and competitor benchmarking.
            </p>
          </div>
        </div>
        <button
          onClick={onEnhanceReport}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-sm mt-auto"
        >
          <Sparkles className="w-5 h-5" />
          Enhance This Report
        </button>
      </div>
    </div>
  );

  const splitContentForUpsell = (html: string) => {
    const sections = html.split(/<h2/gi);
    if (sections.length < 3) return { firstHalf: html, secondHalf: '' };

    const midPoint = Math.floor(sections.length / 2);
    const firstHalf = sections.slice(0, midPoint).join('<h2') + (sections[midPoint] ? '<h2' + sections[midPoint] : '');
    const secondHalf = sections.slice(midPoint + 1).map(s => '<h2' + s).join('');

    return { firstHalf, secondHalf };
  };

  const { firstHalf, secondHalf } = splitContentForUpsell(htmlContent);

  if (!isGenerating && !reportMarkdown) {
    return null;
  }

  return (
    <>
      <ProfessionalServicesModal
        isOpen={showProfessionalModal}
        onClose={() => setShowProfessionalModal(false)}
      />
      <div ref={reportRef} className="space-y-6 mt-8">
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your ESG Report</h2>
            <p className="text-gray-600 mt-1">
              {isGenerating ? 'Generating your report...' : 'Report generated successfully'}
            </p>
          </div>

          {!isGenerating && reportMarkdown && (
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          )}
        </div>

        {!isGenerating && companyName && industries && jurisdictions && frameworks && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Report Summary</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Company</p>
                <p className="text-gray-900 font-semibold">{companyName}</p>
              </div>
              {frameworks && frameworks.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Frameworks Applied</p>
                  <p className="text-gray-900 font-semibold">{frameworks.length} framework{frameworks.length > 1 ? 's' : ''}</p>
                </div>
              )}
              {industries && industries.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Industries</p>
                  <p className="text-gray-900 font-semibold">{industries.join(', ')}</p>
                </div>
              )}
              {jurisdictions && jurisdictions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Operating Jurisdictions</p>
                  <p className="text-gray-900 font-semibold">
                    {jurisdictions.slice(0, 3).join(', ')}
                    {jurisdictions.length > 3 && ` +${jurisdictions.length - 3} more`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-lg report-content overflow-hidden">
          <div className="p-8 sm:p-10 md:p-12">
            {!isGenerating && reportMarkdown && (
              <div className="mb-10 text-center pb-8 border-b-2 border-green-100">
                <img
                  src="/esgreport-logo-light.png"
                  alt="ESGReport Logo"
                  className="h-20 mx-auto mb-4"
                />
                <p className="text-xs text-gray-500 uppercase tracking-wide">AI-Generated ESG Report</p>
                <p className="text-sm text-gray-600 mt-1">Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            )}

            {isGenerating && !reportMarkdown && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="mb-8">
                    <img
                      src="/esgreport-traffic-lights.png"
                      alt="Generating Report"
                      className="h-8 mx-auto animate-pulse"
                      style={{ filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3))' }}
                    />
                  </div>
                  <p className="text-xl text-gray-700 font-semibold mb-2">Analyzing Your Data</p>
                  <p className="text-base text-gray-600 mb-1">Generating your comprehensive ESG report...</p>
                  <p className="text-sm text-gray-500 mt-4">This may take 30-60 seconds</p>
                </div>
              </div>
            )}

            {htmlContent && !isGenerating && (
              <>
                <div className="overflow-x-auto">
                <div
                  className="prose prose-lg max-w-none
                    [&_*]:box-border
                    prose-headings:text-gray-900 prose-headings:font-bold
                    [&_h1]:text-5xl [&_h1]:font-extrabold [&_h1]:mb-10 [&_h1]:mt-0 [&_h1]:pb-6 [&_h1]:border-b-4 [&_h1]:border-green-400 [&_h1]:leading-tight [&_h1]:text-gray-900
                    [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:text-green-700 [&_h2]:pb-4 [&_h2]:border-b-2 [&_h2]:border-green-200
                    [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-12 [&_h3]:mb-6 [&_h3]:text-gray-800
                    [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-10 [&_h4]:mb-5 [&_h4]:text-gray-700
                    [&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-8 [&_h5]:mb-4 [&_h5]:text-gray-700
                    [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-8 [&_p]:text-base [&_p]:mt-0
                    [&_ul]:my-8 [&_ul]:space-y-3 [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:pl-2 [&_li]:mb-3
                    [&_ol]:my-8 [&_ol]:space-y-3
                    [&_strong]:text-gray-900 [&_strong]:font-semibold
                    [&_a]:text-green-600 [&_a]:no-underline hover:[&_a]:underline [&_a]:font-medium
                    [&_table]:my-10 [&_table]:border-collapse [&_table]:w-full [&_table]:shadow-sm [&_table]:min-w-[600px]
                    [&_thead]:bg-gradient-to-r [&_thead]:from-green-50 [&_thead]:to-emerald-50
                    [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 sm:[&_th]:px-5 [&_th]:py-3 sm:[&_th]:py-4 [&_th]:text-left [&_th]:font-bold [&_th]:text-gray-900 [&_th]:text-xs sm:[&_th]:text-sm [&_th]:uppercase [&_th]:tracking-wide [&_th]:whitespace-nowrap
                    [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 sm:[&_td]:px-5 [&_td]:py-3 sm:[&_td]:py-4 [&_td]:text-gray-700 [&_td]:text-sm sm:[&_td]:text-base
                    [&_tr]:border-b [&_tr]:border-gray-200 [&_tr:nth-child(even)]:bg-gray-50
                    [&_blockquote]:border-l-4 [&_blockquote]:border-green-500 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-10 [&_blockquote]:bg-green-50 [&_blockquote]:py-6 [&_blockquote]:pr-6 [&_blockquote]:rounded-r
                  "
                  dangerouslySetInnerHTML={{ __html: firstHalf }}
                />
                </div>

                <UpsellCard />

                {secondHalf && (
                  <div className="overflow-x-auto">
                  <div
                    className="prose prose-lg max-w-none
                      [&_*]:box-border
                      prose-headings:text-gray-900 prose-headings:font-bold
                      [&_h1]:text-5xl [&_h1]:font-extrabold [&_h1]:mb-10 [&_h1]:mt-0 [&_h1]:pb-6 [&_h1]:border-b-4 [&_h1]:border-green-400 [&_h1]:leading-tight [&_h1]:text-gray-900
                      [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:text-green-700 [&_h2]:pb-4 [&_h2]:border-b-2 [&_h2]:border-green-200
                      [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-12 [&_h3]:mb-6 [&_h3]:text-gray-800
                      [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-10 [&_h4]:mb-5 [&_h4]:text-gray-700
                      [&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-8 [&_h5]:mb-4 [&_h5]:text-gray-700
                      [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-8 [&_p]:text-base [&_p]:mt-0
                      [&_ul]:my-8 [&_ul]:space-y-3 [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:pl-2 [&_li]:mb-3
                      [&_ol]:my-8 [&_ol]:space-y-3
                      [&_strong]:text-gray-900 [&_strong]:font-semibold
                      [&_a]:text-green-600 [&_a]:no-underline hover:[&_a]:underline [&_a]:font-medium
                      [&_table]:my-10 [&_table]:border-collapse [&_table]:w-full [&_table]:shadow-sm [&_table]:min-w-[600px]
                      [&_thead]:bg-gradient-to-r [&_thead]:from-green-50 [&_thead]:to-emerald-50
                      [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 sm:[&_th]:px-5 [&_th]:py-3 sm:[&_th]:py-4 [&_th]:text-left [&_th]:font-bold [&_th]:text-gray-900 [&_th]:text-xs sm:[&_th]:text-sm [&_th]:uppercase [&_th]:tracking-wide [&_th]:whitespace-nowrap
                      [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 sm:[&_td]:px-5 [&_td]:py-3 sm:[&_td]:py-4 [&_td]:text-gray-700 [&_td]:text-sm sm:[&_td]:text-base
                      [&_tr]:border-b [&_tr]:border-gray-200 [&_tr:nth-child(even)]:bg-gray-50
                      [&_blockquote]:border-l-4 [&_blockquote]:border-green-500 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-10 [&_blockquote]:bg-green-50 [&_blockquote]:py-6 [&_blockquote]:pr-6 [&_blockquote]:rounded-r
                    "
                    dangerouslySetInnerHTML={{ __html: secondHalf }}
                  />
                  </div>
                )}
              </>
            )}

            {isGenerating && htmlContent && (
              <div className="relative">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-6">
                      <img
                        src="/esgreport-traffic-lights.png"
                        alt="Generating Report"
                        className="h-8 mx-auto animate-pulse"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.4))' }}
                      />
                    </div>
                    <p className="text-lg text-gray-700 font-semibold mb-2">Generating Your Report</p>
                    <p className="text-sm text-gray-600">Please wait while we complete your analysis...</p>
                  </div>
                </div>
                <div className="opacity-30 pointer-events-none">
                  <div
                    className="prose prose-lg max-w-none
                      prose-headings:text-gray-900
                      prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h1:mt-12 prose-h1:pb-4 prose-h1:border-b-4 prose-h1:border-green-300
                      prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-green-700 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-green-200
                      prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-5 prose-h3:text-gray-800
                      prose-h4:text-xl prose-h4:font-semibold prose-h4:mt-8 prose-h4:mb-4 prose-h4:text-gray-700
                      prose-h5:text-lg prose-h5:font-medium prose-h5:mt-6 prose-h5:mb-3 prose-h5:text-gray-700
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                      prose-ul:my-6 prose-ul:space-y-3 prose-li:text-gray-700 prose-li:leading-relaxed prose-li:pl-2
                      prose-ol:my-6 prose-ol:space-y-3
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
                      prose-table:my-10 prose-table:border-collapse prose-table:w-full
                      prose-thead:bg-green-50
                      prose-th:border prose-th:border-gray-300 prose-th:px-5 prose-th:py-4 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
                      prose-td:border prose-td:border-gray-300 prose-td:px-5 prose-td:py-4 prose-td:text-gray-700
                      prose-tr:border-b prose-tr:border-gray-200
                      prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8
                    "
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </div>
            )}

            {!isGenerating && reportMarkdown && (
              <div className="mt-12 pt-8 border-t-2 border-gray-200">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-8 mb-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Get More ESG Insights</h3>
                    <p className="text-xl text-green-700 font-semibold">Your free report is ready!</p>
                    <p className="text-lg text-gray-600 mt-2">Want to go deeper?</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <a
                      href="/news/improving-esg-score"
                      className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
                    >
                      <span className="text-3xl mb-3 block">📚</span>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600">
                        Improve Your ESG Score
                      </h4>
                      <p className="text-gray-600">Read our comprehensive guide on improving your ESG performance</p>
                    </a>

                    <a
                      href="https://esgreport.co.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group"
                    >
                      <span className="text-3xl mb-3 block">🚀</span>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                        Full Platform Access
                      </h4>
                      <p className="text-gray-600">Upgrade for ongoing tracking, analytics, and expert support</p>
                    </a>

                    <a
                      href="https://greenregistry.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all group"
                    >
                      <span className="text-3xl mb-3 block">🌍</span>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600">
                        Publish on Green Registry
                      </h4>
                      <p className="text-gray-600">Showcase your ESG commitment to the world</p>
                    </a>

                    <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                      <span className="text-3xl mb-3 block">📩</span>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Weekly ESG Tips</h4>
                      <form className="space-y-3">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Subscribe
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download Report
                    </button>
                    <a
                      href="/resources"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                    >
                      Explore Resources
                    </a>
                    <a
                      href="https://esgreport.co.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-lg"
                    >
                      Upgrade Now
                    </a>
                  </div>
                </div>

                <UpsellCard />

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-8 mt-8 shadow-sm">
                  <h4 className="text-2xl font-bold text-blue-900 mb-4">
                    Want an In-Depth Report Customised to Your Business?
                  </h4>
                  <p className="text-base text-blue-800 mb-6 leading-relaxed">
                    For a comprehensive, fully tailored ESG report that goes beyond AI-generated content, get in touch with our expert consultants. We provide:
                  </p>
                  <ul className="space-y-3 text-base text-blue-800 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-xl">✓</span>
                      <span><strong>Detailed materiality assessments</strong> specific to your industry</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-xl">✓</span>
                      <span><strong>Competitor benchmarking</strong> and comprehensive gap analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-xl">✓</span>
                      <span><strong>Full regulatory compliance</strong> and audit-ready documentation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-xl">✓</span>
                      <span><strong>Actionable ESG strategies</strong> and improvement roadmaps</span>
                    </li>
                  </ul>
                  <div className="pt-6 border-t-2 border-blue-200">
                    <p className="text-base font-bold text-blue-900 mb-4">Contact our experts:</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href="mailto:experts@esgReportAI.com"
                        className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                      >
                        <Mail className="w-5 h-5" />
                        experts@esgReportAI.com
                      </a>
                      <a
                        href="tel:+441322879713"
                        className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-md"
                      >
                        <Phone className="w-5 h-5" />
                        +44 (01322) 879 713
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-8 mt-8 shadow-sm">
                  <h4 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span> Important Disclaimer
                  </h4>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    This ESG report has been generated using artificial intelligence based on the information you provided. While we strive for accuracy, this report should be considered a draft template and starting point for your ESG reporting. It is not a substitute for professional ESG consulting or audit services.
                    <br /><br />
                    All data, metrics, and statements should be reviewed, verified, and validated by qualified personnel before publication or submission to regulatory authorities.
                    <br /><br />
                    ESGReportAI and its affiliates accept no liability for decisions made based on this AI-generated content. For audit-ready, comprehensive ESG reports that meet regulatory standards and stakeholder expectations, please contact us about our professional consulting services.
                    <br /><br />
                    This is a demonstration version. Due diligence and professional review are required before use.
                  </p>
                </div>

                <div className="mt-10 text-center pb-8 border-t-2 border-gray-200 pt-8">
                  <img
                    src="/esgreport-logo-light.png"
                    alt="ESGReport Logo"
                    className="h-16 mx-auto mb-4"
                  />
                  <img
                    src="/esgReport-traffic lights-bars.png"
                    alt="ESG Traffic Lights"
                    className="h-4 mx-auto mb-3"
                  />
                  <p className="text-sm text-gray-600">
                    Copyright © 2026 esgReportAI.com All Rights Reserved.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Powered by AI | Generated on {new Date().toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
