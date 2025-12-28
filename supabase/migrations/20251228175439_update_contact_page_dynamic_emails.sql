/*
  # Update Contact Page with Dynamic Email Placeholders

  Updates the contact page to use placeholders for emails that will be
  replaced dynamically with values from site_settings.
*/

UPDATE cms_pages
SET 
  content = '<div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
    
    <div class="prose prose-lg max-w-none">
      <p class="text-xl text-gray-600 mb-8">
        We''re here to help you succeed with your ESG reporting. Whether you have questions, need support, or want to explore partnership opportunities, our team is ready to assist.
      </p>

      <div class="grid md:grid-cols-2 gap-8 my-12">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">General Inquiries</h3>
          <p class="text-gray-700 mb-4">Questions about our platform or services?</p>
          <p class="text-green-600 font-medium"><a href="mailto:{{contact_email}}">{{contact_email}}</a></p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Enterprise Sales</h3>
          <p class="text-gray-700 mb-4">Interested in enterprise solutions?</p>
          <p class="text-green-600 font-medium"><a href="mailto:{{enterprise_email}}">{{enterprise_email}}</a></p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Technical Support</h3>
          <p class="text-gray-700 mb-4">Need help with our platform?</p>
          <p class="text-green-600 font-medium"><a href="mailto:{{support_email}}">{{support_email}}</a></p>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Partnerships</h3>
          <p class="text-gray-700 mb-4">Explore collaboration opportunities</p>
          <p class="text-green-600 font-medium"><a href="mailto:{{partnerships_email}}">{{partnerships_email}}</a></p>
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
  updated_at = NOW()
WHERE slug = 'contact';
