/*
  # Update CMS Content with Detailed Pages

  This migration updates existing static pages with comprehensive, SEO-optimized content
  and adds the contact page that was missing.
  
  Updates:
  - About Us page with company mission and values
  - Privacy Policy with GDPR compliance details
  - Terms of Service with legal protections
  - Cookie Policy with detailed cookie management
  - Adds Contact page with support information
*/

-- Update About Us page
UPDATE cms_pages
SET 
  title = 'About ESG Report - AI-Powered Sustainability Reporting',
  meta_description = 'Learn how ESG Report uses advanced AI technology to help organizations create comprehensive, compliant ESG reports aligned with global sustainability frameworks.',
  meta_keywords = ARRAY['about esg report', 'ai esg reporting', 'sustainability reporting platform', 'esg compliance technology'],
  og_title = 'About ESG Report - Leading AI-Powered ESG Reporting Platform',
  og_description = 'Discover how ESG Report revolutionizes sustainability reporting with AI technology, making ESG compliance accessible and efficient for organizations worldwide.',
  og_image = '/esgreport logo-light-back.png',
  content = '<div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-gray-900 mb-6">About ESG Report</h1>
    
    <div class="prose prose-lg max-w-none">
      <p class="text-xl text-gray-600 mb-8">
        ESG Report is a cutting-edge platform that leverages artificial intelligence to transform how organizations approach Environmental, Social, and Governance (ESG) reporting.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-4">Our Mission</h2>
      <p class="text-gray-700 mb-6">
        We believe that sustainability reporting should be accessible to every organization, regardless of size or resources. Our mission is to democratize ESG reporting by providing intelligent, automated solutions that make compliance simple, accurate, and actionable.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-4">Why ESG Report?</h2>
      <div class="grid md:grid-cols-2 gap-6 my-8">
        <div class="bg-green-50 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-green-900 mb-3">AI-Powered Intelligence</h3>
          <p class="text-gray-700">Our advanced AI technology understands global ESG frameworks and generates reports aligned with GRI, TCFD, SASB, EU CSRD, and other major standards.</p>
        </div>
        <div class="bg-blue-50 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-blue-900 mb-3">Time & Cost Savings</h3>
          <p class="text-gray-700">What traditionally takes weeks or months can now be accomplished in minutes, reducing consulting costs and internal resource requirements.</p>
        </div>
        <div class="bg-purple-50 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-purple-900 mb-3">Global Compliance</h3>
          <p class="text-gray-700">Stay compliant with evolving regulations across multiple jurisdictions, from EU directives to US SEC requirements.</p>
        </div>
        <div class="bg-orange-50 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-orange-900 mb-3">Industry Expertise</h3>
          <p class="text-gray-700">Our platform understands industry-specific requirements and tailors reports to your sector''s unique ESG challenges.</p>
        </div>
      </div>

      <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-4">Our Technology</h2>
      <p class="text-gray-700 mb-4">
        Built on state-of-the-art natural language processing and machine learning models, ESG Report analyzes your organization''s data and generates comprehensive reports that meet international standards. Our AI continuously learns from regulatory updates, ensuring your reports stay current with the latest requirements.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-4">Who We Serve</h2>
      <p class="text-gray-700 mb-4">
        From startups to Fortune 500 companies, organizations across industries trust ESG Report for their sustainability reporting needs:
      </p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Small and medium-sized enterprises entering ESG reporting for the first time</li>
        <li>Large corporations managing complex multi-jurisdictional requirements</li>
        <li>Consulting firms serving multiple clients</li>
        <li>Investment firms conducting ESG due diligence</li>
        <li>Non-profits and NGOs reporting on impact</li>
      </ul>

      <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-4">Our Commitment</h2>
      <p class="text-gray-700 mb-6">
        We''re committed to supporting the global transition to sustainable business practices. By making ESG reporting more accessible and efficient, we enable organizations to focus on what matters most: implementing meaningful sustainability initiatives and creating positive impact.
      </p>

      <div class="bg-gray-50 p-8 rounded-lg my-8 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your ESG Reporting?</h3>
        <p class="text-gray-700 mb-6">Join thousands of organizations using AI-powered ESG reporting.</p>
        <a href="/" class="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          Get Started Free
        </a>
      </div>
    </div>
  </div>',
  is_published = true,
  updated_at = NOW()
WHERE slug = 'about';

