import { ReactNode } from 'react';
import SEO from './SEO';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  useGoogleAnalytics();

  return (
    <>
      <SEO />
      {children}
    </>
  );
}
