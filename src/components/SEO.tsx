import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function SEO({ title, description, keywords }: SEOProps) {
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['site_meta_title', 'site_meta_description', 'site_meta_keywords']);

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach(item => {
        settingsMap[item.key] = item.value;
      });
      setSiteSettings(settingsMap);
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  useEffect(() => {
    const pageTitle = title || siteSettings.site_meta_title || 'ESG Report AI';
    const pageDescription = description || siteSettings.site_meta_description || 'Generate professional ESG reports using AI';
    const pageKeywords = keywords || siteSettings.site_meta_keywords || 'ESG, sustainability, reporting';

    document.title = pageTitle;

    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateOGTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', pageKeywords);

    updateOGTag('og:title', pageTitle);
    updateOGTag('og:description', pageDescription);
    updateOGTag('og:type', 'website');
  }, [title, description, keywords, siteSettings]);

  return null;
}