-- Insert Contact page (if it doesn't exist)
INSERT INTO cms_pages (slug, title, meta_description, meta_keywords, og_title, og_description, og_image, content, is_published)
VALUES (
  'contact',
  'Contact Us - ESG Report Support & Inquiries',
  'Get in touch with ESG Report for support, partnerships, or inquiries about our AI-powered ESG reporting platform. We''re here to help you succeed.',
  ARRAY['contact esg report', 'esg support', 'sustainability reporting help', 'enterprise inquiries'],
  'Contact ESG Report - We''re Here to Help',
  'Reach out to our team for support, partnership opportunities, or to learn more about how ESG Report can transform your sustainability reporting.',
  '/esgreport logo-light-back.png',
  '<div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
    
    <div class="prose prose-lg max-w-none">
      <p class="text-xl text-gray-600 mb-8">
        We''re here to help you succeed with your ESG reporting. Whether you have questions, need support, or want to explore partnership opportunities, our team is ready to assist.
      </p>

      <div class="grid md:grid-cols-2 gap-8 my-12">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">General Inquiries</h3>
          <p class="text-gray-700 mb-4">Questions about our platform or services?</p>
          <p class="text-green-600 font-medium">info@esgreport.ai</p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Enterprise Sales</h3>
          <p class="text-gray-700 mb-4">Interested in enterprise solutions?</p>
          <p class="text-green-600 font-medium">enterprise@esgreport.ai</p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Technical Support</h3>
          <p class="text-gray-700 mb-4">Need help with our platform?</p>
          <p class="text-green-600 font-medium">support@esgreport.ai</p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Partnerships</h3>
          <p class="text-gray-700 mb-4">Explore collaboration opportunities</p>
          <p class="text-green-600 font-medium">partnerships@esgreport.ai</p>
        </div>
      </div>

      <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-4">Frequently Asked Questions</h2>
      
      <div class="space-y-6 my-8">
        <div class="border-l-4 border-green-600 pl-4">
          <h4 class="font-bold text-gray-900 mb-2">How quickly can I generate a report?</h4>
          <p class="text-gray-700">Most reports are generated within minutes. The exact time depends on the complexity and scope of your requirements.</p>
        </div>

        <div class="border-l-4 border-green-600 pl-4">
          <h4 class="font-bold text-gray-900 mb-2">What frameworks do you support?</h4>
          <p class="text-gray-700">We support all major ESG frameworks including GRI, TCFD, SASB, EU CSRD, CDP, and more. Our AI adapts to your specific framework requirements.</p>
        </div>

        <div class="border-l-4 border-green-600 pl-4">
          <h4 class="font-bold text-gray-900 mb-2">Is my data secure?</h4>
          <p class="text-gray-700">Yes. We use enterprise-grade encryption and security measures. Your data is never shared with third parties.</p>
        </div>

        <div class="border-l-4 border-green-600 pl-4">
          <h4 class="font-bold text-gray-900 mb-2">Can I customize the reports?</h4>
          <p class="text-gray-700">Absolutely. Our platform generates comprehensive reports that you can edit and customize to match your brand and specific needs.</p>
        </div>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-lg p-8 my-12">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Professional Services</h3>
        <p class="text-gray-700 mb-4">
          Need hands-on assistance with your ESG reporting strategy? Our team of sustainability experts offers consulting services including:
        </p>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>ESG strategy development</li>
          <li>Materiality assessments</li>
          <li>Framework selection guidance</li>
          <li>Stakeholder engagement support</li>
          <li>Report verification and assurance</li>
        </ul>
      </div>

      <div class="text-center my-12">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
        <p class="text-gray-700 mb-6">Try our platform today and experience the future of ESG reporting.</p>
        <a href="/" class="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          Generate Your First Report
        </a>
      </div>
    </div>
  </div>',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Update Privacy Policy
UPDATE cms_pages
SET 
  title = 'Privacy Policy - ESG Report Data Protection & Privacy',
  meta_description = 'ESG Report privacy policy detailing how we collect, use, and protect your data. We are committed to GDPR compliance and protecting your privacy.',
  content = '<div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
    
    <div class="prose prose-lg max-w-none">
      <p class="text-gray-600 mb-8">
        <strong>Last Updated:</strong> December 28, 2024
      </p>

      <p class="text-gray-700 mb-6">
        At ESG Report, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered ESG reporting platform.
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Information We Collect</h2>
      
      <h3 class="text-xl font-bold text-gray-900 mt-8 mb-3">1.1 Information You Provide</h3>
      <p class="text-gray-700 mb-4">We collect information you provide directly, including:</p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li><strong>Account Information:</strong> Name, email address, company name, and contact details</li>
        <li><strong>ESG Data:</strong> Company data, sustainability metrics, and information you input for report generation</li>
        <li><strong>Payment Information:</strong> Billing details processed securely through our payment providers</li>
        <li><strong>Communications:</strong> Messages, feedback, and support inquiries</li>
      </ul>

      <h3 class="text-xl font-bold text-gray-900 mt-8 mb-3">1.2 Automatically Collected Information</h3>
      <p class="text-gray-700 mb-4">When you use our platform, we automatically collect:</p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li><strong>Usage Data:</strong> Features used, reports generated, time spent on platform</li>
        <li><strong>Device Information:</strong> Browser type, IP address, operating system</li>
        <li><strong>Cookies:</strong> Small files stored on your device (see our Cookie Policy)</li>
      </ul>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">2. How We Use Your Information</h2>
      <p class="text-gray-700 mb-4">We use collected information to:</p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Provide, maintain, and improve our ESG reporting services</li>
        <li>Generate AI-powered ESG reports based on your input</li>
        <li>Process transactions and send related information</li>
        <li>Respond to your comments, questions, and support requests</li>
        <li>Send technical notices, updates, and security alerts</li>
        <li>Monitor and analyze usage patterns to improve user experience</li>
        <li>Detect and prevent fraud, abuse, and security incidents</li>
        <li>Comply with legal obligations and enforce our terms</li>
      </ul>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Data Security</h2>
      <p class="text-gray-700 mb-4">
        We implement industry-standard security measures to protect your data:
      </p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li><strong>Encryption:</strong> All data transmitted is encrypted using TLS/SSL protocols</li>
        <li><strong>Access Controls:</strong> Strict access limitations to authorized personnel only</li>
        <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
        <li><strong>Secure Infrastructure:</strong> Enterprise-grade cloud hosting with redundancy</li>
        <li><strong>Data Backup:</strong> Regular backups to prevent data loss</li>
      </ul>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
        <p class="text-blue-900">
          <strong>Important:</strong> While we implement robust security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to protecting your information.
        </p>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Your Rights (GDPR)</h2>
      <p class="text-gray-700 mb-4">If you are in the European Economic Area, you have the right to:</p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li><strong>Access:</strong> Request copies of your personal data</li>
        <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
        <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
        <li><strong>Restriction:</strong> Limit how we use your data</li>
        <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
        <li><strong>Objection:</strong> Object to processing of your data</li>
        <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
      </ul>
      <p class="text-gray-700 mb-6">
        To exercise these rights, contact us at <a href="mailto:privacy@esgreport.ai" class="text-green-600 hover:underline">privacy@esgreport.ai</a>
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Contact Us</h2>
      <p class="text-gray-700 mb-4">
        For privacy-related questions or concerns:
      </p>
      <div class="bg-gray-50 p-6 rounded-lg">
        <p class="text-gray-900"><strong>ESG Report Privacy Team</strong></p>
        <p class="text-gray-700">Email: <a href="mailto:privacy@esgreport.ai" class="text-green-600 hover:underline">privacy@esgreport.ai</a></p>
        <p class="text-gray-700">Subject: Privacy Inquiry</p>
      </div>
    </div>
  </div>',
  is_published = true,
  updated_at = NOW()
WHERE slug = 'privacy-policy';

-- Update Terms of Service
UPDATE cms_pages
SET
  title = 'Terms of Service - ESG Report User Agreement',
  meta_description = 'Terms of Service for ESG Report AI-powered ESG reporting platform. Read our terms governing the use of our services.',
  content = '<div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
    
    <div class="prose prose-lg max-w-none">
      <p class="text-gray-600 mb-8">
        <strong>Last Updated:</strong> December 28, 2024
      </p>

      <p class="text-gray-700 mb-6">
        Welcome to ESG Report. These Terms of Service govern your access to and use of our AI-powered ESG reporting platform. By accessing or using our services, you agree to be bound by these Terms.
      </p>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8">
        <p class="text-yellow-900">
          <strong>Important:</strong> Please read these Terms carefully. They contain important information about your rights and obligations, including limitations of liability and dispute resolution provisions.
        </p>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Acceptance of Terms</h2>
      <p class="text-gray-700 mb-6">
        By creating an account or using ESG Report, you acknowledge that you have read, understood, and agree to these Terms and our Privacy Policy. If you do not agree, you may not use our services.
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Description of Service</h2>
      <p class="text-gray-700 mb-4">
        ESG Report provides an AI-powered platform for generating Environmental, Social, and Governance reports. Our services include:
      </p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Automated ESG report generation based on user input</li>
        <li>Compliance with multiple global ESG frameworks (GRI, TCFD, SASB, EU CSRD, etc.)</li>
        <li>Customizable templates for various industries and jurisdictions</li>
        <li>Document export and sharing capabilities</li>
        <li>Additional features as we develop them</li>
      </ul>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Acceptable Use</h2>
      <p class="text-gray-700 mb-4">You agree NOT to:</p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
        <li>Use the service for any illegal or unauthorized purpose</li>
        <li>Violate any laws in your jurisdiction</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Interfere with or disrupt the service or servers</li>
        <li>Reverse engineer, decompile, or disassemble any part of the service</li>
        <li>Use automated systems (bots, scrapers) without permission</li>
        <li>Share, resell, or redistribute our service without authorization</li>
      </ul>

      <div class="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
        <h3 class="text-xl font-bold text-red-900 mb-3">No Professional Advice</h3>
        <p class="text-red-900 mb-4">
          <strong>ESG Report provides technology tools, not professional consulting, legal, or financial advice.</strong> Generated reports are AI-created based on user input and should be reviewed by qualified professionals before use.
        </p>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Contact Us</h2>
      <p class="text-gray-700 mb-4">
        Questions about these Terms? Contact us:
      </p>
      <div class="bg-gray-50 p-6 rounded-lg mb-8">
        <p class="text-gray-900"><strong>ESG Report Legal Team</strong></p>
        <p class="text-gray-700">Email: <a href="mailto:legal@esgreport.ai" class="text-green-600 hover:underline">legal@esgreport.ai</a></p>
      </div>
    </div>
  </div>',
  is_published = true,
  updated_at = NOW()
WHERE slug = 'terms-of-service';

-- Update Cookie Policy
UPDATE cms_pages
SET
  title = 'Cookie Policy - ESG Report Cookie Usage',
  meta_description = 'Learn about how ESG Report uses cookies and similar technologies to provide and improve our services. Manage your cookie preferences.',
  content = '<div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
    
    <div class="prose prose-lg max-w-none">
      <p class="text-gray-600 mb-8">
        <strong>Last Updated:</strong> December 28, 2024
      </p>

      <p class="text-gray-700 mb-6">
        This Cookie Policy explains how ESG Report uses cookies and similar technologies to recognize you when you visit our platform.
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">What Are Cookies?</h2>
      <p class="text-gray-700 mb-6">
        Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and make your browsing experience more efficient.
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">Types of Cookies We Use</h2>

      <div class="space-y-8 my-8">
        <div class="border-l-4 border-green-600 pl-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3">1. Essential Cookies</h3>
          <p class="text-gray-700 mb-2"><strong>Purpose:</strong> Necessary for the platform to function properly.</p>
          <p class="text-gray-700 mb-2"><strong>Examples:</strong> Authentication, security, session management</p>
        </div>

        <div class="border-l-4 border-blue-600 pl-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3">2. Analytics Cookies</h3>
          <p class="text-gray-700 mb-2"><strong>Purpose:</strong> Help us understand how visitors use our platform.</p>
          <p class="text-gray-700"><strong>Examples:</strong> Google Analytics, usage tracking, performance monitoring</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">Your Cookie Choices</h2>
      <p class="text-gray-700 mb-4">
        Most browsers allow you to control cookies through settings. You can block all cookies, accept only first-party cookies, or delete cookies after each session.
      </p>

      <h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4">Contact Us</h2>
      <p class="text-gray-700 mb-4">Questions about our cookie practices?</p>
      <div class="bg-gray-50 p-6 rounded-lg">
        <p class="text-gray-900"><strong>ESG Report Cookie Support</strong></p>
        <p class="text-gray-700">Email: <a href="mailto:privacy@esgreport.ai" class="text-green-600 hover:underline">privacy@esgreport.ai</a></p>
      </div>
    </div>
  </div>',
  is_published = true,
  updated_at = NOW()
WHERE slug = 'cookie-policy';
