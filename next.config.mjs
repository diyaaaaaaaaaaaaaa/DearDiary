import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js'
import { build } from 'velite'

/**
 * Velite compiles /content (MDX + frontmatter) into typed data in .velite/.
 *
 * We decide when to run it from Next's `phase` argument, NOT process.argv:
 * in `next dev`, Next loads this file inside a child process whose argv
 * doesn't contain "dev", so an argv check silently skips Velite.
 *
 * VELITE_STARTED guards against running twice if Next evaluates this file
 * more than once (it can, across processes that inherit the environment).
 */
async function runVelite(phase) {
  if (process.env.VELITE_STARTED) return
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  const isBuild = phase === PHASE_PRODUCTION_BUILD
  if (!isDev && !isBuild) return
  process.env.VELITE_STARTED = '1'
  await build({ watch: isDev, clean: !isDev })
}

export default async function config(phase) {
  await runVelite(phase)

  /** @type {import('next').NextConfig} */
  return {
    // Pin the project root. Without this Next walks upward, finds a stray
    // package-lock.json in your home folder, and guesses the wrong root.
    turbopack: { root: import.meta.dirname },
  }
}
