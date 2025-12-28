/*
  # Add Default Site Settings

  This migration adds default values for:
  - Contact information (email, phone)
  - Social media links (LinkedIn, Twitter, Facebook)
  - SEO settings (meta title, description, keywords)
  
  These settings can be updated by admins through the admin dashboard.
*/

-- Insert contact information settings
INSERT INTO site_settings (key, value) VALUES
  ('contact_email', 'info@esgreport.ai'),
  ('contact_phone', '+44 20 1234 5678'),
  ('support_email', 'support@esgreport.ai')
ON CONFLICT (key) DO NOTHING;

-- Insert social media links
INSERT INTO site_settings (key, value) VALUES
  ('social_linkedin', 'https://linkedin.com/company/esgreport-ai'),
  ('social_twitter', 'https://twitter.com/esgreportai'),
  ('social_facebook', 'https://facebook.com/esgreportai')
ON CONFLICT (key) DO NOTHING;

-- Insert SEO settings
INSERT INTO site_settings (key, value) VALUES
  ('site_meta_title', 'ESG Report AI - Free AI-Powered ESG Reporting'),
  ('site_meta_description', 'Generate professional ESG reports for free using AI. Aligned with GRI, TCFD, SASB, EU CSRD and other global sustainability reporting standards.'),
  ('site_meta_keywords', 'ESG reporting, sustainability reporting, AI ESG, GRI, TCFD, SASB, EU CSRD, ESG templates, free ESG report')
ON CONFLICT (key) DO NOTHING;

-- Insert additional contact emails for different departments
INSERT INTO site_settings (key, value) VALUES
  ('enterprise_email', 'enterprise@esgreport.ai'),
  ('partnerships_email', 'partnerships@esgreport.ai')
ON CONFLICT (key) DO NOTHING;
