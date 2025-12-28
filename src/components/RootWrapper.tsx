import { ReactNode } from 'react';

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  return <>{children}</>;
}
