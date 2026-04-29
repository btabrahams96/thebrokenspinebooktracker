import type { ReactNode } from 'react';

export default function Page({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pt-8 pb-24 sm:px-7 md:px-10 md:pt-12 md:pb-12 lg:px-14">
      {children}
    </div>
  );
}
