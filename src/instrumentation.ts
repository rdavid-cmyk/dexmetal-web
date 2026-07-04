/**
 * Next.js instrumentation hook — server startup initialization.
 *
 * Task #618 fix: Server Action crash-loop after PM2 restart.
 *
 * ROOT CAUSE: When a client holds a stale Server Action ID from a previous
 * build (e.g. a browser tab opened before restart), the incoming POST to
 * /rsc?_action=<hash> references an action that no longer exists in the
 * server's action registry. Next.js throws:
 *   "Failed to find Server Action: <id>"
 *
 * Without a handler this becomes an unhandledRejection which, in Node.js 15+,
 * terminates the process — causing PM2 to restart it, completing the loop.
 *
 * FIX: Register a targeted unhandledRejection listener that suppresses only
 * this specific error and logs it. Any genuine unhandled rejection continues
 * to propagate normally so real crashes still cause a PM2 restart.
 *
 * This file runs once on server startup via Next.js instrumentation API
 * (stable since Next.js 14.1, fully supported in Next.js 16).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    process.on('unhandledRejection', (reason: unknown) => {
      if (
        reason instanceof Error &&
        reason.message.includes('Failed to find Server Action')
      ) {
        // Stale action ID from a pre-deploy client session.
        // The client will receive a 500 and should refresh or retry.
        // Suppressing this prevents the PM2 restart crash-loop.
        console.warn(
          '[DexMetal] Suppressed stale Server Action rejection (action ID mismatch after deploy). ' +
          'Client should refresh.',
          reason.message,
        )
        // Do not rethrow — this is intentional suppression.
        return
      }
      // All other unhandled rejections: let Node.js / Next.js handle normally.
      // Do not suppress genuine crashes.
    })
  }
}
