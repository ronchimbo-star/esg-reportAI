import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGoogleAnalytics() {
  useEffect(() => {
    loadGoogleAnalytics();
  }, []);

  const loadGoogleAnalytics = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'google_analytics_id')
        .maybeSingle();

      if (data?.value && data.value.trim()) {
        const measurementId = data.value.trim();
        injectGoogleAnalytics(measurementId);
      }
    } catch (error) {
      console.error('Error loading Google Analytics:', error);
    }
  };

  const injectGoogleAnalytics = (measurementId: string) => {
    if (typeof window === 'undefined') return;

    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
    if (existingScript) return;

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);
  };
}
