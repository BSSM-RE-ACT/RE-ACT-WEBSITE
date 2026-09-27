const APEX_HOSTS = [import.meta.env.VITE_APEX_HOST || 'react.bssm.dev', 'localhost']

/**
 * "jm.react.bssm.dev" -> "jm", "jm.localhost" -> "jm" (dev), "react.bssm.dev" -> null
 */
export function getMemberSlug(): string | null {
  const host = window.location.hostname
  for (const apex of APEX_HOSTS) {
    if (host === apex) return null
    if (host.endsWith(`.${apex}`)) {
      return host.slice(0, host.length - apex.length - 1)
    }
  }
  return null
}
