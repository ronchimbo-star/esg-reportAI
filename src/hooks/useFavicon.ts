import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useFavicon() {
  useEffect(() => {
    loadFavicon();
  }, []);

  const loadFavicon = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'favicon_url')
        .maybeSingle();

      if (data?.value) {
        updateFavicon(data.value);
      }
    } catch (error) {
      console.error('Error loading favicon:', error);
    }
  };

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
