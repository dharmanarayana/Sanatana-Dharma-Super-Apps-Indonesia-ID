import fs from 'fs'
import path from 'path'

/**
 * Resolves a path to a data file in the public/data directory,
 * with fallback for production build artifacts.
 */
export const resolvePublicDataPath = (filename: string) => {
  const cwd = process.cwd()
  
  const possiblePaths = [
    // 1. Development / Standard root
    path.join(cwd, 'public', 'data', filename),
    // 2. Production Build Output (Nitro standard)
    path.join(cwd, '.output', 'public', 'data', filename),
    // 3. Fallback for some serverless environments where CWD is server/
    path.join(cwd, '..', 'public', 'data', filename),
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p
    }
  }

  return null
}
