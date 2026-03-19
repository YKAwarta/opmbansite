import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp'],  // Moved out of experimental
  async headers() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    // Extract the hostname from the Supabase URL for use in CSP directives
    const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : ''
    const supabaseCspSource = supabaseHost ? `https://${supabaseHost}` : ''

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `connect-src 'self' ${supabaseCspSource} https://api.resend.com`,
              `img-src 'self' data: blob: ${supabaseCspSource}`,
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig