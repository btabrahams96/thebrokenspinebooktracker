import type { ReactNode } from 'react';

export default function CardGrid({ children }: { children: ReactNode }) {
  return <div className="tbs-card-grid">{children}</div>;
}
