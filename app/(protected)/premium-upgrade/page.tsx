'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { subscribeEmail } from './action';

export default function PremiumUpgradePage() {
    const [submitted, setSubmitted] = useState(false);
    const [isPending, startTransition] = useTransition();


    const handleFormAction = (formData: FormData) => {
        startTransition(async () => {
            const result = await subscribeEmail(formData);

            if (result.success) {
                setSubmitted(true);
                toast.success('Successfully subscribed to the waitlist!');
            } else {
                toast.error(result.error || 'Failed to subscribe. Please try again.');
            }
        });
    };

    return (
        <>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-[#7C3AED]/10 text-[#7C3AED] mb-6 tracking-wide uppercase">
                Premium Plan
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                Supercharge Your Workflow
            </h1>

            <p className="text-base text-slate-500 max-w-md mx-auto mb-10">
                We are crafting a powerful set of features to help you and your team manage leave and operations with ultimate efficiency.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-12">
                <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] font-bold mb-3">
                        ✨
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Advanced Analytics</h3>
                    <p className="text-xs text-slate-400">Deep dive into team attendance trends, custom reporting, and predictive resource planning.</p>
                </div>

                <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] font-bold mb-3">
                        ⚡
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Automated Workflows</h3>
                    <p className="text-xs text-slate-400">Custom approval chains, smart notifications, and seamless calendar integrations.</p>
                </div>

                <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] font-bold mb-3">
                        🛡️
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">Enterprise Security</h3>
                    <p className="text-xs text-slate-400">SAML SSO, advanced audit logs, and granular role-based access control for your entire org.</p>
                </div>

                <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col justify-center items-center text-center p-6">
                    <span className="text-2xl mb-1">🤔</span>
                    <h3 className="font-semibold text-[#7C3AED] text-sm mb-1">What do you need?</h3>
                    <p className="text-xs text-slate-400">Your feedback shapes our roadmap. Tell us what features you want to see most!</p>
                </div>
            </div>

            <hr className="border-slate-100 mb-10" />

            <div className="max-w-md mx-auto">
                {!submitted ? (
                    <form action={handleFormAction} className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            name="email"
                            required
                            disabled={isPending}
                            placeholder="Enter your email for early access"
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#7C3AED] hover:bg-[#6D31D1] text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors shadow-sm whitespace-nowrap disabled:bg-[#7C3AED]/50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                        >
                            {isPending ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                'Notify Me'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium animate-fade-in">
                        🎉 Thanks! We'll keep you updated and reach out for your feedback soon.
                    </div>
                )}
            </div>
        </>
    );
}