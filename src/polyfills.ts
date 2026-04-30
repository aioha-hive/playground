// Reown's bitcoin adapter pulls in `readable-stream@2`, which reads
// `process.version.slice(...)` at module init. The Vite Node-polyfill `process`
// shim doesn't populate `version`, so we ensure it exists before any other
// import runs.
const proc = (globalThis as { process?: { version?: string; browser?: boolean } }).process
if (proc) {
  if (!proc.version) proc.version = 'v18.0.0'
  if (proc.browser === undefined) proc.browser = true
}

export {}
