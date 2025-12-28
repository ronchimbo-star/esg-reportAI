import { ReactNode } from 'react';
import { useFavicon } from '../hooks/useFavicon';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  useFavicon();
  useGoogleAnalytics();

  return <>{children}</>;
}
