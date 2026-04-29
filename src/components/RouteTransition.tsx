import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function RouteTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-fade-in">
      {children}
    </div>
  );
}
