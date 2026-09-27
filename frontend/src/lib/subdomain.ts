const APEX_HOST = import.meta.env.VITE_APEX_HOST || 'react.bssm.dev'

/**
 * Member pages use a hyphen, not a dot, so the hostname stays one DNS level
 * under the root domain (e.g. "ihj-react.bssm.dev", not "ihj.react.bssm.dev") —
 * Cloudflare's free wildcard certificate only covers one subdomain level.
 *
 * "ihj-react.bssm.dev" -> "ihj", "jm.localhost" -> "jm" (local dev), "react.bssm.dev" -> null
 */
export function getMemberSlug(): string | null {
  const host = window.location.hostname

  if (host === 'localhost') return null
  if (host.endsWith('.localhost')) {
    return host.slice(0, host.length - '.localhost'.length)
  }

  if (host === APEX_HOST) return null
  const suffix = `-${APEX_HOST}`
  if (host.endsWith(suffix)) {
    return host.slice(0, host.length - suffix.length)
  }
  return null
}
