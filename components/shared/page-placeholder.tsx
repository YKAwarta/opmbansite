'use client'

import Link from 'next/link'

export function PagePlaceholder({ pageName }: { pageName: string }) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-md">
                {/* Blinking Logo */}
                <div className="mb-8 animate-pulse">
                    <img
                        src="/club_logo_email.png"
                        alt="OPM/BAN Club Logo"
                        className="w-32 h-32 mx-auto opacity-60"
                    />
                </div>

                {/* Message */}
                <p className="text-gray-600 text-lg">
                    This page is not yet available. Learn more on our{' '}
                    <Link
                        href="https://www.linkedin.com/company/the-opm-ban-club/"
                        target="_blank"
                        className="text-[#093968] font-semibold hover:underline"
                    >
                        LinkedIn
                    </Link>
                </p>
            </div>
        </div>
    )
}