import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

let sessionId: string | null = null;

function getOrCreateSessionId(): string {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
}

export function usePageViewTracking() {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  const trackPageView = async () => {
    try {
      const pageUrl = window.location.href;
      const pageTitle = document.title;
      const referrer = document.referrer;
      const userAgent = navigator.userAgent;
      const session = getOrCreateSessionId();

      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('page_views').insert({
        page_url: pageUrl,
        page_title: pageTitle,
        referrer: referrer || null,
        user_agent: userAgent,
        ip_address: null,
        session_id: session,
        user_id: user?.id || null,
      });
    } catch (error) {
      // Silently fail - page view tracking is non-critical
    }
  };
}
