'use client';

import React from 'react';
import Link from 'next/link';

export default function PremiumUpgradeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="w-full max-w-2xl mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-[#7C3AED] hover:underline flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <main className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-[#7C3AED]/10 to-[#F4EEFC] blur-3xl -z-10 rounded-full" />
        {children}
      </main>
    </div>
  );
}
