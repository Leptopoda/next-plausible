import { NextConfig } from 'next'

export default function withPlausibleProxy(options: {
  /**
   * The host of your plausible instance.
   * This can be the site-specific script URL from your Plausible dashboard, or a raw host:
   * - https://plausible.io/js/pa-XXXXX.js
   * - https://plausible.io
   * - https://self-hosted-plasubile.example.com
   *
   * Defaults to `https://plausible.io`.
   */
  src?: string
  /**
   * The local path for the proxied API endpoint. Defaults to /api/event.
   */
  apiPath?: string
}) {
  return (nextConfig: NextConfig): NextConfig => {
    const apiPath = options.apiPath ?? '/api/event'

    const testDomain = process.env.NEXT_PLAUSIBLE_TEST_DOMAIN
    const host = testDomain ?? options.src ?? 'https://plausible.io'
    const apiDestination = new URL('/api/event', host).href

    const plausibleRewrites = [
      {
        source: apiPath,
        destination: apiDestination,
      },
    ]

    if (process.env.NEXT_PLAUSIBLE_DEBUG) {
      console.log('plausibleRewrites = ', plausibleRewrites)
    }

    return {
      ...nextConfig,
      env: {
        ...nextConfig.env,
        next_plausible_apiPath: apiPath,
      },
      rewrites: async () => {
        const rewrites = await nextConfig.rewrites?.()

        if (!rewrites) {
          return plausibleRewrites
        } else if (Array.isArray(rewrites)) {
          return rewrites.concat(plausibleRewrites)
        } else if (rewrites.afterFiles) {
          rewrites.afterFiles = rewrites.afterFiles.concat(plausibleRewrites)
          return rewrites
        } else {
          rewrites.afterFiles = plausibleRewrites
          return rewrites
        }
      },
    }
  }
}
