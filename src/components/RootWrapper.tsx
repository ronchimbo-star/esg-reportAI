import { ReactNode } from 'react';
import SEO from './SEO';

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  return (
    <>
      <SEO />
      {children}
    </>
  );
}
