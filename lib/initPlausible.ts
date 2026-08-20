import { init, type PlausibleConfig } from '@plausible-analytics/tracker'

interface InitPlausibleConfig extends PlausibleConfig {
  /**
   * If enabled (disabled by default), the script will set `window.plausible` after `init` is called.
   * This is used by the verifier to detect if the script is loaded from npm package.
   */
  bindToWindow?: boolean
}

/**
 * Initializes the Plausible Analytics tracker.
 *
 * Wraps `@plausible-analytics/tracker`'s `init` and automatically sets the tracker
 * endpoint when the proxy is enabled by {@link withPlausibleProxy}.
 *
 * Automatic windo binding is disabled by default. Use `bindToWindow` if you
 * need `window.plausible` to be available.
 *
 * @param config - Plausible tracker configuration options.
 * @returns void
 */
export function initPlausible({
  endpoint,
  bindToWindow,
  ...config
}: InitPlausibleConfig): ReturnType<typeof init> {
  init({
    endpoint: endpoint ?? process.env.next_plausible_apiPath,
    bindToWindow: bindToWindow ?? false,
    ...config,
  })
}
