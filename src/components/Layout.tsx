import { AuthPanel } from './AuthPanel'
import { AiohaOps } from './AiohaOps'
import { MagiPanel } from './MagiPanel'
import { OutputConsole } from './OutputConsole'
import { DarkModeToggle } from './DarkModeToggle'
import { DryRunToggle, useDryRun } from './DryRunToggle'

export const Layout = () => {
  const [dryRun] = useDryRun()
  return (
    <div className="pb-10 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <h1 className="text-lg font-semibold tracking-tight">Aioha + Magi Playground</h1>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Live demo of <code>@aioha/aioha</code> &amp; <code>@aioha/magi</code>
          </span>
          <div className="flex-1" />
          <DryRunToggle />
          <DarkModeToggle />
        </div>
        {!dryRun && (
          <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 text-xs px-4 py-1.5 text-center border-b border-amber-200 dark:border-amber-800">
            Dry run is OFF — transactional operations will broadcast to mainnet.
          </div>
        )}
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6">
        <div className="space-y-6 min-w-0">
          <AuthPanel />
          <Section title="Aioha core operations" subtitle="Sign, encrypt, transfer, vote — anything the connected provider can do.">
            <AiohaOps />
          </Section>
          <Section title="Magi multi-chain" subtitle="Hive (via Aioha), Ethereum (via Viem/AppKit), Bitcoin (AppKit bip122), or view-only.">
            <MagiPanel />
          </Section>
        </div>
        <aside className="xl:sticky xl:top-[5.5rem] xl:self-start xl:max-h-[calc(100vh-6rem)] flex flex-col min-h-0">
          <OutputConsole />
        </aside>
      </main>

      {/* <footer className="max-w-[1400px] mx-auto px-4 py-6 text-xs text-gray-500 dark:text-gray-400">
        <a href="https://aioha.dev" className="hover:underline" target="_blank" rel="noreferrer">aioha.dev</a>
        <span className="mx-2">·</span>
        <a href="https://magi.eco" className="hover:underline" target="_blank" rel="noreferrer">magi.eco</a>
      </footer> */}
    </div>
  )
}

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    <header className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
      <h2 className="font-semibold">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
    </header>
    <div className="p-5">{children}</div>
  </section>
)
