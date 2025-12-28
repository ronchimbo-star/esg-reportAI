import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useFavicon() {
  useEffect(() => {
    let mounted = true;

    const loadFavicon = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        const dataPromise = supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'favicon_url')
          .maybeSingle();

        const { data } = await Promise.race([dataPromise, timeoutPromise]) as any;

        if (mounted && data?.value) {
          updateFavicon(data.value);
        }
      } catch (error) {
        console.error('Error loading favicon:', error);
      }
    };

    loadFavicon();

    return () => {
      mounted = false;
    };
  }, []);

  const updateFavicon = (url: string) => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) {
      link.href = url;
    }

    const appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
    if (appleLink) {
      appleLink.href = url;
    }
  };
}
