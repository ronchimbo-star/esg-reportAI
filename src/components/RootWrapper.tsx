import { ReactNode } from 'react';
import SEO from './SEO';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import { usePageViewTracking } from '../hooks/usePageViewTracking';

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  useGoogleAnalytics();
  usePageViewTracking();

  return (
    <>
      <SEO />
      {children}
    </>
  );
}
